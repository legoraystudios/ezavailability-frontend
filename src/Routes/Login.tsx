import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom';
import { MDBInput, MDBRow, MDBCol, MDBBtn, MDBContainer } from 'mdb-react-ui-kit';
import Navbar from '../Components/Layout/Navbar'
import Footer from '../Components/Layout/Footer'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import '../Styles/main.css'

function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    document.title = "Login | EZAvailability";
  }, []);


  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const payload = {email: email, password: password}

    try {
      let response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        credentials: 'include',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      
      if (response.status === 200) {
        navigate('/dashboard');
      } else {
        alert("Error")
      }
    } catch (err) {
      console.log(err)
    }

  }
    
  return (
    <div>
        <body>
            <Navbar />

            <MDBContainer className="w-25 mx-auto mt-5">
                <h3 className="text-center mb-5">Sign in with your credentials</h3>
                <form onSubmit={handleSubmit}>
                    <MDBInput className='mb-4' value={email} onChange={(e) => setEmail(e.target.value)} type='email' id='form1Example1' label='Email address' />
                    <MDBInput className='mb-4' value={password} onChange={(e) => setPassword(e.target.value)} type='password' id='form1Example2' label='Password' />

                    <MDBRow className='mb-4'>
                        <MDBCol className="text-center">
                            <a href='#!'>Forgot password?</a>
                        </MDBCol>
                    </MDBRow>

                    <MDBBtn type='submit' block>
                     Sign in
                    </MDBBtn>
                </form>
            </MDBContainer>

            <Footer />
            
        </body>

    </div>


  )
}

export default Login;