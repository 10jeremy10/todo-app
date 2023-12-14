import { MongoClient, MongoClientOptions } from "mongodb";
import { VercelRequest, VercelResponse } from "@vercel/node";

const uri =
  "mongodb+srv://vercel-admin-user:pkvmoqODzuyjgK97@cluster-todo-app.cbvgiwh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as MongoClientOptions);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await client.connect();
    const database = client.db("todo-application");
    const collection = database.collection("todo-list");
    const items = await collection.find().toArray();
    res.json(items);
  } finally {
    await client.close();
  }
}
