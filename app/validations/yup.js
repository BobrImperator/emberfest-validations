import { tracked } from '@glimmer/tracking';
import { getProperties } from '@ember/object';
import { addMethod, array, object, setLocale } from 'yup';

export default class YupValidations {
  context = null;
  schema = null;
  shape = null;

  @tracked error = null;

  constructor(context, shape) {
    this.context = context;
    this.shape = shape;
    this.schema = object().shape(shape);
  }

  get fieldErrors() {
    return this.error?.errors.reduce((acc, validationError) => {
      const key = validationError.path;

      if (!acc[key]) {
        acc[key] = [validationError];
      } else {
        acc[key].push(validationError);
      }

      return acc;
    }, {});
  }

  async validate() {
    try {
      await this.schema.validate(this.#validationProperties(), {
        abortEarly: false,
        context: this.#validationProperties(),
      });

      this.error = null;
      return true;
    } catch (error) {
      this.error = error;

      return false;
    }
  }

  #validationProperties() {
    return getProperties(this.context, ...Object.keys(this.shape));
  }
}

const locale =
  (key, localeValues = []) =>
  (validationParams) => ({
    key,
    path: validationParams.path,
    values: getProperties(validationParams, ...localeValues),
  });

setLocale({
  mixed: {
    default: locale('field.invalid'),
    required: locale('field.required'),
    oneOf: locale('field.oneOf', ['values']),
    notOneOf: locale('field.notOneOf', ['values']),
    defined: locale('field.defined'),
  },
});

function extendYup() {
  addMethod(object, 'relationship', function () {
    return this.test(function (value) {
      return value.validations.validate();
    });
  });

  addMethod(array, 'relationship', function () {
    return this.transform(
      (_value, originalValue) => originalValue?.toArray() || []
    ).test(async function (value) {
      const validationsPassed = await Promise.all(
        value.map(({ validations }) => {
          return validations.validate();
        })
      );

      return validationsPassed.every((validation) => validation === true);
    });
  });
}

extendYup();
