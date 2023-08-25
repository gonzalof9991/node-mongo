const Rol = require("../models/rol");
const User = require("../models/user");
const isRoleValid = async (role = '') => {
    const rolFind = await Rol.findOne({
        description: role
    });
    if (!rolFind) {
        throw new Error(`El rol ${role} no está registrado en la base de datos`);
    }
    return true;
}

const existEmail = async (email = '') => {
    const emailFind = await User.findOne({
        email
    });
    if (emailFind) {
        throw new Error(`El correo ${email} ya está registrado en la base de datos`);
    }
    return true;
}

const existUserById = async (id = '') => {
    const userFind = await User.findById(id);
    if (!userFind) {
        throw new Error(`El id ${id} no existe`);
    }
    return true;
}


module.exports = {
    isRoleValid,
    existEmail,
    existUserById
}