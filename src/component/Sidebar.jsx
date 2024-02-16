import PropTypes from 'prop-types';
import { Link, NavLink, useLocation } from 'react-router-dom';
import IconWrapper from './IconWrapper';
import { useCallback } from 'react';

const Sidebar = ({ sidebarToggle }) => {

  const { pathname } = useLocation();

  const menu = [
    { title: 'Dashboard', icon: 'Dashboard', child: [], route: '/', current: true },
    {
      title: 'Catalog', icon: 'Catalog', child: [
        { tab: 'Products', route: '/products', current: false },
        { tab: 'Categories', route: '/categories', current: false },
        { tab: 'Coupons', route: '/coupons', current: false },
      ], route: '#', current: false
    },
    { title: 'Customers', icon: 'Customers', child: [], route: '/customers', current: true },
  ]

  const addActiveClass = useCallback((child) => {
    const data = child.filter((val) => {
      return val.route === pathname
    });
    return data.length !== 0 ? data : ""
  }, [pathname])



  return (
    <div className={`left-section ${sidebarToggle ? "left-wrapper " : "left-small-wrapper"}`}>
      <aside className="sidebar-section">
        <div className={sidebarToggle ? "sidebar-logo" : "sidebar-small-logo"}>
          <img src={sidebarToggle ? "/Images/logo.png" : "/Images/logo-small.png"} alt="logo" width="100%" height="auto" />
        </div>
        <div className="sidebar-menu mt-3">
          <ul>
            {menu.map((item, id) => {
              return (
                <li key={id}>
                  {item.child.length === 0 ?
                    <NavLink to={item.route} className="pr-1 py-2 w-100 d-flex align-items-center sidebar-menu-item">
                      <IconWrapper iconName={item.icon} />
                      <span className='ms-2 title'>{item.title}</span>
                    </NavLink> :
                    <Link className={`pr-1 py-2 w-100 d-flex align-items-center justify-content-between sidebar-menu-item position-relative ${addActiveClass(item.child) ? "active" : ""}`}>
                      <div>
                        <IconWrapper iconName={item.icon} />
                        <span className='ms-2 title'>{item.title}</span>
                      </div>
                      <IconWrapper iconName="LeftArrow" className='ps-2' />
                      <div className="sidebar-dropodwn position-absolute">
                        <ul>
                          {item.child.map((val, ind) => {
                            return (
                              <li key={ind}>
                                <NavLink to={val.route} className="pr-1 py-2 w-100">
                                  <span className='ms-0'>{val.tab}</span>
                                </NavLink>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    </Link>}
                </li>
              )
            })}
          </ul>
        </div>
      </aside >
    </div >
  )
}

Sidebar.propTypes = {
  sidebarToggle: PropTypes.bool
};

export default Sidebar
