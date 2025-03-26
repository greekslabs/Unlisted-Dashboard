import React, { useState, useRef, useEffect } from 'react'
import './Portfolio.css'
import Swal from 'sweetalert2'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Auth'

function Portfolio() {
    const [portfolio, setportfolio] = useState({
        user: "", product: "", transaction_type: "", quantity: ""
    })

    const [customers, setCustomers] = useState([]);

    const [data, setData] = useState([])
    const [fetchpro, setFetchPro] = useState([])
    const [img, setImg] = useState("")
    const [edit, setEdit] = useState({
        user: "", product: "", transaction_type: "", quantity: ""
    })

    const [search, setsearch] = useState("")
    const token= useState(localStorage.getItem('token'))

    // const [token, setToken] = useState(localStorage.getItem('token'))
    const api_path = process.env.REACT_APP_API_URL;
    const api_path_customer = process.env.REACT_APP_ACCOUNTS



    const [currentPage, setCurrentPage] = useState(1)
    const rowsperPage = 5


    const buttonRef = useRef(null)
    const modalRef = useRef(null)
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate()
    // const token = localStorage.getItem('token');

    // useEffect(() => {
    //     fetchProducts()
    //     fetchPortfolio()
    //     fetchCustomers()

    // }, [])


    useEffect(() => {
        const token = localStorage.getItem('token')
        if (isAuthenticated) {
            navigate('/portfolio')
            fetchProducts(token)
            fetchPortfolio(token)
            fetchCustomers(token)
        }
        else {
            logout()
            navigate('/')
        }
        // setToken(token)

        // if (!token) {
        //     window.location.href = '/'
        // }
        // else {
        //    fetchProducts()
        //    fetchPortfolio()
        //    fetchCustomers()
        // }
    }, [])






    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${api_path}products/`, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });
            // console.log(res);
            setFetchPro(res.data.data);


        } catch (error) {
            console.log(error.status)
            if (error.status === 404) {
                navigate('/')
                logout()
                Swal.fire({
                    title: 'Session Expired,Login And Try Again!!'
                })

            }
        }
    };


    const fetchPortfolio = async () => {
        try {
            const res = await axios.get(`${api_path}transactions/`,
                {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                }
            )

            // console.log("portfolio", res)
            setData(res.data)

        }
        catch (error) {
            console.log(error)
            Swal.fire("Error", "", "error")
        }
    }

    const fetchCustomers = async () => {
        try {
            const res = await axios.get(`${api_path_customer}customers`, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });
            // console.log("Customers Data:", res.data);
            setCustomers(res.data);
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    };




    const handleInputs = async (e) => {
        e.preventDefault()
        const { user, product, transaction_type, quantity } = portfolio
        if (!user || !product || !transaction_type || !quantity) {
            Swal.fire({ title: "Enter Valid Inputs", icon: 'warning', timer: 3000 })
            return
        }
        try {
            const res = await axios.post(`${api_path}transactions/`, portfolio,
                {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                }
            )
            console.log("portfolio add", res)
            if (res.data.message==="Transaction created successfully") {
                fetchPortfolio()
                Swal.fire({ title: "Portfolio Added SuccessFully", icon: "success", timer: 3000, showConfirmButton: false, toast: true, position: 'top-end' })
                setportfolio({ user: "", product: "", transaction_type: "", quantity: "" })
                setImg("")
                if (buttonRef.current) {
                    buttonRef.current.value = "";
                }


            }
            else {
                Swal.fire({ title: "Something Went Wrong", icon: "error", timer: 3000, showConfirmButton: false, toast: true, position: 'top-end' })
            }

        }
        catch (error) {
            const er = error?.response
            console.error("Error add portfolio:", error?.response);
            Swal.fire(`Failed to add portfolio ${er?.data?.errors} `, "", "error");
        }
    }




    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are You Sure?",
            text: "Are You sure, deleting it !?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.delete(`${api_path}transactions/${id}/`,
                        {
                            headers: {
                                Authorization: `Token ${token}`
                            }
                        }
                    );
                    // console.log("portfolio delete", res)
                    if (res.data.message === "Deleted successfully") {
                        Swal.fire({ title: "Deletion SuccessFull", icon: "success", timer: 3000, showConfirmButton: false, toast: true, position: 'top-end' })
                        fetchPortfolio()
                    }
                    else {
                        Swal.fire({ title: "Something Went Wrong", icon: "error", timer: 3000, showConfirmButton: false, toast: true, position: 'top-end' })
                    }

                }
                catch (error) {
                    const er = error?.response
                    console.error("Error delete portfolio:", error?.response);
                    Swal.fire(`Failed to delete portfolio ${er?.data?.errors} `, "", "error");
                }

            }
        })
    }

    // const removeImg = () => {
    //     setImg('')
    // }

    const openModal = (portfolio) => {
        setEdit(portfolio)
    }

    const handleEdit = async (id) => {
        if (!edit.user || !edit.product || !edit.transaction_type || !edit.quantity) {
            Swal.fire({ title: "Enter Valid Inputs", icon: 'warning', timer: 3000 })
            return
        }
        try {
            const res = await axios.patch(`${api_path}transactions/${edit.id}/`, edit,
                {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                }
            )
            // console.log("Portfolio Edit", res)
            if (res.data.message === "Updated selected Transaction details") {
                fetchPortfolio()
                // setData(data.map(item => (item.id === edit.id ? res.data.data : item)))
                Swal.fire({ title: "Edit SuccessFull", icon: "success", timer: 3000, showConfirmButton: false, toast: true, position: 'top-end' })
                modalRef.current.click()


            }
            else {
                Swal.fire({ title: "Edit Failed", icon: "error", timer: 3000, showConfirmButton: false, toast: true, position: 'top-end' })
            }

        }
        catch (error) {
            const er = error?.response
            console.error("Error edit portfolio:", error?.response);
            Swal.fire(`Failed to edit portfolio ${er?.data?.errors} `, "", "error");
        }

    }


    const handleSearch = (updatedSearch) => {
        setsearch(updatedSearch);
        setCurrentPage(1);
    };


    const filteredData = data.filter((item) => item.user_name.toLowerCase().includes(search.toLowerCase()))


    const totalPages = Math.ceil(filteredData.length / rowsperPage)
    const indexOfLastItem = currentPage * rowsperPage
    const indexOfFirstItem = indexOfLastItem - rowsperPage
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)

    const handleNext = () => {
        if (currentPage < totalPages)
            setCurrentPage((prevPage) => prevPage + 1);

    }

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage((prevPage) => prevPage - 1);

    }

    return (
        <>
            <div className="portfolio common">
                <h2 className="title-common">Portfolio</h2>

                <div className="portfolio-inputs">
                    <form >
                        <div className="row">

                            <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label className="form-label">User</label>
                                <select
                                    id="FormControlSelect1"
                                    className="form-control"
                                    value={portfolio.user}
                                    onChange={(e) => setportfolio({ ...portfolio, user: e.target.value })}
                                >
                                    <option value="">Select a User</option>
                                    {customers.map((customer) => (
                                        <option key={customer.id} value={customer.id}>{customer.username}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4 col-md-4 col-sm-6 col-xs-6">
                                <label className="form-label">Product</label>
                                <select
                                    id="FormControlSelect1"
                                    className="form-control"
                                    value={portfolio.product}
                                    onChange={(e) => setportfolio({ ...portfolio, product: e.target.value })}
                                >
                                    <option value="">Select a Product</option>
                                    {fetchpro.map((item) => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))}
                                </select>
                            </div>




                            <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label className="form-label"> Transaction Type</label>

                                <select
                                    id="FormControlSelect1"
                                    className="form-control"
                                    value={portfolio.transaction_type}
                                    onChange={(e) => setportfolio({ ...portfolio, transaction_type: e.target.value })}


                                >
                                    <option value=""> Select Type</option>
                                    <option value="bond">Buy</option>
                                    <option value="vittafin">Sell</option>

                                </select>
                            </div>


                            <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label className="form-label">Quantity</label>
                                <input type="number" className="form-control" id="FormControlInput1" placeholder="Quantity"
                                    value={portfolio.quantity}
                                    onChange={(e) => setportfolio({ ...portfolio, quantity: e.target.value })} />
                            </div>



                        </div>



                        <button className='form-btn' type='submit' onClick={handleInputs}>Submit</button>
                    </form>
                </div>

                <div className="table-main table-responsive">
                    <table border="1" className='table'>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Product</th>
                                <th>Transaction Type</th>
                                <th>Quantity</th>
                                <th>Variant</th>
                                <th>Action</th>
                                <th></th>
                            </tr>
                            <tr>
                                <td>
                                    <input type="text" placeholder='Search by UserName ' className='search'
                                        onChange={(e) => handleSearch(e.target.value)} />
                                </td>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                currentItems.map((item, id) => (
                                    <tr key={id}>
                                        <td>{item.user_name}</td>
                                        <td>{item.product_name}</td>
                                        <td>{item.transaction_type}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.variant_name}</td>
                                        <td></td>

                                        <td className='details'>
                                            <button onClick={() => handleDelete(item.id)}>Delete</button>
                                            <button data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={() => openModal(item)}>Edit</button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>

                <div className="pagination">
                    <button onClick={handlePrev} disabled={currentPage === 1}>
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>
                    <span>{currentPage} of {totalPages}</span>
                    <button onClick={handleNext} disabled={currentPage === totalPages}>
                        <i className="fa-solid fa-arrow-right"></i>

                    </button>
                </div>


            </div>


            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Edit Portfolio</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">


                            <div className="mb-4 ">
                                <label className="form-label">User</label>
                                <select
                                    id="FormControlSelect1"
                                    className="form-control"
                                    value={edit.user}
                                    onChange={(e) => setEdit({ ...edit, user: e.target.value })}
                                >
                                    <option value="">Select a User</option>
                                    {customers.map((customer) => (
                                        <option key={customer.id} value={customer.id}>{customer.username}</option>
                                    ))}
                                </select>
                            </div>


                            <div className="mb-4 ">
                                <label className="form-label">Product</label>
                                <select
                                    id="FormControlSelect1"
                                    className="form-control"
                                    value={edit.product}
                                    onChange={(e) => setEdit({ ...edit, product: e.target.value })}

                                >
                                    <option value="">Select a Product</option>
                                    {fetchpro.map((item) => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))}
                                </select>
                            </div>



                            <div className="mb-4 ">
                                <label className="form-label">Type</label>


                                <select
                                    id="FormControlSelect1"
                                    className="form-control"
                                    value={edit.type}
                                    onChange={(e) => setEdit({ ...edit, type: e.target.value })}



                                >
                                    <option value=""> Select Type</option>
                                    <option value="bond">Buy</option>
                                    <option value="vittafin">Sell</option>

                                </select>
                            </div>


                            <div className="mb-4 ">
                                <label className="form-label">Quantity</label>
                                <input type="number" className="form-control" id="FormControlInput1" placeholder="Name"
                                    value={edit.quantity}
                                    onChange={(e) => setEdit({ ...edit, quantity: e.target.value })}
                                />
                            </div>







                            {/* <div class="mb-4  ">
                                <label for="FormControlInput1" class="form-label">Image</label>
                                <input type="file" class="form-control" id="FormControlInput1" placeholder="Image"
                                />
                            </div> */}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" ref={modalRef}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleEdit}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Portfolio
