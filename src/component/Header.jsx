import PropTypes from 'prop-types';
import { IoMenuOutline } from "react-icons/io5"
import { NavLink, useNavigate } from 'react-router-dom';
import IconWrapper from './IconWrapper';
import { useEffect, useState } from 'react';
import { Axios } from '../service/axios';
import { clearLocalStorgeData, getLocalStorgeData } from '../service/localStorage';
import toast from 'react-hot-toast';
import Spinner from './Spinner';
import { useAuth } from '../context/AuthContext';

const Header = ({ toggleSidebar, sidebarToggle }) => {
  const state = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // logout funcation
  const handleLogout = (e) => {
    e.preventDefault();
    setIsLoading(true);
    Axios().post("/auth/logout", {}, {
      headers: {
        Authorization: `Bearer ${getLocalStorgeData("token")}`
      }
    },).then((response) => {
      toast.success(response.data.message);
      clearLocalStorgeData();
      navigate("/login");
    }).catch((error) => {
      if (!error.response) {
        toast.error(error.message)
      } else if (error.response.data.message) {
        toast.error(error.response.data.message)
      }
    }).finally(() => {
      setIsLoading(false);
    })
  }

  useEffect(() => {
    state.getAuthUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={sidebarToggle ? "right-wrapper " : "right-small-wrapper"}>
      <div className="navbar-section d-flex justify-content-between align-items-center px-4">
        <div className='hamburger-btn'>
          <IoMenuOutline onClick={toggleSidebar} />
        </div>
        <div className="dropdown">
          <button className="dropdown-toggle d-flex align-items-center profile-drop-down" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <div className='profile-header-image'>
              <img src={state.userData.profileImage} alt="profile-image" width="100%" height="auto" />
            </div>
            <span className='ms-2'>{state.userData?.fullName}</span>

          </button>
          <ul className="dropdown-menu">
            <li>
              <NavLink to="/profile" className="pr-1 py-2 w-100 d-flex align-items-center dropdown-item profile-menu-item">
                <IconWrapper iconName="Profile" />
                <span className='ms-2 title'>Profile</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/" className="pr-1 py-2 w-100 d-flex align-items-center dropdown-item profile-menu-item" onClick={handleLogout}>
                <IconWrapper iconName="Logout" />
                <span className='ms-2 title'>Log Out</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
      {(isLoading || state.isLoading) && <Spinner />}
    </div>
  )
}

Header.propTypes = {
  toggleSidebar: PropTypes.func,
  sidebarToggle: PropTypes.bool
};

export default Header
