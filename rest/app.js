const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser  = require('body-parser');
const jwt = require('jsonwebtoken');
const {ObjectId} = require('mongodb'); 
const multer = require('multer');

//Db Collections

const database = require("./my_connection");
const location_col = database.collection('locations');
const category_col = database.collection('category');
const subCategory_col = database.collection('subCategory');
const customer_col = database.collection('customer');
const seller_col = database.collection('seller');
const product_col = database.collection('products');
const wallet_col = database.collection('wallet');
const discount_col = database.collection('discounts');
const order_col = database.collection('orders');
const orderItem_col = database.collection('orderItems');
const reviews_col = database.collection('Reviews');

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({limit: '1000mb',extended: false}))
app.use(bodyParser.json())
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-Width, Content-Type, Accept, Authorization')
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, GET, DELETE')
        return res.status(200).json({})
    }
    next()
})


app.post("/adminLogin",async function(req,res){
  let data = req.body
  let name = "admin";
  let password = "admin";
  if(name===data.userName && password === data.password){
    const token = jwt.sign({ name: name.trim().toUpperCase(),}, process.env.secret, { expiresIn: '1h' })
    return res.status(200).json({
      authorization: "success",
      token :token,
      role: "admin"
  })
  }else{
    res.send("Invalid Login Details")
  }
  
})

app.post("/addLocations",async function(req,res){
  let data = req.body;
  let locationName = data.locationName
  const result = await location_col.find({"locationName":locationName}).toArray();
  if(result.length>0){
      res.send("Location Exists")
  }
  else{
  location_col.insertOne(data)
  res.send("Location Added Successfully")
  }

})

app.post("/addCategory",async function(req,res){
  let data = req.body;
  let categoryName = data.categoryName
  const result = await category_col.find({"categoryName":categoryName}).toArray();
  if(result.length>0){
      res.send("Category Exists")
  }
  else{
  category_col.insertOne(data)
  res.send("Category Added Successfully")
  }

})
 
app.get("/viewLocations", async function(req,res){
  const locations = await location_col.find().toArray();
  res.send(locations)
})

 
app.get("/viewCategories", async function(req,res){
  const categories = await category_col.find().toArray();
  res.send(categories)
})


app.post("/addSubCategories",async function(req,res){
  let data = req.body;
  let categoryId = data.categoryId;
  categoryId =new ObjectId(categoryId)
  let subCategoryName = data.subCategoryName;
  subCategory_col.insertOne({"subCategoryName":subCategoryName,"categoryId":categoryId})
  res.send("SubCategory Added Successfully")
})



app.get("/viewSubCategories",async function(req,res){
  let results = await subCategory_col.find().toArray();
  let subCategories = []
  for(let i=0;i<results.length;i++){
    let subCategory = results[i]
    let category = await category_col.findOne({"_id":new ObjectId(subCategory['categoryId'])});
    subCategory['categoryId'] = category['categoryName']
    subCategories.push(subCategory)
  }
  res.send(subCategories);
})



app.post("/customerReg",async function(req,res){
  let postData = req.body;
  query = {'$or':[{'email':postData.email},{"phone":postData.phone}]}
  let customer = await customer_col.countDocuments(query)
  if(customer>0){
    res.send("Duplicate Customer Details")
  }else{
    let data = customer_col.insertOne(postData);
    const result = await wallet_col.insertOne({'amount':0,"customerId":new ObjectId((await data).insertedId)})
    res.send("Registered Successfully")
  }
})



app.post("/sellerReg",async function(req,res){
  let postData = req.body;
  let name = postData.name;
  let email = postData.email;
  let phone = postData.phone;
  let password = postData.password;
  let locationId = postData.locationId;
  locationId = new ObjectId(locationId)
  let data = {
    "name":name,
    "email":email,
    "phone":phone,
    "password":password,
    "locationId":locationId,
    "status":"UnAuthorized"
  }
  query = {"$or":[{"email":email},{"phone":phone}]}
  let seller = await seller_col.countDocuments(query)
  if(seller>0){
    res.send("Duplicate Seller Details")
  }else{
    seller_col.insertOne(data);
    res.send("Registered Successfully")
  }
})



