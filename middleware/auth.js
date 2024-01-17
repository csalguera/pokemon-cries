import jwt from 'jsonwebtoken'

const SECRET = process.env.SECRET

const decodeUserFromToken = (req, res, next) => {
  let token = req.get('Authorization') || req.query.token || req.body.token
  if (!token) return next()

  token = token.replace('Bearer ', '')
  jwt.verify(token, SECRET, (error, decoded) => {
    if (error) return next(error)

    req.user = decoded.user
    next()
  })
}

const checkAuth = (req, res, next) => {
  return req.user ? next() : res.status(401).json({ error: 'Not Authorized' })
}

const checkForAdmin = (req, res, next) => {
  return req.user.isAdmin ? next() : res.status(401).json({ error: 'Not Authorized' })
}

export { decodeUserFromToken, checkAuth, checkForAdmin }