// models
import { Cry } from "../models/cry.js";

// middleware
import { bucket, region, s3 } from "../middleware/middleware.js";

const create = async (req, res) => {
  try {
    const cry = await Cry.create({
      name: req.body.name,
      url: `https://${bucket}.s3.${region}.amazonaws.com/${req.file.key}`
    })
    res.status(201).json(cry)
  } catch (error) {
    console.log(error);
    res.status(500).json(error)
  }
}

const index = async (req, res) => {
  try {
    const cries = await Cry.find({})
    res.status(200).json(cries)
  } catch (error) {
    console.log(error);
    res.status(500).json(error)
  }
}

const update = async (req, res) => {
  try {
    const cry = await Cry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    if (!cry) {
      return res.status(404).json({ error: "Resource not found" })
    }
  
    res.status(200).json(cry)
  } catch (error) {
    console.log(error);
    res.status(500).json(error)
  }
}

const deleteCry = async (req, res) => {
  try {
    const deletedCry = await Cry.findByIdAndDelete(req.params.id)

    if (!deletedCry) {
      return res.status(404).json({ error: "Resource not found" })
    }

    res.status(204).end()
  } catch (error) {
    console.log(error);
    res.status(500).json(error)
  }
}

export {
  index,
  create,
  update,
  deleteCry as delete,
}