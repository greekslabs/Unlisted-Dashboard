import React, { useState } from 'react'
import './Login.css'
import { useNavigate } from 'react-router-dom';


function Login() {

    const [access,setaccess] = useState('dshgdsfdghdfhgswdfhgsfdghs')
    const [loginData,setLoginData]=useState({
        user:"",password:""

    })
    
    const nav=useNavigate()

    const loginSubmit=()=>{


        sessionStorage.setItem('token',access)
        console.log(JSON.stringify(loginData))
        nav('/dashboard')
        window.location.href='/dashboard'
        
    }
  return (
   <>
    <div class="main-login">
        <div class="left-login">
            <h1>Login<br/>And join our team</h1>
            <img src="https://i.postimg.cc/YC13sX2Z/Astronaut-cuate.png" class="left-login-img" alt="astronaut image"/>
        </div>

        <div class="right-login">
            <div class="card-login">
                <h1>Login</h1>
                <div class="textfield">
                    <label for="user">User</label>
                    <input type="text" name="user" placeholder="User" onChange={(e)=>setLoginData({...loginData,user:e.target.value})}/>
                </div>

                <div class="textfield">
                    <label for="password">Password</label>
                    <input type="password" name="password" placeholder="Password" onChange={(e)=>setLoginData({...loginData,password:e.target.value})}/>
                </div>

                <button class="btn-login" onClick={loginSubmit}>Login</button>
            </div>
        </div>
    </div>
   
   
   </>
  )
}

export default Login
