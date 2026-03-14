import axios from "axios";
import AdminHead from "./head";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
const rest = require('../../EndPoints')
function Locations(){
    const[count,setCount] = useState(0)
    const[locations,setLocations] = useState([])
    let header = {
        headers: {
            "Content-type": "Application/json",
            "Authorization": `Bearer ${Cookies.get('token')}`
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
    },[count])

    function LocationAction(e){
        e.preventDefault();
        let locationName = document.getElementById("locationName").value;
        if(locationName.length==0){
            document.getElementById("locationMsg").innerHTML="Location Requried"
            e.preventDefault();
            return
        }
        else{
            document.getElementById("locationMsg").innerHTML=""
        }
        let location = {
            "locationName":locationName
        }
        axios.post(rest.endPointAddLocation,location,header)
       .then(response => {
         alert(response.data)
         document.getElementById("locationName").value="";
         setCount(count+1)
      })
      .catch(err => {
          alert("Something Went Wrong")
      })
    }
    return(
        <>
        <div className="product-img">
        <AdminHead/>
        <div className="container mt-3">
        <div className="text-center h4">Locations</div>
           <div className="row">
            <div className="col-md-4">
                <div className="card p-3 mt-5">
                    <div className="text-center h4">Location</div>
                    <form onSubmit={LocationAction}>
                        <div className="form-group">
                            <input type="text" id="locationName"  placeholder="Location Nane" className="form-control mt-1"></input>
                        <div className="text-danger mt-1" id="locationMsg"></div>
                        </div>
                        <input type="submit" value={"Add Location"} className="btn btn-primary w-100 mt-2"></input>
                    </form>
                </div>
            </div>
            <div className="col-md-8 mt-5">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                          <th>Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {locations.map((location,index)=>
                        <tr>
                            <td>{location['locationName']}</td>
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
export default Locations;