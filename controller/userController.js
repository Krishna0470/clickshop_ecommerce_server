const users = require('../db/models/users');
const products = require('../db/models/Product');
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
        let username = req.body.username ;
        let email = req.body.email;
        let type = req.body.type;
        let password = generateRandomPassword(12);

        console.log("name : ",username)

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
            username,
            email,
            type,
            password : hashed_password,
            user_type : "65f3d65961496a1395461cf1"
        });


        if (new_user) {
            let emailContent = await set_pass_template(username,email,password);

            await sendEmail(email, "set your password",emailContent);
            console.log("Reached sendEmail ");
               console.log("email : ", email);

            let response_datas = {
                _id : new_user._id,
                username : new_user.username,
                email : new_user.email,
                type:new_user.type,
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
            user.username.toLowerCase().includes(search.toLowerCase()) || 
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

        const { username, email, profileImage, removeProfileImage } = req.body;

        // console.log("ProfileImage : ",profileImage)

        if (!userId || !mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ error: 'Invalid userId' });
        }

        const user = await users.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.username = username || user.username;
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

// Add a product to the user's cart
const addItemToCart = async (req, res) => {
    try {
        const userId = req.params.id;
        const { productId, quantity } = req.body;

        if (!userId || !mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const user = await users.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const existingCartItem = user.cart.find(item => item.product.toString() === productId);
        if (existingCartItem) {
            existingCartItem.quantity += quantity;
        } else {
            user.cart.push({ product: productId, quantity });
        }

        await user.save();

        return res.json({ message: 'Item added to cart successfully', cart: user.cart });
    } catch (error) {
        console.error("Error adding item to cart:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Add a product to the user's favorite list
const addToFavorites = async (req, res) => {
    const userId = req.params.id;
    const { productId } = req.body;

    try {
        // Validate ObjectIds
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: 'Invalid userId or productId' });
        }

        // Find the user
        const user = await users.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Find the product
        const product = await products.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Check if the product is already in the favorites
        const existingFavorite = user.favorite.find(fav => fav.product.toString() === productId);
        if (existingFavorite) {
            return res.status(400).json({ success: false, message: 'Product is already in favorites' });
        }

        // Add the product to favorites with image URL, name, and price
        user.favorite.push({
            product: productId,
            quantity: 1,
            productImage: product.productImages[0], // Assuming the first image is the main image
            name: product.name, // Add product name
            price: product.price // Add product price
        });

        // Save the updated user document
        await user.save();

        res.status(200).json({ success: true, message: 'Product added to favorites' });
    } catch (error) {
        console.error('Error adding to favorites:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};





const removeFromFavorites = async (req, res) => {
    try {
        const userId = req.params.id; // The user ID from the URL
        const { favoriteId } = req.body; // The ID of the favorite item to remove from the request body

        if (!userId || !mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        if (!favoriteId || !mongoose.isValidObjectId(favoriteId)) {
            return res.status(400).json({ error: 'Invalid favorite item ID' });
        }

        const user = await users.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the index of the favorite item to be removed using favoriteId
        const favoriteIndex = user.favorite.findIndex(item => item._id.toString() === favoriteId);

        if (favoriteIndex === -1) {
            return res.status(404).json({ error: 'Favorite item not found' });
        }

        // Remove the item from the favorites list
        user.favorite.splice(favoriteIndex, 1);

        // Save the updated user document
        await user.save();

        return res.json({ message: 'Item removed from favorites successfully', favorite: user.favorite });
    } catch (error) {
        console.error("Error removing item from favorites:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


  


const getFavoriteItems = async (req, res) => {
    try {
      const userId = req.params.id; // The user ID from the URL
      console.log('Received user ID:', userId);
  
      // Validate the user ID
      if (!userId || !mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
  
      const user = await users.findById(userId).populate('favorite.product'); // Populate product details
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Return the favorite items
      return res.json({ message: 'Favorite items retrieved successfully', favoriteItems: user.favorite });
    } catch (error) {
      console.error("Error retrieving favorite items:", error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  

  

  


module.exports = {
    createUser,
    getUserData,
    getSingleUserData,
    updateUser,
    deleteUser,
    addItemToCart,
    addToFavorites,
    getFavoriteItems,
    removeFromFavorites,
}