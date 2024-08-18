import { Base } from '@/common/base/domain/base.domain';
import { NutrigeneticParameter } from '@/modules/nutritionalRecommendation/domain/domain';

export class User extends Base {
  email: string;
  externalId: string;
  nutrigeneticParameters: NutrigeneticParameter[];

  constructor(email: string, externalId: string) {
    super();
    this.email = email;
    this.externalId = externalId;
  }
}
