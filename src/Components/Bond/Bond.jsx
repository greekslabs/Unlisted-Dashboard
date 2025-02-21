import React, { useState } from 'react'
import './Bond.css'
import Swal from 'sweetalert2'

function Bond() {
    const [bond, setBond] = useState([{
        id: "1", name: ""
    }])

    const [data, setData] = useState([])



    const handleInputs = (index, value) => {
        const newBond = [...bond];
        newBond[index] = value;
        setBond(newBond)
        console.log(bond)

    }


    const handleAdd = () => {
        const newBond = { id: bond.length + 1, name: "" }
        setBond([...bond, newBond]);
        // setBond([...bond,""])
    }

    const handleRemove = (index) => {
        const newBond = bond.filter((_, i) => i !== index)
        setBond(newBond)

    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // setData(bond.filter((bond)=>bond.trim()!==""))
        const valid = bond.filter((bond) => bond.trim() !== "")

        setData([...data, ...valid])
        setBond([{ id: "1", name: "" }])
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
            <div className="bond common">
                <h2 className='title-common'>Bond</h2>

                <div className="bond-inputs">
                    {
                        bond.map((bond, index) => (

                            <div className='mb-4 bond-item col-md-4 ' key={index}>
                                <label for="FormControlInput1" class="form-label">Bond List</label>
                                <input type="text" className="form-control" id="FormControlInput1" placeholder="Name"
                                    value={bond.name}
                                    onChange={(e) => handleInputs(index, e.target.value)}
                                />

                                <div className="bond-buttons ">
                                    <button onClick={handleAdd}>+</button>
                                    {
                                        index > 0 && (
                                            <button onClick={() => handleRemove(index)}>-</button>
                                        )
                                    }
                                </div>
                            </div>
                        ))
                    }
                    <button className="form-btn" type='submit' onClick={handleSubmit}>Submit</button>
                </div>





                <div className="table-main ">
                    <table border="1" className='table-responsive table'>
                        <thead>
                            <tr>
                                <th>Heading</th>
                                <th>Action</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item}</td>
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


                            <div className='mb-4 bond-item  ' >
                                <label for="FormControlInput1" class="form-label">Bond List</label>
                                <input type="text" className="form-control" id="FormControlInput1" placeholder="Name"/>
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

export default Bond
