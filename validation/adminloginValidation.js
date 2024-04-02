const  validator = require ("validator");
const  isEmpty  =require("./isEmpty");

module.exports = async function validateAddloginInput(data) {
    let errors ={};
    console.log("Validation file reached");
    
    data.email = !isEmpty(data.email)? data.email :"";
    data.password =!isEmpty(data.password)? data.password :"";

   
if (validator.isEmpty(data.email)) {
    errors.email = "Email field is required ! ";
}

if (validator.isEmpty(data.password)) {
    errors.password = "Password is required !"
}

return{ 
    login_errors : errors ,
    login_valid : isEmpty(errors),
} ;
}

