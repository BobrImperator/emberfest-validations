import Model, { attr, belongsTo } from '@ember-data/model';
import { boolean, string } from 'yup';
import YupValidations from 'emberfest-validations/validations/yup';

export default class PetModel extends Model {
  validations = new YupValidations(this, {
    name: string().when(['isAllergic'], {
      is: true,
      then: string().notRequired(),
      otherwise: string().required(),
    }),
    isAllergic: boolean(),
  });

  @attr('string') name;
  @belongsTo('user') owner;

  get isAllergic() {
    return this.owner.get('isAllergic');
  }
}
