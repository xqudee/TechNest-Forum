
const PostModel = require('../Models/PostModel');
const CategoryModel = require('../Models/CategoryModel');
const CommentModel = require('../Models/CommentModel');
const { getAuthUserInfo, checkAuth, userStatus, deleteFile } = require('../helpers/helperFunctions');
const userStatusEnum = require('../Enums/userStatusEnum');
const User = require('../models/userModel');
const uuid = require('uuid');
const db = require('../db');

const DEFAULT_SORT = 'date';

function checkDateInterval(startDate, endDate) {

    const today = new Date();
    let regexp = new RegExp(
        "^([1-2][0-9]|0?[1-9]|3[01])-(1[0-2]|0?[1-9])-(\\d{1,3}|[0-1]\\d\\d\\d|20[0-1]\\d|202[0-" + today.getFullYear() % 10 + "])$"
      );
      
    if (startDate && !startDate.match(regexp) || endDate && !endDate.match(regexp)){
        return {
            status: false,
            dateMessage: "Input startDate and endDate in style: DD-MM-YYYY"
        }
    }

    if (startDate && endDate){
        const arrStart = startDate.split('-');
        const arrFinish = endDate.split('-');

        const start = new Date(`${arrStart[2]}-${arrStart[1]}-${arrStart[0]}`);
        const finish = new Date(`${arrFinish[2]}-${arrFinish[1]}-${arrFinish[0]}`);
        if (finish.getTime() < start.getTime()){
            return {
                status: false,
                dateMessage: "Input 'endDate' which bigger than 'startDate'"
            }
        } else {
            const today = new Date();
            if (start.getTime() > today.getTime()) {
                return {
                    status: false,
                    dateMessage: "Input 'startDate' bigger than today date"
                }
            }
            
        }
    }
    return { status: true };
}

class PostController {
    async createPost(req, res) {
        const { title, content } = req.body;
        let { categories } = req.body;

        console.log(categories);

        if (!title || !content === 0) {
            return res.status(404).json({ error: "Fill all information" });
        }

        if (!categories || categories.length === 0) {
            categories = [];
            const res = await CategoryModel.getCategoryByName("Uncategorized");
            categories.push(res[0][0]);
        }
    
        try {
            const { user_decoded_id } = getAuthUserInfo(req);

            const resPost = await PostModel.createPost(user_decoded_id, title, content);
            const post_id = resPost[0].insertId;

            if (resPost[0].affectedRows > 0) {
                let err = false;
                categories.forEach(async category => {
                    const response = await PostModel.linkPostToCategories(post_id, category.id);
                    if (response[0].affectedRows <= 0) {
                        err = true;
                    }
                });
                if (!err) return res.status(200).json({ message: "Post created" });
                else return res.status(404).json({ error: "Error creating post" });
            } else {
                return res.status(404).json({ error: "Error creating post" });
            }

        } catch (error) {
            return res.status(404).json({ error: error.message });
        }
    }

    // async getAllPosts(req, res) {
    //     PostModel.getAllPosts()
    //     .then((resp) => {
    //         if (resp[0].length > 0) {
    //             return res.status(200).json({ message: "Posts", data: resp[0] })
    //         }
    //         else {
    //             return res.status(404).json({ message: "Error getting posts" })
    //         }
    //     })
    //     .catch(error => { return res.status(404).json({ Error: error.message }) });;
    // }

    // async getPosts(req, res) {
    //     let { sort } = req.query;
    //     const { startDate, endDate } = req.query;
    //     const { categories } = req.query;
    //     let status = userStatus(req);
    //     let response;

    //     if (status === 'guest') {
    //         response = await PostModel.getAllPostsForGuest();
    //     } else {
    //         const { user_decoded_id, user_decoded_role } = getAuthUserInfo(req);

    //         if (!sort) sort = 'rating';
    //         else if (sort != 'rating' && sort != 'date') {
    //             return res.status(404).json({ error: "No such type of sorting" });
    //         }
    
    //         let dateFilter = [];
    //         let сategoryFilter = [];
    
    //         if (startDate && endDate) {
    //             const { status, dateMessage } = checkDateInterval(startDate, endDate);
    //             if (!status) {
    //                 return res.status(404).json({message: dateMessage})
    //             }
    //             dateFilter.push(startDate);
    //             dateFilter.push(endDate);
    //         }
    
    //         if (categories) {
    //             сategoryFilter = categories.split(',').map(category => category.trim());
    //         }
    //         response = await PostModel.getAllPosts(user_decoded_role, user_decoded_id, sort, dateFilter, сategoryFilter);
    //     }

        
    //     if (response) {
    //         return res.status(200).json({ message: "Posts", data: response[0] });
    //     } else {
    //         return res.status(404).json({ error: "Error getting posts" });
    //     }
    // }


