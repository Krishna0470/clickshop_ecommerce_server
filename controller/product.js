const Product =require('../db/models/Product');
const mongoose = require('mongoose');
const User = require('../db/models/users');
const Order = require('../db/models/Order');
const  sendEmail  = require ("../utils/send-email").sendEmail;




const createProduct = async (req, res) => {
    try {
        const { name, price, description, category, location, stock, productImages, userId } = req.body; // Note the change to productImages
        const newProduct = new Product({
            name,
            price,
            description,
            category,
            location,
            stock,
            productImages, // Save array of image URLs
            user: userId
        });
        const savedProduct = await newProduct.save();
        res.status(200).json({
            message: "Product successfully added",
            success: true,
            data: {
                product: savedProduct
            }
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({
            error: "Internal server error",
            success: false
        });
    }
};






const getAllProduct = async (req,res) =>{
    try {
        
        const {category} = req.query;
        
        
        if(category === "all"){
            const productItems = await Product.find()

       
            res.status(200).json({
                message:"product successfully added",
                success:true,
                data:{
                    product:productItems
                }
            })
        }else{
            const productItems = await Product.find({category:category})
       
            res.status(200).json({
                message:"food successfully added",
                success:true,
                data:{
                    product:productItems
                }
            })
        }
      
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error:"Internal server error",
            success:false
        })
    }
}
const getNewProducts = async (req,res) =>{
    try {
        const productItems = await Product.find().sort({createdAt:-1}).limit(12)
     
           
       
            res.status(200).json({
                message:"12 register product showing",
                success:true,
                data:{
                    product:productItems
                }
            })
       
      
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error:"Internal server error",
            success:false
        })
    }
}

const getNewProduct = async (req,res) =>{
    try {
        const productItems = await Product.find().sort({createdAt:-1}).limit(12)
     
           
       
            res.status(200).json({
                message:"12 register product showing",
                success:true,
                data:{
                    product:productItems
                }
            })
       
      
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error:"Internal server error",
            success:false
        })
    }
}
const getProductsFromDistinctCategory = async (req,res) =>{
    try {
        const distinctCategory = await Product.distinct("category");
        const distinctproduct = await Promise.all(
            distinctCategory.slice(0,4).map(async (category) =>{
                const product = await Product.findOne({category});
                return product;
            })
        )
     
           
       
            res.status(200).json({
                message:"4 different category product",
                success:true,
                data:{
                    product:distinctproduct
                }
            })
       
      
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error:"Internal server error",
            success:false
        })
    }
}

const getspecialProducts = async (req,res) =>{
    try {
        const distinctCategory = await Product.distinct("category");
        const distinctproduct = await Promise.all(
            distinctCategory.slice(0,4).map(async (category) =>{
                const product = await Product.findOne({category});
                return product;
            })
        )
     
           
       
            res.status(200).json({
                message:"4 different category product",
                success:true,
                data:{
                    product:distinctproduct
                }
            })
       
      
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error:"Internal server error",
            success:false
        })
    }
}

const getTopRating = async (req,res) =>{
    try {
        const topRatedProducts = await Product.find().sort({"reviews.rating": -1}).limit(4)
       
     
           
       
            res.status(200).json({
                message:"4 different category product",
                success:true,
                data:{
                    product:topRatedProducts
                }
            })
       
      
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error:"Internal server error",
            success:false
        })
    }
}

const getTopRatingg = async (req,res) =>{
    try {
        const topRatedProducts = await Product.find().sort({"reviews.rating": -1}).limit(4)
       
     
           
       
            res.status(200).json({
                message:"4 different category product",
                success:true,
                data:{
                    product:topRatedProducts
                }
            })
       
      
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error:"Internal server error",
            success:false
        })
    }
}
const getProductById = async (req,res) =>{
    try {
        const {id} = req.params;
       const productItems = await Product.findById(id)
       
            res.status(200).json({
                message:"Product details",
                success:true,
                data:{
                    product:productItems
                }
            })
        }
      
        
     catch (error) {
        console.log(error);
        res.status(500).json({
            error:"Internal server error",
            success:false
        })
    }
}

