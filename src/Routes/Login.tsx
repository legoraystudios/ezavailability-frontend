import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Navbar from '../Components/Layout/Navbar'
import Footer from '../Components/Layout/Footer'
import Alerts from '../Components/Layout/Alerts'
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
        navigate('?invalidcredentials');
      }
    } catch (err) {
      console.log(err)
    }

  }
    
  return (
    <div>
        <body>
            <Navbar />

            <form className="w-25 mx-auto mt-5" onSubmit={handleSubmit}>
            <Alerts />
            <h4 className="text-center">Sign In with your Credentials</h4>
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                <label className="form-check-label" htmlFor="exampleCheck1">Remember Me</label>
              </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>

            <Footer />
            
        </body>

    </div>


  )
}

export default Login;