app.post("/sellerLogin",async function(req,res){
  let postData = req.body;
  let email = postData.email;
  let password = postData.password;
  let query =  {"email":email,"password":password}
  let data = await seller_col.countDocuments(query)
  if(data==0){
    res.send("Invalid Login Details")
  }else{
    const seller = await seller_col.findOne(query);
    const token = jwt.sign({ Email: seller['email'].trim().toUpperCase(),sellerId: seller['_id']}, process.env.secret, { expiresIn: '1h' })
    return res.status(200).json({
      authorization: "success",
      token :token,
      status : seller['status'],
      sellerId : seller['_id'],
      role: "seller"
  })
  }
})


app.get("/getSellers",async function(req,res){
  const sellers = await seller_col.find().toArray();
  res.send(sellers);
})

app.get("/statusAction",async function(req,res){
  let sellerId = req.query.sellerId;
  sellerId = new ObjectId(sellerId);
  let seller  = await seller_col.findOne({'_id':sellerId})
  if(seller['status']==='Authorized'){
    let data = await seller_col.updateOne({'_id':sellerId},{"$set": { "status": "UnAuthorized" } })
    res.send("Deactivated")
  }else{
    let data = await seller_col.updateOne({'_id':sellerId},{"$set": { "status": "Authorized" } })
    res.send("Verified")
  }
 
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, "public")
  },
  filename: function (req, file, cb) {
      const parts = file.mimetype.split("/");
      cb(null, `${file.fieldname}-${Date.now()}.${parts[1]}`)
  }
})
const upload = multer({storage});
fs = require('fs');


app.post("/addProduct",upload.single("picture"),async function(req,res){
  const imageData = req.file.filename;
  const token =  req.header("Authorization");
  const tokenParts = token.split('.');
  const encodedPayload = tokenParts[1];
  const rawPayload = atob(encodedPayload);
  const user = JSON.parse(rawPayload);
  let sellerId = user['sellerId']
  let subCategoryId = req.body.subCategoryId
  subCategoryId = new ObjectId(subCategoryId)
  const result = await product_col.insertOne({"productName":req.body.productName,"price":req.body.price,"about":req.body.about,"subCategoryId":subCategoryId,"picture":imageData,"sellerId":new ObjectId(sellerId),"category":"","rating":""})
  res.send("Product Added Successfully")
})

app.use(express.static("public"));

