import React, { useState, useRef, useEffect } from 'react'
import './Product.css'
import Swal from 'sweetalert2'
import axios from 'axios'

function Product() {
    const [product, setProduct] = useState({
        name: "", quantity: "", category: "",   price: "", image: null
    })
    const [categories, setCategories] = useState([])
    const [data, setData] = useState([])
    const [img, setImg] = useState("")
    const [edit, setEdit] = useState({ name: "", quantity: "", category: "",  price: "", image: null })
    const buttonRef = useRef(null)
    const modalRef = useRef(null)
    const [editImg, setEditImg] = useState(null)

    const [search, setSearch] = useState({
        name: "",
        quantity: "",
        category: "",
        price: "",
    });


    

    useEffect(() => {
        fetchCategories();
        fetchProducts()
    }, []);

    const token = localStorage.getItem('token')



   








    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8002/api/v1/unlisted/categories-variant?variant_name=Unlisted", {
                headers: {
                    Authorization: `Token ${token}`
                }
            });
            setCategories(response.data.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };


    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8002/api/v1/unlisted/products/',
                {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                }
            )
            console.log(res)
            setData(res.data.data)
        }
        catch (error) {
            console.log(error)
            Swal.fire("Error", "", "error")

        }
    }


   

    const addProduct = async (e) => {
        e.preventDefault();
        const { name, quantity, category, price, image } = product;
        if (!name || !quantity || !category || !price || !image) {
            Swal.fire("Enter Valid Inputs");
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
            const response = await axios.post('http://127.0.0.1:8002/api/v1/unlisted/products/', fd, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });

            if (response.status === 200) {
                setProduct({
                    name: "", quantity: "", category: "", price: "", image: null
                });
                buttonRef.current.value = '';
                console.log(product)
                Swal.fire("Product added successfully");
                setImg('');

                fetchProducts()

            } else {
                Swal.fire("Failed to add product");
            }

        } catch (error) {
            console.error(error);
            Swal.fire("An error occurred while adding the product");
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
                Swal.fire("Please Check your Image size");
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
                Swal.fire("Please Check your Image size");
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
                    await axios.delete(`http://127.0.0.1:8002/api/v1/unlisted/products/${id}/`,
                        {
                            headers: {
                                Authorization: `Token ${token}`
                            }
                        })

                    Swal.fire("Deleted", "", "success");
                    fetchProducts()
                }
                catch (error) {
                    console.log(error)
                    Swal.fire("Failed", "", "error")

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
        if (!edit.name || !edit.quantity || !edit.category ||  !edit.price) {
            Swal.fire("Enter Valid Inputs");
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

                const res = await axios.patch(`http://127.0.0.1:8002/api/v1/unlisted/products/${edit.id}/`,
                    fd,
                    {
                        headers: {
                            Authorization: `Token ${token}`
                        }
                    }
                )
                if (res.status === 200) {
                    setData(data.map(item => (item.id === edit.id ? res.data.data : item)))
                    modalRef.current.click();
                    Swal.fire("Editing Successfull", "", "success")
                }
                else {
                    Swal.fire("Something Went Wrong", "", "error")
                }
            }
            catch (error) {
                console.log(error)
                Swal.fire("Error Updating Product", "", "error")
            }
        }
    }


    return (
        <>

            <div className="products common">
                <h2 className="title-common">Add Products</h2>

                <div className="product-inputs">
                    <form>
                        <div className="row">
                            <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label  className="form-label">Product Name</label>
                                <input type="text" className="form-control" id="FormControlInput1" placeholder=" Product Name"
                                    value={product.name}
                                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                                />
                            </div>



                            <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label  className="form-label">Minimum Quantity</label>
                                <input type="number" className="form-control" id="FormControlInput1" placeholder="Minimum Quantity"
                                    value={product.quantity}
                                    onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
                                />
                            </div>



                            <div className="mb-4 col-md-4 col-sm-6 col-xs-6">
                                <label  className="form-label">Product Category</label>
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
                                <label  className="form-label">Variant</label>
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
                                <label  className="form-label">Image (336 * 336)</label>
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
                                <th>Minimum Quantity</th>
                                <th>Category</th>
                                {/* <th>Variant</th> */}
                                <th>Price</th>
                                <th>Image</th>
                                <th>Action</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr>
                                <td>
                                    <input type="text" placeholder="Search by name" className='search'  />
                                </td>

                                <td>
                                    <input type="text" placeholder="Search by Quantity" className='search' />
                                </td>

                                <td>
                                    <input type="text" placeholder="Search by categoty" className='search' 
                                    />
                                </td>

                                <td></td>

                                <td>
                                    <input type="text" placeholder="Search by Price" className='search'  />
                                </td>
                            </tr>
                            {
                                data.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>{item.quantity}</td>
                                        <td>
                                            {item.category_name}
                                        </td>
                                        {/* <td>{item.variant}</td> */}
                                        <td>{item.price}</td>
                                        <td><img src={item.image}
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

               
            </div>



            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-4  ">
                                <label  className="form-label">Product Name</label>
                                <input type="text" className="form-control" id="FormControlInput1" placeholder=" Product Name"
                                    value={edit.name}
                                    onChange={(e) => setEdit({ ...edit, name: e.target.value })}

                                />
                            </div>



                            <div className="mb-4  ">
                                <label  className="form-label">Minimum Quantity</label>
                                <input type="number" className="form-control" id="FormControlInput1" placeholder="Minimum Quantity"
                                    value={edit.quantity}
                                    onChange={(e) => setEdit({ ...edit, quantity: e.target.value })}

                                />
                            </div>





                            <div className="mb-4 ">
                                <label  className="form-label">Product Category</label>
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
                                <label  className="form-label">Variant</label>
                                <select
                                    id="FormControlSelect1"
                                    class="form-control"
                                    value={edit.variant}
                                    onChange={(e) => setEdit({ ...edit, variant: e.target.value })}>
                                    <option value=""> Select variant</option>
                                    <option value="bond">Bond</option>
                                    <option value="vittafin">Vittafin</option>

                                </select>
                            </div> */}






                            <div className="mb-4 ">
                                <label  className="form-label">Price</label>
                                <input type="number" className="form-control" id="FormControlInput1" placeholder="Price"
                                    value={edit.price}
                                    onChange={(e) => setEdit({ ...edit, price: e.target.value })}

                                />
                            </div>

                            <div className="mb-4  ">
                                <label  className="form-label">Image</label>
                                <input type="file" className="form-control" id="FormControlInput1" placeholder="Image"
                                    onChange={imageDataEdit}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" ref={modalRef}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleEdit}>Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Product
