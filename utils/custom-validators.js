function checkPropertyType(value) {
  if (!["hotel", "apartment"].includes(value))
    throw new Error("property type can be either hotel or apartment");
  return true;
}
function checkStatus(value) {
  if (!["active", "inactive"].includes(value))
    throw new Error("status can be either active or inactive");
  return true;
}

module.exports = {
  checkPropertyType,
  checkStatus,
};