const updateProdect = async (req, res) => {
    try {
        const { id } = req.params;

        const { name, price, description, category, location, stock, productImage } = req.body;

        if (!id || !mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: 'Invalid productId' });
        }

        const productItem = await Product.findById(id);

        if (!productItem) {
            return res.status(404).json({ error: 'Product not found' });
        }

        productItem.name = name || productItem.name;
        productItem.price = price || productItem.price;
        productItem.description = description || productItem.description;
        productItem.category = category || productItem.category;
        productItem.location = location || productItem.location;
        productItem.stock = stock || productItem.stock;
        productItem.productImage = productImage || productItem.productImage;

        const updatedProduct = await productItem.save();

        res.status(200).json({
            message: "Product successfully updated",
            success: true,
            data: {
                product: updatedProduct
            }
        });

    } catch (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

    
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || !mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        await Product.deleteOne({ _id: id });

        return res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


const addReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment, user, userEmail } = req.body; // Include userEmail in the destructuring

        if (!id || !mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Optional: Fetch user's email if it's not passed in the request body
        if (!userEmail) {
            const userObject = await User.findById(user);
            if (!userObject) {
                return res.status(404).json({ error: 'User not found' });
            }
            userEmail = userObject.email;
        }

        const newReview = {
            user,
            userEmail,
            rating,
            comment,
            createdAt: new Date()
        };

        product.reviews.push(newReview);
        await product.save();

        res.status(200).json({
            message: 'Review added successfully',
            success: true,
            data: {
                product  // Return the updated product with reviews
            }
        });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({
            error: 'Internal server error',
            success: false
        });
    }
};



const getProductReviews = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || !mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        const product = await Product.findById(id).populate('reviews.user');

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({
            message: 'Product reviews retrieved successfully',
            success: true,
            data: {
                reviews: product.reviews
            }
        });
    } catch (error) {
        console.error('Error retrieving reviews:', error);
        res.status(500).json({
            error: 'Internal server error',
            success: false
        });
    }
};

const checkPurchase = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        if (!userId || !productId) {
            return res.status(400).json({ success: false, message: 'User ID and Product ID are required' });
        }

        const order = await Order.findOne({ user: userId, 'orderItems.product': productId });

        if (order) {
            return res.json({ success: true, hasPurchased: true });
        }

        res.json({ success: true, hasPurchased: false });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateProductStock = async (req, res) => {
    try {
        const { productId, newStock } = req.body;

        // Validate input
        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({ success: false, message: 'Invalid product ID' });
        }
        if (typeof newStock !== 'number' || newStock < 0) {
            return res.status(400).json({ success: false, message: 'Invalid stock value' });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Update the product stock
        product.stock = newStock;
        await product.save();

        // Check if the stock is now zero and send email
        if (newStock === 0) {
            const user = await User.findById(product.user); // Assuming `product.user` is the ID of the user who added the product
            
            if (user) {
                const userEmail = user.email;
                const subject = `Product ${product.name} is now out of stock`;
                const content = `<p>The product <strong>${product.name}</strong> is now out of stock.</p>`;

                // Send the email to the user
                await sendEmail(userEmail, subject, content);
            } else {
                console.log('User not found');
            }
        }

        res.status(200).json({ success: true, message: 'Stock updated successfully' });
    } catch (error) {
        console.error('Error updating stock:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

const blockProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the product by ID
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Set the product as blocked
        product.isBlocked = true;
        await product.save();

        res.status(200).json({ message: 'Product blocked successfully', product });
    } catch (error) {
        console.error('Error blocking product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const unblockProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the product by ID
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Set the product as unblocked
        product.isBlocked = false;
        await product.save();

        res.status(200).json({ message: 'Product unblocked successfully', product });
    } catch (error) {
        console.error('Error unblocking product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};







module.exports = { createProduct,
     getAllProduct,getProductById ,
     getNewProducts,
     getNewProduct,
     getProductsFromDistinctCategory,
     getspecialProducts,
     getTopRating ,
     getTopRatingg,
     updateProdect,
     deleteProduct,
     addReview,
     getProductReviews,
     checkPurchase,
     updateProductStock,
     blockProduct,
    unblockProduct};










