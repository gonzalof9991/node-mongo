const validateJwt = require("../middlewares/validar-jwt");
const tieneRole = require("../middlewares/validar-roles");
const fieldValidate = require("../middlewares/validar-campos");

module.exports = {
    ...validateJwt,
    ...tieneRole,
    ...fieldValidate
}