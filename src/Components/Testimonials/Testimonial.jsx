import React, { useState, useRef, useEffect } from 'react'
import './Testimonial.css'
import Swal from 'sweetalert2'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth';

function Testimonial() {

    const [test, setTest] = useState({
        name: "", feedback: "", image: ""
    })

    const [data, setData] = useState([])
    const [edit, setEdit] = useState({
        name: "", feedback: "", image: ""
    })
    const [img, setImg] = useState("")
    const [editimg, setEditImg] = useState(null)
    const [search, setSearch] = useState("")


    const buttonRef = useRef(null)
    const modalRef = useRef(null)
    // const token = localStorage.getItem('token')

    const [currentPage, setCurrentPage] = useState(1)
    const rowsperPage = 5
    const [token, setToken] = useState(localStorage.getItem('token'))
    const { isAuthenticated, login, logout } = useAuth();
    const navigate = useNavigate();
    const api_path = process.env.REACT_APP_INDEX;




    useEffect(() => {
        const token = localStorage.getItem('token')
        if (isAuthenticated) {
            navigate('/testimonial')
            FetchTestimonial(token)
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
        //     FetchTestimonial(token)
        // }
    }, [])


    // useEffect(() => {
    //     FetchTestimonial()

    // }, [])


    const FetchTestimonial = async () => {
        try {
            const res = await axios.get(`${api_path}testimonials/`,
                {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                }
            )
            // console.log("fetchtest", res)

            setData(res.data.data)




        }
        catch (error) {
            console.log(error.status)
            if (error.status === 404) {
                navigate('/')
                logout()
                Swal.fire({
                    title: 'Session Expired,Login And Try Again!!'
                })

            }
        }

    }





    const handleInputs = async (e) => {
        e.preventDefault()

        const { name, feedback, image } = test

        console.log(feedback.length)

        // if (feedback.length > 110) {
        //     Swal.fire({
        //         title: "Feedback must be 110 characters or less",
        //         icon: 'warning',
        //         timer: 3000
        //     });
        //     return;
        // }


        if (!name || !feedback || !image) {
            Swal.fire({
                title: "Enter All Inputs!!",
                icon: 'warning',
                timer: 3000
            })
            return
        };



        const fd = new FormData()
        fd.append("name", name)
        fd.append("feedback", feedback)
        fd.append("image", image)

        try {
            const res = await axios.post(`${api_path}testimonials/`, fd,
                {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                }
            )

            // console.log("test add", res)
            if (res.data.message === "Testimonial successfully created") {
                Swal.fire({
                    title: "Testimonial SuccessFully Added", icon: "success", timer: 3000, position: "top-end",
                    showConfirmButton: false, toast: true
                })
            }
            FetchTestimonial()
            setTest({
                name: "", feedback: "", image: ""
            })
            if (buttonRef.current) {
                buttonRef.current.value = ""
            }
            setImg("")

        }
        catch (error) {
            const er = error?.res
            console.error("Error adding Testimonial:", error?.res);
            Swal.fire(`Failed to add Testimonial ${er?.data?.errors} `, "", "error");
        }
    }





    const imageData = (e) => {
        const file = e.target.files[0];
        console.log(file)
        if (!file) return


        const cr = URL.createObjectURL(file)
        setImg(cr)

        const img = new Image()
        img.src = cr


        img.onload = () => {
            if (img.width !== 612 && img.height !== 408) {
                Swal.fire({
                    title: "Please Check your Image size", icon: "warning", timer: 3000
                })
                setTest(prev => ({ ...prev, image: "" }));
                setImg('')
            }
            else {
                setTest(prev => ({ ...prev, image: file }));
            }

        }




    }

    const imageEditData = (e) => {
        const file = e.target.files[0];
        console.log(file)
        if (!file) return


        const cr = URL.createObjectURL(file)
        setImg(cr)

        const img = new Image()
        img.src = cr


        img.onload = () => {
            if (img.width !== 612 && img.height !== 408) {
                Swal.fire({
                    title: "Please Check your Image size", icon: "warning", timer: 3000
                })
                setEditImg(null)
                setImg('')
            }
            else {
                setEditImg(file)
            }

        }




    }



    const removeImage = () => {
        setImg("")
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
                    const res = await axios.delete(`${api_path}testimonials/${id}/`,
                        {
                            headers: {
                                Authorization: `Token ${token}`
                            }
                        }
                    )
                    // console.log("test dlt", res)

                    if (res.data.message === "Deleted successfully") {
                        Swal.fire({
                            title: "Deletion SuccessFull", icon: "success", timer: 3000, position: "top-end",
                            showConfirmButton: false, toast: true
                        })
                        FetchTestimonial()
                    }

                }
                catch (error) {
                    const er = error?.response
                    console.error("Error delete:", error?.response);
                    Swal.fire(`Failed deleting testimonial ${er?.data?.errors} `, "", "error");
                }
            }
        })
    }

    const openModal = (test) => {
        setEdit(test)

    }

    const handleEdit = async (id) => {
        if (!edit.name || !edit.feedback || !edit.image) {
            Swal.fire({ title: "Enter Valid Inputs", icon: 'warning', timer: 3000 })

        }
        else {
            const fd = new FormData()
            fd.append("name", edit.name)
            fd.append("feedback", edit.feedback)

            if (editimg) {
                fd.append("image", editimg)
            }

            try {

                const res = await axios.patch(`${api_path}testimonials/${edit.id}/`, fd,
                    {
                        headers: {
                            Authorization: `Token ${token}`
                        }
                    }
                )
                // console.log("test edit", res)
                if (res.data.message === "Updated selected Testimonial details") {
                    Swal.fire({ title: "Edit SuccessFull", icon: "success", timer: 3000, position: "top-end", showConfirmButton: false, toast: true })
                    FetchTestimonial()
                    // setData(data.map(item => (item.id === edit.id ? res.data.data : item)))
                    modalRef.current.click()


                }
                else {
                    Swal.fire({ title: "Something Went Wrong", icon: "error", timer: 3000, position: "top-end", showConfirmButton: false, toast: true })
                }
            }
            catch (error) {
                const er = error?.response
                console.error("Error edit :", error?.response);
                Swal.fire(`Failed  editing testimonial ${er?.data?.errors} `, "", "error");
            }
        }


    }
    const handleSearch = (updatedSearch) => {
        setSearch(updatedSearch);
        setCurrentPage(1);
    };

    const filteredData = data.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))

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

            <div className="testimonials common">
                <h2 className="title-common">Testimonials</h2>


                <div className="test-inputs">
                    <form>
                        <div className="row">
                            <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label className="form-label">Name</label>
                                <input type="text" className="form-control" id="FormControlInput1" placeholder="Name"
                                    value={test.name}
                                    onChange={(e) => setTest({ ...test, name: e.target.value })}
                                />
                            </div>





                            <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label className="form-label">feedback</label>
                                <textarea className="form-control" id="FormControlTextarea1" rows="1"
                                    placeholder="Feedback"
                                    value={test.feedback}
                                    onChange={(e) => setTest({ ...test, feedback: e.target.value })}
                                ></textarea>
                            </div>


                            <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label className="form-label">Image (612*408)</label>
                                <input type="file" className="form-control" id="FormControlInput1" placeholder="Image"
                                    onChange={imageData} ref={buttonRef}
                                />
                            </div>


                        </div>

                        {img &&
                            (<div className='row'>
                                <div className='col-3'>
                                    <div className='view-img'>
                                        <i className="fa-solid fa-xmark img-close" onClick={removeImage} ></i>
                                        <img src={img} alt='' />
                                    </div>
                                </div>
                            </div>)
                        }


                        <button className="form-btn" type='submit' onClick={handleInputs} >Submit</button>
                    </form>
                </div>



                <div className="table-main table-responsive">
                    <table border="1" className='table'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th> feedback</th>
                                <th>Image</th>
                                <th>Action</th>
                                <th></th>
                            </tr>
                            <tr>
                                <td>
                                    <input type="text " placeholder='Search by name' className='search' value={search}
                                        onChange={(e) => handleSearch(e.target.value)}
                                    />
                                </td>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                currentItems.map((item, id) => (
                                    <tr key={id} >
                                        <td>{item.name}</td>


                                        <td>{item.feedback}</td>
                                        <td>
                                            <img src={item.image}
                                                style={{ width: '90px', height: '90px' }} />                                        </td>
                                        <td className='details'>
                                            <button onClick={() => handleDelete(item.id)} >Delete</button>
                                            <button data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={() => openModal(item)}>Edit</button>
                                        </td>
                                    </tr>))
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
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Edit Testimonials</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ref={modalRef}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-4  ">
                                <label className="form-label">Name</label>
                                <input type="text" className="form-control" id="FormControlInput1" placeholder="Name"
                                    value={edit.name}
                                    onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                                />
                            </div>


                            {/* <div class="mb-4 ">
                                <label for="FormControlInput1" class="form-label">Type</label>
                                <input type="text" class="form-control" id="FormControlInput1" placeholder="Type"
                             />
                            </div> */}


                            <div className="mb-4  ">
                                <label className="form-label">feedback</label>
                                <textarea className="form-control" id="FormControlTextarea1" rows="1"
                                    placeholder="Feedback"
                                    value={edit.feedback}
                                    onChange={(e) => setEdit({ ...edit, feedback: e.target.value })}



                                ></textarea>
                            </div>


                            <div className="mb-4  ">
                                <label className="form-label">Image</label>
                                <input type="file" className="form-control" id="FormControlInput1" placeholder="Image"
                                    onChange={imageEditData}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" >Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleEdit}>Save</button>
                        </div>
                    </div>
                </div>
            </div>



        </>
    )
}

export default Testimonial
