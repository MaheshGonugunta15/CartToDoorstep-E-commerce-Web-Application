import { Link } from "react-router-dom";

function Head(){
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
                    <Link to='/'  className="nav-item nav-link">Home</Link>
                    </li>
                    <li className="nav-item">
                    <Link to='/alog' className="nav-item nav-link">Admin</Link>
                    </li>
                    <li className="nav-item">
                    <Link to='/slog' className="nav-item nav-link">Seller</Link>
                    </li>
                    <li className="nav-item">
                    <Link to='/clog'  className="nav-item nav-link">Customer</Link>
                    </li>
                    <li className="nav-item">
                    <Link to='/creg'  className="nav-item nav-link">New Customer Signup</Link>
                    </li>
                </ul>
                </div>
            </nav>
        </div>
        </>
    )
}
export default Head;