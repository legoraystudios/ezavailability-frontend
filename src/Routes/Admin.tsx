import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
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

interface AccountProperties {
  id: number
  first_name: string
  last_name: string
  email: string
  role_id: number
  role_title: string
}


function Admin(): JSX.Element {

  // Variables for Create and Edit Accounts
  const [id, setId] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(0);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  // Variables for fetchData()
  const [user, setUser] = useState<UserProperties[]>([]);
  const loggedUser = user.map((record) => record.id);

  // Variables for listAccounts()
  const [isLoaded, setIsLoaded] = useState(false);
  const [accounts, setAccounts] = useState<AccountProperties[]>([]);
  const [page, setPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(1);

  // Variables for Pagination Settings
  const [pageNumberLimit, setPageNumberLimit] = useState(5);
  const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(5);
  const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);
  var pageDotIncrement = null;
  var pageDotDecrement = null;

  const totalPages = Math.ceil(totalItems / limitPerPage);

  // Variables for tabls
  const [searchUrlParams, setSearchUrlParams] = useSearchParams();

  const navigate = useNavigate();

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
            
            if(data[0].role_id === 0) {
              navigate("/dashboard?invalidperms")
            }
  
          })

        } catch (err) {
          console.log(err);
        }
        
      }

    const listAccounts = async () => {

      try {

        setIsLoaded(false)

        const accountPageResponse = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/user`, {
          method: "GET",
          credentials: 'include',
          headers: {
          'Content-Type': 'application/json'
          }
        })

        const accountResponse = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/user?page=${page}&limitPerPage=${limitPerPage}`, {
          method: "GET",
          credentials: 'include',
          headers: {
          'Content-Type': 'application/json'
          }
        })

        const accountResult = await accountResponse.json()
        setAccounts(accountResult)

        const accountPageResult = await accountPageResponse.json()
        setTotalItems(accountPageResult.length)

        setIsLoaded(true)

      } catch (err) {
        console.log(err)
      }
          
      }

    const renderPageNumbers = () => {

      try {

        const listItems: any[] = [];

        for (let i = 1; i <= totalPages; i++) {
          if(i < maxPageNumberLimit + 1 && i > minPageNumberLimit) {
            listItems.push(<li key={i} className={`page-item ${page === i ? 'active' : ''}`}><a className="page-link" onClick={() => setPage(i)}>{i}</a></li>)
          }
        }

        return listItems;

      } catch (err) {
          console.log(err)  
      }

      }

    useEffect(() => {
      document.title = "Admin Dashboard | EZAvailability";
      fetchData();
      listAccounts();
      // eslint-disable-next-line
    }, [page, limitPerPage]);


    const deleteAccount = async (id: any) => {

      try {

        await fetch(`${process.env.REACT_APP_BACKEND_HOST}/user/${id}`, {
          method:  "DELETE",
          credentials: "include",
          headers: {
            'Content-Type': 'application/json'
          }
        }) 

        .then(response => {
          if (response.status === 200) {
            navigate("/dashboard/admin/?accounts&accountdeleted")
            listAccounts()
          } else {
            navigate("/dashboardadmin/?accounts&error")
          }
        })

      } catch (err) {
        console.log(err)
      }

    }

    const createAccount = async (event: any) => {

      event.preventDefault();

      try {

        const payload = {firstName: firstName, lastName: lastName, email: email, password: password,
        confirmPassword: confirmPassword, roleId: role}

        await fetch(`${process.env.REACT_APP_BACKEND_HOST}/auth/register`, {
          method:  "POST",
          credentials: "include",
          headers: {
            'Content-Type': 'application/json'
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
            navigate("/dashboard/admin/?accounts&accountcreated")
            listAccounts()
          } else if (res.errors.errCode === "Reg01") {
            navigate("/dashboard/admin/?accounts&createaccounterr01")
          } else if (res.errors.errCode === "Reg02") {
            navigate("/dashboard/admin/?accounts&createaccounterr02")
          } else if (res.errors.errCode === "Reg03") {
            navigate("/dashboard/admin/?accounts&createaccounterr03")
          } else {
            navigate("/dashboard/admin/?accounts&createaccounterr")
          }
        })

      } catch (err) {
        console.log(err)
      }

    }

    const editAccount = async (event: any) => {

      event.preventDefault();

      try {

        const payload = {id: id, firstName: firstName, lastName: lastName, email: email,
        confirmPassword: confirmPassword, roleId: role}

        await fetch(`${process.env.REACT_APP_BACKEND_HOST}/user/edit`, {
          method:  "PUT",
          credentials: "include",
          headers: {
            'Content-Type': 'application/json'
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
            navigate("/dashboard/admin/?accounts&accountedited")
            listAccounts()
          } else if (res.errors.errCode === "Reg02") {
            navigate("/dashboard/admin/?accounts&createaccounterr02")
          } else if (res.errors.errCode === "Reg03") {
            navigate("/dashboard/admin/?accounts&createaccounterr03")
          }
        })

      } catch (err) {
        console.log(err)
      }

    }

  if(searchUrlParams.get("accounts") !== null) {

    const nextPage = () => {
      setPage(page + 1);

      if (page + 1 > maxPageNumberLimit) {
        setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
        setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit);
      }

    }

    const prevPage = () => {
      setPage(page - 1);

      if ((page - 1) % pageNumberLimit == 0) {
        setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
        setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit);
      }
    }

    if(totalPages > maxPageNumberLimit) {
      pageDotIncrement = <li className="page-item"><button className="page-link" onClick={nextPage}>&hellip;</button></li>;
    }

    if(minPageNumberLimit) {
      pageDotDecrement = <li className="page-item"><button className="page-link" disabled={page === 1} onClick={prevPage}>&hellip;</button></li>;
    }

    return(
  <div>
      <body>
          <Navbar2 />
            <div className="container mt-5">
              <Alerts />
                <a href="/dashboard"><i className="bi bi-arrow-90deg-up"></i> Dashboard</a>
                <h3>Admin Dashboard</h3>
            </div>



          <div className="container mt-5">

            <ul className="nav nav-tabs bg-white">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="?accounts">Accounts</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="?scans">Scan History</a>
                </li>
              </ul>

          <div className="mx-2 my-2">
            <form className="d-inline-flex float-start " role="search">
              <select id="inputState" className="form-select w-50">
                  <option value="0">Search By...</option>
                  <option value="1">ID</option>
                  <option value="2">First Name</option>
                  <option value="2">Last Name</option>
                  <option value="2">Email</option>
              </select>
              <input className="form-control me-2 w-25" type="search" placeholder="Search" aria-label="Search" />
              <button className="btn btn-primary" type="submit">Search</button>
            </form>

            <button type="button" className="btn btn-success float-md-end" data-bs-toggle="modal" data-bs-target="#createAccount"><i className="bi bi-person-plus-fill fs-6"></i> Create Account</button>

          </div>

              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">First Name</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Role</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    isLoaded ? (
                      <>

                    {
                      accounts.map( record => {
                        return(
                          <tr>
                            <th key={record.id} scope="row">{record.id}</th>
                            <td key={record.id}>{record.first_name}</td>
                            <td key={record.id}>{record.last_name}</td>
                            <td key={record.id}>{record.email}</td>
                            <td key={record.id}>{record.role_title}</td>
                            <td key={record.id}>
                              <button type="button" className="btn btn-primary" data-bs-toggle="modal"
                              data-bs-target={`#editAcct-${record.id}`} onClick={
                                () => {
                                  setId(Number(record.id))
                                  setFirstName(record.first_name)
                                  setLastName(record.last_name)
                                  setEmail(record.email)
                                  setRole(record.role_id)
                                }
                              }>
                                <i className="bi bi-pencil-square fs-6"></i>
                              </button>
                              <button type="button" className="btn btn-danger" data-bs-toggle="modal"
                              data-bs-target={`#delAcct-${record.id}`} disabled={record.id === loggedUser[0] || record.role_id === 2}>
                                <i className="bi bi-trash3 fs-6"></i>
                              </button>
                              <button type="button" className="btn btn-warning">
                                <i className="bi bi-key-fill fs-6"></i>
                              </button>

                            {/* Edit Account Modal */}
                            
                              <div className="modal fade" id={`editAcct-${record.id}`} tabIndex={-1} aria-labelledby={`editAcct-${record.id}`} aria-hidden="true">
                                <div className="modal-dialog">
                                  <div className="modal-content">
                                    <div className="modal-header">
                                      <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Account ({record.id} : {record.email})</h1>
                                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                    <form className="row g-3" onSubmit={editAccount}>
                                      <div className="col-md-12">
                                        <input type="text" style={{display: 'none'}} className="form-control" id="id" value={id} onChange={() => setId(record.id)} placeholder=""/>
                                      </div>
                                      <div className="col-6">
                                        <label className="form-label">First Name</label>
                                        <input type="text" className="form-control" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" />
                                      </div>
                                      <div className="col-6">
                                        <label className="form-label">Last Name</label>
                                        <input type="text" className="form-control" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" />
                                      </div>
                                      <div className="col-md-12">
                                        <label htmlFor="inputEmail4" className="form-label">Email</label>
                                        <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="someone@domain.com"/>
                                      </div>
                                      <div className="col-md-12">
                                        <label htmlFor="inputState" className="form-label">Role</label>
                                        <select id="inputState" className="form-select" disabled={record.role_id > 0} value={role} onChange={(e: any) => setRole(e.target.value)}>
                                          <option value="0" selected={record.role_id === 0}>0 | Simple User</option>
                                          <option value="1" selected={record.role_id === 1}>1 | Administrator</option>
                                          <option value="2" selected={record.role_id === 2} disabled>2 | Super Administrator</option>
                                        </select>
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

                            {/* Delete Account Modal */}


                            <div className="modal fade" id={`delAcct-${record.id}`} tabIndex={-1} aria-labelledby={`delAcct-${record.id}`} aria-hidden="true">
                                <div className="modal-dialog">
                                  <div className="modal-content">
                                    <div className="modal-header">
                                      <h1 className="modal-title fs-5" id="exampleModalLabel">Delete Account ({record.id} : {record.email})</h1>
                                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                      <p>Are you sure you want to delete {record.first_name} ({record.email}) account? THIS ACTION CANNOT BE UNDONE!</p>
                                    </div>
                                      <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                        <button type="submit" className="btn btn-danger" onClick={() => deleteAccount(record.id)} data-bs-dismiss="modal">Delete Account</button>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                            </td>
                          </tr>

                        )
                      })
                    }
                      </>
                    ) : (
                    <tr>
                      <td className="text-center align-middle">
                        <div className="spinner-grow" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </td>
                    </tr>

                    )}

                </tbody>
            </table>
              <nav aria-label="...">
                <ul className="pagination justify-content-center">
                  <li className="page-item">
                    <button className="page-link" disabled={page === 1} onClick={prevPage}>Previous</button>
                  </li>
                    {pageDotDecrement}
                    {renderPageNumbers()}
                    {pageDotIncrement}
                  <li className="page-item">
                    <button className="page-link" disabled={page === totalPages} onClick={nextPage}>Next</button>
                  </li>
                </ul>
              </nav>
          </div>

          { /* Create Account Modal */ }
          <div className="modal fade" id="createAccount" tabIndex={-1} aria-labelledby="createAccount" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">Create Account</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                <form className="row g-3" onSubmit={createAccount}>
                  <div className="col-6">
                    <label className="form-label">First Name</label>
                    <input type="text" className="form-control" id="firstName" placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Last Name</label>
                    <input type="text" className="form-control" id="lastName" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                  <div className="col-md-12">
                    <label htmlFor="inputEmail4" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" placeholder="someone@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" id="firstName" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="lastName" placeholder="********" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </div>
                  <div className="col-md-12">
                    <label htmlFor="inputState" className="form-label">Role</label>
                    <select id="inputState" className="form-select" value={role} onChange={(e: any) => setRole(e.target.value)}>
                      <option>Choose Role...</option>
                      <option value="0">0 | Simple User</option>
                      <option value="1">1 | Administrator</option>
                    </select>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" className="btn btn-success" data-bs-dismiss="modal">Create Account</button>
                  </div>
                </form>
                </div>
              </div>
            </div>
          </div>

      </body>
      <Footer />
  </div>
    )
  } else if(searchUrlParams.get("scans") !== null) {
    return (
      <div>
        <body>
          <Navbar2 />
            <div className="container mt-5">
              <Alerts />
                <a href="/dashboard"><i className="bi bi-arrow-90deg-up"></i> Dashboard</a>
                <h3>Admin Dashboard</h3>
            </div>



          <div className="container mt-5">
            <ul className="nav nav-tabs bg-white">
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="?accounts">Accounts</a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" href="?scans">Scan History</a>
              </li>
            </ul>
          </div>
        </body>
      </div>
    )

  } else {
    navigate(window.location.pathname + "?accounts")
  }

  return (
    <div>
      
    </div>
  )

}


export default Admin;