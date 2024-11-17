// const mongoose = require('mongoose');
// const OrderSchema = new mongoose.Schema({
//     user:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"User",
//         required:true
//     },
//     items:[
//         {
//             food:{
//                 type:mongoose.Schema.Types.ObjectId,
//                 ref:"Product",
//                 required:true,
//             },
//             qty:{
//                 type:Number,
//                 required:true,
//                 min:1
//             }
//         }
//     ],
//     totalAmount:{
//         type:Number,
//         required:true,
//     },
//     payment:{
//         type:Boolean,
//         default:false
//     },
//     status:{
//         type:String,
//         enum:["Pending","Delivered"],
//         default:"Pending",
//     },
//     createdAt:{
//         type:Date,
//         default:Date.now
//     }
  
// },{
//     timestamps:true
//     })



//     module.exports= mongoose.model("Order", OrderSchema);


//     import mongoose from "mongoose";
const mongoose = require('mongoose');
const orderSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "users" },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: false }, 
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    itemsPrice: { type: Number, required: true, default: 0.0 },
    taxPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
