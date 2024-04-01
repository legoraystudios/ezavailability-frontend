import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Select from "react-select";
import Image from "../../Images/image.jpg";
import Alerts from "../../Components/Layout/Alerts";
import Navbar2 from "../../Components/Layout/Navbar2";
import Footer from "../../Components/Layout/Footer";
import Tooltip from "react-bootstrap/Tooltip";
import Overlay from "react-bootstrap/Overlay";

interface UserProperties {
    id: number,
    first_name: string
}

interface CategoryProperties {
    category_id: number,
    category_name: string,
    category_desc: string,
    low_stock_alert: number
}

interface ProductProperties {
    product_id: number,
    product_name: string,
    product_desc: string,
    product_qty: number,
    product_upc: number,
    low_stock_alert: number,
    category_id: number,
    category_name: string
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

    // Variables for addProduct() and editProduct()
    const [productId, setProductId] = useState(0);
    const [productName, setProductName] = useState("");
    const [productDesc, setProductDesc] = useState("");
    const [productQty, setProductQty] = useState("");
    const [productUpc, setProductUpc] = useState("");
    const [lowStockAlert, setLowStockAlert] = useState("");
    const [productCategory, setProductCategory] = useState("");

    // Categories
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [categories, setCategories] = useState<CategoryProperties[]>([]);

    // Low Stock Alert tooltip
    const [show, setShow] = useState(false);
    const lowStockAlertTooltip = useRef(null);

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

    const getProducts = () => {

        var requestPath: String;

        if (searchUrlParams.get("productName") !== null) {
            requestPath = `/products?limitPerPage=${limitPerPage}&page=${page}&productName=${searchUrlParams.get("productName")}`;
        } else if (searchUrlParams.get("productId") !== null) {
            requestPath = `/products?limitPerPage=${limitPerPage}&page=${page}&productId=${searchUrlParams.get("productId")}`;
        } else if (searchUrlParams.get("productUpc") !== null) {
            requestPath = `/products?limitPerPage=${limitPerPage}&page=${page}&productUpc=${searchUrlParams.get("productUpc")}`;
        } else if (searchUrlParams.get("categoryId") !== null) {
            requestPath = `/products?limitPerPage=${limitPerPage}&page=${page}&categoryId=${searchUrlParams.get("categoryId")}`;
        } else {
            requestPath = `/products?limitPerPage=${limitPerPage}&page=${page}`;
        }
    
        fetch(`${process.env.REACT_APP_BACKEND_HOST}${requestPath}` , {
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
              setProducts(data)

              if(data.length > 0) {
                setTotalItems(await data[0].total_rows)
              } else {
                setTotalItems(0)
              }
              setIsLoaded(true)
            })

    }

