const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');

const userSchema =  new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true,
        validate: {
            validator: function(el){
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    },
    date: {
        type: Date,
        default: Date.now
    },
    tokens: [{
        token: {
        type: String,
        required: true
        }
    }]
        
})

userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmPassword = await bcrypt.hash(this.confirmPassword, 10);
    }
    next();
})

userSchema.methods.generateAuthToken = async function(){
    try{
        let token = jwt.sign({_id: this._id}, config.get('jwtSecret'));
        this.toikens = this.tokens.concat({token: token});
        await this.save();
        return token;
    } catch (error){
        console.log(error);
    }
}

userSchema.methods.verifyPassword =  async function(password){
    const user = this; 
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw new Error('Unable to login');
    }
    return user;
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});
    if(!user){
        throw new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw new Error('Unable to login');
    }
    return user;
}

module.exports = mongoose.model('User', userSchema);