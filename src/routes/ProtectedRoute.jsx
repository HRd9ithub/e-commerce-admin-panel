import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { getLocalStorgeData } from '../service/localStorage';

const ProtectedRoute = ({ children, authentication }) => {
    // use for redirect the page
    const navigate = useNavigate();
    // get url of page
    const { pathname } = useLocation();

    const getProtectedData = async () => {
        // get localstorage in token
        if (authentication && !getLocalStorgeData("token")) {
            // redirect page
            navigate('/login');
        } else if (!authentication && getLocalStorgeData("token")) {
            navigate('/');
        }
    }

    useEffect(() => {
        getProtectedData();
        // eslint-disable-next-line
    }, [pathname])

    return children
}

export default ProtectedRoute;
