import { Cry } from "../models/cry.js";

const create = async (req, res) => {
  try {
    const cry = await Cry.create(req.body)
    res.status(201).json(cry)
  } catch (error) {
    console.log(error);
    res.status(500).json(error)
  }
}

const index = async (req, res) => {
  try {
    const cries = await Cry.find({})
    res.status(201).json(cries)
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
    res.status(200).json(cry)
  } catch (error) {
    console.log(error);
    res.status(500).json(error)
  }
}

const deleteCry = async (req, res) => {
  try {
    await Cry.findByIdAndDelete(req.params.id)
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