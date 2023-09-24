import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';


function Alerts() {
  
    const queryParams = new URLSearchParams(window.location.search)

    if(queryParams.has("signout")) {
        return(
            <div>
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    Successfully Sigend Out!
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            </div>
        )
    } else if(queryParams.has("invalidcredentials")) {
        return(
            <div>
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    Your credentials are invalid. Please, try again.
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            </div>
        )
    } else if(queryParams.has("timeout")) {
        return(
            <div>
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    Session timed out.
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            </div>
        )
    } else if(queryParams.has("error")) {
        return(
            <div>
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    Something went wrong. Please, try again later.
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            </div>
        )
    } else if(queryParams.has("invalidperms")) {
        return(
            <div>
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    You don't have permissions to perform  this action.
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            </div>
        )
    } else {
        return(
        <div></div>
        )
    }

}

export default Alerts