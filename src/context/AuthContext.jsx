import { createContext, useContext, useReducer } from "react";
import toast from "react-hot-toast";
import PropTypes from 'prop-types';
import { getLocalStorgeData } from "../service/localStorage";
import { Axios } from "../service/axios";
import AuthReducer from "../reducer/AuthReducer";

const AuthProvider = createContext();

const initialistate = {
    userData: '',
    isLoading: false,
    error: []
}

export const AuthContext = ({ children }) => {

    const [state, dispatch] = useReducer(AuthReducer, initialistate);

    const getAuthUser = () => {
        const id = getLocalStorgeData('userId');

        dispatch({ type: "SET_LOADER", payload: true })
        Axios().get(`/user/${id}`, {
            headers: {
                Authorization: `Bearer ${getLocalStorgeData("token")}`
            }
        }).then((response) => {
            dispatch({ type: "GET_USER_DATA", payload: response.data.data })
        }).catch((error) => {
            if (!error.response) {
                toast.error(error.message);
            } else if (error.response.data.message) {
                toast.error(error.response.data.message);
            }
        }).finally(() => dispatch({ type: "SET_LOADER", payload: false }))
    }

    return <AuthProvider.Provider value={{ ...state, getAuthUser }}>
        {children}
    </AuthProvider.Provider>
}

AuthContext.propTypes = {
    children: PropTypes.array
};


// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthProvider);
}