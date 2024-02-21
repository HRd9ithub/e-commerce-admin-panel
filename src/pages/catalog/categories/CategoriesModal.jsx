import { useState } from 'react'
import { FaRegEdit } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import { Axios } from '../../../service/axios';
import { getLocalStorgeData } from '../../../service/localStorage';
import ErrorComponent from "../../../component/ErrorComponent";
import Spinner from "../../../component/Spinner";
import IconWrapper from '../../../component/IconWrapper';

const CategoriesModal = ({ data, getCategoriesData }) => {
    const [modalShow, setModalShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState([]);

    let initialValues = {
        name: ""
    }

    // validation schema
    const validationSchema = Yup.object().shape({
        name: Yup.string().trim().required('Category name is a required field.'),
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
        setIsLoading(true);
        setError([]);

        let URL = "";
        if (data) {
            URL = Axios().put(`/category/${value.id}`, {name: value.name}, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getLocalStorgeData("token")}`
                }
            })
        } else {
            URL = Axios().post("/category", value, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getLocalStorgeData("token")}`
                }
            })
        }

        URL.then((response) => {
            toast.success(response.data.message);
            getCategoriesData();
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
            name: data.name,
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
                        <span>{data ? "Update Category" : "Add Category"}</span>
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
                                <div className="col-md-12">
                                    <label htmlFor="name">Category Name</label>
                                    <Field type="text" id='name' name="name" className='form-control' placeholder='Category name' />
                                    <ErrorMessage name="name" component="div" className='form-error' />
                                </div>
                                {error.length !== 0 &&
                                    <div className="col-md-12 mt-3">
                                        <ErrorComponent errors={error} />
                                    </div>
                                }
                                <div className="form-action mt-3">
                                    <button type="button" className='cancel-button' onClick={handleHideModal}>Cancel</button>
                                    <button type="submit" className='main-button'>Save</button>
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

CategoriesModal.propTypes = {
    data: PropTypes.object,
    getCategoriesData: PropTypes.func
}

export default CategoriesModal;