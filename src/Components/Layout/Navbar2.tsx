import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Logo from '../../Images/logo2.png'

interface UserProperties {
  id: number
  first_name: string
  email: string
}

function Navbar2() {

  const [user, setUser] = useState<UserProperties[]>([])
  const navigate = useNavigate()


  const signOut = async (event: any) => {
    event.preventDefault()

    try {
      let signOutResponse = await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        credentials: 'include',
        headers: {
        'Content-Type': 'application/json'
        }
      })

      if (signOutResponse.status === 200) {
        navigate('/?signout')
      }

    } catch (err) {
      console.log(err)
    }

  }

    const fetchData = () => {
      try {
        fetch("http://localhost:3000/user/", {
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

      } catch (err) {
        console.log(err)
      }
        
    }

    useEffect(() => {
      document.title = "Dashboard | EZAvailability";
      fetchData()
    }, []);


  return (
    <div>
        <nav className="navbar nav">
          <div className="container">
            <a className="navbar-brand text-white fs-5 d-flex justify-content-start" href="#">
              <img src={Logo} height='80' alt='' loading='lazy'
              /> EZAvailability
            </a>
            <li className="nav-item list-inline dropdown d-flex justify-content-end">
              <a className="nav-link dropdown-toggle text-white" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="bi bi-person-fill"></i> Signed in,                   
                  {
                    user && user.map( record => {
                      return(
                        <a> {record.first_name}</a>
                      )
                    })
                  }
              </a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item text-danger" href="/dashboard/admin"><i className="bi bi-shield-lock"></i> Admin Dashboard</a></li>
                <li><a className="dropdown-item" href="#"><i className="bi bi-gear"></i> Account Settings</a></li>
                <li><a onClick={signOut} className="dropdown-item" href="#"><i className="bi bi-box-arrow-left"></i> Sign Out</a></li>
              </ul>
            </li>
          </div>
        </nav>

    </div>


  )
}

export default Navbar2