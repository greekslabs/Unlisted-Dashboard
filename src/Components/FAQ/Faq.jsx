import React, { useEffect, useState, useRef } from 'react'
import './Faq.css'
import Swal from 'sweetalert2'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Auth'

function Faq() {
    const [faq, setfaq] = useState([{
        id: '1', question: "", answer: ""
    }])

    const [data, setData] = useState([])
    const [edit, setEdit] = useState({
        id: '1', question: "", answer: ""
    })
    // const token = localStorage.getItem('token')
    const modalRef = useRef(null)

    const [currentPage, setCurrentPage] = useState(1)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const { isAuthenticated, login, logout } = useAuth();
    const navigate = useNavigate()

    const rowsperPage = 5

    const api_path = process.env.REACT_APP_INDEX;




    // useEffect(()=>{
    //     fetchfaq()


    // },[])

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (isAuthenticated) {
            navigate('/faq')
            fetchfaq(token)
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
        //    fetchfaq(token)
        // }
    }, [])


    const handleInputs = (index, field, value) => {
        const newfaq = [...faq]
        newfaq[index][field] = value;
        setfaq(newfaq)
        console.log(faq)
    }



    const handleAdd = (e) => {
        e.preventDefault()
        const newfaq = { id: (faq.length + 1).toString(), question: "", answer: "" };

        // const newfaq={id:faq.length+1,name:"",description:""}
        setfaq([...faq, newfaq])
    }


    const handleRemove = (id, e) => {
        e.preventDefault();
        const newfaq = faq.filter((item) => item.id !== id);
        setfaq(newfaq)

    }

    const fetchfaq = async () => {
        try {
            const res = await axios.get(`${api_path}faqs/`, {
                headers: {
                    Authorization: `Token ${token}`
                }
            })
            // console.log(res)
            setData(res.data?.data)




        }
        catch (error) {
            // const er = error?.response
            // console.error("Error fetching faq:", error?.response);
            // Swal.fire(`Failed to fetching faq ${er?.data?.errors} `, "", "error");
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


        }
    }



    const handleSubmit = async (e) => {
        e.preventDefault()
        const valid = faq.filter((item) => item.question.trim() !== "" && item.answer.trim() !== "");


        if (valid.length === 0) {
            Swal.fire({ title: "Fill in all Fields", icon: "warning", timer: 3000 })
            return
        }
        try {
            const res = await axios.post(`${api_path}faqs/`, valid,
                {
                    headers: {
                        Authorization: `Token  ${token}`
                    }
                }
            )
            // console.log("faq response", faq)
            if (res.status === 200) {
                Swal.fire({
                    title: "Faq Added Successfully",
                    icon: "success",
                    timer: 3000,
                    showConfirmButton: false,
                    toast: true,
                    position: 'top-end'
                })
                setfaq([{ id: "1", question: "", answer: "" }])
                fetchfaq()



            }
            else {
                Swal.fire({
                    title: "Something Went Wrong",
                    icon: "error", timer: 3000,
                    showConfirmButton: false,
                    toast: true, position: 'top-end'
                })
            }


        }
        catch (error) {
            const er = error?.response
            console.error("Error adding faq:", error?.response);
            Swal.fire(`Failed to adding faq ${er?.data?.errors} `, "", "error");
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
                    const res = await axios.delete(`${api_path}faqs/${id}/`,
                        {
                            headers: {
                                Authorization: `Token ${token}`
                            }
                        }
                    )
                    // console.log("faq Deleted ", res)
                    if (res.data.message === "Deleted successfully") {
                        Swal.fire({
                            title: "Deletion SuccessFull",
                            icon: "success", timer: 3000,
                            showConfirmButton: false,
                            toast: true, position: 'top-end'
                        })
                        fetchfaq()
                    }
                    else {
                        Swal.fire({
                            title: "Something Went Wrong",
                            icon: "error", timer: 3000,
                            showConfirmButton: false, toast: true,
                            position: 'top-end'
                        })
                    }

                }
                catch (error) {
                    const er = error?.response
                    console.error("Error deleting  faq:", error?.response);
                    Swal.fire(`Failed to deleting faq ${er?.data?.errors} `, "", "error");
                }
            }
        })
    }

    const openModal = (faq) => {
        setEdit(faq)

    }

    const handleEdit = async () => {
        if (!edit.question || !edit.answer) {
            Swal.fire({ title: "Enter All Inputs", icon: 'warning', timer: 3000 })

        }
        else {
            try {
                const res = await axios.patch(`${api_path}faqs/${edit.id}/`, edit,
                    {
                        headers: {
                            Authorization: `Token ${token}`
                        }
                    }
                )
                // console.log("edit Response", res)
                if (res.data.message === "Updated selected FAQ details") {
                    // setData(data.map(item => (item.id === edit.id ? res.data.data : item)))
                    fetchfaq()
                    Swal.fire({
                        title: "Edit SuccessFull",
                        icon: "success", timer: 3000,
                        showConfirmButton: false, toast: true,
                        position: 'top-end'
                    })
                    modalRef.current.click()

                }
                else {
                    Swal.fire({
                        title: "Something Went Wrong",
                        icon: "error", timer: 3000,
                        showConfirmButton: false, toast: true,
                        position: 'top-end'
                    })

                }


            }
            catch (error) {
                const er = error?.response
                console.error("Error edit Faq:", error?.response);
                Swal.fire(`Failed to edit Faq ${er?.data?.errors} `, "", "error");
            }
        }


    }

    const totalPages = Math.ceil(data.length / rowsperPage)
    const indexOfLastItem = currentPage * rowsperPage
    const indexOfFirstItem = indexOfLastItem - rowsperPage
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem)

    const handleNext = () => {
        if (currentPage < totalPages)
            setCurrentPage((prevPage) => prevPage + 1);

    }

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage((prevPage) => prevPage - 1);

    }


    return (
        <>
            <div className="faq common">
                <h2 className='title-common'>FAQ</h2>

                <div className="faq-inputs">
                    <form >
                        {
                            faq.map((item, index) => (
                                <div className="row" key={index}>


                                    <div className="mb-4 col-md-4 col-sm-6 col-xs-6 mt-1 ">
                                        {index === 0 && <label className="form-label">Question</label>}

                                        {/* <label for="FormControlInput1" class="form-label">FAQ Name</label> */}
                                        <input type="text" className="form-control" id="FormControlInput1" placeholder="question"
                                            value={item.question}
                                            onChange={(e) => handleInputs(index, 'question', e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-4 col-md-4 col-sm-6 col-xs-6  mt-1 ">
                                        {index === 0 && <label className="form-label">Answer</label>}
                                        {/* <label for="FormControlTextarea1" class="form-label">FAQ Description</label> */}
                                        <textarea className="form-control" id="FormControlTextarea1" rows="1"
                                            placeholder=" Answer"
                                            value={item.answer}
                                            onChange={(e) => handleInputs(index, 'answer', e.target.value)}
                                        ></textarea>

                                    </div>

                                    <div className='bond-buttons'>

                                        <button onClick={handleAdd}>+</button>
                                        {
                                            index > 0 && (
                                                <button onClick={(e) => handleRemove(item.id, e)}>-</button>
                                            )
                                        }
                                    </div>



                                </div>

                            ))
                        }

                        <button type='submit' className='form-btn' onClick={handleSubmit}>Submit</button>
                    </form>
                </div>


                <div className="table-main table-responsive">
                    <table border="1" className='table'>
                        <thead>
                            <tr>
                                <th>question</th>
                                <th>answer</th>
                                <th>Action</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                currentItems.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.question}</td>
                                        <td>{item.answer}</td>
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
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Edit FAQ</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">

                            <div className="mb-4  ">

                                <label className="form-label">Question</label>
                                <input type="text" className="form-control" id="FormControlInput1" placeholder="Name"
                                    value={edit.question}
                                    onChange={(e) => setEdit({ ...edit, question: e.target.value })}

                                />
                            </div>

                            <div className="mb-4 ">
                                <label className="form-label">FAQ Description</label>
                                <textarea className="form-control" id="FormControlTextarea1" rows="1"
                                    placeholder=" Description"
                                    value={edit.answer}
                                    onChange={(e) => setEdit({ ...edit, answer: e.target.value })}
                                ></textarea>

                            </div>


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

export default Faq
