import { useEffect, useState } from "react";
import Head from "./head";
import axios from "axios";
const rest = require('../../EndPoints')

function SellerRegistration(){
    const[locations,setLocations] = useState([])
    let header = {
        headers: {
            "Content-type": "Application/json"
          
        }
    }

    useEffect(()=>{
        console.log(rest.endPointviewLocation);
        axios.get(rest.endPointviewLocation,header)
        .then(response => {
          console.log(response.data)
          setLocations(response.data)
          
       })
       .catch(err => {
          console.log(err);
       })
    },[])

    function SellerRegAction(e){
        e.preventDefault();
        let name = document.getElementById("name").value;
        let phone = document.getElementById("phone").value;
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let locationId = document.getElementById("locationId").value;

        if(name.length===0){
            document.getElementById("nameMsg").innerHTML="Name Required";
            e.preventDefault();
            return
        }else
        {
            document.getElementById("nameMsg").innerHTML="";   
        }
        if(phone.length===0){
            document.getElementById("phoneMsg").innerHTML="Phone Number Required";
            e.preventDefault();
            return
        }else if(phone.length!=10){
            document.getElementById("phoneMsg").innerHTML="Phone Should Be 10 Digits";
            e.preventDefault();
            return
        }else{
            document.getElementById("phoneMsg").innerHTML="";
        }

        if(email.length===0){
            document.getElementById("emailMsg").innerHTML="Email Required";
            e.preventDefault();
            return
        }else{
            document.getElementById("emailMsg").innerHTML="";
        }
        if(password.length===0){
            document.getElementById("passwordMsg").innerHTML="Password Required"
            e.preventDefault();
            return
        }else if(password.length<6){
            document.getElementById("passwordMsg").innerHTML="Password Should Be More Than 6 Required"
            e.preventDefault();
            return
        }else{
            document.getElementById("passwordMsg").innerHTML=""
        }
      
        let seller = {
            "name":name,
            "phone":phone,
            "email":email,
            "password":password,
            "locationId":locationId
        }
        axios.post(rest.endPointSReg,seller,header)
        .then(response => {
          alert(response.data)
          document.getElementById("name").value="";
          document.getElementById("phone").value="";
          document.getElementById("email").value="";
          document.getElementById("password").value="";
       })
       .catch(err => {
           alert("Something Went Wrong")
       })

    }
    return(
        <>
         <div className="customer_reg-img">
        <Head/>
        <div className="container-fluid">
        <div className="row">
                <div className="col-md-4"> </div>
                <div className="col-md-4 mt-4">
                    <div className="card p-3 m-2">
                        <div className="text-center h4">New Seller Register Here</div>
                        <form onSubmit={SellerRegAction}>
                            <div class="fomr-group mt-3">
                                <label >Name</label>
                                <input type='text'  id="name"   className="form-control" placeholder="Enter Name"/>
                                <div className="text-danger mt-1" id="nameMsg"></div>
                            </div>
                            <div class="form-group mt-1">
                                <label for="phone" class="form-label">Phone</label>
                                <input type='number'  id="phone"  className="form-control" placeholder="Enter Phone Number"/>
                                <div className="text-danger" id="phoneMsg"></div>
                            </div>
                            <div class="form-group mt-2">
                                <label for="email" class="form-label">Email</label>
                                <input type='email'  id="email"  className="form-control" placeholder="Enter Email Address" />
                                <div className="text-danger" id="emailMsg"></div>
                            </div>
                            <div class="form-group mt-2">
                                <label for="password" class="form-label">Password</label>
                                <input type='password'id="password" className="form-control"  placeholder="Enter Password" />
                                <div className="text-danger" id="passwordMsg"></div>
                            </div>
                            <div class="form-grooup mt-2">
                                <label for="locationId" class="form-label">Locations</label>
                                <select className="form-control" id="locationId">
                                    {locations.map((location,index)=>
                                    <option value={location['_id']}>{location['locationName']}</option>
                                    )}
                                </select>
                                
                            </div>
                            <div className="d-grid">
                                <input type="submit" value={"Register"} className="btn btn-primary mt-3"></input>
                            </div>
                            
                        </form>
                    </div>
                   
                </div>
            </div>
            </div>
            </div>
        </>
    )
}
export default SellerRegistration;