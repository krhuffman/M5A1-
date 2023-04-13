const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const{check, validationResult} = require('express-validator');

exports.register = async (req, res) => {
    const errors = validationResult(req); 
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    res.status(200).render('signup', {pageTitle: 'Sign Up Form'});
}

exports.signUp = async (req, res) => {
    const errors = validationResult(req); 
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const {name, email, password, confirmPassword} = req.body; 
    try {
        User.create({
            name: name,
            password: password,
            email: email,
            confirmPassword: confirmPassword
        }).then(user => res.json(user));
    } catch(error){
        console.log(error);
        const errors = validationResult(req);
        const errorDetails = [
            {
                "location": "Authorization",
                "msg": `${name} ${error}`,
                "param": name
            }
        ];
        res.json({errors: errorDetails});
    }
}

exports.login = async (req, res) =>{
    const errors = validationResult(req); 
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const user = await User.findOne({ email: req.body.email});
    if(!user){
        return res.status(400).json({error: 'User does not exist'});
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if(!isMatch){
        return res.status(400).json({error: "invalid credntials"});
    }

    try {
        let token = await req.user.generateAuthToken();
        res.cookie('jwtoken', token, {
            expires: new Date(Date.now( + 25892000000)),
            httpOnly: true
    });
    } catch (error){
        console.log(error);
    }
}

exports.logout = async (req, res) => {
        try{
            req.user.tokens = req.user.tokens.filter((currentElement) => {
                return currentElement.token !== req.token;
            });
            res.clearCookie('jwtoken', {path: '/'});
            await req.user.save();
            res.status(200).send('User logout');
        } catch(error) {
            console.log(error);
        }
    }