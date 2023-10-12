const MongoClient = require("mongodb");
const banks = require("./banks.json");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const url = "mongodb://str";
console.log(url)
MongoClient.connect(
  url,
  { useNewUrlParser: true },
  async function (err, client) {
    try {
      console.log(err);
      const doer = {
        db_name: "dbName",
        collection: "collectionName",
      };

      const migratedScript = await migrates(client, doer);

      return { migratedScript };
    } catch (error) {
      console.log(error);
    }
  }
);

const migrates = async (client, database) => {
  return new Promise(async (resolve, reject) => {
    try {
      let fiCollection = client
        .db(database.db_name)
        .collection(database.collection);
      for (const item of banks) {
        const { name, branches } = item;
        const result = await fiCollection.updateOne(
          { fiAbbreviation: name },
          { $set: { branches } },
          { new: true }
        );
        if (result.n === 0) {
          // Document not found, log the name and continue the loop
          console.log(`Bank not found in DB: ${name}`);
          continue;
        }
        console.log(`Updated documents for Bank: ${name}`);
      }
      console.log("done");
      return resolve({ success: true });
    } catch (error) {
      console.log({ error });
      reject({ success: false });
    }
  });
};
