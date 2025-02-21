import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login/Login';
import Dash from './Components/Dashboard/Dash';
import Navbar from './Components/Navbar/Navbar';
import SideBar from './Components/Sidebar/SideBar';
import Offer from './Components/OfferCarousal/Offer';
import Product from './Components/ProductDetails/Product';
import Category from './Components/Category/Category';
import Blog from './Components/Blogs/Blog';
import Testimonial from './Components/Testimonials/Testimonial';
import Spl from './Components/Specialities/Spl';
import Fundamentals from './Components/Fundamentals/Fundamentals';
import Portfolio from './Components/Portfolio/Portfolio';
import Bond from './Components/Bond/Bond';
import Faq from './Components/FAQ/Faq';
import Mapro from './Components/MapProduct/Mapro';
import Propdf from './Components/ProPdf/Propdf';
import Enquiry from './Components/Enquiries/Enquiry';

function App() {
  const [access, setAccess] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    setAccess(token);
  }, []);

  return (
    <Router>
      <div>
        
        {access && <Navbar />}
          {access && (
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
              <Route path='/product' element={<Product/>}/>
              <Route path='/category' element={<Category/>}/>
              <Route path='/blog' element={<Blog/>}/>
              <Route path='/testimonial' element={<Testimonial/>}/>
              <Route path='/specialities' element={<Spl/>}/>
              <Route path='/fundamentals' element={<Fundamentals/>}/>
              <Route path='/portfolio' element={<Portfolio/>}/>
              <Route path='/bond' element={<Bond/>}/>
              <Route path='/faq' element={<Faq/>}/>
              <Route path='/promap' element={<Mapro/>}/>
              <Route path='/pdf' element={<Propdf/>}/>
              <Route path='/enquiry' element={<Enquiry/>}/>

            </Routes>
          </div>
      </div>
    </Router>
);
}


export default App;