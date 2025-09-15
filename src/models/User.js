import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  auth0Id: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    index: {
      unique: true,
      partialFilterExpression: { email: { $type: "string" } }
    }
  },
  name: String,
  picture: String,
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  roles: {
    type: [String],
    default: [],
  }
});

const User = mongoose.model('User', userSchema);
export default User;