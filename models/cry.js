import mongoose from "mongoose";

const Schema = mongoose.Schema

const crySchema = new Schema({
  name: String,
  cryUrl: String,
}, {
  timestamps: true,
})

const Cry = mongoose.model('Cry', crySchema)

export { Cry }