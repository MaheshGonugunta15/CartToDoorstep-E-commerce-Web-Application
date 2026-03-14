import { useNavigate } from "react-router-dom";
import CustomerHead from "./head";
import Cookies from "js-cookie";
import axios from "axios";
const rest = require('../../EndPoints')

function AddAmount(){
    const navigate = useNavigate();
    let header = {
        headers: {
            "Content-type": "Application/json",
            "Authorization": `Bearer ${Cookies.get('token')}`
        }
    }
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let customerId = params.get('customerId');

    function WalletAction(e){
        e.preventDefault();
        let amount = document.getElementById("amount").value;
        let customerId = document.getElementById("customerId").value;
        let wallet = {
            "customerId":customerId,
            "amount":amount
        }
        axios.post(rest.endPointCAddWallet,wallet,header)
        .then(response => {
            alert(response.data);
            navigate("/CustomerHome")
          
       })
       .catch(err => {
          console.log(err);
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
            <div className="text-center h6">Add Amount To Wallet</div>
                <form onSubmit={WalletAction}>
                    <input type="hidden" id="customerId" value={customerId}></input>
                    <label>Amount</label>
                    <input type="number" id="amount" min={1} placeholder="Enter Amount" className="form-control" required></input>
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
                    <input type="submit" value="Add Amount To Wallet" class="btn btn-primary w-100 mt-2" />
                </form>
            </div>
        </div>
    </div>
</div>
        
        </>
    )
}
export default AddAmount;