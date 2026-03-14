import { BrowserRouter,Route,Routes} from 'react-router-dom';
import Home from './components/common/home';
import AdminLogin from './components/common/AdminLogin';
import AdminHome from './components/Admin/AdminHome';
import Logout from './logout';
import Locations from './components/Admin/Locations';
import Categories from './components/Admin/Categories';
import SubCategories from './components/Admin/SubCategories';
import CustomerLogin from './components/common/CustomerLogin';
import CustomerRegistration from './components/common/cReg';
import SellerLogin from './components/common/sellerLogin';
import SellerRegistration from './components/common/sReg';
import SellerHome from './components/seller/SellerHome';
import Sellers from './components/Admin/sellers';
import AddProducts from './components/seller/AddProducts';
import Products from './components/seller/Products';
import CustomerHome from './components/customer/CustomerHome';
import AddAmount from './components/customer/AddAmount';
import Discounts from './components/seller/Discounts';
import ViewOrders from './components/customer/ViewOrders';
import OrderNow from './components/customer/OrderNow';
import GiveRating from './components/customer/GiveRating';
import Paypal from './paypal';
import ViewReviews from './components/customer/ViewReviews';

function App() {

  return (
    <BrowserRouter>
    <div className="App">
       <Routes>
        <Route path='/'  Component={Home} />
        <Route path='/alog'  Component={AdminLogin} />
        <Route path='/AdminHome'  Component={AdminHome} />
        <Route path='/logout' Component={Logout} />
        <Route path='/Locations' Component={Locations} />
        <Route path='/Categories' Component={Categories} />
        <Route path='/SubCategories' Component={SubCategories} />
        <Route path='/clog' Component={CustomerLogin} />
        <Route path='/cReg' Component={CustomerRegistration} />
        <Route path='/slog' Component={SellerLogin} />
        <Route path='/sReg' Component={SellerRegistration} />
        <Route path='/SellerHome' Component={SellerHome} />
        <Route path='/Sellers' Component={Sellers} />
        <Route path='/AddProducts' Component={AddProducts} />
        <Route path='/Products' Component={Products} />
        <Route path='/CustomerHome' Component={CustomerHome} />
        <Route path='/AddAmount' Component={AddAmount} />
        <Route path='/discounts' Component={Discounts} />
        <Route path='/viewOrders' Component={ViewOrders} />
        <Route path='/OrderNow' Component={OrderNow} />
        <Route path='/giveRating' Component={GiveRating} />
        <Route path='/paypal' Component={Paypal}></Route>
        <Route path='/viewReviews' Component={ViewReviews }></Route>
       </Routes>
      </div>
      </BrowserRouter>
  );
}

export default App;
