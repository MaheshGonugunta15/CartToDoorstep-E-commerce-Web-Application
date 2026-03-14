import Cookies from "js-cookie";
import SellerHead from "./head";
import axios from "axios";
import { useEffect, useState } from "react";
const rest = require('../../EndPoints')
function AddProducts(){

    const[subCategoryies,setSubCategory] = useState([])
    let header = {
        headers: {
            "Content-type": "Application/json",
            "Authorization": `Bearer ${Cookies.get('token')}`
        }
    }
    useEffect(()=>{
        axios.get(rest.endPointViewSubCategory,header)
        .then(response => {
            console.log(response.data);
            setSubCategory(response.data)
          
       })
       .catch(err => {
          console.log(err);
       })
    },[])
    const [state, setState] = useState([])
    const fileSelectedHandler = (event) => {
        setState({
        selectedFile: event.target.files[0],
        filename: event.target.files
        })
    }
    function ProductAction(e){
        e.preventDefault();
        let productName = document.getElementById("productName").value;
        let subCategoryId = document.getElementById("subCategoryId").value;
        let price = document.getElementById("price").value;
        let picture = document.getElementById("picture").value;
        let about = document.getElementById("about").value;
        
        let product = new FormData();
        product.append("price",price);
        product.append("productName",productName);
        product.append("subCategoryId",subCategoryId)
        product.append("about",about)
        product.append("picture",state.selectedFile);
        axios.post(rest.endPointAddProduct,product,header)
        .then(response => {
            alert(response.data);
            document.getElementById("productName").value="";
            document.getElementById("price").value="";
            document.getElementById("about").value="";
            document.getElementById("picture").value="";

        })
        .catch(err => {
            console.log(err)
        })

    }
    return(
        <>
         <div className="product-img">
        <SellerHead/>
        <div className="row">
                <div className="col-md-4">
                </div>
                <div className="col-md-4 mt-3">
                    <div className="card p-4 m-2">
                        <div className="text-center h4">Add New Product</div>
                        <form onSubmit={ProductAction}>
                            <div class="mb-3 mt-3">
                                <label for="productName" class="form-label">Product Name</label>
                                <input type='text' id="productName"  className="form-control" placeholder="Enter Item Name"/>
                            </div>
                            <div class="mb-3 mt-3">
                                <label for="category" class="form-label">Choose SubCategory</label>
                                <select id="subCategoryId"  className="form-control" >
                                {subCategoryies.map((subCategory, index) =>
                                    <option className="list-group-item"  value={subCategory['_id']} >{subCategory['subCategoryName']} ({subCategory['categoryId']})</option>)}
                                </select>
                            </div>
                            <div class="mb-2 mt-3">
                                <label>Price</label>
                                <input type='number' id="price"  className="form-control" placeholder="Enter Unit Price"/>
                            </div>
                            <div class="mb-3 mt-3">
                                <label>Uplpad Picture</label>
                                <input type='file' id="picture" onChange={fileSelectedHandler} className="form-control"/>
                            </div>
                            <div class="mb-3 ">
                                <label>About</label>
                                <textarea id="about" placeholder="About" className="form-control"></textarea>
                            </div>
                            <div className="d-grid">
                                <input type="submit" className="btn btn-primary w-100" value={"Add Product"}></input>
                            </div>
                            
                        </form>
                    </div>
                    
                </div>
            </div>
            </div>
        </>
    )
}
export default AddProducts;