    const getCategories = async () => {

        const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/category` , {
            method: "GET",
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json'
            }
        })

        const data = await response.json();

        const categoryList = data.map((record: { category_id: any; category_name: any; }) => ({
            value: record.category_id,
            label: record.category_name
        }))

        setCategories(data);
        setCategoryOptions(categoryList);

    }

    const searchQuery = async (event: any) => {

        event.preventDefault();

        try {
        
            if (searchType === "productName") {
              navigate(`/dashboard/products?productName=${searchValue}`)
              window.location.reload();
            } else if (searchType === "productId") {
              navigate(`/dashboard/products?productId=${searchValue}`)
              window.location.reload();
            } else if (searchType === "productUpc") {
              navigate(`/dashboard/products?productUpc=${searchValue}`)
              window.location.reload();
            } else if (searchType === "categoryId") {
              navigate(`/dashboard/products?categoryId=${searchValue}`)
              window.location.reload();
            } else {
              navigate(`/dashboard/products`)
              window.location.reload();
            }
    
          } catch (err) {
            console.log(err);
          }
          
    }

    const renderSearchBar = () => {
      if(searchType === "categoryId") {
        return (
          <>
            <Select className="w-75" options={categoryOptions} onChange={productCatOnSearchBar}/>
          </>
        )
      } else {
        return (
          <>
            <input className="form-control w-75" type="search" placeholder="Search" aria-label="Search" value={searchValue} onChange={(e:any) => setSearchValue(e.target.value)}/>
          </>
        )
      }
    }

    const addProduct = async (event: any) => {

        event.preventDefault();

        try {
        
            const payload = {productName: productName, productDesc: productDesc, productQty: productQty, productUpc: productUpc,
                    lowStockAlert: lowStockAlert, categoryId: productCategory}
        
                await fetch(`${process.env.REACT_APP_BACKEND_HOST}/products/create`, {
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
                      navigate("/dashboard/products?productadded")
                      getProducts();
                    } else if (res.errors.errCode === "Prod01") {
                      navigate("/dashboard/products?addproducterr01")
                    } else if (res.errors.errCode === "Prod02") {
                      navigate("/dashboard/products?addproducterr02")
                    } else if (res.errors.errCode === "Prod03") {
                      navigate("/dashboard/products?addproducterr03")
                    } else {
                      navigate("/dashboard/products?addproducterror")
                    }
                  })

          } catch (err) {
            console.log(err);
          }
          
    }

    const editProduct = async (event: any) => {

        event.preventDefault();

        try {
        
            const payload = {productId: productId, productName: productName, productDesc: productDesc, productQty: productQty, productUpc: productUpc,
                    lowStockAlert: lowStockAlert, categoryId: productCategory}
        
                await fetch(`${process.env.REACT_APP_BACKEND_HOST}/products/edit`, {
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
                      navigate("/dashboard/products?productedited")
                      getProducts();
                    } else if (res.errors.errCode === "Prod01") {
                      navigate("/dashboard/products?addproducterr01")
                    } else if (res.errors.errCode === "Prod02") {
                      navigate("/dashboard/products?addproducterr02")
                    } else if (res.errors.errCode === "Prod03") {
                      navigate("/dashboard/products?addproducterr03")
                    } else {
                      navigate("/dashboard/products?editproducterror")
                    }
                  })

          } catch (err) {
            console.log(err);
          }
          
    }

    const deleteProduct = async (productId: number) => {

        try {

            const payload = {productId: productId}

            await fetch(`${process.env.REACT_APP_BACKEND_HOST}/products/delete`, {
                method:  "DELETE",
                credentials: "include",
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
              })

              .then(async response => {
                
                if (response.status === 200) {
                  navigate("/dashboard/products?productdeleted")
                  getProducts();
                } else {
                  navigate("/dashboard/products?error")
                }
              })

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

      const productCatOnSearchBar = (selectedOption: any) => {
        setSearchValue(selectedOption.value)
      }

      const productCatDropdownChange = (selectedOption: any) => {
        setProductCategory(selectedOption.value)
      }

    useEffect(() => {
        document.title = "My Inventory | EZAvailability";
        fetchData();
        getCategories();
        getProducts();
        // eslint-disable-next-line
    }, [page, limitPerPage])

    return (
        <div>
            <Navbar2 />
            <body>
                <div className="container mt-5 pb-5">
                  <Alerts />
                    <a href={`${process.env.REACT_APP_BASENAME}/dashboard`}><i className="bi bi-arrow-90deg-up"></i> Dashboard</a>
                    <h3>My Inventory</h3>

                    <ul className="nav nav-tabs bg-white mb-3">
                        <li className="nav-item">
                          <a className="nav-link active" aria-current="page" href="products">Products</a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link" href="categories">Categories</a>
                        </li>
                    </ul>


                    <form className="d-inline-flex float-start" role="search" onSubmit={searchQuery}>
                      <select id="inputState" className="form-select w-50" value={searchType} onChange={(e: any) => setSearchType(e.target.value)}>
                          <option value="0">Search By...</option>
                          <option value="productName">Product Name</option>
                          <option value="productId">Product ID</option>
                          <option value="productUpc">Product UPC</option>
                          <option value="categoryId">Category Name</option>
                      </select>
                      {
                        renderSearchBar()
                      }
                      <button className="btn btn-primary ms-2" type="submit">Search</button>
                    </form>

                    <button type="button" className="btn btn-success float-md-end" data-bs-toggle="modal" data-bs-target="#addProduct"><i className="bi bi-file-earmark-plus fs-6"></i> Add Product</button>
                </div>

                <div className="container mt-5">
                <div className="accordion" id="accordionExample">
                    {
                        isLoaded ? (
                            <>
                            {
                                products && products.map(record => {
                                    return (
                                        <>
                                            <div className="accordion-item" key={record.product_id}>
                                              <h2 className="accordion-header">
                                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#product-${record.product_id}`} aria-expanded="true" aria-controls="collapseOne">
                                                <img className="me-2" src={Image} height={45}></img>
                                                    {record.product_name} <span className="badge text-bg-primary ms-2">{record.category_name}</span> 
                                                    <span className={`${record.product_qty > record.low_stock_alert ? "text-bg-success" : "text-bg-danger"} ${"badge text-white ms-2"}`}>On Hand: {record.product_qty}</span>
                                                </button>
                                              </h2>
                                              <div id={`product-${record.product_id}`} className="accordion-collapse collapse my-3" data-bs-parent="#accordionExample">
                                                <div className="row">
                                                    <div className="col-sm-4">
                                                        <div className="accordion-body ms-5">
                                                            <img src={Image} height={200}></img>
                                                            <div className="justify-content-center my-3">
                                                                <button type="button" className="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target={`#edit-${record.product_id}`}
                                                                    onClick={
                                                                        () => {
                                                                            setProductId(record.product_id);
                                                                            setProductName(record.product_name);
                                                                            setProductDesc(record.product_desc);
                                                                            setProductQty(record.product_qty.toString());
                                                                            setProductUpc(record.product_upc.toString());
                                                                            setProductCategory(record.category_id.toString());
                                                                            setLowStockAlert(record.low_stock_alert.toString());
                                                                        }
                                                                    }>
                                                                    <i className="bi bi-pencil-square fs-6"></i> Edit
                                                                    </button>
                                                                <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target={`#delete-${record.product_id}`}><i className="bi bi-trash3 fs-6"></i> Delete</button>
                                                                <button type="button" className="btn btn-success"><i className="bi bi-cart fs-6"></i> Add to Shopping List</button>
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6 my-3">
                                                        <div className="list-inline">
                                                            <h5 className="text-primary list-inline-item">Product Name:</h5>
                                                            <p className="list-inline-item">{record.product_name}</p>
                                                        </div>
                                                        <div className="list-inline">
                                                            <h5 className="text-primary list-inline-item">Product Category:</h5>
                                                            <p className="list-inline-item">{record.category_name} ({record.category_id})</p>
                                                        </div>
                                                        <div className="list-inline">
                                                            <h5 className="text-primary list-inline-item">Product Description:</h5>
                                                            <p className="list-inline-item">{record.product_desc}</p>
                                                        </div>
                                                        <div className="list-inline">
                                                            <h5 className="text-primary list-inline-item">On Hand:</h5>
                                                            <p className={`${record.product_qty > record.low_stock_alert ? "text-success" : "text-danger"} ${"list-inline-item"} ${"bold"}`}>{record.product_qty}</p>
                                                        </div>
                                                        <div className="list-inline">
                                                            <h5 className="text-primary list-inline-item">Product UPC:</h5>
                                                            <p className="list-inline-item">{record.product_upc}</p>
                                                        </div>
                                                        <div className="list-inline">
                                                            <h5 className="text-primary list-inline-item">Low Stock Alert:</h5>
                                                            <p className="list-inline-item">{record.low_stock_alert}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                              </div>
                                            </div>

