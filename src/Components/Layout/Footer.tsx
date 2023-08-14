import React from 'react'
import { MDBFooter, MDBIcon } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";


function Footer() {
  return (
    <div>
        <footer>
            <MDBFooter bgColor='light' className='text-center text-lg-left'>
                <p className="text-center">Made with <MDBIcon className="text-danger" fas icon="heart" /> by <a className="text-info text-decoration-none" href="https://legoray.com" target="_blank" rel="noreferrer">Legoncio</a> - Powered by EZAvailability</p>
            </MDBFooter>
        </footer>

    </div>


  )
}

export default Footer