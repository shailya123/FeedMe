import mongoose from "mongoose";

type ConnectionOnejct = {
  isConnected?: number;
};

const connection: ConnectionOnejct = {};

export async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already Connected");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    connection.isConnected = db.connections[0].readyState;
    console.log("Db Connected Successfully");
  } catch (err) {
    console.log("Db Connection failed", err);
    process.exit(1);
  }
}
