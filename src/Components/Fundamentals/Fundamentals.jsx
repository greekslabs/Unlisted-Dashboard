import React, { useEffect, useState, useRef } from 'react'
import './Fundamentals.css'
import Swal from 'sweetalert2'
import axios from 'axios'
import { useAuth } from '../Auth'
import { useNavigate } from 'react-router-dom'

function Fundamentals() {
    const [fund, setFund] = useState({
        product: "", current_price: "", market_cap: "", isin: "", face_value: "", pe_ratio: "", eps: "", pb_ratio: "", book_value: "", debt_to_equity_ratio: ""
    })

    const [bond, setBond] = useState({
        product: "", minimum_investment: "", ytm: "", coupon: "", maturity: ""
    })

    const [current, setCurrent] = useState("Unlisted")

    // const handleTabChange = (type) => {
    //     setCurrent(type);
    // };


    const [data, setData] = useState([])
    const [fetchpro, setFetchPro] = useState([])
    const [edit, setEdit] = useState({
        product: "", current_price: "", market_cap: "", isin: "", face_value: "", pe_ratio: "", eps: "", pb_ratio: "", book_value: "", debt_to_equity_ratio: ""
    })

    const [bondEdit, setBondEdit] = useState({
        product: "", minimum_investment: "", ytm: "", coupon: "", maturity: ""
    })

    const [search, setSearch] = useState("")

    // const modalRef = useRef(null)
    const productRef=useRef(null)
    const bondRef=useState(null)
    // const token = localStorage.getItem('token');

    const [currentPage, setCurrentPage] = useState(1)
    const rowsperPage = 5
    // const [token, setToken] = useState(localStorage.getItem('token'))
    const { isAuthenticated, login, logout } = useAuth();
    const navigate = useNavigate()
    const api_path = process.env.REACT_APP_API_URL;





    // useEffect(()=>{
    //     fetchProduct()
    //     fetchFundamentals()
    // },[])
    const token = localStorage.getItem('token')
    useEffect(() => {

        if (isAuthenticated) {

            fetchProduct(token)
            fetchFundamentals(token, "Unlisted")
            navigate('/fundamentals')
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
        //     fetchProduct()
        //     fetchFundamentals("Unlisted")
        // }
    }, [])



    const fetchProduct = async () => {
        try {
            const res = await axios.get(`${api_path}products/`,
                {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                }
            );
            // console.log("get Product",res)
            setFetchPro(res.data?.data)
        }
        catch (error) {
            if (error.status === 404) {
                navigate('/')
                logout()

                Swal.fire({
                    title: 'Session Expired,Login And Try Again!!',
                    icon: 'warning',
                    timer: 3000
                })

            }
        }
    }

    const fetchFundamentals = async (token, type) => {
        setCurrent(type);
        // console.log(type)
        if (type === "Unlisted") {
            try {
                const res = await axios.get(`${api_path}product-fundamentals/`,
                    {
                        headers: {
                            Authorization: `Token ${token}`
                        }
                    }
                )
                // console.log(" fetch unlisted ", res)
                setData(res.data?.data)


            }
            catch (error) {
                const er = error?.response
                console.error("Error fetching Unlisted:", error?.response);
                Swal.fire(`Failed to fetching Unlisted ${er?.data?.errors} `, "", "error");

            }

        }
        else if (type === "Bond") {
            try {
                const res = await axios.get(`${api_path}bond-fundamentals/`,
                    {
                        headers: {
                            Authorization: `Token ${token}`
                        }
                    }
                )
                // console.log("fetch Bond", res)
                setData(res.data?.data)



            }
            catch (error) {
                const er = error?.response
                console.error("Error fetching Bond:", error?.response);
                Swal.fire(`Failed to fetching Bond ${er?.data?.errors} `, "", "error");

            }

        }

    }






    const handleInputs = async (e, type) => {
        e.preventDefault()
        // console.log("Current",current)

        if (current === "Unlisted") {

            const { product, current_price, market_cap, isin, face_value, pe_ratio, eps, pb_ratio, book_value, debt_to_equity_ratio } = fund
            if (!product || !current_price || !market_cap || !isin || !face_value || !pe_ratio || !eps || !pb_ratio || !book_value || !debt_to_equity_ratio) {
                Swal.fire({
                    title: "Enter All Inputs!!",
                    icon: 'warning',
                    timer: 3000
                })
                return
            }

            try {
                const res = await axios.post(`${api_path}product-fundamentals/`, fund,
                    {
                        headers: {
                            Authorization: `Token ${token}`
                        }
                    });


                // console.log("fundamentals res", res)


                if (res.data.message === "Product fundamentals successfully created") {
                    Swal.fire({
                        title: "Fundamentals Added",
                        icon: "success", timer: 3000,
                        showConfirmButton: false, toast: true,
                        position: 'top-end'
                    })
                    fetchFundamentals(token, "Unlisted")
                    setFund({
                        product: "", current_price: "", market_cap: "", isin: "", face_value: "", pe_ratio: "", eps: "", pb_ratio: "", book_value: "", debt_to_equity_ratio: ""
                    })
                }
                else {
                    Swal.fire({ title: "Something Went Wrong", icon: "error", timer: 3000, showConfirmButton: false, toast: true, position: 'top-end' })
                }


            }
            catch (error) {
                const er = error?.response
                console.error("Error adding Fundamentals:", error?.response);
                Swal.fire(`Failed to adding Fundamentals ${er?.data?.errors} `, "", "error");
            }

        }
        else if (current === "Bond") {
            const { product, minimum_investment, ytm, coupon, maturity } = bond;

            if (!product || !minimum_investment || !ytm || !coupon || !maturity) {
                Swal.fire({
                    title: "Please fill all fields for Bond product",
                    icon: "warning",
                    timer: 3000
                });
                return;
            }

            try {
                const res = await axios.post(`${api_path}bond-fundamentals/`, bond, {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                });

                console.log('bond post', res)
                if (res.data.message === "Bond fundamentals successfully created") {
                    Swal.fire({
                        title: "Bond Fundamentals Added",
                        icon: "success", timer: 3000, showConfirmButton: false,
                        toast: true, position: 'top-end'
                    });
                    setBond({
                        product: "", minimum_investment: "", ytm: "", coupon: "", maturity: ""
                    });
                    fetchFundamentals(token, "Bond")
                } else {
                    Swal.fire({ title: "Something Went Wrong", icon: "error", timer: 3000, showConfirmButton: false, toast: true, position: 'top-end' });
                }
            } catch (error) {
                const er = error?.response
                console.error("Error adding Bond:", error?.response);
                Swal.fire(`Failed to adding Bond ${er?.data?.errors} `, "", "error");
            }



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

                if (current === "Unlisted") {
                    try {
                        const res = await axios.delete(`${api_path}product-fundamentals/${id}/`,
                            {
                                headers: {
                                    Authorization: `Token ${token}`
                                }
                            });

                        // console.log("fund delete", res)
                        if (res.data.message === "Deleted successfully") {
                            Swal.fire({
                                title: "Deletion SuccessFull",
                                icon: "success", timer: 3000,
                                showConfirmButton: false, toast: true,
                                position: 'top-end'
                            })
                            fetchFundamentals(token, "Unlisted")
                        }
                        else {
                            Swal.fire({ title: "Deletion Failed", icon: "error", timer: 3000, showConfirmButton: false, toast: true, position: 'top-end' })
                        }
                    }
                    catch (error) {
                        const er = error?.response
                        console.error("Error deleting unlisted:", error?.response);
                        Swal.fire(`Failed to deleting unlisted ${er?.data?.errors} `, "", "error");

                    }

                }

                else if (current === "Bond") {
                    try {
                        const res = await axios.delete(`${api_path}bond-fundamentals/${id}/`,
                            {
                                headers: {
                                    Authorization: `Token ${token}`
                                }
                            });

                        // console.log("fund delete", res)
                        if (res.data.message === "Deleted successfully") {
                            Swal.fire({
                                title: "Deletion SuccessFull",
                                icon: "success", timer: 3000, showConfirmButton: false,
                                toast: true, position: 'top-end'
                            })
                            fetchFundamentals(token, "Bond")
                        }

                        else {
                            Swal.fire({
                                title: "Deletion Failed",
                                icon: "error", timer: 3000, showConfirmButton: false,
                                toast: true, position: 'top-end'
                            })
                        }
                    }
                    catch (error) {
                        const er = error?.response
                        console.error("Error deleting bond:", error?.response);
                        Swal.fire(`Failed to deleting bond ${er?.data?.errors} `, "", "error");

                    }
                }
            }

        })
    }

    const openModal = (fund) => {
        setEdit(fund)
    }
    const openModalBond = (bond) => {
        setBondEdit(bond)
    }


    const handleEdit = async (id, type) => {
        if (current === "Unlisted") {
            if (!edit.product || !edit.current_price || !edit.face_value || !edit.pb_ratio || !edit.market_cap || !edit.pe_ratio || !edit.book_value || !edit.isin || !edit.eps || !edit.debt_to_equity_ratio) {
                Swal.fire({ title: "Enter All Inputs!!", icon: "warning", timer: 3000 })
                return
            }
            try {
                const res = await axios.patch(`${api_path}product-fundamentals/${edit.id}/`, edit,
                    {
                        headers: {
                            Authorization: `Token ${token}`
                        }
                    }
                )
                // console.log("fund edit", res)
                if (res.data.message === "Updated selected Product Fundamentals details") {
                    Swal.fire({
                        title: "Edit Successfull",
                        icon: "success", timer: 3000, showConfirmButton: false, toast:
                            true, position: 'top-end'
                    })
                    // modalRef.current.click()
                    productRef.current.click()
                    fetchFundamentals(token, "Unlisted")
                }

                else {
                    Swal.fire({
                        title: "Something Went Wrong",
                        icon: "error", timer: 3000, showConfirmButton: false,
                        toast: true, position: 'top-end'
                    })
                }

            }
            catch (error) {
                const er = error?.response
                console.error("Error edit unlisted:", error?.response);
                Swal.fire(`Failed to edit unlisted ${er?.data?.errors} `, "", "error");
            }

        }
        else if (current === "Bond") {
            if (!bondEdit.product || !bondEdit.minimum_investment || !bondEdit.ytm || !bondEdit.coupon || !bondEdit.maturity) {
                Swal.fire({ title: "Enter All Inputs!!", icon: "warning", timer: 3000 })
                return
            }
            try {
                const res = await axios.patch(`${api_path}bond-fundamentals/${bondEdit.id}/`, bondEdit,
                    {
                        headers: {
                            Authorization: `Token ${token}`
                        }
                    }
                )
                // console.log("fund bond  edit", res)
                if (res.data.message === "Updated selected Bond Fundamentals details") {
                    Swal.fire({ title: "Edit Successfull", icon: "success", timer: 3000, showConfirmButton: false, toast: true, position: 'top-end' })
                    // modalRef.current.click()
                    bondRef.current.click()
                    fetchFundamentals(token, "Bond")
                }

                else {
                    Swal.fire({ title: "Something Went Wrong", icon: "error", timer: 3000, showConfirmButton: false, toast: true, position: 'top-end' })
                }

            }
            catch (error) {
                const er = error?.response
                console.error("Error edit bond:", error?.response);
                Swal.fire(`Failed to edit bond ${er?.data?.errors} `, "", "error");
            }
        }


    }

    const handleSearch = (updatedSearch) => {
        setSearch(updatedSearch);
        setCurrentPage(1);
    };

    const filtered = data.filter((item) => item.product_name.toLowerCase().includes(search.toLowerCase()))


    const totalPages = Math.ceil(filtered.length / rowsperPage)
    const indexOfLastItem = currentPage * rowsperPage
    const indexOfFirstItem = indexOfLastItem - rowsperPage
    const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem)

    const handleNext = () => {
        if (currentPage < totalPages)
            setCurrentPage((prevPage) => prevPage + 1);

    }

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage((prevPage) => prevPage - 1);

    }




    return (
        <>
            <div className="fundamentals common">
                <h1 className='title-common'> Add Fundamentals</h1>

                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" onClick={() => fetchFundamentals(token,"Unlisted")} role="tab" aria-controls="home-tab-pane" aria-selected="true">Unlisted</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" onClick={() => fetchFundamentals(token,"Bond")} role="tab" aria-controls="profile-tab-pane" aria-selected="false">Bond</button>
                    </li>

                </ul>


                <div className="tab-content" id="myTabContent">
                    <div className="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabIndex="0">
                        <div className='fund-unlist'>
                            <h3 className='common-title'>Unlisted Fundamentals</h3>
                            <div className="fundamentals-inputs">
                                <form >
                                    <div className="row">

                                        <div className="mb-4 col-md-4 col-sm-6 col-xs-6">
                                            <label className="form-label">Product Name</label>
                                            <select
                                                id="FormControlSelect1"
                                                className="form-control"
                                                value={fund.product}
                                                onChange={(e) => setFund({ ...fund, product: e.target.value })}

                                            >
                                                <option value="">Select a Product</option>
                                                {/* {fetchPro.map((item) => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        ))} */}
                                                {
                                                    fetchpro.filter((item) => item.variant_name === "Unlisted").map((item) => (
                                                        <option key={item.id} value={item.id}>{item.name}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>



                                        <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                            <label className="form-label">Current Price</label>
                                            <input type="number" className="form-control" id="FormControlInput1" placeholder="Current Price"
                                                value={fund.current_price}
                                                onChange={(e) => setFund({ ...fund, current_price: e.target.value })}
                                            />
                                        </div>

                                        <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                            <label className="form-label">Market Cap</label>
                                            <input type="number" className="form-control" id="FormControlInput1" placeholder="Market Cap"
                                                value={fund.market_cap}
                                                onChange={(e) => setFund({ ...fund, market_cap: e.target.value })}

                                            />
                                        </div>

                                        <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                            <label className="form-label">ISIN</label>
                                            <input type="text" className="form-control" id="FormControlInput1" placeholder="ISIN"
                                                value={fund.isin}
                                                onChange={(e) => setFund({ ...fund, isin: e.target.value })}

                                            />
                                        </div>


                                        <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                            <label className="form-label">Face Value</label>
                                            <input type="number" className="form-control" id="FormControlInput1" placeholder="Face Value"
                                                value={fund.face_value}
                                                onChange={(e) => setFund({ ...fund, face_value: e.target.value })}

                                            />
                                        </div>

                                        <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                            <label className="form-label">P/E Ratio</label>
                                            <input type="number" className="form-control" id="FormControlInput1" placeholder="P/E Ratio"
                                                value={fund.pe_ratio}
                                                onChange={(e) => setFund({ ...fund, pe_ratio: e.target.value })}

                                            />
                                        </div>

                                        <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                            <label className="form-label">EPS</label>
                                            <input type="number" className="form-control" id="FormControlInput1" placeholder="EPS"
                                                value={fund.eps}
                                                onChange={(e) => setFund({ ...fund, eps: e.target.value })}

                                            />
                                        </div>

                                        <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                            <label className="form-label">P/B Ratio</label>
                                            <input type="number" className="form-control" id="FormControlInput1" placeholder="P/B Ratio"
                                                value={fund.pb_ratio}
                                                onChange={(e) => setFund({ ...fund, pb_ratio: e.target.value })}

                                            />
                                        </div>

                                        <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                            <label className="form-label">Book Value</label>
                                            <input type="number" className="form-control" id="FormControlInput1" placeholder="Book Value"
                                                value={fund.book_value}
                                                onChange={(e) => setFund({ ...fund, book_value: e.target.value })}

                                            />
                                        </div>


                                        <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                            <label className="form-label">Debt/Equity Ratio</label>
                                            <input type="number" className="form-control" id="FormControlInput1" placeholder="Debt/Equity Ratio"
                                                value={fund.debt_to_equity_ratio}
                                                onChange={(e) => setFund({ ...fund, debt_to_equity_ratio: e.target.value })}

                                            />
                                        </div>


                                    </div>
                                    <button className='form-btn' onClick={handleInputs}>Submit</button>


                                </form>
                            </div>



                            <div className="table-main table-responsive">
                                <table border="1" className=' table'>
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Current Price</th>
                                            <th>Market Cap</th>
                                            <th> ISIN</th>
                                            <th>Face Value</th>
                                            <th>P/E Ratio</th>
                                            <th>EPS</th>
                                            <th>P/B Ratio</th>
                                            <th>Book Value</th>
                                            <th>Debt/Equity Value</th>
                                            <th>Action</th>
                                            <th></th>
                                        </tr>

                                        <tr>
                                            <td>
                                                <input type="text" placeholder='Search by Product Name' className='search'
                                                    onChange={(e) => handleSearch(e.target.value)} />
                                            </td>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            currentItems.map((item, id) => (
                                                <tr key={id}>
                                                    <td>{item.product_name}</td>
                                                    <td>${item.current_price}</td>
                                                    <td>${item.market_cap}</td>
                                                    <td>{item.isin}</td>
                                                    <td>${item.face_value}</td>
                                                    <td>{item.pe_ratio}</td>
                                                    <td>${item.eps}</td>
                                                    <td>{item.pb_ratio}</td>
                                                    <td>${item.book_value}</td>
                                                    <td>{item.debt_to_equity_ratio}</td>
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
                                        <h1 className="modal-title fs-5" id="staticBackdropLabel">Edit Fundamentals</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal"  aria-label="Close" ref={productRef} ></button>
                                    </div>
                                    <div className="modal-body">

                                        <div className="mb-4 ">
                                            <label className="form-label">Product Name</label>
                                            <select
                                                id="FormControlSelect1"
                                                className="form-control"
                                                value={edit.product}
                                                onChange={(e) => setEdit({ ...edit, product: e.target.value })}


                                            >
                                                <option value="">Select a Product</option>
                                                {fetchpro.filter((item) => item.variant_name === "Unlisted").map((item) => (
                                                    <option key={item.id} value={item.id}>{item.name}</option>
                                                ))}

                                            </select>
                                        </div>


                                        <div className="mb-4 ">
                                            <label className="form-label">Current Price</label>
                                            <input type="number" className="form-control" id="FormControlInput1" placeholder="Current Price"
                                                value={edit.current_price}
                                                onChange={(e) => setEdit({ ...edit, current_price: e.target.value })} />
                                        </div>

                                        <div className="mb-4 ">
                                            <label className="form-label">Market Cap</label>
                                            <input type="number" className="form-control" id="FormControlInput1" placeholder="Market Cap"
                                                value={edit.market_cap}
                                                onChange={(e) => setEdit({ ...edit, market_cap: e.target.value })} />
                                        </div>

                                        <div className="mb-4  ">
                                            <label className="form-label">ISIN</label>
                                            <input type="text" className="form-control" id="FormControlInput1" placeholder="ISIN"
                                                value={edit.isin}
                                                onChange={(e) => setEdit({ ...edit, isin: e.target.value })} />
                                        </div>


                                        <div className="mb-4  ">
                                            <label className="form-label">Face Value</label>
                                            <input type="number" className="form-control" id="FormControlInput1" placeholder="Face Value"
                                                value={edit.face_value}
                                                onChange={(e) => setEdit({ ...edit, face_value: e.target.value })} />
                                        </div>

                                        <div className="mb-4  ">
                                            <label className="form-label">P/E Ratio</label>
                                            <input type="number" className="form-control" id="FormControlInput1" placeholder="P/E Ratio"
                                                value={edit.pe_ratio}
                                                onChange={(e) => setEdit({ ...edit, pe_ratio: e.target.value })} />
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label">EPS</label>
                                            <input type="number" className="form-control" id="FormControlInput1" placeholder="EPS"
                                                value={edit.eps}
                                                onChange={(e) => setEdit({ ...edit, eps: e.target.value })} />
                                        </div>

                                        <div className="mb-4  ">
                                            <label className="form-label">P/B Ratio</label>
                                            <input type="number" className="form-control" id="FormControlInput1" placeholder="P/B Ratio"
                                                value={edit.pb_ratio}
                                                onChange={(e) => setEdit({ ...edit, pb_ratio: e.target.value })} />
                                        </div>

                                        <div className="mb-4 ">
                                            <label className="form-label">Book Value</label>
                                            <input type="number" className="form-control" id="FormControlInput1" placeholder="Book Value"
                                                value={edit.book_value}
                                                onChange={(e) => setEdit({ ...edit, book_value: e.target.value })} />
                                        </div>


                                        <div className="mb-4  ">
                                            <label className="form-label">Debt/Equity Ratio</label>
                                            <input type="number" className="form-control" id="FormControlInput1" placeholder="Debt/Equity Ratio"
                                                value={edit.debt_to_equity_ratio}
                                                onChange={(e) => setEdit({ ...edit, debt_to_equity_ratio: e.target.value })} />
                                        </div>

                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" >Close</button>
                                        <button type="button" className="btn btn-primary" onClick={handleEdit}>Save</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabIndex="0">
                        <div className="fund-bond">
                            <h3 className='common-title'>Bond Fundamentals</h3>
                            <div className='bond-inputs'>

                                <div className='row'>
                                    <div className="mb-4 col-md-4 col-sm-6 col-xs-6">
                                        <label className="form-label">Product Name</label>
                                        <select
                                            id="FormControlSelect1"
                                            className="form-control"
                                            value={bond.product}
                                            onChange={(e) => setBond({ ...bond, product: e.target.value })}

                                        >
                                            <option value="">Select a Product</option>
                                            {/* {fetchPro.map((item) => (
                                                    <option key={item.id} value={item.id}>{item.name}</option>
                                                ))} */}
                                            {
                                                fetchpro.filter((item) => item.variant_name === "Bond").map((item) => (
                                                    <option key={item.id} value={item.id}>{item.name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>

                                    <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                        <label className="form-label">Minimum_investment</label>
                                        <input type="number" className="form-control" id="FormControlInput1" placeholder="Minimum_investment"
                                            value={bond.minimum_investment}
                                            onChange={(e) => setBond({ ...bond, minimum_investment: e.target.value })}

                                        />
                                    </div>


                                    <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                        <label className="form-label">Yield To maturity</label>
                                        <input type="number" className="form-control" id="FormControlInput1" placeholder="Ytm"
                                            value={bond.ytm}
                                            onChange={(e) => setBond({ ...bond, ytm: e.target.value })}

                                        />
                                    </div>


                                    <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                        <label className="form-label">Coupon</label>
                                        <input type="number" className="form-control" id="FormControlInput1" placeholder="Coupon"
                                            value={bond.coupon}
                                            onChange={(e) => setBond({ ...bond, coupon: e.target.value })}

                                        />
                                    </div>


                                    <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                        <label className="form-label">Maturity</label>
                                        <input type="date" className="form-control" id="FormControlInput1" placeholder="Maturity"
                                            value={bond.maturity}
                                            onChange={(e) => setBond({ ...bond, maturity: e.target.value })}

                                        />
                                    </div>
                                </div>
                            </div>

                            <button className='form-btn' onClick={handleInputs}>Submit</button>


                            <div className="table-main table-responsive">
                                <table border="1" className=' table'>
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Minimum_investment</th>
                                            <th>ytm</th>
                                            <th> coupon</th>
                                            <th> Maturity</th>

                                            <th></th>
                                        </tr>

                                    </thead>

                                    <tbody>
                                        {
                                            currentItems.map((item, id) => (
                                                <tr key={id}>
                                                    <td>{item.product_name}</td>
                                                    <td>{item.minimum_investment}</td>
                                                    <td>{item.ytm}</td>
                                                    <td>{item.coupon}</td>
                                                    <td>{item.maturity}</td>
                                                    <td className='details'>
                                                        <button onClick={() => handleDelete(item.id)}>Delete</button>
                                                        <button data-bs-toggle="modal" data-bs-target="#staticBackdrops" onClick={() => openModalBond(item)}>Edit</button>
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
                    </div>

                    {/* modaal-bond */}

                    <div className="modal fade" id="staticBackdrops" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal"   aria-label="Close"  ref={bondRef}></button>
                                </div>
                                <div className="modal-body">

                                    <div className='row'>
                                        <div className="mb-4 ">
                                            <label className="form-label">Product Name</label>
                                            <select
                                                id="FormControlSelect1"
                                                className="form-control"
                                                value={bondEdit.product}
                                                onChange={(e) => setBondEdit({ ...bondEdit, product: e.target.value })}

                                            >
                                                <option value="">Select a Product</option>
                                                {/* {fetchPro.map((item) => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        ))} */}
                                                {
                                                    fetchpro.filter((item) => item.variant_name === "Bond").map((item) => (
                                                        <option key={item.id} value={item.id}>{item.name}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>

                                        <div className="mb-4  ">
                                            <label className="form-label">Minimum_investment</label>
                                            <input type="number" className="form-control" id="FormControlInput1" placeholder="Minimum_investment"
                                                value={bondEdit.minimum_investment}
                                                onChange={(e) => setBondEdit({ ...bondEdit, minimum_investment: e.target.value })}

                                            />
                                        </div>


                                        <div className="mb-4 ">
                                            <label className="form-label">Yield To maturity</label>
                                            <input type="number" className="form-control" id="FormControlInput1" placeholder="Ytm"
                                                value={bondEdit.ytm}
                                                onChange={(e) => setBondEdit({ ...bondEdit, ytm: e.target.value })}

                                            />
                                        </div>


                                        <div className="mb-4 ">
                                            <label className="form-label">Coupon</label>
                                            <input type="number" className="form-control" id="FormControlInput1" placeholder="Coupon"
                                                value={bondEdit.coupon}
                                                onChange={(e) => setBondEdit({ ...bondEdit, coupon: e.target.value })}

                                            />
                                        </div>


                                        <div className="mb-4  ">
                                            <label className="form-label">Maturity</label>
                                            <input type="date" className="form-control" id="FormControlInput1" placeholder="Maturity"
                                                value={bondEdit.maturity}
                                                onChange={(e) => setBondEdit({ ...bondEdit, maturity: e.target.value })}

                                            />
                                        </div>
                                    </div>

                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" >Close</button>
                                    <button type="button" className="btn btn-primary" onClick={handleEdit}>Save </button>
                                </div>
                            </div>
                        </div>
                    </div>










                </div>
            </div>

        </>
    )
}

export default Fundamentals
