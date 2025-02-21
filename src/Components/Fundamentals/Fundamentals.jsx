import React, { useState } from 'react'
import './Fundamentals.css'
import Swal from 'sweetalert2'

function Fundamentals() {
    const [fund, setFund] = useState({
        price: "", marketcap: "", isin: "", facevalue: "", peratio: "", eps: "", pbratio: "", bookvalue: "", debt: ""
    })

    const [data, setData] = useState([])

    const handleInputs = (e) => {
        e.preventDefault()
        console.log(fund)
        const { price, marketcap, isin, facevalue, peratio, eps, pbratio, bookvalue, debt } = fund
        if (!price || !marketcap || !isin || !facevalue || !peratio || !eps || !pbratio || !bookvalue || !debt) {
            Swal.fire("Enter Valid Inputs")
        }
        else {
            setData([...data, fund])
        }
        setFund({
            price: "", marketcap: "", isin: "", facevalue: "", peratio: "", eps: "", pbratio: "", bookvalue: "", debt: ""
        })


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
            <div className="fundamentals common">
                <h2 className='title-common'>Fundamentals</h2>

                <div className="fundamentals-inputs">
                    <form >
                        <div className="row">
                            <div class="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label for="FormControlInput1" class="form-label">Current Price</label>
                                <input type="number" class="form-control" id="FormControlInput1" placeholder="Current Price"
                                    value={fund.price}
                                    onChange={(e) => setFund({ ...fund, price: e.target.value })}
                                />
                            </div>

                            <div class="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label for="FormControlInput1" class="form-label">Market Cap</label>
                                <input type="number" class="form-control" id="FormControlInput1" placeholder="Market Cap"
                                    value={fund.marketcap}
                                    onChange={(e) => setFund({ ...fund, marketcap: e.target.value })}

                                />
                            </div>

                            <div class="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label for="FormControlInput1" class="form-label">ISIN</label>
                                <input type="text" class="form-control" id="FormControlInput1" placeholder="ISIN"
                                    value={fund.isin}
                                    onChange={(e) => setFund({ ...fund, isin: e.target.value })}

                                />
                            </div>


                            <div class="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label for="FormControlInput1" class="form-label">Face Value</label>
                                <input type="number" class="form-control" id="FormControlInput1" placeholder="Face Value"
                                    value={fund.facevalue}
                                    onChange={(e) => setFund({ ...fund, facevalue: e.target.value })}

                                />
                            </div>

                            <div class="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label for="FormControlInput1" class="form-label">P/E Ratio</label>
                                <input type="number" class="form-control" id="FormControlInput1" placeholder="P/E Ratio"
                                    value={fund.peratio}
                                    onChange={(e) => setFund({ ...fund, peratio: e.target.value })}

                                />
                            </div>

                            <div class="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label for="FormControlInput1" class="form-label">EPS</label>
                                <input type="number" class="form-control" id="FormControlInput1" placeholder="EPS"
                                    value={fund.eps}
                                    onChange={(e) => setFund({ ...fund, eps: e.target.value })}

                                />
                            </div>

                            <div class="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label for="FormControlInput1" class="form-label">P/B Ratio</label>
                                <input type="number" class="form-control" id="FormControlInput1" placeholder="P/B Ratio"
                                    value={fund.pbratio}
                                    onChange={(e) => setFund({ ...fund, pbratio: e.target.value })}

                                />
                            </div>

                            <div class="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label for="FormControlInput1" class="form-label">Book Value</label>
                                <input type="number" class="form-control" id="FormControlInput1" placeholder="Book Value"
                                    value={fund.bookvalue}
                                    onChange={(e) => setFund({ ...fund, bookvalue: e.target.value })}

                                />
                            </div>


                            <div class="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label for="FormControlInput1" class="form-label">Debt/Equity Ratio</label>
                                <input type="number" class="form-control" id="FormControlInput1" placeholder="Debt/Equity Ratio"
                                    value={fund.debt}
                                    onChange={(e) => setFund({ ...fund, debt: e.target.value })}

                                />
                            </div>


                        </div>
                        <button className='form-btn' onClick={handleInputs}>Submit</button>


                    </form>
                </div>



                <div className="table-main">
                    <table border="1" className='table-responsive table'>
                        <thead>
                            <tr>
                                <th>Current Price</th>
                                <th>Market Cap</th>
                                <th> ISIN</th>
                                <th>Face Value</th>
                                <th>P/E Ratio</th>
                                <th>EPS</th>
                                <th>P/B Ratio</th>
                                <th>Book Value</th>
                                <th>Debt/Equity Value</th>
                                <th>Action</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                data.map((item, index) => (
                                    <tr key={index}>
                                        <td>${item.price}</td>
                                        <td>${item.marketcap}</td>
                                        <td>{item.isin}</td>
                                        <td>${item.facevalue}</td>
                                        <td>{item.peratio}</td>
                                        <td>${item.eps}</td>
                                        <td>{item.pbratio}</td>
                                        <td>${item.bookvalue}</td>
                                        <td>{item.debt}</td>
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

                            <div class="mb-4 ">
                                <label for="FormControlInput1" class="form-label">Current Price</label>
                                <input type="number" class="form-control" id="FormControlInput1" placeholder="Current Price"/>
                            </div>

                            <div class="mb-4 ">
                                <label for="FormControlInput1" class="form-label">Market Cap</label>
                                <input type="number" class="form-control" id="FormControlInput1" placeholder="Market Cap"  />
                            </div>

                            <div class="mb-4  ">
                                <label for="FormControlInput1" class="form-label">ISIN</label>
                                <input type="text" class="form-control" id="FormControlInput1" placeholder="ISIN" />
                            </div>


                            <div class="mb-4  ">
                                <label for="FormControlInput1" class="form-label">Face Value</label>
                                <input type="number" class="form-control" id="FormControlInput1" placeholder="Face Value" />
                            </div>

                            <div class="mb-4  ">
                                <label for="FormControlInput1" class="form-label">P/E Ratio</label>
                                <input type="number" class="form-control" id="FormControlInput1" placeholder="P/E Ratio" />
                            </div>

                            <div class="mb-4">
                                <label for="FormControlInput1" class="form-label">EPS</label>
                                <input type="number" class="form-control" id="FormControlInput1" placeholder="EPS" />
                            </div>

                            <div class="mb-4  ">
                                <label for="FormControlInput1" class="form-label">P/B Ratio</label>
                                <input type="number" class="form-control" id="FormControlInput1" placeholder="P/B Ratio" />
                            </div>

                            <div class="mb-4 ">
                                <label for="FormControlInput1" class="form-label">Book Value</label>
                                <input type="number" class="form-control" id="FormControlInput1" placeholder="Book Value" />
                            </div>


                            <div class="mb-4  ">
                                <label for="FormControlInput1" class="form-label">Debt/Equity Ratio</label>
                                <input type="number" class="form-control" id="FormControlInput1" placeholder="Debt/Equity Ratio" />
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

export default Fundamentals
