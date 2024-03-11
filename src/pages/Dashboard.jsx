import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"
import { Axios } from "../service/axios";
import { getLocalStorgeData } from "../service/localStorage";
import toast from "react-hot-toast";
import Spinner from "../component/Spinner";
import { NumberFormatConvert } from "../utils/NumberFormatConvert";
import { NavLink } from "react-router-dom";

const Dashboard = () => {

  const { userData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState({});

  const getData = () => {
    setIsLoading(true);
    Axios().get("/dashboard", {
      headers: {
        "Authorization": `Bearer ${getLocalStorgeData("token")}`
      }
    }).then((response) => {
      setSummary(response.data.summary);
    }).catch((error) => {
      if (!error.response) {
        toast.error(error.message);
      } else if (error.response.data.message) {
        toast.error(error.response.data.message);
      }
    }).finally(() => setIsLoading(false));
  }

  useEffect(() => {
    getData();
  }, []);

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className="m-3">
      <div className="dashboard-section">
        <h3 className="welcome-title">Welcome {userData.fullName},</h3>
        <div className="row my-3">
          <div className="col-lg-3 col-md-3 col-sm-6 col-12">
            <NavLink to={"/customers"} className="summary-box p-3 d-flex align-content-center flex-column">
              <h5 className="m-0">{summary.customerCount}</h5>
              <p className="my-3">Total Customers</p>
            </NavLink>
          </div>
          <div className="col-lg-3 col-md-3 col-sm-6 col-12">
            <NavLink to={"/products"} className="summary-box p-3 d-flex align-content-center flex-column">
              <h5 className="m-0">{summary.productCount}</h5>
              <p className="my-3">Total Products</p>
            </NavLink>
          </div>
          <div className="col-lg-3 col-md-3 col-sm-6 col-12">
            <NavLink to={"/orders"} className="summary-box p-3 d-flex align-content-center flex-column">
              <h5 className="m-0">{summary.orderCount}</h5>
              <p className="my-3">Total Orders</p>
            </NavLink>
          </div>
          <div className="col-lg-3 col-md-3 col-sm-6 col-12">
            <NavLink to={"/orders"} className="summary-box p-3 d-flex align-content-center flex-column">
              <h5 className="m-0">{!summary.averagePrice ? summary.averagePrice : NumberFormatConvert(summary.averagePrice) }</h5>
              <p className="my-3">Average Price</p>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
