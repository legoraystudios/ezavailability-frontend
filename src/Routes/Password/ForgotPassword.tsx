import react, { useEffect, useState } from 'react';
import Navbar from '../../Components/Layout/Navbar';
import Alerts from '../../Components/Layout/Alerts';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {

    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    async function requestPasswordReset(event: any) {

        event.preventDefault();

        const payload = { email: email };

        try {
            let response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/auth/forgotpasswd`, {
              method: "POST",
              credentials: 'include',
              headers: {
              'Content-Type': 'application/json'
              },
              body: JSON.stringify(payload)
            })
            
            if (response.status === 200) {
              navigate('/?forgotpasswdsuccess');
            } else {
              navigate('?emailnotfound');
            }
          } catch (err) {
            console.log(err)
          }

    }


    useEffect(() => {
        document.title = "Forgot Password | EZAvailability";
    }, []);

    return (
        <div>
            <body>
                <Navbar />

                <form className="w-25 mx-auto mt-5" onSubmit={requestPasswordReset}>

                    <Alerts />

                    <h4 className="text-center">Reset your Password</h4>
                    <p className="mt-3">Enter your emaill address linked to EZAvailability account in order to generate a reset password link.</p>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Email Address</label>
                        <input type="email" className="form-control" placeholder="someone@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="mt-3">
                        <div className="mb-3 float-end">
                            <a className="d-flex" href="/"><i className="bi bi-arrow-left-circle me-1"></i> Go back to Sign In</a>
                        </div>
                        <button type="submit" className="btn btn-primary">Reset Password</button>
                    </div>

                </form>
            </body>
        </div>
    )
}

export default ForgotPassword;