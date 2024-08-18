import { NutrigeneticParameter } from '@/modules/nutritionalRecommendation/domain/domain';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'invalid email address.' })
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  externalId?: string;

  @IsOptional()
  @IsEnum(NutrigeneticParameter, { each: true })
  nutrigeneticParameters?: NutrigeneticParameter[];
}
