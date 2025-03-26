import React, { useEffect, useState } from 'react';
import './Navbar.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { useAuth } from '../Auth';
import { useNavigate } from 'react-router-dom';

function Navbar() {

  // const [access, setaccess] = useState('')
  const [pendingEnquiries, setPendingEnquiries] = useState(0);
  const { isAuthenticated,  logout } = useAuth();
  const navigate=useNavigate()
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(isAuthenticated){
      fetchEnquiry(token)
    }
    else{
      navigate('/')
    }
    // setaccess(storedToken);
    // if (!storedToken) {
    //   window.location.href = "/";
    // } else {

    //   fetchEnquiry(storedToken);

    // }
  }, []);


  const fetchEnquiry = async (token) => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8002/api/v1/unlisted/enquiries/",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      // console.log("enquiry:", res.data);

      const enquiry = res?.data;
      // settotalEnquiries(enquiry?.length)
      const pendingEnquiries = enquiry.filter(enq => enq.status === "Pending");
      setPendingEnquiries(pendingEnquiries.length);
      // const completedEnquiries = enquiry.filter(enq => enq.status === "Completed");
      // setCompletedEnquiries(completedEnquiries.length);
      // const cancelledEnquiries = enquiry.filter(enq => enq.status === "Cancel");
      // setCancelledEnquiries(cancelledEnquiries.length);
      // console.log('Pending Count:', pendingEnquiries.length);
      // console.log('Completed Count:', completedEnquiries.length);
      // console.log('Cancelled Count:', cancelledEnquiries.length);

    } catch (error) {
      Swal.fire("Error", "", "error");
    }
  };

  const logoutt=()=>{
    logout()
    navigate('/')
    localStorage.clear(); 

  }

  return (
    <>
      {isAuthenticated === true  && (
        <div className="navbar">
          <div className="logo">
            <div className="logo-img">
              <img src="assets/Vitta Money-01.png"  alt='logo'/>
            </div>
            {/* <i className="fa-solid fa-user"></i> */}
            {/* <h1 className="title">DarkPan</h1> */}
          </div>

          <div className="input">
            {/* <input type="text" placeholder="Search" /> */}
          </div>

          <div className="menu">
            {/* <div className="dropdown message">
          <button className="dropdown-btn dropdown-toggle" data-bs-toggle="dropdown">
            <i className="fa-solid fa-envelope"></i><span>Messages</span>
          </button>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="#">Jhon sent you a message</a></li>
            <li><a className="dropdown-item" href="#">Jhon sent you a message</a></li>
          </ul>
        </div> */}

            <span type="" className="position-relative">
              <Link to='/enquiry'>
                <i className="fa-solid fa-bell bell"  style={{ color: 'black' }}></i>

              </Link>

              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {pendingEnquiries}
                <span className="visually-hidden">unread messages</span>
              </span>
            </span>

            <button onClick={logoutt} className='logout-btn'>
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            </button>
            {/* <button className="dropdown-btn " data-bs-toggle="dropdown">
           
          </button> */}

            {/* <div className="dropdown noti">
          
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="#">Profile Updated</a></li>
            <li><a className="dropdown-item" href="#">New User Added</a></li>
            <li><a className="dropdown-item" href="#">Password Changed</a></li>
          </ul>
        </div> */}

            {/* <div className="dropdown">
          <button className="dropdown-btn dropdown-toggle" data-bs-toggle="dropdown">
            <i className="fa-solid fa-user"></i><span>John Doe</span>
          </button>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="#">My Profile</a></li>
            <li><a className="dropdown-item" href="#">Settings</a></li>
            <li><a className="dropdown-item" href="#">Logout</a></li>
          </ul>
        </div> */}
          </div>
        </div>

      )

      }

    </>
  );
}

export default Navbar;
