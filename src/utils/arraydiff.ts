// Not type safe nor shallow diff, but good enough
export = (one: any[], two: any[]): any[] => {
  return one.filter((i): boolean => {
    return two.indexOf(i) === -1;
  });
};
