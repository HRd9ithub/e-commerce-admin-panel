import { Paper } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { NavLink } from "react-router-dom";
import Spinner from "../component/Spinner";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { country } from "../static/country";
import ErrorComponent from "../component/ErrorComponent";
import { Axios } from "../service/axios";
import { getLocalStorgeData } from "../service/localStorage";
import toast from "react-hot-toast";
import ChangePassword from "../component/ChangePassword";

const Profile = () => {
    const state = useAuth();
    const [error, setError] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    let initialValues = {
        fullName: "",
        email: "",
        mobileNumber: "",
        address: "",
        state: "",
        city: "",
        pinCode: "",
        country: ""
    }

    const validationSchema2 = Yup.object().shape({
        fullName: Yup.string().trim().matches(/^[a-zA-Z ]*$/, 'Full name must be entered using only alphabets and spaces.').required('Full name is a required field.'),
        email: Yup.string().matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Invalid email address').required('Email is a required field.'),
        mobileNumber: Yup.string().required('Mobile number is a required field.').matches(/^[0-9]{10,10}$/, 'Mobile number must be numeric and at least 10 digits.'),
        address: Yup.string().trim().required('Address is a required field.'),
        state: Yup.string().trim().required('State is a required field.'),
        city: Yup.string().trim().required('City is a required field.'),
        pinCode: Yup.string().trim().required('Pincode is a required field.'),
        country: Yup.string().trim().required('Country is a required field.'),
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema2,
        validateOnChange: false,
        onSubmit: (values, {setSubmitting}) => {
            setError([]);
            setSubmitting(true)
            Axios().put(`/user/${values.id}`, values, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getLocalStorgeData("token")}`
                }
            }).then((response) => {
                toast.success(response.data.message);
                state.getAuthUser();
            }).catch((error) => {
                if (!error.response) {
                    toast.error(error.message)
                } else if (error.response.data.message) {
                    toast.error(error.response.data.message)
                } else if (error.response.data.error) {
                    setError(error.response.data.error)
                }
            }).finally(() => {
                setSubmitting(false);
            })
        },
    });

    const setDefaultValue = () => {
        formik.setFieldValue('fullName', state.userData?.fullName || "");
        formik.setFieldValue('email', state.userData?.email || "");
        formik.setFieldValue('mobileNumber', state.userData?.mobileNumber || "");
        formik.setFieldValue('id', state.userData?._id || "");
        formik.setFieldValue('address', state.userData?.address || "");
        formik.setFieldValue('state', state.userData?.state || "");
        formik.setFieldValue('pinCode', state.userData?.pinCode || "");
        formik.setFieldValue('city', state.userData?.city || "");
        formik.setFieldValue('country', state.userData?.country || "");
    }

    useEffect(() => {
        setDefaultValue();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.userData])

    // image change
    const handleImageUpload = (event) => {
        if(event.target.files.length !== 0 ){
            setIsLoading(true);
            const formData = new FormData();
            formData.append("profileImage", event.target.files[0]);

            Axios().post('/user/image', formData , {
                headers: {
                    Authorization: `Bearer ${getLocalStorgeData("token")}`
                }
            }).then((response) => {
                toast.success(response.data.message);
                state.getAuthUser();
            }).catch((error) => {
                if (!error.response) {
                    toast.error(error.message)
                } else if (error.response.data.message) {
                    toast.error(error.response.data.message)
                }
            }).finally(() => {
                setIsLoading(false)
            })
        }
    }

    if(state.isLoding || formik.isSubmitting || isLoading){
        return <Spinner/>
    }

    return (
        <Paper className='m-3'>
            <div className='row mx-3 pt-3 align-items-center'>
                <div className="col-md-12 ps-0">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><NavLink to="/" >Dashboard</NavLink></li>
                            <li className="breadcrumb-item active" aria-current="page">Profile</li>
                        </ol>
                    </nav>
                </div>
            </div>
            <hr className='mb-0' />
            <div className="profile-content row py-3 align-items-center">
                <div className="col-md-3 image-section">
                    <div className="d-flex justify-content-center align-items-center flex-column">
                        <div className="image-box-profile">
                            <img src={state.userData?.profileImage} alt="Avatar" className="img-fluid" width="100%" height="auto" />
                        </div>
                        <label className="main-button">
                            <input type="file" name="image" id="image" className="d-none" accept="image/*" onChange={handleImageUpload} />
                            Change Image
                        </label>
                    </div>
                </div>
                <div className="col-md-9 px-4">
                    <span className="profile-title">Personal Deatils</span>
                    <div className='form-section mt-2'>
                        <form onSubmit={formik.handleSubmit}>
                            <div className="row">
                                <div className="col-md-4">
                                    <label htmlFor="fullName">Full Name</label>
                                    <input
                                        id="fullName"
                                        name="fullName"
                                        className='form-control'
                                        placeholder="Full name"
                                        type="text"
                                        value={formik.values.fullName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.fullName && formik.errors.fullName ? <div className="form-error">{formik.errors.fullName}</div> : null}
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        id="email"
                                        name="email"
                                        className='form-control'
                                        placeholder="Email"
                                        type="text"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.email && formik.errors.email ? <div className="form-error">{formik.errors.email}</div> : null}
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="mobileNumber">Mobile Number</label>
                                    <input
                                        id="mobileNumber"
                                        name="mobileNumber"
                                        className='form-control'
                                        placeholder="Mobile number"
                                        type="tel"
                                        value={formik.values.mobileNumber}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        maxLength={10}
                                    />
                                    {formik.touched.mobileNumber && formik.errors.mobileNumber ? <div className="form-error">{formik.errors.mobileNumber}</div> : null}
                                </div>
                                <div className="col-md-12 mt-2">
                                    <label htmlFor="address">Address</label>
                                    <textarea
                                        id="address"
                                        name="address"
                                        className='form-control'
                                        placeholder="Address"
                                        value={formik.values.address}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.address && formik.errors.address ? <div className="form-error">{formik.errors.address}</div> : null}
                                </div>
                                <div className="col-md-3 mt-2">
                                    <label htmlFor="state">State</label>
                                    <input
                                        id="state"
                                        name="state"
                                        className='form-control'
                                        placeholder="State"
                                        type="text"
                                        value={formik.values.state}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.state && formik.errors.state ? <div className="form-error">{formik.errors.state}</div> : null}
                                </div>
                                <div className="col-md-3 mt-2">
                                    <label htmlFor="city">City</label>
                                    <input
                                        id="city"
                                        name="city"
                                        className='form-control'
                                        placeholder="City"
                                        type="text"
                                        value={formik.values.city}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.city && formik.errors.city ? <div className="form-error">{formik.errors.city}</div> : null}
                                </div>
                                <div className="col-md-3 mt-2">
                                    <label htmlFor="pinCode">Pincode</label>
                                    <input
                                        id="pinCode"
                                        name="pinCode"
                                        className='form-control'
                                        placeholder="Pincode"
                                        type="number"
                                        value={formik.values.pinCode}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.pinCode && formik.errors.pinCode ? <div className="form-error">{formik.errors.pinCode}</div> : null}
                                </div>
                                <div className="col-md-3 mt-2">
                                    <label htmlFor="country">Country</label>
                                    <select
                                        id="country"
                                        name="country"
                                        className='form-control form-select'
                                        placeholder="Country"
                                        value={formik.values.country}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                        {country.map((val) => {
                                            return <option key={val} value={val} label={val} />
                                        })}
                                    </select>
                                    {formik.touched.country && formik.errors.country ? <div className="form-error">{formik.errors.country}</div> : null}
                                </div>
                                {error.length !== 0 &&
                                    <div className="col-md-12 mt-3">
                                        <ErrorComponent errors={error} />
                                    </div>
                                }
                                <div className="form-action mt-3 justify-content-end">
                                    <button type="button" className='cancel-button' onClick={() => {
                                        formik.handleReset();
                                        setDefaultValue();
                                    }}>Reset</button>
                                    <button type="submit" className='main-button' disabled={formik.isSubmitting}>Save</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <hr className='mb-0 mt-1'/>
            <div className="profile-password py-2 px-3">
                <span className="profile-title">Change Password</span>
                 <ChangePassword/>
            </div>
        </Paper>
    )
}

export default Profile
