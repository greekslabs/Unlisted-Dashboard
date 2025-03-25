import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { useEffect, useRef } from 'react'
import axios from 'axios'
import { useAuth } from '../Auth'
import { useNavigate } from 'react-router-dom'

function Unlist() {
    const [product, setProduct] = useState({
        name: "", quantity: "", category: "", price: "", image: null
    })
    const [categories, setCategories] = useState([])
    const [data, setData] = useState([])
    const [img, setImg] = useState("")
    const [edit, setEdit] = useState({ name: "", quantity: "", category: "", price: "", image: null })
    const buttonRef = useRef(null)
    const modalRef = useRef(null)
    const [editImg, setEditImg] = useState(null)


    const [search, setSearch] = useState({
        name: '', quantity: "", category: "", price: ""
    })
    const [token, setToken] = useState(localStorage.getItem('token'))
    const { isAuthenticated, login, logout } = useAuth();
    const navigate = useNavigate()
    const api_path = process.env.REACT_APP_API_URL;



    const [currentPage, setCurrentPage] = useState(1)
    const rowsPerPage = 5

    useEffect(() => {
        const token = localStorage.getItem('token')
        // setToken(token)

        if (isAuthenticated === true) {
            navigate('/unlisted')
            fetchCategories(token)
            fetchProducts(token)

        }
        else {
            logout()
            navigate('/')
        }

        // if (!token) {
        //     window.location.href = '/'
        // }
        // else {
        //    fetchCategories(token)
        //    fetchProducts(token)
        // }
    }, [])


    // useEffect(() => {
    //     fetchCategories();
    //     fetchProducts()
    // }, []);

    // console.log("data",data)


    // const token = localStorage.getItem('token')

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${api_path}categories-variant?variant_name=Unlisted`, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });
            // console.log('cat', response)

            setCategories(response.data);

            // else{

            //         Swal.fire({
            //             title: "Something Went Wrong", 
            //             icon: "error", 
            //             timer: 3000, 
            //             toast: true,
            //             showConfirmButton: false,
            //              position: "top-end"
            //         });

            // }

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
            // console.error("Error fetching category:", error?.response);
            // Swal.fire(`Failed to fetching category ${er?.data?.errors} `, "", "error");
        }
    };


    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${api_path}products/`,
                {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                }
            )
            // console.log("get pro", res)
            setData(res.data?.data)




        }
        catch (error) {
            const er = error?.response
            console.error("Error fetching Product:", error?.response);
            Swal.fire(`Failed to fetching Product ${er?.data?.errors} `, "", "error");

        }
    }





    const addProduct = async (e) => {
        e.preventDefault();
        const { name, quantity, category, price, image } = product;
        if (!name || !quantity || !category || !price || !image) {
            Swal.fire({
                title: "Enter All Inputs!!!",
                icon: "warning",
                timer: 3000,
                showConfirmButton: "Ok"
            });
            return;
        }

        const fd = new FormData();
        fd.append('name', name);
        fd.append('quantity', quantity);
        fd.append('category', category);
        // fd.append('variant', variant)
        fd.append('price', price);
        fd.append('image', product.image)

        try {
            const response = await axios.post(`${api_path}products/`, fd, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });

            if (response.data.message === "Product successfully created") {
                setProduct({
                    name: "", quantity: "", category: "", price: "", image: null
                });
                buttonRef.current.value = '';
                // console.log(product)
                Swal.fire({
                    title: "Product added successfully",
                    icon: "success",
                    timer: 3000,
                    toast: true,
                    showConfirmButton: false,
                    position: "top-end"
                });
                setImg('');
                fetchProducts()

            }
            else {
                Swal.fire({
                    title: "Something Went Wrong",
                    icon: "error",
                    timer: 3000,
                    toast: true,
                    showConfirmButton: false,
                    position: "top-end"
                });
            }

        } catch (error) {
            const er = error?.response.data.errors
            // const pr=error?.response
            // console.log("full data",pr)
            console.log("error response", er)
            const err = er.split(":")
            console.log("error:", err[0])


            if (err[0].trim() === "non_field_errors") {
                Swal.fire({
                    title: "Product Already exists under this Category",
                    icon: "error",
                    timer: 3000

                });
            }
            // else{
            //     console.error("Error adding product:", error?.response);
            // Swal.fire(`Failed to add product ${er?.data?.errors} `, "", "error");

            // }

        }
    };





    const imageData = (e) => {
        const file = e.target.files[0]; // Get selected file

        if (!file) return; // Exit if no file is selected

        const cr = URL.createObjectURL(file); // Create preview URL
        setImg(cr); // Set image preview

        const img = new Image();
        img.src = cr;
        console.log(file)

        img.onload = () => {
            if (img.width !== 336 || img.height !== 336) {
                Swal.fire({
                    title: "Please Check your Image size",
                    icon: "warning",
                    timer: 3000
                });
                setProduct(prev => ({ ...prev, image: "" })); // Reset image
                setImg('');
            } else {
                setProduct(prev => ({ ...prev, image: file })); // ✅ Store file object
            }
        };
    };

    const imageDataEdit = (e) => {
        const file = e.target.files[0]; // Get selected file

        if (!file) return; // Exit if no file is selected

        const cr = URL.createObjectURL(file); // Create preview URL
        setImg(cr); // Set image preview

        const img = new Image();
        img.src = cr;
        console.log(file)

        img.onload = () => {
            if (img.width !== 336 || img.height !== 336) {
                Swal.fire({
                    title: "Please Check your Image size",
                    icon: "warning",
                    timer: 3000
                });
                setEditImg(null);
                // setEditImg(prev => ({ ...prev, image: "" })); // Reset image

                setImg('');
            } else {
                setEditImg(file)
            }
        };
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
                    const res = await axios.delete(`${api_path}products/${id}/`,
                        {
                            headers: {
                                Authorization: `Token ${token}`
                            }
                        })
                    // console.log("dlt unlisted",res)
                    if (res.data.message === "Deleted successfully") {
                        Swal.fire({
                            title: "Product Deleted SuccessFully",
                            icon: "success",
                            timer: 3000,
                            position: "top-end",
                            toast: true,
                            showConfirmButton: false,
                        });
                        fetchProducts()
                    }


                }
                catch (error) {
                    const er = error?.response
                    console.error("Error deleting Product:", error?.response);
                    Swal.fire(`Failed to deleting Product ${er?.data?.errors} `, "", "error");

                }
            }
        })
    }




    const removeImage = () => {
        setImg('')
    }

    const openModal = (product) => {
        setEdit(product)
        console.log(product)

    }

    const handleEdit = async () => {
        console.log(editImg)
        if (!edit.name || !edit.quantity || !edit.category || !edit.price) {
            Swal.fire({
                title: "Enter All Inputs!!!",
                icon: 'warning',
                timer: 3000
            });
        }
        else {
            const fd = new FormData();
            fd.append("name", edit.name);
            fd.append("quantity", edit.quantity);
            fd.append("category", edit.category);
            // fd.append("variant", edit.variant)
            fd.append("price", edit.price)
            // fd.append("image",editImg.image)

            if (editImg) {
                fd.append("image", editImg);
            }


            try {

                const res = await axios.patch(`${api_path}products/${edit.id}/`,
                    fd,
                    {
                        headers: {
                            Authorization: `Token ${token}`
                        }
                    }
                )
                if (res.data.message === "Updated selected Product details") {
                    fetchProducts()
                    // setData(data.map(item => (item.id === edit.id ? res.data.data : item)))
                    modalRef.current.click();
                    Swal.fire({
                        title: "Product Edited Successfully",
                        icon: "success",
                        timer: 3000,
                        position: "top-end",
                        showConfirmButton: false,
                        toast: true

                    })
                }
                else {
                    Swal.fire({
                        title: "Something Went Wrong",
                        icon: "error",
                        timer: 3000,
                        toast: true,
                        showConfirmButton: true,
                        position: "top-end"
                    })
                }
            }
            catch (error) {
                const er = error?.response
                console.error("Error editing Product:", error?.response);
                Swal.fire(`Failed to edit Product ${er?.data?.errors} `, "", "error");
            }
        }
    }

    const handleSearch = (updatedSearch) => {
        setSearch(updatedSearch);
        setCurrentPage(1);
    };



    const filteredData = data.filter((item) => {
        return (
            item.name.toLowerCase().includes(search.name.toLowerCase()) &&
            // item.quantity.toLowerCase().includes(search.quantity.toLowerCase()) &&
            // item.price.toLowerCase().includes(search.price.toLowerCase())  &&
            item.category_name.toLowerCase().includes(search.category.toLowerCase())

        );
    });


    const totalPages = Math.ceil(filteredData.length / rowsPerPage)
    const indexOfLastItem = currentPage * rowsPerPage
    const indexOfFirstItem = indexOfLastItem - rowsPerPage
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


            <div className="products common">
                <h2 className="title-common">Add Unlisted</h2>

                <div className="product-inputs">
                    <form>
                        <div className="row">
                            <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label className="form-label">Product Name</label>
                                <input type="text" className="form-control" id="FormControlInput1" placeholder=" Product Name"
                                    value={product.name}
                                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                                />
                            </div>



                            <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label className="form-label">Minimum Quantity</label>
                                <input type="number" className="form-control" id="FormControlInput1" placeholder="Minimum Quantity"
                                    value={product.quantity}
                                    onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
                                />
                            </div>



                            <div className="mb-4 col-md-4 col-sm-6 col-xs-6">
                                <label className="form-label">Product Category</label>
                                <select
                                    id="FormControlSelect1"
                                    className="form-control"
                                    value={product.category}
                                    onChange={(e) => setProduct({ ...product, category: e.target.value })}
                                >

                                    <option value="">Select a Category</option>
                                    {/* <option value="Basic">Basic</option> */}
                                    {
                                        categories?.map((item) => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        ))
                                    }
                                </select>
                            </div>



                            {/* <div className="mb-4 col-md-4 col-sm-6 col-xs-6">
                                <label for="FormControlSelect1" class="form-label">Variant</label>
                                <select
                                    id="FormControlSelect1"
                                    class="form-control"
                                    value={product.variant}
                                    onChange={(e) => setProduct({ ...product, variant: e.target.value })}


                                >
                                    <option value=""> Select variant</option>
                                    <option value="bond">Bond</option>
                                    <option value="vittafin">Vittafin</option>

                                </select>
                            </div> */}



                            <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label className="form-label">Price</label>
                                <input type="number" className="form-control" id="FormControlInput1" placeholder="Price"
                                    value={product.price}
                                    onChange={(e) => setProduct({ ...product, price: e.target.value })}
                                />
                            </div>

                            <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label className="form-label">Image (336 * 336)</label>
                                <input type="file" className="form-control" id="FormControlInput1" placeholder="Image"
                                    onChange={imageData} ref={buttonRef}
                                />
                            </div>
                        </div>


                        {img && (
                            <div className='row'>
                                <div className='col-3'>
                                    <div className='view-img'>
                                        <i className="fa-solid fa-xmark img-close" onClick={removeImage} ></i>
                                        <img src={img} alt='' />
                                    </div>
                                </div>
                            </div>
                        )}

                        <button className="form-btn" type='submit' onClick={addProduct} >Submit</button>
                    </form>
                </div>
                <div className="table-main table-responsive">
                    <table border="1" className='table'>
                        <thead>
                            <tr>
                                <th>Name </th>
                                <th>Quantity</th>
                                <th>Category</th>
                                <th>Price</th>


                                {/* <th>Variant</th> */}
                                <th>Image</th>
                                <th>Action</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr>
                                <td>
                                    <input type="text" placeholder="Search by name" className='search'
                                        onChange={(e) => handleSearch({ ...search, name: e.target.value })}
                                    />
                                </td>



                                <td>
                                    {/* <input type="text" placeholder="Search by categoty" className='search'
                                        onChange={(e) => handleSearch({ ...search, category: e.target.value })}

                                    /> */}
                                </td>
                                <td>

                                </td>
                                <td>

                                </td>
                                <td>

                                </td>
                                <td>

                                </td>
                                <td>

                                </td>




                            </tr>
                            {
                                currentItems.filter(item => item.variant_name === "Unlisted").map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.category_name}</td>
                                        <td>{item.price}</td>

                                        <td>
                                            <img src={item.image} style={{ width: "90px", height: "90px" }} />
                                        </td>
                                        <td className="details">
                                            {item.category_name !== "BASIC" && (
                                                <>
                                                    <button onClick={() => handleDelete(item.id)}>Delete</button>
                                                    <button data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={() => openModal(item)}>Edit</button>
                                                </>
                                            )}
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
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Edit Unlisted</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-4  ">
                                <label className="form-label">Product Name</label>
                                <input type="text" className="form-control" id="FormControlInput1" placeholder=" Product Name"
                                    value={edit.name}
                                    onChange={(e) => setEdit({ ...edit, name: e.target.value })}

                                />
                            </div>



                            <div className="mb-4  ">
                                <label className="form-label">Minimum Quantity</label>
                                <input type="number" className="form-control" id="FormControlInput1" placeholder="Minimum Quantity"
                                    value={edit.quantity}
                                    onChange={(e) => setEdit({ ...edit, quantity: e.target.value })}

                                />
                            </div>





                            <div className="mb-4 ">
                                <label className="form-label">Product Category</label>
                                <select
                                    id="FormControlSelect2"
                                    className="form-control"
                                    value={edit.category}
                                    onChange={(e) => setEdit({ ...edit, category: e.target.value })}
                                >
                                    <option value="">Select a Category</option>
                                    {categories?.map((item) => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))}
                                </select>
                            </div>
                            

                            {/* <div className="mb-4 ">
                                <label for="FormControlSelect1" class="form-label">Variant</label>
                                <select
                                    id="FormControlSelect1"
                                    class="form-control"
                                    value={edit.variant}
                                    onChange={(e) => setEdit({ ...edit, variant: e.target.value })}


                                >
                                    <option value=""> Select variant</option>
                                    <option value="bond">Bond</option>
                                    <option value="vittafin">Vittafin</option>

                                </select>
                            </div> */}

                            <div className="mb-4 ">
                                <label className="form-label">Price</label>
                                <input type="number" className="form-control" id="FormControlInput1" placeholder="Price"
                                    value={edit.price}
                                    onChange={(e) => setEdit({ ...edit, price: e.target.value })}

                                />
                            </div>

                            <div className="mb-4  ">
                                <label className="form-label">Image</label>
                                <input type="file" className="form-control" id="FormControlInput1" placeholder="Image"
                                    onChange={imageDataEdit}
                                />
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

export default Unlist
