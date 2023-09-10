const { Router } = require('express');
const { getUsers, postUsers, putUsers, deleteUsers } = require('../controllers/user');
const {check} = require("express-validator");
const router = Router();
const {isRoleValid, existEmail, existUserById} = require("../helpers/db-validators");

const {validateJwt, tieneRole, fieldValidate} = require("../middlewares");


router.get('/', getUsers);
router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('email', 'El correo es obligatorio').isEmail(),
    check('role', 'El rol es obligatorio').not().isEmpty(),
    check('role').custom(isRoleValid),
    check('email').custom(existEmail),
    fieldValidate
], postUsers);
router.put('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existUserById),
    check('role').custom(isRoleValid),
    check('email').custom(existEmail),
    fieldValidate
], putUsers);
router.delete('/:id', [
    validateJwt,
    tieneRole('ADMIN', 'VENTAS'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existUserById),
    fieldValidate
], deleteUsers);












module.exports = router;