import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar2 from '../Components/Layout/Navbar2'
import Footer from '../Components/Layout/Footer'
import Alerts from '../Components/Layout/Alerts'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import '../Styles/main.css'

interface UserProperties {
  id: number
  first_name: string
  role_id: number
  }


function Admin() {

  const [user, setUser] = useState<UserProperties[]>([])
  var role: any = 0;
  const navigate = useNavigate()

  try {

    const fetchData = () => {
      fetch(`${process.env.REACT_APP_BACKEND_HOST}/auth/token/`, {
        method: "POST",
        credentials: 'include',
        headers: {
        'Content-Type': 'application/json'
        }
      })

        .then(response => {
          if (response.status === 200) {
            return response.json()
          } else {
            navigate("/?timeout")
          }
          
        })
        .then(data => {
          setUser(data)
          
          if(data[0].role_id === 0) {
            navigate("/dashboard?invalidperms")
          }

        })
        
      }

      useEffect(() => {
        document.title = "Admin Dashboard | EZAvailability";
        fetchData();
        // eslint-disable-next-line
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