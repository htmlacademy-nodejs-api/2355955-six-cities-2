import { LoginUserDto } from '../dto/login-user.dto.js';
import { UserEntity } from '../user.entity.js';

export interface AuthService {
  authenticate(user: UserEntity): Promise<string>;
  verify(dto: LoginUserDto): Promise<UserEntity>;
}
