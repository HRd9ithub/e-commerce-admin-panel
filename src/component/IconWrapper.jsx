// IconWrapper.js
import { RxDashboard } from "react-icons/rx";
import { MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowDown   } from "react-icons/md";
import { GrCatalog, GrView } from "react-icons/gr";
import { LuUsers } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";
import { CiLogout } from "react-icons/ci";
import PropTypes from 'prop-types';
import { IoClose } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from 'react-icons/fa';

const IconWrapper = ({ iconName }) => {
  switch (iconName) {
    case 'LeftArrow':
      return <MdOutlineKeyboardArrowRight  />;
    case 'DrownArrow':
      return <MdOutlineKeyboardArrowDown   />;
    case 'Profile':
      return <CgProfile/>;
    case 'Logout':
      return <CiLogout/>;
    case 'Close':
      return <IoClose/>;
    case 'Edit':
      return <FaRegEdit/>;
    case 'Delete':
      return <RiDeleteBin6Line/>;
    case 'View':
      return <GrView/>;
    case 'Dashboard':
      return <RxDashboard />;
    case 'Catalog':
      return <GrCatalog />;
    case 'Customers':
      return<LuUsers />;
    default:
      return null;
  }
};
IconWrapper.propTypes = {
    iconName: PropTypes.string
}

export default IconWrapper;
