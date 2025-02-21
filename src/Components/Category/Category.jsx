import React, { useState } from 'react'
import './Category.css'
import Swal from 'sweetalert2'

function Category() {

    const [category, setCategory] = useState({
        name: "",description:""
    })
    const [data, setData] = useState([])


    const handleInputData = (e) => {
        e.preventDefault()
        const { name ,description} = category
        if (!name || !description) {
            Swal.fire("Enter Valid Inputs")
        }
        else {
            setData([...data, category])
            setCategory({ name: '',description:'' })

        }
        console.log(data)
        console.log(category)
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

    return (
        <>

            <div className="category common">
                <h2 className="title-common">Category</h2>

                <div className="category-inputs">
                    <form >
                        <div className='row'>
                            <div class="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label for="FormControlInput1" class="form-label">Category Name</label>
                                <input type="text" class="form-control" id="FormControlInput1" placeholder="Name"
                                    value={category.name} onChange={(e) => setCategory({ ...category, name: e.target.value })}
                                />
                            </div>


                            
                            <div class="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label for="FormControlTextarea1" class="form-label">Description</label>
                                <textarea class="form-control" id="FormControlTextarea1" rows="1"
                                    placeholder="Product Details"
                                    value={category.description}
                                    onChange={(e)=>setCategory({...category,description:e.target.value})}
                                   ></textarea>
                            </div>

                            <button className="form-btn category-btn" type='submit' onClick={handleInputData} >Submit</button>


                        </div>


                    </form>
                </div>



                <div className="table-main">
                    <table border="1" className='table-responsive table'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Action</th>
                                <th></th>


                            </tr>
                        </thead>
                        {
                            data.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.description}</td>
                                    <td className='details'>
                                        <button onClick={handleDelete}>Delete</button>
                                        <button data-bs-toggle="modal" data-bs-target="#staticBackdrop">Edit</button>
                                    </td>

                                </tr>
                            ))
                        }


                        <tbody>


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
                                <label for="FormControlInput1" class="form-label">Category Name</label>
                                <input type="text" class="form-control" id="FormControlInput1" placeholder="Name"
                                />
                            </div>      </div>
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

export default Category