app.get("/viewProducts",async function(req,res){
let role = req.query.role;

if(role==='seller'){
  const token =  req.header("Authorization");
const tokenParts = token.split('.');
const encodedPayload = tokenParts[1];
const rawPayload = atob(encodedPayload);
const user = JSON.parse(rawPayload);
let sellerId = user['sellerId']
  let searchKeyword = req.query.searchKeyword;
let categoryId = req.query.categoryId;
let subCategoryId = req.query.subCategoryId;
let query = {}
if(searchKeyword==="" && categoryId==="" && subCategoryId===""){
  query = {"sellerId":new ObjectId(sellerId)}
}else if(searchKeyword!="" && categoryId==="" && subCategoryId===""){
  query =  { "productName": { $regex: '.*' + searchKeyword + '.*' },"sellerId":new ObjectId(sellerId) }
}else if(searchKeyword===""&& categoryId!=""&&subCategoryId===""){
  let query2 = {"categoryId":new ObjectId(categoryId)}
  let results = await subCategory_col.find(query2).toArray();
  let subCategoryIds = []
  for(let i=0;i<results.length;i++){
    subCategoryId = results[i]['_id']
    let subCategory = {
      "subCategoryId":subCategoryId
    }
    subCategoryIds.push(subCategory)
  }
  query = {"$or":subCategoryIds,"sellerId":new ObjectId(sellerId)}
}else if(searchKeyword==="" && categoryId==="" && subCategoryId!=""){
  query = {"subCategoryId":new ObjectId(subCategoryId),"sellerId":new ObjectId(sellerId)}
}
 let results = await product_col.find(query).toArray();
 let products = []
 for(let i=0;i<results.length;i++){
   let product = results[i]
   const image = fs.readFileSync('./public/'+product['picture'], {encoding: 'base64'});
   product['picture'] = image
   const subCategory = await subCategory_col.findOne({'_id':product['subCategoryId']})
   let subCategoryName = subCategory['subCategoryName']
   product['subCategoryId'] = subCategoryName;
   let category = await category_col.findOne({'_id':subCategory['categoryId']})
   let categoryName = category['categoryName']
   product['category'] = categoryName
   products.push(product)
  }
  res.send(products)
}else if(role==='customer'){
  let searchKeyword = req.query.searchKeyword;
  let categoryId = req.query.categoryId;
  let subCategoryId = req.query.subCategoryId;
  let query = {}
  if(searchKeyword==="" && categoryId==="" && subCategoryId===""){
    query = {}
  }else if(searchKeyword!="" && categoryId==="" && subCategoryId===""){
    query =  { "productName": { $regex: '.*' + searchKeyword + '.*' } }
  }else if(searchKeyword===""&& categoryId!="" && subCategoryId===""){
    let query2 = {"categoryId":new ObjectId(categoryId)}
    let results2 = await subCategory_col.find(query2).toArray();

    
   
    let subCategoryIds = []
    for(let i=0;i<results2.length;i++){
      subCategoryId = results2[i]['_id']
      let subCategory = {
        "subCategoryId":subCategoryId
      }
      subCategoryIds.push(subCategory)
    }
    if(subCategoryIds.length!=0){
      query = {"$or":subCategoryIds}
    }else{
      res.send("Product Not Avilable")
    }
    
  }else if(searchKeyword==="" && categoryId==="" && subCategoryId!=""){
    query = {"subCategoryId":new ObjectId(subCategoryId)}
  }
   let results = await product_col.find(query).toArray();
   
   let products = []
   for(let i=0;i<results.length;i++){
     let product = results[i]
     
     const image = fs.readFileSync('./public/'+product['picture'], {encoding: 'base64'});
     product['picture'] = image
     const subCategory = await subCategory_col.findOne({'_id':product['subCategoryId']})
     let subCategoryName = subCategory['subCategoryName']
     product['subCategoryId'] = subCategoryName;
     let category = await category_col.findOne({'_id':subCategory['categoryId']})
     let categoryName = category['categoryName']
     
     product['category'] = categoryName
     products.push(product)
  
  
    }
    res.send(products)
}
else{
  let searchKeyword = req.query.searchKeyword;
  let categoryId = req.query.categoryId;
  let subCategoryId = req.query.subCategoryId;
  let query = {}
  if(searchKeyword==="" && categoryId==="" && subCategoryId===""){
    query = {}
  }else if(searchKeyword!="" && categoryId==="" && subCategoryId===""){
    query =  { "productName": { $regex: '.*' + searchKeyword + '.*' } }
  }else if(searchKeyword===""&& categoryId!=""&&subCategoryId===""){
    let query2 = {"categoryId":new ObjectId(categoryId)}
    let results = await subCategory_col.find(query2).toArray();
    let subCategoryIds = []
    for(let i=0;i<results.length;i++){
      subCategoryId = results[i]['_id']
      let subCategory = {
        "subCategoryId":subCategoryId
      }
      subCategoryIds.push(subCategory)
    }
    query = {"$or":subCategoryIds}
  }else if(searchKeyword==="" && categoryId==="" && subCategoryId!=""){
    query = {"subCategoryId":new ObjectId(subCategoryId)}
  }
   let results = await product_col.find(query).toArray();
   let products = []
   for(let i=0;i<results.length;i++){
     let product = results[i]
     
     const image = fs.readFileSync('./public/'+product['picture'], {encoding: 'base64'});
     product['picture'] = image
     const subCategory = await subCategory_col.findOne({'_id':product['subCategoryId']})
     let subCategoryName = subCategory['subCategoryName']
     product['subCategoryId'] = subCategoryName;
     let category = await category_col.findOne({'_id':subCategory['categoryId']})
     let categoryName = category['categoryName']
     
     product['category'] = categoryName
     products.push(product)
  
  
    }
    res.send(products)
}

})

app.get("/getWallet",async function(req,res){
  const token =  req.header("Authorization");
  const tokenParts = token.split('.');
  const encodedPayload = tokenParts[1];
  const rawPayload = atob(encodedPayload);
  const user = JSON.parse(rawPayload);
  let customerId = user['customerId']
  let wallet = await wallet_col.findOne({'customerId':new ObjectId(customerId)})
  res.send(wallet)
})