    async getPosts(req, res) {
        // let { sort } = req.query;
        const { startDate, endDate } = req.query;
        const { categories } = req.query;
        let status = userStatus(req);
        let response;

        // if (!sort) sort = DEFAULT_SORT;
        // else if (sort != 'rating' && sort != 'date') {
        //     return res.status(404).json({ error: "No such type of sorting" });
        // }

        let dateFilter = [];
        let сategoryFilter = [];

        if (startDate && endDate) {
            const { status, dateMessage } = checkDateInterval(startDate, endDate);
            if (!status) {
                return res.status(404).json({error: dateMessage})
            }
            dateFilter.push(startDate);
            dateFilter.push(endDate);
        }

        if (categories) {
            сategoryFilter = categories.split(',').map(category => category.trim());
        }

        let role;
        let authId = 0;

        if (status === userStatusEnum.GUEST) {
            role = userStatusEnum.GUEST;
        } else {
            const { user_decoded_id, user_decoded_role } = getAuthUserInfo(req);
            role = user_decoded_role;
            authId = user_decoded_id;
        }

        // response = await PostModel.getAllPosts(role, authId, sort, dateFilter, сategoryFilter);
        response = await PostModel.getAllPosts(role, authId, dateFilter, сategoryFilter);

        if (response) {
            response[0].forEach(post => {
                if (post.post_categories?.includes('Uncategorized')) post.post_categories = [];
                else post.post_categories = [...new Set(post.post_categories?.split(','))];
            })
            return res.status(200).json({ message: "Posts", data: response[0] });
        } else {
            return res.status(404).json({ error: "Error getting posts" });
        }
    }

    async getPost(req, res) {
        const { post_id } = req.params;

        PostModel.getPostById(post_id)
        .then(resp => {

            if (resp[0].length > 0) {
                resp[0][0].post_categories = resp[0][0].post_categories?.split(',');
                return res.status(200).json({ message: "Post", data: resp[0][0] })
            }
            else {
                return res.status(200).json({ error: "Post not found" })
            }
        }).catch(error => { return res.status(404).json({ error: error.message }) });
    }

    async getPostByName(req, res) {
        const { title, substring } = req.query; 

        let resp;

        if (title) {
            resp = await PostModel.getPostByName(title)
        }

        if (substring) {
            resp = await PostModel.getPostBySubstring(substring)
        }

        if (resp) {
            if (resp[0].length > 0) {
                return res.status(200).json({ message: "Success", data: resp[0] })
            } else {
                return res.status(200).json({ error: "Post wasn't found" });
            }
        } else {
            return res.status(404).json({ error: "Error with db" });
        }
    }

    async updatePost(req, res) {
        const { post_id } = req.params;
        const { title, content, type } = req.body;
        let { categories } = req.body;
        const { user_decoded_id, user_decoded_role } = getAuthUserInfo(req);

        console.log(categories);


        if (!categories || categories.length === 0) {
            categories = [];
            const res = await CategoryModel.getCategoryByName("Uncategorized");
            categories.push(res[0][0]);
        }
    
        console.log(categories);

        const postInfo = await PostModel.getPostById(post_id);
        const authorId = postInfo[0][0].user_id;
        const postType = postInfo[0][0].type;

        
        let updated = false;
        let message = "no errors";

        if (type) {
            if (user_decoded_role === userStatusEnum.ADMIN) {
                const typeResponse = await PostModel.updateType(type, post_id);
                if (typeResponse) {
                    updated = true;
                }
                else {
                    message = "Error updating type"
                }
            } else {
                message = "You can't change type. You are not admin"
            }
        }

        if (postType === 'inactive' && type != 'active' && user_decoded_role === userStatusEnum.ADMIN) {
            return res.status(405).json({ message: "You can't update inactive post" })
        } 

        if (title || content) {
            if (user_decoded_id === authorId) {
                if (title) {
                    const titleResponse = await PostModel.updateTitle(title, post_id);
                    if (titleResponse) {
                        updated = true;
                    }
                    else {
                        message = "Error updating title"
                    }
                }
                if (content) {
                    const contentResponse = await PostModel.updateContent(content, post_id);
                    if (contentResponse) {
                        updated = true;
                    }
                    else {
                        message = "Error updating content"
                    }
                }
            } else {
                message = "You can't change title and content. You are not the author" ;
            }
        }
    
        if (categories && categories.length > 0) {
            let isCategoryAccess = true;

            if (user_decoded_role === userStatusEnum.USER) {
                if (user_decoded_id !== authorId) {
                    isCategoryAccess = false
                }
            }

            if (isCategoryAccess) {
                const clearCategoriesResponse = await PostModel.deleteCategoriesByPostId(post_id);
                
                if (clearCategoriesResponse) {

                    categories.forEach(async category => {
                        const response = await PostModel.linkPostToCategories(post_id, category.id);
                        if (response[0].affectedRows <= 0) {
                            err = true;
                        }
                    });
                }
            } else {
                message = "You can't change categories. You are not the author or admin" ;
            }
        }

        if (updated) {
            return res.status(200).json({ message: "Fields were updated", not_updated: message });
        } else {
            return res.status(404).json({ error: message });
        }
    }

