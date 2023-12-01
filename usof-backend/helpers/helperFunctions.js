const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const userStatusEnum = require('../Enums/userStatusEnum');
const fs = require('fs');

async function generateHashedPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword
}


function userStatus(req) {
    const token = req.cookies.accessToken;

    if (!token) {
        return userStatusEnum.GUEST;
    } else {
        const { user_decoded_role } = getAuthUserInfo(req);
        return user_decoded_role;
    }
}

function issueTokenPair(data) {
    const refreshToken = jwtGenerator(data, "15d")

    const accessToken = jwtGenerator(data, "1h")

    return { refreshToken, accessToken };
}

function jwtGenerator(data, expiresIn = '1h') {
    const { id, login, email, role } = data;
    const payload = {
        id,
        login,
        email,
        role,
    };
    const options = { expiresIn: expiresIn };
    const secretKey = process.env.SECRETKEY || 'ucode'; 

    return jwt.sign(payload, secretKey, options);
}

function generatePasswordToken(email) {
    const payload = {
        id: uuidv4(),
        type: 'password',
        email: email
    };

    const options = { expiresIn: '12h' };
    const secretKey = process.env.SECRETKEY || 'ucode'; 
    const token = jwt.sign(payload, secretKey, options);

    return { passId: payload.id, passToken: token };
}

function getAuthUserInfo(req) {
    try {
        const token = req.cookies.accessToken;
        const decoded = jwt.verify(token, process.env.SECRETKEY || 'ucode');
        const { id, role } = decoded; 
        return { user_decoded_id: id, user_decoded_role: role };
    } catch (error) {
        return {user_decoded_role: userStatusEnum.GUEST };
    }
}

function deleteFile(path) {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
        console.log(`Старый файл (${path}) удален.`);
    }
}

module.exports = {generateHashedPassword, issueTokenPair, userStatus, jwtGenerator, generatePasswordToken, getAuthUserInfo, deleteFile}