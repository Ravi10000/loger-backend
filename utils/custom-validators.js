function checkPropertyType(value) {
  if (!["hotel", "apartment"].includes(value))
    throw new Error("property type can be either hotel or apartment");
  return true;
}
function validatePropertyType(value) {
  if (!["hotel", "apartment", "villa", "flat"].includes(value))
    throw new Error("property type can be hotel | apartment | villa | flat");
  return true;
}
function validateGeoLocation(value) {
  if (!value?.lat || !value?.lng) throw new Error("invalid geo location");
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
  validatePropertyType,
  validateGeoLocation,
};