    async createPostComment(req, res) {
        const { content } = req.body;
        const { post_id } = req.params;
        const { user_decoded_id, user_decoded_role } = getAuthUserInfo(req);

        if (!content || !post_id)  {
            return res.status(404).json({ error: "Fill all required information" });
        }

        const postInfo = await PostModel.getPostById(post_id);
        const postType = postInfo[0][0].type;

        if (postType === 'inactive' && user_decoded_role !== userStatusEnum.ADMIN) {
            return res.status(404).json({ error: "You can't create comments under inactive posts" });
        }

        CommentModel.createComment(content, user_decoded_id, post_id)
        .then(resp => {
            if (resp[0].affectedRows > 0) {
                return res.status(200).json({ message: "Comment was created", data: resp[0] })
            }
            else {
                return res.status(404).json({ error: "Error creating comment" })
            }
        }).catch(error => { return res.status(404).json({ error: error.message }) });
    }

    async getPostComments(req, res) {
        const { post_id } = req.params;

        CommentModel.getCommentByPostId(post_id)
        .then(resp => {
            if (resp[0].length > 0) {
                return res.status(200).json({ message: "Comment", data: resp[0] })
            }
            else {
                return res.status(200).json({ error: "Error found comments" })
            }
        }).catch(error => { return res.status(404).json({ error: error.message }) });
    }

    async getPostCategories(req, res) {
        const { post_id } = req.params;

        CategoryModel.getCategoriesByPostId(post_id)
        .then(resp => {
            if (resp[0].length > 0) {
                return res.status(200).json({ message: "Post categories", data: resp[0] })
            }
            else {
                return res.status(200).json({ error: "Error found post categories" })
            }
        }).catch(error => { return res.status(404).json({ error: error.message }) });
    }

    async createPostLike(req, res) {
        const { post_id } = req.params;
        const { type } = req.body;

        const postInfo = await PostModel.getPostById(post_id);
        if (postInfo[0].length === 0) {
            return res.status(404).json({ error: "Post wasn't found" })
        }
        if (postInfo[0][0].type === 'inactive') {
            return res.status(404).json({ error: "Post is inactive" })
        }

        const { user_decoded_id } = getAuthUserInfo(req);
        if (type != 'dislike' && type != 'like') {
            return res.status(404).json({ error: "Invalid type" })
        }

        PostModel.checkPostType(user_decoded_id, post_id)
        .then(async resp => {
            let updated = false;
            let message = "no errors";
            let oldType;

            if (resp[0][0] != null) {
                const oldPostType = resp[0][0].type;

                const delResponse = await PostModel.deletePostLike(user_decoded_id, post_id);
                if (delResponse) {
                    updated = true;
                    oldType = oldPostType;
                } else {
                    message = "Post wasn't unliked";
                }
            } 

            const user = new User();
            const postInfo = await PostModel.getPostById(post_id);
            const authorId = postInfo[0][0].user_id;

            if (oldType === type) {
                message = "Post was unliked";
                const ratingResp = await PostModel.updatePostRating(post_id);
                if (ratingResp) {
                    const userRatingResp = await user.updateUserRating(authorId);
                    if (userRatingResp) return res.status(200).json({ message: "Unliked", data: resp[0][0] })
                }
                else message = "Rating wasn't update";
            } else {
                const postResponse = await PostModel.createPostLike(user_decoded_id, post_id, type);

                console.log(postResponse);

                if (postResponse) {
                    updated = true;
                } else {
                    message = "Post wasn't liked"
                }

                if (updated) {
                    const ratingResp = await PostModel.updatePostRating(post_id);
                    if (ratingResp) {
                        const userRatingResp = await user.updateUserRating(authorId);
                        if (!userRatingResp) {
                            message = "Rating wasn't update";
                        }
                    }
                    else message = "Rating wasn't update";
                    return res.status(200).json({ message: "Liked", data: postResponse[0][0] })
                } else {
                    return res.status(200).json({ error: message })
                }
            }
        })
        .catch(error => { return res.status(404).json({ Error: error.message }) });
    }

