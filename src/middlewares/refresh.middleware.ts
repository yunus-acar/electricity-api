import jwt from "jsonwebtoken";
import { serverError } from "../utils/serverError";
import { Request, Response, NextFunction } from "express";
import { Decoded } from "../interfaces/jwt.interface";
import { CustomRequest } from "../interfaces/request.interface";

const refreshMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.body.refresh) {
    const token = req.body.refresh;
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY as string,
      ) as Decoded;

      if (decoded.type !== "REFRESH") {
        next(serverError(401, "Invalid token type"));
      }

      req.email = decoded.email;
      req.userId = decoded.id;
      return next();
    } catch (err) {
      next(serverError(401, "Invalid jwt token"));
    }
  }
  next(serverError(400, "Refresh token is not present"));
};

export default refreshMiddleware;
