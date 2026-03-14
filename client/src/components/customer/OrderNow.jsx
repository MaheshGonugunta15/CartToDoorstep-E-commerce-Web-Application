import Cookies from "js-cookie";
import CustomerHead from "./head";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const rest = require('../../EndPoints')

function OrderNow(){
    const navigate = useNavigate();
    let header = {
        headers: {
            "Content-type": "Application/json",
            "Authorization": `Bearer ${Cookies.get('token')}`
        }
    }
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let totalPrice = params.get('totalPrice');
    let orderId = params.get('orderId');

    const PaymentAction = (e) =>{
        e.preventDefault();
        let nameOnCard = document.getElementById("nameOnCard").value;
        let cardNumber = document.getElementById("cardNumber").value;
        let cvv = document.getElementById("cvv").value;
        let expireDate = document.getElementById("expireDate").value;

        if(nameOnCard.length==0){
            document.getElementById("nameOncard-message").innerHTML="Enter NameOn Card";
            e.preventDefault();
            return
        }
        else{
            document.getElementById("nameOncard-message").innerHTML="";
        }

        if(cardNumber.length==0){
            document.getElementById("cardNumber-message").innerHTML="Enter CardNumber";
            e.preventDefault();
            return
        }else if(cardNumber.length!=16){
            document.getElementById("cardNumber-message").innerHTML="CardNumber Should Be 16";
            e.preventDefault();
            return
        }else{
            document.getElementById("cardNumber-message").innerHTML=""; 
        }
        if(cvv.length==0){
            document.getElementById("cvv-message").innerHTML="Enter Cvv";
            e.preventDefault();
            return
        }
        else if(cvv.length!=3){
            document.getElementById("cvv-message").innerHTML="Invalid Cvv"
            e.preventDefault();
            return
         }
        else{
        document.getElementById("cvv-message").innerHTML=""; 
        }

        if(expireDate.length==0){
            document.getElementById("date_message").innerHTML="Enter ExpDate";
            e.preventDefault();
            return
        }
        else if(expireDate.length!=5){
            document.getElementById("date_message").innerHTML="Invalid ExpDate"
            e.preventDefault();
            return
         }else{
            document.getElementById("date_message").innerHTML=""; 
        }

        let orderId = document.getElementById("orderId").value;
        axios.get(rest.endPointOrderNow+"?orderId="+orderId,header)
        .then(response => {
            alert(response.data);
            navigate("/Products")
            
        })
        .catch(err => {
            console.log(err)
        })
        
    }

    return(
        <>
        <CustomerHead/>
        <div className="container mt-3">
        <div className="row">
        <div className="col-md-3"></div>
        <div className="col-md-5 mt-2">
            <div className="card p-4 mt-3 ">
                <form id="OrderMedicineForm" onSubmit={PaymentAction}>
                    <input type="hidden" id="orderId" value={orderId}></input>
                    <input type="hidden" id="totalPrice" value={totalPrice}></input>
                    <div class="row"><div class="col-md-6">Payable  Price</div><div class="col-md-3 h5">$ {totalPrice} </div></div>
                        <div class="mt-2">
                            <label for="nameOnCard">Name on Card</label>
                            <input type="text" name="nameOnCard" id="nameOnCard" placeholder="Enter Name On Card" class="form-control" />
                            <div className="mt-1 text-danger" id="nameOncard-message"></div>
                        </div>
                        <div class="mt-2">
                            <label for="cardNumber">Card Number</label>
                            <input type="number" name="cardNumber" id="cardNumber" placeholder="Enter Card Number" class="form-control" />
                            <div className="mt-1 text-danger" id="cardNumber-message"></div>
                        </div>
                        
                        <div class="mt-2">
                            <label for="cvv">CVV</label>
                            <input type="text" name="cvv" id="cvv" placeholder="Enter CVV" class="form-control" />
                            <div className="mt-1 text-danger" id="cvv-message"></div>
                        </div>
                        <div class="mt-2">
                            <label for="expireDate">Expire Date</label>
                            <input type="text" name="expireDate" id="expireDate" placeholder="MM/YY" class="form-control mt-1" />
                            <div className="mt-1 text-danger" id="date_message"></div>
                        </div>
                    <input type="submit" value="Pay" class="btn btn-primary w-100 mt-2" />
                </form>
            </div>
        </div>
    </div>
</div>

        </>
    )
}
export default OrderNow;