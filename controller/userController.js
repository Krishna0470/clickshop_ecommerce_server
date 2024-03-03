const users = require('../db/models/users');
const bcrypt = require('bcryptjs');
const { success_function, error_function } = require('../utils/response-handler');

async function createUser(req, res) {
    try {
        const { firstname, lastname, email, password } = req.body;

        const existingUser = await users.findOne({ email });
        if (existingUser) {
            const response = error_function({
                statusCode: 400,
                message: 'User already exists',
            });
            return res.status(response.statusCode).send(response);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await users.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
        });

        const responseData = {
            _id: newUser.id,
            firstname: newUser.firstname,
            lastname: newUser.lastname,
            email: newUser.email,
        };
        const response = success_function({
            statusCode: 201,
            data: responseData,
            message: 'User created successfully',
        });
        res.status(response.statusCode).send(response);
    } catch (error) {
        console.error('Error creating user:', error);
        const response = error_function({
            statusCode: 500,
            message: 'Internal server error',
        });
        res.status(response.statusCode).send(response);
    }
}

async function getUserData(req, res) {
    try {
        const allUsers = await users.find({});

        if (allUsers.length > 0) {
            const response = success_function({
                statusCode: 200,
                data: allUsers,
                message: 'All users retrieved successfully',
            });
            res.status(response.statusCode).send(response);
        } else {
            const response = error_function({
                statusCode: 404,
                message: 'No users found',
            });
            res.status(response.statusCode).send(response);
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        const response = error_function({
            statusCode: 500,
            message: 'Internal server error',
        });
        res.status(response.statusCode).send(response);
    }
}

module.exports = {
    createUser,
    getUserData,
};
