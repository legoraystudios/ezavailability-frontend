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


function Dashboard() {

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



            <div className="container mt-5">
            <Alerts />
              {
                user && user.map( record => {
                  return(
                    <h3 key={record.id}>Hey, {record.first_name}</h3>
                  )
                })
              }
              <p>Welcome to your Dashboard!</p>
            </div>

            <div className="container d-flex justify-content-center">
              <div className="card bg-cards flex-grow-1 text-center" style={{width: "18rem"}}>
                  <a href="" className="card-body border border-secondary-subtle">
                    <h3><i className="bi bi-upc-scan"></i> Scan In</h3>
                    <p className="card-text">Add existing items to inventory.</p>
                  </a>
                  <a href="" className="card-body border border-secondary-subtle">
                    <h3><i className="bi bi-upc-scan"></i> Scan Out</h3>
                    <p className="card-text">Remove existing items to inventory.</p>
                  </a>
                  <a href="" className="card-body border border-secondary-subtle">
                    <h3><i className="bi bi-search"></i> Manage Inventory</h3>
                    <p className="card-text">Lookup item/Add new item to inventory.</p>
                  </a>
                  <a href="" className="card-body border border-secondary-subtle">
                    <h3><i className="bi bi-cart"></i> Virtual Shooping List</h3>
                    <p className="card-text">Lookup item/Add new item to inventory.</p>
                  </a>
              </div>
            </div>
            
        </body>
        <Footer />
    </div>


  )
}

export default Dashboard;