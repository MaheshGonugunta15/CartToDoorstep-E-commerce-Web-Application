import axios from "axios";
import Head from "./head";
const rest = require('../../EndPoints')
function CustomerRegistration(){
    let header = {
        headers: {
            "Content-type": "Application/json",
        }
    }

    function CustomerRegAction(e){
        e.preventDefault();
        let name = document.getElementById("name").value;
        let phone = document.getElementById("phone").value;
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let address = document.getElementById("address").value;
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
        if(address.length===0){
            document.getElementById("addressMsg").innerHTML="Address Required"
            e.preventDefault();
            return
        }else{
            document.getElementById("addressMsg").innerHTML=""
        }


        let customer = {
            "name":name,
            "phone":phone,
            "email":email,
            "password":password,
            "address":address
        }
        axios.post(rest.endPointCReg,customer,header)
        .then(response => {
          alert(response.data)
          document.getElementById("name").value="";
          document.getElementById("phone").value="";
          document.getElementById("email").value="";
          document.getElementById("password").value="";
          document.getElementById("address").value="";
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
                        <div className="text-center h4">New Customer Register Here</div>
                        <form onSubmit={CustomerRegAction}>
                            <div class="form-group mt-3">
                                <label >Name</label>
                                <input type='text'  id="name"   className="form-control" placeholder="Enter Name"/>
                               <div className="text-danger mt-1" id="nameMsg"></div>
                            </div>
                            <div class="form-group mt-1">
                                <label for="phone" class="form-label">Phone</label>
                                <input type='number'  id="phone" min={1}  className="form-control" placeholder="Enter Phone Number"/>
                                <div className="text-danger" id="phoneMsg"></div>
                            </div>
                            <div class="form-group mt-1">
                                <label for="email" class="form-label">Email</label>
                                <input type='email'  id="email"  className="form-control" placeholder="Enter Email Address"/>
                                <div className="text-danger" id="emailMsg"></div>
                            </div>
                            <div class="form-group mt-2">
                                <label for="password" class="form-label">Password</label>
                                <input type='password'id="password" className="form-control"  placeholder="Enter Password"/>
                                <div className="text-danger" id="passwordMsg"></div>
                            </div>
                            <div class="mb-3 mt-3">
                                <label for="address" class="form-label">Address</label>
                                <textarea id="address" className="form-control" placeholder="Address"></textarea>
                                <div className="text-danger" id="addressMsg"></div>
                            </div>
                            <div className="d-grid">
                                <input type="submit" value={"Register"} className="btn btn-primary"></input>
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
export default CustomerRegistration;