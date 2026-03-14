import Cookies from "js-cookie";
import SellerHead from "./head";
import { useEffect, useState } from "react";
import axios from "axios";
import $ from 'jquery'
const rest = require('../../EndPoints')

function Discounts(){
    const[count,setCount] = useState(0)
    const[discounts,setDiscounts]  = useState([])

    let header = {
        headers: {
            "Content-type": "Application/json",
            "Authorization": `Bearer ${Cookies.get('token')}`   
        }
    }
    useEffect(()=>{
        axios.get(rest.endPointViewDiscount,header)
        .then(response => {
          console.log(response.data)
          setDiscounts(response.data)
          
       })
       .catch(err => {
          console.log(err);
       })
    },[count])

    const AddDiscount = e =>{
        e.preventDefault();
        let couponCode = document.getElementById("couponCode").value;
        let discount = document.getElementById("discount").value;
        let expiryDate = document.getElementById("expiryDate").value;
        let discount2 = {
            "couponCode":couponCode,
            "discount":discount,
            "expiryDate":expiryDate
        }
        axios.post(rest.endPointAddDiscount,discount2,header)
        .then(response => {
            alert(response.data)
            setCount(count+1)
        })
        .catch(err => {
            alert("Something Went Wrong")
        })


    }
    $(document).ready(function(){
        let dtToday = new Date();
        let month = dtToday.getMonth() + 1;
        let day = dtToday.getDate();
        let year = dtToday.getFullYear();
        if(month < 10)
            month = '0' + month.toString();
        if(day < 10)
            day = '0' + day.toString();
        var today = year + '-' + month + '-' + day;
        $("#expiryDate").attr("min",today)
    });
    return(
        <>
         <div className="product-img">
        <SellerHead/>
        <div className="container-fluid mt-5">
            <div className="row">
                <div className="col-md-4 mt-1">
                   <div className="card p-3">
                    <div className="text-center h3">Add Discount</div>
                       <form onSubmit={AddDiscount}>
                          <div className="form-group">
                              <label>Coupn</label>
                              <input type="text" id="couponCode" className="form-control mt-1" placeholder="Coupon Code"></input>
                          </div>
                          <div className="form-group">
                              <label>Discount (%)</label>
                              <input type="number" min={1} id="discount" max={100} className="form-control mt-1" placeholder="Discount %"></input>
                          </div>
                          <div className="form-group">
                              <label>Exp Date</label>
                              <input type="date"  id="expiryDate" className="form-control mt-1"></input>
                          </div>
                          <input type="submit" value={"Add Discount"} className="btn btn-primary w-100 mt-3"></input>
                       </form>
                   </div>
                </div>
                <div className="col-md-8">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Discount Id</th>
                                <th>Coupon Code</th>
                                <th>Discount (%)</th>
                                <th>Expiry Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {discounts.map((discount,index)=>
                              <tr>
                                <td>{index+1}</td>
                                <td>{discount['couponCode']}</td>
                                <td>{discount['discount']}</td>
                                <td>{discount['expiryDate'].split(".")[0].replace("T", " ").substring(0, 16)}</td>
                              </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        </div>
        </>
    )
}
export default Discounts;