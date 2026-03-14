import axios from "axios";
import Head from "./head";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const rest = require('../../EndPoints')
function AdminLogin(){
    const navigate = useNavigate();
    let header = {
        headers: {
            "Content-type": "Application/json"
        }
    }


    function AdminLoginAction(e){
      e.preventDefault();

      let userName = document.getElementById("userName").value;
      let password = document.getElementById("password").value;
      if(userName.length==0){
        document.getElementById("namemsg").innerHTML="Field Required"
        e.preventDefault();
        return
      }else{
        document.getElementById("namemsg").innerHTML=""
      }
      if(password.length==0){
        document.getElementById("passwordMsg").innerHTML="Field Required"
        e.preventDefault();
        return
      }
      else{
        document.getElementById("passwordMsg").innerHTML=""

      }


      let admin = {
        "userName":userName,
        "password":password
      }
      console.log(rest.endPointAlog);
      console.log(admin);
      axios.post(rest.endPointAlog,admin,header)
      .then(response => {
        if(response.data==='Invalid Login Details'){
            alert("Invalid Login Details")
            return
        }
        else{
          Cookies.set("token",response.data['token'])
            Cookies.set("role",response.data['role'])
            navigate("/AdminHome")
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
                        <div className="text-center h4">Admin Login</div>
                        <form onSubmit={AdminLoginAction}>
                            <div class="mb-3 mt-3">
                                <label for="username" class="form-label">User Name</label>
                                <input type='text' id="userName"   class="form-control" placeholder="Enter Username"/>
                            <div className="text-danger mt-1" id="namemsg"></div>
                            </div>
                            <div class="mb-3 mt-3">
                                <label for="password" class="form-label">Password</label>
                                <input type='password' id="password"  className="form-control" placeholder="Enter Password"/>
                                <div className="text-danger mt-1" id="passwordMsg"></div>
                            </div>
                            <div className="d-grid">
                                <button type="submit" value="Login"  className="btn btn-primary" >Login</button>
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
export default AdminLogin;