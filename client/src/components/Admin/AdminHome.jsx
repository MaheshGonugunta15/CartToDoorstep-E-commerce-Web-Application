import AdminHead from "./head";

function AdminHome(){
    return(
        <>
        <div className="product-img">
        <AdminHead/>
        <div className="text-center h1" style={{lineHeight:"300px"}}>Welcome Administrator</div>
        </div>
        
        </>
    )
}
export default AdminHome;