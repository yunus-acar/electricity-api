import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import TokenService from "../services/jwt.service";
import redisService from "../services/redis.service";
import { serverError } from "../utils/serverError";
import prisma from "../utils/prisma";
import { CustomRequest } from "../interfaces/request.interface";

class UserController {
  public async signUp(req: Request, res: Response) {
    const { email, password, companyName } = req.body;

    if (!email || !password || !companyName) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    try {
      const userExits = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (userExits) {
        return res.status(409).json({
          message: "User already exists",
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      await prisma.user.create({
        data: {
          email,
          password: passwordHash,
          company: {
            create: {
              name: companyName,
            },
          },
        },
      });

      return res.status(201).json({
        message: "User created",
      });
    } catch (e: any) {
      return res.status(500).json({
        message: "Something went wrong",
        error: e.message,
      });
    }
  }

  async signIn(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const userExits = await prisma.user.findUnique({
        where: {
          email,
        },
        include: {
          company: true,
        },
      });
      if (!userExits) {
        return res.status(400).json({
          message: "User does not exist",
        });
      }
      const validPassword = await bcrypt.compare(password, userExits.password);
      if (!validPassword) {
        return res.status(400).json({
          message: "Invalid password",
        });
      }

      const { refresh, access } = TokenService.generateToken(userExits);

      await redisService.set(
        refresh,
        userExits.id,
        parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRES as string),
      );

      res.status(200).json({
        message: "User logged in",
        refresh,
        access,
      });
    } catch (e: any) {
      return res.status(500).json({
        message: "Something went wrong",
        error: e.message,
      });
    }
  }

  async refreshToken(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const { refresh } = req.body;
      const value = await redisService.get(refresh);
      if (!value) {
        return res.status(401).json({
          message: "Refresh token was already used",
        });
      }
      const user = await prisma.user.findUnique({
        where: {
          id: req.userId,
        },
      });

      if (!user) {
        return res.status(401).json({
          message: "User does not exist",
        });
      }
      const { access } = TokenService.generateToken(user);
      return res.status(200).json({
        access,
      });
    } catch (e) {
      next(serverError(500, "Something went wrong"));
    }
  }

  async signOut(req: Request, res: Response, next: NextFunction) {
    try {
      const { refresh } = req.body;
      await redisService.del(refresh);
      return res.status(200).json({
        message: "User logged out",
      });
    } catch (e) {
      next(serverError(500, "Something went wrong"));
    }
  }

  async me(req: CustomRequest, res: Response, next: NextFunction) {
    if (!req.userId) return next(serverError(401, "Unauthorized"));
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: req.userId,
        },
        include: {
          company: true,
        },
      });
      if (!user) {
        return res.status(401).json({
          message: "User does not exist",
        });
      }
      return res.status(200).json({
        user,
      });
    } catch (e) {
      next(serverError(500, "Something went wrong"));
    }
  }
}

export default new UserController();
