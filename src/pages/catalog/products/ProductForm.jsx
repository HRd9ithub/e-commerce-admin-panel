import { Paper } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Select from 'react-select';
import { Axios } from "../../../service/axios";
import { getLocalStorgeData } from "../../../service/localStorage";
import toast from "react-hot-toast";
import Spinner from "../../../component/Spinner";
import Form from 'react-bootstrap/Form';
import * as Yup from 'yup';
import ErrorComponent from "../../../component/ErrorComponent";

const ProductForm = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState([]);
    const [category, setcategory] = useState([]);
    const [images, setImages] = useState([]);
    const [currentColor, setCurrentColor] = useState('#' + Math.floor(Math.random() * 16777215).toString(16));

    const { id } = useParams();


    // get categories data
    const getCategories = () => {
        setIsLoading(true);
        Axios().get("/category/category", {
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
        getCategories();
        if (id) {
            singleProductGet();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // size option 
    const sizeData = [
        { value: "XXS", label: "XXS" },
        { value: "XS", label: "XS" },
        { value: "S", label: "S" },
        { value: "M", label: "M" },
        { value: "L", label: "L" },
        { value: "XL", label: "XL" },
        { value: "XXL", label: "XXL" },
        { value: "3XL", label: "3XL" },
        { value: "4XL", label: "4XL" },
        { value: "5XL", label: "5XL" },
    ]

    let initialValues = {
        name: "",
        price: 0,
        salePrice: "",
        stock: 0,
        categoryId: null,
        selectCategoryId: null,
        subCategoryId: null,
        description: "",
        size: null,
        images: [],
        status: "Active",
        colors: ["#000000"]
    }

    // validation schema
    const validationSchema = Yup.object().shape({
        name: Yup.string().trim().required('Product name is a required field.'),
        price: Yup.number().min(0, 'Value must be greater than or equal to 0.').required('Price is a required field.'),
        stock: Yup.number().min(0, 'Value must be greater than or equal to 0.').required('Stock is a required field.'),
        description: Yup.string().trim().required('Description is a required field.'),
        categoryId: Yup.string().trim().required('Category is a required field.'),
        selectCategoryId: Yup.object().shape({
            value: Yup.string().required('Category is a required field.'),
        }),
        images: Yup.array().min(1, 'Image must contain at least one item').required('Array is required')
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        validateOnChange: false,
        onSubmit: (values, { resetForm }) => {
            setError([]);
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("price", values.price);
            formData.append("salePrice", values.salePrice);
            formData.append("description", values.description);
            formData.append("stock", values.stock);
            formData.append("categoryId", values.categoryId);
            formData.append("status", values.status);
            if (values.subCategoryId && values.subCategoryId.length !== 0) {
                values?.subCategoryId.map((val) => {
                    return formData.append("subCategoryId", val.value);
                })
            }else{
                formData.append("subCategoryId", "") 
            }
            if (values.size && values.size.length !== 0) {
                values?.size.map((val) => {
                    return formData.append("sizes", val.value);
                })
            }else{
                formData.append("sizes", "") 
            }
            values?.images.map((val) => {
                return formData.append("image", val);
            });
            values?.colors.map((val) => {
                return formData.append("colors", val);
            });

            setIsLoading(true);

            let URL = "";
            if (id) {
                URL = Axios().put(`/product/${id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${getLocalStorgeData("token")}`
                    }
                })
            } else {
            URL = Axios().post("/product", formData, {
                headers: {
                    Authorization: `Bearer ${getLocalStorgeData("token")}`
                }
            })
            }

            URL.then((response) => {
                toast.success(response.data.message);
                navigate("/products");
                resetForm();
                setImages([]);
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
        },
    });

    // categorty format changes
    const categoriesData = useMemo(() => {
        return category?.map((item) => ({ value: item._id, label: item.name })) ?? []
    }, [category]);

    // subCategoiesData format changes
    const subCategoiesData = useMemo(() => {
        const data = category?.find((item) => {
            return item._id.toString() === formik.values?.categoryId?.toString()
        });
        let value = [];
        if (data && data?.subCategory.length !== 0) {
            value = data?.subCategory.map((item) => ({ value: item._id, label: item.name }))
        }
        formik.setFieldValue("subCategoryId", null);
        return value
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formik.values.categoryId]);

    // image upload
    const handleImageUpload = (event) => {
        if (event.target.files.length !== 0) {
            const file = event.target.files[0];
            formik.setFieldValue("images", [...formik.values.images, file]);
            setImages([...images, URL.createObjectURL(file)]);
        }
    }

    // remove image
    const removeImage = (index) => {
        setImages((images) => images.filter((val, id) => id !== index));
        formik.setFieldValue("images", formik.values.images.filter((val, id) => id !== index));
    }

    // color onchange
    const handleColorChange = (event) => {
        setCurrentColor(event.target.value);
    }

    // add color
    const addColor = () => {
        formik.setFieldValue("colors", [...formik.values.colors, currentColor]);
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        setCurrentColor(randomColor);
    }

    // single detail get
    const singleProductGet = () => {
        setIsLoading(true);
        Axios().get(`/product/${id}`, {
            headers: {
                Authorization: `Bearer ${getLocalStorgeData("token")}`
            }
        },).then((response) => {
            const { success, product } = response.data;
            if (success) {
                const { name, price, salePrice, description, categoryId, stock, images, sizes, colors, status, category, subCategory } = product;
                const sizeValue = sizes.map(size => ({value: size, label: size}));
                formik.setFieldValue('name', name);
                formik.setFieldValue('price', price);
                formik.setFieldValue('salePrice', salePrice ? salePrice : 0);
                formik.setFieldValue('subCategoryId', subCategory.map(val => ({value: val._id, label: val.name})));
                formik.setFieldValue('description', description);
                formik.setFieldValue('categoryId', categoryId);
                formik.setFieldValue('selectCategoryId', {value: categoryId, label: category?.name});
                formik.setFieldValue('images', images);
                formik.setFieldValue('stock', stock);
                formik.setFieldValue('colors', colors);
                formik.setFieldValue('size', sizeValue);
                formik.setFieldValue('status', status);
                setImages(images.map((image) => import.meta.env.VITE_API + image));
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

    return (
        <>
            <Paper className='m-3'>
                <div className='row mx-3 pt-3 align-items-center'>
                    <div className="col-md-4 ps-0">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><NavLink to="/" >Dashboard</NavLink></li>
                                <li className="breadcrumb-item"><NavLink to="/products" >Products</NavLink></li>
                                <li className="breadcrumb-item active" aria-current="page">{id ? "Edit" : "Add"}</li>
                            </ol>
                        </nav>
                    </div>
                    <div className="col-md-1 ms-auto ps-0">
                        <button className='w-100 main-button' onClick={() => navigate("/products")} >Back</button>
                    </div>
                </div>
                <hr className='mb-0' />
                <div className="form-section mx-4 py-3">
                    <form onSubmit={formik.handleSubmit}>
                        <div>
                            <div className="product-image-preview-form d-flex gap-3">
                                {images.map((val, ind) => {
                                    return (
                                        <div key={ind} className="position-relative">
                                            <i className="fa-solid fa-xmark product-image-remove" onClick={() => removeImage(ind)}></i>
                                            <div className="product-image-box">
                                                <img src={val} alt="Avatar" className="img-fluid" width="100%" height="auto" />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <label className="product-image-upload-btn mt-3"> <input type="file" name="images" id="image" className="d-none" accept="image/*" onChange={handleImageUpload} onBlur={formik.handleBlur} />+ Upload</label>
                        {formik.touched.images && formik.errors.images ? <div className="form-error">{formik.errors.images}</div> : null}
                        <div className="row mt-2">
                            <div className="col-md-4">
                                <label htmlFor="name">Product Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    className='form-control'
                                    placeholder="Product name"
                                    type="text"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.name && formik.errors.name ? <div className="form-error">{formik.errors.name}</div> : null}
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="price">Price</label>
                                <input
                                    id="price"
                                    name="price"
                                    className='form-control'
                                    placeholder="Price"
                                    type="number"
                                    min={0}
                                    value={formik.values.price}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.price && formik.errors.price ? <div className="form-error">{formik.errors.price}</div> : null}
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="salePrice">Sale Price</label>
                                <input
                                    id="salePrice"
                                    name="salePrice"
                                    className='form-control'
                                    placeholder="Sale price"
                                    type="number"
                                    min={0}
                                    value={formik.values.salePrice}
                                    onChange={formik.handleChange}
                                />
                            </div>
                            <div className="col-md-4 mt-2">
                                <label htmlFor="stock">Stock</label>
                                <input
                                    id="stock"
                                    name="stock"
                                    className='form-control'
                                    placeholder="Sale price"
                                    type="number"
                                    min={0}
                                    value={formik.values.stock}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.stock && formik.errors.stock ? <div className="form-error">{formik.errors.stock}</div> : null}
                            </div>
                            <div className="col-md-4 mt-2">
                                <label htmlFor="categoryId">Category</label>
                                <Select
                                    options={categoriesData}
                                    id="categoryId"
                                    name="categoryId"
                                    placeholder="Select category"
                                    value={formik.values.selectCategoryId}
                                    onChange={(e) => {
                                        formik.setFieldValue('selectCategoryId', e)
                                        formik.setFieldValue('categoryId', e.value)
                                    }}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.categoryId && formik.errors.categoryId ? <div className="form-error">{formik.errors.categoryId}</div> : null}
                            </div>
                            <div className="col-md-4 mt-2">
                                <label htmlFor="subCategoryId">Sub category</label>
                                <Select
                                    options={subCategoiesData}
                                    isDisabled={!formik.values.categoryId}
                                    id="subCategoryId"
                                    name="subCategoryId"
                                    isMulti
                                    placeholder="Select sub category"
                                    value={formik.values.subCategoryId}
                                    onChange={(e) => formik.setFieldValue('subCategoryId', e)}
                                />
                            </div>
                            <div className="col-md-12 mt-2">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    className='form-control'
                                    placeholder="Description"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.description && formik.errors.description ? <div className="form-error">{formik.errors.description}</div> : null}
                            </div>
                            <div className="col-md-4 mt-2">
                                <label htmlFor="size">Size</label>
                                <Select
                                    options={sizeData}
                                    id="size"
                                    name="size"
                                    isMulti
                                    placeholder="Select size"
                                    value={formik.values.size}
                                    onChange={(e) => formik.setFieldValue('size', e)}
                                />
                            </div>
                            <div className="col-md-4 mt-2">
                                <label htmlFor="size" className="d-block">Status</label>
                                <div className="my-2">
                                    <Form.Check
                                        inline
                                        label="Active"
                                        name="status"
                                        type="radio"
                                        id="Active"
                                        className="mb-0 status-radio"
                                        checked={formik.values.status === "Active"}
                                        onChange={() => formik.setFieldValue("status", "Active")}
                                    />
                                    <Form.Check
                                        inline
                                        label="Inactive"
                                        name="status"
                                        type="radio"
                                        id="Inactive"
                                        className="mb-0 status-radio"
                                        checked={formik.values.status === "Inactive"}
                                        onChange={() => formik.setFieldValue("status", "Inactive")}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4 mt-2">
                                <label htmlFor="colors">Colors</label>
                                <div className="d-flex gap-3">
                                    <input type="color" className="form-control form-control-color" id="colors" value={currentColor} onChange={handleColorChange} />
                                    <label onClick={addColor} className="add-color-btn">+ </label>
                                </div>
                                <div className="d-flex gap-1 mt-2">
                                    {formik.values.colors.map((val, id) => (
                                        <div key={id} className="color-preview-circle" style={{ backgroundColor: val }}></div>
                                    ))}
                                </div>
                            </div>
                            {error.length !== 0 &&
                                <div className="col-md-12 mt-3">
                                    <ErrorComponent errors={error} />
                                </div>
                            }
                            <div className="form-action mt-3 justify-content-end">
                                <button type="button" className='cancel-button' onClick={() => navigate("/products")}>Cancel</button>
                                <button type="submit" className='main-button' disabled={isLoading}>Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            </Paper>
            {isLoading && <Spinner />}
        </>
    )
}



export default ProductForm;
