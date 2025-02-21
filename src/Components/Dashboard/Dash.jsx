
import React from 'react';
import './Dash.css';

function Dash() {
  return (
  <>
      <div className="mt-4 dashboard common">
        <div className='row'>
          <div className='col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12'>
            <div className='card'> 
              <div className="card-content">
                <div className="icon">
                  <i className="fa-solid fa-chart-line fa-2x"></i>
                </div>
                <div className="content">
                  <h5>Today Sale</h5>
                  <p>$1234</p>
                </div>
              </div>
            </div>
          </div>
  
          <div className='col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12'>
            <div className='card'>
              <div className="card-content">
                <div className="icon">
                  <i className="fa-solid fa-chart-column fa-2x"></i>
                </div>
                <div className="content">
                  <h5>Total Sale</h5>
                  <p>$1234</p>
                </div>
              </div>
            </div>
          </div>
  
          <div className='col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12'>
            <div className='card'>
              <div className="card-content">
                <div className="icon">
                  <i className="fa-solid fa-chart-area fa-2x"></i>
                </div>
                <div className="content">
                  <h5>Today Revenue</h5>
                  <p>$1234</p>
                </div>
              </div>
            </div>
          </div>
  
          <div className='col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12'>
            <div className='card'>
              <div className="card-content">
                <div className="icon">
                  <i className="fa-solid fa-chart-pie fa-2x"></i>
                </div>
                <div className="content">
                  <h5>Total Revenue</h5>
                  <p>$1234</p>
                </div>
              </div>
            </div>
          </div>
        </div>




        <div className="table-main">
    <table border="1" className='table-responsive table'>
        <thead>
            <tr>
                <th>Date</th>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
            </tr>
        </thead>

        <tbody>
       <tr>
                <td>01-jan-2045</td>
                <td>INV-0123</td>
                <td>Jhon Doe</td>
                <td>$123</td>
                <td>Paid</td>
                <td><button>Detail</button></td>
       </tr>


       <tr>
                <td>01-jan-2045</td>
                <td>INV-0123</td>
                <td>Jhon Doe</td>
                <td>$123</td>
                <td>Paid</td>
                <td><button>Detail</button></td>
       </tr>


       <tr>
                <td>01-jan-2045</td>
                <td>INV-0123</td>
                <td>Jhon Doe</td>
                <td>$123</td>
                <td>Paid</td>
                <td><button>Detail</button></td>
       </tr>

       <tr>
                <td>01-jan-2045</td>
                <td>INV-0123</td>
                <td>Jhon Doe</td>
                <td>$123</td>
                <td>Paid</td>
                <td><button>Detail</button></td>
       </tr>
        </tbody>

    </table>
   </div>

















      </div>






  </>
  );
}

export default Dash;

