/**
 * Module for the snippetsController.
 *
 * @author Dongzhu Tan
 * @version 2.0.0
 */

import { Snippet } from '../models/snippets.js'
import createError from 'http-errors'

/**
 * Encapsulates a controller.
 */
export class SnippetsController {
  /**
   * Displays a list of snippets.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      const viewData = {
        snippets: (await Snippet.find())
          .map(snippet => snippet.toObject())
      }

      res.render('snippets/index', { viewData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Returns a HTML form for creating a new snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async create (req, res) {
    try {
      if (!req?.session?.user?.userId) {
        throw new Error('You must be logged in or register to create a new snippet!')
      }
      res.render('snippets/create')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('/snippets-app')
    }
  }

  /**
   * Creates a new snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async createSnippet (req, res) {
    try {
      const loggedInUser = await req.session.user

      const snippet = new Snippet({
        description: req.body.description,
        creatorId: loggedInUser.userId
      })

      await snippet.save()

      req.session.flash = { type: 'success', text: 'The snippet was created successfully.' }
      res.redirect('/snippets-app/home/login')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('.')
    }
  }

  /**
   * Returns a HTML form for updating a snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async update (req, res) {
    try {
      if (!req?.session?.user?.userId) {
        throw new Error('You must be logged in or register to update snippet.')
      }

      const snippet = await Snippet.findById(req.params.id)
      const loggedInUser = await req.session.user

      if (snippet.creatorId !== loggedInUser.userId) {
        throw new Error('You can not update another peoples snippet.')
      }

      res.render('snippets/update', { viewData: snippet.toObject() })
    } catch (error) {
      const err = createError(403)
      err.cause = error
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('..')
    }
  }

  /**
   * Updates a specific snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async updateSnippet (req, res) {
    try {
      const snippet = await Snippet.findById(req.params.id)

      const loggedInUser = await req.session.user
      if (!loggedInUser) {
        throw new Error('You must be logged in or register to update a new snippet.')
      }

      if (snippet) {
        snippet.description = req.body.description

        await snippet.save()

        req.session.flash = { type: 'success', text: 'The snippet was updated successfully.' }
      } else {
        req.session.flash = {
          type: 'danger',
          text: 'The snippet you attempted to update was removed by another user after you got the original values.'
        }
      }
      res.redirect('/snippets-app')

      await snippet.save()
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./update')
    }
  }

  /**
   * Returns a HTML form for deleting a snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async delete (req, res) {
    try {
      const snippet = await Snippet.findById(req.params.id)

      const loggedInUser = await req.session.user

      if (!loggedInUser) {
        throw new Error('You must be logged in or register to delete a snippet.')
      }

      if (loggedInUser.userId !== snippet.creatorId) {
        const error = new Error('Forbidden')
        error.status = 403
        throw error
      }

      res.render('snippets/delete', { viewData: snippet.toObject() })
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('..')
    }
  }

  /**
   * Deletes the specified snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async deleteSnippet (req, res) {
    try {
      await Snippet.findByIdAndDelete(req.body.id)

      req.session.flash = { type: 'success', text: 'The snippet was deleted successfully.' }
      res.redirect('..')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./delete')
    }
  }
}
