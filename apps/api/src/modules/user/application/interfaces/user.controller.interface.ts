import {
  IPromiseResponse,
  IResponse,
} from '@/common/response_service/interface/response.interface';

import { UpdateUserDto } from '../dto/update_user.dto';
import { IUpdateUserResponse } from './user.common.interfaces';
import { User } from '../../domain/user.domain';

export interface IUserController {
  updateUser(
    updateUserDto: UpdateUserDto,
    data: IResponse<User>,
  ): IPromiseResponse<IUpdateUserResponse>;
  getMe(data: IResponse<User>): IPromiseResponse<User>;
}
