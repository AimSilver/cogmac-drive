const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

// Replace the following with your MongoDB connection string
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

async function addUser() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db("CogmacDrive"); // Replace with your database name
    const users = database.collection("users");
    const auths = database.collection("auths");
    // User data to add
    const auth = {
      email: "cogmac@gmail.com",
      password: await bcrypt.hash("Cogmac@45", 10),
      isAdmin: true,
      isManager: true,
      isActive: true,
    };
    const user = {
      name: "cogmac",
      email: "cogmac@gmail.com",
    };

    // Insert user into the users collection
    const result =
      (await users.insertOne(user)) && (await auths.insertOne(auth));
    console.log(`New user created with the following id: ${result.insertedId}`);
  } catch (error) {
    console.error("Error adding user:", error);
  } finally {
    await client.close();
  }
}

// Call the function to add a user
addUser();
