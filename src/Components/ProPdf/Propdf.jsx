import React from 'react'
import './Propdf.css'

function Propdf() {
    return (
        <>

            <div className="pro-pdf common">
                <h2 className="title-common">Product</h2>

                <div className="pdf-inputs">

                    <div className='row'>
                        <div className='col-md-4'>

                            <label for="category" >Products</label>
                            <select id="category" className='form-control' >
                                <option value="" >Select Category</option>
                                <option label='one' value="1">One</option>
                                <option label='two' value="2">Two</option>
                                <option label='three' value="3">Three</option>
                            </select>
                        </div>

                        <button className="pdf-btn mt-4">
                            <i class="fa-solid fa-upload"></i>
                            <span>
                                Upload Excel
                            </span>
                        </button>
                    </div>
                    <div className="form-btn">Submit</div>
                </div>



                <div className="table-main">
                    <table border="1" className='table-responsive table'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Pdf Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td></td>
                                <td></td>
                                <td className='details'>
                                    <button >Delete</button>
                                    <button  data-bs-toggle="modal" data-bs-target="#staticBackdrop">Edit</button>
                                </td>
                            </tr>
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

                            <div className=''>
                                <label for="category" >Products</label>
                                <select id="category" className='form-control' >
                                    <option value="" >Select Category</option>
                                    <option label='one' value="1">One</option>
                                    <option label='two' value="2">Two</option>
                                    <option label='three' value="3">Three</option>
                                </select>
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

export default Propdf



