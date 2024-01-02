/**
 * Account routes.
 *
 * @author Dongzhu Tan
 * @version 2.0.0
 */

import express from 'express'
import { AccountController } from '../controllers/account-controller.js'

export const router = express.Router()

const controller = new AccountController()

// Map HTTP verbs and route paths to controller actions.

// Log in
router.get('/login', (req, res, next) => controller.showHomeLogin(req, res, next))
router.post('/login', (req, res, next) => controller.login(req, res, next))

router.post('/register', (req, res, next) => controller.register(req, res, next))

// Log out
router.post('/logout', (req, res, next) => controller.logout(req, res, next))
