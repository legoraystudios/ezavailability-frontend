import React from 'react'
import { MDBContainer, MDBDropdown, MDBDropdownItem, MDBDropdownMenu, MDBDropdownToggle, MDBIcon, MDBNavbar, MDBNavbarBrand, MDBNavbarItem } from 'mdb-react-ui-kit';
import Logo from '../../Images/logo2.png'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";


function Navbar2() {
  return (
    <div>
        
        <MDBNavbar className="nav">
            <MDBContainer className="d-flex justify-content-left">
                <MDBNavbarBrand href='#' className="text-white">
                    <img src={Logo} height='60' alt='' loading='lazy'
                    /> EZAvailability
                </MDBNavbarBrand>
              <MDBNavbarItem>
                <MDBDropdown>
                  <MDBDropdownToggle tag='a' className='nav-link text-white' role='button'>
                  <MDBIcon className="text-white" fas icon="user" /> Signed in, Username
                  </MDBDropdownToggle>
                  <MDBDropdownMenu>
                    <MDBDropdownItem link>Action</MDBDropdownItem>
                    <MDBDropdownItem link>Another action</MDBDropdownItem>
                    <MDBDropdownItem link>Something else here</MDBDropdownItem>
                  </MDBDropdownMenu>
                </MDBDropdown>
              </MDBNavbarItem>
              </MDBContainer>
        </MDBNavbar>

    </div>


  )
}

export default Navbar2