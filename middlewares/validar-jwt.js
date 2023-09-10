const jwt = require('jsonwebtoken');
const User = require('../models/user');
const validateJwt = async (req, res, next) => {
    // x-token headers
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }
    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        // Valid user
        const user  = await User.findById(uid);
        if (!user) {
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe en DB'
            });
        }
        // Verify if user is active
        if (!user.get('state')) {
            return res.status(401).json({
                msg: 'Token no valido - usuario con estado: false'
            });
        }
        req.user = user;
        next();
    } catch (e) {
        console.log(e);
        return res.status(401).json({
            msg: 'Token no valido'
        });
    }
};


module.exports = {
    validateJwt
}