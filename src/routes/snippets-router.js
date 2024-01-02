/**
 * snippets routes.
 *
 * @author Dongzhu Tan
 * @version 2.0.0
 */

import express from 'express'
import { SnippetsController } from '../controllers/snippets-controller.js'

export const router = express.Router()

const controller = new SnippetsController()

// Map HTTP verbs and route paths to controller action methods.

router.get('/', (req, res, next) => controller.index(req, res, next))

router.get('/create', (req, res, next) => controller.create(req, res, next))
router.post('/create', (req, res, next) => controller.createSnippet(req, res, next))

router.get('/:id/update', (req, res, next) => controller.update(req, res, next))
router.post('/:id/update', (req, res, next) => controller.updateSnippet(req, res, next))

router.get('/:id/delete', (req, res, next) => controller.delete(req, res, next))
router.post('/:id/delete', (req, res, next) => controller.deleteSnippet(req, res, next))