    async getPostLikes(req, res) {
        const { post_id } = req.params;

        PostModel.getAllPostLikes(post_id)
        .then(resp => {
            if (resp[0].length  > 0) {
                return res.status(200).json({ message: `Post likes`, data: resp[0] })
            }
            else {
                return res.status(200).json({ error: "Error found post or likes" })
            }
        }).catch(error => { return res.status(200).json({ error: "Error found post categories" }) });
    }

    async getUserFavoritePosts(req, res) {
        const { user_id } = req.params;
        
        PostModel.getUserPostFavorites(user_id)
        .then(resp => {
            if (resp[0].length  > 0) {
                resp[0].forEach(post => {
                    if (post.post_categories?.includes('Uncategorized')) post.post_categories = [];
                    else post.post_categories = post.post_categories?.split(',');
                })
                return res.status(200).json({ message: `Post favorites`, data: resp[0] })
            }
            else {
                return res.status(200).json({ error: "No favorite posts" })
            }
        }).catch(error => { return res.status(404).json({ error: error.message }) });
    }

    async getPostFavorites(req, res) {
        const { post_id } = req.params;

        PostModel.getPostFavorites(post_id)
        .then(resp => {
            if (resp[0].length  > 0) {
                resp[0].forEach(post => {
                    if (post.post_categories?.includes('Uncategorized')) post.post_categories = [];
                    else post.post_categories = post.post_categories?.split(',');
                })
                return res.status(200).json({ message: `Post favorites`, data: resp[0] })
            }
            else {
                return res.status(200).json({ error: "No favorites in posts" })
            }
        }).catch(error => { return res.status(404).json({ error: error.message }) });
    }

    async addToFavorite(req, res) {
        const { post_id } = req.params;

        const postInfo = await PostModel.getPostById(post_id);
        if (postInfo[0].length === 0) {
            return res.status(404).json({ error: "Post wasn't found" })
        }
        if (postInfo[0][0].type === 'inactive') {
            return res.status(404).json({ error: "Post is inactive" })
        }

        const { user_decoded_id } = getAuthUserInfo(req);

        PostModel.checkPostFavorites(user_decoded_id, post_id)
        .then(async response => {
            if (response[0][0] != null) {
                PostModel.deletePostFromFavorites(user_decoded_id, post_id)
                .then(resp => {
                    if (resp[0].affectedRows > 0) res.status(200).json({ message: "Post was deleted from favorites", data: resp[0] });
                    else res.status(404).json({ error: "Post wasn't delete from favorites" })
                });
            } else {
                PostModel.addToFavorite(user_decoded_id, post_id)
                .then(resp => {
                    if (resp[0].affectedRows > 0) res.status(200).json({ message: "Post was added to favorites", data: resp[0] });
                    else res.status(404).json({ error: "Post wasn't added from favorites" })
                });
            }
        })
    }

    async deleteFromFavorite(req, res) {
        const { post_id } = req.params;
        const { user_decoded_id } = getAuthUserInfo(req);

        PostModel.deletePostFromFavorites(user_decoded_id, post_id)
        .then(resp => {
            if (resp[0].affectedRows > 0) {
                res.status(200).json({ message: `Post was deleted from favorites`, data: resp[0] })
            }
            else {
                return res.status(404).json({ error: "Post wasn't delete from favorites" })
            }
        }).catch(error => { return res.status(404).json({ error: error.message }) });
    }

    async deletePost(req, res) {
        const { post_id } = req.params;

        if (!post_id)  {
            return res.status(404).json({ error: "Fill post id" });
        }
        const { user_decoded_id } = getAuthUserInfo(req);

        const postInfo = await PostModel.getPostById(post_id);
        const authorId = postInfo[0][0].user_id;

        if (user_decoded_id !== authorId) {
            return res.status(404).json({ error: "Access denied. You are not the author" })
        }

        PostModel.deletePost(post_id)
        .then(resp => {
            if (resp[0].affectedRows > 0) {
                return res.status(200).json({ message: `Post was deleted`, data: resp[0] })
            }
            else {
                return res.status(404).json({ error: "Error found post" })
            }
        }).catch(error => { return res.status(404).json({ error: error.message }) });
    }

