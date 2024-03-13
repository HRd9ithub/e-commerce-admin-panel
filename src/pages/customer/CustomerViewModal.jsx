import { Modal } from 'react-bootstrap';
import { useState } from 'react'
import { GrView } from 'react-icons/gr'
import IconWrapper from '../../component/IconWrapper';
import PropTypes from "prop-types";

const CustomerViewModal = ({ data }) => {
    const [modalShow, setModalShow] = useState(false);

    // show modal
    const handleShowModal = () => {
        setModalShow(true);
    }

    // hide modal
    const handleHideModal = () => {
        setModalShow(false);
    }

    return (
        <>
            <GrView className='view-icon' onClick={handleShowModal} />
            <Modal
                show={modalShow}
                size="lg"
                backdrop="static"
                keyboard={false}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter" className='w-100 d-flex justify-content-between align-items-center'>
                        <span>View Customer</span>
                        <div onClick={handleHideModal}>
                            <IconWrapper iconName="Close" />
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='customer-view-section row'>
                        <div className="col-md-4">
                            <label className='customer-title'>Full Name</label>
                            <h6 className='customer-value'>{data?.fullName}</h6>
                        </div>
                        <div className="col-md-4">
                            <label className='customer-title'>Email</label>
                            <h6 className='customer-value'>{data?.email}</h6>
                        </div>
                        <div className="col-md-4">
                            <label className='customer-title'>Mobile Number</label>
                            <h6 className='customer-value'>{data?.mobileNumber ? data.mobileNumber : <i className="fa-solid fa-minus"></i>}</h6>
                        </div>
                        {data.address &&
                        <div className="col-md-12 mt-2">
                            <label className='customer-title'>Address</label>
                            <h6 className='customer-value'>{data?.address?.concat(", ", data?.state).concat(", ", data?.city).concat(" ",data.pinCode).concat(" ",data.country)}</h6>
                        </div>}
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}


CustomerViewModal.propTypes = {
    data: PropTypes.object
}


export default CustomerViewModal;