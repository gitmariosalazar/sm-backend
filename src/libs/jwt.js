import jwt from "jsonwebtoken";
import {TOKEN_SECRET} from "../config.js";

import {config} from 'dotenv';
import moment from 'moment';


config()


// Lista negra de tokens inválidos
let blacklistedTokens = [];

// Función para agregar un token a la lista negra
function addToBlacklist (token) {
    blacklistedTokens.push(token);
}

// Función para verificar si un token está en la lista negra
function isBlacklisted (token) {
    return blacklistedTokens.includes(token);
}

function convertirStringAFecha (fechaString) {
    const fecha = new Date(fechaString);
    if (isNaN(fecha) || fecha.toString() === "Invalid Date") {
        return null;
    }
    return fecha;
}

export {
    addToBlacklist, isBlacklisted, convertirStringAFecha
}

const secret_key = TOKEN_SECRET
export function createAccessToken (payload) {

    return new Promise((resolve, reject) => {
        jwt.sign(
            payload, secret_key, {expiresIn: "1h"}, (err, token) => {
                if (err) reject(err)
                resolve(token)
            }
        )
    })
}

export const createToken = (user) => {
    try {
        const token = jwt.sign({
            id: user._id,
            username: user.username,
            email: user.email,
            name: user.displayName,
            photo: user.photo,
            provider: user.provider
        }, TOKEN_SECRET, {expiresIn: '1h'});
        return token
    } catch (error) {
        console.log(error);
    }
}

export const createTokenGitHub = (id, token_github, token_name, expire_days) => {
    try {
        const expirationDate = moment().add(expire_days, 'days').toISOString();
        const token = jwt.sign({
            _id: id,
            token_github: token_github,
            token_name: token_name,
            description: 'This token will used to search repositories on Git Hub',
            expire_days: expire_days,
            expire_date: expirationDate,
            status: 'disabled'
        }, TOKEN_SECRET, {expiresIn: '30d'})
        return token
    } catch (error) {
        console.log(error);
    }
}
