import { Router } from "express"
import bodyParser from "body-parser"
import cors from "cors"
import { projectConfig } from "../../medusa-config"

export default () => {
  const router = Router()
  const storeCorsOptions = {
    origin: projectConfig.store_cors.split(","),
    credentials: true,
  }

  router.get("/store/products/:id/reviews", cors(storeCorsOptions), (req, res) => {
    const productReviewService = req.scope.resolve("productReviewService")
    productReviewService.getProductReviews(req.params.id).then((product_reviews) => {
      return res.json({
        product_reviews
      })
    })
  })

  router.use(bodyParser.json())
  router.options("/store/products/:id/reviews", cors(storeCorsOptions))
  router.post("/store/products/:id/reviews", cors(storeCorsOptions), (req, res) => {
    const productReviewService = req.scope.resolve("productReviewService")
    productReviewService.addProductReview(req.params.id, req.body.data).then((product_review) => {
      return res.json({
        product_review
      })
    })
  })

  const corsOptions = {
    origin: projectConfig.admin_cors.split(","),
    credentials: true,
  }
  router.options("/admin/products/:id/reviews", cors(corsOptions))
  router.get("/admin/products/:id/reviews", cors(corsOptions), async (req, res) => {
    const productReviewService = req.scope.resolve("productReviewService")
    productReviewService.getProductReviews(req.params.id).then((product_reviews) => {
      return res.json({
        product_reviews
      })
    })
  })


  return router;
}