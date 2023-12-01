const User = require("../models/userModel");

class CheckData {
    checkLogin(login) {
        const regex = /^[a-zA-Z]{3,20}$/;
        return regex.test(login);
    }

    checkPassword(password) {
        return password.length >= 5;
    }

    checkEmail(email) {
        const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/; 
        return regex.test(email);
    }

    checkFullName(name) {
        const regex = /^[A-Za-z\s]+$/; 
        return regex.test(name);
    }
}

async function checkDataFunc(res, login, password, full_name, email) {
    const user = new User();

    let userData = await user.getUserByLogin(login);

    if (userData[0][0]) return ({ error: "Such login is already in use" });
    
    userData = await user.getUserByEmail(email);
    if (userData[0][0]) return ({ error: "Such email is already in use" });

    const dataChecker = new CheckData();

    if (!dataChecker.checkLogin(login)) return ({ error: "Incorrect login. Login must contains from 3 to 20 characters." });
    if (!dataChecker.checkPassword(password)) return ({ error: "Incorrect password. Password must contains 5+ characters." });
    if (full_name !== "none" && !dataChecker.checkFullName(full_name)) return ({ error: "Incorrect name." });
    if (!dataChecker.checkEmail(email)) return ({ error: "Incorrect email." });   

    return true;
}

module.exports = {CheckData, checkDataFunc}