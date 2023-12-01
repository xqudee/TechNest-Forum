export const getStoreLocal = (name) => {
    if (localStorage != undefined) {
        const ls = localStorage.getItem(name);
        return ls && ls != 'undefined' ? JSON.parse(ls) : null;
    } 
    return null;
}

export const saveTokensStorage = (data) => {
    localStorage.setItem('accessToken', JSON.stringify(data.accessToken));
    localStorage.setItem('refreshToken', JSON.stringify(data.refreshToken));
}

export const saveUserToStorage = (data) => {
    saveTokensStorage(data);
    localStorage.setItem('user', JSON.stringify(data.user));
}

export const saveItemToStorage = (name, data) => {
    localStorage.setItem(name, data);
}

export const removeTokensStorage = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
}

export const removeStorage = () => {
    removeTokensStorage();
    localStorage.removeItem('user');
}   