import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { MDBContainer } from 'mdb-react-ui-kit';
import Navbar2 from '../Components/Layout/Navbar2'
import Footer from '../Components/Layout/Footer'
import Alerts from '../Components/Layout/Alerts'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import '../Styles/main.css'

  interface UserProperties {
    id: number
    first_name: string
  }


function Admin() {

  const [user, setUser] = useState<UserProperties[]>([])
  const navigate = useNavigate()

  try {

    const fetchData = () => {
      fetch("http://localhost:3000/user/", {
        method: "GET",
        credentials: 'include',
        headers: {
        'Content-Type': 'application/json'
        }
      })

        .then(userResponse => {
          if (userResponse.status == 200) {
            return userResponse.json()
          } else {
            navigate("/")
          }
          
        })
        .then(data => {
          setUser(data)
        })
        
      }

    useEffect(() => {
      document.title = "Admin Dashboard | EZAvailability";
      fetchData()
    }, []);
    
  } catch (err) {
    console.log(err)
  }
  
    
  return (
    <div>
        <body>
            <Navbar2 />
              <div className="container mt-5">
                <Alerts />
                  <a href="/dashboard"><i className="bi bi-arrow-90deg-up"></i> Dashboard</a>
                  <h3>Admin Dashboard</h3>
              </div>
        </body>
        <Footer />
    </div>


  )
}

export default Admin;