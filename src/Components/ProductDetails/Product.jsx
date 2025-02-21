import React, { useState, useRef } from 'react'
import './Product.css'
import Swal from 'sweetalert2'

function Product() {
    const [product, setProduct] = useState({
        name: "", details: "", quantity: "", category: "", price: "", image: ""
    })
    const [data, setData] = useState([])

    const [img, setImg] = useState("")

    const buttonRef = useRef(null)




    const addProduct = (e) => {
        e.preventDefault()
        const { name, details, quantity, category, price, image } = product
        if (!name || !details || !quantity || !category || !price || !image) {
            Swal.fire("Enter Valid Inputs")
        }
        else {
            setData([...data, product])
            console.log(data)

        }
        setProduct({
            name: "", details: "", quantity: "", category: "", price: "", image: ""
        })
        buttonRef.current.value = ''
        setImg('')

        console.log(product)
    }







    const imageData = (e) => {
        const file = e.target.files[0];
        console.log(file)
        const cr = URL.createObjectURL(file)
        const img = new Image()
        img.src = cr

        setImg(cr)

        if (file) {

            const reader = new FileReader();
            reader.readAsDataURL(file); // Convert image to Base64 (binary format)
            reader.onloadend = () => {
                setProduct((prevProduct) => ({
                    ...prevProduct,
                    image: reader.result, // Store the binary format
                }));
            };
            img.onload = () => {
                if (img.width !== 1300 && img.height !== 1168) {
                    Swal.fire("Please Check your Image size")
                    setProduct({ ...product, image: '' })
                    setImg('')
                }
                else {
                    setProduct({ ...product, image: file })
                    setImg(cr)
                }

            }


        }
        // setProduct({...product,image:file})
    }


    const handleDelete = () => {
        Swal.fire({
            title: "Are You Sure?",
            text: "Are You sure, deleting it !?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        })
    }

    const removeImage = () => {
        setImg('')
    }

    return (
        <>

            <div className="products common">
                <h2 className="title-common">Product Details</h2>

                <div className="product-inputs">
                    <form>
                        <div className="row">
                            <div class="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label for="FormControlInput1" class="form-label">Product Name</label>
                                <input type="text" class="form-control" id="FormControlInput1" placeholder=" Product Name"
                                    value={product.name}
                                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                                />
                            </div>

                            <div class="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label for="FormControlTextarea1" class="form-label">Product Details</label>
                                <textarea class="form-control" id="FormControlTextarea1" rows="1"
                                    placeholder="Product Details"
                                    value={product.details} onChange={(e) => setProduct({ ...product, details: e.target.value })}></textarea>
                            </div>

                            <div class="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label for="FormControlInput1" class="form-label">Minimum Quantity</label>
                                <input type="number" class="form-control" id="FormControlInput1" placeholder="Minimum Quantity"
                                    value={product.quantity}
                                    onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
                                />
                            </div>

                            {/* 
                            <div class="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label for="FormControlInput1" class="form-label">Product Category</label>
                                <input type="text" class="form-control" id="FormControlInput1" placeholder="Product Category"
                                    value={product.category}
                                    onChange={(e) => setProduct({ ...product, category: e.target.value })} />
                            </div> */}

                            <div class="mb-4 col-md-4 col-sm-6 col-xs-6">
                                <label for="FormControlSelect1" class="form-label">Product Category</label>
                                <select
                                    id="FormControlSelect1"
                                    class="form-control"
                                    value={product.category}
                                    onChange={(e) => setProduct({ ...product, category: e.target.value })}
                                >
                                    <option value="">Select a category</option>
                                    <option value="electronics">Electronics</option>
                                    <option value="fashion">Fashion</option>
                                    <option value="home-appliances">Home Appliances</option>
                                    <option value="books">Books</option>
                                </select>
                            </div>



                            <div class="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label for="FormControlInput1" class="form-label">Price</label>
                                <input type="number" class="form-control" id="FormControlInput1" placeholder="Price"
                                    value={product.price}
                                    onChange={(e) => setProduct({ ...product, price: e.target.value })}
                                />
                            </div>

                            <div class="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label for="FormControlInput1" class="form-label">Image</label>
                                <input type="file" class="form-control" id="FormControlInput1" placeholder="Image"
                                    onChange={imageData} ref={buttonRef}
                                />
                            </div>


                        </div>


                        {img && (
                            <div className='row'>
                                <div className='col-3'>
                                    <div className='view-img'>
                                        <i class="fa-solid fa-xmark img-close" onClick={removeImage} ></i>
                                        <img src={img} alt='' />
                                    </div>
                                </div>
                            </div>
                        )}






                        <button className="form-btn" type='submit' onClick={addProduct} >Submit</button>
                    </form>
                </div>




                <div className="table-main">
                    <table border="1" className='table-responsive table'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Details</th>
                                <th>Minimum Quantity</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Image</th>
                                <th>Action</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                data.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>{item.details}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.category}</td>
                                        <td>{item.price}</td>
                                        {/* <td><img src={URL.createObjectURL(item.image)}
                                                    style={{ width: '90px', height: '90px' }} /></td> */}
                                        <td></td>
                                        <td className='details'>
                                            <button onClick={handleDelete}>Delete</button>
                                            <button data-bs-toggle="modal" data-bs-target="#staticBackdrop">Edit</button>
                                        </td>

                                    </tr>


                                ))
                            }
                        </tbody>
                    </table>
                </div>



            </div>



            <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-4  ">
                                <label for="FormControlInput1" class="form-label">Product Name</label>
                                <input type="text" class="form-control" id="FormControlInput1" placeholder=" Product Name"

                                />
                            </div>

                            <div class="mb-4  ">
                                <label for="FormControlTextarea1" class="form-label">Product Details</label>
                                <textarea class="form-control" id="FormControlTextarea1" rows="3"
                                    placeholder="Product Details" ></textarea>
                            </div>

                            <div class="mb-4  ">
                                <label for="FormControlInput1" class="form-label">Minimum Quantity</label>
                                <input type="number" class="form-control" id="FormControlInput1" placeholder="Minimum Quantity"

                                />
                            </div>


                            <div class="mb-4  ">
                                <label for="FormControlInput1" class="form-label">Product Category</label>
                                <input type="text" class="form-control" id="FormControlInput1" placeholder="Product Category"

                                />
                            </div>


                            <div class="mb-4 ">
                                <label for="FormControlInput1" class="form-label">Price</label>
                                <input type="number" class="form-control" id="FormControlInput1" placeholder="Price"

                                />
                            </div>

                            <div class="mb-4  ">
                                <label for="FormControlInput1" class="form-label">Image</label>
                                <input type="file" class="form-control" id="FormControlInput1" placeholder="Image"
                                />
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Understood</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Product
