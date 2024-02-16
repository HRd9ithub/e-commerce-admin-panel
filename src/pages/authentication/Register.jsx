import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useState } from 'react';
import ErrorComponent from '../../component/ErrorComponent';
import Spinner from '../../component/Spinner';
import { Axios } from '../../service/axios';

const Register = () => {
    const passwordFormat = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    const [error, setError] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        fullName: Yup.string().trim().matches(/^[a-zA-Z ]*$/, 'Full name must be entered using only alphabets and spaces.').required('Full name is a required field.'),
        email: Yup.string().matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Invalid email address').required('Email is a required field.'),
        password: Yup.string().required('Password is a required field.').matches(passwordFormat,"Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character."),
        confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords do not match').required('Confirm password is a required field.'),
        mobileNumber: Yup.string().required('Mobile number is a required field.').matches(/^[0-9]{10,10}$/, 'Mobile number must be at least 10 digits.')
    });

    const onSubmit = (value) => {
        setIsLoading(true);
        setError([]);
        Axios().post("/user", value, {
            headers: {
                "Content-Type": "application/json",
            }
        },).then((response) =>{
            toast.success(response.data.message);
            navigate("/login");
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
                <div className='col-sm-12 col-md-7 col-lg-6 col-12 m-auto'>
                    <div className="auth-box">
                        <div className="card-title text-center">
                        <img src="./Images/logo.png" alt="logo" height={100} />
                            <h2 className='mt-1 mt-lg-1 mt-sm-1 mt-xl-1'>Register</h2>
                        </div>
                        <div className="form-section mt-3">
                            <Formik
                                initialValues={{
                                    fullName: "",
                                    email: "",
                                    password: "",
                                    confirmPassword: "",
                                    mobileNumber: ""
                                }}
                                validateOnChange={false}
                                validationSchema={validationSchema}
                                onSubmit={onSubmit}
                            >
                                <Form>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <label htmlFor="fullName">Full Name</label>
                                            <Field type="text" id='fullName' name="fullName" className='form-control' placeholder='Fullname' />
                                            <ErrorMessage name="fullName" component="div" className='form-error' />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="email">Email</label>
                                            <Field type="email" id='email' name="email" className='form-control' placeholder='Email' />
                                            <ErrorMessage name="email" component="div" className='form-error' />
                                        </div>
                                        <div className="col-md-6 mt-3">
                                            <label htmlFor="password">Password</label>
                                            <Field type="password" id='password' name="password" className='form-control' placeholder='Password' />
                                            <ErrorMessage name="password" component="div" className='form-error' />
                                        </div>
                                        <div className="col-md-6 mt-3">
                                            <label htmlFor="confirmPassword">Confirm Password</label>
                                            <Field type="password" id='confirmPassword' name="confirmPassword" className='form-control' placeholder='Confirm password' />
                                            <ErrorMessage name="confirmPassword" component="div" className='form-error' />
                                        </div>
                                        <div className="col-md-12 mt-3">
                                            <label htmlFor="mobileNumber">Mobile Number</label>
                                            <Field type="number" id='mobileNumber' name="mobileNumber" className='form-control' placeholder='Mobile number'  />
                                            <ErrorMessage name="mobileNumber" component="div" className='form-error' />
                                        </div>
                                        {error.length !== 0 && 
                                            <div className="col-md-12 mt-3">
                                                <ErrorComponent errors={error} />
                                            </div>
                                        }
                                        <div className="col-md-12 mt-3">
                                            <button type="submit" className='w-100 main-button'>Register</button>
                                        </div>
                                    </div>
                                </Form>
                            </Formik>
                            <div className="col-md-12 mt-3 text-center">
                                <p>Already have an account? <Link className='auth-link' to="/login">Login</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isLoading && <Spinner/>}
        </div>
    )
}

export default Register
