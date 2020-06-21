function isObjectLike(value: any): boolean {
  return typeof value === 'object' && value !== null;
}

export function isPlainObject(value: any): boolean {
  if (!isObjectLike(value) || value.toString() !== '[object Object]') {
    return false;
  }
  if (Object.getPrototypeOf(value) === null) {
    return true;
  }
  let proto = value;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(value) === proto;
}
