/**
 * Module for the AccountController.
 *
 * @author Dongzhu Tan
 * @version 2.0.0
 */

import createError from 'http-errors'
import { User } from '../models/user.js'

/**
 * Encapsulates a controller.
 */
export class AccountController {
  /**
   * Authenticates a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async login (req, res) {
    try {
      const user = await User.authenticate(req.body.usersname, req.body.userspassword)

      req.session.user = {
        username: req.body.usersname,
        password: req.body.userspassword,
        permissionLevel: user.permissionLevel,
        userId: user.id
      }

      req.session.flash = { type: 'success', text: 'The user login successfully.' }
      res.redirect('/', { flash: res.locals.flash })
    } catch (error) {
      // Authentication failed.
      const err = createError(401)
      err.cause = error
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('/account/login')
    }
  }

  /**
   * Show login form.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async showLogin (req, res) {
    try {
      res.render('home/login', { flash: res.locals.flash })
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('/')
    }
  }

  /**
   * Registers a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @returns {Promise<void>} - A promise that resolves when the registration process is complete.
   */
  async register (req, res) {
    try {
      console.log(req.body)
      const { username, password } = req.body

      // Check for empty input
      if (!username || !password) {
        req.session.flash = { type: 'danger', text: 'Username and password are required.' }
        return res.redirect('/')
      }

      // Check if the user already exists
      const userExists = await User.findOne({ username })

      if (userExists) {
        req.session.flash = { type: 'danger', text: 'The user already exists. Please choose another username.' }
        return res.redirect('/')
      }

      // Create new user
      const user = new User({
        username,
        password
      })

      await user.save()

      // Set session user
      req.session.user = {
        username,
        password,
        permissionLevel: user.permissionLevel,
        userId: user.id
      }

      console.log(req.session)

      // Clear session user and set success message
      req.session.user = null
      req.session.flash = { type: 'success', text: 'The user was created successfully! Please use your credentials to login.' }
      res.redirect('/account/login')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('/')
    }
  }

  /**
   * Logs out a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async logout (req, res) {
    try {
      if (req?.session?.user) {
        req.session.user = null
        req.session.flash = { type: 'success', text: 'The user is logged out!' }
        res.redirect('/')
      }
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('.')
    }
  }
}
