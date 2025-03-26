import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./Dash.css";
import { Chart } from "react-google-charts";
import { useAuth } from "../Auth";
import { useNavigate } from "react-router-dom";

function Dash() {
  // const [token, setToken] = useState(localStorage.getItem('token'))
  const token= useState(localStorage.getItem('token'))

  const [totalEnquiries, settotalEnquiries] = useState([]);
  const [pendingEnquiries, setPendingEnquiries] = useState([]);
  const [completedEnquiries, setCompletedEnquiries] = useState([]);
  const [cancelledEnquiries, setCancelledEnquiries] = useState([]);
  const [unlistedProducts, setUnlistedProducts] = useState([]);
  const [bondsProducts, setBondsProducts] = useState([]);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate()
  const api_path = process.env.REACT_APP_API_URL;



  useEffect(() => {
    // const storedToken = localStorage.getItem("token");
    // const token = localStorage.getItem('token')
    // setToken(storedToken); 

    if (isAuthenticated === true) {
      navigate('/dashboard')
      fetchEnquiry(token);
      fetchProducts(token);

    }
    else {
      logout()
      navigate('/')

    }

    // if (!storedToken) {
    //   window.location.href = "/";
    // } else {

    //   fetchEnquiry(storedToken); 
    //   fetchProducts(storedToken);
    // }
  }, []);

  const Enquirydata = [
    ["Enquiry", "Total Enquiries"],
    ["Pending", pendingEnquiries || 0],
    ["Completed", completedEnquiries || 0],
    ["Cancelled", cancelledEnquiries || 0],
  ];

  const Productdata = [
    ["Products", "Total Products"],
    ["Unlisted", unlistedProducts || 0],
    ["Bonds", bondsProducts || 0],
  ];

  const Enquirystatus = {
    title: "Enquiry Analysis",
    colors: ["#f39c12", "#2ecc71", "#e74c3c"], // Customize colors for Pending, Completed, Cancelled
    // pieHole: 0.4, // Optional: Make it a Donut chart
    is3D: false, // Set to true if you want a 3D effect
    legend: { position: "bottom" },
  };

  const productstatus = {
    title: "Product Analysis",
    colors: ["#f39c12", "#2ecc71"], // Customize colors for Pending, Completed, Cancelled
    // pieHole: 0.4, // Optional: Make it a Donut chart
    is3D: false, // Set to true if you want a 3D effect
    legend: { position: "bottom" },
  };

  const fetchEnquiry = async (token) => {
    try {
      const res = await axios.get(`${api_path}enquiries/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      // console.log("enquiry:", res.data);

      const enquiry = res?.data;
      settotalEnquiries(enquiry?.length)
      const pendingEnquiries = enquiry.filter(enq => enq.status === "Pending");
      setPendingEnquiries(pendingEnquiries.length);
      const completedEnquiries = enquiry.filter(enq => enq.status === "Completed");
      setCompletedEnquiries(completedEnquiries.length);
      const cancelledEnquiries = enquiry.filter(enq => enq.status === "Cancel");
      setCancelledEnquiries(cancelledEnquiries.length);
      // console.log('Pending Count:', pendingEnquiries.length);
      // console.log('Completed Count:', completedEnquiries.length);
      // console.log('Cancelled Count:', cancelledEnquiries.length);

    } catch (error) {
      Swal.fire("Error", "", "error");
    }
  };

  const fetchProducts = async (token) => {
    try {
      const res = await axios.get('http://127.0.0.1:8002/api/v1/unlisted/products/',
        {
          headers: {
            Authorization: `Token ${token}`
          }
        }
      )
      // console.log('products', res)
      // setData(res.data.data)

      const products = res?.data.data;
      const unlistedProducts = products?.filter(product => product.variant_name === "Unlisted");
      const bondsProducts = products?.filter(product => product.variant_name === "Bond");
      setUnlistedProducts(unlistedProducts.length);
      setBondsProducts(bondsProducts.length);

      // console.log('Unlisted Products:', unlistedProducts.length);
      // console.log('Bonds Products:', bondsProducts.length);



    }
    catch (error) {
      console.log(error.status)
                if (error.status === 404) {
                    navigate('/')
                    logout()
    
                    Swal.fire({
                        title: 'Session Expired,Login And Try Again!!',
                        icon:'warning'
                    })
                }

    }
  }

  return (
    <>
      <div className="mt-4 dashboard common">

        <div className="row">
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
            <div className="chart">
              <h3>Total Enquiries</h3>
              <div style={{ width: "100%", maxWidth: "600px", height: "300px" }}>
                <Chart
                  chartType="PieChart"
                  data={Enquirydata}
                  options={Enquirystatus}
                  width={"100%"}
                  height={"300px"}
                />
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
            <div className="chart">
              <h3>Total Products</h3>
              <div style={{ width: "100%", maxWidth: "600px", height: "300px" }}>
                <Chart
                  chartType="PieChart"
                  data={Productdata}
                  options={productstatus}
                  width={"100%"}
                  height={"300px"}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12">
            <div className="card">
              <div className="card-content">
                <div className="icon">
                  <img src="/assets/icons8-pending.gif" alt="Pending Icon" />


                  {/* <i className="fa-solid fa-chart-line fa-2x"></i> */}
                </div>
                <div className="content">
                  <h5>Pending Enquiries</h5>
                  <p className="text-warning">{pendingEnquiries}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12">
            <div className="card">
              <div className="card-content">
                <div className="icon">
                  {/* <i className="fa-solid fa-chart-column fa-2x"></i> */}
                  <img src="/assets/icons8-check-mark.gif" alt="Pending Icon" />

                </div>
                <div className="content">
                  <h5>Completed Enquiries</h5>
                  <p className="text-success">{completedEnquiries}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12">
            <div className="card">
              <div className="card-content">
                <div className="icon">
                  {/* <i className="fa-solid fa-chart-area fa-2x"></i> */}
                  <img src="/assets/icons8-cancel.gif" alt="Pending Icon" />

                </div>
                <div className="content">
                  <h5>Cancelled Enquiries</h5>
                  <p className="text-secondary">{cancelledEnquiries}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12">
            <div className="card">
              <div className="card-content">


                <div className="content ">
                  <h5>Total Enquiries</h5>
                  <p>{totalEnquiries}</p>
                </div>
              </div>
            </div>
          </div>
        </div>




      </div>
    </>
  );
}

export default Dash;
