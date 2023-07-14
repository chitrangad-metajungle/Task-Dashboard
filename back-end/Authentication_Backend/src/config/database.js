require("dotenv").config();
const mongoose = require("mongoose");

const mongodb_uri = process.env.MONGODB_URI
// const mongodb_uri =
//   "mongodb+srv://MetaAdmin:ql4R9W00MYgsZ3qy@taskmanager.x5nspqq.mongodb.net/TaskManagerDB?retryWrites=true&w=majority";

mongoose.connect(mongodb_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));

