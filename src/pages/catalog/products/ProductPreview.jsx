import { Paper } from "@mui/material";
import toast from "react-hot-toast";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { getLocalStorgeData } from "../../../service/localStorage";
import { Axios } from "../../../service/axios";
import { useEffect, useState } from "react";
import Spinner from "../../../component/Spinner";
import { NumberFormatConvert } from '../../../utils/NumberFormatConvert';

const ProductPreview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [product, setProduct] = useState({});
    const [currentImage, setCurrentImage] = useState("");

    useEffect(() => {
        singleProductGet();
    }, [])

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
                setProduct(product);
                setCurrentImage(import.meta.env.VITE_API + product.thumbnail);
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
        <Paper className='m-3'>
            <div className='row mx-3 pt-3 align-items-center'>
                <div className="col-md-4 ps-0">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><NavLink to="/" >Dashboard</NavLink></li>
                            <li className="breadcrumb-item"><NavLink to="/products" >Products</NavLink></li>
                            <li className="breadcrumb-item active" aria-current="page">View</li>
                        </ol>
                    </nav>
                </div>
                <div className="col-md-1 ms-auto ps-0">
                    <button className='w-100 main-button' onClick={() => navigate("/products")}>Back</button>
                </div>
            </div>
            <hr className='mb-0' />
            <div className='row mx-3'>
                <div className="col-md-5 mx-auto py-3 d-flex justify-content-center flex-column">
                    <div className="product-main-image text-center">
                        <img src={currentImage} alt="product-image" width="80%" height="auto" className="img-fluid" />
                    </div>
                    {product.images && product.images.length > 1 &&
                        <div className="product-image-sider py-3 d-flex gap-2 justify-content-center">
                            {product?.images?.map((val) => {
                                return <NavLink className="product-image-container" key={val} onClick={() => setCurrentImage(import.meta.env.VITE_API + val)}>
                                    <img src={import.meta.env.VITE_API + val} alt="product-image" width="100" height="auto" className="img-fluid" />
                                </NavLink>
                            })}
                        </div>
                    }
                </div>
                <div className="col-md-6 col-12 d-flex justify-content-center flex-column mx-auto py-3">
                    <h3 className="product-title text-capitalize">
                        {product.name}
                        <span className={`product-status-bej ms-1 ${product.status === "Active" ? "active" : "in-active"}`}>{product.status}</span>
                    </h3>
                    <div className="product-price d-flex gap-2">
                        <h3> {product.salePrice ? NumberFormatConvert(product.salePrice) : NumberFormatConvert(product.price)}</h3>
                        {product.salePrice && <span className="sale pt-1">{NumberFormatConvert(product.price)}</span>}
                    </div>
                    <hr className="my-1" />
                    <p className="product-description mb-0">{product.description}</p>
                    <div className="product-stock-status">
                        <span className={product.stock ? "stock" : "out-stock"}>{product.stock ? "In Stock" : "Out of Stock"}</span>
                    </div>
                    <div className="product-table">
                        <div className="product-table-head">
                            <p>Categor: </p>
                        </div>
                        <div className="product-table-value">
                            <h6>{product?.category?.name}</h6>
                        </div>
                    </div>
                    {product.subCategory && product.subCategory?.length !== 0 &&
                        <div className="product-table">
                            <div className="product-table-head">
                                <p>Sub Categories: </p>
                            </div>
                            {product.subCategory?.map((item) => {
                                return (
                                    <div className="product-table-value" key={item._id}>
                                        <h6>{item.name}</h6>
                                    </div>
                                )
                            })}
                        </div>
                    }
                    {product.stock !== 0 &&
                        <div className="product-table">
                            <div className="product-table-head">
                                <p>Stock: </p>
                            </div>
                            <div className="product-table-value">
                                <h6>{product.stock}</h6>
                            </div>
                        </div>
                    }
                    {product.sizes && product.sizes?.length !== 0 &&
                        <div className="product-table">
                            <div className="product-table-head">
                                <p>Size: </p>
                            </div>
                            <div className="product-common-section">
                                {product.sizes.map(size => {
                                    return <div className="product-size-box" key={size}>{size}</div>
                                })}
                            </div>
                        </div>
                    }
                    <div className="product-table">
                        <div className="product-table-head">
                            <p>Color: </p>
                        </div>
                        <div className="product-common-section">
                            {product.colors && product.colors.map((color, ind) => {
                                return <div className="color-preview-circle" style={{ backgroundColor: color }} key={ind}></div>
                            })}
                        </div>
                    </div>
                </div>
            </div>
            {isLoading && <Spinner />}
        </Paper>
    )
}

export default ProductPreview
