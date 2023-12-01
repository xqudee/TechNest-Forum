import ReduxToastrLib from "react-redux-toastr"

const ReduxToast = () => {
    
    return (
        <ReduxToastrLib
            newestOnTop={false}
            preventDuplicates
            progressBar
            closeOnToastrClick
            timeOut={4000}
            transitionIn="fadeIn"
            transitionOut="fadeOut"
        ></ReduxToastrLib>
    )
}

export default ReduxToast