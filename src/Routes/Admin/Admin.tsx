import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {

    const navigate = useNavigate();

    useEffect(() => {
        navigate(`/dashboard/admin/accounts`);
    }, [])

    return(
        <div>
            <div className="spinner-grow" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )

}

export default Admin;