import validator from "validator";
import isEmpty from "./isEmpty";


module.exports = async function ValidateLogin(data){
    let errors = {};
    console.log("Validation file reached");

    data.email = !isEmpty(data.email) ? data.email : "" ;
    data.password = !isEmpty(data.password) ? data.password : "" ;


if (validator.isEmpty(data.firstname)) {
    errors.email = "Firstname field is required ! ";
}

if (validator.isEmpty(data.lastname)) {
    errors.password = "Lastname is required !"
}
if (validator.isEmpty(data.email)) {
    errors.password = "Email is required !"
}
if (validator.isEmpty(data.password)) {
    errors.password = "Password is required !"
}

return{ 
    login_errors : errors ,
    login_valid : isEmpty(errors),
} ;
}

