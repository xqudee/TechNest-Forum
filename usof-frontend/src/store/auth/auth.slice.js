import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { getStoreLocal } from '../../utils/locale-storage';
import { checkAuth, login, logout, register } from './auth.actions';

const initialState = {
    isLoading: false,
    user: getStoreLocal('user'),
    error: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
          state.error = null; 
        },
    },
    extraReducers: (builder) => {
        builder.addCase(register.pending, state => {
            state.isLoading = true;
            state.error = null;
        }).addCase(register.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.user = payload.user;
            state.error = null;
        }).addCase(register.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.user = null;
            state.error = 'Error during registration';
        }).addCase(login.pending, state => {
            state.isLoading = true;
            state.error = null;
        }).addCase(login.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.error = null;
            state.user = payload.user;
        }).addCase(login.rejected, state => {
            state.isLoading = false;
            state.user = null;
            state.error = 'Error during login';
        }).addCase(logout.fulfilled, state => {
            state.isLoading = false;
            state.user = null;
        }).addCase(checkAuth.fulfilled, (state, {payload}) => {
            state.user = payload.user;
            state.user = null;
        })
    }
});

export const { reducer } = authSlice; 