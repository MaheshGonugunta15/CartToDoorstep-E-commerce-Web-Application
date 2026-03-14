import Cookies from "js-cookie";
import AdminHead from "./head";
import { useEffect, useState } from "react";
import axios from "axios";
const rest = require('../../EndPoints')

function Categories(){
    const[categoryies,setCategory] = useState([])
    const[count,setCount] = useState(0)
    let header = {
        headers: {
            "Content-type": "Application/json",
            "Authorization": `Bearer ${Cookies.get('token')}`
        }
    }

    useEffect(()=>{
        axios.get(rest.endPointviewCategory,header)
        .then(response => {
          console.log(response.data)
          setCategory(response.data)
          
       })
       .catch(err => {
          console.log(err);
       })
    },[count])


    function CategoryAction(e){
        e.preventDefault();
        let categoryName = document.getElementById("categoryName").value;
        if(categoryName.length==0){
            document.getElementById("categoryMsg").innerHTML="Category Requried"
            e.preventDefault();
            return
        }
        else{
            document.getElementById("categoryMsg").innerHTML=""
        }
        let category = {
            "categoryName":categoryName
        }
        axios.post(rest.endPointAddCategory,category,header)
       .then(response => {
         alert(response.data)
         document.getElementById("categoryName").value="";
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
        <div className="text-center h4">Categories</div>
           <div className="row">
            <div className="col-md-4">
                <div className="card p-3 mt-5">
                    <div className="text-center h4">Category</div>
                    <form onSubmit={CategoryAction}>
                        <div className="form-group">
                            <input type="text" id="categoryName"  placeholder="Category Nane" className="form-control mt-1"></input>
                        <div className="text-danger mt-1" id="categoryMsg"></div>
                        </div>
                        <input type="submit" value={"Add Category"} className="btn btn-primary w-100 mt-2"></input>
                    </form>
                </div>
            </div>
            <div className="col-md-8 mt-5">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                          <th>Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categoryies.map((category,index)=>
                        <tr>
                            <td>{category['categoryName']}</td>
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
export default Categories;