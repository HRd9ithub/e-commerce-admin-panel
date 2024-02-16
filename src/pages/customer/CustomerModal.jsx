import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaRegEdit } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import Spinner from '../../component/Spinner';
import ErrorComponent from '../../component/ErrorComponent';
import { Axios } from '../../service/axios';
import { getLocalStorgeData } from '../../service/localStorage';
import IconWrapper from '../../component/IconWrapper';

const CustomerModal = ({ data, getUserData }) => {
    const passwordFormat = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    const [modalShow, setModalShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState([]);

    let initialValues = {
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        mobileNumber: "",
        status: "Active"
    }

    // validation schema
    const validationSchema = Yup.object().shape({
        fullName: Yup.string().trim().matches(/^[a-zA-Z ]*$/, 'Full name must be entered using only alphabets and spaces.').required('Full name is a required field.'),
        email: Yup.string().matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Invalid email address').required('Email is a required field.'),
        password: Yup.string().when('data', {
            is: data => data,
            then: Yup.string().required('Password is a required field.').matches(passwordFormat, "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character."),
            otherwise: Yup.string().notRequired()
        }),
        // .required('Password is a required field.').matches(passwordFormat, "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character."),
        // confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords do not match').required('Confirm password is a required field.'),
        mobileNumber: Yup.string().required('Mobile number is a required field.').matches(/^[0-9]{10,10}$/, 'Mobile number must be at least 10 digits.')
    });

    // show modal
    const handleShowModal = () => {
        setModalShow(true);
    }

    // hide modal
    const handleHideModal = () => {
        setModalShow(false);
        setError([]);
    }

    // submit function
    const onSubmit = (value, { resetForm }) => {
        console.log('value :>> ', value);
        setIsLoading(true);
        setError([]);

        let URL = "";
        if (data) {
            URL = Axios().put(`/user/${value.id}`, value, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getLocalStorgeData("token")}`
                }
            })
        } else {
            URL = Axios().post("/user", value, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getLocalStorgeData("token")}`
                }
            })
        }

        URL.then((response) => {
            toast.success(response.data.message);
            getUserData();
            setModalShow(false);
            resetForm();
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

    if (data) {
        initialValues = {
            fullName: data.fullName,
            email: data.email,
            mobileNumber: data.mobileNumber,
            status: data.status,
            id: data._id
        }
    }

    return (
        <>
            {!data ? <button className='w-100 main-button' onClick={handleShowModal}>Add</button> : <FaRegEdit className='edit-icon' onClick={handleShowModal} />}
            <Modal
                show={modalShow}
                size="md"
                backdrop="static"
                keyboard={false}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter" className='w-100 d-flex justify-content-between align-items-center'>
                        <span>{data ? "Update User" : "Add User"}</span>
                        <div onClick={handleHideModal}>
                            <IconWrapper iconName="Close" />
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='form-section'>
                        <Formik
                            initialValues={initialValues}
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
                                    {/* {!data && <> */}
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
                                    <div className="col-md-6 mt-3">
                                        <label htmlFor="mobileNumber">Mobile Number</label>
                                        <Field type="number" id='mobileNumber' name="mobileNumber" className='form-control' placeholder='Mobile number' />
                                        <ErrorMessage name="mobileNumber" component="div" className='form-error' />
                                    </div>
                                    <div className="col-md-6 mt-3">
                                        <label htmlFor="status">Status</label>
                                        <Field as="select" type="number" id='status' name="status" className='form-control form-select'>
                                            <option value="Active" label="Active" />
                                            <option value="Inactive" label="Inactive" />
                                        </Field>
                                        <ErrorMessage name="mobileNumber" component="div" className='form-error' />
                                    </div>
                                    {error.length !== 0 &&
                                        <div className="col-md-12 mt-3">
                                            <ErrorComponent errors={error} />
                                        </div>
                                    }
                                    <div className="form-action mt-3">
                                        <button type="submit" className='main-button'>Save</button>
                                        <button type="button" className='cancel-button' onClick={handleHideModal}>Cancel</button>
                                    </div>
                                </div>
                            </Form>
                        </Formik>
                    </div>
                </Modal.Body>
            </Modal>
            {isLoading && <Spinner />}
        </>
    )
}
CustomerModal.propTypes = {
    data: PropTypes.object,
    getUserData: PropTypes.func
}

export default CustomerModal;
