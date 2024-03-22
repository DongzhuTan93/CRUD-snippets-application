/**
 * The routes.
 *
 * @author Dongzhu Tan
 * @version 2.0.0
 */

import express from 'express'
import { router as homeRouter } from './home-router.js'
import { router as snippetsRouter } from './snippets-router.js'
import { router as accountRouter } from './account-router.js'

export const router = express.Router()

router.use('/', homeRouter)
router.use('/snippets', snippetsRouter)
router.use('/account', accountRouter)

router.use('*', (req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
