import { IPromiseResponse } from '@/common/response_service/interface/response.interface';

import { UpdateUserDto } from '../dto/update_user.dto';
import { IUpdateUserResponse } from './user.common.interfaces';
import type { User } from '../../domain/user.domain';

export interface IUserController {
  updateUser(
    updateUserDto: UpdateUserDto,
    user: User,
  ): IPromiseResponse<IUpdateUserResponse>;
  getMe(user: User): Promise<User>;
}
