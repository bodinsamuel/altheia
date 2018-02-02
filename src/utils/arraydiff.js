// Not type safe nor shallow diff, but good enough
module.exports = (one, two) => {
  return one.filter(function (i) {
    return two.indexOf(i) === -1;
  });
};
