import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import ErrorComponent from '../../component/ErrorComponent';
import { Axios } from '../../service/axios';
import { addLocalStorgeData } from '../../service/localStorage';
import Spinner from '../../component/Spinner';

const Login = () => {
  const [isPassword, setIsPassword] = useState(false)
  const [error, setError] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string().matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Invalid email address').required('Email is a required field.'),
    password: Yup.string().required('Password is a required field.')
  });

  // password toggle funcation
  const handleTogglePassword = () => {
    setIsPassword(!isPassword);
  }

  // submit
  const onSubmit = (value) => {
    setIsLoading(true);
    setError([]);
    Axios().post("/auth/admin/login", value, {
      headers: {
        "Content-Type": "application/json",
      }
    },).then((response) => {
      addLocalStorgeData("email", response.data.email)
      toast.success(response.data.message);
      navigate("/otp");
    }).catch((error) => {
      if (!error.response) {
        toast.error(error.message)
      } else if (error.response.data.message) {
        toast.error(error.response.data.message)
      } else if (error.response.data.error) {
        setError(error.response.data.error)
      }
    }).finally(() => {
      setIsLoading(false);
    })
  }

  return (
    <div className='container auth-section'>
      <div className='row h-100'>
        <div className='col-sm-8 col-md-6 col-lg-4 col-12 m-auto'>
          <div className="auth-box">
            <div className="card-title text-center">
              <img src="./Images/logo.png" alt="logo" height={100} />
              <h2 className='mt-1 mt-lg-3 mt-sm-3 mt-xl-3 text-start'>Welcome Back</h2>
              <p className='text-start'>Please login to your account</p>
            </div>
            <div className="form-section">
              <Formik
                initialValues={{
                  email: "",
                  password: ""
                }}
                validateOnChange={false}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                <Form>
                  <div className="col-md-12">
                    <label htmlFor="email">Email</label>
                    <Field type="email" id='email' name="email" className='form-control' placeholder='Email' />
                    <ErrorMessage name="email" component="div" className='form-error' />
                  </div>
                  <div className="col-md-12 mt-3 position-relative">
                    <label htmlFor="password">Password</label>
                    <Field type={isPassword ? "text" : "password"} id='password' name="password" className='form-control' placeholder='Password' />
                    {isPassword ? <IoEyeOutline className='toogle-password' onClick={handleTogglePassword} /> : <IoEyeOffOutline className='toogle-password' onClick={handleTogglePassword} />}
                    <ErrorMessage name="password" component="div" className='form-error' />
                  </div>
                  <div className="col-md-12 mt-3 text-end">
                    <Link className='auth-link' to="/forgot-password">Forgot Password?</Link>
                  </div>
                  {error.length !== 0 &&
                    <div className="col-md-12 mt-3">
                      <ErrorComponent errors={error} />
                    </div>
                  }
                  <div className="col-md-12 mt-3">
                    <button type="submit" className='w-100 main-button'>Login</button>
                  </div>
                </Form>
              </Formik>
              <div className="col-md-12 mt-3 text-center">
                <p>Don&#39;t have an account? <Link className='auth-link' to="/register">Register</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isLoading && <Spinner />}
    </div>
  )
}

export default Login
