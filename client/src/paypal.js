import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomerHead from "./components/customer/head";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
const rest = require('./EndPoints')
export default function Paypal() {
  let search = window.location.search;
  let params = new URLSearchParams(search);
  let totalPrice = params.get('totalPrice');
  let orderId = params.get('orderId');
  const navigate = useNavigate();
  const paypal = useRef();
  let header = {
    headers: {
        "Content-type": "Application/json",
        "Authorization": `Bearer ${Cookies.get('token')}`   
    }
}
  useEffect(() => {
    window.paypal
      .Buttons({
        createOrder: (data, actions, err) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: "Cool looking table",
                amount: {
                  currency_code: "USD",
                  value: totalPrice,
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          axios.get(rest.endPointOrderNow+"?orderId="+orderId+"&totalPrice="+totalPrice,header)
          .then(response => {
              navigate("/viewOrders?status=ordered")
              
          })
          .catch(err => {
              console.log(err)
          })
          
         
        },
        onError: (err) => {
          console.log(err);
          navigate("/Products")
        },
      })
      
      .render(paypal.current);
     
  }, []);

  return (
   
    <div>
       <CustomerHead/>
      <div ref={paypal} className="text-center mt-5"></div>
    </div>
  );
}