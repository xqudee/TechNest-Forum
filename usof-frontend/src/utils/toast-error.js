import { toastr } from "react-redux-toastr";

export const toastError = (error, title = null) => {
    const message = error || error.message;

    toastr.error(title || 'Error request', message);
    throw message;
}

export const toastSuccess = (mes, title = null) => {
    const message = mes || mes.message;

    toastr.success(title || 'Success', message);
    throw message;
}