                                            { /* Edit Product Modal */ }
                                            <div className="modal fade" id={`edit-${record.product_id}`} tabIndex={-1} aria-labelledby={`edit-${record.product_id}`} aria-hidden="true">
                                              <div className="modal-dialog">
                                                <div className="modal-content">
                                                  <div className="modal-header">
                                                    <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Product | {record.product_name} ({record.product_id})</h1>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                  </div>
                                                  <div className="modal-body">
                                                  <form className="row g-3" onSubmit={editProduct}>
                                                    <div className="col-12">
                                                      <label className="form-label">Product Name</label>
                                                      <input type="text" className="form-control" id="productName" placeholder="Cookies" value={productName} onChange={(e) => setProductName(e.target.value)}/>
                                                    </div>
                                                    <div className="col-md-12">
                                                      <label htmlFor="productDescription" className="form-label">Product Description</label>
                                                      <textarea className="form-control" id="exampleFormControlTextarea1" rows={3} value={productDesc} onChange={(e) => setProductDesc(e.target.value)}></textarea>
                                                    </div>
                                                    <div className="col-6">
                                                      <label className="form-label">Product Quantity</label>
                                                      <input type="text" className="form-control" id="productQty" placeholder="" value={productQty} onChange={(e) => setProductQty(e.target.value)}/>
                                                    </div>
                                                    <div className="col-6">
                                                      <label className="form-label">Product UPC</label>
                                                      <input type="text" className="form-control" id="productUpc" placeholder="" value={productUpc} onChange={(e) => setProductUpc(e.target.value)}/>
                                                    </div>
                                                    <div className="col-md-6">
                                                      <label htmlFor="inputState" className="form-label">Category</label>
                                                      <Select options={categoryOptions} placeholder={record.category_name} onChange={productCatDropdownChange}/>
                                                    </div>
                                                    <div className="col-6">
                                                      <label className="form-label">Low Stock Alert 
                                                      <a className="ms-2" ref={lowStockAlertTooltip} onClick={() => setShow(!show)}>
                                                        <i className="bi bi-question-circle"></i>
                                                      </a>
                                                      <Overlay target={lowStockAlertTooltip.current} show={show} placement="right">
                                                        {(props) => (
                                                          <Tooltip id="overlay-example" {...props}>
                                                            Low Stock Alert notifies when a product is less than the quantity,
                                                            meaning that have low stock of that specific product. Type a 
                                                            numeric value to be notified when the product is in low stock.
                                                          </Tooltip>
                                                        )}
                                                      </Overlay>
                                                      </label>
                                                      <input type="text" className="form-control" id="lowStockAlert" placeholder="" value={lowStockAlert} onChange={(e) => setLowStockAlert(e.target.value)}/>
                                                    </div>
                                                    <div className="col-md-12">
                                                      <label htmlFor="inputState" className="form-label">Product Image</label>
                                                      <input type="file" className="form-control" id="inputGroupFile02" />
                                                    </div>
                                                    <div className="modal-footer">
                                                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                      <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Save Changes</button>
                                                    </div>
                                                  </form>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>

