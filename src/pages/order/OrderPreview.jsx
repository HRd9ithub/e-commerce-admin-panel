import { Paper } from '@mui/material';
import { useEffect, useRef, useState } from 'react'
import { Table } from 'react-bootstrap';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import moment from 'moment';
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';
import { Axios } from '../../service/axios';
import { getLocalStorgeData } from '../../service/localStorage';
import { NumberFormatConvert } from '../../utils/NumberFormatConvert';
import Spinner from '../../component/Spinner';

const OrderPreview = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [orderList, setOrderList] = useState({});
    const printRef = useRef();

    // get order list function
    function getSingleOrder() {
        setIsLoading(true);
        Axios().get(`/order/${id}`, {
            headers: {
                "Authorization": `Bearer ${getLocalStorgeData("token")}`
            }
        }).then((response) => {
            if (response.data.success) {
                setOrderList(response.data.data || {});
            }
        }).catch((error) => {
            if (!error.response) {
                toast.error(error.message);
            } else if (error.response.data.message) {
                toast.error(error.response.data.message);
            }
        }).finally(() => setIsLoading(false));
    }

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" })
        if (getLocalStorgeData("token")) {
            getSingleOrder();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <>
                <Paper className='px-3 m-3'>
                    <div className='row mx-3 pt-3 align-items-center flex-wrap'>
                        <div className="col-lg-8 col-sm-6 col-12 ps-0">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><NavLink to="/" >Home</NavLink></li>
                                    <li className="breadcrumb-item"><NavLink to="/order" >Order</NavLink></li>
                                    <li className="breadcrumb-item active" aria-current="page">Preview</li>
                                </ol>
                            </nav>
                        </div>
                        <div className="col-lg-3 col-sm-6 col-8 ms-auto ps-0 mt-2 mt-md-0 mt-lg-0 mt-xl-0">
                            <div className="d-flex gap-2 ">
                                <ReactToPrint content={() => printRef.current}>
                                    <PrintContextConsumer>
                                        {({ handlePrint }) => (
                                            <button className='w-100 main-button' onClick={handlePrint}>Download</button>
                                        )}
                                    </PrintContextConsumer>
                                </ReactToPrint>
                                <button className='w-100 main-button' onClick={() => navigate("/orders")}>Back</button>
                            </div>
                        </div>
                    </div>
                    <hr className='my-2' />
                    <div className='receipt-section' ref={printRef}>
                        <div className="row delivery-section">
                            <div className='col-lg-6 col-12 mt-3'>
                                <ul>
                                    <li className='order-preview-heading'>
                                        <p>Order Id</p>
                                        <p>{orderList?.orderId}</p>
                                    </li>
                                    <li className='order-preview-heading'>
                                        <p>Order Date</p>
                                        <p>{moment(orderList.createdAt).format("DD MMM YYYY")}</p>
                                    </li>
                                    <li className='order-preview-heading'>
                                        <p>Name</p>
                                        <p>{orderList.shipping?.fullName}</p>
                                    </li>
                                    <li className='order-preview-heading'>
                                        <p>Email</p>
                                        <p>{orderList.shipping?.email}</p>
                                    </li>
                                    <li className='order-preview-heading'>
                                        <p>Phone</p>
                                        <p>{orderList.shipping?.mobileNumber}</p>
                                    </li>
                                    <li className='order-preview-heading'>
                                        <p>Address</p>
                                        <p>{orderList.shipping?.address}, {orderList.shipping?.city}, {orderList.shipping?.state}- {orderList.shipping?.pinCode}, {orderList.shipping?.country}</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <hr className='my-1 mt-0' />
                        <div className="row row mx-3 pt-3">
                            <div className="col-12">
                                <Table hover>
                                    <thead>
                                        <tr>
                                            <th>Items</th>
                                            <th>Quantity</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orderList.products?.map((product, ind) => {
                                            const { name, thumbnail, selectedSize, selectedColor, quantity, amount } = product;
                                            return (
                                                <tr key={ind}>
                                                    <td>
                                                        <div className="d-flex gap-2">
                                                            <div className="order-product-image">
                                                                <img src={import.meta.env.VITE_API + thumbnail} className='img-fluid' alt='image_order' />
                                                            </div>
                                                            <div>
                                                                <p className='mb-2'>{name}</p>
                                                                <div className='d-flex align-items-center gap-2'>
                                                                    <span className='selected-color' style={{ background: selectedColor }}></span>
                                                                    {selectedSize && <span className="selectedsize">Size: {selectedSize}</span>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>{quantity}</td>
                                                    <td>{NumberFormatConvert(amount)}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                        {/* <hr className='my-2' /> */}
                        <div className="row justify-content-end px-3 pb-3 pb-lg-2">
                            <div className=' order-summary-section col-lg-3 col-sm-6 col-12 text-start mt-3'>
                                <ul className='p-0 pt-3'>
                                    <li className='single-col-order'>
                                        <p>Subtotal:</p>
                                        <p>{NumberFormatConvert(orderList.subTotal)}</p>
                                    </li>
                                    {orderList.coupon && <>
                                        <li className='single-col-order'>
                                            <p>Coupon:</p>
                                            <p>{orderList.coupon}</p>
                                        </li>
                                        <li className='single-col-order'>
                                            <p>Discount:</p>
                                            <p>- {NumberFormatConvert(orderList.disCount)}</p>
                                        </li>
                                    </>}
                                    <hr />
                                    <li className='single-col-order'>
                                        <p>Order Total</p>
                                        <p>{NumberFormatConvert(orderList.total)}</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </Paper>
            {isLoading && <Spinner />}
        </>
    )
}

export default OrderPreview;
