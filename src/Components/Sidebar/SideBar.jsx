import React, { useState } from "react";
import "./SideBar.css";
import { Link } from "react-router-dom";

function SideBar() {
  const [toggle, setToggle] = useState(false);
  // const [access,setaccess]=useState('')

  const togglebar = () => {
    setToggle(!toggle);
  };

  // useEffect(()=>{
  //       const token = sessionStorage.getItem('token')
  //       setaccess(token)
  // },[])

  return (
    <div className={`side-bar ${toggle ? "toggled" : ""}`}>
      <button className="toggle-btn" onClick={togglebar}>
        <i className="fa-solid fa-bars cross"></i>
        <i className="fa-solid fa-times bars"></i>

      </button>

      <ul className="sidebar-list">
          <Link to='/dashboard' className="dash" >
          <li>
            <i className="fa-solid fa-chart-bar dash"></i>
          {!toggle && <span>Dashboard</span>}
          </li>
          </Link>

          <Link to='/offer' className="dash">
          <li>
            <i className="fa-regular fa-envelope"></i>
          {!toggle && <span>OfferCarousal</span>}
          </li>
          </Link>

          <Link to='/product' className="dash">
          <li>
            <i class="fa-solid fa-wallet"></i>
          {!toggle && <span>Product details</span>}
          </li>
          </Link>


          <Link to='/category' className="dash">
          <li>
            <i class="fa-solid fa-layer-group"></i>
          {!toggle && <span>Category</span>}
          </li>
          </Link>


          <Link to='/blog' className="dash">
          <li>
            <i class="fa-solid fa-blog"></i>
          {!toggle && <span>Blog</span>}
          </li>
          </Link>


          <Link to='/testimonial' className="dash">
          <li>
            <i class="fa-solid fa-comment-dots"></i>
          {!toggle && <span>Testimonials</span>}
          </li>

          </Link>

          <Link to='/specialities' className="dash">
          <li>
            <i class="fa-solid fa-star"></i>
          {!toggle && <span>Specialities</span>}
          </li>
          </Link>


          <Link to='/fundamentals' className="dash">
          <li>
            <i class="fas fa-lightbulb"></i>
          {!toggle && <span>Fundamentals</span>}
          </li>

          </Link>


          <Link to='/portfolio' className="dash">
          <li>
            <i className="fa-solid fa-briefcase"></i>
          {!toggle && <span >Portfolio</span> }
          </li>
          </Link>

          <Link to='/bond' className="dash">
          <li>
          <i class="fa-solid fa-handshake"></i>
          {!toggle && <span>Bond</span> }
          </li>
          </Link>


          <Link to='/faq' className="dash">
          <li>
          <i className="fa-solid fa-circle-question"></i>
          {!toggle && <span>FAQ</span>}
          </li>
          </Link>

          <Link to='/promap' className="dash">
          <li>
          <i className="fa-solid fa-map"></i>
          {!toggle && <span>Map Product</span>}
          </li>
          </Link>

        
          <Link to='/pdf' className="dash">
          <li>
          <i class="fa-brands fa-product-hunt"></i>
          {!toggle && <span>Product </span> }
          </li>
          </Link>
        

          
          <Link to='/enquiry' className="dash">
          <li>
          <i class="fa-solid fa-envelope-open-text"></i>
          {!toggle && <span>Enquiry</span> }
          </li>
          </Link>
        

    

      </ul>
    </div>
  );
}

export default SideBar;