app.get("/discountValidation",async function(req,res){
  let couponCode = req.query.couponCode;
  let orderId = req.query.orderId;
  let orders = await order_col.findOne({"_id":new ObjectId(orderId)})
  let sellerId = orders['sellerId']
  let date  = new Date()
  let query = {"sellerId":new ObjectId(sellerId),"couponCode":couponCode,"expiryDate": {"$gte":date}}
  let result = await discount_col.countDocuments(query)
  if(result==0){
    res.send("0")
  }else{
    let data = await discount_col.findOne({"sellerId":new ObjectId(sellerId),"couponCode":couponCode})
    console.log(data);
    res.send(data)
  }
  console.log(result);
  // if (result==0){
  //   res.send("Invalid Coupon")
  // }
  //   let result2 = await discount_col.findOne(query)
  //   let expdate = result2['expiryDate']
  //   expdate = new Date(expdate)
  //   if(date>expdate){
  //     res.send("Invalid Coupon")
  //   }else{
  //     res.send(result2)
    
  // }
  

  // let discounts = await discount_col.find({'sellerId':new ObjectId(sellerId)}).toArray();
  // for(let i=0;i<discounts.length;i++){
  //   let discount = discounts[i]
  //   let query = {"couponCode":couponCode}
  // }
})

app.post("/customerLogin",async function(req,res){
  let postData = req.body;
  let email = postData.email;
  let password = postData.password;
  console.log(password);
  let query =  {"email":email,"password":password}
  let data = await customer_col.countDocuments(query)
  if(data==0){
    res.send("Invalid Login Details")
  }else{
    const customer = await customer_col.findOne(query);
    const token = jwt.sign({ email: customer['email'].trim().toUpperCase(),customerId: customer['_id']}, process.env.secret, { expiresIn: '1h' })
    return res.status(200).json({
      authorization: "success",
      token :token,
      role: "customer"
  })
  }
})


app.get("/customerProfile",async function(req,res){
  const token =  req.header("Authorization");
  const tokenParts = token.split('.');
  const encodedPayload = tokenParts[1];
  const rawPayload = atob(encodedPayload);
  const user = JSON.parse(rawPayload);
  let customerId2 = user['customerId']
  const customer = await customer_col.findOne({'_id':new ObjectId(customerId2)})
  res.send(customer)
})

app.get("/customerWallet",async function(req,res){
  const token =  req.header("Authorization");
  const tokenParts = token.split('.');
  const encodedPayload = tokenParts[1];
  const rawPayload = atob(encodedPayload);
  const user = JSON.parse(rawPayload);
  let customerId2 = user['customerId']
  const wallet = await wallet_col.findOne({'customerId':new ObjectId(customerId2)})
  res.send(wallet)
})

app.post("/addWalletAmount",async function(req,res){
  let customerId = req.body.customerId;
  let amount = req.body.amount;
  const wallet = await wallet_col.findOne({"customerId":new ObjectId(customerId)})
  if(wallet==null){
    const result = await wallet_col.insertOne({'amount':amount,"customerId":new ObjectId(customerId)})
    res.send("Amount Added")
  }else{
    let ammount2 = parseInt(wallet['amount']) + parseInt(amount)
    query = {"$set":{"amount":ammount2}}
    const result2 = await wallet_col.updateOne({"customerId":new ObjectId(customerId)},query)
    res.send("Amount Added")
  }

 
})


app.post("/addDiscount", async function(req,res){
   let discounts = req.body;
   const token =  req.header("Authorization");
   const tokenParts = token.split('.');
   const encodedPayload = tokenParts[1];
   const rawPayload = atob(encodedPayload);
   const user = JSON.parse(rawPayload);
   let sellerId = user['sellerId']
   const coupon_count = await discount_col.countDocuments({"couponCode":discounts['couponCode']})
   if (coupon_count >0){
    res.send("Duplicate Coupon ---->" +discounts['couponCode'])
   }else{
    let result = await discount_col.insertOne({"couponCode":discounts['couponCode'],"discount":discounts['discount'],"expiryDate":new Date(discounts['expiryDate']+"T23:59"),"sellerId":new ObjectId(sellerId)})
     res.send("Discount Added")
   }

})


