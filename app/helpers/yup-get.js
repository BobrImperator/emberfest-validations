import { helper } from '@ember/component/helper';

export default helper(function yupGet([obj, path]) {
  try {
    return obj[path];
  } catch (error) {
    return undefined;
  }
});
