import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // You should hash passwords in production
});

const AdminModel =
  mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export default AdminModel;
