import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom';
import { MDBContainer } from 'mdb-react-ui-kit';
import Navbar2 from '../Components/Layout/Navbar2'
import Footer from '../Components/Layout/Footer'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import '../Styles/main.css'

function Dashboard() {

  const [user, setUser] = useState([])
  const navigate = useNavigate()

  try {

    const fetchData = () => {
      let response: any = fetch("http://localhost:3000/user/", {
        method: "GET",
        credentials: 'include',
        headers: {
        'Content-Type': 'application/json'
        }
      })

        .then(response => {
          if (response.status == 200) {
            return response.json()
          } else {
            navigate("/")
          }
          
        })
        .then(data => {
          setUser(data)
        })
    }

    useEffect(() => {
      document.title = "Dashboard | EZAvailability";
      fetchData()
    }, []);
    
  } catch (err) {
    console.log(err)
  }
  
    
  return (
    <div>
        <body>
            <Navbar2 />

            <MDBContainer className="mt-5">
              <h2>Welcome, </h2>
            </MDBContainer>

            <Footer />
            
        </body>

    </div>


  )
}

export default Dashboard;