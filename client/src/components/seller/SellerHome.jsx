import SellerHead from "./head";

function SellerHome(){
    return(
        <>
        <div className="product-img">
        <SellerHead/>
        <div className="text-center h3 mt-5" style={{lineHeight:"80px"}}>Welcome Seller</div>
        </div>
        </>
    )
}
export default SellerHome;