app.get("/viewDiscounts",async function(req,res){
  const token =  req.header("Authorization");
  const tokenParts = token.split('.');
  const encodedPayload = tokenParts[1];
  const rawPayload = atob(encodedPayload);
  const user = JSON.parse(rawPayload);
  let sellerId = user['sellerId'];
  const discounts  = await discount_col.find({"sellerId":new ObjectId(sellerId)}).toArray()
  res.send(discounts)
})


app.post("/addToCart",async function(req,res){
  const token =  req.header("Authorization");
  const tokenParts = token.split('.');
  const encodedPayload = tokenParts[1];
  const rawPayload = atob(encodedPayload);
  const user = JSON.parse(rawPayload);
  let customerId = user['customerId'];
  let productId = req.body['productId'];
  let quantity = req.body['quantity'];
  let sellerId = req.body['sellerId'];
  let date  = new Date();
  let orderId = NaN;
  let orderCount = await order_col.countDocuments({"status":"cart","customerId":new ObjectId(customerId),"sellerId":new ObjectId(sellerId)})
  if (orderCount == 0){
       let result = await order_col.insertOne({"status":"cart","customerId":new ObjectId(customerId),"sellerId":new ObjectId(sellerId),"date":date,"totalPrice":0})
       orderId = result.insertedId;
  }else{
      let result = await order_col.findOne({"status":"cart","customerId":new ObjectId(customerId),"sellerId":new ObjectId(sellerId)})
      orderId =  result['_id']
  }
  console.log(orderId);
  
  let orderItemCount = await orderItem_col.countDocuments({"orderId":new ObjectId(orderId),"productId":new ObjectId(productId)})
  if (orderItemCount==0){
    let product = await product_col.findOne({'_id':new ObjectId(productId)})
    let order = await order_col.findOne({"_id":new ObjectId(orderId)})
    let totalPrice  =parseInt(order['totalPrice']) +parseInt(quantity)*parseInt(product['price'])
    let orderEsult = await order_col.updateOne({"_id":new ObjectId(orderId)},{"$set":{"totalPrice":totalPrice}})
    orderItem_col.insertOne({"orderId":new ObjectId(orderId),"productId":new ObjectId(productId),"quantity":quantity,"status":"cart"})
    res.send("Product Added To Cart")
  }else{
    let result2 = await orderItem_col.findOne({"orderId":new ObjectId(orderId),"productId":new ObjectId(productId)})
    let quantity2 = result2['quantity'];
    let order = await order_col.findOne({"_id":new ObjectId(orderId)})
    let product = await product_col.findOne({'_id':new ObjectId(productId)})
    let totalPrice  = parseInt(order['totalPrice'])+parseInt(quantity)*parseInt(product['price'])
    let orderEsult = await order_col.updateOne({"_id":new ObjectId(orderId)},{"$set":{"totalPrice":totalPrice}})
    quantity = parseInt(quantity2)+parseInt(quantity)
    let result3 = await orderItem_col.updateOne({"orderId":new ObjectId(orderId),"productId":new ObjectId(productId)},{"$set":{"quantity":quantity}})
    res.send("Product Modified In Cart")
  }
  
})


