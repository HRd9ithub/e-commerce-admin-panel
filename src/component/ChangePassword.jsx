import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from 'yup';
import { Axios } from "../service/axios";
import { clearLocalStorgeData, getLocalStorgeData } from "../service/localStorage";
import toast from "react-hot-toast";
import Spinner from "./Spinner";
import ErrorComponent from "./ErrorComponent";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
    const passwordFormat = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    const [error, setError] = useState([]);
    const navigate = useNavigate();

    const initialValues = {
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    }

    const validationSchema = Yup.object().shape({
        currentPassword: Yup.string().trim().required('Current password is a required field.'),
        newPassword: Yup.string().required('New password is a required field.').matches(passwordFormat, "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character."),
        confirmPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Confirm password do not match.').required('Confirm password is a required field.'),
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        validateOnChange: false,
        onSubmit: (values, { setSubmitting, resetForm }) => {
            setError([]);
            setSubmitting(true)
            Axios().post('/user/password', values, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getLocalStorgeData("token")}`
                }
            }).then((response) => {
                toast.success(response.data.message);
                clearLocalStorgeData();
                navigate("/login")
            }).catch((error) => {
                if (!error.response) {
                    toast.error(error.message)
                } else if (error.response.data.message) {
                    toast.error(error.response.data.message)
                } else if (error.response.data.error) {
                    setError(error.response.data.error)
                }
            }).finally(() => {
                resetForm();
                setSubmitting(false);
            })
        },
    });
    return (
        <>
            <div className='form-section mt-2'>
                <form onSubmit={formik.handleSubmit}>
                    <div className="row">
                        <div className="col-md-4">
                            <label htmlFor="currentPassword">Current Password</label>
                            <input
                                id="currentPassword"
                                name="currentPassword"
                                className='form-control'
                                placeholder="Current password"
                                type="password"
                                value={formik.values.currentPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.currentPassword && formik.errors.currentPassword ? <div className="form-error">{formik.errors.currentPassword}</div> : null}
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                id="newPassword"
                                name="newPassword"
                                className='form-control'
                                placeholder="New password"
                                type="password"
                                value={formik.values.newPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.newPassword && formik.errors.newPassword ? <div className="form-error">{formik.errors.newPassword}</div> : null}
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                className='form-control'
                                placeholder="Confirm password"
                                type="password"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword ? <div className="form-error">{formik.errors.confirmPassword}</div> : null}
                        </div>
                        {error.length !== 0 &&
                            <div className="col-md-12 mt-3">
                                <ErrorComponent errors={error} />
                            </div>
                        }
                        <div className="form-action mt-3 justify-content-end">
                            <button type="submit" className='main-button' disabled={formik.isSubmitting}>Save</button>
                        </div>
                    </div>
                </form>
            </div>
            { (formik.isSubmitting ) && <Spinner />}
        </>
    )
}

export default ChangePassword
