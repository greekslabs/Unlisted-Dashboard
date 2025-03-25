import React, { useState, useRef, useEffect } from 'react'
import './Offer.css'
import Swal from "sweetalert2";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth';


function Offer() {
    const [data, setData] = useState({
        name: "", description: "", image: ""
    })
    const [offer, setOffer] = useState([])
    const [img, setimg] = useState("")
    const [editData, setEditData] = useState({
        name: "", description: "", image: ""
    })
    const [editimg, setEditImg] = useState(null)
    const buttonRef = useRef(null)
    const modalRef = useRef(null)
    // const token = localStorage.getItem('token')
    const [token, setToken] = useState(localStorage.getItem('token'))
    const api_path = process.env.REACT_APP_INDEX;
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate()



    useEffect(() => {
        if(isAuthenticated){
            fetchOffer(token)
            navigate('/offer')
        }
        else{
            logout()
            navigate('/')

        }
        // const token = localStorage.getItem('token')
        // setToken(token)

        // if (!token) {
        //     window.location.href = '/'
        // }
        // else {
        //     fetchOffer(token)
        // }
    }, [])

    // useEffect(()=>{
    //     fetchOffer()

    // },[])

    const fetchOffer = async () => {
        try {
            const res = await axios.get(`${api_path}offers/`,
                {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                }
            )
            // console.log("get offer", res)
                // console.log(res)
                setOffer(res.data.data)
           

        }
        catch (error) {
            
            // const er = error?.response
            // if(error)
            console.log(error.status)
            if(error.status===404){
                navigate('/')
                logout()
                Swal.fire({
                    title:'Session Expired,Login And Try Again!!'
                })

            }
            
            // console.error("Error Fetching Offer:", error?.response);
            // Swal.fire(`Failed to Fetch Offer ${er?.data?.errors} `, "", "error");
        }
    }







    const handleInputData = async (e) => {
        e.preventDefault()
        const { name, description, image } = data
        if (!name || !description || !image) {
            Swal.fire({
                title: "Enter All Innputs!!!",
                timer: 3000,
                icon: 'warning',
                showConfirmButton: "OK"

            })
            return
        }
        const fd = new FormData()
        fd.append("name", name)
        fd.append("description", description)
        fd.append("image", image)

        try {
            const res = await axios.post(`${api_path}offers/`, fd,
                {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                }
            )
            // console.log("offre response", res)
            if (res.data.message === "Offer successfully created") {
                Swal.fire({
                    title: "Offer Added Successfully",
                    icon: "success",
                    timer: 3000,
                    toast: true,
                    showConfirmButton: false,
                    position: "top-end"
                })
                fetchOffer()
                setimg('')
                removeImg('')
                setData({ name: "", description: "", image: "" });
                buttonRef.current.value = ''

            }
            else {
                Swal.fire({
                    title:"Something Went Wrong",
                    icon:'error',
                    timer:3000,
                    position:'top-end',
                    showConfirmButton:false,
                    toast:true
                })
            }


        }
        catch (error) {
            const er = error?.response
            console.error("Error adding Offer:", error?.response);
            Swal.fire(`Failed to add Offer ${er?.data?.errors} `, "", "error");
        }

    }


    const handleImageData = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const cr = URL.createObjectURL(file);
        setimg(cr);

        const img = new Image();
        img.src = cr;

        img.onload = () => {
            if (img.width !== 2210 || img.height !== 1260) {
                Swal.fire({
                    title: "Please Check your Image size",
                    timer: 3000,
                    icon: 'warning',
                    showConfirmButton:"OK"

                });
                setData(prev => ({ ...prev, image: "" }));
                setimg("");
            } else {
                setData(prev => ({ ...prev, image: file }));
            }
        };
    };


    const handleEditImage = (e) => {
        const file = e.target.files[0]; // Get the selected file
        if (!file) return;

        const cr = URL.createObjectURL(file); // Create a preview URL
        setimg(cr); // Set preview image

        const img = new Image();
        img.src = cr;

        img.onload = () => {
            if (img.width !== 2210 || img.height !== 1260) {
                Swal.fire({
                    title: "Please Check your Image size",
                    timer: 3000,
                    icon: 'warning',
                    showConfirmButton:"OK"


                }); setEditImg(null)
                setimg('')

            } else {
                setEditImg(file)
            }
        };
    };



    const removeImg = () => {
        setimg('')
        buttonRef.current.value = ''

    }






    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "deleting right?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'

        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.delete(`${api_path}offers/${id}/`,
                        {
                            headers: {
                                Authorization: `Token ${token}`
                            }
                        }
                    );
                    // console.log("dlt offer",res)
                    if (res.data.message === "Deleted successfully") {
                        Swal.fire({
                            title:"Deletion SuccessFull",
                            icon:"success",
                            timer:3000,
                            position:'top-end',
                            showConfirmButton:false,
                            toast:true})
                        fetchOffer()

                    }
                    else {
                        Swal.fire({
                            title:"Something Went Wrong",
                            icon: "error",
                            position:'top-end',
                            timer:3000,
                            showConfirmButton:false,
                            toast:true
                        })
                    }

                }
                catch (error) {
                    const er = error?.response
                    console.error("Error Deleting Offer:", error?.response);
                    Swal.fire(`Failed to Deleting Offer ${er?.data?.errors} `, "", "error");
                }
            }
        })
    };


    const openModal = (data) => {
        setEditData(data)
    }

    const handleEdit = async (id) => {
        if (!editData.name || !editData.description || !editData.image) {
            Swal.fire({
                title:"Enter Valid Inputs",
                icon:'warning',
                timer:3000,
                showConfirmButton:"Ok"
            })

        }
        else {
            const fd = new FormData()
            fd.append("name", editData.name)
            fd.append("description", editData.description)

            if (editimg) {
                fd.append("image", editimg)
            }
            try {
                const res = await axios.patch(`${api_path}offers/${editData.id}/`,
                    fd, {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                }
                )
                // console.log("offer edit", res)

                if (res.data.message === "Updated selected Offer details") {
                    fetchOffer()
                    // setOffer(offer.map(item => (item.id === editData.id ? res.data.data : item)))
                    Swal.fire({title:"Offer Edited SuccessFully",
                        icon:'success',
                        timer:3000,
                        position:"top-end",
                        showConfirmButton:false,
                        toast:true

                        
                    })
                    modalRef.current.click()
                }

            }
            catch (error) {
                const er = error?.response
                console.error("Error Edit Offer:", error?.response);
                Swal.fire(`Failed to Editing Offer ${er?.data?.errors} `, "", "error");
            }
        }


    }


    return (
        <>
            <div className='offer-carousal common'>
                <h2 className='title-common'>Offer Details</h2>

                <div className="input-form">
                    <form>
                        <div className='row'>
                            <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label className="form-label">Offer Name</label>
                                <input type="text" className="form-control" id="FormControlInput1" placeholder="Name"
                                    value={data.name}
                                    onChange={(e) => setData({ ...data, name: e.target.value })} />
                            </div>
                            <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label className="form-label">Offer Redirecting Link</label>
                                <textarea className="form-control" id="FormControlTextarea1" rows="1"
                                    placeholder='Enter the Link'
                                    value={data.description}
                                    onChange={(e) => setData({ ...data, description: e.target.value })}>
                                </textarea>
                            </div>

                            <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label className="form-label">Image (1300*1167)</label>
                                <input type="file" className="form-control" id="FormControlInput2" placeholder=""
                                    onChange={handleImageData} ref={buttonRef} />
                            </div>
                        </div>
                        {img && (
                            <div className='row'>
                                <div className='col-3'>
                                    <div className='view-img'>
                                        <i className="fa-solid fa-xmark img-close" onClick={removeImg}></i>
                                        <img src={img} alt='' />
                                    </div>
                                </div>
                            </div>
                        )}


                        <button className="form-btn" type='submit' onClick={handleInputData}>Submit</button>
                    </form>
                </div>


                <div className="table-main table-responsive">
                    <table border="1" className='table'>
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
                            {offer.map((item, id) =>
                            (
                                <tr key={id} >
                                    <td>{item.name}</td>
                                    <td>{item.description}</td>
                                    <td>
                                        <img src={item.image}
                                            style={{ width: '90px', height: '90px' }} />
                                    </td>
                                    <td className='details'>
                                        <button onClick={() => { handleDelete(item.id) }} >Delete</button>
                                        <button data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={(e) => openModal(item)} >Edit</button>
                                    </td>
                                </tr>
                            )
                            )}

                        </tbody>
                    </table>
                </div>
            </div>







            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Edit Offer</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-4  ">
                                <label className="form-label">Offer Name</label>
                                <input type="text" className="form-control" id="FormControlInput1" placeholder="Name"
                                    value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                />
                            </div>
                            <div className="mb-4  ">
                                <label className="form-label">Offer</label>
                                <textarea className="form-control" id="FormControlTextarea1" rows="3"
                                    value={editData.description}
                                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="mb-4  ">
                                <label className="form-label">Image</label>
                                <input type="file" className="form-control" id="FormControlInput2" placeholder=""
                                    onChange={handleEditImage}

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

export default Offer


