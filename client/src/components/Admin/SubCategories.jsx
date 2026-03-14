import Cookies from "js-cookie";
import AdminHead from "./head";
import { useEffect, useState } from "react";
import axios from "axios";
const rest = require('../../EndPoints')

function SubCategories(){
    const[categoryies,setCategory] = useState([])
    const[subCategoryies,setSubCategory] = useState([])
    let header = {
        headers: {
            "Content-type": "Application/json",
            "Authorization": `Bearer ${Cookies.get('token')}`
        }
    }

    useEffect(()=>{
        axios.get(rest.endPointviewCategory,header)
        .then(response => {
          setCategory(response.data)
          
       })
       .catch(err => {
          console.log(err);
       })
    })
    useEffect(()=>{
        axios.get(rest.endPointViewSubCategory,header)
        .then(response => {
            console.log(response.data);
            setSubCategory(response.data)
          
       })
       .catch(err => {
          console.log(err);
       })
    })

    function SubCategoryAction(e){
        e.preventDefault();
        let subCategoryName = document.getElementById("subCategoryName").value;
        let categoryId = document.getElementById("categoryId").value;
        if(subCategoryName.length==0){
            document.getElementById("subCategoryMsg").innerHTML="SubCategory Requried"
            e.preventDefault();
            return
        }
        else{
            document.getElementById("subCategoryMsg").innerHTML=""
        }
        let subCategory = {
            "subCategoryName":subCategoryName,
            "categoryId":categoryId
        }
        axios.post(rest.endPointAddSubCategory,subCategory,header)
       .then(response => {
         alert(response.data)
         document.getElementById("subCategoryName").value="";
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
        <div className="text-center h4">Sub Categories</div>
           <div className="row">
            <div className="col-md-4">
                <div className="card p-3 mt-5">
                    <form onSubmit={SubCategoryAction}>
                        <div className="form-group">
                            <label>SubCategory</label>
                          <input type="text" id="subCategoryName"  placeholder="SubCategory Nane" className="form-control mt-1"></input>
                          <div className="text-danger mt-1" id="subCategoryMsg"></div>
                        </div>
                         <div className="form-group mt-2">
                            <label>Choose Category</label>
                            <select id="categoryId" className="form-control mt-1">
                            {categoryies.map((category,index)=>
                             <option value={category['_id']}>{category['categoryName']}</option>
                              )}
                            </select>
                          <div className="text-danger mt-1" id="subCategoryMsg"></div>
                        </div>
                        <input type="submit" value={"Add SubCategory"} className="btn btn-primary w-100 mt-2"></input>
                    </form>
                </div>
            </div>
            <div className="col-md-8 mt-5">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                          <th>SubCategory</th>
                          <th>Category</th>
                        </tr>
                    </thead>
                    <tbody>
                       {subCategoryies.map((subCategory,index)=>
                       <tr>
                        <td>{subCategory['subCategoryName']}</td>
                        <td>{subCategory['categoryId']}</td>
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
export default SubCategories;