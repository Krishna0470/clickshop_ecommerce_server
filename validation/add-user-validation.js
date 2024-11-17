import validator from "validator";
import isEmpty from "./isEmpty";


module.exports = async function ValidateLogin(data){
    let errors = {};
    console.log("Validation file reached");

    data.email = !isEmpty(data.email) ? data.email : "" ;
    // data.password = !isEmpty(data.password) ? data.password : "" ;


if (validator.isEmpty(data.username)) {
    errors.email = "username field is required ! ";
}

if (validator.isEmpty(data.email)) {
    errors.password = "Email is required !"
}
// if (validator.isEmpty(data.password)) {
//     errors.password = "Password is required !"
// }
// if (validator.isEmpty(data.Confirmpassword)) {
//     errors.password = "ConfirmPassword is required !"
// }

return{ 
    login_errors : errors ,
    login_valid : isEmpty(errors),
} ;
}

