import mongoose, { Schema, model } from "mongoose";

mongoose
  .connect("mongodb://127.0.0.1:27017/google-docs-clone")
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  });

const documentSchema = new Schema({
  _id: String,
  data: Object,
});

const Document = model("document", documentSchema);

export default Document;
