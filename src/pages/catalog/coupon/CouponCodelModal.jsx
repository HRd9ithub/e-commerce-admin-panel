/* eslint-disable react-refresh/only-export-components */
import { FaRegEdit } from 'react-icons/fa';
import { memo, useState, useRef } from 'react'
import Modal from 'react-bootstrap/Modal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import { Axios } from '../../../service/axios';
import { getLocalStorgeData } from '../../../service/localStorage';
import ErrorComponent from "../../../component/ErrorComponent";
import Spinner from "../../../component/Spinner";
import IconWrapper from '../../../component/IconWrapper';
import moment from 'moment';

const CouponCodeModal = ({ data, getCouposCodeData }) => {
    const [modalShow, setModalShow] = useState(false);
    const [error, setError] = useState([]);

    const activationDateRef = useRef(null);
    const expiredDateRef = useRef(null);

    let initialValues = {
        code: "",
        percentage: "",
        activation_date: "",
        expired_date: ""
    }

    // validation schema
    const validationSchema = Yup.object().shape({
        code: Yup.string().trim().required('Code is a required field.'),
        percentage: Yup.number()
            .min(0, 'Percentage must be greater than or equal to 0')
            .max(100, 'Percentage must be less than or equal to 100')
            .required('Percentage is a required field.'),
        activation_date: Yup.string().required("Activation date is a required field."),
        expired_date: Yup.string().required("Expired date is a required field."),
    });

    const formik = useFormik({
        initialValues,
        validationSchema,
        validateOnChange: false,
        onSubmit: (values, { resetForm }) => {
            formik.setSubmitting(true);
            setError([]);

            let URL = "";
            if (data) {
                URL = Axios().put(`/coupon/${values.id}`, values, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getLocalStorgeData("token")}`
                    }
                })
            } else {
                URL = Axios().post("/coupon", values, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getLocalStorgeData("token")}`
                    }
                })
            }

            URL.then((response) => {
                toast.success(response.data.message);
                getCouposCodeData();
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
                formik.setSubmitting(false);
            })
        }
    });

    console.log(formik);

    // show modal
    const handleShowModal = () => {
        if (data) {
            formik.setFieldValue("code", data.code);
            formik.setFieldValue("percentage", data.percentage);
            formik.setFieldValue("activation_date", moment(data.activation_date).format("YYYY-MM-DD"));
            formik.setFieldValue("expired_date", moment(data.expired_date).format("YYYY-MM-DD"));
            formik.setFieldValue("id", data._id);
        }
        setModalShow(true);
    }

    // hide modal
    const handleHideModal = () => {
        setModalShow(false);
        setError([]);
        formik.resetForm();
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
                        <span>{data ? "Update Coupon Code" : "Add Coupon Code"}</span>
                        <div onClick={handleHideModal}>
                            <IconWrapper iconName="Close" />
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='form-section'>
                        <form onSubmit={formik.handleSubmit}>
                            <div className="row">
                                <div className="col-md-6">
                                    <label htmlFor="code">Code</label>
                                    <input type='text' name='code' id="code" className='form-control' placeholder="Code" value={formik.values.code} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                    {formik.touched.code && formik.errors.code ? <div className="form-error">{formik.errors.code}</div> : null}
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="percentage">Percentage</label>
                                    <input type='number' name='percentage' id="percentage" className='form-control' placeholder="Percentage" value={formik.values.percentage} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                    {formik.touched.percentage && formik.errors.percentage ? <div className="form-error">{formik.errors.percentage}</div> : null}
                                </div>
                                <div className="col-md-6 mt-3">
                                    <label htmlFor="activation_date">Activation Date</label>
                                    <input type='date' name='activation_date' id="activation_date" className='form-control' value={formik.values.activation_date} onChange={formik.handleChange} onBlur={formik.handleBlur} ref={activationDateRef} onClick={() => activationDateRef.current?.showPicker()} />
                                    {formik.touched.activation_date && formik.errors.activation_date ? <div className="form-error">{formik.errors.activation_date}</div> : null}
                                </div>
                                <div className="col-md-6 mt-3">
                                    <label htmlFor="expired_date">Expired Date</label>
                                    <input type='date' name='expired_date' id="expired_date" className='form-control' value={formik.values.expired_date} onChange={formik.handleChange} onBlur={formik.handleBlur} ref={expiredDateRef} onClick={() => expiredDateRef.current?.showPicker()} />
                                    {formik.touched.expired_date && formik.errors.expired_date ? <div className="form-error">{formik.errors.expired_date}</div> : null}
                                </div>
                                {error.length !== 0 &&
                                    <div className="col-md-12 mt-3">
                                        <ErrorComponent errors={error} />
                                    </div>
                                }
                            </div>
                            <div className="form-action mt-3">
                                <button type="button" className='cancel-button' onClick={handleHideModal}>Cancel</button>
                                <button type="submit" className='main-button' disabled={formik?.isSubmitting}>Save</button>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
            {formik?.isSubmitting && <Spinner />}
        </>
    )
}

CouponCodeModal.propTypes = {
    data: PropTypes.object,
    getCouposCodeData: PropTypes.func
}

export default memo(CouponCodeModal);