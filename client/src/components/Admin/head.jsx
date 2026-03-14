import { Link } from "react-router-dom";

function AdminHead(){
    return(
        <>
        <div>
            <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
                <a className="navbar-brand" href="javascript:void(0)">Online Shopping</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="mynavbar">
                <ul className="navbar-nav me-auto">
                    <li className="nav-item">
                    <Link to='/AdminHome'  className="nav-item nav-link">Admin Home</Link>
                    </li>
                    <li className="nav-item">
                    <Link to='/Locations'  className="nav-item nav-link">Locations</Link>
                    </li>
                    <li className="nav-item">
                    <Link to='/Categories'  className="nav-item nav-link">Categories</Link>
                    </li>
                    <li className="nav-item">
                    <Link to='/SubCategories'  className="nav-item nav-link">SubCategories</Link>
                    </li>
                    <li className="nav-item">
                    <Link to='/Sellers'  className="nav-item nav-link">View Sellers</Link>
                    </li>
                         
                    <li className="nav-item">
                    <Link to='/logout'  className="nav-item nav-link">Logout</Link>
                    </li>
                    
                </ul>
                </div>
            </nav>
        </div>
        </>
    )
}
export default AdminHead;