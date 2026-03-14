import { Link } from "react-router-dom";

function CustomerHead(){

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
                    <Link to='/CustomerHome'  className="nav-item nav-link">Customer Home</Link>
                    </li>
                     <li className="nav-item">
                    <Link to='/Products'  className="nav-item nav-link">Products</Link>
                    </li>
                   
                    <li className="nav-item">
                    <Link to='/viewOrders?status=ordered'  className="nav-item nav-link">Orders</Link>
                    </li>
                    <li className="nav-item">
                    <Link to='/viewOrders?status=history'  className="nav-item nav-link">Orders History</Link>
                    </li>
                    <li className="nav-item">
                    <Link to='/logout'  className="nav-item nav-link">Logout</Link>
                    </li>
                    
                </ul>
                </div>

                <div className="" style={{marginRight:"30px"}}>
                    <Link className="nav-link" to={"/viewOrders?status=cart"}><img src="https://thumbs.dreamstime.com/b/shop-cart-icon-buy-symbol-shopping-basket-sign-%C3%A2%E2%82%AC-vector-142876366.jpg" style={{width:"120%",height:"50px",borderRadius:"5px"}}></img></Link>
                </div>
            </nav>
        </div>
        </>
    )
}
export default CustomerHead;