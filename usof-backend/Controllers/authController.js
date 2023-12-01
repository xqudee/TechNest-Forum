require('dotenv').config()
const bcrypt = require('bcryptjs')
const db = require('../db')
const User = require('../models/userModel')
const Checker = require('../helpers/checkAuthData');
const { CheckData } = require('../helpers/checkAuthData');
const { generateHashedPassword, jwtGenerator, generatePasswordToken, userStatus, issueTokenPair } = require('../helpers/helperFunctions');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const userStatusEnum = require('../Enums/userStatusEnum');

function insertIntoDB(res, registerQuery, registerValues, data) {
    db.execute(registerQuery, registerValues)
    .then(async (response) => {
        if (response[0].affectedRows > 0) {
            const { login, role, email } = data;
            const avatarName = 'user';
            const avatarUrl = './public/avatars/' + avatarName + '.svg';

            const { refreshToken, accessToken } = issueTokenPair(data);

            const user = new User();
            const userInfo = await user.getUserByEmail(email);

            db.execute(`INSERT INTO avatars (file, size, path, user_id) VALUES (?, ?, ?, ?)`, [`user.svg`, 0, `${avatarUrl}`, userInfo[0][0].id])
            .then(resp => {
                if (resp[0].affectedRows > 0) {
                    res.cookie('accessToken', accessToken, { httpOnly: true, expiresIn: '1h' })
                    return res.status(200).json({ message: "Success", accessToken: accessToken, refreshToken: refreshToken, user: userInfo[0][0] })
                } else {
                    return res.status(404).json({ error: "Avatar was not updated" });
                }
            });
        } else {
            return res.status(404).json({ error: "Registration failed" })
        }
    })
    .catch(() => { return res.status(404).json({ error: "Such data is already in use" }) })
}

class Authentication {
    
    async register(req,res) {
        const {login, password, name, email } = req.body

        if(!login || !email || !name || !password) {
            return res.status(404).json({ error: "You should fill all information" })
        }

        await Checker.checkDataFunc(res, login, password, name, email)
        .then(async (response) => {
            if (response.error) {
                return res.status(500).json({ error: response.error });
            }
            else {
                try {
                    const hashedPassword = await generateHashedPassword(password);

                    const user = new User();
        
                    user.getUsers()
                    .then((listOfUsers) => {
                        const registerQuery = `INSERT INTO users (login, email, name, password, role, photo)
                                            VALUES (?, ?, ?, ?, ?, ?);`;
                        
                        let role = '';
                        let id = 1;


                        if (listOfUsers[0].length === 0) {
                            role = 'admin'
                        } else {
                            role = 'user'
                            id = listOfUsers[0][0].id
                        }

                        const registerValues = [login, email, name, hashedPassword, role, 'user.svg'];
                        const data = { id: id, login: login, email: email, role: role };
                        
                        return insertIntoDB(res, registerQuery, registerValues, data);
                    })
                    .catch((error) => { return res.status(404).json({ error: error.message }) })
                } catch (error) {
                    return res.status(404).json({ message: "Error during registration", error: error.message });
                }
            }
        });
    }
  
