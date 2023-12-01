const CategoryModel = require('../Models/CategoryModel');
const PostModel = require('../Models/PostModel');
const { getAuthUserInfo } = require('../helpers/helperFunctions');

class CategoryController {

    async createCategory(req, res) {
        const { title, description } = req.body;

        CategoryModel.createCategory(title, description)
        .then(resp => {
            if (resp[0].affectedRows > 0) {
                return res.status(200).json({ message: "Category created", data: resp[0] })
            } else {
                return res.status(404).json({ error: "Category creation failed" });
            }
        })
        .catch(error => { return res.status(404).json({ error: error.message }) });
    }

    async getCategories(req, res) {
        CategoryModel.getAllCategories()
        .then(resp => {
            if (resp[0].length > 0) {
                return res.status(200).json({ message: "Categories", data: resp[0] })
            } else {
                return res.status(404).json({ error: "Categories not found" });
            }
        })
        .catch(error => { return res.status(404).json({ error: error.message }) });
    }

    async getCategory(req, res) {
        const { category_id } = req.params;

        CategoryModel.getCategoryById(category_id)
        .then(resp => {
            if (resp[0].length > 0) {
                return res.status(200).json({ message: "Category was found", data: resp[0][0] })
            } else {
                return res.status(404).json({ error: "Category wasn't found" });
            }
        })
        .catch(error => { return res.status(404).json({ error: error.message }) });
    }

    async getCategoryByName(req, res) {
        const { title, substring } = req.query; 

        let resp;

        if (title) {
            resp = await CategoryModel.getCategoryByName(title)
        }

        if (substring) {
            resp = await CategoryModel.getCategoryBySubstring(substring)
        }

        if (resp) {
            if (resp[0].length > 0) {
                return res.status(200).json({ message: "Success", data: resp[0] })
            } else {
                return res.status(404).json({ error: "Category wasn't found" });
            }
        } else {
            return res.status(404).json({ error: "Error with db" });
        }
    }

    async getPostsByCategory(req, res) {
        const { category_id } = req.params;

        CategoryModel.getPostsByCategory(category_id)
        .then(resp => {
            if (resp[0].length > 0) {
                return res.status(200).json({ message: "Posts was found", data: resp[0] })
            } else {
                return res.status(200).json({ error: "Posts wasn't found" });
            }
        })
        .catch(error => { return res.status(404).json({ error: error.message }) });
    }

    async updateCategoryData(req, res) {
        const { category_id } = req.params;
        const { title, description } = req.body;

        let updated = false;

        const fieldsToUpdate = [
            { field: title, updateFunction: CategoryModel.updateTitle, name: "title" },
            { field: description, updateFunction: CategoryModel.updateDescription, name: "description" }
        ];

        const updatePromises = fieldsToUpdate
        .filter(fieldInfo => fieldInfo.field !== undefined)
        .map(fieldInfo => {
            return fieldInfo.updateFunction(fieldInfo.field, category_id).then(data => {
                if (data != undefined && data[0].affectedRows > 0) {
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
                return res.status(404).json({ error: "No fields were updated" });
            }
        })
        .catch(() => {
            return res.status(404).json({ error: "Error during update" });
        });
    }

    async deleteCategory(req, res) {
        const { category_id } = req.params;

        CategoryModel.deleteCategory(category_id)
        .then((resp) => {
            if (resp[0].affectedRows > 0) {
                return res.status(200).json({ message: "Category was deleted" });
            } else {
                return res.status(404).json({ error: "Categories not found" });
            }
        })
        .catch(() => {
            return res.status(404).json({ error: "Error during delete categories" });
        });
    }

    async getUserPinnedCategories(req, res) {
        const { user_id } = req.params;

        CategoryModel.getUserPinnedCategories(user_id)
        .then(resp => {
            if (resp[0].length  > 0) {
                return res.status(200).json({ message: `User's pinned categories`, data: resp[0] })
            }
            else {
                return res.status(404).json({ error: "Error found user or categories" })
            }
        }).catch(error => { return res.status(404).json({ error: error.message }) });
    }

    async pinnedCategoryForUser(req, res) {
        const { category_id } = req.params;
        const { user_decoded_id } = getAuthUserInfo(req);

        CategoryModel.checkPinnedCategoryForUser(user_decoded_id, category_id)
        .then(async response => {
            if (response[0][0] != null) {
                CategoryModel.deleteCategoryFromPinned(user_decoded_id, category_id)
                .then(resp => {
                    if (resp[0].affectedRows > 0) res.status(200).json({ message: "Category was deleted from favorites", data: resp[0] });
                    else res.status(404).json({ error: "Category wasn't delete from favorites" })
                });
            } else {
                CategoryModel.pinnedCategoryForUser(user_decoded_id, category_id)
                .then(resp => {
                    if (resp[0].affectedRows > 0) res.status(200).json({ message: "Category was added to favorites", data: resp[0] });
                    else res.status(404).json({ error: "Category wasn't added from favorites" })
                });
            }
        })
    }

    async deleteUserPinnedCategory(req, res) {
        const { category_id } = req.params;
        const { user_decoded_id } = getAuthUserInfo(req);
        
        CategoryModel.deleteCategoryFromPinned(user_decoded_id, category_id)
        .then(resp => {
            if (resp[0].affectedRows > 0) {
                res.status(200).json({ message: `Category was deleted from pinned`, data: resp[0] })
            }
            else {
                return res.status(404).json({ error: "Category wasn't delete from pinned" })
            }
        }).catch(error => { return res.status(404).json({ error: error.message }) });
    }
}

module.exports = new CategoryController();