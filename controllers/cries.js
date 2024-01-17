// npm modules
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

// models
import { Cry } from "../models/cry.js";

// middleware
import { bucket, region, s3 } from "../middleware/middleware.js";

const create = async (req, res) => {
  try {
    const cry = await Cry.create({
      name: req.body.name,
      url: `https://${bucket}.s3.${region}.amazonaws.com/${req.file.key}`,
      currentKey: req.file.key,
      previousKey: req.file.key,
      generation: parseInt(req.body.generation, 10),
    })
    return res.status(201).json(cry)
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

const index = async (req, res) => {
  try {
    const cries = await Cry.find({})
    return res.status(200).json(cries)
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

const update = async (req, res) => {
  try {
    const oldCry = await Cry.findById(req.params.id)
    const newCry = await Cry.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        url: `https://${bucket}.s3.${region}.amazonaws.com/${req.file.key}`,
        currentKey: req.file.key,
        previousKey: oldCry.currentKey,
        generation: parseInt(req.body.generation, 10),
      },
      { new: true }
    )

    if (!newCry) {
      return res.status(404).json({ error: "Resource not found" })
    }

    if (newCry.currentKey !== newCry.previousKey) {
      try {
        await s3.send(new DeleteObjectCommand({
          Bucket: bucket,
          Key: newCry.previousKey,
        }))
      } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' })
      }
    }

    return res.status(200).json(newCry)
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

const deleteCry = async (req, res) => {
  try {
    const deletedCry = await Cry.findByIdAndDelete(req.params.id)

    if (!deletedCry) {
      return res.status(404).json({ error: "Resource not found" })
    }

    const key = deletedCry.url.replace(`https://${bucket}.s3.${region}.amazonaws.com/`, '')

    try {
      await s3.send(new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      }))
    } catch (error) {
      console.log(error);
      return res.status(404).json({ error: 'File not found' })
    }
    return res.status(204).end()
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

const show = async (req, res) => {
  try {
    const cry = await Cry.findOne({ name: req.params.name })
    return res.status(200).json(cry)
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

const filter = async (req, res) => {
  try {
    const cries = await Cry.find({ generation: req.params.gen })
    if (cries.length) {
      return res.status(200).json(cries)
    } else {
      return res.status(200).json({ msg: 'No resources found' })
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export {
  index,
  create,
  update,
  deleteCry as delete,
  show,
  filter,
}