    async deletePostLike(req, res) {
        const { post_id } = req.params;
        const { user_decoded_id } = getAuthUserInfo(req);

        PostModel.deletePostLike(user_decoded_id, post_id)
        .then(async resp => {
            if (resp[0].affectedRows > 0) {
                const ratingResp = await PostModel.updatePostRating(post_id);
                if (ratingResp) return res.status(200).json({ message: `Post like was deleted`, data: resp[0] })
                else return res.status(404).json({ error: `Rating wasn't update` }) 
            }
            else {
                return res.status(404).json({ error: "Error found post or like" })
            }
        }).catch(error => { return res.status(404).json({ error: error.message }) });
    }

    async getBlockedPost(req, res) {
        const { post_id } = req.params;

        PostModel.getBlockedPost(post_id)
        .then(resp => {
            if (resp[0].length  > 0) {
                return res.status(200).json({ message: `Post favorites`, data: resp[0] })
            }
            else {
                return res.status(200).json({ error: "Error found post or favorites" })
            }
        }).catch(error => { return res.status(404).json({ error: error.message }) });
    }

    async blockPost(req, res) {
        const { post_id } = req.params;
        const { user_decoded_id } = getAuthUserInfo(req);

        PostModel.checkIsBlocked(user_decoded_id, post_id)
        .then(async (response) => {
            if (response[0][0] != null) {
                const delResponse = await PostModel.unblockPost(user_decoded_id, post_id);
                if (delResponse) {
                    return res.status(200).json({ message: `Post was unblocked`, data: delResponse[0] })
                } else {
                    return res.status(200).json({ message: `Post wasn't unblocked`, data: delResponse[0] })
                }
            } else {
                PostModel.blockPost(user_decoded_id, post_id)
                .then(resp => {
                    if (resp[0].affectedRows > 0) {
                        return res.status(200).json({ message: `Post was blocked`, data: resp[0] })
                    }
                    else {
                        return res.status(404).json({ error: "Post wasn't found" })
                    }
                }).catch(error => { return res.status(404).json({ error: "Post wasn't found" }) });
            }

        }).catch(error => { return res.status(404).json({ error: error.message }) });
    }

    async updateCover(req, res) {
        const { post_id } = req.params;
        const { photo } = req.files;

        if (!photo) { return; }

        const { user_decoded_id, user_decoded_role } = getAuthUserInfo(req);
        const postInfo = await PostModel.getPostById(post_id);
        const authorId = postInfo[0][0].user_id;

        if (authorId === user_decoded_id) {
            deleteFile(`./public/post_covers/${postInfo.photo}`)
    
            const cover = uuid.v4() + ".jpg";
    
            photo.mv(`./public/post_covers/${cover}`);

            PostModel.updateCover(cover, post_id)
            .then(response => {
                if (response[0].affectedRows > 0) {
                    db.execute(`INSERT INTO posts_covers (file, size, path, post_id) VALUES (?, ?, ?, ?)`, [cover, photo.size, `./public/post_covers/${cover}`, post_id])
                    .then(resp => {
                        if (resp[0].affectedRows > 0) {
                            return res.status(200).json({ message: "Cover was updated", data: resp[0] });
                        } else {
                            return res.status(404).json({ error: "Cover was not updated" });
                        }
                    });
                } else {
                    return res.status(404).json({ error: "Avatar was not updated" });
                }
            })
            .catch(err => {
                return res.status(404).json({ error: err.message });
            });
        } else {
            return res.status(404).json({ error: "Access error" });
        }
    }

    async deleteCover(req, res) {
        const { post_id } = req.params;

        const { user_decoded_id, user_decoded_role } = getAuthUserInfo(req);
        const postInfo = await PostModel.getPostById(post_id);
        const authorId = postInfo[0][0].user_id;

        if (authorId === user_decoded_id) {
            deleteFile(`./public/post_covers/${postInfo.photo}`)

            PostModel.deleteCover(post_id)
            .then(response => {
                if (response[0].affectedRows > 0) {
                    db.execute(`DELETE FROM posts_covers WHERE post_id = ${post_id}`)
                    .then(resp => {
                        if (resp[0].affectedRows > 0) {
                            return res.status(200).json({ message: "Cover was deleted", data: resp[0] });
                        } else {
                            return res.status(404).json({ error: "Cover was not deleted" });
                        }
                    });
                } else {
                    return res.status(404).json({ error: "Cover was not deleted" });
                }
            })
            .catch(err => {
                return res.status(404).json({ error: err.message });
            });
        } else {
            return res.status(404).json({ error: "Access error" });
        }
    }
}

module.exports = new PostController();