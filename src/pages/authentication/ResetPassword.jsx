import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import toast from 'react-hot-toast';
import Spinner from '../../component/Spinner';
import ErrorComponent from '../../component/ErrorComponent';
import { Axios } from '../../service/axios';

const ResetPassword = () => {
    const passwordFormat = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    const [isPassword, setIsPassword] = useState(false);
    const [isConfirmPassword, setIsConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState([]);
    const [query, setQuery] = useState({
        email: "",
        token: ""
    });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        password: Yup.string().required('Password is a required field.').matches(passwordFormat, "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character."),
        confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords do not match').required('Confirm password is a required field.'),
    });

    // password toggle funcation
    const handleTogglePassword = () => {
        setIsPassword(!isPassword);
    }
    // password toggle funcation
    const handleToggleConfirmPassword = () => {
        setIsConfirmPassword(!isConfirmPassword);
    }

    useEffect(() => {
        // Access query parameters using URLSearchParams
        const params = new URLSearchParams(window.location.search);
        setQuery({
            email: params.get('email').replace(" ","+"),
            token: params.get('token')
        })
    }, []);

    // submit
    const onSubmit = (value, { resetForm }) => {
        setIsLoading(true);
        setError([]);
        setMessage("");
        Axios().post("/auth/reset-password", {
            email: query.email,
            password: value.password,
            confirmPassword: value.confirmPassword
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${query.token}`
            }
        },).then((response) => {
            toast.success(response.data.message);
            navigate("/login");
        }).catch((error) => {
            if (!error.response) {
                toast.error(error.message)
            } else if (error.response.data.message) {
                toast.error(error.response.data.message)
            } else if (error.response.data.error) {
                setError(error.response.data.error)
            }else{
                setMessage(error.response.data.errors)
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
                            <img src="./Images/logo.png" alt="logo" height={100}  />
                            <h2 className='mt-1'>Reset Password</h2>
                        </div>
                        <div className="form-section">
                            <Formik
                                initialValues={{
                                    password: "",
                                    confirmPassword: ""
                                }}
                                validateOnChange={false}
                                validationSchema={validationSchema}
                                onSubmit={onSubmit}
                            >
                                <Form>
                                    <div className="col-md-12 mt-3 position-relative">
                                        <label htmlFor="password">Password</label>
                                        <Field type={isPassword ? "text" : "password"} id='password' name="password" className='form-control' placeholder='Password' />
                                        {isPassword ? <IoEyeOutline className='toogle-password' onClick={handleTogglePassword} /> : <IoEyeOffOutline className='toogle-password' onClick={handleTogglePassword} />}
                                        <ErrorMessage name="password" component="div" className='form-error' />
                                    </div>
                                    <div className="col-md-12 mt-3 position-relative">
                                        <label htmlFor="confirmPassword">Confirm Password</label>
                                        <Field type={isConfirmPassword ? "text" : "password"} id='confirmPassword' name="confirmPassword" className='form-control' placeholder='Confirm password' />
                                        {isConfirmPassword ? <IoEyeOutline className='toogle-password' onClick={handleToggleConfirmPassword} /> : <IoEyeOffOutline className='toogle-password' onClick={handleToggleConfirmPassword} />}
                                        <ErrorMessage name="confirmPassword" component="div" className='form-error' />
                                        {message && <span className='error'>{message}</span>}
                                    </div>
                                    {error.length !== 0 &&
                                        <div className="col-md-12 mt-3">
                                            <ErrorComponent errors={error} />
                                        </div>
                                    }
                                    <div className="col-md-12 mt-3">
                                        <button type="submit" className='w-100 main-button'>Reset Password</button>
                                    </div>
                                </Form>
                            </Formik>
                            <div className="col-md-12 mt-3 text-center">
                                <Link to="/login" className='auth-link'>Back To Login</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isLoading && <Spinner/>}
        </div>
    )
}

export default ResetPassword;
