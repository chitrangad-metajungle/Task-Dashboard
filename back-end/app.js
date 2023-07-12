const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const port = 3000; // Choose a port number

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


async function main(){
  /**
   * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
   * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
   */
  // const uri = "mongodb://localhost:27017/";
  const uri = "mongodb+srv://MetaAdmin:ql4R9W00MYgsZ3qy@taskmanager.x5nspqq.mongodb.net/?retryWrites=true&w=majority";
  const MongoClient = require('mongodb').MongoClient;


  const client = new MongoClient(uri);
  try {
      // Connect to the MongoDB cluster
      await client.connect();
      db = client.db("TaskManagerDB")
      const result = await db.collection("users").find().toArray();

      console.log('Query result:%s      %s         %s', result[0].username, result[0].taskid, result[0].password);
      // console.log('Query result:', result["username]);

  } catch (e) {
      console.error(e);
  } finally {
      await client.close();
  }
}

main().catch(console.error);

// const MongoC = require('mongodb').MongoClient;

// MongoC.connect("mongodb://127.0.0.1:27017/TaskManagerDB", function(err, db) {
//   // if (err) throw err;

//   // var myobj = { name: "Company Inc", address: "Highway 37" };
//   // db.collection("tasks").insertOne(myobj, function(err, res) {
//   //   if (err) throw err;
//   //   console.log("1 document inserted");
//   //   db.close();
//   // });

//   // db.collection("tasks").find({}).toArray(function(err, result) {
//   //   if (err) throw err;
//   //   console.log(result);
//   //   db.close();
//   // });

//       console.log("1 document inserted");

// });

// async function connectToMongo() {
//   const uri = 'mongodb://localhost:27017/TaskManagerDB';
//   const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//   try {
//     // Use the client object to interact with the database
//     const db = client.db("TaskManagerDB");
    
//     // Perform database operations here
//     db.find()
//   } finally {
//     // Close the connection when you're done
//     client.close();
//   }
// }

// connectToMongo().catch(err => {
//   console.error("Error connecting to MongoDB:", err);
// });


// const MongoClient = require('mongodb').MongoClient;

// const url = 'mongodb://localhost:27017/TaskManagerDB?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.1'; // Replace "mydatabase" with your actual database name


// MongoClient.connect("mongodb://localhost:27017/TaskManagerDB?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.1", function(err, sd) {
//   console.log(client, err,url)

//   if (err) {
//     console.error('Error connecting to MongoDB:', err);
//     return;
//   }
//   const db = client.db("users");

//   // db.collection('Persons').count(function (err, count) {
//   //   if (err) throw err;
    
//   //   console.log('Total Rows: ' + count);
//   // });
 
//   // // Perform database operations here
//   // const collection = client.db().collection('users'); // Replace "mycollection" with the name of your collection

//   // console.log(collection)
//   // // Find documents that match a specific condition
//   // collection.find().toArray(function(err, documents) {
//   //   if (err) {
//   //     console.error('Error retrieving documents:', err);
//   //     return;
//   //   }

//   // console.log('Documents found:', documents);
//   // Return the documents to your application or process them further
//   client.close();
// });

  // Close the MongoDB connection when you're done
  
// });

