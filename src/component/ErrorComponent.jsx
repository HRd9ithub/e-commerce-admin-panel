import { FaCircleExclamation } from "react-icons/fa6";
import PropTypes from 'prop-types';

const ErrorComponent = ({ errors }) => {
    return (
        <div className='error-box p-2'>
            <div className="d-flex g-2 align-items-center">
                <FaCircleExclamation className="me-2" />
                <span>Please complete following details</span>
            </div>
            <ol className='mt-2 mb-0'>
                {errors.map((curElem, ind) => {
                    return <li key={ind}>{curElem}</li>
                })}
            </ol>
        </div>
    )
}

ErrorComponent.propTypes = {
    errors: PropTypes.array.isRequired
};


export default ErrorComponent