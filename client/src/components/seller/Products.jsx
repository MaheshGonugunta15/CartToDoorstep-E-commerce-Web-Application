import { useEffect, useState } from "react";
import SellerHead from "./head";
import Cookies from "js-cookie";
import axios from "axios";
import CustomerHead from "../customer/head";
import { useNavigate } from "react-router-dom";
const rest = require('../../EndPoints')
function Products(){
    const [searchKeyword, setKeywords] = useState([])
    const [categoryId, setCategoryId] = useState([])
    const [subCategoryId, setsubCategoryId] = useState([])
    const[Products,setProduct] = useState([])
    const[categories,setCategory] = useState([])
    const[subCategoryies,setSubCategory] = useState([])
    const navigate = useNavigate();
    let role = Cookies.get('role')
    let header = {
        headers: {
            "Content-type": "Application/json",
            "Authorization": `Bearer ${Cookies.get('token')}`,
        }
    }
    async function fetchData() {
        axios.get(rest.endPointViewProducts+"?searchKeyword="+searchKeyword+"&categoryId="+categoryId+"&subCategoryId="+subCategoryId+"&role="+role,header)
           .then(response => {
                console.log(response.data);
                setProduct(response.data)
            })
        .catch(err => {
            console.log(err)
        })

        }

    useEffect(() => {
        fetchData()
    },[])
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

    useEffect(()=>{
        axios.get(rest.endPointviewCategory,header)
        .then(response => {
          console.log(response.data)
          setCategory(response.data)
          
       })
       .catch(err => {
          console.log(err);
       })
    },[])

    function SearchAcion(e){
        e.preventDefault();
        fetchData()
    }

    const AddToCart = e =>{
        e.preventDefault();
        let productId = e.target[0].value;
        let quantity = e.target[1].value;
        let sellerId = e.target[2].value;
        
        let data  ={
            "quantity":quantity,
            "productId":productId,
            "sellerId":sellerId
        }
        axios.post(rest.endPointAddToCart,data,header)
        .then(response => {
           alert(response.data)
           navigate("/viewOrders?status=cart")
           e.target[1].value="";
          
       })
       .catch(err => {
          console.log(err);
       })

    }
    const getReviews = (productId) =>{
     console.log(productId);
     navigate("/viewReviews?productId="+productId)
    }

    return(
        <>
        <div className="product-img">
        {Cookies.get("role")==="seller"?<div><SellerHead/></div>:<></>}
        {Cookies.get("role")==="customer"?<div><CustomerHead/></div>:<></>}
        <div className="container mt-1">
            <div className="card p-3">
            <form onSubmit={SearchAcion}>
                <div className="row">
                    <div className="col-md-3">
                        <select id="categoryId" className="form-control p-2" onChange={e=>setCategoryId(e.target.value)}>
                            <option value={""}>Choose Category</option>
                            {categories.map((category,index)=>
                            <option value={category['_id']}>{category['categoryName']}</option>
                            )}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <select id="subCategoryId" className="form-control p-2" onChange={e=>setsubCategoryId(e.target.value)}>
                            <option value={""}>Choose SubCategory</option>
                            {subCategoryies.map((subCategory,index)=>
                            <option value={subCategory['_id']}>{subCategory['subCategoryName']}</option>
                            )}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <input type="text" className="form-control p-2" onChange={e=>setKeywords(e.target.value)} id="searchKeyword" placeholder="Search Product"></input>
                    </div>
                    <div className="col-md-3">
                        <input type="submit" value={"Search"} className="btn btn-primary w-100"></input>
                    </div>
                </div>
            </form>
            </div>
        </div>
        <div className="container mt-1">
            <div className="row">
                {Products=="Product Not Avilable"?<><div className="text-center" id="product-len"></div></>:<>
                    {Products.map((product,index)=>
               <div className="col-md-3 mt-3">
                <div className="card">
                <img src={'data:image/jpeg;base64,'+product['picture']}  style={{height:'200px',Width:'100%'}} /><br></br>
                <div className="text-center h6" style={{textTransform: "uppercase"}}>{product['productName']} ({product['subCategoryId']})</div>
                <div className="text-center h5">$ {product['price']}</div>
                <div className="mt-1 p-1">
                    <button onClick={()=>getReviews(product['_id'])}  className="btn btn-primary mb-1" style={{fontSize:"13px"}}>Reviews</button>
                    </div>
                {Cookies.get("role")==='customer'?<>
                  <div className="card-footer">
                    <form onSubmit={AddToCart}>
                    <div className="row">
                        <div className="col-md-6">
                            <input type="hidden" id="productId" value={product['_id']}></input>
                            <input type="number" id="quantity" className="form-control" placeholder="Quantity" min={1} required></input>
                            <input type="hidden" id="sellerId" value={product['sellerId']}></input>
                        </div>
                        <div className="col-md-6">
                            <input type="submit" value={"Add To Cart"} className="btn btn-danger" style={{fontSize:"13px"}}></input>
                        </div>
                    </div>
                    </form>
                  </div>
                </>:<></>}
                </div>
                </div>
               )}
                </>}
               
            </div>
        </div>
        </div>
        </>
    )
}
export default Products;