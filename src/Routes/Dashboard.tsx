import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar2 from '../Components/Layout/Navbar2'
import Footer from '../Components/Layout/Footer'
import Alerts from '../Components/Layout/Alerts'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import '../Styles/main.css';


  interface UserProperties {
    id: number
    first_name: string
  }


const Dashboard = () => {

  // Variables for scanIn() and scanOut()
  const [productUpc, setProductUpc] = useState("");
  const [productQty, setProductQty] = useState("1");
  
  const [user, setUser] = useState<UserProperties[]>([])
  const navigate = useNavigate()


    const fetchData = () => {

      fetch(`${process.env.REACT_APP_BACKEND_HOST}/auth/token/` , {
        method: "POST",
        credentials: 'include',
        headers: {
        'Content-Type': 'application/json'
        }
      })

        .then(userResponse => {
          if (userResponse.status === 200) {
            return userResponse.json()
          } else {
            navigate("/?timeout")
          }
          
        })
        .then(data => {
          setUser(data)
        })

    }

    const scanIn = async (event: any) => {

      event.preventDefault();

      const payload = {productUpc: productUpc, productQty: productQty};

      fetch(`${process.env.REACT_APP_BACKEND_HOST}/scans/in` , {
        method: "POST",
        credentials: 'include',
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
            navigate(`/dashboard/?scannedin=${productQty}`);
          } else if (res.errors.errCode === "Prod04") {
            navigate("/dashboard/?addproducterr04");
          } else if (res.errors.errCode === "Prod05") {
            navigate("/dashboard/?addproducterr05");
          } else {
            navigate("/dashboard/?addproducterror");
          }

        })



    }

    const scanOut = async (event: any) => {

      event.preventDefault();

      const payload = {productUpc: productUpc, productQty: productQty};

      fetch(`${process.env.REACT_APP_BACKEND_HOST}/scans/out` , {
        method: "POST",
        credentials: 'include',
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
            navigate(`/dashboard/?scannedout=${productQty}`);
          } else if (res.errors.errCode === "Prod04") {
            navigate("/dashboard/?addproducterr04");
          } else if (res.errors.errCode === "Prod05") {
            navigate("/dashboard/?addproducterr05");
          } else {
            navigate("/dashboard/?addproducterror");
          }

        })
      
    }

    useEffect(() => {
      document.title = "Dashboard | EZAvailability";
      fetchData();
      // eslint-disable-next-line
    }, []);
  

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
                  <a data-bs-toggle="modal" data-bs-target="#scanInModal" className="card-body border border-secondary-subtle">
                    <h3><i className="bi bi-upc-scan"></i> Scan In</h3>
                    <p className="card-text">Add existing items to inventory.</p>
                  </a>
                  <a data-bs-toggle="modal" data-bs-target="#scanOutModal" className="card-body border border-secondary-subtle">
                    <h3><i className="bi bi-upc-scan"></i> Scan Out</h3>
                    <p className="card-text">Remove existing items to inventory.</p>
                  </a>
                  <a href={`${process.env.REACT_APP_BASENAME}/dashboard/products`} className="card-body border border-secondary-subtle">
                    <h3><i className="bi bi-search"></i> Manage Inventory</h3>
                    <p className="card-text">Lookup item/Add new item to inventory.</p>
                  </a>
                  <button className="card-body border border-secondary-subtle">
                    <div className="list-inline">
                      <h3 className="list-inline-item"><i className="bi bi-cart"></i> Virtual Shopping List </h3>
                      <h5 className="list-inline-item align-middle"><span className="badge text-bg-warning">Under Development</span></h5>
                    </div>

                    <p className="card-text">Lookup item/Add new item to inventory.</p>
                  </button>
              </div>
            </div>

            { /* Scan In Modal */ }
            <div className="modal fade" id="scanInModal" tabIndex={-1} aria-labelledby="scanInModal" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">Scan IN</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                    <form onSubmit={scanIn}>
                      <div className="modal-body text-center">
                        <h4>Scan IN Items</h4>
                        <p>Scan or enter UPC to add items:</p>
                        <div className="list-inline d-flex justify-content-center my-3">
                          <span className="input-group-text"><i className="bi bi-upc-scan"></i></span>
                          <input className="form-control w-auto" type="text" placeholder="Enter or Scan UPC" aria-label="UPCScan" value={productUpc} onChange={(e) => setProductUpc(e.target.value)}/>
                          <input className="form-control w-25" type="number" placeholder="Qty" aria-label="Qty" value={productQty} onChange={(e) => setProductQty(e.target.value)}/>
                          <button className="btn btn-success ms-1" type="submit" data-bs-dismiss="modal"><i className="bi bi-plus"></i> Scan IN</button>
                        </div>
                      </div>
                      <div className="modal-footer justify-content-center">
                        <a href={`${process.env.REACT_APP_BASENAME}/dashboard/products`}><i className="bi bi-search"></i> Advanced Search</a>
                      </div>
                    </form>
                </div>
              </div>
            </div>

            { /* Scan Out Modal */ }
            <div className="modal fade" id="scanOutModal" tabIndex={-1} aria-labelledby="scanOutModal" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">Scan OUT</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <form onSubmit={scanOut}>
                      <div className="modal-body text-center">
                        <h4>Scan OUT Items</h4>
                        <p>Scan or enter UPC to remove items:</p>
                        <div className="list-inline d-flex justify-content-center my-3">
                          <span className="input-group-text"><i className="bi bi-upc-scan"></i></span>
                          <input className="form-control w-auto" type="text" placeholder="Enter or Scan UPC" aria-label="UPCScan" value={productUpc} onChange={(e) => setProductUpc(e.target.value)}/>
                          <input className="form-control w-25" type="number" placeholder="Qty" aria-label="Qty" value={productQty} onChange={(e) => setProductQty(e.target.value)}/>
                          <button className="btn btn-danger ms-1" type="submit" data-bs-dismiss="modal"><i className="bi bi-dash"></i> Scan OUT</button>
                        </div>
                      </div>
                      <div className="modal-footer justify-content-center">
                        <a href={`${process.env.REACT_APP_BASENAME}/dashboard/products`}><i className="bi bi-search"></i> Advanced Search</a>
                      </div>
                    </form>
                </div>
              </div>
            </div>
            
        </body>
        <Footer />
    </div>


  )
}

export default Dashboard;