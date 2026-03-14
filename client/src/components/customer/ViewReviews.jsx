import Cookies from "js-cookie";
import SellerHead from "../seller/head";
import CustomerHead from "./head";
import { useEffect, useState } from "react";
import axios from "axios";
const rest = require('../../EndPoints')
function ViewReviews(){
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let productId = params.get('productId');
    const[reviews,setReviews] = useState([])
    let header = {
        headers: {
            "Content-type": "Application/json",
            "Authorization": `Bearer ${Cookies.get('token')}`,
        }
    }
    useEffect(()=>{
        axios.get(rest.endPointProductReviews+"?productId="+productId,header)
        .then(response => {
            console.log(response.data);
            setReviews(response.data)
          
       })
       .catch(err => {
          console.log(err);
       })
    },[])

    return(
        <>
        {Cookies.get("role")==="seller"?<div><SellerHead/></div>:<></>}
        {Cookies.get("role")==="customer"?<div><CustomerHead/></div>:<></>}
        {reviews.length===0?<><div className="text-center h4 mt-5">Reviews Not Found</div></>:null}
        {reviews.length!=0?<><div className="text-center mt-1 h5">Total Reviews</div></>:null}

        <div className="container mt-1">
            
            <div className="text-center h5  mt-5" id="review" style={{lineHeight:"100px"}}></div>
            <div className="row">
            <div className="col-md-2"></div>
             <div className="col-md-10">
                <div className="row">
                    {reviews.map((review,index)=>
                    <div className="card p-3 mt-2">
                        <div className="row">
                        <div className="col-md-4">
                            <div className="" style={{fontSize:"12px"}}>Rating : <b>{review['rating']}</b></div>
                        </div>
                        <div className="col-md-4">
                            <div className="" style={{fontSize:"12px"}}>Review By : <b className="h6">{review['customerId']['name']}({review['customerId']['phone']})</b></div>
                        </div>
                        
                        </div>
                        <div className="card-body">
                            <div className="text-secondary " style={{fontSize:"12px"}}>Review</div>
                            <div className="h6 mt-1">{review['review']}</div>
                        </div>
                    </div>
                    )}
                </div>
   
            </div> 
            </div>
        </div>
        </>
    )
}
export default ViewReviews;