import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Logo from '../../Images/logo2.png'

interface UserProperties {
  id: number
  first_name: string
  last_name: string
  email: string
  role_id: number
}

function Navbar2() {

  const [user, setUser] = useState<UserProperties[]>([]);
  const navigate = useNavigate();

  const [id, setId] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState(0);

  const signOut = async (event: any) => {
    event.preventDefault()

    try {
      let signOutResponse = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/auth/logout`, {
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

  const adminBtn = () => {

    const getRole = user && user.map( record => {
      return record.role_id
    })

    const role:number = Number(getRole)
    const basename = process.env.REACT_APP_BASENAME;

    if (role > 0) {
      return(
        <li><a className="dropdown-item text-danger" href={`${process.env.REACT_APP_BASENAME}/dashboard/admin`}><i className="bi bi-shield-lock"></i> Admin Dashboard</a></li>
      )
    }

  }

  const roleBadge = () => {
    const getRole = user && user.map( record => {
      return record.role_id
    })

    const role:number = Number(getRole)

    if (role === 0) {
      return (
        <span className="badge text-bg-primary text-white">Simple User</span>
      )
    } else if (role === 1) {
      return (
        <span className="badge text-bg-danger text-white">Administrator</span>
      )
    } else if (role === 2) {
      return (
        <span className="badge text-bg-danger text-white">Super Administrator</span>
      )
    }
  }
  
  const editAccount = async (event: any) => {

    event.preventDefault();
    
    const payload = { id: id, firstName: firstName, lastName: lastName, email: email, roleId: roleId };

    try {
      await fetch(`${process.env.REACT_APP_BACKEND_HOST}/user/edit`, {
       method: "PUT",
        credentials: 'include',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      .then(async response => {
        const res = await response.json() as {
          errors: {
            errCode: string,
          }
      };

      if (response.status === 200) {
        navigate("/dashboard?accountedited");
        window.location.reload();
      } else if (res.errors.errCode === "Reg03") {
        navigate("/dashboard?createaccounterr03");
        window.location.reload();
      } else {
        navigate("/dashboard?editaccounterr");
        window.location.reload();
      }
      
      })

    } catch (err) {
      console.log(err);
    }

  }

  async function requestPasswordReset() {

    const payload = { email: email };

    try {
        let response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/auth/forgotpasswd`, {
          method: "POST",
          credentials: 'include',
          headers: {
          'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
        
        if (response.status === 200) {
          navigate('/dashboard?forgotpasswdsuccess');
        } else {
          navigate('/dashboard?emailnotfound');
        }
      } catch (err) {
        console.log(err)
      }

  }

    const fetchData = () => {
      try {
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
        })

      } catch (err) {
        console.log(err)
      }
        
    }

    useEffect(() => {
      fetchData()
      // eslint-disable-next-line
    }, []);


  return (
    <div>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <nav className="navbar nav">
          <div className="container">
            <a className="navbar-brand text-white fs-5 d-flex justify-content-start" href="/#">
              <img src={Logo} height='80' alt='' loading='lazy'
              /> EZAvailability
            </a>
            <li className="nav-item list-inline dropdown d-flex justify-content-end">
              <a className="nav-link dropdown-toggle text-white" href="/#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="bi bi-person-fill"></i> Signed in,                   
                  {
                    user && user.map( record => {
                      return(
                        <a href="#/" className="text-white"> {record.first_name}</a>
                      )
                    })
                  }
              </a>
            {
              user && user.map( record => {
                return(
              <ul className="dropdown-menu">
                {
                  adminBtn()
                }
                <li>
                  <a className="dropdown-item" data-bs-toggle="modal" data-bs-target="#accountSettings" onClick={
                                                  () => {
                                                    setId(Number(record.id))
                                                    setFirstName(record.first_name)
                                                    setLastName(record.last_name)
                                                    setEmail(record.email)
                                                    setRoleId(Number(record.role_id))
                                                  }}>
                                                  <i className="bi bi-gear"></i> Account Settings</a>
                </li>
                <li><a onClick={signOut} className="dropdown-item" href="/#"><i className="bi bi-box-arrow-left"></i> Sign Out</a></li>
              </ul>
                )
              })
            }
            </li>
          </div>
        </nav>

        {/* Edit Account Modal */}
        <div className="modal fade" id="accountSettings" tabIndex={-1} aria-labelledby="accountSettings" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Account Settings</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
              <form className="row g-3" onSubmit={editAccount}>
                <div className="col-md-12">
                  <input type="text" style={{display: 'none'}} className="form-control" id="id" placeholder=""/>
                </div>
                <div className="col-6">
                  <label className="form-label">First Name</label>
                  <input type="text" className="form-control" id="firstName" placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="col-6">
                  <label className="form-label">Last Name</label>
                  <input type="text" className="form-control" id="lastName" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label htmlFor="inputEmail4" className="form-label">Email</label>
                  <input type="email" className="form-control" id="email" placeholder="someone@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label htmlFor="inputState" className="form-label">Password</label><br />
                  <i>******** <a href="" onClick={requestPasswordReset}>Change?</a></i>
                </div>
                <div className="col-md-12">
                  <label htmlFor="inputState" className="form-label">Role</label> <br />
                  {
                    roleBadge()
                  }
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Save changes</button>
                </div>
              </form>
              </div>
            </div>
          </div>
        </div>

    </div>


  )
}

export default Navbar2