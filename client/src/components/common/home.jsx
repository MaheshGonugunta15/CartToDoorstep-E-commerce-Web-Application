import { useNavigate } from "react-router-dom";
import Head from "./head";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
const rest = require("../../EndPoints")
function Home(){
    const navigate = useNavigate();
    let header = {
        headers: {
            "Content-type": "Application/json",
        }
    }
    const [searchKeyword, setKeywords] = useState([])
    const [categoryId, setCategoryId] = useState([])
    const [subCategoryId, setsubCategoryId] = useState([])
    const[Products,setProduct] = useState([])
    const[categories,setCategory] = useState([])
    const[subCategoryies,setSubCategory] = useState([])
    let role = Cookies.get('role')

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

    const LoginToBuy = e =>{
     e.preventDefault();
     navigate("/clog")
     }
    return(
        <>
       <div className="product-img">
        <Head/>
      
        <div className="container mt-1">
            <div className="card p-3" style={{background:"#F8F8FF"}}>
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
               {Products.map((product,index)=>
               <div className="col-md-3 mt-3">
                <div className="card">
                <img src={'data:image/jpeg;base64,'+product['picture']}  style={{height:'200px',Width:'100%'}} /><br></br>
                <div className="text-center h6" style={{textTransform: "uppercase"}}>{product['productName']} ({product['subCategoryId']})</div>
                <div className="text-center h5">$ {product['price']}</div>
                    <form onSubmit={LoginToBuy}>
                    <div className="row">
                       
                        <div className=" text-center">
                            <input type="submit" value={"Login To Buy"} className="btn btn-primary" style={{fontSize:"15px"}}></input>
                        </div>
                    </div>
                    </form>
                </div>
                
                </div>
               )}
            </div>
        </div>
        </div>
        </>
    )
}
export default Home;