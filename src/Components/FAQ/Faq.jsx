import React, { useState } from 'react'
import './Faq.css'
import Swal from 'sweetalert2'

function Faq() {
    const [faq, setfaq] = useState([{
        id: '1', name: "", description: ""
    }])

    const [data, setData] = useState([])

    const handleInputs = (index, field, value) => {
        const newfaq = [...faq]
        newfaq[index][field] = value;
        setfaq(newfaq)
        console.log(faq)
    }

    const handleAdd = (e) => {
        e.preventDefault()
        const newfaq = { id: (faq.length + 1).toString(), name: "", description: "" };

        // const newfaq={id:faq.length+1,name:"",description:""}
        setfaq([...faq, newfaq])
    }


    const handleRemove = (id, e) => {
        e.preventDefault();
        const newfaq = faq.filter((item) => item.id !== id);
        setfaq(newfaq)

    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const valid = faq.filter((item) => item.name.trim() !== "" && item.description.trim() !== "");
        
        if (faq.some(item => !item.name.trim() || !item.description.trim())) {
            Swal.fire('Error', 'Please fill in all fields before submitting!', 'error');
            return;
        }else{
            setData([...data, ...valid])
            setfaq([{ id: "1", name: "", description: "" }])
        }
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
            <div className="faq common">
                <h2 className='title-common'>FAQ</h2>

                <div className="faq-inputs">
                    <form >
                        {
                            faq.map((item, index) => (
                                <div className="row" key={index}>


                                    <div class="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                        {index === 0 && <label for="FormControlInput1" class="form-label">FAQ Name</label>}

                                        {/* <label for="FormControlInput1" class="form-label">FAQ Name</label> */}
                                        <input type="text" class="form-control" id="FormControlInput1" placeholder="Name"
                                            value={item.name}
                                            onChange={(e) => handleInputs(index, 'name', e.target.value)}
                                        />
                                    </div>

                                    <div class="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                        {index === 0 && <label for="FormControlTextarea1" class="form-label">FAQ Description</label>}
                                        {/* <label for="FormControlTextarea1" class="form-label">FAQ Description</label> */}
                                        <textarea class="form-control" id="FormControlTextarea1" rows="1"
                                            placeholder=" Description"
                                            value={item.description}
                                            onChange={(e) => handleInputs(index, 'description', e.target.value)}
                                        ></textarea>

                                    </div>

                                    <div className='bond-buttons'>

                                        <button onClick={handleAdd}>+</button>
                                        {
                                            index > 0 && (
                                                <button onClick={(e) => handleRemove(item.id, e)}>-</button>
                                            )
                                        }
                                    </div>



                                </div>

                            ))
                        }

                        <button type='submit' className='form-btn' onClick={handleSubmit}>Submit</button>
                    </form>
                </div>


                <div className="table-main ">
                    <table border="1" className='table-responsive table'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Action</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>{item.description}</td>
                                        <td className='details'>
                                            <button onClick={handleDelete}>Delete</button>
                                            <button  data-bs-toggle="modal" data-bs-target="#staticBackdrop" >Edit</button>
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

                                <label for="FormControlInput1" class="form-label">FAQ Name</label>
                                <input type="text" class="form-control" id="FormControlInput1" placeholder="Name"

                                />
                            </div>

                            <div class="mb-4 ">
                                <label for="FormControlTextarea1" class="form-label">FAQ Description</label>
                                <textarea class="form-control" id="FormControlTextarea1" rows="1"
                                    placeholder=" Description"
                                ></textarea>

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

export default Faq
