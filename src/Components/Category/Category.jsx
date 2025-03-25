import React, { useState, useEffect, useRef } from 'react'
import './Category.css'
import Swal from 'sweetalert2'
import axios from 'axios'
import { useAuth } from '../Auth'
import { Navigate, useNavigate } from 'react-router-dom'
// import { useRef } from 'react'

function Category() {

    const [category, setCategory] = useState({
        name: "",
        //  description: "", 
        image: "",
        short_desc: "", variant: ""
    })

    const [data, setData] = useState([])
    const [edit, setEdit] = useState({
        name: "",
        //  description: "",
        short_desc: "", variant: "", image: ""
    })
    const [varian, setVarian] = useState([])
    const [img, setImg] = useState("")
    const [editimg, setEditImg] = useState(null)


    const [search, setSearch] = useState({
        name: "", variant: ""
    })

    const [currentPage, setCurrentPage] = useState(1)
    const rowsperPage = 5
    const navigate = useNavigate()



    const buttonRef = useRef(null)
    const modalClose = useRef(null)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const { isAuthenticated, login, logout } = useAuth();
    const api_path = process.env.REACT_APP_API_URL;




    useEffect(() => {
        const token = localStorage.getItem('token')
        // console.log("is auth", api_path)

        if (isAuthenticated === true) {
            navigate("/category")
            fetch()
            fetchvariant()
        }
        else {
            logout()
            navigate('/')
        }
        // if (!token) {
        //     window.location.href = '/'
        // }
        // else {
        //     fetch(token)
        //     fetchvariant(token)

        // }
    }, [])




    const fetch = async () => {
        try {
            const response = await axios.get(`${api_path}categories/`,
                {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                },
            )
            // console.log(response)
            // setData(response.data.data)
            // console.log("get categories", response)
            // console.log(response)
            setData(response.data?.data)

        }
        catch (error) {
            console.log(error.status)
            if (error.status === 404) {
                navigate('/')
                logout()

                Swal.fire({
                    title: 'Session Expired,Login And Try Again!!',
                    icon:'warning',
                    timer:3000
                })
            }
            // const er = error?.response
            // console.error("Error fetching category:", error?.response);
            // Swal.fire(`Failed to fetching category ${er?.data?.errors} `, "", "error");
        }
    };



    const fetchvariant = async () => {
        try {
            const res = await axios.get(`${api_path}variant/`,
                {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                }
            )
            // console.log("get variant", res)
            // console.log(res)
            setVarian(res.data?.data)



        }
        catch (error) {
            const er = error?.response
            console.error("Error fetching category:", error?.response);
            Swal.fire(`Failed to fetching category ${er?.data?.errors} `, "", "error");

        }


    }

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const cr = URL.createObjectURL(file);
        setImg(cr);

        const img = new Image();
        img.src = cr;

        img.onload = () => {
            if (img.width !== 612 || img.height !== 408) {
                Swal.fire({
                    title: "Please Check your Image size",
                    icon: "warning",
                    timer: 3000
                });
                setCategory(prev => ({ ...prev, image: "" }));
                setImg("");
            } else {
                setCategory(prev => ({ ...prev, image: file }));
            }
        };
    };





    const handleInputData = async (e) => {
        e.preventDefault();
        const { name, short_desc, variant, image } = category;
        if (!name || !short_desc || !variant || !image) {
            Swal.fire({
                title: "Enter All  Inputs!!!",
                icon: "warning",
                timer: 3000,
                toast: true,
                showConfirmButton: false,
                position: 'top-end'
            });

            return;
        }
        const fd = new FormData()
        fd.append("name", name)
        fd.append("short_desc", short_desc)
        fd.append("variant", variant)
        fd.append("image", image)
        try {
            const response = await axios.post(`${api_path}categories/`, fd,
                {
                    headers: {
                        Authorization: `Token ${token}`
                    },

                }
            );
            if (response.data.message === 'Category successfully created') {
                // console.log("category response:", response)
                setCategory({ name: "", short_desc: "", variant: "", image: "" });
                Swal.fire({
                    title: "Category Added Successfully",
                    icon: "success",
                    toast: true,
                    timer: 2000,
                    position: 'top-end',
                    showConfirmButton: false
                })
                fetch()
                if (buttonRef.current) {
                    buttonRef.current.value = ''
                }
                removeImage({ setImg: "" })
            }
            else {
                Swal.fire({
                    title: "Something Went wrong",
                    icon: "error",
                    timer: 3000,
                    position: 'top-end',
                    showConfirmButton: false,
                    toast: true
                })
            }
            ;
        } catch (error) {
            const er = error?.response
            console.error("Error fetching category:", error?.response);
            Swal.fire(`Failed to fetching category ${er?.data?.errors} `, "", "error");
        }
    };


    const handleDelete = (id) => {
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
                    await axios.delete(`${api_path}categories/${id}/`,
                        {
                            headers: {
                                Authorization: `Token ${token}`
                            }
                        })
                    Swal.fire({
                        title: "Category Deleted SuccessFully",
                        icon: "success",
                        toast: true,
                        timer: 2000,
                        position: 'top-end',
                        showConfirmButton: false
                    });
                    fetch()
                }
                catch (error) {
                    const er = error?.response
                    console.error("Error fetching category:", error?.response);
                    Swal.fire(`Failed to fetching category ${er?.data?.errors} `, "", "error");

                }
            }
        })
    }


    const handleEditImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const cr = URL.createObjectURL(file);
        setImg(cr);

        const img = new Image();
        img.src = cr;

        img.onload = () => {
            if (img.width !== 612 || img.height !== 408) {
                Swal.fire({
                    title: "Please Check your Image size",
                    icon: "warning",
                    timer: 3000
                });
                setEditImg(null)
                setImg('')

            } else {
                setEditImg(file)
            }
        };
    };




    const openEditModal = (category) => {
        setEdit(category);
    };

    const handleEdit = async () => {
        if (!edit.name || !edit.short_desc || !edit.variant || !edit.image) {
            Swal.fire({
                title: "Enter All Inputs !!!",
                icon: 'warining',
                timer: 2000,
                toast: true,
                position: 'top-end'
            })
        }
        else {

            const fd = new FormData()
            fd.append("name", edit.name)
            fd.append("short_desc", edit.short_desc)
            fd.append("variant", edit.variant)

            if (editimg) {
                fd.append("image", editimg)
            }


            try {
                const response = await axios.patch(`${api_path}categories/${edit.id}/`,
                    fd,
                    {
                        headers: {
                            Authorization: `Token ${token}`
                        }
                    }
                );

                // console.log("Edit response", response)
                if (response.data.message === "Updated selected Category details") {
                    fetch()
                    // setData(data.map(item => (item.id === edit.id ? response.data.data : item)))
                    Swal.fire({
                        title: " Category Edited Successfully",
                        icon: "success",
                        toast: true,
                        position: "top-end",
                        timer: 2000,
                        showConfirmButton: false
                    })
                    modalClose.current.click();

                }
                else {
                    Swal.fire({
                        title: "Something Went Wrong",
                        icon: "error",
                        timer: 2000,
                        showConfirmButton: false
                    })
                }

            }
            catch (error) {

                const er = error?.response
                console.error("Error fetching category:", error?.response);
                Swal.fire(`Failed to fetching category ${er?.data?.errors} `, "", "error");


            }
        }

        console.log(edit)
    }

    const handleSearch = (updatedSearch) => {
        setSearch(updatedSearch);
        setCurrentPage(1);
    };


    const filterdData = data.filter((item) => {
        return (
            item.name.toLowerCase().includes(search.name.toLowerCase()) &&
            item.variant_name.toLowerCase().includes(search.variant.toLowerCase())
        )
    })


    const totalPages = Math.ceil(filterdData.length / rowsperPage)
    const indexOfLastItem = currentPage * rowsperPage
    const indexOfFirstItem = indexOfLastItem - rowsperPage
    const currentItems = filterdData.slice(indexOfFirstItem, indexOfLastItem)

    const handleNext = () => {
        if (currentPage < totalPages)
            setCurrentPage((prevPage) => prevPage + 1);

    }

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage((prevPage) => prevPage - 1);

    }

    const removeImage = () => {
        setImg('')
    }



    return (
        <>

            <div className="category common">
                <h2 className="title-common">Category</h2>

                <div className="category-inputs">
                    <form >
                        <div className='row'>
                            <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label className="form-label">Category Name</label>
                                <input type="text" className="form-control" id="FormControlInput1" placeholder="Name"
                                    value={category.name} onChange={(e) => setCategory({ ...category, name: e.target.value })}
                                />
                            </div>


                            {/* <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label className="form-label">Description</label>
                                <textarea className="form-control" id="FormControlTextarea1" rows="1"
                                    placeholder="Description"
                                    value={category.description}
                                    onChange={(e) => setCategory({ ...category, description: e.target.value })}
                                ></textarea>
                            </div> */}



                            <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label className="form-label">Short Description</label>
                                <textarea className="form-control" id="FormControlTextarea1" rows="1"
                                    placeholder="Short Description"
                                    value={category.short_desc}
                                    onChange={(e) => setCategory({ ...category, short_desc: e.target.value })}

                                ></textarea>
                            </div>

                            <div className="mb-4 col-md-4 col-sm-6 col-xs-6">
                                <label className="form-label">Variant</label>
                                <select
                                    id="FormControlSelect1"
                                    className="form-control"
                                    value={category.variant}
                                    onChange={(e) => setCategory({ ...category, variant: e.target.value })}


                                >
                                    <option value=""> Select variant</option>
                                    {
                                        varian?.map((item) => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        ))
                                    }
                                    {/* <option value="bond">Bond</option>
                                    <option value="vittafin">Unlisted</option> */}

                                </select>
                            </div>


                            <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label className="form-label">Image (612*408)</label>
                                <input type="file" className="form-control" id="FormControlInput2" placeholder=""
                                    onChange={handleImage} ref={buttonRef}

                                />
                            </div>





                        </div>

                        {
                            img && (
                                <div className="row">
                                    <div className="col-3">
                                        <div className='view-img'>
                                            <i className="fa-solid fa-xmark img-close" onClick={removeImage} ></i>
                                            <img src={img} alt='' />
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        <button className="form-btn category-btn" type='submit' onClick={handleInputData} >Submit</button>



                    </form>
                </div>



                <div className="table-main table-responsive">
                    <table border="1" className='table'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th> Short Description</th>
                                <th>Variant</th>
                                <th>Action</th>
                                <th></th>
                            </tr>

                            <tr>
                                <td>
                                    <input type=" text" className='search' placeholder='Search By Name'
                                        onChange={(e) => handleSearch({ ...search, name: e.target.value })}
                                    />
                                </td>

                                <td></td>


                                <td>
                                    <input type=" text" className='search' placeholder='Search By Variant Name'
                                        onChange={(e) => handleSearch({ ...search, variant: e.target.value })}
                                    />


                                </td>



                            </tr>
                        </thead>
                        <tbody>
                            {
                                currentItems.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>{item.short_desc}</td>
                                        <td>{item.variant_name}</td>
                                        <td>
                                            <img src={item.image}
                                                style={{ width: '90px', height: '90px' }} />
                                        </td>

                                        <td className='details'>

                                            <button onClick={() => handleDelete(item.id)}>Delete</button>
                                            <button data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={() => openEditModal(item)}>Edit</button>
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
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Edit Category</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-4  ">
                                <label className="form-label">Category Name</label>
                                <input type="text" className="form-control" id="FormControlInput1" placeholder="Name"
                                    value={edit.name}
                                    onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                                />
                            </div>


                            {/* <div className="mb-4  ">
                                <label className="form-label">Description</label>
                                <textarea className="form-control" id="FormControlTextarea1" rows="1"
                                    placeholder="Description"
                                    value={edit.description}
                                    onChange={(e) => setEdit({ ...edit, description: e.target.value })}

                                ></textarea>
                            </div> */}



                            <div className="mb-4  ">
                                <label className="form-label">Short Description</label>
                                <textarea className="form-control" id="FormControlTextarea1" rows="1"
                                    placeholder="Short Description"
                                    value={edit.short_desc}
                                    onChange={(e) => setEdit({ ...edit, short_desc: e.target.value })}


                                ></textarea>

                            </div>

                            <div className="mb-4 6">
                                <label className="form-label">Variant</label>
                                <select
                                    id="FormControlSelect1"
                                    className="form-control"
                                    value={edit.variant}
                                    onChange={(e) => setEdit({ ...edit, variant: e.target.value })}


                                >
                                    <option value=""> Select variant</option>
                                    {
                                        varian?.map((item) => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        ))
                                    }


                                </select>
                            </div>

                            <div className="mb-4 ">
                                <label className="form-label">Image</label>
                                <input type="file" className="form-control" id="FormControlInput2" placeholder=""
                                    onChange={handleEditImage}

                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" ref={modalClose}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleEdit}>Save</button>
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}

export default Category
