import { TOKEN_TYPE } from "../types/token.type";

export interface Decoded {
  id: string;
  email: string;
  type: TOKEN_TYPE;
  iat: number;
  exp: number;
}
