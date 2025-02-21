import React,{useState,useRef} from 'react'
import './Blog.css'
import Swal from 'sweetalert2'

function Blog() {
    const[blog,setBlog]=useState({
        heading:"",content:"",image:""
    })

    const[img,setImg]=useState('')
    const buttonRef=useRef(null)
    


    const[data,setData]=useState([])

     const handleInput=(e)=>{
       e.preventDefault()

       const{heading,content,image}=blog
       if(!heading || !content || !image){
        Swal.fire("Enter Valid Inputs")
       }
       else{
        setData([...data,blog])

       }
       setBlog({
        heading:"",content:"",image:""
    })
    if(buttonRef.current){
        buttonRef.current.value=''

    }
    // buttonRef.current.value=''
    setImg('')

       console.log(blog)
    }

    const handleImage=(e)=>{
        const file=e.target.files[0];
        const cr=URL.createObjectURL(file)
        const img=new Image()
        img.src=cr

         setImg(cr)
        
                if (file) {
        
                    const reader = new FileReader();
                    reader.readAsDataURL(file); // Convert image to Base64 (binary format)
                    reader.onloadend = () => {
                        setBlog((prevProduct) => ({
                            ...prevProduct,
                            image: reader.result, // Store the binary format
                        }));
                    }; 
                    img.onload = () => {
                         if (img.width !== 1300 && img.height !== 1168) {
                         Swal.fire("Please Check your Image size")
                        setBlog({ ...blog, image: '' })
                        setImg('')
                       }
                       else {
                         setBlog({ ...blog, image: file })
                            setImg(cr)
                      }
                    }  
                }
        console.log(file)
    }

    const removeImage=()=>{
        setImg('')
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
            <div className="blog common">
                <h2 className='title-common'>Blog</h2>
                <div className="blog-input">

                    <div className='row'>
                        <div class="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                            <label for="FormControlInput1" class="form-label">Heading</label>
                            <input type="text" class="form-control" id="FormControlInput1" placeholder="Heading"
                            value={blog.heading} onChange={(e)=>setBlog({...blog,heading:e.target.value})}
                            />
                        </div>
                        <div class="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                            <label for="FormControlTextarea1" class="form-label">Content</label>
                            <textarea class="form-control" id="FormControlTextarea1" rows="1" placeholder='Content'
                            value={blog.content} onChange={(e)=>setBlog({...blog,content:e.target.value})}
                            ></textarea>
                        </div>

                        <div class="mb-4 col-md-4 col-sm-6 col-xs-6 ">
                            <label for="FormControlInput2" class="form-label">Image</label>
                            <input type="file" class="form-control" id="FormControlInput2" placeholder=""
                            onChange={handleImage}  ref={buttonRef}
                            
                            />
                        </div>
                    </div>

                    {
                        img && (
                            <div className="row">
                                <div className="col-3">
                                <div className='view-img'>
                                        <i class="fa-solid fa-xmark img-close" onClick={removeImage} ></i>
                                        <img src={img} alt='' />
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    <button className="form-btn" type='submit' onClick={handleInput} >Submit</button>
                </div>



                <div className="table-main">
                    <table border="1" className='table-responsive table'>
                        <thead>
                            <tr>
                                <th>Heading</th>
                                <th>Content</th>
                                <th>Image</th>
                                <th>Action</th>
                                <th></th>


                            </tr>
                        </thead>
                        {data.map((item,index)=>(
                            
                            <tr key={index}>
                            <td>{item.heading}</td>
                            <td>{item.content}</td>
                            <td></td>
                            <td className='details'>
                                <button onClick={handleDelete} >Delete</button>
                                <button data-bs-toggle="modal" data-bs-target="#staticBackdrop" >Edit</button>
                            </td>

                        </tr>

                        ))}
                        
                        


                        <tbody>


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
      <div class="mb-4 ">
                            <label for="FormControlInput1" class="form-label">Heading</label>
                            <input type="text" class="form-control" id="FormControlInput1" placeholder="Heading"
                            />
                        </div>
                        <div class="mb-4  ">
                            <label for="FormControlTextarea1" class="form-label">Content</label>
                            <textarea class="form-control" id="FormControlTextarea1" rows="1" placeholder='Content'
                            ></textarea>
                        </div>

                        <div class="mb-4 ">
                            <label for="FormControlInput2" class="form-label">Image</label>
                            <input type="file" class="form-control" id="FormControlInput2" placeholder=""
                            
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

export default Blog
