import { useEffect, useState } from "react";
import CustomerHead from "./head";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const rest = require('../../EndPoints')

function CustomerHome(){
    const[profile,setProfile] = useState([])
    const[wallet,setWallet] = useState([])
    const navigate = useNavigate();
    let header = {
        headers: {
            "Content-type": "Application/json",
            "Authorization": `Bearer ${Cookies.get('token')}`
        }
    }
    useEffect(()=>{
        axios.get(rest.endPointCProfile,header)
        .then(response => {
            console.log(response.data);
            setProfile(response.data)
          
       })
       .catch(err => {
          console.log(err);
       })
    },[])
    useEffect(()=>{
        axios.get(rest.endPointCWallet,header)
        .then(response => {
            console.log(response.data);
            setWallet(response.data)
          
       })
       .catch(err => {
          console.log(err);
       })
    },[])

    function AddAmountAction(e){
        let customerid = document.getElementById("customerid").value;
        navigate("/AddAmount?customerId="+customerid)
    }
    return(
        <>
        <div className="customer_home-img">
        <CustomerHead/>
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-4"></div>
                <div className="col-md-5 mt-5">
                  <div className="card p-3">
                    
                    <div className="text-center h4">{profile['name']}</div>
                    <div className="text-center h6">Contact : {profile['phone']}</div>
                    <hr />
                  <div className="">Wallet Amount : $ <b>{wallet['amount']}</b></div>
                  <div className="">
                    <form onSubmit={AddAmountAction}>
                        <input type="hidden" id="customerid" value={profile['_id']}></input>
                        <input type="submit" value={"Add Amount To Wallet"} className="btn btn-primary mt-3" style={{fontSize:"13px"}}></input>
                    </form>
                  </div>
                  </div>
                 
                </div>
            </div>
        </div>
        </div>
        </>
    )
}
export default CustomerHome;