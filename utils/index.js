const excludeFields = (object, ...excludedFields) => {
  const newObj = {};
  Object.keys(object).forEach((el) => {
    if (!excludedFields.includes(el)) newObj[el] = object[el];
  });
  return newObj;
};

module.exports = { excludeFields };
