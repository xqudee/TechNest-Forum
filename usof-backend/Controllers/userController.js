

const User = require('../models/userModel')
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const db = require('../db');
const CheckData = require('../helpers/checkAuthData');
const { generateHashedPassword, jwtGenerator, deleteFile, issueTokenPair } = require('../helpers/helperFunctions');
const { getAuthUserInfo } = require('../helpers/helperFunctions');
const userStatusEnum = require('../Enums/userStatusEnum');

class UserController {

    async getUsers(req, res) {
        try {
            const [rows] = await db.execute(`SELECT * from users`);

            if (rows.length > 0) {
                return res.status(200).json({ message: "List of users", data: rows });
            } else {
                return res.status(404).json({ message: "Error getting users" });
            }
        } catch (error) {
            console.error("Error while fetching users:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async getUserByID(req, res) {
        try {
            const { user_id } = req.params;

            const user = new User();

            const response = await user.getUserById(user_id);
            const userData = response[0][0];

            if (userData) {
                res.status(200).json({ data: userData });
            } else {
                res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            console.error("Error while fetching user: ", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async createUser(req, res) {
        try {
            const { login, password, email, role } = req.body;
            let { name }= req.body;
            let photo = 'user.svg';

            if (req.files) {
                photo = req.files.photo;
            }

            if (name == '') name = 'none';

            const checkData = await CheckData.checkDataFunc(res, login, password, name, email);
            if (checkData.error) return res.status(404).json({ error: checkData.error });
            else {
                if (role) {
                    const hashedPassword = await generateHashedPassword(password);
                    
                    let avatar = 'user.svg'
                    if (photo != 'user.svg') {
                        avatar = uuid.v4()+ ".jpg";
                        photo.mv(`./public/avatars/${avatar}`);
                    }

                    const newUser = new User(login, hashedPassword, name, email, avatar, 0, role);
                    await newUser.addNew()
                    .then(async (response) => {
                        if (response[0].affectedRows > 0) {
                            const user = new User()
                            const userInfo = await user.getUserByEmail(email);

                            db.execute(`INSERT INTO avatars (file, size, path, user_id) VALUES (?, ?, ?, ?)`, [avatar, photo.size || 0, `./public/avatars/${avatar}`, userInfo[0][0].id])
                            .then(async resp => {
                                if (resp[0].affectedRows > 0) {
                                    const newInfo = (await user.getUserByLogin(login))[0][0];
                                    const { accessToken, refreshToken } = issueTokenPair(newInfo);

                                    return res.status(200).json({ message: "User created", data: newInfo, accessToken: accessToken })
                                } else {
                                    return res.status(200).json({ error: "Avatar was not updated. User creation failed" });
                                }
                            }).catch(error => { console.log(error); return res.status(404).json({ error: error.message })});
                        }
                        else {return res.status(404).json({ error: "User isn't created" })}
                    })
                    .catch(error => { console.log(error); return res.status(404).json({ error: error.message })})
                }
                else {
                    res.status(500).json({ error: "User isn't created" });
                }
            }

        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getAvatar(req, res) {
        const { user_decoded_id } = getAuthUserInfo(req);

        const user = new User();
        user.getAvatar(user_decoded_id)
        .then((response) => {
            if (response[0][0] != null) {
                return res.status(200).json({ message: "Avatar", data: response[0][0] });
            } else {
                return res.status(200).json({ message: "Avatar does not exist" });
            }
        }).catch(err => {
            return res.status(404).json({ error: err.message });
        });

    }

    async updateAvatar(req, res) {

        const { user_id } = req.params;
        let photo;
        if (req.files) photo = req.files.photo;

        if (!photo) {
            return res.status(404).json({ message: "Please provide a valid avatar image" })
        }

        const { user_decoded_id, user_decoded_role } = getAuthUserInfo(req);

        if (user_decoded_id == user_id || user_decoded_role == userStatusEnum.ADMIN) {
            const user = new User();

            const userInfo = await user.getUserById(user_id);
            deleteFile(`./public/avatars/${userInfo.photo}`)

            const avatar = uuid.v4() + ".jpg";

            photo.mv(`./public/avatars/${avatar}`);

            user.updateAvatar(avatar, user_id)
            .then(response => {
                if (response[0].affectedRows > 0) {
                    db.execute(`INSERT INTO avatars (file, size, path, user_id) VALUES (?, ?, ?, ?)`, [avatar, photo.size, `./public/avatars/${avatar}`, user_id])
                    .then(resp => {
                        if (resp[0].affectedRows > 0) {
                            return res.status(200).json({ message: "Avatar was updated", data: resp[0] });
                        } else {
                            return res.status(404).json({ message: "Avatar was not updated" });
                        }
                    });
                } else {
                    return res.status(404).json({ message: "Avatar was not updated" });
                }
            })
            .catch(err => {
                return res.status(404).json({ error: err.message });
            });
        } else {
            return res.status(404).json({ message: "Access error" });
        }
    }

    async updateUserData(req, res) {
        let { login, email, name, password, role, about } = req.body;
        let { user_id } = req.params;
        const { user_decoded_id, user_decoded_role } = getAuthUserInfo(req);

        let updated = false;

        console.log(name);

        if (user_decoded_id == user_id || user_decoded_role == userStatusEnum.ADMIN) {
            const user = new User();

            const fieldsToUpdate = [
                { field: login, updateFunction: user.updateLogin, name: "login" },
                { field: email, updateFunction: user.updateEmail, name: "email" },
                { field: name, updateFunction: user.updateFullName, name: "name" },
                { field: password, updateFunction: user.updatePassword, name: "password" },
                { field: role, updateFunction: user.updateRole, name: "role" },
                { field: about, updateFunction: user.updateAbout, name: "about" },
            ];

            const updatePromises = fieldsToUpdate
            .filter(fieldInfo => fieldInfo.field !== undefined)
            .map(fieldInfo => {
                if (user_decoded_id != user_id && fieldInfo.name !== 'role') return;
                if (user_decoded_role != userStatusEnum.ADMIN && fieldInfo.name === 'role') return;
                return fieldInfo.updateFunction(fieldInfo.field, user_id).then(data => {
                    if (data != null && data[0].affectedRows > 0) {
                        updated = true;
                    }
                }).catch(error => {
                    console.error(`Error updating ${fieldInfo.name}:`, error);
                });
            });

            Promise.all(updatePromises)
            .then(() => {
                if (updated) {
                    return res.status(200).json({ message: "Fields were updated" });
                } else {
                    return res.status(404).json({ message: "No fields were updated" });
                }
            })
            .catch(() => {
                return res.status(404).json({ message: "Error during update" });
            });
        } else {
            return res.status(404).json({ message: "Access error" });
        }

    }

    async deleteUser(req, res) {
        const { user_id } = req.params;
        const { user_decoded_id, user_decoded_role } = getAuthUserInfo(req);

        if (user_decoded_id == user_id || user_decoded_role == userStatusEnum.ADMIN) {
            const user = new User();

            user.deleteUser(user_id)
            .then(resp => {
                if (resp[0].affectedRows > 0) return res.status(200).json({ message: "User was deleted", data: resp[0] })
                else { return res.status(404).json({ message: "User wasn't deleted, because something went wrong" }) }
            }).catch(error => res.status(404).json({ error: error.message }))
        } else {
            return res.status(404).json({ message: "Access error"})
        }
    }

    async getBlockedPost(req, res) {
        const { user_id } = req.params;
        const { user_decoded_id } = getAuthUserInfo(req);

        if (user_decoded_id == user_id) {
            const user = new User();

            user.getBlockedPost(user_id)
            .then(resp => {
                if (resp[0][0] != null) return res.status(200).json({ message: "Blocked posts", data: resp[0] })
                else { return res.status(200).json({ message: "Posts not found" }) }
            }).catch(error => res.status(404).json({ error: error.message }))
        } else {
            return res.status(404).json({ message: "Access error"})
        }
    }

    async getUserPosts(req, res) {
        const { user_id } = req.params;

        const user = new User();

        user.getUserPosts(user_id)
        .then(resp => {
            if (resp[0][0] != null) return res.status(200).json({ message: "User posts", data: resp[0] })
            else { return res.status(200).json({ message: "Posts not found" }) }
        }).catch(error => res.status(404).json({ error: error.message }))
    }

    async getUserFavoriteAuthors(req, res) {
        const { user_id } = req.params;

        const user = new User();

        user.getUserFavoritesAuthors(user_id)
        .then(resp => {
            if (resp[0].length  > 0) {
                return res.status(200).json({ message: `User's favorites authors`, data: resp[0] })
            }
            else {
                return res.status(200).json({ message: "Error found user or favorites" })
            }
        }).catch(error => { return res.status(404).json({ Error: error.message }) });
    }

    async getUserFollowers(req, res) {
        const { user_id } = req.params;

        const user = new User();

        user.getUserFollowers(user_id)
        .then(resp => {
            if (resp[0].length  > 0) {
                return res.status(200).json({ message: `User's folowers`, data: resp[0] })
            }
            else {
                return res.status(200).json({ message: "Error found user or followers" })
            }
        }).catch(error => { return res.status(404).json({ Error: error.message }) });
    }

    async addToFavorite(req, res) {
        const { author_id } = req.params;
        const { user_decoded_id } = getAuthUserInfo(req);
        const user = new User();

        if (author_id == user_decoded_id) {
            return res.status(404).json({ error: "You can't add yourself in favotites" })
        }

        user.checkUserFavoritesAuthors(user_decoded_id, author_id)
        .then(async response => {
            if (response[0][0] != null) {
                user.deleteAuthorFromFavorites(user_decoded_id, author_id)
                .then(resp => {
                    if (resp[0].affectedRows > 0) res.status(200).json({ message: "Author was deleted from favorites", data: resp[0] });
                    else res.status(404).json({ error: "Author wasn't delete from favorites" })
                });
            } else {
                user.addAuthorToFavorite(user_decoded_id, author_id)
                .then(resp => {
                    if (resp[0].affectedRows > 0) res.status(200).json({ message: "Author was added to favorites", data: resp[0] });
                    else res.status(404).json({ error: "Author wasn't added from favorites" })
                });
            }
        })
    }

    async deleteFromFavorite(req, res) {
        const { author_id } = req.params;
        const { user_decoded_id } = getAuthUserInfo(req);

        const user = new User();

        user.deleteAuthorFromFavorites(user_decoded_id, author_id)
        .then(resp => {
            if (resp[0].affectedRows > 0) {
                res.status(200).json({ message: `Author was deleted from favorites`, data: resp[0] })
            }
            else {
                return res.status(404).json({ message: "Author wasn't delete from favorites" })
            }
        }).catch(error => { return res.status(404).json({ Error: error.message }) });
    }

}

module.exports = new UserController()