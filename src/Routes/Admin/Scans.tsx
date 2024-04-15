import { useEffect, useState } from 'react';
import Alerts from "../../Components/Layout/Alerts";
import Navbar2 from "../../Components/Layout/Navbar2";
import { useNavigate } from 'react-router-dom';
import Footer from '../../Components/Layout/Footer';

interface UserProperties {
    id: number
    first_name: string
    role_id: number
}

interface ScanProperties {
    id: number,
    scan_id: number,
    product_id: number,
    product_name: string,
    scan_date: any,
    scan_type: string,
    actioned_by: number,
    first_name: string,
    last_name: string
}

const Scans = () => {

    // Loading content
    const [isLoaded, setIsLoaded] = useState(false);

    // Variables for fetchData()
    const [user, setUser] = useState<UserProperties[]>([]);

    // Scan variables
    const [scans, setScans] = useState<ScanProperties[]>([]);
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

    const getScans = () => {

        fetch(`${process.env.REACT_APP_BACKEND_HOST}/scans/?limitPerPage=${limitPerPage}&page=${page}`, {
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
            setScans(data);
            setTotalItems(await data[0].total_rows)
            setIsLoaded(true);
        })

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
        getScans();
        // eslint-disable-next-line
        }, [page, limitPerPage]);

    return(
        <div>
            <body>
                <Navbar2 />
                    <div className="container mt-5">
                      <Alerts />
                        <a href={`${process.env.REACT_APP_BASENAME}dashboard`}><i className="bi bi-arrow-90deg-up"></i> Dashboard</a>
                        <h3>Admin Dashboard</h3>
                    </div>

                <div className="container mt-5">
                    <ul className="nav nav-tabs bg-white">
                        <li className="nav-item">
                          <a className="nav-link" aria-current="page" href={`${process.env.REACT_APP_BASENAME}dashboard/admin/accounts`}>Accounts</a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link active" href={`${process.env.REACT_APP_BASENAME}dashboard/admin/scans`}>Scan History</a>
                        </li>
                    </ul>

                    <table className="table">
                        <thead>
                          <tr>
                            <th scope="col">Scan ID</th>
                            <th scope="col">Product ID</th>
                            <th scope="col">Product Name</th>
                            <th scope="col">Scan Date</th>
                            <th scope="col">Scan Type</th>
                            <th scope="col">Actioned By</th>
                          </tr>
                        </thead>
                        <tbody>
                        {
                            isLoaded ? (
                                <>
                                    {
                                        scans && scans.map(record => {
                                            return (
                                            <tr>
                                                <th scope="row">{record.scan_id}</th>
                                                <th scope="row">{record.product_id}</th>
                                                <th scope="row">{record.product_name}</th>
                                                <th scope="row">{record.scan_date}</th>
                                                <th scope="row">{record.scan_type}</th>
                                                <th scope="row">{record.first_name} {record.last_name} ({record.actioned_by})</th>
                                                <td></td>
                                            </tr>
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
            </body>
            <Footer />
        </div>
    )
}


export default Scans;