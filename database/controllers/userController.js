'use strict';
// userController
const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');

const getUserList = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};


const getUser =  async (req, res) => {
    const userId = Number(req.params.userId);
    if(!Number.isInteger(userId)) {
        res.status(400).json({error: 500, message: 'invalid id'});
        return;
    }

    const [user] = await userModel.getUserById(userId);
    console.log('getUser', user);

    if(user) {
        res.json(user);
    } else {
        res.status(404).json({message: "User not found."})
    }
};
const postUser = async (req,res) => {
    console.log("posting user", req.body, req.file);
    // Generate a salt with bcrypt
    const salt = await bcrypt.genSalt(10);
    // Hash the user's password using bcrypt and the generated salt
    const password = await bcrypt.hash(req.body.password, salt);
    // Create a new user object with the user's input values and the generated password and filename
    const newUser = {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        profession: req.body.profession,
        description: req.body.description,
        filename: req.file.filename,
        password: password,

    };
    try {
        // Call the insertUser method on the userModel object with the new user object as the argument and store the result
        const result = await userModel.insertUser(newUser);
        // Redirect the user to the registration.html page
        res.redirect("/registration.html");
    }catch (error){
        // If there is an error, log the error message and send a 500 status code and error message in JSON format to the client
        console.error("error",error.message);
        res.status(500).json({error: 500, message: error.message});
    }

};
const putUser = async (req, res) => {
    try {
        const userId = req.body.id
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);
        console.log("userid: " + userId);
        console.log(req.body)
        console.log(req.body.filename)
        const user = {
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            profession: req.body.profession,
            description: req.body.description,
            password: password,

        };
        if (req.file) {
            user.filename = req.file.filename;
        }else {
            user.filename = req.body.sessionuser;
        }

        console.log("user: " + JSON.stringify(user));
        const result = await userModel.modifyUser(userId, user);
        res.status(200).json({ message: "User modified" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteUser = async (req,res) => {

    try {

        const result = await userModel.deleteUser(req.params.userId);
        console.log(req.params);
        console.log(req.params.userId);
        res.status(200).json({ message: "User deleted" });
    }catch (e){
        console.error("error",e.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

const checkToken = (req, res) => {
    res.json({user: req.user});
};

const postSwipe = async (req,res) => {
    try {
        const userId = req.body.userId;
        const result = await userModel.insertSwipe(userId);

        res.status(200).json({ message: 'Match created successfully' });
    }catch (e){
        res.status(200).json({ message: 'Error' + e });
    }

}

const userController = {getUserList, getUser, postUser, putUser, deleteUser, checkToken, postSwipe};
module.exports = userController;
