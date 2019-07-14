// Not type safe nor shallow diff, but good enough
export = (one: any[], two: any[]): any[] => {
  return one.filter(function(i) {
    return two.indexOf(i) === -1;
  });
};
