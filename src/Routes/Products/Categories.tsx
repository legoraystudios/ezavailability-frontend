import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Alerts from "../../Components/Layout/Alerts";
import Navbar2 from "../../Components/Layout/Navbar2";
import Footer from "../../Components/Layout/Footer";
import Tooltip from "react-bootstrap/esm/Tooltip";
import Overlay from "react-bootstrap/esm/Overlay";

interface CategoryProperties {
    category_id: number,
    category_name: string,
    category_desc: string,
    low_stock_alert: number,
    total_rows: number,
    total_products: number,
    total_qty: number,
}

const Categories = () => {

    // Loading content
    const [isLoaded, setIsLoaded] = useState(false);
    
    // Categories Variables
    const [categories, setCategories] = useState<CategoryProperties[]>([]);
    const [page, setPage] = useState(1);
    const [limitPerPage, setLimitPerPage] = useState(5);
    const [totalItems, setTotalItems] = useState(0);

    // Variables for addProduct() and editProduct()
    const [categoryId, setCategoryId] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [categoryDesc, setCategoryDesc] = useState("");
    const [lowStockAlert, setLowStockAlert] = useState("");

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

    const getCategories = () => {

        var requestPath: String;

        if (searchUrlParams.get("categoryName") !== null) {
            requestPath = `/category?limitPerPage=${limitPerPage}&page=${page}&categoryName=${searchUrlParams.get("categoryName")}`;
        } else if (searchUrlParams.get("categoryId") !== null) {
            requestPath = `/category?limitPerPage=${limitPerPage}&page=${page}&categoryId=${searchUrlParams.get("categoryId")}`;
        } else {
            requestPath = `/category?limitPerPage=${limitPerPage}&page=${page}`;
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
              setCategories(data)

              if(data.length > 0) {
                setTotalItems(await data[0].total_rows)
              } else {
                setTotalItems(0)
              }
              setIsLoaded(true)
            })

    }

    const addCategory = async (event: any) => {
     
      event.preventDefault();

      try {

        const payload = {categoryName: categoryName, categoryDesc: categoryDesc, lowStockAlert: lowStockAlert};

        await fetch(`${process.env.REACT_APP_BACKEND_HOST}/category/create`, {
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
              navigate("/dashboard/categories?categoryadded")
              getCategories();
            } else if (res.errors.errCode === "Cat01") {
              navigate("/dashboard/categories?addcategoryerr01")
            } else {
              navigate("/dashboard/categories?addcategoryerror")
            }
          })

      } catch (err) {
        console.log(err);
      }

    }

    const editCategory = async (event: any) => {
     
      event.preventDefault();

      try {

        const payload = {categoryId: categoryId, categoryName: categoryName, categoryDesc: categoryDesc, lowStockAlert: lowStockAlert};

        await fetch(`${process.env.REACT_APP_BACKEND_HOST}/category/edit`, {
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
              navigate("/dashboard/categories?categoryedited")
              getCategories();
            } else if (res.errors.errCode === "Cat01") {
              navigate("/dashboard/categories?addcategoryerr01")
            } else {
              navigate("/dashboard/categories?addcategoryerror")
            }
          })

      } catch (err) {
        console.log(err);
      }

    }

    const deleteCategory = async (id: number) => {

      try {

        const payload = {categoryId: id}

        await fetch(`${process.env.REACT_APP_BACKEND_HOST}/category/delete`, {
            method:  "DELETE",
            credentials: "include",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          })

          .then(async response => {
            
            if (response.status === 200) {
              navigate("/dashboard/categories?categorydeleted")
              getCategories();
            } else {
              navigate("/dashboard/categories?error")
            }
          })

    } catch (err) {
        console.log(err);
    }

    }

    const searchQuery = async (event: any) => {

        event.preventDefault();

        try {
        
            if (searchType === "categoryName") {
              navigate(`/dashboard/categories?categoryName=${searchValue}`)
              window.location.reload();
            } else if (searchType === "categoryId") {
              navigate(`/dashboard/categories?categoryId=${searchValue}`)
              window.location.reload();
            } else {
              navigate(`/dashboard/categories`)
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
        document.title = "My Inventory | EZAvailability";
        getCategories();
    }, [page, limitPerPage])

    return (
        <div>
        <Navbar2 />
            <body>
                <div className="container mt-5 pb-5">
                  <Alerts />
                    <a href={`${process.env.REACT_APP_BASENAME}dashboard`}><i className="bi bi-arrow-90deg-up"></i> Dashboard</a>
                    <h3>My Inventory</h3>

                    <ul className="nav nav-tabs bg-white mb-3">
                        <li className="nav-item">
                          <a className="nav-link" aria-current="page" href="products">Products</a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link active" href="categories">Categories</a>
                        </li>
                    </ul>

                    <form className="d-inline-flex float-start" role="search" onSubmit={searchQuery}>
                      <select id="inputState" className="form-select w-50" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                          <option value="0">Search By...</option>
                          <option value="categoryName" >Category Name</option>
                          <option value="categoryId">Category ID</option>
                      </select>
                      <input className="form-control me-2 w-75" type="search" placeholder="Search" aria-label="Search" value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>
                      <button className="btn btn-primary" type="submit">Search</button>
                    </form>

                    <button type="button" className="btn btn-success float-md-end" data-bs-toggle="modal" data-bs-target="#addCategory"><i className="bi bi-folder-plus fs-6"></i> Add Category</button>

                </div>
                {
                    isLoaded ? (
                        <>
                    <div className="container mt-5">
                        {
                            categories && categories.map(record => {
                                return (
                                    <div className="accordion" id="accordionExample" key={record.category_id}>
                                        <div className="accordion-item">
                                              <h2 className="accordion-header">
                                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#category-${record.category_id}`} aria-expanded="true" aria-controls="collapseOne">
                                                  {record.category_name} <span className="badge text-bg-secondary ms-2">ID: {record.category_id}</span> <span className="badge text-bg-primary ms-2">Total Products: {record.total_products}</span>
                                                  <span className={`${record.total_qty > record.low_stock_alert ? "text-bg-success" : "text-bg-danger"} ${"badge text-white ms-2"}`}>On Hand: {
                                                    record.total_qty > 0 ? (
                                                        record.total_qty
                                                    ) : (
                                                        0
                                                    )

                                                  }</span>
                                                </button>
                                              </h2>
                                              <div id={`category-${record.category_id}`} className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                                <div className="accordion-body">

                                                <div className="row">
                                                    <div className="col">
                                                        <div className="list-inline">
                                                            <h5 className="text-primary list-inline-item">Category Name:</h5>
                                                            <p className="list-inline-item">{record.category_name}</p>
                                                        </div>
                                                        <div className="list-inline">
                                                            <h5 className="text-primary list-inline-item">Category Description:</h5>
                                                            <p className="list-inline-item">{record.category_desc}</p>
                                                        </div>
                                                        <div className="list-inline">
                                                            <h5 className="text-primary list-inline-item">Low Stock Alert:</h5>
                                                            <p className="list-inline-item">{record.low_stock_alert}</p>
                                                        </div>
                                                    </div>
                                                    <div className="col">
                                                        <div className="d-flex justify-content-center my-3">
                                                            <button type="button" className="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target={`#edit-${record.category_id}`}
                                                              onClick={
                                                                (e) => {
                                                                  setCategoryId(record.category_id.toString());
                                                                  setCategoryName(record.category_name);
                                                                  setCategoryDesc(record.category_desc);
                                                                  setLowStockAlert(record.low_stock_alert.toString());
                                                                }
                                                              }>
                                                                <i className="bi bi-pencil-square fs-6"></i> Edit
                                                                </button>
                                                            <button type="button" className="btn btn-danger me-2" data-bs-toggle="modal" data-bs-target={`#delete-${record.category_id}`}><i className="bi bi-trash3 fs-6"></i> Delete</button>
                                                            <a type="button" className="btn btn-info" href={`${process.env.REACT_APP_BASENAME}dashboard/products?categoryId=${record.category_id}`}><i className="bi bi-box-arrow-up-right fs-6"></i> View Products Related</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            </div>
                                        </div>

                                        { /* Edit Category Modal */ }
                                        <div className="modal fade" id={`edit-${record.category_id}`} tabIndex={-1} aria-labelledby={`edit-${record.category_id}`} aria-hidden="true">
                                          <div className="modal-dialog">
                                            <div className="modal-content">
                                              <div className="modal-header">
                                                <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Category</h1>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                              </div>
                                              <div className="modal-body">
                                              <form className="row g-3" onSubmit={editCategory}>
                                                <div className="col-12">
                                                  <label className="form-label">Category Name</label>
                                                  <input type="text" className="form-control" id="productName" placeholder="Beans" value={categoryName} onChange={(e) => setCategoryName(e.target.value)}/>
                                                </div>
                                                <div className="col-md-12">
                                                  <label htmlFor="productDescription" className="form-label">Category Description</label>
                                                  <textarea className="form-control" id="exampleFormControlTextarea1" rows={3} value={categoryDesc} onChange={(e) => setCategoryDesc(e.target.value)}></textarea>
                                                </div>
                                                <div className="col-12">
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
                                        <div className="modal fade" id={`delete-${record.category_id}`} tabIndex={-1} aria-labelledby={`delete-${record.category_id}`} aria-hidden="true">
                                          <div className="modal-dialog">
                                            <div className="modal-content">
                                              <div className="modal-header">
                                                <h1 className="modal-title fs-5" id="exampleModalLabel">Delete Category | {record.category_name} ({record.category_id})</h1>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                              </div>
                                              <div className="modal-body">
                                                <p>Are you sure you want to delete <b>{record.category_name} ({record.category_id})</b>? THIS ACTION CANNOT BE UNDONE!</p>
                                              </div>
                                              <div className="modal-footer">
                                                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                  <button type="submit" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => deleteCategory(record.category_id)}>Delete Product</button>
                                                </div>
                                            </div>
                                          </div>
                                        </div>


                                    </div>
                                )
                            })
                        }

                        { /* Add Category Modal */ }
                        <div className="modal fade" id="addCategory" tabIndex={-1} aria-labelledby="addCategory" aria-hidden="true">
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Add Category</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>
                              <div className="modal-body">
                              <form className="row g-3" onSubmit={addCategory}>
                                <div className="col-12">
                                  <label className="form-label">Category Name</label>
                                  <input type="text" className="form-control" id="productName" placeholder="Beans" value={categoryName} onChange={(e) => setCategoryName(e.target.value)}/>
                                </div>
                                <div className="col-md-12">
                                  <label htmlFor="productDescription" className="form-label">Category Description</label>
                                  <textarea className="form-control" id="exampleFormControlTextarea1" rows={3} value={categoryDesc} onChange={(e) => setCategoryDesc(e.target.value)}></textarea>
                                </div>
                                <div className="col-12">
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
                                <div className="modal-footer">
                                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                  <button type="submit" className="btn btn-success" data-bs-dismiss="modal">Add Category</button>
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

                    </div>
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

            </body>
            <Footer />
        </div>
    )
}

export default Categories;