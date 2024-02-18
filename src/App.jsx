import Header from "./component/Header";
import Sidebar from "./component/Sidebar";
import AppRoute from "./routes/AppRoute";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { addLocalStorgeData, getLocalStorgeData } from "./service/localStorage";

const toogleLocalStotage = () => {
  return getLocalStorgeData("sidebarToggle") ? JSON.parse(getLocalStorgeData("sidebarToggle")) : true
}

const App = () => {

  const [sidebarToggle, setSidebarToggle] = useState(toogleLocalStotage());

  const { pathname, key } = useLocation();

  // show or hide sidebar and navbar 
  const checkRoute = () => {
    const Root = ["/register", '/login', '/forgot-password', '/reset-password', '/otp'];

    return !(Root.includes(pathname) || (key === "default" && !getLocalStorgeData("token")))
  }

  const toggleSidebar = () => {
    addLocalStorgeData("sidebarToggle", !sidebarToggle);
    setSidebarToggle(!sidebarToggle);
  }

  useEffect(() =>{
    window.history.pushState(null, "", window.location.href);
    
    window.onpopstate = function() {
      window.history.pushState(null, "", window.location.href);
    }
  })

  return (
    <>
      <div className="app">
        {checkRoute() && <>
          <Sidebar sidebarToggle={sidebarToggle} />
          <Header toggleSidebar={toggleSidebar} sidebarToggle={sidebarToggle} />
        </>}
        {checkRoute() ?
          <div className={`main-section ${sidebarToggle ? "right-wrapper" : "right-small-wrapper"}`} id="right">
            <AppRoute />
          </div> :
          <AppRoute />}

      </div>
    </>
  )
}

export default App
