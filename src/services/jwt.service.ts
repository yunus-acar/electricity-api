import jwt from "jsonwebtoken";
import { User } from "@prisma/client";

class ITokenService {
  private jwt: typeof jwt;

  constructor(jwtInstance: typeof jwt) {
    this.jwt = jwtInstance;
  }

  generateToken(user: User) {
    const access = jwt.sign(
      {
        id: user.id,
        email: user.email,
        type: "ACCESS",
      },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRES as string),
      },
    );
    const refresh = jwt.sign(
      {
        id: user.id,
        email: user.email,
        type: "REFRESH",
      },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRES as string),
      },
    );
    return { access, refresh };
  }
}

const TokenService = new ITokenService(jwt);
export default TokenService;
