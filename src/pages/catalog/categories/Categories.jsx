import { Paper } from '@mui/material'
import { useEffect, useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel } from "@mui/material";
import toast from 'react-hot-toast';
import { RiDeleteBin6Line } from "react-icons/ri";
import { Axios } from '../../../service/axios';
import { getLocalStorgeData } from '../../../service/localStorage';
import { Spinner } from 'react-bootstrap';
import CategoriesModal from "./CategoriesModal";
import { NavLink } from 'react-router-dom';

const Categories = () => {
    // pagination state
    const [count, setCount] = useState(5)
    const [page, setpage] = useState(0);
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchItem, setSearchItem] = useState("");

    // get data for categories
    const getCategoriesData = () => {
        setIsLoading(true);
        Axios().get("/category/", {
            headers: {
                Authorization: `Bearer ${getLocalStorgeData("token")}`
            }
        },).then((response) => {
            const { success, data } = response.data;
            if (success) {
                setRecords(data);
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
        getCategoriesData();
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
            Axios().delete(`/category/${id}`, {
                headers: {
                    Authorization: `Bearer ${getLocalStorgeData("token")}`
                }
            },).then((response) => {
                toast.success(response.data.message);
                getCategoriesData();
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
        if (b[orderBy] < a[orderBy]) {
            return -1
        }
        if (b[orderBy] > a[orderBy]) {
            return 1
        }
        return 0


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
                                <li className="breadcrumb-item active" aria-current="page">Categories</li>
                            </ol>
                        </nav>
                    </div>
                    <div className="col-md-1 ms-auto ps-0">
                        <CategoriesModal getCategoriesData={getCategoriesData} />
                    </div>
                </div>
                <hr className='mb-0'/>
                <div className='mx-3'>
                    <div className='col-md-4 float-end my-2'>
                        <input type="search" id='search' name="searchItem" className='form-control' placeholder="Search" value={searchItem} onChange={(e) => setSearchItem(e.target.value)} />
                    </div>
                    <TableContainer >
                        <Table className="common-table-section">
                            <TableHead className="common-header">
                                <TableRow>
                                    <TableCell>
                                        Id
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel active={orderBy === "name"} direction={orderBy === "name" ? order : "asc"} onClick={() => handleRequestSort("name")}>
                                            Category Name
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
                                            <TableCell>{ind + 1}</TableCell>
                                            <TableCell>{val.name}</TableCell>
                                            <TableCell align='center'>
                                                <div className='action'>
                                                    <CategoriesModal data={val} getCategoriesData={getCategoriesData} />
                                                    <RiDeleteBin6Line className='delete-icon' onClick={() => handleDelete(val._id)} />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }) :
                                    <TableRow>
                                        <TableCell colSpan={3} align="center">
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

export default Categories