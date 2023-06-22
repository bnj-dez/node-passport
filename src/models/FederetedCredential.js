import mongoose from "mongoose";

const { Schema, model } = mongoose;

const FederatedCredentialSchema = new Schema({
  provider: String,
  subject: String,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

export const FederatedCredentialModel = model("federatedCredential", FederatedCredentialSchema);
