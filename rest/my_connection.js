const { MongoClient} = require('mongodb');
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

 let connection = async ()=>{
    await client.connect();
    console.log("connected");
}
connection()
const database = client.db("cartToDoorStep");
module.exports = database