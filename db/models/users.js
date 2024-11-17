const mongoose = require('mongoose');

const users = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        unique: true,
        required: true,
    },
    user_type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user_types",
    },
    password_token: { 
        type: String,
    },
    profileImage: {
        type: String,
    },
    type: {
        type: String,
        required: true,
    },
    cart: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 0 },
        },
    ],
    favorite: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 0 },
            productImage: { type: String },  // Added field for product image URL
            name: { type: String },  // Added field for product name
            price: { type: Number },  // Added field for product price
        },
    ],
});

module.exports = mongoose.model("users", users);
