import React from 'react'
import { MDBContainer, MDBNavbar, MDBNavbarBrand } from 'mdb-react-ui-kit';
import Logo from '../../Images/logo2.png'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";


function Navbar() {
  return (
    <div>
        
        <MDBNavbar className="nav">
            <MDBContainer className="d-flex justify-content-center">
                <MDBNavbarBrand href='#' className="text-white">
                    <img src={Logo} height='60' alt='' loading='lazy'
                    /> EZAvailability
                </MDBNavbarBrand>
            </MDBContainer>
        </MDBNavbar>

    </div>


  )
}

export default Navbar