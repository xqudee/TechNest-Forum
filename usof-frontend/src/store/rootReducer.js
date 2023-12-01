import { reducer as toastrReducer } from 'react-redux-toastr'
import { reducer as authReducer } from './auth/auth.slice'

export const reducers = {
    auth: authReducer,
    toastr: toastrReducer
}