    async login(req, res) {
        const { loginOrEmail, password } = req.body;

        if (!loginOrEmail || !password) {
            return res.status(404).json({ error: "Please provide both login and password" });
        }

        try {
            const user = new User();
            const userDataLogin = await user.getUserByLogin(loginOrEmail);
            const userDataEmail = await user.getUserByEmail(loginOrEmail);

            if ((!userDataLogin[0][0] || userDataLogin[0].length === 0) && (!userDataEmail[0][0] || userDataEmail[0].length === 0)) {
                return res.status(404).json({ error: "User not found" });
            }

            let userData = userDataLogin;
            if (userDataEmail[0][0]) userData = userDataEmail

            const hashedPassword = userData[0][0].password;
            const isPasswordValid = await bcrypt.compare(password, hashedPassword);

            if (isPasswordValid) {
                const { refreshToken, accessToken } = issueTokenPair(userData[0][0]);
                res.cookie('accessToken', accessToken, { httpOnly: true, expiresIn: '1h' })

                return res.status(200).json({ message: "Login successful", refreshToken: refreshToken, accessToken: accessToken, user: userData[0][0] });
            } else {
                return res.status(404).json({ error: "Incorrect password" });
            }
        } catch (error) {
            console.error("Error during login: ", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
  
    async logout(req, res) {
        try {
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            return res.status(200).json({ message: "Logout successful" });
        } catch (error) {
            console.error("Error during logout: ", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async comparePasswords(req, res) {
        const { inputPassword, hashedPassword } = req.body;

        const isPasswordMatch = await bcrypt.compare(inputPassword, hashedPassword);
        if (isPasswordMatch) return res.status(200).json({ message: "Success" });
        else return res.status(200).json({ message: "Fail" });
    }
  
    async passwordReset(req, res) {
        const { email } = req.body

        if (!email) {
            return res.status(404).json({ error: "Enter the email" });
        }
        const user = new User();

        user.getUserByEmail(email)
        .then(resp => {
            console.log(resp);
            if (resp[0][0] == null) {
                return res.status(404).json({ error: "Error found email" })
            } else {
                const { passToken } = generatePasswordToken(email);

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'annamorozenko2004@gmail.com',
                        pass: 'rcqf fjuy szxo ybnc'
                    }
                });

                const mailOptions = {
                    from: 'annamorozenko2004@gmail.com',
                    to: email,
                    subject: 'Sending EMAIL to reset your password',
                    text: `To change password copy this token: ${passToken}` 
                }

                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        res.status(400).json({message: "Bad email"});
                    }
                    else {
                        res.status(200).json({message: 'Email sent: ' + info.response});
                    }
                });
            }
        }).catch(() => { return res.status(404).json({ error: "User with such email not found" }) })
    }
  
    async confirmPasswordReset(req, res) {
        const { confirm_token } = req.params;
        const { password } = req.body;

        if (!confirm_token || !password) {
            return res.status(404).json({ error: "Enter the confirm_token and new password" });
        }

        const decode = jwt.verify(confirm_token, process.env.SECRETKEY || 'ucode')
        const email = decode.email;
        const user = new User();

        if (!(new CheckData().checkEmail(email))) {
            return res.status(404).json({ error: "Bad email" });
        }

        user.updatePasswordByEmail(password, email)
        .then(resp => {
            if (resp[0].affectedRows > 0) {
                return res.status(200).json({ message: "Your password was changed" })
            }
            else {
                return res.status(404).json({ error: "Something went wrong" })
            }
        }).catch((error) => { return res.status(404).json({ error: error.message }) })
    }
    
    async isToken(req, res) {
        const status = userStatus(req);

        if (status === userStatusEnum.GUEST) return false;
        else return true;
    }

    async checkToken(req, res) {
        const token = req.params.token;
        const currentTimestamp = Date.now() / 1000;

        if (token.exp && token.exp < currentTimestamp) {
            console.log('token dead');
            res.status(401, { message:`token dead` }, res);
        } else {
            res.status(200, { message:`token alive` }, res);
        }
    }

    async refreshToken(req, res) {
        const token = req.params.refreshToken;

        if (!token || token == 'null' || token == 'undefined') {
            return res.status(401).json({ message: 'Refresh token is missing' });
        }

        try {
            const decoded = jwt.verify(token, process.env.REFRESH_SECRET_KEY || 'ucode');

            const user = await new User().getUserById(decoded.id);
            const userInfo = user[0][0];

            const { accessToken, refreshToken } = issueTokenPair(decoded);

            res.cookie('accessToken', accessToken, { httpOnly: true, expiresIn: '1h' });
            res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken, user: userInfo });
        } catch (error) {
            return res.status(401).json({ error: error.message });
        }

    }
}
  
  module.exports = Authentication