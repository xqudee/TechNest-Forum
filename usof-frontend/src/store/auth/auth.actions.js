// register

import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthService } from "../../services/auth/auth.service";
import { toastError } from "../../utils/toast-error";

export const register = createAsyncThunk ('/auth/register', async (data, thunkApi) => {
    try {
        const response = await AuthService.register(data);
        return response.data;
    } catch (error) {
        toastError(error);
        return thunkApi.rejectWithValue(error)
    }
})

// login

export const login = createAsyncThunk('/auth/login', async (data, thunkApi) => {
    try {
        const response = await AuthService.login(data);
        return response.data;
    } catch (error) {
        toastError(error);
        return thunkApi.rejectWithValue(error)
    }
})

// logout

export const logout = createAsyncThunk ('/auth/logout', async (_, thunkApi) => {
    try {

        await AuthService.logout();
    } catch (error) {
        toastError(error);
        return thunkApi.rejectWithValue(error)
    }
})

// checkAuth

export const checkAuth = createAsyncThunk ('/auth/check-auth', async (_, thunkApi) => {
    try {
        const response = await AuthService.getNewTokens();
        return response.data;
    } catch (error) {
        if (error == 'jwt expired') {
            thunkApi.dispatch(logout())

            toastError('Your authorization is finished, sign in again', 'Logout')
        } else {
            toastError(error)
        }
        return thunkApi.rejectWithValue(error)
    }
})