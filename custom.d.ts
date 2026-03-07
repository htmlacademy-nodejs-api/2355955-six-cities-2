import 'express';
import { TokenPayload } from './shared/modules/user/auth/types/token-payload.ts';
declare module 'express-serve-static-core' {
  export interface Request {
    tokenPayload: TokenPayload;
  }
}
