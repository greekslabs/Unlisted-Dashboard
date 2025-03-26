import React, { useEffect, useState } from 'react'
import './Propdf.css'
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth';

function Propdf() {
    const [file, setFile] = useState(null)

    // const [pro, setPro] = useState()
    // const [fetchpro, setFetchPro] = useState([]);

    const token = localStorage.getItem('token');
    // const [token, setToken] = useState(localStorage.getItem('token'))
    const { isAuthenticated , logout } = useAuth();
      const navigate=useNavigate()
      const api_path=process.env.REACT_APP_API_URL;

    



    // useEffect(() => {
    //     fetchProducts()


    // }, [])

    useEffect(() => {
        // const token = localStorage.getItem('token')
        if(isAuthenticated){
            navigate('/pdf')
            // fetchProducts(token)
        }
        else{
            logout()
            navigate('/')
        }
        // setToken(token)

        // if (!token) {
        //     window.location.href = '/'
        // }
        // else {
        //     fetchProducts()
        // }
    }, [])



    // const fetchProducts = async () => {
    //     try {
    //         const res = await axios.get('http://127.0.0.1:8002/api/v1/unlisted/products/', {
    //             headers: {
    //                 Authorization: `Token ${token}`
    //             }
    //         });
    //         console.log(res.data);
    //         setFetchPro(res.data.data);
    //     } catch (error) {
    //         console.error("Error fetching products:", error);
    //         Swal.fire({ title: "Error fetching products", icon: "error", timer: 3000, showConfirmButton: false, toast: true, position: 'top-end' });
    //     }
    // };



    // const handleProductChange = (e) => {
    //     setPro(e.target.value);
    // };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            const fileType = selectedFile.name.split('.').pop().toLowerCase();
            if (fileType === "csv") {
                setFile(selectedFile);
            } else {
                Swal.fire({ title: "Invalid File ,Only CSV files are allowed!", icon: "error", timer: 3000, showConfirmButton: false, toast: true, position: 'top-end' });
                e.target.value = "";
                setFile(null);
            }
        }
    };


    const handleUpload = async (e) => {
        e.preventDefault();
        // console.log(pro)

        if (!file) {
            Swal.fire({ title: "Missing Fields Please select a product and a CSV file to upload.",
                 icon: "warning", timer: 3000, showConfirmButton: false, toast: true, position: 'top-end' });
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        // formData.append("product", pro);

        try {
            const response = await axios.post(
                `${api_path}graph-upload/`,
                formData,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            // console.log("Csv response", response)

            if (response.data.message==="Successfully submitted") {
                Swal.fire({ title: "Success CSV file uploaded successfully!", icon: "success", timer: 3000, showConfirmButton: false, toast: true, position: 'top-end' });
                setFile(null);
                // setPro("")
            } else {
                Swal.fire({ title: "Error Something went wrong, please try again.", icon: "error", timer: 3000, showConfirmButton: false, toast: true, position: 'top-end' });
            }
        } catch (error) {
            console.error("Upload Error:", error);
            Swal.fire("Upload Failed", error.response?.data?.message || "Failed to upload file", "error");
        }
    };





    return (
        <>

            <div className="pro-pdf common">
                <h2 className="title-common">Product</h2>

                <div className="pdf-inputs">

                    <div className='row'>

                        {/* <div className="mb-4 col-md-4 col-sm-6 col-xs-6">
                            <label  className="form-label">Product Name</label>
                            <select
                                id="FormControlSelect1"
                                className="form-control"
                           
                                value={pro}
                                onChange={handleProductChange}


                            >
                                <option value="">Select a Product</option>
                                {fetchpro.map((item) => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                ))}
                            </select>
                        </div> */}

                        {/* 
                        <div className="col-md-4">
                            <input type="file" accept=".csv" onChange={handleFileChange} className="form-control mt-4" />
                            {file && <p>Selected File: {file.name}</p>} 
                        </div> */}

                        <div className="col-md-4 ">
                            <label >!(Excel Format : product_name,Date,Price)</label>
                            <input type="file" accept=".csv" onChange={handleFileChange} className="form-control pdf-btn " />
                            {file && <p>Selected File: {file.name}</p>}
                        </div>
                    </div>
                    <button className="form-btn" type='submit' onClick={handleUpload}>Submit
                        {/* <span>Submit</span> */}
                    </button>
                </div>


                {/* 
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
                                    <button data-bs-toggle="modal" data-bs-target="#staticBackdrop">Edit</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div> */}
            </div>


            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">

                            <div className=''>
                                <label  >Products</label>
                                <select id="category" className='form-control' >
                                    <option value="" >Select Category</option>
                                    <option label='one' value="1">One</option>
                                    <option label='two' value="2">Two</option>
                                    <option label='three' value="3">Three</option>
                                </select>
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Understood</button>
                        </div>
                    </div>
                </div>
            </div>



        </>
    )
}

export default Propdf



