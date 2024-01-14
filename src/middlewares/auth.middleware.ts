import jwt from "jsonwebtoken";
import { serverError } from "../utils/serverError";
import { Request, Response, NextFunction } from "express";
import { Decoded } from "../interfaces/jwt.interface";
import { CustomRequest } from "../interfaces/request.interface";

const authMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.headers.authorization) {
    const [bearerToken, token] = req.headers.authorization.split(" ");

    if (bearerToken === "Bearer") {
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET_KEY as string,
        ) as Decoded;
        if (decoded.type !== "ACCESS") {
          next(serverError(401, "Invalid token type"));
        }
        req.email = decoded.email;
        req.userId = decoded.id;
        return next();
      } catch (err) {
        next(serverError(401, "Invalid jwt token"));
      }
    }
    next(serverError(401, "Invalid bearer token"));
  }
  next(serverError(400, "Authorization header is not present"));
};

export default authMiddleware;
