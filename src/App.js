import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login/Login';
import Dash from './Components/Dashboard/Dash';
import Navbar from './Components/Navbar/Navbar';
import SideBar from './Components/Sidebar/SideBar';
import Offer from './Components/OfferCarousal/Offer';
import Product from './Components/AddProducts/Product';
import Category from './Components/Category/Category';
import Blog from './Components/Blogs/Blog';
import Testimonial from './Components/Testimonials/Testimonial';
import Spl from './Components/Specialities/Spl';
import Fundamentals from './Components/Fundamentals/Fundamentals';
import Portfolio from './Components/Portfolio/Portfolio';
// import Bond from './Components/Bond/Bond';
import Faq from './Components/FAQ/Faq';
// import Mapro from './Components/MapProduct/Mapro';
import Propdf from './Components/ProPdf/Propdf';
import Enquiry from './Components/Enquiries/Enquiry';
// import ProDetail from './Components/productDetails/ProUnlisted';
import Unlist from './Components/AddUnlisted/Unlist';
import Bond from './Components/AddBond/Bond';
import ProDetails from './Components/productDetails/ProDetails';
import { useAuth } from './Components/Auth';


function App() {
  const [access, setAccess] = useState('');
  const { isAuthenticated ,logout } = useAuth();
  





  useEffect(() => {
    const token = localStorage.getItem('token');
    // console.log(token)
    setAccess(token);
  }, []);

  return (
    
      <div>
        
        {isAuthenticated && <Navbar />}
          {isAuthenticated && (
                    <div className="layout">

            <div className="sidebar">
              <SideBar />
            </div>
            </div>

          )}
          <div className="component">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={<Dash />} />
              <Route path="/offer" element={<Offer />} />
              {/* <Route path='/product' element={<Product/>}/> */}
              {/* <Route path='/prodetail' element={<ProDetail/>}/> */}
              <Route path='/category' element={<Category/>}/>
              <Route path='/blog' element={<Blog/>}/>
              <Route path='/testimonial' element={<Testimonial/>}/>
              <Route path='/specialities' element={<Spl/>}/>
              <Route path='/fundamentals' element={<Fundamentals/>}/>
              <Route path='/portfolio' element={<Portfolio/>}/>
              {/* <Route path='/bond' element={<Bond/>}/> */}
              <Route path='/faq' element={<Faq/>}/>
              {/* <Route path='/promap' element={<Mapro/>}/> */}
              <Route path='/pdf' element={<Propdf/>}/>
              <Route path='/enquiry' element={<Enquiry/>}/>
              <Route path='/unlisted' element={<Unlist/>}/>
              <Route path='/bond' element={<Bond/>}/>
              <Route path='/prodetail' element={<ProDetails/>}/>

            </Routes>
          </div>
      </div>
   
);
}


export default App;