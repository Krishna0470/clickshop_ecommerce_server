const jwt = require("jsonwebtoken");
const User = require("../db/models/users");
const UserType = require("../db/models/user_types");
const Product = require("../db/models/Product");
const Order = require("../db/models/Order");
const errorFunction = require("./response-handler").error_function;
const controlData = require("./control-data.json");

exports.accessControl = async (accessTypes, req, res, next) => {
  try {
    if (accessTypes === "*") return next();

    const authHeader = req.headers["authorization"];
    const token = authHeader ? authHeader.split(" ")[1] : null;

    if (!token) {
      return res.status(401).json(errorFunction({ status: 401, message: "Invalid Access Token" }));
    }

    jwt.verify(token, process.env.PRIVATE_KEY, async (err, decoded) => {
      if (err) {
        return res.status(401).json(errorFunction({ status: 401, message: err.message }));
      }

      try {
        const user = await User.findById(decoded.user_id);
        if (!user) throw new Error("User not found");

        const userType = await UserType.findById(user.user_type);
        if (!userType) throw new Error("User type not found");

        const allowedTypes = accessTypes.split(",").map(type => controlData[type]);
        if (allowedTypes.includes(userType.user_type)) {
          // Check for specific resource access
          if (accessTypes.includes("product")) {
            const product = await Product.findById(req.params.productId);
            if (!product) return res.status(404).json(errorFunction({ status: 404, message: "Product not found" }));
          }

          if (accessTypes.includes("order")) {
            const order = await Order.findById(req.params.orderId);
            if (!order) return res.status(404).json(errorFunction({ status: 404, message: "Order not found" }));
          }

          return next();
        } else {
          return res.status(403).json(errorFunction({ status: 403, message: "Not allowed to access the route" }));
        }
      } catch (error) {
        return res.status(404).json(errorFunction({ status: 404, message: error.message }));
      }
    });
  } catch (error) {
    return res.status(400).json(errorFunction({ status: 400, message: error.message }));
  }
};

exports.authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  } else {
    res.status(401).send("Not authorized as an admin.");
  }
};
