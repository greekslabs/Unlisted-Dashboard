import React, { useState ,useRef} from 'react'
import './Testimonial.css'
import Swal from 'sweetalert2'

function Testimonial() {

    const [test,setTest]=useState({
        name:"",type:"",description:"",image:""
    })
    
    const [data,setData]=useState([])

    const[img,setImg]=useState("")
    const  buttonRef=useRef(null)


    const handleInputs=(e)=>{
        e.preventDefault()

        const {name,type,description,image}=test
        if(!name || !type || !description || !image){
            Swal.fire("Invalid Inputs")
        }
        else{
            setData([...data,test])
            console.log(data)
        }
        setTest({
            name:"",type:"",description:"",image:""
        })
        if(buttonRef.current){
            buttonRef.current.value=""
        }
        // buttonRef.current.value=''
        setImg('')

        console.log(test)
    }


    const imageData=(e)=>{
        const file = e.target.files[0];
        console.log(file)

        const cr=URL.createObjectURL(file)
        const img=new Image()
        img.src=cr

        setImg(cr)
        if(file){
            const reader = new FileReader();
            reader.readAsDataURL(file); // Convert image to Base64 (binary format)
            reader.onloadend = () => {
                setTest((prevProduct) => ({
                    ...prevProduct,
                    image: reader.result, // Store the binary format
                }));
            }; 

        }

        img.onload = () => {
                         if (img.width !== 1300 && img.height !== 1168) {
                         Swal.fire("Please Check your Image size")
                        setTest({ ...test, image: '' })
                        setImg('')
                       }
                       else {
                         setTest({ ...test, image: file })
                            setImg(cr)
                      }
        
                    }
        
                   
                

    }
    const removeImage=()=>{
        setImg("")
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
   
   <div className="testimonials common">
   <h2 className="title-common">Testimonials</h2>


   <div className="test-inputs">
                    <form>
                        <div className="row">
                            <div class="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label for="FormControlInput1" class="form-label">Name</label>
                                <input type="text" class="form-control" id="FormControlInput1" placeholder="Name"
                                value={test.name}
                                onChange={(e)=>setTest({...test,name:e.target.value})}
                                />
                            </div>


                            <div class="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label for="FormControlInput1" class="form-label">Type</label>
                                <input type="text" class="form-control" id="FormControlInput1" placeholder="Type"
                                value={test.type}
                                onChange={(e)=>setTest({...test,type:e.target.value})}
                                />
                            </div>


                            <div class="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label for="FormControlTextarea1" class="form-label">Description</label>
                                <textarea class="form-control" id="FormControlTextarea1" rows="1"
                                    placeholder="Description"
                                    value={test.description}
                                    onChange={(e)=>setTest({...test,description:e.target.value})}
                                  ></textarea>
                            </div>


                            <div class="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                                <label for="FormControlInput1" class="form-label">Image</label>
                                <input type="file" class="form-control" id="FormControlInput1" placeholder="Image"
                                onChange={imageData}  ref={buttonRef}
                                />
                            </div>


                        </div>

                        {img &&
                           (  <div className='row'>
                            <div className='col-3'>
                                <div className='view-img'>
                                    <i class="fa-solid fa-xmark img-close" onClick={removeImage} ></i>
                                    <img src={img} alt='' />
                                </div>
                            </div>
                        </div>)
                        }


                        <button className="form-btn" type='submit' onClick={handleInputs} >Submit</button>
                    </form>
                </div>


                
                <div className="table-main">
                            <table border="1" className='table-responsive table'>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th> Description</th>
                                        <th>Image</th>
                                        <th>Action</th>
                                        <th></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        data.map((item,index)=>(
                                            <tr >
                                            <td>{item.name}</td>
                                            <td>{item.type}</td>
                                            <td>{item.description}</td>
                                            <td></td>                                         
                                            <td className='details'>
                                                <button onClick={handleDelete} >Delete</button>
                                                <button  data-bs-toggle="modal" data-bs-target="#staticBackdrop">Edit</button>
                                                </td>
                                        </tr> ))
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
      <div class="mb-4  ">
                                <label for="FormControlInput1" class="form-label">Name</label>
                                <input type="text" class="form-control" id="FormControlInput1" placeholder="Name"/>
                            </div>


                            <div class="mb-4 ">
                                <label for="FormControlInput1" class="form-label">Type</label>
                                <input type="text" class="form-control" id="FormControlInput1" placeholder="Type"
                             />
                            </div>


                            <div class="mb-4  ">
                                <label for="FormControlTextarea1" class="form-label">Description</label>
                                <textarea class="form-control" id="FormControlTextarea1" rows="1"
                                    placeholder="Description"
                                  
                                  ></textarea>
                            </div>


                            <div class="mb-4  ">
                                <label for="FormControlInput1" class="form-label">Image</label>
                                <input type="file" class="form-control" id="FormControlInput1" placeholder="Image"
                                />
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

export default Testimonial
