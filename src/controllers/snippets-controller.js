/**
 * Module for the snippetsController.
 *
 * @author Dongzhu Tan
 * @version 2.0.0
 */

import { Snippet } from '../models/snippets.js'

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
   * @param {Function} next - Express next middleware function.
   * @returns {void} - No return value, calls next with an error if the user does not have permission to create the snippets.
   */
  async showCreateSnippetsForm (req, res, next) {
    try {
      if (!req?.session?.user?.userId) {
        throw new Error('You must be logged in or register to create a new snippet!')
      }
      res.render('snippets/create')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('/')
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
      res.redirect('/snippets')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('..')
    }
  }

  /**
   * Returns a HTML form for updating a snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {void} - No return value, calls next with an error if the user does not have permission to update the snippets.
   */
  async showUpdateSnippetsForm (req, res, next) {
    try {
      if (!req?.session?.user?.userId) {
        throw new Error('Come back to the home page to login or register to update a new snippet.')
      }

      const snippet = await Snippet.findById(req.params.id)
      const loggedInUser = await req.session.user

      if (snippet.creatorId !== loggedInUser.userId) {
        throw new Error('You can not update another peoples snippet.')
      }

      res.render('snippets/update', { viewData: snippet.toObject() })
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('/snippets')
    }
  }

  /**
   * Updates a specific snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {void} - No return value, calls next with an error if the user does not have permission to update the snippets.
   */
  async updateSnippet (req, res, next) {
    try {
      const snippet = await Snippet.findById(req.params.id)

      const loggedInUser = await req.session.user
      if (!loggedInUser) {
        throw new Error('Come back to the home page to login or register to update a new snippet.')
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

      res.redirect('/snippets')
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
   * @returns {void} - No return value, calls next with an error if the user does not have permission to delete the snippets.
   */
  async showDeleteSnippetsForm (req, res) {
    try {
      const snippet = await Snippet.findById(req.params.id)

      const loggedInUser = await req.session.user

      if (!loggedInUser) {
        throw new Error('Come back to the home page to login or register to delete a snippet.')
      }

      if (loggedInUser.userId !== snippet.creatorId) {
        throw new Error('You can not delete another pepoles snippet.')
      }

      res.render('snippets/delete', { viewData: snippet.toObject() })
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('/snippets')
    }
  }

  /**
   * Deletes the specified snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {void} - No return value, calls next with an error if the user does not have permission to delete the snippets.
   */
  async deleteSnippet (req, res, next) {
    try {
      const snippet = await Snippet.findById(req.params.id)
      const loggedInUser = await req.session.user

      if (!loggedInUser) {
        throw new Error('Come back to the home page to login or register to delete a snippet.')
      }

      if (loggedInUser.userId !== snippet.creatorId) {
        throw new Error('You can not delete another pepoles snippet.')
      }

      await Snippet.findByIdAndDelete(req.body.id)

      req.session.flash = { type: 'success', text: 'The snippet was deleted successfully.' }
      res.redirect('..')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./delete')
    }
  }
}
