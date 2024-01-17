import mongoose from "mongoose";

const Schema = mongoose.Schema

const profileSchema = new Schema ({
  name: String,
  isAdmin: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
})

const Profile = mongoose.model('Profile', profileSchema)

export { Profile }