const jwt = require('jsonwebtoken');
const generateJWT = (uid = '') => {
    return new Promise((resolve, reject) => {
        const payload = {uid};
        console.log(process.env.SECRETORPRIVATEKEY,'secretorprivatekey');
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '1h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el JWT');
            } else {
                resolve(token);
            }
        });
    });
};



module.exports = {
    generateJWT
}