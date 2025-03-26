import React, { useState, useEffect, useRef } from 'react'
import Swal from 'sweetalert2'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Auth'

function Bond() {
    const [product, setProduct] = useState({
        name: "",  category: "", price: 1, image: null
    })
    const [categories, setCategories] = useState([])
    const [data, setData] = useState([])
    const [img, setImg] = useState("")
    const [edit, setEdit] = useState({ name: "", quantity: "", category: "", price: "", image: null })
    const buttonRef = useRef(null)
    const modalRef = useRef(null)
    const [editImg, setEditImg] = useState(null)
    const [currentItems, setcurrentItems] = useState([])
    const token= useState(localStorage.getItem('token'))

    // const [token, setToken] = useState(localStorage.getItem('token'))
    const api_path = process.env.REACT_APP_API_URL;



    // const [search, setSearch] = useState({
    //     name: "",
    //     quantity: "",
    //     category: "",
    //     price: "",
    // });


    const [currentPage, setCurrentPage] = useState(1)
    const rowsperPage = 5
    const [prevPage, setprevPage] = useState(0)
    const [totalPages, settotalPages] = useState(0)
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate()




    useEffect(() => {
        const token = localStorage.getItem('token');
        if (isAuthenticated) {
            navigate('/bond')
            fetchCategories(token)
            fetchProducts(token)
        }
        else {
            logout()
            navigate('/')
        }

        // setToken(token)
        // if (token) {
        //     fetchCategories(token);
        //     fetchProducts(token);
        // }
        // else {
        //     window.location.href = '/'
        // }
    }, []);




    const fetchProducts = async (token) => {
        try {
            const res = await axios.get(`${api_path}products/`,
                {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                }
            )
            // console.log("fetch products",res)

            const bond = res.data?.data;
            // setData(bond)
            // const viewData = bond.slice((prevPage*rowsperPage),(currentPage*rowsperPage))
            setcurrentItems(bond)
            // console.log("current items", currentItems)
            const count = bond.filter(item => item.variant_name === "Bond")
            setData(count)
            settotalPages(Math.ceil(count.length / 5))





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


        }
    }







    const fetchCategories = async (token) => {
        try {
            const response = await axios.get(`${api_path}categories-variant?variant_name=Bond`, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });
            // console.log("fetch category", response)

            setCategories(response?.data);




        } catch (error) {
            const er = error?.response
            console.error("Error fetching category:", error?.response);
            Swal.fire(`Failed to fetching category ${er?.data?.errors} `, "", "error");
        }
    };








    const addProduct = async (e) => {
        e.preventDefault();
        // const { name, category,price, image } = product;
        if (!product.name || !product.category || !product.image) {
            Swal.fire({
                title: "Enter All Inputs!!!",
                icon: 'warning',
                timer: 3000
            });
            return;
        }

        const fd = new FormData();
        fd.append('name', product.name);
        // fd.append('quantity', quantity);
        fd.append('category', product.category);
        // fd.append('variant', variant)
        fd.append('price', product.price);
        fd.append('image', product.image)

        try {
            const response = await axios.post(`${api_path}products/`, fd, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });
            // console.log("response message", response)

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
                    position: 'top-end',
                    toast: true,
                    showConfirmButton: false
                });
                setImg('');
                fetchProducts(token)

            } else {
                Swal.fire({
                    title: "Something Went Wrong!",
                    icon: "error",
                    timer: 3000, position:
                        'top-end',
                    toast: true,
                    showConfirmButton: false
                });
            }

        } catch (error) {
            const er = error?.response.data.errors
            console.log("error response", er)
            const pr = er.split(":")
            console.log(pr)
            if (pr[0].trim() === "non_field_errors") {
                Swal.fire({
                    title: "Product Already exists under this Category",
                    icon: "error",
                    timer: 3000
                });
            }
            // console.error("Error adding Bond Product:", error?.response);
            // Swal.fire(`Failed to Add Bond Product${er?.data?.errors} `, "", "error");
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
                    timer: 3000,

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
                    timer: 3000,
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

                    // console.log("delete response", res)


                    if (res.data.message === "Deleted successfully") {
                        Swal.fire({
                            title: "Bond Deleted SuccessFully",
                            icon: "success",
                            timer: 3000,
                            position: 'top-end',
                            toast: true,
                            showConfirmButton: false
                        });
                        fetchProducts(token)

                    }
                    else {
                        Swal.fire({
                            title: "Something went Wrong",
                            icon: 'error',
                            timer: 3000,
                            position: 'top-end',
                            toast: true,
                            showConfirmButton: false
                        });

                    }

                }
                catch (error) {
                    const er = error?.response
                    console.error("Error deleting Product:", error?.response);
                    Swal.fire(`Failed to Deleting Product ${er?.data?.errors} `, "", "error");


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
        if (!edit.name || !edit.category || !edit.image) {
            Swal.fire({
                title: "Enter Valid Inputs",
                icon: "warning",
                timer: 3000
            });
        }
        else {
            const fd = new FormData();
            fd.append("name", edit.name);
            // fd.append("quantity", edit.quantity);
            fd.append("category", edit.category);
            // fd.append("variant", edit.variant)
            // fd.append("price", edit.price)
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
                // console.log("edit response", res)
                if (res.data.message === "Updated selected Product details") {
                    fetchProducts(token)
                    // setData(data.map(item => (item.id === edit.id ? res.data.data : item)))
                    modalRef.current.click();
                    Swal.fire({
                        title: "Bond Edited Successfully",
                        icon: "success",
                        timer: 3000,
                        position: 'top-end',
                        toast: true,
                        showConfirmButton: false
                    })
                }
                else {
                    Swal.fire({
                        title: "Something Went Wrong",
                        icon: "error",
                        timer: 3000,
                        position: 'top-end',
                        toast: true,
                        showConfirmButton: false
                    })
                }
            }
            catch (error) {
                const er = error?.response
                console.error("Error editing Bond Product:", error?.response);
                Swal.fire(`Failed to editing Bond Product${er?.data?.errors} `, "", "error");
            }
        }


    }

    // const handleSearch = () => {

    //     const filteredData = data.filter((item) => {

    //         item.name.toLowerCase().includes(search.name.toLowerCase()) &&
    //             item.quantity.toString().includes(search.quantity) &&
    //             item.category_name.toLowerCase().includes(search.category.toLowerCase()) &&
    //             item.price.toString().includes(search.price)
    //     }
    //     );

    //     setcurrentItems(filteredData);
    // };


    const handleSearch = (e, type) => {

        const value = e.toLowerCase()

        const filteredData = data.filter((item) => {

            if (type === "product") {
                return item.name.toLowerCase().includes(value)
            }
            else if (type === "quantity") {
                return item.quantity.toLowerCase().includes(value)
            }
            else if (type === "category") {
                return item.category_name.toLowerCase().includes(value)
            }
            else if (type === "price") {
                return item.price.toLowerCase().includes(value)
            }
        });

        // console.log('filter item', filteredData)
        setcurrentItems(filteredData);
        setCurrentPage(1);
        setprevPage(0)
    };





    // const totalPages=Math.ceil(filteredData.length/rowsperPage)
    // const indexOfLastItem=currentPage * rowsperPage
    // const indexOfFirstItem=indexOfLastItem-rowsperPage
    // // setcurrentItems(filteredData.slice(indexOfFirstItem,indexOfLastItem))`

    const handleNext = () => {
        // console.log('get data',filteredData)
        if (currentPage < totalPages) {
            // setCurrentPage((prevPage) => prevPage + 1);
            // setcurrentItems(filteredData.slice(indexOfFirstItem,indexOfLastItem))
            // currentItems=filteredData.slice(indexOfFirstItem,indexOfLastItem)
            // filteredData.slice(indexOfFirstItem,indexOfLastItem)
            setCurrentPage(currentPage + 1)
            setprevPage(prevPage + 1)
            console.log('currentpage', currentPage + 1, prevPage + 1)
        }

        // const slice = currentItems.filter(item => item.variant_name === "Bond").slice((prevPage*rowsperPage),(currentPage*rowsperPage))
        //  console.log('new Data',slice)


    }

    const handlePrev = () => {
        // if (currentPage > 1) setCurrentPage((prevPage) => prevPage - 1);
        if (currentPage > 1) {
            setprevPage(prevPage - 1)
            setCurrentPage(currentPage - 1)
            console.log('previous page', prevPage - 1)
        }

    }




    return (
        <>
            <div className="products common">
                <h2 className="title-common">Add Bond</h2>

                <div className="product-inputs">
                    <form>
                        <div className="row">
                            <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label className="m-label">Product Name</label>
                                <input type="text" className="form-control" id="FormControlInput1" placeholder=" Product Name"
                                    value={product.name}
                                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                                />
                            </div>



                            {/* <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label className="form-label">Minimum Quantity</label>
                                <input type="number" className="form-control" id="FormControlInput1" placeholder="Minimum Quantity"
                                    value={product.quantity}
                                    onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
                                />
                            </div> */}



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
                                    className="form-control"
                                    value={product.variant}
                                    onChange={(e) => setProduct({ ...product, variant: e.target.value })}


                                >
                                    <option value=""> Select variant</option>
                                    <option value="bond">Bond</option>
                                    <option value="vittafin">Vittafin</option>

                                </select>
                            </div> */}



                            {/* <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label className="form-label">Price</label>
                                <input type="number" className="form-control" id="FormControlInput1" placeholder="Price"
                                    value={product.price}
                                    onChange={(e) => setProduct({ ...product, price: e.target.value })}
                                />
                            </div> */}

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
                                {/* <th>Minimum Quantity</th> */}
                                <th>Category</th>
                                {/* <th>Variant</th> */}
                                {/* <th>Price</th> */}
                                <th>Image</th>
                                <th>Action</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr>
                                <td>
                                    <input
                                        type="text"
                                        placeholder="Search by name"
                                        className="search"
                                        // value={search.name}
                                        onChange={(e) => handleSearch(e.target.value, "product")}
                                    />
                                </td>
                                {/* <td>
                                    <input
                                        type="text"
                                        placeholder="Search by Quantity"
                                        className="search"
                                        // value={search.quantity}
                                        onChange={(e) => handleSearch(e.target.value,"quantity")}
                                    />
                                </td> */}
                                <td>
                                    <input
                                        type="text"
                                        placeholder="Search by category"
                                        className="search"
                                        // value={search.category}
                                        onChange={(e) => handleSearch(e.target.value, "category")}
                                    />
                                </td>
                                {/* <td>
                                    <input
                                        type="number"
                                        placeholder="Search by Price"
                                        className="search"
                                        // value={search.price}
                                        onChange={(e) => handleSearch(e.target.value, "price")}
                                    />
                                </td> */}
                            </tr>
                            {
                                currentItems.filter(item => item.variant_name === "Bond").slice((prevPage * rowsperPage), (currentPage * rowsperPage)).map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        {/* <td>{item.quantity}</td> */}
                                        <td>
                                            {item.category_name}
                                        </td>
                                        {/* <td>{item.variant}</td> */}
                                        {/* <td>{item.price}</td> */}
                                        <td><img src={item.image} alt='Bond'
                                            style={{ width: '90px', height: '90px' }} /></td>
                                        <td className='details'>

                                            {item.category_name !== 'BASIC' && (
                                                <>
                                                    <button onClick={(e) => handleDelete(item.id)}>Delete</button>
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
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Edit Bond</h1>
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



                            {/* <div className="mb-4  ">
                                <label className="form-label">Minimum Quantity</label>
                                <input type="number" className="form-control" id="FormControlInput1" placeholder="Minimum Quantity"
                                    value={edit.quantity}
                                    onChange={(e) => setEdit({ ...edit, quantity: e.target.value })}

                                />
                            </div> */}





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
                                    className="form-control"
                                    value={edit.variant}
                                    onChange={(e) => setEdit({ ...edit, variant: e.target.value })}


                                >
                                    <option value=""> Select variant</option>
                                    <option value="bond">Bond</option>
                                    <option value="vittafin">Vittafin</option>

                                </select>
                            </div> */}






                            {/* <div className="mb-4 ">
                                <label className="form-label">Price</label>
                                <input type="number" className="form-control" id="FormControlInput1" placeholder="Price"
                                    value={edit.price}
                                    onChange={(e) => setEdit({ ...edit, price: e.target.value })}

                                />
                            </div> */}

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

export default Bond
