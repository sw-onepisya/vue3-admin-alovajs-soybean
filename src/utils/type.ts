/**
 * 更好的类型检查
 *
 * @example
 *   ```js
 *   typeCheck([]); // 'array'
 *   typeCheck(new Date()); // 'date'
 *   typeCheck(new String('onepisya')); // 'string'
 *   typeCheck(2) // 'number'
 *   typeCheck(new Boolean(true)); // 'boolean'
 *   typeCheck(null); // 'null'
 *   typeCheck({}) // 'object'
 *   typeCheck(undefined) // 'undefined'
 *   typeCheck(ReadableStream) // readablestream
 *   // more example...
 *   // e.g. file type...
 *   ```;
 */
export function typeCheck(value: any) {
  const return_value = Object.prototype.toString.call(value);
  // we can also use regex to do this...
  const type = return_value.substring(return_value.indexOf(' ') + 1, return_value.indexOf(']'));
  return type.toLowerCase();
}
