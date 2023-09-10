const User = require('../models/user');
const bcrypt = require('bcryptjs');
const {generateJWT} = require('../helpers/jwt');
const login = async (req, res) => {

    const {email, password} = req.body;

    try {

        // verify if email exists
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }
        // verify if user is active
        if (!user.state) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }
        // verify password
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }
        // generate JWT
        //const token = await generateJWT(user.id);
        const token = await generateJWT(user.id);

        console.log(token,'token');

        res.json({
            msg: 'Login ok',
            token
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
};

module.exports = {
    login
}