const users = require('../db/models/users');
const bcrypt = require('bcryptjs');
const success_function = require('../utils/response-handler').success_function ;
const error_function = require('../utils/response-handler').error_function ;
const set_pass_template = require("../utils/email-templates/setPassword").resetPassword;
const sendEmail = require ("../utils/send-email").sendEmail;
const mongoose = require('mongoose');
const fs = require("fs")


function generateRandomPassword(length) {
    let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$";
    let password = "";

    for (var i = 0; i<length;i++) {
        var randomIndex = Math.floor(Math.random() * charset.length);
        password += charset.charAt(randomIndex);
    }
    return password;
}


async function createUser (req,res) {
    try {
        let firstname = req.body.firstname ;
        let lastname = req.body.lastname;
        let email = req.body.email;
        let password = generateRandomPassword(12);

        console.log("name : ",firstname)

        let userFound =await users.findOne({email});

        if(userFound){
            let response = error_function({
                statusCode : 400 ,
                message : "user already exist"
            })
            res.status(response.statusCode).send(response);
            return ;
        }

        let salt = await bcrypt.genSalt(10);
        console.log("salt : ",salt);

        let hashed_password = bcrypt.hashSync(password,salt);

        let new_user = await users.create ({
            firstname,
            lastname,
            email,
            password : hashed_password,
            user_type : "65f3d65961496a1395461cf1"
        });


        if (new_user) {
            let emailContent = await set_pass_template(firstname,email,password);

            await sendEmail(email, "set your password",emailContent);
            console.log("Reached sendEmail ");
               console.log("email : ", email);

            let response_datas = {
                _id : new_user._id,
                firstname : new_user.firstname,
                lastname : new_user.lastname,
                email : new_user.email,
                user_type : "65f3d65961496a1395461cf1"
               
            }
            
            console.log("new_user : ",new_user);

            let response = success_function({
                statusCode : 201,
                data : response_datas,
                message : "user created successfully",
            })
            res.status(response.statusCode).send(response);
            return ;
        }else {
            let response = error_function({
                statusCode : 400 ,
                message : "user creation failed",
            })
            res.status(response.statusCode).send(response);
            return ;
        }
    }catch (error) {
        console.log("error : ",error);

        let response = error_function ({
            statusCode : 400 , 
            message : "something went wrong..."
        })
        res.status(response.statusCode).send(response);
        return ;
    }
}

async function getUserData(req,res){
    try {

        let count = Number(await users.countDocuments());
        console.log("Count: ", count);

        const pageNumber = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || count;

        console.log("Page Number:", pageNumber);
        console.log("Page Size:", pageSize);

        const search = req.query.search || '';


        let allUsers = await users.find({});

        // .skip(pageSize * (pageNumber - 1))
        // .limit(pageSize);
        allUsers = allUsers.filter(user => 
            user.firstname.toLowerCase().includes(search.toLowerCase()) || 
            user.lastname.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
        );


         const startIndex = (pageNumber - 1) * pageSize;
        const paginatedUsers = allUsers.slice(startIndex, startIndex + pageSize);

        if (paginatedUsers.length > 0) {
            const totalCount = allUsers.length;
            const totalPages = Math.ceil(totalCount / pageSize);

            const data = {
                count: totalCount,
                totalPages: totalPages,
                currentPage: pageNumber,
                datas: paginatedUsers,
            };

            res.status(200).json({
                statusCode: 200,
                data: data,
                message: "Users retrieved successfully",
            });
        } else {
            res.status(404).json({
                statusCode: 404,
                message: "No users found",
            });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            statusCode: 500,
            message: "Internal server error",
        });
    }
}

const getSingleUserData = async (req, res) => {
    try {
      const userId = req.params.id;
      console.log("userId : ",userId)
      if (!userId || !mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
  
     
      const user = await users.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

//   const updateUser = async (req , res)=>{
//     try{
//         const userId = req.params.id

//         const {firstname,lastname,email} = req.body;

//         if(!userId || !mongoose.isValidObjectId(userId)){
//             return res.status(400).json({error : "invalid userId"})
//         }

//         const user = await users.findById(userId);

//         if(!user){
//             let response = error_function({
//                 statusCode: 400,
//                 data: user,
//                 message: "User Not Found",
//             });
//             res.status(response.statusCode).send(response);
//             return; 
//         }

//         user.firstname = firstname || user.firstname;
//         user.lastname = lastname || user.lastname ;
//         user.email = email || user.email ;

//         await user.save();

//         res.json(user);

//     }catch(error){
//         console.error("error updating user : ",error);
//         res.status(500).json({error : 'internal server error '})

//     }
//   }


  const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const { firstname, lastname, email, profileImage, removeProfileImage } = req.body;

        // console.log("ProfileImage : ",profileImage)

        if (!userId || !mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ error: 'Invalid userId' });
        }

        const user = await users.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.firstname = firstname || user.firstname;
        user.lastname = lastname || user.lastname;
        user.email = email || user.email;

        if (removeProfileImage) {
           
            if (user.profileImage) {
                
                fs.unlink(user.profileImage, async (err) => {
                    if (err) {
                        console.error('Error deleting profile image:', err);
                        return res.status(500).json({ error: 'Internal server error' });
                    }
                    user.profileImage = undefined;
                    try {
                        await user.save();
                        return res.json(user);
                    } catch (saveError) {
                        console.error('Error saving user:', saveError);
                        return res.status(500).json({ error: 'Internal server error' });
                    }
                });
            } else {
                return res.json(user);
            }
        } else if (profileImage) {
            const base64Data = profileImage.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            const imagePath = `uploads/profile_${userId}.jpg`;

            fs.writeFile(imagePath, buffer, async (err) => {
                if (err) {
                    console.error('Error saving profile image:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                user.profileImage = imagePath;

                try {
                    await user.save();
                    return res.json(user);
                } catch (saveError) {
                    console.error('Error saving user:', saveError);
                    return res.status(500).json({ error: 'Internal server error' });
                }
            });
        } else {
            // If no profile image changes were requested, simply save the user object
            await user.save();
            return res.json(user);
        }
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


  const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId || !mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const user = await users.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.deleteOne({_id:userId});

        return res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

  


module.exports = {
    createUser,
    getUserData,
    getSingleUserData,
    updateUser,
    deleteUser,
}