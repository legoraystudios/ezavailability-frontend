import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
var pjson = require('../../../package.json');


function Footer() {
  return (
    <div>
        <footer className="sticky-bottom mt-5">
          <div className="footer">
              <div className='text-center bg-transparent'>
                  <p className="text-center text-body">Made with <i className="bi bi-balloon-heart text-danger"></i> by <a className="text-info text-decoration-none" href="https://legoray.com" target="_blank" rel="noreferrer">Legoncio</a> - Powered by EZAvailability | Version: {pjson.version}</p>
              </div>
          </div>
        </footer>

    </div>


  )
}

export default Footer