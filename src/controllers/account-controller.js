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
      const userExists = await User.findOne({ username: req.body.usersname })

      if (userExists) {
        req.session.flash = { type: 'danger', text: 'The user already exists. Please choose another username.' }
        return res.redirect('/')
      }
      // I got inspiration from chatGPT.

      const user = new User({
        username: req.body.usersname,
        password: req.body.userspassword

      })

      await user.save()

      req.session.user = {
        username: req.body.usersname,
        password: req.body.userspassword,
        permissionLevel: user.permissionLevel,
        userId: user.id
      }

      console.log(req.session)

      req.session.user = null
      req.session.flash = { type: 'success', text: 'The user was created successfully! Please use your credentials to login.' }
      res.redirect('/account/login')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('/account/login')
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
