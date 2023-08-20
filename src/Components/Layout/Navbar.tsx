import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Logo from '../../Images/logo2.png'


function Navbar() {
  return (
    <div>

        <nav className="nav py-1">
          <div className="container-fluid d-flex justify-content-center">
            <a className="navbar-brand text-white fs-5" href="#">
              <img src={Logo} height='80' alt='' loading='lazy'
              /> EZAvailability
            </a>
          </div>
        </nav>

    </div>

  )
}

export default Navbar