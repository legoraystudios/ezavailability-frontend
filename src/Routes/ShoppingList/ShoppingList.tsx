import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar2 from "../../Components/Layout/Navbar2";
import Footer from "../../Components/Layout/Footer";

const ShoppingList = () => {

    useEffect(() => {
        document.title = "Shopping List | EZAvailability";
    }, [])
    
    return(
        <div>
            <Navbar2 />

            <div className="container mt-5">
                <a href={`${process.env.REACT_APP_BASENAME}dashboard`}><i className="bi bi-arrow-90deg-up"></i> Dashboard</a>
                <h3>Shopping List</h3>
                    <div className="row">
                        <div className="col mt-3">
                            <h4>My List</h4>

                        </div>
                        <div className="col mt-3">
                            <h4>Available Items</h4>

                            <div className="accordion" id="accordionExample">

                                <div className="container">
                                    <div className="border rounded-1 p-3">
                                            <a className="fs-6">Garbanzos Econo</a>
                                            <span className="badge text-bg-primary ms-2 text-decoration-none">Habichuelas</span>
                                            <span className="badge text-bg-success text-white ms-2 text-decoration-none">On Hand: 6</span>
                                            <button type="button" className="btn btn-success float-md-end"><i className="bi bi-cart-plus fs-6"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>

            <Footer />
        </div>
    )
    
}

export default ShoppingList;