const { MongoClient } = require('mongodb');
const fs = require('fs');
const credentials = process.env.LYAN
const client = new MongoClient('mongodb+srv://cluster0.q0uvh.mongodb.net/myFirstDatabase?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority', {
  sslKey: credentials,
  sslCert: credentials
});
// async function run() {
//   try {
//     await client.connect();
//     const database = client.db("testDB");
//     database.collection("user").insertOne({ firstName: "mohamed", pseudo: "meedlaah", lastName: "lahcen", age: 9 }, function (err, res) {
//       if (err) throw err;
//       console.log("1 document inserted");
//     });
//     const collection = database.collection("testCol");
//     const docCount = await collection.countDocuments({});
//     console.log(docCount);
//   } finally {
//     await client.close();
//   }
// }


module.exports = {client};