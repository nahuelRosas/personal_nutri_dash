import { EntitySchema } from 'typeorm';

import { baseColumnSchemas } from '@/common/base/infrastructure/persistence/base.schema';

import { User } from '../../domain/user.domain';

export const UserSchema = new EntitySchema<User>({
  name: 'User',
  target: User,
  columns: {
    ...baseColumnSchemas,
    email: {
      type: 'varchar',
      length: 255,
      unique: true,
    },
    externalId: {
      name: 'external_id',
      type: 'varchar',
      unique: true,
    },
    nutrigeneticParameters: {
      name: 'nutri_genetic_parameters',
      type: 'simple-array',
      nullable: true,
    },
  },
});
