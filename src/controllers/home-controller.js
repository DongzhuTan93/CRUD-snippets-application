/**
 * Home controller.
 *
 * @author Dongzhu Tan
 * @version 2.0.0
 */

/**
 * Encapsulates a controller.
 */
export class HomeController {
  /**
   * Renders a view and sends the rendered HTML string as an HTTP response.
   * index GET.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  index (req, res, next) {
    // console.log(req.session)
    res.render('home/home-page', { flash: res.locals.flash })
  }
}
