import React, { useState, useEffect } from "react";
import "./SideBar.css";
import { Link } from "react-router-dom";

function SideBar() {
  const [toggle, setToggle] = useState(true);
  // const [access, setaccess] = useState('')
  // const current="dashboard"
  // const [actived, setActived] = useState("dashboard")
  const [actived, setActived] = useState(localStorage.getItem("actived") || "dashboard");


  const togglebar = () => {
    setToggle(!toggle);
  };

  useEffect(() => {
    // const token = localStorage.getItem('token')
    // setaccess(token)
    // setActived(actived)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')
    // setaccess(token)
    // setActived(actived)

    const savedActive = localStorage.getItem("actived");
    if (savedActive) {
      setActived(savedActive);
    }
  }, []);

  const handleSetActive = (active) => {
    setActived(active);
    localStorage.setItem("actived", active);
  };

  return (
    <div className={`side-bar ${toggle ? "toggled" : ""}`}>
      <button className="toggle-btn" onClick={togglebar}>
        <i className="fa-solid fa-bars cross"></i>
        <i className="fa-solid fa-times bars"></i>

      </button>

      <ul className="sidebar-list">


        <Link to="/dashboard" className="dash">
          <li
            className={`${actived === "dashboard" ? "actived" : ""}`}
            onClick={() => handleSetActive("dashboard")}>
            <i className="bi bi-clipboard2-data"></i>
            <span>DashBoard</span>
          </li>
          {/* <p className="dash-name">Dashboard</p> */}
        </Link>


        <Link to="/offer" className="dash">
          <li
            className={`${actived === "offer" ? "actived" : ""}`}
            onClick={() => handleSetActive("offer")} >
            <i className="fa-solid fa-envelope"></i>
            <span>Offer</span>
          </li>
          {/* <p className="dash-name">Offer</p> */}
        </Link>


        <div>
          <Link to='/category' className="dash">
            <li
              className={`${actived === "category" ? "actived" : ""}`}
              onClick={() => handleSetActive("category")}>
              <i className="fa-solid fa-layer-group"></i>
              {!toggle && <span>Category</span>}
            </li>


          </Link>
          {/* <p className="dash-name">Category</p> */}
          
        </div>

        {/* <Link to='/product' className="dash">
          <li>
            <i class="fa-solid fa-wallet"></i>
          {!toggle && <span> Add Product</span>}
          </li>
          </Link>*/}


        <Link to='/unlisted' className="dash">
          <li
            className={`${actived === "unlisted" ? "actived" : ""}`}
            onClick={() => handleSetActive("unlisted")}>
            <i className="bi bi-card-checklist"></i>
            {!toggle && <span> Add Unlisted</span>}
          </li>
          {/* <p className="dash-name">Unlisted</p> */}

        </Link>

        <Link to='/bond' className="dash">
          <li
            className={`${actived === "bond" ? "actived" : ""}`}
            onClick={() => handleSetActive("bond")}
          >
            <i className="fa-solid fa-wallet"></i>
            {!toggle && <span> Add Bond</span>}
          </li>
          {/* <p className="dash-name">Bond</p> */}

        </Link>


        <Link to='/prodetail' className="dash">
          <li
            className={`${actived === "prodetail" ? "actived" : ""}`}
            onClick={() => handleSetActive("prodetail")}>
            <i className="fa-solid fa-folder-open"></i>
            {!toggle && <span>Product Details</span>}
          </li>
          {/* <p className="dash-name">Details</p> */}

        </Link>




        <Link to='/blog' className="dash">
          <li
            className={`${actived === "blog" ? "actived" : ""}`}
            onClick={() => handleSetActive("blog")}>
            <i className="fa-solid fa-blog"></i>
            {!toggle && <span>Blog</span>}
          </li>
          {/* <p className="dash-name">Blog</p> */}

        </Link>


        <Link to='/testimonial' className="dash">
          <li
            className={`${actived === "testimonial" ? "actived" : ""}`}
            onClick={() => handleSetActive("testimonial")}>
            <i className="fa-solid fa-comment-dots"></i>
            {!toggle && <span>Testimonials</span>}
          </li>
          {/* <p className="dash-name">Testimonials</p> */}


        </Link>

        <Link to='/specialities' className="dash">
          <li
            className={`${actived === "specialities" ? "actived" : ""}`}
            onClick={() => handleSetActive("specialities")}>
            <i className="fa-solid fa-star"></i>
            {!toggle && <span>Specialities</span>}
          </li>
          {/* <p className="dash-name">Specialities</p> */}

        </Link>


        <Link to='/fundamentals' className="dash">
          <li
            className={`${actived === "fundamentals" ? "actived" : ""}`}
            onClick={() => handleSetActive("fundamentals")}>
            <i className="fa-solid fa-pen-nib"></i>
            {!toggle && <span> Fundamentals</span>}
          </li>
          {/* <p className="dash-name">Fundamentals</p> */}


        </Link>


        <Link to='/portfolio' className="dash">
          <li
            className={`${actived === "portfolio" ? "actived" : ""}`}
            onClick={() => handleSetActive("portfolio")}>
            <i className="fa-solid fa-briefcase"></i>
            {!toggle && <span >Portfolio</span>}
          </li>
          {/* <p className="dash-name">Portfolio</p> */}

        </Link>

        {/* <Link to='/bond' className="dash">
          <li>
          <i class="fa-solid fa-handshake"></i>
          {!toggle && <span>Bond</span> }
          </li>
          </Link> */}


        <Link to='/faq' className="dash">
          <li
            className={`${actived === "faq" ? "actived" : ""}`}
            onClick={() => handleSetActive("faq")}>
            <i className="fa-solid fa-circle-question"></i>
            {!toggle && <span>FAQ</span>}
          </li>
          {/* <p className="dash-name">Faq</p> */}

        </Link>

        {/* <Link to='/promap' className="dash">
          <li>
          <i className="fa-solid fa-map"></i>
          {!toggle && <span>Map Product</span>}
          </li>
          </Link> */}


        <Link to='/pdf' className="dash">
          <li
            className={`${actived === "pdf" ? "actived" : ""}`}
            onClick={() => handleSetActive("pdf")}>
            <i className="fa-solid fa-chart-simple"></i>
            {!toggle && <span>Product </span>}
          </li>
          {/* <p className="dash-name">Product</p> */}

        </Link>



        <Link to='/enquiry' className="dash">
          <li
            className={`${actived === "enquiry" ? "actived" : ""}`}
            onClick={() => handleSetActive("enquiry")}>
            <i className="fa-solid fa-envelope-open-text"></i>
            {!toggle && <span>Enquiry</span>}
          </li>
          {/* <p className="dash-name">Enquiry</p> */}

        </Link>




      </ul>
    </div>
  );
}

export default SideBar;