                                            { /* Delete Product Modal */ }
                                            <div className="modal fade" id={`delete-${record.product_id}`} tabIndex={-1} aria-labelledby={`delete-${record.product_id}`} aria-hidden="true">
                                              <div className="modal-dialog">
                                                <div className="modal-content">
                                                  <div className="modal-header">
                                                    <h1 className="modal-title fs-5" id="exampleModalLabel">Delete Product | {record.product_name} ({record.product_id})</h1>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                  </div>
                                                  <div className="modal-body">
                                                    <p>Are you sure you want to delete <b>{record.product_name} ({record.product_id})</b>? THIS ACTION CANNOT BE UNDONE!</p>
                                                  </div>
                                                  <div className="modal-footer">
                                                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                      <button type="submit" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => deleteProduct(record.product_id)}>Delete Product</button>
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
                                  <td className="text-center">
                                    <div className="spinner-grow" role="status">
                                      <span className="visually-hidden">Loading...</span>
                                    </div>
                                  </td>
                            </>
                        )
                    }
                    </div>
                </div>

                { /* Add Product Modal */ }
                <div className="modal fade" id="addProduct" tabIndex={-1} aria-labelledby="addProduct" aria-hidden="true">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Add Product</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div className="modal-body">
                      <form className="row g-3" onSubmit={addProduct}>
                        <div className="col-12">
                          <label className="form-label">Product Name</label>
                          <input type="text" className="form-control" id="productName" placeholder="Cookies" value={productName} onChange={(e) => setProductName(e.target.value)}/>
                        </div>
                        <div className="col-md-12">
                          <label htmlFor="productDescription" className="form-label">Product Description</label>
                          <textarea className="form-control" id="exampleFormControlTextarea1" rows={3} value={productDesc} onChange={(e) => setProductDesc(e.target.value)}></textarea>
                        </div>
                        <div className="col-6">
                          <label className="form-label">Product Quantity</label>
                          <input type="text" className="form-control" id="productQty" placeholder="" value={productQty} onChange={(e) => setProductQty(e.target.value)}/>
                        </div>
                        <div className="col-6">
                          <label className="form-label">Product UPC</label>
                          <input type="text" className="form-control" id="productUpc" placeholder="" value={productUpc} onChange={(e) => setProductUpc(e.target.value)}/>
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="inputState" className="form-label">Category</label>
                          <Select options={categoryOptions} onChange={productCatDropdownChange}/>
                        </div>
                        <div className="col-6">
                          <label className="form-label">Low Stock Alert 
                          <a className="ms-2" ref={lowStockAlertTooltip} onClick={(e: any) => setLowStockAlert(e.target.value)}>
                            <i className="bi bi-question-circle"></i>
                          </a>
                          <Overlay target={lowStockAlertTooltip.current} show={show} placement="right">
                            {(props) => (
                              <Tooltip id="overlay-example" {...props}>
                                Low Stock Alert notifies when a product is less than the quantity,
                                meaning that have low stock of that specific product. Type a 
                                numeric value to be notified when the product is in low stock.
                              </Tooltip>
                            )}
                          </Overlay>
                          </label>
                          <input type="text" className="form-control" id="lowStockAlert" placeholder="" value={lowStockAlert} onChange={(e) => setLowStockAlert(e.target.value)}/>
                        </div>
                        <div className="col-md-12">
                          <label htmlFor="inputState" className="form-label">Product Image</label>
                          <input type="file" className="form-control" id="inputGroupFile02" />
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                          <button type="submit" className="btn btn-success" data-bs-dismiss="modal">Add Product</button>
                        </div>
                      </form>
                      </div>
                    </div>
                  </div>
                </div>

                <ul className="pagination justify-content-center mt-3">
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

            </body>
            <Footer />

        </div>
    )

}

export default Products;