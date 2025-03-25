import React, { useState, useRef, useEffect } from 'react'
import './Spl.css'
import Swal from 'sweetalert2'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth';

function Spl() {
    const [spl, setspl] = useState({
        title: "", description: "", icon: ""
    })
    const [data, setData] = useState([])
    const [img, setImg] = useState("")
    const [edit, setEdit] = useState({
        title: "", description: "", icon: ""
    })

    const [editImg, setEditImg] = useState(null)
    const [search, setSearch] = useState("")


    const buttonRef = useRef(null)
    const modalRef = useRef(null)
    // const token = localStorage.getItem('token')

    const [currentPage, setCurrentPage] = useState(1)
    const rowsperPage = 5
    const [token, setToken] = useState(localStorage.getItem('token'))
    const { isAuthenticated, login, logout } = useAuth();
    const navigate = useNavigate()
    const api_path=process.env.REACT_APP_INDEX;



    // useEffect(() => {
    //     fetchSpl()

    // }, [])

    useEffect(() => {
        const token = localStorage.getItem('token')
        if(isAuthenticated){
            navigate('/specialities')
            fetchSpl(token)
        }
        else{
            logout()
            navigate('/')
        }
        // setToken(token)

        // if (!token) {
        //     window.location.href = '/'
        // }
        // else {
        //     fetchSpl()
        // }
    }, [])


    const fetchSpl = async () => {
        try {
            const res = await axios.get(`${api_path}specialities/`,
                {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                }
            )
            // console.log(res.data)
           
                    setData(res.data?.data)

               
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




    const handleInputData = async (e) => {
        e.preventDefault()
        const { title, description, icon } = spl

        console.log(description.length)


        // if (description.length > 110) {
        //     Swal.fire({title:"Description must be 78 characters or less",icon:'warning',timer:3000});
        //     return;
        // }


        if (!title || !description || !icon) {
            Swal.fire({title:"Enter All Inputs!!",icon:'warning',timer:3000})
        }
        else {
            const fd = new FormData()
            fd.append("title", title)
            fd.append("description", description)
            fd.append("icon", icon)

            try {
                const res = await axios.post(`${api_path}specialities/`, fd,
                    {
                        headers: {
                            Authorization: `Token ${token}`
                        }
                    }

                )
                // console.log("spl add", res)
                if (res.data.message === "Speciality successfully created") {
                    Swal.fire({ title: "Specialities Added SuccessFully", icon: "success", timer: 3000, showConfirmButton: false, toast: true, position: "top-end" })
                    fetchSpl()
                    setspl({
                        title: "", description: "", icon: ""
                    })
                    setImg('')
                    if (buttonRef.current) {
                        buttonRef.current.value = '';

                    }
                }
                else {
                    Swal.fire({ title: "Something Went Wrong", icon: "error", timer: 3000, showConfirmButton: false, toast: true, position: "top-end" })
                }

            }
            catch (error) {
                const er = error?.response
                                            console.error("Error adding :", error?.response);
                                            Swal.fire(`Failed adding specialities ${er?.data?.errors} `, "", "error");
            }
        }
        console.log(spl)
    }

    const handleImage = (e) => {
        const file = e.target.files[0];
        console.log(file)
        const cr = URL.createObjectURL(file)
        const img = new Image()
        img.src = cr

        setImg(cr)

        if (file) {


            img.onload = () => {
                if (img.width !== 600 && img.height !== 400) {
                    Swal.fire({ title: "Please Check your Image size", icon: "warning", timer: 3000 })
                    setspl({ ...spl, icon: '' })
                    setImg('')
                }
                else {
                    setspl({ ...spl, icon: file })
                    setImg(cr)
                }

            }


        }
    };

    const openModal = (spl) => {
        setEdit(spl)
    }


    const handleEditImage = (e) => {
        const file = e.target.files[0];
        console.log(file)
        const cr = URL.createObjectURL(file)
        const img = new Image()
        img.src = cr

        setImg(cr)

        if (file) {


            img.onload = () => {
                if (img.width !== 600 && img.height !== 400) {
                    Swal.fire({ title: "Please Check your Image size", icon: "warning", timer: 3000 })
                    setEditImg(null)
                    setImg('')
                }
                else {
                    setEditImg(file)
                }
            }
        }
    };

    const handleEdit = async (id) => {
        if (!edit.title || !edit.description || !edit.icon) {
            Swal.fire({title:"Enter All Inputs!!",icon:'warning',timer:3000})
        }
        else {
            const fd = new FormData()
            fd.append("title", edit.title)
            fd.append("description", edit.description)
            if (editImg) {
                fd.append("icon", editImg)
            }


            try {
                const res = await axios.patch(`${api_path}specialities/${edit.id}/`, fd,
                    {
                        headers: {
                            Authorization: `Token ${token}`
                        }
                    }
                )

                // console.log("edit spl", res)
                if (res.data.message === "Updated selected Speciality details") {
                    fetchSpl()
                    // setData(data.map(item => item.id == edit.id ? res.data.data : item))
                    Swal.fire({ title: "Edit SuccessFull", icon: "success", position: 'top-end', showConfirmButton: false, toast: true, timer: 3000 })
                    modalRef.current.click()
                    // removeImage('')
                }
                else {
                    Swal.fire({ title: "Something Went Wrong", icon: "error", position: 'top-end', showConfirmButton: false, toast: true, timer: 3000 })
                }

            }
            catch (error) {
                const er = error?.response
                                            console.error("Error edit:", error?.response);
                                            Swal.fire(`Failed  editing specialities ${er?.data?.errors} `, "", "error");
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
                try {
                    const res = await axios.delete(`${api_path}specialities/${id}/`,
                        {
                            headers: {
                                Authorization: `Token ${token}`
                            }
                        }
                    )
                    // console.log("spl dlt", res)
                    if (res.data.message === "Deleted successfully") {
                        Swal.fire({ title: "Deletion SuccessFull", icon: "success", position: 'top-end', showConfirmButton: false, toast: true, timer: 3000 })
                        fetchSpl()
                    }
                    else {
                        Swal.fire({ title: "Something Went Wrong", icon: "error", position: 'top-end', showConfirmButton: false, toast: true, timer: 3000 })
                    }

                }
                catch (error) {
                   const er = error?.response
                                               console.error("Error deleting specialities:", error?.response);
                                               Swal.fire(`Failed to deleting specialities ${er?.data?.errors} `, "", "error");

                }
            }
        })
    }


    const removeImage = () => {
        setImg('')
    }

    const handleSearch = (updatedSearch) => {
        setSearch(updatedSearch);
        setCurrentPage(1);
    };


    const filteredData = data.filter((item) => item.title.toLowerCase().includes(search.toLowerCase()))


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
            <div className="specialities common">
                <h2 className='title-common'>Specialities</h2>

                <div className="spl-inputs">
                    <form >
                        <div className="row">

                            <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label className="form-label">Title</label>
                                <input type="text" className="form-control" id="FormControlInput1" placeholder="Title"
                                    value={spl.title}
                                    onChange={(e) => setspl({ ...spl, title: e.target.value })}
                                />
                            </div>

                            <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label className="form-label">Description</label>
                                <textarea className="form-control" id="FormControlTextarea1" rows="1"
                                    placeholder="Description"
                                    value={spl.description}
                                    onChange={(e) => setspl({ ...spl, description: e.target.value })}

                                ></textarea>
                            </div>

                            <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label className="form-label">Image (600*400)</label>
                                <input type="file" className="form-control" id="FormControlInput1" placeholder="Image"
                                    onChange={handleImage} ref={buttonRef}
                                />
                            </div>


                        </div>

                        {
                            img &&
                            <div className="row">
                                <div className="col-3">
                                    <div className='view-img'>
                                        <i className="fa-solid fa-xmark img-close" onClick={removeImage} ></i>
                                        <img src={img} alt='' />
                                    </div>                            </div>
                            </div>
                        }
                        <button className="form-btn" type='submit' onClick={handleInputData} >Submit</button>
                    </form>
                </div>




                <div className="table-main table-responsive">
                    <table border="1" className=' table'>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Image</th>
                                <th>Action</th>
                                <th></th>
                            </tr>
                            <tr>
                                <td>
                                    <input type="text" placeholder='Search By Title' className='search'
                                        onChange={(e) => handleSearch(e.target.value)} />
                                </td>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                currentItems.map((item, id) => (
                                    <tr key={id}>
                                        <td>{item.title}</td>
                                        <td>{item.description}</td>
                                        <td>

                                            <img src={item.icon}
                                                style={{ width: '90px', height: '90px' }} />
                                        </td>
                                        <td className='details'>
                                            <button onClick={() => handleDelete(item.id)} >Delete</button>
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
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Edit Specialities</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ref={modalRef}></button>
                        </div>
                        <div className="modal-body">

                            <div className="mb-4  ">
                                <label className="form-label">Title</label>
                                <input type="text" className="form-control" id="FormControlInput1" placeholder="Heading"
                                    value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })}
                                />
                            </div>

                            <div className="mb-4  ">
                                <label className="form-label">Description</label>
                                <textarea className="form-control" id="FormControlTextarea1" rows="1"
                                    placeholder="Description"
                                    value={edit.description}
                                    onChange={(e) => setEdit({ ...edit, description: e.target.value })}></textarea>
                            </div>

                            <div className="mb-4 ">
                                <label className="form-label">Image</label>
                                <input type="file" className="form-control" id="FormControlInput1" placeholder="Image"
                                    onChange={handleEditImage}
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

export default Spl