app.get("/viewOrders",async function(req,res){
 let status = req.query.status;
 let role = req.query.role;
 if (role === 'customer'){
  const token =  req.header("Authorization");
  const tokenParts = token.split('.');
  const encodedPayload = tokenParts[1];
  const rawPayload = atob(encodedPayload);
  const user = JSON.parse(rawPayload);
  let customerId = user['customerId']
  if(status==='cart'){
    let orders = [];
    let results = await order_col.find({"customerId":new ObjectId(customerId),'status':"cart"}).toArray();
    for(let i=0 ;i<results.length;i++){
      let order = results[i];
      let customer = await customer_col.findOne({"_id":new ObjectId(order['customerId'])})
      let seller = await seller_col.findOne({"_id":new ObjectId(order['sellerId'])})
      let orderItems = await orderItem_col.find({"orderId":new ObjectId(order['_id'])}).toArray();
      let orderItems2 = []
      let totalPrice = 0;
      for(let j=0;j<orderItems.length;j++){
        let orderItem = orderItems[j]
        let subTotal = 0
        let product = await product_col.findOne({'_id':new ObjectId(orderItem['productId'])})
        const contents = fs.readFileSync('./public/'+product['picture'], {encoding: 'base64'});
        product['picture']  = contents;
        orderItem['productId'] = product
        subTotal = parseInt(product['price']*parseInt(orderItem['quantity']))
        orderItem['subTotal'] = subTotal;
        totalPrice = totalPrice+subTotal
        orderItems2.push(orderItem)
      }
      order['customerId'] = customer
      order['sellerId'] = seller
      order['totalPrice'] = totalPrice
      
      let customerOrder = {
        "order":order,
        "orderItems":orderItems2
      }
       orders.push(customerOrder)
    }
    res.send(orders)
   
  }else if(status==='ordered'){
    let orders = [];
    let query = {"$or":[{"status":"ordered"},{"status":"dispatched"}],"customerId":new ObjectId(customerId)}
    let results = await order_col.find(query).toArray();
    for(let i=0 ;i<results.length;i++){
      let order = results[i];
      let customer = await customer_col.findOne({"_id":new ObjectId(order['customerId'])})
      let seller = await seller_col.findOne({"_id":new ObjectId(order['sellerId'])})
      let orderItems = await orderItem_col.find({"orderId":new ObjectId(order['_id'])}).toArray();
      let orderItems2 = []
      let totalPrice = 0;
      for(let j=0;j<orderItems.length;j++){
        let orderItem = orderItems[j]
        let subTotal = 0
        let product = await product_col.findOne({'_id':new ObjectId(orderItem['productId'])})
        const contents = fs.readFileSync('./public/'+product['picture'], {encoding: 'base64'});
        product['picture']  = contents;
        orderItem['productId'] = product
        subTotal = parseInt(product['price']*parseInt(orderItem['quantity']))
        orderItem['subTotal'] = subTotal;
        totalPrice = totalPrice+subTotal
        orderItems2.push(orderItem)
      }
      order['customerId'] = customer
      order['sellerId'] = seller
      
      let customerOrder = {
        "order":order,
        "orderItems":orderItems2
      }
       orders.push(customerOrder)
    }
    res.send(orders)
  }else if(status==='history'){
    let orders = [];
    let results = await order_col.find({"customerId":new ObjectId(customerId),'status':"Order Received"}).toArray();
    for(let i=0 ;i<results.length;i++){
      let order = results[i];
      let customer = await customer_col.findOne({"_id":new ObjectId(order['customerId'])})
      let seller = await seller_col.findOne({"_id":new ObjectId(order['sellerId'])})
      let orderItems = await orderItem_col.find({"orderId":new ObjectId(order['_id'])}).toArray();
      let orderItems2 = []
      let totalPrice = 0;
      for(let j=0;j<orderItems.length;j++){
        let orderItem = orderItems[j]
        let subTotal = 0
        let product = await product_col.findOne({'_id':new ObjectId(orderItem['productId'])})
        const contents = fs.readFileSync('./public/'+product['picture'], {encoding: 'base64'});
        product['picture']  = contents;
        orderItem['productId'] = product
        subTotal = parseInt(product['price']*parseInt(orderItem['quantity']))
        orderItem['subTotal'] = subTotal;
        totalPrice = totalPrice+subTotal
        orderItems2.push(orderItem)
      }
      order['totalPrice'] = totalPrice
      order['customerId'] = customer
      order['sellerId'] = seller
      
      let customerOrder = {
        "order":order,
        "orderItems":orderItems2
      }
       orders.push(customerOrder)
    }
    res.send(orders)
  }
 }else if(role==="seller"){
  const token =  req.header("Authorization");
  const tokenParts = token.split('.');
  const encodedPayload = tokenParts[1];
  const rawPayload = atob(encodedPayload);
  const user = JSON.parse(rawPayload);
  let sellerId = user['sellerId']
  if(status==='ordered'){
    let orders = [];
    let results = await order_col.find({"sellerId":new ObjectId(sellerId),'status':"ordered"}).toArray();
    for(let i=0 ;i<results.length;i++){
      let order = results[i];
      let customer = await customer_col.findOne({"_id":new ObjectId(order['customerId'])})
      let seller = await seller_col.findOne({"_id":new ObjectId(order['sellerId'])})
      let orderItems = await orderItem_col.find({"orderId":new ObjectId(order['_id'])}).toArray();
      let orderItems2 = []
      let totalPrice = 0;
      for(let j=0;j<orderItems.length;j++){
        let orderItem = orderItems[j]
        let subTotal = 0
        let product = await product_col.findOne({'_id':new ObjectId(orderItem['productId'])})
        const contents = fs.readFileSync('./public/'+product['picture'], {encoding: 'base64'});
        product['picture']  = contents;
        orderItem['productId'] = product
        subTotal = parseInt(product['price']*parseInt(orderItem['quantity']))
        orderItem['subTotal'] = subTotal;
        totalPrice = totalPrice+subTotal
        orderItems2.push(orderItem)
      }
      order['customerId'] = customer
      order['sellerId'] = seller
      
      let customerOrder = {
        "order":order,
        "orderItems":orderItems2
      }
       orders.push(customerOrder)
    }
    res.send(orders)
  }else if(status==='dispatched'){
    let orders = [];
    let results = await order_col.find({"sellerId":new ObjectId(sellerId),'status':"dispatched"}).toArray();
    for(let i=0 ;i<results.length;i++){
      let order = results[i];
      let customer = await customer_col.findOne({"_id":new ObjectId(order['customerId'])})
      let seller = await seller_col.findOne({"_id":new ObjectId(order['sellerId'])})
      let orderItems = await orderItem_col.find({"orderId":new ObjectId(order['_id'])}).toArray();
      let orderItems2 = []
      let totalPrice = 0;
      for(let j=0;j<orderItems.length;j++){
        let orderItem = orderItems[j]
        let subTotal = 0
        let product = await product_col.findOne({'_id':new ObjectId(orderItem['productId'])})
        const contents = fs.readFileSync('./public/'+product['picture'], {encoding: 'base64'});
        product['picture']  = contents;
        orderItem['productId'] = product
        subTotal = parseInt(product['price']*parseInt(orderItem['quantity']))
        orderItem['subTotal'] = subTotal;
        totalPrice = totalPrice+subTotal
        orderItems2.push(orderItem)
      }
      order['customerId'] = customer
      order['sellerId'] = seller
      
      let customerOrder = {
        "order":order,
        "orderItems":orderItems2
      }
       orders.push(customerOrder)
    }
    res.send(orders)
  }
  else if(status==='history'){
    let orders = [];
    let results = await order_col.find({"sellerId":new ObjectId(sellerId),'status':"Order Received"}).toArray();
    for(let i=0 ;i<results.length;i++){
      let order = results[i];
      let customer = await customer_col.findOne({"_id":new ObjectId(order['customerId'])})
      let seller = await seller_col.findOne({"_id":new ObjectId(order['sellerId'])})
      let orderItems = await orderItem_col.find({"orderId":new ObjectId(order['_id'])}).toArray();
      let orderItems2 = []
      let totalPrice = 0;
      for(let j=0;j<orderItems.length;j++){
        let orderItem = orderItems[j]
        let subTotal = 0
        let product = await product_col.findOne({'_id':new ObjectId(orderItem['productId'])})
        const contents = fs.readFileSync('./public/'+product['picture'], {encoding: 'base64'});
        product['picture']  = contents;
        orderItem['productId'] = product
        subTotal = parseInt(product['price']*parseInt(orderItem['quantity']))
        orderItem['subTotal'] = subTotal;
        totalPrice = totalPrice+subTotal
        orderItems2.push(orderItem)
      }
      order['customerId'] = customer
      order['sellerId'] = seller
      
      let customerOrder = {
        "order":order,
        "orderItems":orderItems2
      }
       orders.push(customerOrder)
    }
    res.send(orders)
  }
 }

})

