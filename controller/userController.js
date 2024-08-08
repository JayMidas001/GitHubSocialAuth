const socialModel = require(`../model/userModel`)
const mongoose = require(`mongoose`)
const jwt = require(`jsonwebtoken`)
const bcrypt = require(`bcrypt`)



const createUser = async(req, res)=> {
    try {
        const {firstName, lastName, email, password} = req.body
        if(!firstName || !lastName || !email || !password){
            return res.status(400).json(`Please enter all fields.`)
        }
        const emailExist = await socialModel.findOne({ email });
        if (emailExist) {
            return res.status(400).json(`User with email already exist.`)}
            else {
                //perform an encryption using salt
                const saltedPassword = await bcrypt.genSalt(10);
                //perform an encrytion of the salted password
                const hashedPassword = await bcrypt.hash(password, saltedPassword);
                // create object of the body
                const user = new socialModel({
                    firstName,
                    lastName,
                    email: email.toLowerCase(),
                    password: hashedPassword,
                });
             res.status(201).json({message:`User created successfully.`, data:user})}
    } catch (error) {
        res.stauts(500).json(error.message)
    }
}


const extractInfo = async(req, res)=>{
    try {
        console.log(req.user);
      const checkUser = await socialModel.findOne({email:req.user._json.email})  
      if(checkUser){
        req.session.user = checkUser.email
        return res.redirect(`/api/v1/homepage`)
      }else{
      const create = new socialModel({
        firstName: req.user._json.given_name,
        lastName: req.user._json.family_name,
        email: req.user._json.email,
        profilePicture: req.user._json.picture,
        isVerified: req.user._json.email_verified,
        provider: req.user.provider
      })
      await create.save()
      res.status(201).json(`Information extracted successfully.`, create)}
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const homePage = async(req, res) => {
    try {
        if(!req.session.user){
            return res.status(401).json(`You are not authenticated.`)
        }
        else{
            const findUser = await socialModel.findOne({email: req.session.user})
            return res.status(200).json(`Welcome, ${findUser.firstName}`)
        }
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const socialAccount = (req, res)=>{
    res.redirect('/api/v1/auth/github')
}

const logOut = async(req, res) =>{
    try {
        req.session.destroy()
        res.status(200).json(`User logged out successfully.`)
    } catch (error) {
        res.status(500).json(error.message)
    }
}

module.exports = { createUser, extractInfo, homePage, socialAccount, logOut}