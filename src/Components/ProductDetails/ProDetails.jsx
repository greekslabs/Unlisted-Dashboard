import React from 'react'
// import ProUnlisted from './ProUnlisted'
// import ProBond from './ProBond'
import { useEffect, useState, useRef } from 'react';
import './ProDetail.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth';


function ProDetails() {

  const [prodetail, setProDetail] = useState({
    product: "", heading: "", short_desc: "", description: ""
  });
  const [data, setData] = useState([]);
  const [fetchPro, setFetchPro] = useState([]);
  const [edit, setEdit] = useState({
    product: "", heading: "", short_desc: "", description: ""

  })

  const [search, setSearch] = useState({
    product: "", heading: ""
  })


  const [currentPage, setCurrentPage] = useState(1)
  const rowsperPage = 5
  const token= useState(localStorage.getItem('token'))
  // const [token, setToken] = useState(localStorage.getItem('token'))
  const productRef = useRef(null)
  const bondRef = useRef(null)
  const showProModal = useRef(null)
  const showBondModal = useRef(null)
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate()
  const api_path = process.env.REACT_APP_API_URL;


  // const token = localStorage.getItem('token');

  // useEffect(() => {
  //     fetchProducts();
  //     fetchProdetail()
  // }, []);

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (isAuthenticated) {
      navigate('/prodetail')
      fetchProducts(token)
      fetchProdetail(token)

    }
    else {
      logout()
      navigate('/')
    }
    // setToken(token)

    // if (!token) {
    //   window.location.href = '/'
    // }
    // else {
    //   fetchProducts(token)
    //   fetchProdetail(token)
    // }
  }, [])



  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${api_path}products/`, {
        headers: {
          Authorization: `Token ${token}`
        }
      });
      // console.log("fetch details", res.data);
      setFetchPro(res.data.data);

    } catch (error) {
      console.log(error.status)
      if (error.status === 404) {
        navigate('/')
        logout()
        Swal.fire({
          title: 'Session Expired,Login And Try Again!!'
        })

      }
    }
  };

  const fetchProdetail = async () => {
    try {
      const res = await axios.get(`${api_path}product-details/`,
        {
          headers: {
            Authorization: `Token ${token}`
          }
        })
      // console.log("prodetail", res)
      setData(res.data.data)


    }
    catch (error) {
      // const er = error?.response
      console.error("Error Getting details:", error?.response);
      Swal.fire({ title: "Error fetching details", icon: "error" });

    }
  }






  const handleSubmit = async (e) => {
    e.preventDefault();
    const { product, heading, short_desc } = prodetail;

    if (!product || !heading || !short_desc) {
      Swal.fire({
        title: "Enter valid inputs",
        icon: 'warning',
        timer: 3000
      })
      return
    }
    try {
      const response = await axios.post(`${api_path}product-details/`, prodetail,
        {
          headers: {
            Authorization: `Token ${token}`
          }
        }
      )
      // console.log(response)

      if (response.data.message === "Product detail successfully created") {
        Swal.fire({ title: "Product details added successfully", icon: "success", timer: 3000, position: "top-end", showConfirmButton: false, toast: true });
        fetchProdetail()
        setProDetail({ product: "", heading: "", short_desc: "", description: "" });
      }
      else {
        Swal.fire({ title: "Something Went Wrong", icon: "error", timer: 3000, position: "top-end", showConfirmButton: false, toast: true })
      }


    } catch (error) {
      const er = error?.response
      console.error("Error adding category:", error?.response);
      Swal.fire(`Failed to add category ${er?.data?.errors} `, "", "error");

    }
  }





  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to delete this?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(`${api_path}product-details/${id}/`,
            {
              headers: {
                Authorization: `Token ${token}`
              }
            });

          // console.log("pro dlt", res)
          if (res.data.message === "Deleted successfully") {
            Swal.fire({
              title: "Deletion Successfull", icon: "success",
              timer: 3000, position: "top-end", showConfirmButton: false, toast: true
            })
            fetchProdetail()

          }
          else {
            Swal.fire({ title: "Something Went Wrong", icon: "error", timer: 3000, position: "top-end", showConfirmButton: false, toast: true })


          }
        }
        catch (error) {
          // const er = error?.response
          console.error("Error Deleting details:", error?.response);

          Swal.fire({ title: "Deletion Failed", icon: "error", timer: 3000, position: "top-end", showConfirmButton: false, toast: true })
        }
      }
    })
  };

  const openModal = (prodetail) => {
    if(prodetail){
      showBondModal.current.click()
      // showProModal.current.click()
      setEdit(prodetail)
    }
    

  }

  const handleEdit = async () => {
    
    // console.log(productRef.current.click())

    if (!edit.product || !edit.heading || !edit.short_desc) {
      Swal.fire({
        title: "Enter valid inputs",
        icon: 'warning',
        timer: 3000
      })
      return
    }
    try {
      const response = await axios.patch(`${api_path}product-details/${edit.id}/`, edit,
        {
          headers: {
            Authorization: `Token ${token}`
          }
        });
      console.log("edit responce", response.data.statuscode)

      if (response.data.statuscode === 200) {
        bondRef.current.click()
        productRef.current.click()
        // if(productRef){
        //  
        // }
        // else{
          
        // }
        console.log('modal', productRef.current)

        Swal.fire({
          title: "Details Edited SuccessFully",
          icon: 'success', timer: 3000, position: "top-end", showConfirmButton: false, toast: true
        })
        // fetchProdetail()


      }
      else {
        Swal.fire({ title: "Something Went Wrong", icon: "error", timer: 3000, position: "top-end", showConfirmButton: false, toast: true })
      }

    }
    catch (error) {
      const er = error?.response
      console.error("Error editing details:", error?.response);
      Swal.fire(`Failed to editing details ${er?.data?.errors} `, "", "error");
    }
    console.log(edit)
  }


  const handleSearch = (updatedSearch) => {
    setSearch(updatedSearch);
    setCurrentPage(1);
  };


  const filteredData = data.filter((item) => {
    return (
      item.product_name.toLowerCase().includes(search.product.toLowerCase()) &&
      item.heading.toLowerCase().includes(search.heading.toLowerCase())
    )
  })


  const totalPages = Math.ceil(filteredData.length / rowsperPage)
  const indexOfLastItem = currentPage * rowsperPage
  const indexOfFirstItem = indexOfLastItem - rowsperPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)


  const handleNext = () => {
    if (currentPage < totalPages)
      setCurrentPage((prevPage) => prevPage + 1);

  }

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prevPage) => prevPage - 1);

  }


  return (
    <>

      <div className="pro-details common">
        <h2 className='title-common'>Product Details</h2>

        <div className="tab-switch">
          <ul className="nav nav-tabs " id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
              <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#unlisted" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Unlisted Details</button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#bond" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Bond Details</button>
            </li>

          </ul>
          <div className="tab-content main" id="myTabContent">
            <div className="tab-pane fade show active unlisted" id="unlisted" role="tabpanel" aria-labelledby="home-tab" tabIndex="0">


              <div className="unlisted" id=''>
                <h2 className='title-common'>Unlisted Product Details</h2>

                <div className="prodetail-inputs">
                  <form>
                    <div className='row'>
                      <div className="mb-4 col-md-4 col-sm-6 col-xs-6">
                        <label className="form-label">Product Name</label>
                        <select
                          id="FormControlSelect1"
                          className="form-control"
                          value={prodetail.product}
                          onChange={(e) => setProDetail({ ...prodetail, product: e.target.value })}
                        >
                          <option value="">Select a Product</option>
                          {fetchPro.filter((item) => item.variant_name === "Unlisted").map((item) => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                        <label className="form-label">Heading</label>
                        <input type="text" className="form-control" id="FormControlInput1" placeholder="Heading"
                          value={prodetail.heading}
                          onChange={(e) => setProDetail({ ...prodetail, heading: e.target.value })} />
                      </div>

                      <div className="mb-4 col-md-4 col-sm-6 col-xs-6">
                        <label className="form-label">Short Description</label>
                        <textarea
                          className="form-control"
                          id="FormControlTextarea1"
                          rows="1"
                          placeholder="Short description"
                          value={prodetail.short_desc}
                          onChange={(e) => setProDetail({ ...prodetail, short_desc: e.target.value })}
                        ></textarea>
                      </div>

                      <div className="mb-4 col-md-4 col-sm-6 col-xs-6">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          id="FormControlTextarea2"
                          rows="1"
                          placeholder="Description"
                          value={prodetail.description}
                          onChange={(e) => setProDetail({ ...prodetail, description: e.target.value })}
                        ></textarea>
                      </div>
                    </div>

                    <button className="form-btn" type="submit" onClick={handleSubmit}>Submit</button>
                  </form>
                </div>

                <div className="table-main table-responsive">
                  <table border="1" className="table">
                    <thead>
                      <tr>
                        <th>product</th>
                        <th>Heading</th>
                        <th>Short Description</th>
                        <th>Description</th>
                        <th>Action</th>
                      </tr>
                      <tr>
                        <td>
                          <input type="text" placeholder='Search By Product Name' className='search'
                            onChange={(e) => handleSearch({ ...search, product: e.target.value })} />
                        </td>

                        <td>
                          <input type="text" placeholder='Search By Title' className='search'
                            onChange={(e) => handleSearch({ ...search, heading: e.target.value })} />
                        </td>
                      </tr>

                    </thead>
                    <tbody>
                      {currentItems.filter((item) => item.variant_name === "Unlisted").map((item) => (
                        <tr key={item.id}>
                          <td>{item.product_name}</td>
                          <td>{item.heading}</td>
                          <td>{item.short_desc}</td>
                          <td>{item.description}</td>
                          <td className='details'>
                            <button onClick={() => handleDelete(item.id)}>Delete</button>
                            <button data-bs-toggle="modal" data-bs-target="#staticBackdrop" ref={showProModal} onClick={() => openModal(item)}>Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pagination">
                  <button onClick={handlePrev} disabled={currentPage === 1}>
                    <i className="fa-solid fa-arrow-left"></i>
                  </button>
                  <span>{currentPage} of {totalPages}</span>
                  <button onClick={handleNext} disabled={currentPage === totalPages}>
                    <i className="fa-solid fa-arrow-right"></i>

                  </button>
                </div>


              </div>

              <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h1 className="modal-title fs-5" id="staticBackdropLabel">Edit Product Details</h1>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ref={productRef}  ></button>
                    </div>
                    <div className="modal-body">

                      <div className="mb-4 ">
                        <label className="form-label">Product Name</label>
                        <select
                          id="FormControlSelect1"
                          className="form-control"
                          value={edit.product}
                          onChange={(e) => setEdit({ ...edit, product: e.target.value })}
                        >
                          <option value="">Select a Product</option>
                          {fetchPro.filter((item) => item.variant_name === "Unlisted").map((item) => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-4">
                        <label className="form-label">Heading</label>
                        <input type="text" className="form-control" id="EditHeading" placeholder="Heading"
                          value={edit.heading} onChange={(e) => setEdit({ ...edit, heading: e.target.value })} />
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Short Description</label>
                        <textarea className="form-control" id="EditShortDesc" rows="1" placeholder="Short description"
                          value={edit.short_desc}
                          onChange={(e) => setEdit({ ...edit, short_desc: e.target.value })}></textarea>
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Description</label>
                        <textarea className="form-control" id="EditDesc" rows="1" placeholder="Description"
                          value={edit.description}
                          onChange={(e) => setEdit({ ...edit, description: e.target.value })}></textarea>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" >Close</button>
                      <button type="button" className="btn btn-primary"  onClick={handleEdit}>Save</button>
                    </div>
                  </div>
                </div>
              </div>




            </div>
            <div className="tab-pane fade" id="bond" role="tabpanel" aria-labelledby="profile-tab" tabIndex="0">
              <div className="bond">
                <h2 className='title-common '>Bond Product Details</h2>

                <div className="prodetail-inputs">
                  <form>
                    <div className='row'>
                      <div className="mb-4 col-md-4 col-sm-6 col-xs-6">
                        <label className="form-label">Product Name</label>
                        <select
                          id="FormControlSelect1"
                          className="form-control"
                          value={prodetail.product}
                          onChange={(e) => setProDetail({ ...prodetail, product: e.target.value })}
                        >
                          <option value="">Select a Product</option>
                          {fetchPro.filter((item) => item.variant_name === "Bond").map((item) => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                        <label className="form-label">Heading</label>
                        <input type="text" className="form-control" id="FormControlInput1" placeholder="Heading"
                          value={prodetail.heading}
                          onChange={(e) => setProDetail({ ...prodetail, heading: e.target.value })} />
                      </div>

                      <div className="mb-4 col-md-4 col-sm-6 col-xs-6">
                        <label className="form-label">Short Description</label>
                        <textarea
                          className="form-control"
                          id="FormControlTextarea1"
                          rows="1"
                          placeholder="Short description"
                          value={prodetail.short_desc}
                          onChange={(e) => setProDetail({ ...prodetail, short_desc: e.target.value })}
                        ></textarea>
                      </div>

                      {/* <div className="mb-4 col-md-4 col-sm-6 col-xs-6">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          id="FormControlTextarea2"
                          rows="1"
                          placeholder="Description"
                          value={prodetail.description}
                          onChange={(e) => setProDetail({ ...prodetail, description: e.target.value })}
                        ></textarea>
                      </div> */}
                    </div>

                    <button className="form-btn" type="submit" onClick={handleSubmit}>Submit</button>
                  </form>
                </div>

                <div className="table-main table-responsive">
                  <table border="1" className="table">
                    <thead>
                      <tr>
                        <th>product</th>
                        <th>Heading</th>
                        <th>Short Description</th>
                        <th>Action</th>
                      </tr>
                      <tr>
                        <td>
                          <input type="text" placeholder='Search By Product Name' className='search'
                            onChange={(e) => handleSearch({ ...search, product: e.target.value })} />
                        </td>

                        <td>
                          <input type="text" placeholder='Search By Title' className='search'
                            onChange={(e) => handleSearch({ ...search, heading: e.target.value })} />
                        </td>
                      </tr>

                    </thead>
                    <tbody>
                      {currentItems.filter((item) => item.variant_name === "Bond").map((item) => (
                        <tr key={item.id}>
                          <td>{item.product_name}</td>
                          <td>{item.heading}</td>
                          <td>{item.short_desc}</td>
                          <td className='details'>
                            <button onClick={() => handleDelete(item.id)}>Delete</button>
                            <button   onClick={() => openModal(item)}>Edit</button>
                            <button data-bs-toggle="modal" data-bs-target="#staticBackdrops" hidden ref={showBondModal}></button>
                            
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pagination">
                  <button onClick={handlePrev} disabled={currentPage === 1}>
                    <i className="fa-solid fa-arrow-left"></i>
                  </button>
                  <span>{currentPage} of {totalPages}</span>
                  <button onClick={handleNext} disabled={currentPage === totalPages}>
                    <i className="fa-solid fa-arrow-right"></i>

                  </button>
                </div>


              </div>

              <div className="modal fade" id="staticBackdrops" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h1 className="modal-title fs-5" id="staticBackdropLabel">Edit Product Details</h1>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ref={bondRef}  ></button>
                    </div>
                    <div className="modal-body">

                      <div className="mb-4 ">
                        <label className="form-label">Product Name</label>
                        <select
                          id="FormControlSelect1"
                          className="form-control"
                          value={edit.product}
                          onChange={(e) => setEdit({ ...edit, product: e.target.value })}
                        >
                          <option value="">Select a Product</option>
                          {fetchPro.filter((item) => item.variant_name === "Bond").map((item) => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-4">
                        <label className="form-label">Heading</label>
                        <input type="text" className="form-control" id="EditHeading" placeholder="Heading"
                          value={edit.heading} onChange={(e) => setEdit({ ...edit, heading: e.target.value })} />
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Short Description</label>
                        <textarea className="form-control" id="EditShortDesc" rows="1" placeholder="Short description"
                          value={edit.short_desc}
                          onChange={(e) => setEdit({ ...edit, short_desc: e.target.value })}></textarea>
                      </div>
                      {/* <div className="mb-4">
                        <label className="form-label">Description</label>
                        <textarea className="form-control" id="EditDesc" rows="1" placeholder="Description"
                          value={edit.description}
                          onChange={(e) => setEdit({ ...edit, description: e.target.value })}></textarea>
                      </div> */}
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" >Close</button>
                      <button type="button" className="btn btn-primary"  onClick={handleEdit}>Save</button>
                    </div>
                  </div>
                </div>
              </div>





            </div>

          </div>
        </div>




      </div>


    </>
  )
}

export default ProDetails
