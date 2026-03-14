import { Link } from "react-router-dom";

function SellerHead(){
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
                    <Link to='/SellerHome'  className="nav-item nav-link">Seller Home</Link>
                    </li>
                    <li className="nav-item">
                    <Link to='/discounts'  className="nav-item nav-link">Discounts</Link>
                    </li>
                    <li className="nav-item">
                    <Link to='/AddProducts'  className="nav-item nav-link">Add Products</Link>
                    </li>
                    <li className="nav-item">
                    <Link to='/Products'  className="nav-item nav-link">Products</Link>
                    </li>
                    <li className="nav-item">
                    <Link to='/viewOrders?status=ordered'  className="nav-item nav-link">Orders</Link>
                    </li>
                    <li className="nav-item">
                    <Link to='/viewOrders?status=dispatched'  className="nav-item nav-link">Dispatched Orders</Link>
                    </li>
                    <li className="nav-item">
                    <Link to='/viewOrders?status=history'  className="nav-item nav-link">Orders History</Link>
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
export default SellerHead;