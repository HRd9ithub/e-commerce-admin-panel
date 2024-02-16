import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { addLocalStorgeData, getLocalStorgeData, removeLocalStorgeData } from '../../service/localStorage';
import { Axios } from '../../service/axios';
import ErrorComponent from '../../component/ErrorComponent';
import Spinner from '../../component/Spinner';


const Otp = () => {
    const numberFormat = /^[0-9]+$/;
    const email = getLocalStorgeData("email");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState([]);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        otp: Yup.string().required("OTP is a required field.").matches(numberFormat, "OTP must be a number.").min(6, "OTP must be 6 characters.")
    });

    // submit
    const onSubmit = (value) => {
        setIsLoading(true);
        setError([]);
        setMessage("");
        Axios().patch("/auth/otp", value, {
            headers: {
                "Content-Type": "application/json",
            }
        },).then((response) => {
            toast.success(response.data.message);
            addLocalStorgeData("token",response.data.token);
            addLocalStorgeData("userId",response.data.id);
            navigate("/");
            removeLocalStorgeData("email");
        }).catch((error) => {
            if (!error.response) {
                toast.error(error.message)
            } else if (error.response.data.message) {
                toast.error(error.response.data.message)
            } else if (error.response.data.error) {
                setError(error.response.data.error)
            }else{
                setMessage(error.response.data?.errors)
            }
        }).finally(() => {
            setIsLoading(false);
        })
    }

    // resend code funcation
    const resendCode = () => {
        setIsLoading(true);
        setError([]);
        setMessage("");
        Axios().put("/auth/resend-otp",{ email }, {
            headers: {
                "Content-Type": "application/json",
            }
        },).then((response) => {
            toast.success(response.data.message);
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
        <div className='container'>
            <div className='row auth-section'>
                <div className='col-sm-8 col-md-7 col-lg-4 col-12 m-auto'>
                    <div className="auth-box">
                        <div className="card-title text-center">
                            <img src="./Images/logo.png" alt="logo" height={100} />
                            <h2 className='mt-1'>Verification</h2>
                        </div>
                        <div className="form-section">
                            <Formik
                                initialValues={{
                                    otp: "",
                                    email: getLocalStorgeData("email")
                                }}
                                validateOnChange={false}
                                validationSchema={validationSchema}
                                onSubmit={onSubmit}
                            >
                                <Form>
                                    <div className="col-md-12 mt-3">
                                        <label htmlFor="otp">OTP</label>
                                        <Field type="text" id='otp' name="otp" className='form-control' placeholder='OTP' maxLength={6} />
                                        <ErrorMessage name="otp" component="div" className='error' />
                                        {message && <span className='form-error'>{message}</span>}
                                    </div>
                                    <div className="col-md-12 mt-3 text-end">
                                        <span>Didn&#39;t receive <Link  className="auth-link" onClick={resendCode}>Resend code</Link></span>
                                    </div>
                                    {error.length !== 0 &&
                                        <div className="col-md-12 mt-3">
                                            <ErrorComponent errors={error} />
                                        </div>
                                    }
                                    <div className="col-md-12 mt-3">
                                        <button type="submit" className='w-100 main-button'>Verify</button>
                                    </div>
                                </Form>
                            </Formik>
                            <div className="col-md-12 mt-2 text-center">
                                <Link to="/login" className='auth-link'>Back To Login</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isLoading && <Spinner />}
        </div>
    )
}

export default Otp;
