import Cookies from "js-cookie";
import { CONFIG } from "../../App";
import { getStoreLocal, removeStorage, removeTokensStorage, saveTokensStorage, saveUserToStorage } from "../../utils/locale-storage";
import axios from "../../API/axios";

export const AuthService = {
    async register(jsonData) {
        try {
          const response = await axios.post('/api/auth/register', jsonData, CONFIG);
          if (response.data.accessToken) {
            saveUserToStorage(response.data);
          }
          return response; 
        } catch (error) {
          throw error.response?.data.error;
        }
    },

    async login(jsonData) {
        try {
          const response = await axios.post('/api/auth/login', jsonData, CONFIG);
          if (response.data.accessToken) {
            saveUserToStorage(response.data);
          }
          return response;
        } catch (error) {
          throw error.response?.data.error;
        }
    },

    async logout() {
        try {
          const response = await axios.post('/api/auth/logout', null, { withCredentials: true });
          if (response) {
            removeTokensStorage();
            localStorage.removeItem('user');

            console.log(localStorage);

          }
        } catch (error) {
          console.log(error);
          throw error.response?.data.error;
        }
    },

    async getNewTokens() {
        let refreshToken = getStoreLocal('refreshToken');

        try {
          const response = await axios.post(`/api/auth/check-token/${refreshToken}`, null, { withCredentials: true });
  
          if (response) {
              saveUserToStorage(response.data);
          }
          return response;
        }  catch (error) {
          throw error.response?.data.error;
        }

    }
}