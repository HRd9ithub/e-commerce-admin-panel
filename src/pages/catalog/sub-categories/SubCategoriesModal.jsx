import { useEffect, useState } from 'react'
import { FaRegEdit } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Axios } from '../../../service/axios';
import { getLocalStorgeData } from '../../../service/localStorage';
import toast from 'react-hot-toast';
import ErrorComponent from '../../../component/ErrorComponent';
import Spinner from '../../../component/Spinner';
import IconWrapper from '../../../component/IconWrapper';

const SubCategoriesModal = ({ data, getSubCategoriesData }) => {
    const [modalShow, setModalShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState([]);
    const [category, setcategory] = useState([]);

    let initialValues = {
        name: "",
        categoryId: ""
    }

    // validation schema
    const validationSchema = Yup.object().shape({
        name: Yup.string().trim().required('Subcategory name is a required field.'),
        categoryId: Yup.string().trim().required('Category is a required field.'),
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

    // get categories
    const getCategories = () => {
        setIsLoading(true);
        Axios().get("/category/", {
            headers: {
                Authorization: `Bearer ${getLocalStorgeData("token")}`
            }
        },).then((response) => {
            const { success, data } = response.data;
            if (success) {
                setcategory(data);
            }
        }).catch((error) => {
            if (!error.response) {
                toast.error(error.message)
            } else if (error.response.data.message) {
                toast.error(error.response.data.message)
            }
        }).finally(() => {
            setIsLoading(false);
        })
    }

    useEffect(() => {
        modalShow && getCategories();
    }, [modalShow])

    // submit function
    const onSubmit = (value, { resetForm }) => {
        setIsLoading(true);
        setError([]);

        let URL = "";
        if (data) {
            URL = Axios().put(`/sub-category/${value.id}`, value, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getLocalStorgeData("token")}`
                }
            })
        } else {
            URL = Axios().post("/sub-category", value, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getLocalStorgeData("token")}`
                }
            })
        }

        URL.then((response) => {
            toast.success(response.data.message);
            getSubCategoriesData();
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
            id: data._id,
            categoryId: data.categoryId
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
                        <span>{data ? "Update Sub Category" : "Add Sub Category"}</span>
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
                                    <label htmlFor="categoryId">Category</label>
                                    <Field
                                        as="select"
                                        id="categoryId"
                                        name="categoryId"
                                        className="form-control form-select"  // Add any additional classes or styling as needed
                                    >
                                        <option label="Select an option" disabled />
                                        {category.map((val) => {
                                            return <option key={val._id} value={val._id} label={val.name}/>
                                        })}
                                    </Field>
                                    <ErrorMessage name="categoryId" component="div" className='form-error' />
                                </div>
                                <div className="col-md-12 mt-3">
                                    <label htmlFor="name">Sub Category Name</label>
                                    <Field type="text" id='name' name="name" className='form-control' placeholder='Sub category name' />
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

SubCategoriesModal.propTypes = {
    data: PropTypes.object,
    getSubCategoriesData: PropTypes.func
}

export default SubCategoriesModal;