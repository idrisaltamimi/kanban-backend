import express from 'express'

import { createBoard, fetchBoards, updateBoard, deleteBoard } from '../controllers/boards.js'

const router = express.Router()

router.get('/:userId', fetchBoards)
router.post('/post', createBoard)
router.patch('/:id', updateBoard)
router.delete('/delete/:id', deleteBoard)

export default router