import { Box, Flex, Text } from "rebass"
import React, { useEffect, useState } from "react"

import BodyCard from "../../../../components/organisms/body-card"
import { ReactComponent as Star } from "../../../../assets/svg-2.0/star.svg"
import medusaRequest from "../../../../services/request"

const Reviews = ({ id }) => {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    medusaRequest("get", `/admin/products/${id}/reviews`)
      .then((response) => setReviews(response.data.product_reviews))
      .catch((e) => console.error(e))
  }, [])

  return (
    <BodyCard title="Product Reviews">
      {reviews.length === 0 && (
        <span>There are no reviews for this product</span>
      )}
      {reviews.length > 0 &&
        reviews.map((review) => (
          <Box key={review.id} bg="light" padding="2" mb="2">
            <Flex justifyContent="space-between">
              <Box mr={4}>
                <Text fontWeight="700" mb={3}>
                  {review.title}
                </Text>
              </Box>
              <Flex mr={4}>
                {Array(review.rating)
                  .fill(0)
                  .map(() => (
                    <Star fill="yellow" />
                  ))}
              </Flex>
            </Flex>
            <Text color="gray">By {review.user_name}</Text>
            <br />
            <Text>{review.content}</Text>
            <br />
            <Text color="gray">{review.created_at}</Text>
          </Box>
        ))}
    </BodyCard>
  )
}

export default Reviews
