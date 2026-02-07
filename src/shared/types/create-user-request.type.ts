import { Request } from 'express';
import { RequestParams } from '../libs/rest/types/request.params.type.js';
import { ResponseBody } from '../libs/rest/types/response-body.type.js';
import { CreateUserDto } from '../modules/user/dto/index.js';

export type CreateUserRequest = Request<RequestParams, ResponseBody , CreateUserDto>;

