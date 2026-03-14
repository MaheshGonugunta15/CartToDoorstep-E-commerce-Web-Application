import { Link, useNavigate } from "react-router-dom";
import Head from "./head";
import axios from "axios";
import Cookies from "js-cookie";
const rest = require('../../EndPoints')
function CustomerLogin(){
    const navigate = useNavigate();
    let header = {
        headers: {
            "Content-type": "Application/json",
        }
    }
    function CustomerLoginAction(e){
        e.preventDefault();
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let customer = {
            "email":email,
            "password":password
          
        }
        axios.post(rest.endPointClog,customer,header)
        .then(response => {
            if(response.data==='Invalid Login Details'){
                alert("Invalid Login Details")
                return
            }
            else{
             Cookies.set("token",response.data['token'])
             Cookies.set("role",response.data['role'])
             navigate("/CustomerHome")
            }

       })
       .catch(err => {
           alert("Something Went Wrong")
       })
    }
    return(
        <>
        <div className="customer_reg-img">
        <Head/>
        <div className="row">
                <div className="col-md-8">
                <img src="https://t3.ftcdn.net/jpg/02/41/43/18/360_F_241431868_8DFQpCcmpEPVG0UvopdztOAd4a6Rqsoo.jpg" style={{width:"100%",height:"120%"}}/>
                </div>
                <div className="col-md-4 mt-5">
                    <div className="card p-4 m-5">
                        <div className="text-center h4">Customer Login</div>
                        <form onSubmit={CustomerLoginAction}>
                            <div class="mb-3 mt-3">
                                <label htmlFor="email" class="form-label">Email</label>
                                <input type='text' id="email"   class="form-control" placeholder="Enter Email"/>
                            <div className="text-danger mt-1" id="namemsg"></div>
                            </div>
                            <div class="mb-3 mt-3">
                                <label>Password</label>
                                <input type='password' id="password"  className="form-control" placeholder="Enter Password"/>
                                <div className="text-danger mt-1" id="passwordMsg"></div>
                            </div>
                            <div className="d-grid">
                                <button type="submit" value="Login"  className="btn btn-primary" >Login</button>
                            </div>
                            <div className="mt-1">
                                New Customer ? <Link to={"/cReg"}>Register </Link>
                            </div>
                            
                        </form>
                    </div>
                    <div >
                    </div>
                </div>
            </div>
            </div>
        </>
    )
}
export default CustomerLogin;