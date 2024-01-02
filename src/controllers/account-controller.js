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
   * @param {Function} next - Express next middleware function.
   */
  async login (req, res, next) {
    try {
      const user = await User.authenticate(req.body.usersname, req.body.userspassword)
      req.session.user = {
        username: req.body.usersname,
        password: req.body.userspassword,
        permissionLevel: user.permissionLevel,
        userId: user.id
      }

      req.session.flash = { type: 'success', text: 'The user login successfully.' }
      res.redirect('/snippets-app', { flash: res.locals.flash })
    } catch (error) {
      // Authentication failed.
      const err = createError(401)
      err.cause = error
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('/snippets-app/home/login')
    }
  }

  /**
   * Registers a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async register (req, res, next) {
    try {
      const userExists = await User.findOne({ username: req.body.usersname })
      if (userExists) {
        req.session.flash = { type: 'danger', text: 'The user already exists. Please choose another username.' }
        return res.redirect('/snippets-app')
      }
      // I got inspiration from chatGPT

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

      req.session.flash = { type: 'success', text: 'The user was created successfully.' }
      res.redirect('/snippets-app/home/login', { flash: res.locals.flash })
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('/snippets-app')
    }
  }

  /**
   * Logs out a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async logout (req, res, next) {
    try {
      if (req?.session?.user) {
        req.session.user = null
        req.session.flash = { type: 'success', text: 'The user is logged out!' }
        res.redirect('/snippets-app')
      }
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('.')
    }
  }

  /**
   * Logs out a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async showHomeLogin (req, res, next) {
    try {
      res.render('home/login', { flash: res.locals.flash })
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('.')
    }
  }
}
