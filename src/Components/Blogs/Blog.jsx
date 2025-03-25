import React, { useState, useRef, useEffect } from 'react'
import './Blog.css'
import Swal from 'sweetalert2'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Auth'



function Blog() {
    const [blog, setBlog] = useState({
        title: "", content: "", published: "", image: ""
    })

    const [img, setImg] = useState('')
    const [edit, setEdit] = useState({
        title: "", content: "", published: "", image: ""
    })
    const [editimg, setEditImg] = useState(null)
    const [data, setData] = useState([])

    const [search, setSearch] = useState({
        heading: "", published: ""
    })

    const [currentPage, setCurrentPage] = useState(1)
    const rowsperPage = 5
    const [token, setToken] = useState(localStorage.getItem('token'))
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate()
    const api_path = process.env.REACT_APP_INDEX;




    const buttonRef = useRef(null)
    const modalRef = useRef(null)



    // const token = localStorage.getItem('token')

    // useEffect(() => {
    //     fetchBlog()

    // }, [])

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (isAuthenticated) {
            navigate('/blog')
            fetchBlog(token)
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
        //     fetchBlog()

        // }
    }, [])

    const fetchBlog = async () => {
        try {
            const res = await axios.get(`${api_path}blogs/`, {
                headers: {
                    Authorization: `Token ${token}`
                }
            })
            // console.log("fetchblog", res)
                setData(res.data?.data)

          

        } catch (error) {
              console.log(error.status)
                        if (error.status === 404) {
                            navigate('/')
                            logout()
            
                            Swal.fire({
                                title: 'Session Expired,Login And Try Again!!',
                                icon:'warning'
                            })
                        }
            // const er = error?.response
            // console.error("Error fetching blog:", error?.response);
            // Swal.fire(`Failed to fetching blog ${er?.data?.errors} `, "", "error");
        }
    }




    const handleInput = async (e) => {
        e.preventDefault()

        const { title, content, published, image } = blog

        console.log(content.length)

        // if (content.length > 110) {
        //     Swal.fire({
        //         title: "Content must be 110 characters or less",
        //         icon: 'warning',
        //         timer: 3000
        //     })
        //     return
        // }

        if (!title || !content || !published || !image) {
            Swal.fire({
                title: "Enter All Inputs!!",
                timer: 3000,
                icon: 'warning'
            })
            return
        }

        const fd = new FormData()
        fd.append("title", title);
        fd.append("content", content);
        fd.append("published", published)
        fd.append("image", image)

        try {
            const res = await axios.post(`${api_path}blogs/`, fd,
                {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                }
            );

            // console.log("blog add", res)
            if (res.data.message === "Blog successfully created") {
                Swal.fire({
                    title: "Blog Added SuccessFully",
                    icon: 'success',
                    timer: 3000,
                    toast: true,
                    showConfirmButton: false,
                    position: 'top-end'
                })
                fetchBlog()
                setBlog({
                    title: "", content: "", published: "", image: ""
                })
                if (buttonRef.current) {
                    buttonRef.current.value = ''
                }
                setImg('')
            }
            else {
                Swal.fire({
                    title: "Something Went Wrong",
                    icon: "error",
                    timer: 3000,
                    toast: true,
                    showConfirmButton: false,
                    position: 'top-end'
                })
            }


        }
        catch (error) {
            const er = error?.res
            console.error("Error adding Blog:", error?.res);
            Swal.fire(`Failed to add Blog ${er?.data?.errors} `, "", "error");
        }

    }


    const handleImage = (e) => {
        const file = e.target.files[0]; // Get the selected file
        if (!file) return;

        const cr = URL.createObjectURL(file); // Create a preview URL
        setImg(cr); // Set preview image

        const img = new Image();
        img.src = cr;

        img.onload = () => {
            if (img.width !== 612 || img.height !== 408) {
                Swal.fire({
                    title: "Please Check your Image size",
                    icon: "warning", timer: 3000,
                });
                setBlog(prev => ({ ...prev, image: "" })); // Reset image
                setImg("");
            } else {
                setBlog(prev => ({ ...prev, image: file })); // ✅ Store file object (Binary)
            }
        };
    };


    const handleEditImage = (e) => {
        const file = e.target.files[0]; // Get the selected file
        if (!file) return;

        const cr = URL.createObjectURL(file); // Create a preview URL
        setImg(cr); // Set preview image

        const img = new Image();
        img.src = cr;

        img.onload = () => {
            if (img.width !== 612 || img.height !== 408) {
                Swal.fire({
                    title: "Please Check your Image size",
                    icon: "warning", timer: 3000,
                });
                setEditImg(null)
                setImg('')

            } else {
                setEditImg(file)
            }
        };
    };

    const removeImage = () => {
        setImg('')
    }

    const openModal = (blog) => {
        setEdit(blog)
    }

    const handleEdit = async (id) => {
        if (!edit.title || !edit.content || !edit.published || !edit.image) {
            Swal.fire({
                title: "Enter Valid Inputs",
                icon: 'warning',
                timer: 3000
            })

        }
        else {
            const fd = new FormData()
            fd.append("title", edit.title);
            fd.append("content", edit.content)
            fd.append("published", edit.published)

            if (editimg) {
                fd.append("image", editimg)
            }
            try {
                const res = await axios.patch(`${api_path}blogs/${edit.id}/`, fd, {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                })

                // console.log("edit blog", res)
                if (res.data.message === "Updated selected Blog details") {
                    fetchBlog()
                    // setData(data.map(item => (item.id === edit.id ? res.data.data : item)))
                    modalRef.current.click()
                    Swal.fire({
                        title: " Blog Edited Successfully",
                        icon: "success",
                        timer: 3000,
                        toast: true,
                        showConfirmButton: false,
                        position: 'top-end'
                    })


                }
                else {
                    Swal.fire({
                        title: "Something Went Wrong",
                        icon: "error",
                        timer: 3000, toast: true,
                        showConfirmButton: false,
                        position: 'top-end'
                    })

                }

            }
            catch (error) {
                const er = error?.response
                console.error("Error Edit Blog:", error?.response);
                Swal.fire(`Failed to Edit Blog ${er?.data?.errors} `, "", "error");

            }

        }

    }



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
                    const res = await axios.delete(`${api_path}blogs/${id}/`,
                        {
                            headers: {
                                Authorization: `Token ${token}`
                            }
                        })

                    // console.log("blog dlt", res)
                    if (res.data.message === "Deleted successfully") {
                        Swal.fire({
                            title: " Blog Deleted SuccessFully",
                            icon: "success",
                            timer: 3000,
                            toast: true,
                            showConfirmButton: false,
                            position: 'top-end'
                        })
                        fetchBlog()
                    }
                    else {
                        Swal.fire({
                            title: "Something Went Wrong",
                            icon: "error",
                            timer: 3000, toast: true,
                            showConfirmButton: false,
                            position: 'top-end'
                        })
                    }
                }
                catch (error) {
                    const er = error?.response
                    console.error("Error Deleting Blog:", error?.response);
                    Swal.fire(`Failed to Deleting Blog ${er?.data?.errors} `, "", "error");
                }
            }
        })
    }

    const handleSearch = (updatedSearch) => {
        setSearch(updatedSearch);
        setCurrentPage(1);
    };




    const filteredData = data.filter((item) => {
        return (
            item.title.toLowerCase().includes(search.heading.toLowerCase()) &&
            item.published.toLowerCase().includes(search.published.toLowerCase())
        )
    })


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
            <div className="blog common">
                <h2 className='title-common'>Blog</h2>
                <div className="blog-input">

                    <div className='row'>
                        <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                            <label className="form-label">Heading</label>
                            <input type="text" className="form-control" id="FormControlInput1" placeholder="Heading"
                                value={blog.title} onChange={(e) => setBlog({ ...blog, title: e.target.value })}
                            />
                        </div>
                        <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                            <label className="form-label">Content</label>
                            <textarea className="form-control" id="FormControlTextarea1" rows="1" placeholder='Content'
                                value={blog.content} onChange={(e) => setBlog({ ...blog, content: e.target.value })}
                            ></textarea>
                        </div>

                        <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                            <label className="form-label">Published By</label>
                            <input type="text" className="form-control" id="FormControlInput1" placeholder="Published"
                                value={blog.published} onChange={(e) => setBlog({ ...blog, published: e.target.value })}
                            />
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
                    <button className="form-btn" type='submit' onClick={handleInput} >Submit</button>
                </div>



                <div className="table-main table-responsive ">
                    <table border="1" className='table'>
                        <thead>
                            <tr>
                                <th>Heading</th>
                                <th>Content</th>
                                <th>Published</th>
                                <th>Image</th>
                                <th>Action</th>
                                <th></th>


                            </tr>

                            <tr>
                                <td>
                                    <input type="text" placeholder='Search by Title' className='search'
                                        onChange={(e) => handleSearch({ ...search, heading: e.target.value })} />
                                </td>
                                <td></td>
                                <td>
                                    <input type="text" placeholder='Search by publishers Name' className='search'
                                        onChange={(e) => handleSearch({ ...search, published: e.target.value })} />
                                </td>
                            </tr>
                        </thead>
                        <tbody>

                            {currentItems.map((item, id) => (

                                <tr key={id}>
                                    <td>{item.title}</td>
                                    <td>{item.content}</td>
                                    <td>{item.published}</td>
                                    <td>
                                        <img src={item.image}
                                            style={{ width: '90px', height: '90px' }} />                            </td>
                                    <td className='details'>
                                        <button onClick={() => handleDelete(item.id)} >Delete</button>
                                        <button data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={() => openModal(item)}>Edit</button>
                                    </td>

                                </tr>

                            ))}






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
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Edit Blog</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-4 ">
                                <label className="form-label">Heading</label>
                                <input type="text" className="form-control" id="FormControlInput1" placeholder="Heading"
                                    value={edit.title}
                                    onChange={(e) => setEdit({ ...edit, title: e.target.value })}
                                />
                            </div>
                            <div className="mb-4  ">
                                <label className="form-label">Content</label>
                                <textarea className="form-control" id="FormControlTextarea1" rows="1" placeholder='Content'
                                    value={edit.content}
                                    onChange={(e) => setEdit({ ...edit, content: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="mb-4  ">
                                <label className="form-label">Published By</label>
                                <input type="text" className="form-control" id="FormControlInput1" placeholder="Heading"
                                    value={edit.published} onChange={(e) => setEdit({ ...edit, published: e.target.value })}
                                />
                            </div>


                            <div className="mb-4 ">
                                <label className="form-label">Image</label>
                                <input type="file" className="form-control" id="FormControlInput2" placeholder=""
                                    onChange={handleEditImage}

                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" ref={modalRef}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleEdit} >Save</button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Blog
