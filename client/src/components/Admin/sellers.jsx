import Cookies from "js-cookie";
import AdminHead from "./head";
import { useEffect, useState } from "react";
import axios from "axios";
const rest = require('../../EndPoints')
function Sellers(){
    const[sellers,setSeller] = useState([])
    let header = {
        headers: {
            "Content-type": "Application/json",
            "Authorization": `Bearer ${Cookies.get('token')}`
        }
    }
    useEffect(()=>{
        axios.get(rest.endPointSellers,header)
        .then(response => {
          console.log(response.data)
          setSeller(response.data)
          
       })
       .catch(err => {
          console.log(err);
       })
    })

    function statusAction(sellerId){
        axios.get(rest.endPointStatusAction+"?sellerId="+sellerId,header)
        .then(response => {
          console.log(response.data)
         
          
       })
       .catch(err => {
          console.log(err);
       })
    }

    return(
        <>
        <div className="product-img">
        <AdminHead/>
        <div className="container mt-4">
          <div className="text-center h6">Sellers List</div>
            <table className="table table-bordered mt-4">
              <thead>
                <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Action</th>
                </tr>
               
              </thead>
              <tbody>
                {sellers.map((seller,index)=>
                <tr>
                    <td>{seller['name']}</td>
                    <td>{seller['email']}</td>
                    <td>{seller['phone']}</td>
                    <td>{seller['status']}</td>
                    <td>
                        {seller['status']==='UnAuthorized'?<>
                          <button className="btn btn-success w-100" onClick={()=>statusAction(seller['_id'])}>Activate</button>
                        </>:<>
                        <button className="btn btn-danger w-100" onClick={()=>statusAction(seller['_id'])}>Deactivate</button>
                        </>}
                    </td>
                </tr>
                )}
              </tbody>
            </table>
        </div>
        </div>
        </>
    )
}
export default Sellers;