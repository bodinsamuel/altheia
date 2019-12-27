// Not type safe nor shallow diff, but good enough
export default <T>(one: any[], two: any[]): T[] => {
  return one.filter((i): boolean => {
    return two.indexOf(i) === -1;
  });
};
