/**
 * Home routes.
 *
 * @author Dongzhu Tan
 * @version 2.0.0
 */

import express from 'express'
import { HomeController } from '../controllers/home-controller.js'

export const router = express.Router()

const homeController = new HomeController()

router.get('/', (req, res, next) => homeController.index(req, res, next))
