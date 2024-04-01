import react, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../../Components/Layout/Navbar';
import Alerts from '../../Components/Layout/Alerts';

interface ResetParams {
    email: any,
    token: string,
}

function ResetPassword() {

    const [searchUrlParams, setSearchUrlParams] = useSearchParams();
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);
    const [sucessResponse, setSuccessResponse] = useState(false);
    
    const token = searchUrlParams.get("token");
    const [resetParams, setResetParams] = useState<ResetParams[]>([]);
    const payload = { token: token };

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    async function getResetParams() {
        
        let response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/auth/checkresettoken`, {
            method: "POST",
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          })
          
          if (response.status === 200) {
            const result = await response.json();
            setResetParams(result);
            setSuccessResponse(true);
            setIsLoaded(true);
          } else {
            setSuccessResponse(false);
            setIsLoaded(true);
          }
    }

    async function handleReset(event: any) {
        event.preventDefault();
        
        try {

            const payload = { token: token, password: password, confirmPassword: confirmPassword };

            let response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/auth/resetpasswd`, {
                method: "POST",
                credentials: 'include',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
              })
              
              if (response.status === 200) {
                navigate("/?passwordchanged");
              } else if (response.status === 404) {
                navigate("/?error");
              } else if (response.status === 400) {
                navigate("/?error");
              } else {
                navigate(window.location.pathname + "/?createaccounterr");
              }
            
        } catch (err) {
            console.log(err);
        }
    }

    
    useEffect(() => {
        document.title = "Reset Password | EZAvailability";
        getResetParams();
    }, []);

    return (
        <div>
            { 
                isLoaded ? (
                <>
                    {
                        sucessResponse == false ? (
                            <>
                                <div>
                                    <body>
                                        <Navbar />

                                        <form className="w-25 mx-auto mt-5">
                                            <h4 className="text-center">Invalid Reset Token</h4>

                                            <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                                System | The token you provide is invalid or has expired.
                                            </div>
                                            <a className="d-flex justify-content-center" href="/"><i className="bi bi-arrow-left-circle me-1"></i> Go back to Sign In</a>
                                        </form>
                                    </body>
                                </div>
                            </>
                        ) : (
                            <>
                            {
                                resetParams && resetParams.map (record => {
                                    return (
                                        <body>
                                            <Navbar />
                                            <form className="w-25 mx-auto mt-5" onSubmit={handleReset}>
                                                <h4 className="text-center">Change your Password</h4>
                                                <Alerts />
                                                <div className="mb-3">
                                                    <label htmlFor="exampleInputPassword1" className="form-label">Email Address</label>
                                                    <input type="email" className="form-control" placeholder={record.email} disabled />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                                                    <input type="password" className="form-control" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="exampleInputPassword1" className="form-label">Confirm Password</label>
                                                    <input type="password" className="form-control" placeholder="********" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                                </div>
                                                <div className="mt-3">
                                                    <button type="submit" className="btn btn-primary">Change Password</button>
                                                </div>
                                            </form>
                                        </body>
                                    )
                                })
                            }
                            </>
                        )
                    }
                </>
            ) : (
                <>
                    <div className="spinner-grow" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                </>
            )}
        </div>

    )
}

export default ResetPassword;