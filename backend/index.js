require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const mongoose = require('mongoose')
const router = require('./routes/router')

const hServer = express()

hServer.use(cors())
hServer.use(express.json())

// Serve uploaded images as static files
hServer.use('/uploads', express.static(path.join(__dirname, 'uploads')))

hServer.use("/api", router)

require('./database/dbconnection')

const PORT = process.env.PORT || 3000

hServer.listen(PORT, () => {
    console.log(`Server is running successfully on port ${PORT}`)
})

hServer.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  })
})
