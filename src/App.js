import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./Components/Auth";
import Navbar from "./Components/Navbar/Navbar";
import SideBar from "./Components/Sidebar/SideBar";

// Lazy Load Components
const Login = lazy(() => import("./Components/Login/Login"));
const Dash = lazy(() => import("./Components/Dashboard/Dash"));
const Offer = lazy(() => import("./Components/OfferCarousal/Offer"));
const Category = lazy(() => import("./Components/Category/Category"));
const Blog = lazy(() => import("./Components/Blogs/Blog"));
const Testimonial = lazy(() => import("./Components/Testimonials/Testimonial"));
const Spl = lazy(() => import("./Components/Specialities/Spl"));
const Fundamentals = lazy(() => import("./Components/Fundamentals/Fundamentals"));
const Portfolio = lazy(() => import("./Components/Portfolio/Portfolio"));
const Faq = lazy(() => import("./Components/FAQ/Faq"));
const Propdf = lazy(() => import("./Components/ProPdf/Propdf"));
const Enquiry = lazy(() => import("./Components/Enquiries/Enquiry"));
const Unlist = lazy(() => import("./Components/AddUnlisted/Unlist"));
const Bond = lazy(() => import("./Components/AddBond/Bond"));
const ProDetails = lazy(() => import("./Components/productDetails/ProDetails"));


function App() {
  // const [access, setAccess] = useState('');
  const { isAuthenticated } = useAuth();
  





  useEffect(() => {
    // const token = localStorage.getItem('token');
    // console.log(token)
    // setAccess(token);
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
          <Suspense fallback={<div>Loading...</div>}>
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
            </Suspense>
          </div>
      </div>
   
);
}


export default App;