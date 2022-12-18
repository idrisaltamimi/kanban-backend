import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

import User from '../model/user.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: `${__dirname}/../.env` })

export const signIn = async (req, res) => {
  const { username, password } = req.body

  try {
    const existingUser = await User.findOne({ username })

    if (!existingUser) {
      return res.status(404).json({ message: `There is no account with the username "${username}"` })
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)

    if (!isPasswordCorrect) return res.status(400).json({ message: 'Wrong password' })

    const token = jwt.sign({ username: existingUser.username, _id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '24h' })

    res.status(200).json({ result: existingUser, token })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}
export const signUp = async (req, res) => {
  const { username, password, confirmPassword } = req.body

  try {
    const existingUser = await User.findOne({ username })

    if (existingUser) return res.status(400).json({ existingUser: true, message: `There is an existing account with the username "${username}"` })

    if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords don’t match' })

    const hashedPassword = await bcrypt.hash(password, 12)

    const result = await User.create({ password: hashedPassword, username })

    const token = jwt.sign({ username: result.username, _id: result._id }, process.env.JWT_SECRET, { expiresIn: '24h' })

    res.status(201).json({ result, token })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })

    console.log(error)
  }
}