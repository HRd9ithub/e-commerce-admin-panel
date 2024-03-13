import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel } from "@mui/material";
import moment from 'moment';
import { NavLink, useNavigate } from 'react-router-dom';
import { getLocalStorgeData } from '../../service/localStorage';
import { NumberFormatConvert } from '../../utils/NumberFormatConvert';
import Spinner from '../../component/Spinner';
import { Axios } from '../../service/axios';

const Orders = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [orderList, setOrderList] = useState([]);
    // pagination state
    const [count, setCount] = useState(5)
    const [page, setpage] = useState(0);
    const navigate = useNavigate();

    // get order list function
    function getOrderList() {
        setIsLoading(true);
        Axios().get("/order", {
            headers: {
                "Authorization": `Bearer ${getLocalStorgeData("token")}`
            }
        }).then((response) => {
            if (response.data.success) {
                setOrderList(response.data.data);
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
        if (getLocalStorgeData("token")) {
            getOrderList();
        }
    }, []);

    // ==================== table sort part =============
    // sort state
    const [order, setOrder] = useState("asc")
    const [orderBy, setOrderBy] = useState("createdAt");

    // pagination function
    const onChangePage = (e, page) => {
        setpage(page)
    }

    const onChangeRowsPerPage = (e) => {
        setCount(e.target.value)
    }

    // sort function
    const handleRequestSort = (name) => {
        const isAsc = (orderBy === name && order === "asc");

        setOrderBy(name)
        setOrder(isAsc ? "desc" : "asc")
    }

    const descedingComparator = (a, b, orderBy) => {
        const shipping = ["fullName", "email", "mobileNumber"];
        if (shipping.includes(orderBy)) {
            if (b["shipping"][orderBy] < a["shipping"][orderBy]) {
                return -1
            }
            if (b["shipping"][orderBy] > a["shipping"][orderBy]) {
                return 1
            }
            return 0
        } else {
            if (b[orderBy] < a[orderBy]) {
                return -1
            }
            if (b[orderBy] > a[orderBy]) {
                return 1
            }
            return 0
        }
    }

    const getComparator = (order, orderBy) => {
        return order === "desc" ? (a, b) => descedingComparator(a, b, orderBy) : (a, b) => -descedingComparator(a, b, orderBy)
    }

    const sortRowInformation = (array, comparator) => {
        const rowArray = array.map((elem, ind) => [elem, ind])

        rowArray.sort((a, b) => {
            const order = comparator(a[0], b[0])
            if (order !== 0) return order
            return a[1] - b[1]
        })
        return rowArray.map((el) => el[0])
    }

    return (
        <>
            <Paper className='m-3'>
                <div className='row mx-3 pt-3 align-items-center'>
                    <div className="col-lg-8 col-sm-6 col-12 ps-0">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><NavLink to="/" >Dashboard</NavLink></li>
                                <li className="breadcrumb-item active" aria-current="page">Orders</li>
                            </ol>
                        </nav>
                    </div>
                    <div className="col-lg-1 col-sm-2 col-4 ms-auto ps-0">
                        <button className='w-100 main-button' onClick={() => navigate("/")}>Back</button>
                    </div>
                </div>
                <hr className='my-2' />
                <div className="order-table mx-3">
                    <TableContainer >
                        <Table className="common-table-section">
                            <TableHead className="common-header">
                                <TableRow>
                                    <TableCell>
                                        <TableSortLabel active={orderBy === "orderId"} direction={orderBy === "orderId" ? order : "asc"} onClick={() => handleRequestSort("orderId")}>
                                            Id
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel active={orderBy === "fullName"} direction={orderBy === "fullName" ? order : "asc"} onClick={() => handleRequestSort("fullName")}>
                                            Name
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel active={orderBy === "email"} direction={orderBy === "email" ? order : "asc"} onClick={() => handleRequestSort("email")}>
                                            Email
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel active={orderBy === "mobileNumber"} direction={orderBy === "mobileNumber" ? order : "asc"} onClick={() => handleRequestSort("mobileNumber")}>
                                            Phone
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel active={orderBy === "total"} direction={orderBy === "total" ? order : "asc"} onClick={() => handleRequestSort("total")}>
                                            Total
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align='center'>
                                        <TableSortLabel active={orderBy === "status"} direction={orderBy === "status" ? order : "asc"} onClick={() => handleRequestSort("status")}>
                                            Status
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel active={orderBy === "createdAt"} direction={orderBy === "createdAt" ? order : "asc"} onClick={() => handleRequestSort("createdAt")}>
                                            Created At
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align='center'>
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orderList.length !== 0 ? sortRowInformation(orderList, getComparator(order, orderBy)).slice(count * page, count * page + count).map((val, ind) => {
                                    return (
                                        <TableRow key={ind}>
                                            <TableCell className='id-cell'>#{val.orderId}</TableCell>
                                            <TableCell>{val.shipping.fullName}</TableCell>
                                            <TableCell>{val.shipping.email}</TableCell>
                                            <TableCell>{val.shipping.mobileNumber}</TableCell>
                                            <TableCell>{NumberFormatConvert(val.total)}</TableCell>
                                            <TableCell align='center'>
                                                <span className={val.status}>{val.status}</span>
                                            </TableCell>
                                            <TableCell>{moment(val.createdAt).format("DD MMM YYYY hh:mm:ss A")}</TableCell>
                                            <TableCell align='center'>
                                                <div className='order-action'>
                                                    <NavLink to={`/order/${val._id}`}>
                                                        <i className="fa-regular fa-eye order-view-icon"></i>
                                                    </NavLink>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }) :
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">
                                            No Records Found
                                        </TableCell>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 15, 25, 50, 100]}
                        align='left'
                        component="div"
                        onPageChange={onChangePage}
                        onRowsPerPageChange={onChangeRowsPerPage}
                        rowsPerPage={count}
                        count={orderList.length}
                        page={page}>
                    </TablePagination>
                </div>
            </Paper>
            {isLoading && <Spinner />}
        </>
    )
}

export default Orders