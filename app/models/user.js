import Model, { attr, hasMany } from '@ember-data/model';
import YupValidations from 'emberfest-validations/validations/yup';
import { object, number, array, string, boolean } from 'yup';

export default class UserModel extends Model {
  validations = new YupValidations(this, {
    name: string().required(),
    age: number().required(),
    pets: array()
      .transform((_value, originalValue) => originalValue?.toArray() || [])
      .of(
        object().shape({
          name: string().when(['$isAllergic'], {
            is: true,
            then: string().notRequired(),
            otherwise: string().required(),
          }),
        })
      ),
    isAllergic: boolean(),
  });

  @attr('string') name;
  @attr('number') age;
  @attr('boolean') isAllergic;

  @hasMany('pet') pets;
}
