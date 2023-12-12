import multer from "multer"
import fs from 'fs'
import path from "path"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDirectory = path.join('uploads')

    if (!fs.existsSync(uploadsDirectory)) {
      fs.mkdirSync(uploadsDirectory)
    }

    cb(null, uploadsDirectory)
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const upload =  multer({ storage: storage }).single('cryFile')

export { upload }