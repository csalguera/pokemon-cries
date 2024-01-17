import { Profile } from "../models/profile.js";

const index = async (req, res) => {
  try {
    const profiles = await Profile.find({})
    return res.status(200).json(profiles)
  } catch (error) {
    console.log(error);
    res.status(500).json(error)
  }
}

export {
  index,
}