import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { addLocalStorgeData } from '../../service/localStorage';
import { Axios } from '../../service/axios';
import ErrorComponent from '../../component/ErrorComponent';
import Spinner from '../../component/Spinner';

const ForgotPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState([]);
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        email: Yup.string().matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Invalid email address').required('Email is a required field.'),
    });

    // submit
    const onSubmit = (value,{ resetForm }) => {
        setIsLoading(true);
        setError([]);
        Axios().post("/auth/forgot-password", value, {
            headers: {
                "Content-Type": "application/json",
            }
        },).then((response) => {
            addLocalStorgeData("email", response.data.email)
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
            resetForm();
        })
    }

    return (
        <div className='container auth-section'>
            <div className='row h-100'>
                <div className='col-sm-8 col-md-7 col-lg-4 col-12 m-auto'>
                    <div className="auth-box">
                        <div className="card-title text-center">
                            <img src="./Images/logo.png" alt="logo" height={100}/>
                            <h2 className='mt-1'>Forgot Password</h2>
                        </div>
                        <div className="form-section">
                            <Formik
                                initialValues={{
                                    email: "",
                                }}
                                validateOnChange={false}
                                validationSchema={validationSchema}
                                onSubmit={onSubmit}
                            >
                                <Form>
                                    <div className="col-md-12 mt-3">
                                        <label htmlFor="email">Email</label>
                                        <Field type="email" id='email' name="email" className='form-control' placeholder='Email' />
                                        <ErrorMessage name="email" component="div" className='form-error' />
                                    </div>
                                    {error.length !== 0 &&
                                        <div className="col-md-12 mt-3">
                                            <ErrorComponent errors={error} />
                                        </div>
                                    }
                                    <div className="col-md-12 mt-3">
                                        <button type="submit" className='w-100 main-button'>Send</button>
                                    </div>
                                </Form>
                            </Formik>
                            <div className="col-md-12 mt-2 text-center">
                                <Link className='auth-link' to="/login">Back To Login</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isLoading && <Spinner/> }
        </div>
    )
}

export default ForgotPassword;
