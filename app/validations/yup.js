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
      await this.schema.validate(this.validationProperties(), {
        abortEarly: false,
      });

      this.error = null;
      return true;
    } catch (error) {
      this.error = error;

      return false;
    }
  }

  validationProperties() {
    return getProperties(this.context, ...Object.keys(this.shape));
  }
}

const locale =
  (localeValues = []) =>
  (key) =>
  (validationParams) => ({
    key,
    path: validationParams.path,
    values: getProperties(validationParams, ...localeValues),
  });

function setupYupValidations() {
  setLocale({
    mixed: {
      default: locale()('field.invalid'),
      required: locale()('field.required'),
      oneOf: locale(['values'])('field.oneOf'),
      notOneOf: locale(['values'])('field.notOneOf'),
      defined: locale()('field.defined'),
    },

    string: {
      length: '${path} must be exactly ${length} characters',
      min: '${path} must be at least ${min} characters',
      max: '${path} must be at most ${max} characters',
      matches: '${path} must match the following: "${regex}"',
      email: '${path} must be a valid email',
      url: '${path} must be a valid URL',
      uuid: '${path} must be a valid UUID',
      trim: '${path} must be a trimmed string',
      lowercase: '${path} must be a lowercase string',
      uppercase: '${path} must be a upper case string',
    },

    number: {
      min: '${path} must be greater than or equal to ${min}',
      max: '${path} must be less than or equal to ${max}',
      lessThan: '${path} must be less than ${less}',
      moreThan: '${path} must be greater than ${more}',
      positive: '${path} must be a positive number',
      negative: '${path} must be a negative number',
      integer: '${path} must be an integer',
    },

    date: {
      min: '${path} field must be later than ${min}',
      max: '${path} field must be at earlier than ${max}',
    },

    boolean: {
      isValue: '${path} field must be ${value}',
    },

    object: {
      noUnknown: '${path} field has unspecified keys: ${unknown}',
    },

    array: {
      min: locale(['min'])('field.minLength'),
      max: '${path} field must have less than or equal to ${max} items',
      length: '${path} must have ${length} items',
    },
  });
}

function extendYup() {
  addMethod(object, 'emberDataRelationship', function () {
    return this.test(function (value) {
      return value.validations.validate();
    });
  });

  addMethod(array, 'emberDataRelationship', function () {
    return this.transform(
      (_value, originalValue) => originalValue?.toArray() || []
    ).test(async function (value) {
      const v = await Promise.all(
        value.map(({ validations }) => {
          return validations.validate();
        })
      );

      return !v.some((a) => a === false);
    });
  });
}

extendYup();
setupYupValidations();
