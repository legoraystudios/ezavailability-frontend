import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Alerts from "../../Components/Layout/Alerts";
import Navbar2 from "../../Components/Layout/Navbar2";

interface UserProperties {
    id: number,
    first_name: string
}

interface ProductProperties {
    product_id: number,
    product_name: string,
    product_desc: string,
    product_qty: number,
    product_upc: number,
    low_stock_alert: number,
    category_id: number,
}

const Products = () => {

    // Loading content
    const [isLoaded, setIsLoaded] = useState(false);

    // Variables for fetchData()
    const [user, setUser] = useState<UserProperties[]>([]);

    // Product variables
    const [products, setProducts] = useState<ProductProperties[]>([]);
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

    const navigate = useNavigate();

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

    useEffect(() => {
        document.title = "Dashboard | EZAvailability";
        fetchData();
    }, [])

    return (
        <div>
            <Navbar2 />
            <body>
                <div className="container mt-5 pb-5">
                  <Alerts />
                    <a href="/dashboard"><i className="bi bi-arrow-90deg-up"></i> Dashboard</a>
                    <h3>My Inventory</h3>

                    <form className="d-inline-flex float-start" role="search">
                      <select id="inputState" className="form-select w-25" >
                          <option value="0">Search By...</option>
                          <option value="id" >Product Name</option>
                          <option value="firstName">Product ID</option>
                          <option value="lastName">Product UPC</option>
                      </select>
                      <input className="form-control me-2 w-50" type="search" placeholder="Search" aria-label="Search"/>
                      <button className="btn btn-primary" type="submit">Search</button>
                    </form>

                    <button type="button" className="btn btn-success float-md-end" data-bs-toggle="modal" data-bs-target="#addProduct"><i className="bi bi-file-earmark-plus fs-6"></i> Add Product</button>
                </div>

                <div className="container mt-5">
                <div className="accordion" id="accordionExample">
                        <div className="accordion-item">
                          <h2 className="accordion-header">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                Garbanzos Econo 15,5oz <span className="badge text-bg-primary ms-2">Habichuelas</span> <span className="badge text-bg-secondary ms-2">UPC: 708938000597</span>
                            </button>
                          </h2>
                          <div id="collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                              <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                            </div>
                          </div>
                        </div>
                    </div>
                </div>

            </body>
        </div>
    )

}

export default Products;