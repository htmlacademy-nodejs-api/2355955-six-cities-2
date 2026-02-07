import { Request } from 'express';
import { RequestParams } from '../libs/rest/types/request.params.type.js';
import { ResponseBody } from '../libs/rest/types/response-body.type.js';
import { LoginUserDto } from '../modules/user/dto/login-user.dto.js';

export type LoginUserRequest = Request<RequestParams , ResponseBody, LoginUserDto>;
