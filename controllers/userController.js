import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

export function createUser(req, res) {

    const newUserData = req.body;
    // if (newUserData.type == "admin") {
    //     if (req.user == null) {
    //         res.json({
    //             message: "Please login as administrator to create admin account"
    //         })
    //         return
    //     }
    //     if (req.user.type != "admin") {
    //         res.json({
    //             message: "Please login as administrator to create admin account"
    //         })
    //         return
    //     }
    // }
    newUserData.password = bcrypt.hashSync(newUserData.password, 10);

    console.log(newUserData);

    const user = new User(newUserData);
    user.save().then(() => {
        res.json({
            message: "User Created"
        });
    }).catch((error) => {
        console.log(error);
        res.json({
            message: "User not created",
        });
    });
    // const user = new User(req.body);
    // user.save().then(() => {
    //     res.json({
    //         message: "User Created"
    //     });
    // }).catch(() => {
    //     res.json({
    //         message: "User not created",
    //     });
    // });
}
export function loginUser(req, res) {
    // User.find(({ email: req.body.email })).then(
    //     (users) => {
    //         res.json(users)
    // })
    User.find(({ email: req.body.email })).then(
        (users) => {
            if (users.length == 0) {
                res.json({
                    message: "User not found"
                });
            } else {
                const user = users[0];
                const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);
                if (isPasswordCorrect) {
                    const token = jwt.sign({
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        isBlocked: user.isBlocked,
                        type: user.type,
                        profilePicture: user.profilePicture,
                    }, process.env.SECRET);
                    res.json({
                        message: "User loged in",
                        token: token,
                        user: {
                            firstName: user.firstName,
                            lastName: user.lastName,
                            isBlocked: user.isBlocked,
                            type: user.type,
                            profilePicture: user.profilePicture,
                            email: user.email,
                        }
                    })
                } else {
                    res.json({
                        message: "User not logged in(wrong password)"
                    })
                }
            }
        })
}

export function isAdmin(req) {
    if (req.user == null) {
        return false
    }
    if (req.user.type != "admin") {
        return false
    }
    return true
}

export function isCustomer(req) {
    if (req.user == null) {
        return false
    }
    if (req.user.type != "customer") {
        return false
    }
    return true
}