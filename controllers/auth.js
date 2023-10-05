const User = require('../models/user');
const bcrypt = require('bcryptjs');
const {generateJWT} = require('../helpers/jwt');
const {verify} = require("../helpers/google-verify");
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

const googleSignIn = async (req, res) => {
    const {id_token} = req.body;
    try {
        const {name, email, img} = await verify(id_token);
        console.log(name, email, img);
        let user = await User.findOne({email});
        console.log(user.get('name'),'user');
        if (!user) {
            // hay que crearlo
            const data = {
                name,
                email,
                password: ':P',
                img,
                google: true,
                state: true,
                role: 'ADMIN'
            };
            user = new User(data);
            await user.save();
        }

        if (!user.state) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generate JWT
        const token = await generateJWT(user.id);
        return res.json({
            user,
            token
        });
        
    }catch (e) {
        console.log(e);
        return res.status(400).json({
            msg: 'Token de Google no es valido'
        });
    }
};

module.exports = {
    login,
    googleSignIn
}