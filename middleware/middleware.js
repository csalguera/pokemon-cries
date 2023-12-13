// npm modules
import 'dotenv/config.js'
import { S3 } from '@aws-sdk/client-s3';
import multer from 'multer'
import multerS3 from 'multer-s3'

const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY
const bucket = process.env.AWS_BUCKET
const region = process.env.AWS_REGION

const credentials = {
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
}

const s3 = new S3({
  credentials,
  region: region,
})

const upload = multer({
  storage: multerS3({
    bucket,
    s3,
    acl: 'public-read',
    key: (req, file, cb) => {
      cb(null, file.originalname)
    }
  })
})

const uploadFile = (req, res, next) => {
  try {
    upload.single('file')(req, res, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' })
      }
      next()
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export {
  uploadFile,
  bucket,
  region,
  s3,
}