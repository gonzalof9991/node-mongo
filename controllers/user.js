const { response } = require('express');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const {validationResult} = require("express-validator");
const getUsers = async (req, res = response) => {
    // const {q, name = 'No name', apikey, page = 1, limit} = req.query;
    const {limit = 5, from = 0} = req.query;
    const filter = {state: true};
    const [
        total,
        users
    ] = await Promise.all([
        User.countDocuments(filter),
        User.find(filter).limit(Number(limit)).skip(Number(from))
    ]);
    res.status(201).json({
        total,
        users
    });
};

const postUsers = async (req, res = response) => {
    // Get data from body and destructure
    const { name, email, password, role } = req.body;
    const user = new User(
        {
            name,
            email,
            password,
            role
        }
    );
    // Encrypting password
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);
    // Save in DB
    await user.save();
    // Responder al cliente
    res.status(201).json({
        msg: 'post API - controller',
        user
    });
}

const putUsers = async (req, res = response) => {
    const id = req.params.id;
    const { password, google, ...rest } = req.body;
    // TODO validate against DB
    if (password) {
        // Encrypting password
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync(password, salt);
    }
    const user = await User.findByIdAndUpdate(id, rest);
    console.log(user);
    res.status(201).json(user);
}

const deleteUsers = async (req, res = response) => {
    const {id} = req.params;

    // Delete from DB for state: false
    const user = await User.findByIdAndUpdate(id, {state: false});
    // Delete permanently from DB
    // User.findByIdAndDelete(id);
    res.status(201).json({
        user
    });
}


module.exports = {
    getUsers,
    postUsers,
    putUsers,
    deleteUsers
}