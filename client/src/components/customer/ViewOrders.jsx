import Cookies from "js-cookie";
import SellerHead from "../seller/head";
import CustomerHead from "./head";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
const rest = require('../../EndPoints')

function ViewOrders(){
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let status = params.get('status');
    const navigate = useNavigate();
    const[customerOders,setOrders] = useState([])
    let role = Cookies.get("role")
    const[count,setCount] = useState(0)
    const[wallet,setProfile] = useState([])
    let header = {
        headers: {
            "Content-type": "Application/json",
            "Authorization": `Bearer ${Cookies.get('token')}`   
        }
    }
    
    useEffect(()=>{
        axios.get(rest.endPointGetWallet,header)
        .then(response => {
            setProfile(response.data)
          
       })
       .catch(err => {
          console.log(err);
       })
    },[])

    useEffect(()=>{
        axios.get(rest.endPointViewOrders+"?status="+status+"&role="+role,header)
        .then(response => {
            setOrders(response.data)
          
       })
       .catch(err => {
          console.log(err);
       })
    },[count,status])

    const removeCart = e =>{
        e.preventDefault();
        let orderItemId = e.target[0].value;
        let orderId = e.target[1].value;
        axios.get(rest.endPointRemoveCart+"?orderItemId="+orderItemId+"&orderId="+orderId,header)
        .then(response => {
           alert(response.data);
           setCount(count+1)
          
       })
       .catch(err => {
          console.log(err);
       })

    }
    const OrderNow = e =>{
        e.preventDefault();
        let orderId = e.target[0].value;
        let totalPrice = e.target[1].value;
        let couponCode = e.target[2].value;
        if(couponCode!=""){
            axios.get(rest.endPointDiscountValidation+"?couponCode="+couponCode+"&orderId="+orderId,header)
                .then(response => {
                    if(response.data===0){
                        alert("Invalid Coupon")
                        return
                    }else{
                        let discount = response.data['discount'];
                        let discount2 = parseInt(totalPrice) * parseFloat(discount/100)
                        let totalPrice2 = parseInt(totalPrice)-parseInt(discount2)
                        navigate("/paypal?orderId="+orderId+"&totalPrice="+totalPrice2)
                    }
                  
                  })
                     .catch(err => {
                    console.log(err);
                 })
        }else{
            navigate("/paypal?orderId="+orderId+"&totalPrice="+totalPrice)
        }
       

        

    }

    const PayThroughWallet = e =>{
        e.preventDefault();
        let orderId = e.target[0].value;
        let totalPrice = e.target[1].value;
        let couponCode = e.target[2].value;
        let wallet = e.target[3].value;
        console.log(wallet);
        if (couponCode!=""){
            axios.get(rest.endPointDiscountValidation+"?couponCode="+couponCode+"&orderId="+orderId,header)
                .then(response => {
                    console.log(response.data);
                    if(response.data===0){
                        alert("Invalid Coupon")
                        return
                    }else{
                        let discount = response.data['discount'];
                        let discount2 = parseInt(totalPrice) * parseFloat(discount/100)
                        let totalPrice2 = parseInt(totalPrice)-parseInt(discount2)
                        console.log(console.log(totalPrice2));
                        console.log(wallet);
                        axios.get(rest.endPointPayThroghWallet+"?orderId="+orderId+"&wallet="+wallet+"&totalPrice="+totalPrice2,header)
                          .then(response => {
                              alert(response.data);
                              navigate("/viewOrders?status=ordered")
                              
                          })
                          .catch(err => {
                              console.log(err)
                          })
                    }
                 
                  })
                     .catch(err => {
                    console.log(err);
                 })
        }else{
            axios.get(rest.endPointPayThroghWallet+"?orderId="+orderId+"&wallet="+wallet+"&totalPrice="+totalPrice,header)
            .then(response => {
              alert(response.data);
              navigate("/viewOrders?status=ordered")
              
          })
          .catch(err => {
              console.log(err)
          })
        }
    }
    const dispatchOrder = e =>{
        e.preventDefault();
        let orderId = e.target[0].value;
        axios.get(rest.endPointDispatchOrder+"?orderId="+orderId,header)
        .then(response => {
           alert(response.data);
           navigate("/viewOrders?status=dispatched")
          
       })
       .catch(err => {
          console.log(err);
       })
    }
    const makeAsRecieved = e =>{
        e.preventDefault();
        let orderId = e.target[0].value;
        axios.get(rest.endPointMakeAsRecieved+"?orderId="+orderId,header)
        .then(response => {
           alert(response.data);
           navigate("/viewOrders?status=history")
          
       })
       .catch(err => {
          console.log(err);
       })
    }

    const GiveRating = e =>{
        e.preventDefault();
        let orderItemId = e.target[0].value;
        let productId = e.target[1].value;
        navigate("/giveRating?orderItemId="+orderItemId+"&productId="+productId)
    }

    return(
        <>
        <div className="product-img">
        {Cookies.get("role")==="seller"?<div><SellerHead/></div>:<></>}
        {Cookies.get("role")==="customer"?<div><CustomerHead/></div>:<></>}
        {status==='cart'?<>
        {customerOders.length===0?<><div className="text-center mt-5 h3">Cart Empty</div></>:null}
        </>:<></>}
        {status==='ordered'?<>
        {customerOders.length===0?<><div className="text-center mt-5 h3">Orders Empty</div></>:null}
        </>:<></>}
        {status==='dispatched'?<>
        {customerOders.length===0?<><div className="text-center mt-5 h3">Orders Empty</div></>:null}
        </>:<></>}
        {status==='history'?<>
        {customerOders.length===0?<><div className="text-center mt-5 h3">Orders Empty</div></>:null}
        </>:<></>}
        
       
        
        <div className="container mt-3">
           <div className="row">
           
             {customerOders.map((customerOder,index)=>
               <div className="col-md-12">
                <div className="card p-2 mt-2">
                {customerOder['order']['status']==='cart'?<>
                    <div className="text-center h3 text-info" style={{textTransform: "uppercase"}}>{customerOder['order']['status']}</div>
                </>:<></>}
                {customerOder['order']['status']==='ordered'?<>
                    <div className="text-center h3 text-info" style={{textTransform: "uppercase"}}>{customerOder['order']['status']}</div>
                </>:<></>}
                {customerOder['order']['status']==='dispatched'?<>
                    <div className="text-center h3 text-info" style={{textTransform: "uppercase"}}>{customerOder['order']['status']}</div>
                </>:<></>}
                {customerOder['order']['status']==='Order Received'?<>
                    <div className="text-center h3 text-info" style={{textTransform: "uppercase"}}>{customerOder['order']['status']}</div>
                </>:<></>}
                <div className="row">
                    <div className="col-md-8">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Ordered</th>
                                    <th>Product Price</th>
                                    <th>Total Price</th>
                                    {status==='cart'?<>
                                    <th>Action</th>
                                    </>:<></>}
                                   
                                   
                                </tr>
                            </thead>
                            <tbody>
                                {customerOder['orderItems'].map((orderItem,index)=>
                                <tr>
                                    <td><img src={'data:image/jpeg;base64,'+orderItem['productId']['picture']}  style={{height:'40px',width:'50%'}} /><br></br>{orderItem['productId']['productName']}<br></br>
                                    {Cookies.get("role")==="customer"?<>
                                    {orderItem['status']==='Received'?<>
                                        <form onSubmit={GiveRating}>
                                           <input type="hidden" id="orderItemId" value={orderItem['_id']}></input>
                                           <input type="hidden" id="productId" value={orderItem['productId']['_id']}></input>
                                            <input type="submit" value={"Give Rating"} className="btn btn-primary" style={{fontSize:"13px"}}></input>
                                        </form>
                                    </>:<></>}
                                    </>:<></>}
                                    
                                    </td>
                                    <td>{orderItem['quantity']}</td>
                                    <td>$ {orderItem['productId']['price']}</td>
                                    <td>$ {parseInt(orderItem['quantity'])*parseInt(orderItem['productId']['price'])}</td>
                                    {customerOder['order']['status']==='cart'?<>
                                     <td>
                                         <form onSubmit={removeCart}>
                                            <input type="hidden" id="orderItemId" value={orderItem['_id']}></input>
                                            <input type="hidden" id="orderId" value={customerOder['order']['_id']}></input>
                                            <input type="submit" value={"Remove"} className="btn btn-danger" style={{fontSize:"13px"}}></input>
                                         </form>
                                     </td>
                                    </>:<></>}
                                    
                                    
                                </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-4">
                        <div className="card-header p-3">
                            <div className="text-center h6">Order Details<hr></hr></div>
                          <div className="h3" >$ {customerOder['order']['totalPrice']}</div>
                          <div className="text-secondary" style={{fontSize:"13px"}}>Ordered On</div>
                          <div className="h6 mt-1" style={{fontSize:"11px"}}>{(new Date(customerOder['order']['date'])).toLocaleDateString()}</div>
                          <div className="text-secondary mt-1" style={{fontSize:"13px"}}>Ordered By</div>
                          <div className="h6 mt-1" style={{fontSize:"11px"}}>{customerOder['order']['customerId']['name']} (customer)</div>
                          <div className="text-secondary mt-1" style={{fontSize:"13px"}}>Seller</div>
                          <div className="h6" style={{fontSize:"13px"}}>{customerOder['order']['sellerId']['name']} (seller)</div>
                          {Cookies.get("role")==='customer'?<>
                          {customerOder['order']['status']==='cart'?<>
                          {parseInt(customerOder['order']['totalPrice'])>parseInt(wallet['amount'])?<>
                          <div className="text-danger">Insufficient Amount :$ {wallet['amount']} In Wallet<br></br><div className="text-primary">Pay Through Paypal Account</div></div>
                          <form onSubmit={OrderNow}>
                                <input type="hidden" id="orderId" value={customerOder['order']['_id']}></input>
                                <input type="hidden" id="totalPrice" value={customerOder['order']['totalPrice']}></input>
                                <input type="text" id="couponCode" placeholder="Coupon Code" className="form-control mt-2"></input>
                                <input type="submit" value={"Pay Through Paypal"} className="btn btn-warning mt-3" style={{fontSize:"13px"}}></input>
                            </form>
                          </>:<>
                          <form onSubmit={PayThroughWallet}>
                                <input type="hidden" id="orderId" value={customerOder['order']['_id']}></input>
                                <input type="hidden" id="totalPrice" value={customerOder['order']['totalPrice']}></input>
                                <input type="text" id="couponCode" placeholder="Coupon Code" className="form-control mt-1"></input>
                                <input type="hidden" id="wallet" value={wallet['amount']} className="form-control mt-1"></input>
                                <input type="submit" value={"Pay Through Wallet"} className="btn btn-primary mt-3" style={{fontSize:"13px"}}></input>
                            </form>
                          </>}
                            
                          </>:<></>}
                          {customerOder['order']['status']==='dispatched'?<>
                            <form onSubmit={makeAsRecieved}>
                                <input type="hidden" id="orderId" value={customerOder['order']['_id']}></input>
                                <input type="submit" value={"Make As Recieved"} className="btn btn-primary" style={{fontSize:"13px"}}></input>
                            </form>
                          </>:<></>}
                          </>:<></>}
                          {Cookies.get("role")==='seller'?<>
                          {customerOder['order']['status']==='ordered'?<>
                            <form onSubmit={dispatchOrder}>
                                <input type="hidden" id="orderId" value={customerOder['order']['_id']}></input>
                                <input type="submit" value={"Dispatch Order"} className="btn btn-primary" style={{fontSize:"13px"}}></input>
                            </form>
                          </>:<></>}
                          </>:<></>}
                          
                        </div>
                    </div>
                </div>
                </div>
               </div>
             )}
           </div>
        </div>
        </div>
        </>
    )
}
export default ViewOrders;