const excludeField = (object, ...excludedField) => {
  const newObj = {};
  Object.keys(object).forEach((el) => {
    if (!excludedField.includes(el)) newObj[el] = object[el];
  });
  return newObj;
};

module.exports = { excludeField };