app.get("/dispatchOrder",async function(req,res){
  let orderId = req.query.orderId;
  let result = await order_col.updateOne({'_id':new ObjectId(orderId)},{"$set":{"status":"dispatched"}})
  res.send("Order Dispatched")
})

app.get("/makeAsRecieved",async function(req,res){
  let orderId = req.query.orderId;
  let result = await order_col.updateOne({'_id':new ObjectId(orderId)},{"$set":{"status":"Order Received"}})
  let orderResults = await orderItem_col.find({'orderId':new ObjectId(orderId)}).toArray();
  for(let i=0;i<orderResults.length;i++){
    let orderItem = orderResults[i] 
    let query = {"$set":{"status":"Received"}}
    let result2 = await orderItem_col.updateOne({"_id":new ObjectId(orderItem['_id'])},query)
  }
  res.send("Order Received")
})

app.get("/giveRating",async function(req,res){
  let productId = req.query.productId;
  let review = req.query.review;
  let rating = req.query.rating;
  let orderItemId = req.query.orderItemId;
  const token =  req.header("Authorization");
  const tokenParts = token.split('.');
  const encodedPayload = tokenParts[1];
  const rawPayload = atob(encodedPayload);
  const user = JSON.parse(rawPayload);
  let customerId = user['customerId']
  let result = await reviews_col.insertOne({"productId":new ObjectId(productId),"customerId":new ObjectId(customerId),"review":review,"rating":rating})
  let query = {"$set":{"status":"Review Given"}}
  let result2  = orderItem_col.updateOne({"_id":new ObjectId(orderItemId)},query)
  res.send("Your Response Has Been Submitted")
})

