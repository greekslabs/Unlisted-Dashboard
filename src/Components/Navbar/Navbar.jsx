import React, { useEffect, useState } from 'react';
import './Navbar.css';

function Navbar() {

  const [access,setaccess]=useState('')

  useEffect(()=>{
        const token = sessionStorage.getItem('token')
        setaccess(token)
  },[])

  return (
    <>
    { access && (
      <div className="navbar">
      <div className="logo">
        <i className="fa-solid fa-user"></i>
        <h1 className="title">DarkPan</h1>
      </div>

      <div className="input">
        <input type="text" placeholder="Search" />
      </div>

      <div className="menu">
        <div className="dropdown message">
          <button className="dropdown-btn dropdown-toggle" data-bs-toggle="dropdown">
            <i className="fa-solid fa-envelope"></i><span>Messages</span>
          </button>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="#">Jhon sent you a message</a></li>
            <li><a className="dropdown-item" href="#">Jhon sent you a message</a></li>
          </ul>
        </div>

        <div className="dropdown noti">
          <button className="dropdown-btn dropdown-toggle" data-bs-toggle="dropdown">
            <i className="fa-solid fa-bell"></i><span>Notifications</span>
          </button>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="#">Profile Updated</a></li>
            <li><a className="dropdown-item" href="#">New User Added</a></li>
            <li><a className="dropdown-item" href="#">Password Changed</a></li>
          </ul>
        </div>

        <div className="dropdown">
          <button className="dropdown-btn dropdown-toggle" data-bs-toggle="dropdown">
            <i className="fa-solid fa-user"></i><span>John Doe</span>
          </button>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="#">My Profile</a></li>
            <li><a className="dropdown-item" href="#">Settings</a></li>
            <li><a className="dropdown-item" href="#">Logout</a></li>
          </ul>
        </div>
      </div>
    </div>

    )

    }
      
    </>
  );
}

export default Navbar;
