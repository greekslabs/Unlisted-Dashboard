import React, { useState, useEffect, useRef } from 'react'
import './Enquiry.css'
import Swal from 'sweetalert2';
import axios from 'axios';
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import { useAuth } from '../Auth';
import { useNavigate } from 'react-router-dom';




function Enquiry() {
    const [status, setStatus] = useState({
        // id: "",
        status: "Pending",
        price_at_request: 0,
        quantity: 0
    });

    const [data, setData] = useState([])
    const [statusid, setstatusid] = useState('')
    const [statustype, setstatustype] = useState('')
    // const [fetchPro, setFetchPro] = useState([])
    // const [customers, setCustomers] = useState([]);
    const [filtered, setFiltered] = useState([])
    const token= useState(localStorage.getItem('token'))

    // const [token, setToken] = useState(localStorage.getItem('token'))
    const quantityRef = useRef(null)
    const priceRef = useRef(null)
    const [search, setSearch] = useState({
        name: "", product: "", phone: ""
    })
    const [tab, setTab] = useState("Unlisted")

    const [currentPage, setCurrentPage] = useState(1)
    const rowsperPage = 10
    const [prevPage, setprevPage] = useState(0)
    const [totalPages, settotalPages] = useState(0)
    const navigate = useNavigate()
    const { isAuthenticated, logout } = useAuth();
    const api_path = process.env.REACT_APP_API_URL;
    const api_path_customer = process.env.REACT_APP_ACCOUNTS







    // const modalRef = useRef(null)
    const productRef=useRef(null)
    const bondRef=useRef(null)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (isAuthenticated) {
            navigate('/enquiry')
            fetchEnquiry(token)
            fetchCustomers(token)
            fetchProducts(token)
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
        //     fetchEnquiry(token)
        //     fetchCustomers(token)
        //     fetchProducts(token)
        // }
    }, [tab])


    const styles = StyleSheet.create({
        page: {
            padding: 5,
            position: "relative",
            width: "100%",
            height: "100%", // Ensure full page coverage
            borderWidth: 5, // Border thickness
            borderColor: "green", // Border color
            borderStyle: "solid", // Border type (solid, dashed, dotted)
        },


        bgimage: {
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
            zIndex: -1, // Moves it behind content
            opacity: 0.2, // Adjust for visibility

        }, logoContainer: {
            position: "absolute",
            top: 10,
            right: 10,
        },
        logo: { width: 80, height: 80 },
        price: { fontSize: 12, marginBottom: 10, marginTop: 10 },

        section: { marginBottom: 10 },
        title: { fontSize: 18, marginBottom: 5, fontWeight: "bold", textAlign: "center" },
        text: { fontSize: 12, marginBottom: 3 },
        table: {
            display: "flex",
            flexDirection: "column",
            borderWidth: 1,
            borderColor: "#ddd", // Light border color
            borderRadius: 5, // Rounded corners
            overflow: "hidden", // Keep corners clean
        },
        tableHeader: {
            flexDirection: "row",
            backgroundColor: "green", // Blue background for header
            padding: 8,
        },
        headerCell: {
            flex: 1,
            textAlign: "center",
            fontSize: 12,
            fontWeight: "bold",
            color: "#fff", // White text for contrast
        },
        row: {
            flexDirection: "row",
            borderBottomWidth: 1,
            borderBottomColor: "#ddd",
            padding: 8,
            backgroundColor: "#f9f9f9", // Light gray for alternating rows
        },
        cell: {
            flex: 1,
            padding: 5,
            fontSize: 10,
            textAlign: "center",
            borderWidth: 1,
            maxWidth: 120, // Prevents excessive stretching
            minHeight: 20, // Ensures all rows have the same height
            maxHeight: 40, // Prevents row from growing too much
            overflow: "hidden", // Prevents breaking layout
        },

        row: { flexDirection: "row", width: '100%', overflow: 'sroll' },
        cell: { flex: 1, borderWidth: 1, padding: 5, fontSize: 12, textAlign: "center" },
    });

    const MyDocument = () => (
        <Document>
            <Page size="A4" style={styles.page}>


                <Text style={styles.title}>
                    {tab === "Unlisted" ? "Unlisted Report" : "Bond Report"}
                </Text>

                {/* Table */}
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.headerCell}>Name</Text>
                        <Text style={styles.headerCell}>Product Name</Text>
                        <Text style={styles.headerCell}>Phone</Text>
                        <Text style={styles.headerCell}>Email</Text>
                        <Text style={styles.headerCell}>Quantity</Text>
                        {/* <Text style={styles.headerCell}>Variant</Text> */}
                        <Text style={styles.headerCell}>Status</Text>
                    </View>

                    {filtered.map((item, index) => (
                        <View key={index} style={styles.row}>
                            <Text style={styles.cell}>{item.user_name}</Text>
                            <Text style={styles.cell}>{item.product_name}</Text>
                            <Text style={styles.cell}>{item.customer_phone}</Text>
                            <Text style={styles.cell}>
                                {item.customer_email.length > 25
                                    ? item.customer_email.substring(0, 25) + "..."
                                    : item.customer_email}
                            </Text>


                            <Text style={styles.cell}>{item.quantity}</Text>
                            {/* <Text style={styles.cell}>{item.variant_name}</Text> */}
                            <Text style={styles.cell}>{item.status}</Text>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );

    const generatePDF = async () => {
        try {
            const blob = await pdf(<MyDocument />).toBlob(); // Use toBlob() for browsers
            const url = URL.createObjectURL(blob);

            // Create a download link and trigger the download
            const a = document.createElement("a");
            a.href = url;
            a.download = "products.pdf";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // Clean up the object URL
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };







    const fetchCustomers = async (token) => {
        try {
            const res = await axios.get(`${api_path_customer}customers`, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });
            // console.log("Customers Data:", res.data);
            // setCustomers(res.data);
        } catch (error) {
            console.log(error.status)
            if (error.status === 404) {
                navigate('/')
                logout()

                Swal.fire({
                    title: 'Session Expired,Login And Try Again!!',
                    icon: 'warning',
                    timer: 3000
                })

            }
            // const er = error?.response
            // console.error("Error fetching customers:", error?.response);
            // Swal.fire(`Failed to fetching customers ${er?.data?.errors} `, "", "error");
        }
    };


    const fetchProducts = async (token) => {
        try {
            const res = await axios.get(`${api_path}products/`, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });
            // console.log(res.data);
            // setFetchPro(res.data.data);
        } catch (error) {
            const er = error?.response
            console.error("Error fetching Products:", error?.response);
            Swal.fire(`Failed to fetching products ${er?.data?.errors} `, "", "error");
        }
    };

    const handleTab = (type) => {
        setTab(type)

    }

    const fetchEnquiry = async (token) => {
        if (tab === "Unlisted") {
            try {
                const res = await axios.get(`${api_path}enquiries/`,
                    {
                        headers: {
                            Authorization: `Token ${token}`
                        }
                    }
                )
                // console.log("enquiry:", res.data)
                // setData(res.data)
                const enquiry = res.data
                const filtr = enquiry.filter((item) => item.variant_name === "Unlisted")
                setData(filtr)
                // console.log("filtr", filtr)
                setFiltered(filtr)
                // setCurrentPage(enquiry)
                // settotalPages(Math.ceil(enquiry.length/5))
                // console.log("total",totalPages)
                setCurrentPage(1)
                settotalPages(Math.ceil(filtr.length / rowsperPage));

                // console.log("total", Math.ceil(filtr.length / 10));


            }
            catch (error) {
                const er = error?.response
                console.error("Error fetching unlisted:", error?.response);
                Swal.fire(`Failed to fetching unlisted ${er?.data?.errors} `, "", "error");
            }

        }
        else if (tab === "Bond") {
            try {
                const res = await axios.get(`${api_path}enquiries/`,
                    {
                        headers: {
                            Authorization: `Token ${token}`
                        }
                    }
                )
                console.log("enquiry:", res.data)

                const enquiry = res.data
                const filtr = enquiry.filter((item) => item.variant_name === "Bond")
                setData(filtr)
                // console.log("filtr", filtr)
                setFiltered(filtr)
                // setCurrentPage(enquiry)
                // settotalPages(Math.ceil(enquiry.length/5))
                // console.log("total",totalPages)
                setCurrentPage(1)
                settotalPages(Math.ceil(filtr.length / rowsperPage));

                console.log("total", Math.ceil(filtr.length / 10));


            }
            catch (error) {
                const er = error?.response
                console.error("Error fetching Bond:", error?.response);
                Swal.fire(`Failed to fetching Bond ${er?.data?.errors} `, "", "error");
            }
        }

    }




    // const handleFilter = (status) => {
    //     setFiltered(data.filter(item => item.status === status));
    // };



    const handleFilter = (status) => {
        settotalPages(0)

        const filter = data.filter(item =>
            item.status === status &&
            item.user_name.toLowerCase().includes(search.name.toLowerCase()) &&
            item.product_name.toLowerCase().includes(search.product.toLowerCase())


        );
        setFiltered(filter)
        settotalPages(Math.ceil(filter.length / rowsperPage));
        // console.log("filterd",e);
        // console.log("Searched data",e);      
    };

    const handleSearch = (e, type) => {

        const value = e.toLowerCase(); // Extract input value
        const number = String(e);
        // console.log(number)
        // console.log(value, e)
        const filteredData = data.filter(item => {
            if (type === "name") {
                return item.user_name.toLowerCase().includes(value);
            } else if (type === "product") {
                return item.product_name.toLowerCase().includes(value);
            } else if (type === "number") {
                return item.customer_phone.includes(e);
            }
            return false;
        });

        setFiltered(filteredData); // Update state once
    };



    const selectStatus = (e) => {
        setstatustype(e)
        // console.log(e)
        setStatus({ ...status, 'status': e })
    }




    const GetstatusId = (id) => {
        setstatusid(id)
        //   setStatus({...status,'id':id})
    }

    const updateComplete = (e) => {
        const { name, value } = e.target;
        setStatus(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const updateStatus = async () => {
        // console.log(status)
        if (statusid) {
            try {
                const response = await axios.patch(`${api_path}transactions/${statusid}/`,
                    status
                    , {
                        headers: {
                            Authorization: `Token ${token}`
                        }
                    });
                // console.log("update Status", response)

                if (response.data.message === "Updated selected Transaction details") {
                    setStatus(response.data.status);
                    // modalRef.current.click()
                    productRef.current.click()
                    bondRef.current.click()
                    if (status === 'Completed') {
                        quantityRef.current.value = 0
                        priceRef.current.value = 0
                    }

                    fetchEnquiry(token);

                }
            } catch (error) {
                console.error("Error updating status:", error);

            }
        }
    };

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
                    )

                    // console.log("DeletedResponse", res)

                    if (res.data.message === "Deleted successfully") {
                        Swal.fire({ title: "Deletion SuccessFull", icon: "success", timer: 3000, showConfirmButton: false, toast: true, position: 'top-end' })
                        fetchEnquiry(token)

                    }
                    else {
                        Swal.fire({ title: "Something Went Wrong", icon: "error", timer: 3000, showConfirmButton: false, toast: true, position: 'top-end' })

                    }
                }
                catch (error) {
                    const er = error?.response
                    console.error("Error Deleting  Enquiry:", error?.response);
                    Swal.fire(`Failed to Deleting Enquiry ${er?.data?.errors} `, "", "error");

                }
            }
        })
    }


    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
            setprevPage(prevPage + 1)
            // console.log('currentpage', currentPage + 1, prevPage + 1)
        }

    }


    const handlePrev = () => {
        if (currentPage > 1) {
            setprevPage(prevPage - 1)
            setCurrentPage(currentPage - 1)
            // console.log('previous page', prevPage - 1)
        }

    }




    return (
        <>
            <div className="enquiry common">
                <h2 className="title-common">Enquiry</h2>

                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" onClick={() => handleTab("Unlisted")} role="tab" aria-controls="home-tab-pane" aria-selected="true">Unlisted</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" onClick={() => handleTab("Bond")} role="tab" aria-controls="profile-tab-pane" aria-selected="false">Bond</button>
                    </li>

                </ul>
                <div className="tab-content" id="myTabContent">
                    <div className="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabIndex="0">

                        <h3 className='title-common ' >Unlisted Enquiry</h3>
                        <div className="filter">
                            <h5>Filter by:</h5>
                            <span className="badge text-bg-warning" onClick={() => handleFilter("Pending")}>Pending</span>
                            <span className="badge text-bg-secondary" onClick={() => handleFilter("Cancel")}>Cancel</span>
                            <span className="badge text-bg-success" onClick={() => handleFilter("Completed")}>Completed</span>
                        </div>

                        <div className='download'>
                            <button onClick={generatePDF} className='download-btn'>Download</button>

                        </div>

                        <div className="table-main table-responsive">
                            <table border="1" className='table'>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Product Name</th>
                                        <th>Phone</th>
                                        <th>Email</th>
                                        <th>Quantity</th>
                                        {/* <th>Variant</th> */}
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                    <tr>
                                        <td><input type="text" placeholder='Search By Name' className='search'
                                            onChange={(e) => handleSearch(e.target.value, "name")} />
                                        </td>

                                        <td><input type="text" placeholder='Search By Name' className='search'
                                            onChange={(e) => handleSearch(e.target.value, "product")} />
                                        </td>

                                        {/* <td><input type="text" placeholder='Search By Name' className='search'
                                    onChange={(e) => handleSearch(e.target.value,"number")}  />
                                </td> */}

                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td>No Data Found !!!</td>
                                        </tr>
                                    ) :
                                        filtered.slice((prevPage * rowsperPage), (currentPage * rowsperPage)).map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.user_name}</td>
                                                <td>{item.product_name}</td>
                                                <td>{item.customer_phone}</td>
                                                <td>{item.customer_email}
                                                </td>
                                                <td>{item.quantity}</td>
                                                {/* <td>{item.variant_name}</td> */}


                                                <td>
                                                    {item.status === 'Pending' ? (
                                                        <span className="badge text-bg-warning">{item.status}</span>
                                                    ) : item.status === 'Completed' ? (
                                                        <span className="badge text-bg-success">{item.status}</span>
                                                    ) : item.status === 'Cancel' ? (
                                                        <span className="badge text-bg-secondary">{item.status}</span>
                                                    ) : (
                                                        <span className="badge text-bg-light">{item.status}</span>
                                                    )}

                                                    {
                                                        item.status === 'Completed' ? "" :

                                                            <i className="fa-solid fa-pen-to-square"
                                                                data-bs-toggle="modal" data-bs-target="#staticBackdrop"
                                                                onClick={() => GetstatusId(item.id)} style={{ marginLeft: '4px' }} ></i>
                                                    }


                                                </td>
                                                <td className='details'>
                                                    {
                                                        item.status === "Completed" ? "" :
                                                            <button onClick={() => handleDelete(item.id)}>Delete</button>
                                                    }


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




                        <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5" id="staticBackdropLabel">Update Status</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal"  aria-label="Close"  ></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="row">

                                            <div className="mb-4 col-md-6 col-sm-6 ">
                                                <label className="form-label">Status</label>
                                                <select
                                                    className="form-control"
                                                    id="statusSelect"

                                                    onChange={(e) => selectStatus(e.target.value)}

                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Completed">Completed</option>
                                                    <option value="Cancel">Cancel</option>
                                                </select>
                                            </div>

                                            {
                                                statustype === 'Completed' && (
                                                    <>
                                                        <div className="mb-4 col-md-6 col-sm-6">
                                                            <label className="form-label">Buy Price</label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                id="buyPrice"
                                                                placeholder="Enter buy price"
                                                                name='price_at_request'
                                                                // value={status.buyPrice}
                                                                onChange={updateComplete}

                                                                ref={priceRef}
                                                            />
                                                        </div>
                                                        <div className="mb-4 col-md-6 col-sm-6 ">
                                                            <label className="form-label">Quantity</label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                id="quantity"
                                                                name='quantity'
                                                                placeholder="Enter quantity"
                                                                // value={status.quantity}
                                                                onChange={updateComplete}
                                                                ref={quantityRef}
                                                            />
                                                        </div>
                                                    </>
                                                )
                                            } </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"  ref={productRef} >Close</button>
                                        <button type="button" className="btn btn-primary" onClick={updateStatus}>Save</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>







                    <div className="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabIndex="0">
                        <h3 className='title-common ' >Bond Enquiry</h3>


                        <div className="filter">
                            <h5>Filter by:</h5>
                            <span className="badge text-bg-warning" onClick={() => handleFilter("Pending")}>Pending</span>
                            <span className="badge text-bg-secondary" onClick={() => handleFilter("Cancel")}>Cancel</span>
                            <span className="badge text-bg-success" onClick={() => handleFilter("Completed")}>Completed</span>
                        </div>

                        <div className='download'>
                            <button onClick={generatePDF} className='download-btn'>Download</button>

                        </div>


                        <div className="table-main table-responsive">
                            <table border="1" className='table'>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Product Name</th>
                                        <th>Phone</th>
                                        <th>Email</th>
                                        {/* <th>Quantity</th> */}
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                    <tr>
                                        <td><input type="text" placeholder='Search By Name' className='search'
                                            onChange={(e) => handleSearch(e.target.value, "name")} />
                                        </td>

                                        <td><input type="text" placeholder='Search By Name' className='search'
                                            onChange={(e) => handleSearch(e.target.value, "product")} />
                                        </td>

                                        {/* <td><input type="text" placeholder='Search By Name' className='search'
                                    onChange={(e) => handleSearch(e.target.value,"number")}  />
                                </td> */}

                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        filtered.length === 0 ? (
                                            <tr>
                                                <td>No Data Found !!!</td>
                                            </tr>
                                            // <p className='null-data'></p>
                                        ) :
                                            filtered.slice((prevPage * rowsperPage), (currentPage * rowsperPage)).map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.user_name}</td>
                                                    <td>{item.product_name}</td>
                                                    <td>{item.customer_phone}</td>
                                                    <td>{item.customer_email}</td>
                                                    {/* <td>{item.variant_name}</td> */}
                                                    {/* <td>{item.quantity}</td> */}
                                                    <td>
                                                        {item.status === 'Pending' ? (
                                                            <span className="badge text-bg-warning">{item.status}</span>
                                                        ) : item.status === 'Completed' ? (
                                                            <span className="badge text-bg-success">{item.status}</span>
                                                        ) : item.status === 'Cancel' ? (
                                                            <span className="badge text-bg-secondary">{item.status}</span>
                                                        ) : (
                                                            <span className="badge text-bg-light">{item.status}</span>
                                                        )}

                                                        {
                                                            item.status === 'Completed' ? "" :

                                                                <i className="fa-solid fa-pen-to-square"
                                                                    data-bs-toggle="modal" data-bs-target="#staticBackdrops"
                                                                    onClick={() => GetstatusId(item.id)} style={{ marginLeft: '4px' }} ></i>
                                                        }


                                                    </td>
                                                    <td className='details'>
                                                        {
                                                            item.status === "Completed" ? "" :
                                                                <button onClick={() => handleDelete(item.id)}>Delete</button>
                                                        }


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




                        <div className="modal fade" id="staticBackdrops" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ref={bondRef}></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="row">

                                            <div className="mb-4 col-md-6 col-sm-6 ">
                                                <label className="form-label">Status</label>
                                                <select
                                                    className="form-control"
                                                    id="statusSelect"

                                                    onChange={(e) => selectStatus(e.target.value)}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Completed">Completed</option>
                                                    <option value="Cancel">Cancel</option>
                                                </select>
                                            </div>

                                            {
                                                statustype === 'Completed' && (
                                                    <>
                                                        <div className="mb-4 col-md-6 col-sm-6">
                                                            <label className="form-label">Buy Price</label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                id="buyPrice"
                                                                placeholder="Enter buy price"
                                                                name='price_at_request'
                                                                // value={status.buyPrice}
                                                                onChange={updateComplete}

                                                                ref={priceRef}
                                                            />
                                                        </div>
                                                        <div className="mb-4 col-md-6 col-sm-6 ">
                                                            <label className="form-label">Quantity</label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                id="quantity"
                                                                name='quantity'
                                                                placeholder="Enter quantity"
                                                                // value={status.quantity}
                                                                onChange={updateComplete}
                                                                ref={quantityRef}
                                                            />
                                                        </div>
                                                    </>
                                                )
                                            } </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" >Close</button>
                                        <button type="button" className="btn btn-primary" onClick={updateStatus}>Save</button>
                                    </div>
                                </div>
                            </div>
                        </div>






                    </div>
                </div>
            </div>













            {/* <div className="modal fade" id="staticBackdropedit" data-bs-backdrop="static" data-bs-keyboard="false" ="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">


                            {/* <div className="mb-4 ">
                                <label for="FormControlInput1" className="form-label">User</label>
                                <select
                                    id="FormControlSelect1"
                                    className="form-control"
                                   

                                >
                                    <option value="">Select a User</option>
                                    {customers.map((customer) => (
                                        <option key={customer.id} value={customer.id}>{customer.username}</option>
                                    ))}
                                </select>
                            </div> */}


            {/* <div className="mb-4 ">
                                <label  className="form-label">Product Name</label>
                                <select
                                    id="FormControlSelect1"
                                    className="form-control"
                                    value={edit.product}
                                    onChange={(e)=>setEdit({...edit,product:e.target.value})}

                                >
                                    <option value="">Select a Product</option>
                                    {fetchPro.map((item) => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))}
                                </select>
                            </div> */}



            {/* 
                            <div className="mb-4 c ">
                                <label for="FormControlInput1" className="form-label">Phone</label>
                                <input type="number" className="form-control" id="FormControlInput1" placeholder="Phone Number"
                                  value={edit.customer_phone}
                                  onChange={(e)=>setEdit({...edit,customer_phone:e.target.value})}
                                   

                                />

                            </div>



                            <div className="mb-4  ">
                                <label for="FormControlInput1" className="form-label">Email</label>
                                <input type="email" className="form-control" id="FormControlInput1" placeholder="Email"
                                 value={edit.customer_email}
                                 onChange={(e)=>setEdit({...edit,customer_email:e.target.value})}
                                 
                                />
                            </div>









                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" ref={modalRef}>Close</button>
                                <button type="button" className="btn btn-primary"  onClick={updateEnquiry}>Understood</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
        </>
    )
}

export default Enquiry