app.get("/removeCart", async function(req,res){
   let orderItemId = req.query.orderItemId;
   let orderId = req.query.orderId;
   let result = await orderItem_col.deleteOne({'_id':new ObjectId(orderItemId)});
   let orderItemcount = await orderItem_col.countDocuments({"orderId":new ObjectId(orderId)})
   if(orderItemcount==0){
    let result3 = await order_col.deleteOne({"_id":new ObjectId(orderId)})
    res.setHeader("Message", "Cart & Products Removed")
   }
   res.send("Product Removed")
})

app.get("/payThroughWallet",async function(req,res){
  let orderId  = req.query.orderId;
  let wallet = req.query.wallet;
  let totalPrice = req.query.totalPrice;
     
  let result = await order_col.updateOne({"_id":new ObjectId(orderId)},{"$set":{"status":"ordered","totalPrice":totalPrice}})
  let orderResults = await orderItem_col.find({'orderId':new ObjectId(orderId)}).toArray();
  for(let i=0;i<orderResults.length;i++){
    let orderItem = orderResults[i] 
    let query = {"$set":{"status":"ordered"}}
    let result2 = await orderItem_col.updateOne({"_id":new ObjectId(orderItem['_id'])},query)
  }
  let totalPrice2 = parseInt(wallet)-parseInt(totalPrice)
  const token =  req.header("Authorization");
  const tokenParts = token.split('.');
  const encodedPayload = tokenParts[1];
  const rawPayload = atob(encodedPayload);
  const user = JSON.parse(rawPayload);
  let customerId = user['customerId']
  let result2 = await wallet_col.updateOne({'customerId':new ObjectId(customerId)},{"$set":{"amount":totalPrice2}})
  res.send("Order Placed")
})


app.get("/orderNow",async function(req,res){
  let orderId = req.query.orderId;
  let totalPrice = req.query.totalPrice;
  let result = await order_col.updateOne({"_id":new ObjectId(orderId)},{"$set":{"status":"ordered","totalPrice":totalPrice}})
  let orderResults = await orderItem_col.find({'orderId':new ObjectId(orderId)}).toArray();
  for(let i=0;i<orderResults.length;i++){
    let orderItem = orderResults[i] 
    let query = {"$set":{"status":"ordered"}}
    let result2 = await orderItem_col.updateOne({"_id":new ObjectId(orderItem['_id'])},query)
  }
  res.send("Order Placed")
})


app.get("/productReviews",async function(req,res){
  let productId  = req.query.productId;
  let reviews = await reviews_col.find({"productId":new ObjectId(productId)}).toArray();
  let reviews2 = []
  for(let i=0;i<reviews.length;i++){
    let review = reviews[i]
    let customer = await customer_col.findOne({"_id":new ObjectId(review['customerId'])})
    review['customerId'] = customer
    reviews2.push(review)
  }
  res.send(reviews2)
})


app.use((req, res, next) => {
    const error = new Error('Not Found!');
    error.status = 404;
    next(error);
  });
  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message,
      },
    });
  });
 
 module.exports = app;













