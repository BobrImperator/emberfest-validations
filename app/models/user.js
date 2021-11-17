import Model, { attr, hasMany } from '@ember-data/model';
import YupValidations from 'emberfest-validations/validations/yup';
import { number, array, string } from 'yup';

export default class UserModel extends Model {
  validations = new YupValidations(this, {
    name: string().required(),
    age: number().required(),
    pets: array().relationship(),
  });

  @attr('string') name;
  @attr('number') age;
  @attr('boolean') isAllergic;

  @hasMany('pet') pets;
}
