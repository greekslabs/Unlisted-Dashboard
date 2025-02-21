import React, { useState } from 'react'
import './Mapro.css'
import { MultiSelect } from "react-multi-select-component";
import Swal from 'sweetalert2';


const options = [
    { label: " AAPL", value: " AAPL" },
    { label: "MSFT", value: "MSFT" },
    { label: "GOOGL", value: "GOOGL" },
    { label: "NVDA", value: "NVDA" },
    { label: "AMZN", value: "AMZN" },
    { label: "JPM", value: "JPM" },

];


function Mapro() {

    const [selected, setSelected] = useState([]);
    const [category, setCategory] = useState("");
    const [data, setData] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault()
        if (category && selected.length > 0) {
            const newdata = { category, stock: selected }
            setData([...data, newdata])
            setSelected([])
            setCategory("")

        }
        else{
            Swal.fire("Enter Any inputs!!")
        }
        console.log(data)
        console.log(category)
        console.log(selected)
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

            <div className="map-product common">
                <h2 className="title-common">Map Products</h2>

                <div className="map-inputs">

                    <form>

                        <div className='row'>
                            <div className="form-cat col-md-4">
                                <label for="category" >Category</label>
                                <select id="category" className='form-control'
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}>
                                    <option value="" >Select Category</option>
                                    <option label='one' value="1">One</option>
                                    <option label='two' value="2">Two</option>
                                    <option label='three' value="3">Three</option>
                                </select>
                            </div>


                            <div className='col-md-4'>
                                <h6>Stocks</h6>
                                <MultiSelect
                                    options={options}
                                    value={selected}
                                    onChange={setSelected}
                                    labelledBy="Select"
                                />
                            </div>
                        </div>
                        <button className="form-btn mt-1" onClick={handleSubmit}>Submit</button>
                    </form>
                </div>


                <div className="table-main">
                    <table border="1" className='table-responsive table'>
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Stock</th>
                                <th>Action</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                data.map((item, index) => (
                                    <tr key={index} >
                                        <td>{item.category}</td>
                                        <td>
                                            <ul>
                                                {
                                                    item.stock.map((stock, i) => (
                                                        <li className='list' key={i}>{stock.label}</li>
                                                    ))
                                                }
                                            </ul>
                                        </td>
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
      <div className="form-cat ">
                                <label for="category" >Category</label>
                                <select id="category" className='form-control' >
                                    <option value="" >Select Category</option>
                                    <option label='one' value="1">One</option>
                                    <option label='two' value="2">Two</option>
                                    <option label='three' value="3">Three</option>
                                </select>
                            </div>


                            <div className=''>
                                <h6>Stocks</h6>
                                <MultiSelect
                                    options={options}
                                    value={selected}
                                    onChange={setSelected}
                                    labelledBy="Select"
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

export default Mapro
