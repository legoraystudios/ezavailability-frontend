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
                    System | Successfully Sigend Out!
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            </div>
        )
    } else if(queryParams.has("invalidcredentials")) {
        return(
            <div>
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    System | Your credentials are invalid. Please, try again.
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            </div>
        )
    } else if(queryParams.has("timeout")) {
        return(
            <div>
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    System | Session timed out.
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            </div>
        )
    } else if(queryParams.has("error")) {
        return(
            <div>
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    System | Something went wrong. Please, try again later.
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            </div>
        )
    } else if(queryParams.has("invalidperms")) {
        return(
            <div>
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    System | You don't have permissions to perform  this action.
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            </div>
        )
    } else if(queryParams.has("accountdeleted")) {
        return(
            <div>
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    System | Account deleted successfully.
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            </div>
        )
    } else if(queryParams.has("accountcreated")) {
        return(
            <div>
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    System | Account created successfully.
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            </div>
        )
    } else if(queryParams.has("accountedited")) {
        return(
            <div>
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    System | Account edited successfully.
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            </div>
        )
    } else if(queryParams.has("createaccounterr")) {
        return(
            <div>
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <p>System | Please check the following: <br />
                       &nbsp;&bull; Password must have 8-16 characters.<br />
                       &nbsp;&bull; Password must contain at least a number.<br />
                       &nbsp;&bull; Password must be contain an uppercase letter.</p>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            </div>
        )
    } else if(queryParams.has("editaccounterr")) {
        return(
            <div>
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        <p>System | Something went wrong while editing the account. Please check your information and try again.</p>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            </div>
        )
    } else if(queryParams.has("createaccounterr01")) {
        return(
            <div>
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <p>System | Confirmation Password doesn't match.</p>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            </div>
        )
    } else if(queryParams.has("createaccounterr02")) {
        return(
            <div>
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <p>System | Please enter a valid Role ID.</p>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            </div>
        )
    } else if(queryParams.has("createaccounterr03")) {
        return(
            <div>
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <p>System | Email already exist in our records.</p>
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