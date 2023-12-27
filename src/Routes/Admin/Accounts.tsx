import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Alerts from "../../Components/Layout/Alerts";
import Navbar2 from "../../Components/Layout/Navbar2";
import Footer from '../../Components/Layout/Footer';

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

const Accounts = () => {

    // Loading content
    const [isLoaded, setIsLoaded] = useState(false);

    // Variables for fetchData()
    const [user, setUser] = useState<UserProperties[]>([]);
    const loggedUser = user.map((record) => record.id);

    // Variables for Create and Edit Accounts
    const [id, setId] = useState(0);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState(0);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Account variables
    const [accounts, setAccounts] = useState<AccountProperties[]>([]);
    const [page, setPage] = useState(1);
    const [limitPerPage, setLimitPerPage] = useState(5);
    const [totalItems, setTotalItems] = useState(0);

    // Pagination variables
    const totalPages = Math.ceil(totalItems / limitPerPage);
    const [pageNumberLimit, setPageNumberLimit] = useState(5);
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(5);
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);
    var pageDotIncrement = null;
    var pageDotDecrement = null;

    // Variables for Search Bar
    const [searchType, setSearchType] = useState("");
    const [searchValue, setSearchValue] = useState("");

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
              
              if(data[0].role_id === 0) {
                navigate("/dashboard?invalidperms")
              }

              setUser(data);
    
            })
  
          } catch (err) {
            console.log(err);
          }
          
    }

    const listAccounts = async () => {

        var requestPath: String;

        if (searchUrlParams.get("id") !== null) {
            requestPath = `/user?page=${page}&limitPerPage=${limitPerPage}&id=${searchUrlParams.get("id")}`;

        } else if(searchUrlParams.get("firstName") !== null) {
            requestPath = `/user?page=${page}&limitPerPage=${limitPerPage}&firstName=${searchUrlParams.get("firstName")}`;

        } else if(searchUrlParams.get("lastName") !== null) {
            requestPath = `/user?page=${page}&limitPerPage=${limitPerPage}&lastName=${searchUrlParams.get("lastName")}`;

        } else if(searchUrlParams.get("email") !== null) {
            requestPath = `/user?page=${page}&limitPerPage=${limitPerPage}&email=${searchUrlParams.get("email")}`;

        } else {
            requestPath = `/user?page=${page}&limitPerPage=${limitPerPage}`;

        }

        fetch(`${process.env.REACT_APP_BACKEND_HOST}${requestPath}`, {
            method: "GET",
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json'
            }
          })

        .then(response => {
            return response.json();
        })
        .then(async data => {
            setAccounts(data);

            if(data.length > 0) {
              setTotalItems(await data[0].total_rows)
            } else {
              setTotalItems(0)
            }

            setIsLoaded(true);
        })


    }

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
              navigate("/dashboard/admin/accounts?accountdeleted")
              listAccounts()
            } else {
              navigate("/dashboardadmin/accounts?error")
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
              navigate("/dashboard/admin/accounts?accountcreated")
              listAccounts()
            } else if (res.errors.errCode === "Reg01") {
              navigate("/dashboard/admin/accounts?createaccounterr01")
            } else if (res.errors.errCode === "Reg02") {
              navigate("/dashboard/admin/accounts?createaccounterr02")
            } else if (res.errors.errCode === "Reg03") {
              navigate("/dashboard/admin/accounts?createaccounterr03")
            } else {
              navigate("/dashboard/admin/accounts?createaccounterr")
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
              navigate("/dashboard/admin/accounts?accountedited")
              listAccounts()
              window.location.reload();
            } else if (res.errors.errCode === "Reg02") {
              navigate("/dashboard/admin/accounts?createaccounterr02")
              window.location.reload();
            } else if (res.errors.errCode === "Reg03") {
              navigate("/dashboard/admin/accounts?createaccounterr03")
              window.location.reload();
            } else {
              navigate("/dashboard/admin/accounts?editaccounterr")
              window.location.reload();
            }
          })
  
        } catch (err) {
          console.log(err)
        }
  
      }

    const searchQuery = async (event: any) => {

        event.preventDefault();

        try {
        
            if (searchType === "id") {
              navigate(`/dashboard/admin/accounts?id=${searchValue}`)
              window.location.reload();
            } else if (searchType === "firstName") {
              navigate(`/dashboard/admin/accounts?firstName=${searchValue}`)
              window.location.reload();
            } else if (searchType === "lastName") {
              navigate(`/dashboard/admin/accounts?lastName=${searchValue}`)
              window.location.reload();
            } else if (searchType === "email") {
              navigate(`/dashboard/admin/accounts?email=${searchValue}`)
              window.location.reload();
            } else {
              navigate(`/dashboard/admin/accounts`)
              window.location.reload();
            }
    
          } catch (err) {
            console.log(err);
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

    useEffect(() => {
    document.title = "Admin Dashboard | EZAvailability";
    fetchData();
    listAccounts();
    // eslint-disable-next-line
    }, [page, limitPerPage]);

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
                      <a className="nav-link active" aria-current="page" href="accounts">Accounts</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="scans">Scan History</a>
                    </li>
                </ul>


                <div className="mx-2 my-2">
                    <form className="d-inline-flex float-start" role="search" onSubmit={searchQuery}>
                      <select id="inputState" className="form-select w-50" value={searchType} onChange={(e: any) => setSearchType(e.target.value)}>
                          <option value="0">Search By...</option>
                          <option value="id" >ID</option>
                          <option value="firstName">First Name</option>
                          <option value="lastName">Last Name</option>
                          <option value="email">Email</option>
                      </select>
                      <input className="form-control me-2 w-75" type="search" placeholder="Search" aria-label="Search"
                      value={searchValue} onChange={(e: any) => setSearchValue(e.target.value)}/>
                      <button className="btn btn-primary" type="submit">Search</button>
                    </form>

                    <button type="button" className="btn btn-success float-md-end" data-bs-toggle="modal" data-bs-target="#createAccount"><i className="bi bi-person-plus-fill fs-6"></i> Create Account</button>

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
                                    accounts && accounts.map(record => {
                                        return (
                                        <>
                                            <tr key={record.id}>
                                                <th scope="row">{record.id}</th>
                                                <td>{record.first_name}</td>
                                                <td>{record.last_name}</td>
                                                <td>{record.email}</td>
                                                <td>{record.role_title}</td>
                                                <td>
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
                                                </td>
                                            </tr>
       
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
                                                      <select id="inputState" className="form-select" disabled={record.role_id > 1} value={role} onChange={(e: any) => setRole(e.target.value)}>
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
                                        </>   
                                        )
                                    })
                                }
                                </>
                            ) : (
                                <>
                                <tr>
                                  <td className="text-center align-middle">
                                    <div className="spinner-grow" role="status">
                                      <span className="visually-hidden">Loading...</span>
                                    </div>
                                  </td>
                                </tr>
                                </>
                            )
                        }
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
}




export default Accounts;