const AuthReducer = (state, action) => {
    switch (action.type) {
        case "GET_USER_DATA":
            return {
                ...state,
                userData: {...action.payload, profileImage: import.meta.env.VITE_API+action.payload.profileImage},
                isLoading: false
            }
            // eslint-disable-next-line
            break;
        case "SET_LOADER":
            return {
                ...state,
                isLoading: action.payload
            }
            // eslint-disable-next-line
            break;

        default:
            return state
        }
    }

    export default AuthReducer;