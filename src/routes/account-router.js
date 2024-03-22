/**
 * Account routes.
 *
 * @author Dongzhu Tan
 * @version 2.0.0
 */

import express from 'express'
import { AccountController } from '../controllers/account-controller.js'

export const router = express.Router()

const accountController = new AccountController()

// Map HTTP verbs and route paths to controller actions.

// Log in
router.get('/login', (req, res, next) => accountController.showLogin(req, res, next))
router.post('/login', (req, res, next) => accountController.login(req, res, next))

// Register
router.post('/register', (req, res, next) => accountController.register(req, res, next))

// Log out
router.post('/logout', (req, res, next) => accountController.logout(req, res, next))
