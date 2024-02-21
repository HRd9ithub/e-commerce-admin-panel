import { Paper } from '@mui/material'
import { useEffect, useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel } from "@mui/material";
import toast from 'react-hot-toast';
import { RiDeleteBin6Line } from "react-icons/ri";
import { Axios } from '../../../service/axios';
import { getLocalStorgeData } from '../../../service/localStorage';
import Spinner from '../../../component/Spinner';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaRegEdit } from 'react-icons/fa';
import { GrView } from 'react-icons/gr';
import { NumberFormatConvert } from '../../../utils/NumberFormatConvert';
import IconWrapper from '../../../component/IconWrapper';
import { DateFormatConvert } from '../../../utils/DateFormatConvert';

const Products = () => {
    const navigate = useNavigate();
    // pagination state
    const [count, setCount] = useState(5)
    const [page, setpage] = useState(0);
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchItem, setSearchItem] = useState("");

    // get data for product
    const getProductsData = () => {
        setIsLoading(true);
        Axios().get("/product", {
            headers: {
                Authorization: `Bearer ${getLocalStorgeData("token")}`
            }
        },).then((response) => {
            const { success, products } = response.data;
            if (success) {
                setRecords(products);
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
        getProductsData();
    }, []);

    const recordsFilter = useMemo(() => {
        return records.filter((item) => {
            return item.name?.toLowerCase().includes(searchItem.toLowerCase())
        })
    }, [searchItem, records]);

    // delete funcation
    const handleDelete = (id) => {
        const data = window.confirm("Are you sure you want to delete?");

        if (data) {
            setIsLoading(true);
            Axios().delete(`/product/${id}`, {
                headers: {
                    Authorization: `Bearer ${getLocalStorgeData("token")}`
                }
            },).then((response) => {
                toast.success(response.data.message);
                getProductsData();
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
    }

    // ==================== table sort part =============
    // sort state
    const [order, setOrder] = useState("asc")
    const [orderBy, setOrderBy] = useState("id")
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
        if (orderBy === "category") {
            if (b[orderBy]?.name < a[orderBy]?.name) {
                return -1
            }
            if (b[orderBy]?.name > a[orderBy]?.name) {
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
                    <div className="col-md-4 ps-0">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><NavLink to="/" >Dashboard</NavLink></li>
                                <li className="breadcrumb-item active" aria-current="page">Products</li>
                            </ol>
                        </nav>
                    </div>
                    <div className="col-md-1 ms-auto ps-0">
                        <button className='w-100 main-button' onClick={() => navigate("/products/add")}>Add</button>
                    </div>
                </div>
                <hr className='mb-0' />
                <div className='mx-3'>
                    <div className='col-md-4 float-end my-2'>
                        <input type="search" id='search' name="searchItem" className='form-control' placeholder="Search" value={searchItem} onChange={(e) => setSearchItem(e.target.value)} />
                    </div>
                    <TableContainer >
                        <Table className="common-table-section">
                            <TableHead className="common-header">
                                <TableRow>
                                    <TableCell>
                                        Product
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel active={orderBy === "name"} direction={orderBy === "name" ? order : "asc"} onClick={() => handleRequestSort("name")}>
                                            Product Name
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel active={orderBy === "category"} direction={orderBy === "category" ? order : "asc"} onClick={() => handleRequestSort("category")}>
                                            Category
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel active={orderBy === "price"} direction={orderBy === "price" ? order : "asc"} onClick={() => handleRequestSort("price")}>
                                            Price
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel active={orderBy === "salePrice"} direction={orderBy === "salePrice" ? order : "asc"} onClick={() => handleRequestSort("salePrice")}>
                                            Sale Price
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align='center'>
                                        <TableSortLabel active={orderBy === "stock"} direction={orderBy === "stock" ? order : "asc"} onClick={() => handleRequestSort("stock")}>
                                            Stock
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
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
                                {recordsFilter.length !== 0 ? sortRowInformation(recordsFilter, getComparator(order, orderBy)).slice(count * page, count * page + count).map((val, ind) => {
                                    return (
                                        <TableRow key={ind}>
                                            <TableCell><img src={import.meta.env.VITE_API + val.thumbnail} alt="product-image" width="50" loading="lazy" /></TableCell>                                            <TableCell>{val.name}</TableCell>
                                            <TableCell>{val.category?.name}</TableCell>
                                            <TableCell>{NumberFormatConvert(val.price)}</TableCell>
                                            <TableCell>{val.salePrice ? NumberFormatConvert(val.salePrice) : <IconWrapper iconName="Minus" />}</TableCell>
                                            <TableCell align='center'>
                                                {val.stock ? val.stock :
                                                    <span className="stock-status">
                                                        Out of Stock
                                                    </span>
                                                }</TableCell>
                                            <TableCell>
                                                <span className={val.status === "Active" ? 'status-active' : "status-inactive"}>{val.status}</span>
                                            </TableCell>
                                            <TableCell>{DateFormatConvert(val.createdAt)}</TableCell>
                                            <TableCell align='center'>
                                                <div className='action'>
                                                    <GrView className='view-icon' onClick={() => navigate(`/products/view/${val._id}`)}/>
                                                    <FaRegEdit className='edit-icon' onClick={() => navigate(`/products/edit/${val._id}`)} />
                                                    <RiDeleteBin6Line className='delete-icon' onClick={() => handleDelete(val._id)} />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }) :
                                    <TableRow>
                                        <TableCell colSpan={9} align="center">
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
                        count={recordsFilter.length}
                        page={page}>
                    </TablePagination>
                </div>
            </Paper>
            {isLoading && <Spinner />}
        </>
    )
}

export default Products;