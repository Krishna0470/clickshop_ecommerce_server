const  validator = require ("validator");
const  isEmpty  =require("./isEmpty");

module.exports = async function validateAddloginInput(data) {
    let errors ={};
    
    data.email = !isEmpty(data.email)? data.email :"";
    data.password =!isEmpty(data.password)? data.password :"";

    if (validator .isEmpty(data.email)) {
        errors.email_empty = "Email field is required";
    }

    if (!validator.isLength(data.email, {min:2, max:30})) {
        errors.email = "Email must be between 2 and 30" ;
    }

    if (!validator.isEmail(data.email)) {
        errors.email_invalid = "Email is invalid";
    }

    if (!validator.isEmail(data.email)) {
        errors.email_invalid = "Email is invalid";
    }

    let email_count = await organization.countDocuments({
        "email": data.email,
    });

    if (
        Number(email_count)> 0
    ){
        errors.email = "Email must be unique"
    }

    if (validator.isEmpty(data.password)) {
        errors.password='Password faild is required';
    }

    return{
        errors,
        isValid: isEmpty(errors),
    };
    
};

