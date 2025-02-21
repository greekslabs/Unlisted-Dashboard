import React, { useState,useRef } from 'react'
import './Offer.css'
import Swal from "sweetalert2";


function Offer() {
    const [data, setData] = useState({
        name: "", description: "", image: ""
    })
    const [offer, setOffer] = useState([])
    const [img, setimg] = useState("")

    const [editData, setEditData] = useState({
        name: "", description: "", image: ""

    })

    const buttonRef=useRef(null)



    const handleInputData = (e) => {
        e.preventDefault()
        const { name, description, image } = data
        if (!name || !description || !image) {
            Swal.fire("Enter Valid Inputs")
        }
        else {
            // setOffer(data)
            setOffer([...offer, data])
        }
        setData({ name: "", description: "", image: "" });
        setimg("");
        removeImg()
        console.log(data)
        console.log(offer)
        buttonRef.current.value=''
    }


    const handleImageData = (e) => {
        const file = e.target.files[0];
        console.log(file)
        const cr = URL.createObjectURL(file)
        const img = new Image();
        img.src = cr

        // const cr=URL.createObjectURL(file)
        setimg(cr)
        // setData({ ...data, image: file })
        if (file) {
                const reader = new FileReader();
                reader.readAsDataURL(file); // Convert image to Base64 (binary format)
                reader.onloadend = () => {
                    setData((prevProduct) => ({
                        ...prevProduct,
                        image: reader.result, // Store the binary format
                    }));
                };

                img.onload = () => {
                    if (img.width !== 1300 && img.height !== 1168) {
                        Swal.fire("check your image's size")
                        setimg('')
                        setData({ ...data, image: "" })
                    }
                    else {
                        setimg(cr)
                        setData({ ...data, image: file })
                    }
    
                }
            

            
        }
    }




    const removeImg = () => {
        setimg('')
        buttonRef.current.value=''
       
    }



    const handleDelete = (index) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "deleting right?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
            // }).then((result) => {
            //     if (result.isConfirmed) {
            //         const updatedOffers = offer.filter((_, i) => i !== index);
            //         setOffer(updatedOffers);
            //         Swal.fire('Deleted!', 'success');
            //     }
            //     else {
            //         Swal.fire("Deletion Failed")
            //     }
        });
    };


    const handleEdit = (index) => {
        console.log(editData)

    }

    return (
        <>
            <div className='offer-carousal common'>
                <h2 className='title-common'>Offer Details</h2>

                <div className="input-form">
                    <form>
                        <div className='row'>
                            <div class="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label for="FormControlInput1" class="form-label">Offer Name</label>
                                <input type="text" class="form-control" id="FormControlInput1" placeholder="Name"
                                    value={data.name}
                                    onChange={(e) => setData({ ...data, name: e.target.value })} />
                            </div>
                            <div class="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label for="FormControlTextarea1" class="form-label">Offer Description</label>
                                <textarea class="form-control" id="FormControlTextarea1" rows="1" 
                                    value={data.description}
                                    onChange={(e) => setData({ ...data, description: e.target.value })}></textarea>
                            </div>

                            <div class="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label for="FormControlInput2" class="form-label">Image</label>
                                <input type="file" class="form-control" id="FormControlInput2" placeholder=""
                                    onChange={handleImageData} ref={buttonRef} />
                            </div>
                        </div>
                        {img && (
                            <div className='row'>
                                <div className='col-3'>
                                    <div className='view-img'>
                                        <i class="fa-solid fa-xmark img-close" onClick={removeImg}></i>
                                        <img src={img}  alt=''/>
                                    </div>
                                </div>
                            </div>
                        )}


                        <button className="form-btn" type='submit' onClick={handleInputData}>Submit</button>
                    </form>
                </div>


       
                        <div className="table-main">
                            <table border="1" className='table-responsive table'>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th>Image</th>
                                        <th>Action</th>
                                        <th></th>

                                    </tr>
                                </thead>

                                <tbody>
                                    {offer.map((item, index) =>
                                    (
                                        <tr key={index} >
                                            <td>{item.name}</td>
                                            <td>{item.description}</td>
                                            <td></td>
                                            {/* <td><img src={URL.createObjectURL(item.image)}
                                                style={{ width: '90px', height: "90px" }} /></td> */}

                                            <td className='details'>
                                                <button onClick={() => { handleDelete(index) }}>Delete</button>
                                                <button data-bs-toggle="modal" data-bs-target="#staticBackdrop" >Edit</button>
                                                </td>

                                        </tr>
                                    )
                                    )}

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
                                <label for="FormControlInput1" class="form-label">Offer Name</label>
                                <input type="text" class="form-control" id="FormControlInput1" placeholder="Name"
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                />
                            </div>
                            <div class="mb-4  ">
                                <label for="FormControlTextarea1" class="form-label">Offer Description</label>
                                <textarea class="form-control" id="FormControlTextarea1" rows="3"
                                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                ></textarea>
                            </div>

                            <div class="mb-4  ">
                                <label for="FormControlInput2" class="form-label">Image</label>
                                <input type="file" class="form-control" id="FormControlInput2" placeholder=""
                                    onChange={(e) => setData({ ...editData, image: e.target.files[0] })}
                                />
                            </div>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onClick={handleEdit}>Understood</button>
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}

export default Offer


