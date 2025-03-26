import React, { useState, useEffect } from 'react'
import './Login.css'
import {  useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../Auth';


function Login() {


    const [loginData, setLoginData] = useState({
        username: "", password: ""
    })

    const nav = useNavigate()

    const [showPassword, setShowPassword] = useState(false)
    const [isAuthenticated] = useState(false)
    const { login } = useAuth()

    // useEffect(() => {
    //     const token = localStorage.getItem('token');
    //     if (token) {
    //         nav('/dashboard');
    //     }
    // }, []);

    useEffect(()=>{
        if(isAuthenticated){
            nav('/dahsboard')
        }
        

    },[])


   


    const loginSubmit = async () => {
        if (!loginData.username || !loginData.password) {
            alert({title:'Please enter your username and password.',
                icon:'warning',
                timer:3000
            });
            return;
        }
        try {
            const response = await axios.post('http://127.0.0.1:8002/api/v1/accounts/vitta/login/', {
                username: loginData.username,
                password: loginData.password
            });
            // console.log('Login Success:', response);
            if (response.data.message === "Login successful.") {
                localStorage.setItem('token', response.data.token);
                // console.log(response)
                login()
                //   window.location.href='/dashboard'
                nav('/dashboard')
                // alert('Login Successful!');
                Swal.fire({
                    title:"Login SuccessFull",
                    icon:"success",
                    timer:3000,
                    position:'top-end',
                    showConfirmButton:false,
                    toast:true})
            }
        } catch (error) {
            console.error('Login Error:', error.response?.data || error.message);
            alert(error.response?.data?.message || 'Login failed. Please try again.');
        }
    };





    return (
        <>
            <div className="main-login">
                <div className="left-login">
                    <h1><br />Vitta Money Admin Panel</h1>
                    <img src="/assets/Vitta Money-01.png" className="left-login-img" alt="Vittafin Logo" />
                </div>

                <div className="right-login">
                    <div className="card-login">
                        <h1>Login</h1>
                        <div className="textfield">
                            <label >User</label>
                            <input type="text" name="user" placeholder="User" onChange={(e) => setLoginData({ ...loginData, username: e.target.value })} />
                        </div>

                        <div className="textfield">
                            <label >Password</label>
                            <div className='input-container'>
                                <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
                                <i className="fa-solid fa-eye " onClick={() => setShowPassword(!showPassword)} ></i>
                            </div>
                        </div>

                        <button className="btn-login" onClick={loginSubmit}>Login</button>
                    </div>
                </div>
            </div>


        </>
    )
}

export default Login
