import jwt from "jsonwebtoken";
import {config} from 'dotenv';
import {TOKEN_SECRET} from "../config.js";
import {findTokenrOne} from "../controllers/github.controller.js";

config()

export const verifyToken = async (req, res, next) => {
    const token = req.cookies.jwt;
    try {
        //console.log(token);
        if (!token) {
            return res.status(403).json({message: "No token provided"});
        }
        const secretkey = TOKEN_SECRET
        const decoded = jwt.verify(token, secretkey);
        const token_find = await findTokenrOne(decoded.token_name)
        next();
    } catch (error) {
        return res.status(401).json({message: "Unauthorized"});
    }
};


export const deleteToken = async (req, res) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(403).json({error: null, message: "You are not logged in!"});
        }
        const secretkey = TOKEN_SECRET
        const decoded = jwt.verify(token, secretkey);
        const token_find = await findTokenrOne(decoded.token_name)
        //req.user = user;
        //console.log(token_find);
        if (!token_find) {
            return res.status(401).json({error: null, message: "Unauthorized, Token not foud or no is log in!"});
        }
        res.cookie('jwt', '', {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            expires: new Date(0) // Fecha de expiración en el pasado
        });
        res.cookie('connect.sid', '', {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            expires: new Date(0) // Fecha de expiración en el pasado
        });
        req.session.destroy((err) => {
            if (err) {
                console.error(err);
            }
        });
        res.status(200).json({error: null, message: "Logout successfully! Bye, come back soon! 👋"})
    } catch (error) {
        res.status(200).json({error: error.message, message: "Error token: " + error.message});
    }
}
