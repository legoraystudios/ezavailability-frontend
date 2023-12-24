import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alerts from "../../Components/Layout/Alerts";
import Navbar2 from "../../Components/Layout/Navbar2";
import Footer from "../../Components/Layout/Footer";

const Categories = () => {

    const getCategories = () => {
        
    }


    useEffect(() => {
        document.title = "My Inventory | EZAvailability";
    }, [])

    return (
        <div>
        <Navbar2 />
            <body>
                <div className="container mt-5 pb-5">
                  <Alerts />
                    <a href="/dashboard"><i className="bi bi-arrow-90deg-up"></i> Dashboard</a>
                    <h3>My Inventory</h3>

                    <ul className="nav nav-tabs bg-white mb-3">
                        <li className="nav-item">
                          <a className="nav-link" aria-current="page" href="products">Products</a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link active" href="categories">Categories</a>
                        </li>
                    </ul>

                    <form className="d-inline-flex float-start" role="search">
                      <select id="inputState" className="form-select w-50">
                          <option value="0">Search By...</option>
                          <option value="productName" >Product Name</option>
                          <option value="productId">Product ID</option>
                          <option value="productUpc">Product UPC</option>
                      </select>
                      <input className="form-control me-2 w-75" type="search" placeholder="Search" aria-label="Search"/>
                      <button className="btn btn-primary" type="submit">Search</button>
                    </form>

                    <button type="button" className="btn btn-success float-md-end" data-bs-toggle="modal" data-bs-target="#addProduct"><i className="bi bi-folder-plus fs-6"></i> Add Product</button>

                </div>

            <div className="container mt-5">
                <div className="accordion" id="accordionExample">
                    <div className="accordion-item">
                          <h2 className="accordion-header">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                              Habichuelas <span className="badge text-bg-secondary ms-2">ID: 568109</span> <span className="badge text-bg-primary ms-2">Total Products: 2</span>
                            </button>
                          </h2>
                          <div id="collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                            <div className="accordion-body">

                            <div className="row">
                                <div className="col">
                                    <div className="list-inline">
                                        <h5 className="text-primary list-inline-item">Category Name:</h5>
                                        <p className="list-inline-item">Habichuelas</p>
                                    </div>
                                    <div className="list-inline">
                                        <h5 className="text-primary list-inline-item">Category Description:</h5>
                                        <p className="list-inline-item"></p>
                                    </div>
                                    <div className="list-inline">
                                        <h5 className="text-primary list-inline-item">Low Stock Alert:</h5>
                                        <p className="list-inline-item"></p>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="d-flex justify-content-center my-3">
                                        <button type="button" className="btn btn-primary me-2">
                                            <i className="bi bi-pencil-square fs-6"></i> Edit
                                            </button>
                                        <button type="button" className="btn btn-danger"><i className="bi bi-trash3 fs-6"></i> Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>

            </body>
            <Footer />
        </div>
    )
}

export default Categories;