import Model, { attr } from '@ember-data/model';
import { string } from 'yup';
import YupValidations from 'emberfest-validations/validations/yup';

export default class PetModel extends Model {
  validations = new YupValidations(this, {
    name: string().required(),
  });

  @attr('string') name;
}
