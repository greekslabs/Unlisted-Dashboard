import React, { useState } from 'react'
import './Enquiry.css'

function Enquiry() {
    const [status, setStatus] = useState('Pending');

    return (
        <>
            <div className="enquiry common">
                <h2 className="title-common">Enquiry</h2>

                <div className="enquiry-inputs">
                    <div className="row">

                        <div class="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                            <label for="FormControlInput1" class="form-label">Name</label>
                            <input type="text" class="form-control" id="FormControlInput1" placeholder="Name"
                            />
                        </div>

                        <div class="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                            <label for="FormControlTextarea1" class="form-label">Description</label>
                            <textarea class="form-control" id="FormControlTextarea1" rows="1" placeholder='Description'
                            ></textarea>
                        </div>

                        <div class="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                            <label for="FormControlInput1" class="form-label">Contact</label>
                            <input type="text" class="form-control" id="FormControlInput1" placeholder="Contact"
                            />
                        </div>

                        <div class="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                            <label for="FormControlInput1" class="form-label">Email</label>
                            <input type="email" class="form-control" id="FormControlInput1" placeholder="Email"
                            />
                        </div>
                    </div>
                    <button className='form-btn' type='submit'>Submit</button>
                </div>


                <div className="filter">
                    <h5>Filter by:</h5>
                    <span class="badge text-bg-warning">Pending</span>
                    <span class="badge text-bg-secondary">Cancel</span>
                    <span class="badge text-bg-success">Completed</span>
                </div>


                <div className="table-main">
                    <table border="1" className='table-responsive table'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Contact</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>name</td>
                                <td>desc</td>
                                <td>contct</td>
                                <td>mail</td>
                                <td>
                                    <span class="badge text-bg-warning">Pending
                                    </span>
                                    <i class="fa-solid fa-pen-to-square" data-bs-toggle="modal" data-bs-target="#staticBackdrop"  style={{marginLeft:'4px'}} ></i>

                                </td>
                                <td className='details'>
                                    <button>Delete</button>
                                    <button data-bs-toggle="modal" data-bs-target="#staticBackdrop">Edit</button>
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
                            <div className="row">

                                <div className="mb-4 col-md-6 col-sm-6 ">
                                    <label htmlFor="statusSelect" className="form-label">Status</label>
                                    <select
                                        className="form-control"
                                        id="statusSelect"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancel">Cancel</option>
                                    </select>
                                </div>

                                {
                                    status === 'Completed' && (
                                        <>
                                            <div className="mb-4 col-md-6 col-sm-6">
                                                <label htmlFor="buyPrice" className="form-label">Buy Price</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id="buyPrice"
                                                    placeholder="Enter buy price"

                                                />
                                            </div>
                                            <div className="mb-4 col-md-6 col-sm-6 ">
                                                <label htmlFor="quantity" className="form-label">Quantity</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id="quantity"
                                                    placeholder="Enter quantity"

                                                />
                                            </div>
                                             </>
                                    )
                                } </div>
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

export default Enquiry
