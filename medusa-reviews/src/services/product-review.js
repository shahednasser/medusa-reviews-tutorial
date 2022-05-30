import { BaseService } from "medusa-interfaces";

class ProductReviewService extends BaseService {
  constructor({ productReviewRepository, manager }) {
    super();

    this.productReviewRepository = productReviewRepository
    this.manager = manager
  }
  
  async getProductReviews (product_id) {
    const productReviewRepository = this.manager.getCustomRepository(this.productReviewRepository);
    return await productReviewRepository.find({
      product_id
    });
  }

  async addProductReview (product_id, data) {
    if (!data.title || !data.user_name || !data.content || !data.rating) {
      throw new Error("product review requires title, user_name, content, and rating")
    }

    const productReviewRepository = this.manager.getCustomRepository(this.productReviewRepository);
    const createdReview = productReviewRepository.create({
      product_id: product_id,
      title: data.title,
      user_name: data.user_name,
      content: data.content,
      rating: data.rating
    })
    const productReview = await productReviewRepository.save(createdReview);

    return productReview
  }
}

export default ProductReviewService;