import * as Yup from 'yup';

import React, { useContext, useEffect, useState } from "react";
import { formatPrice, resetOptions } from "../../utils/helper-functions";

import { BiShoppingBag } from "react-icons/bi";
import HyperModal from 'react-hyper-modal';
import Image from "next/image"
import { StarIcon } from "@heroicons/react/solid"
import StoreContext from "../../context/store-context";
import axios from "axios";
import { createClient } from "../../utils/client";
import { formatPrices } from "../../utils/prices";
import styles from "../../styles/product.module.css";
import { useFormik } from "formik";

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000";

const Product = ({ product }) => {
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const { addVariantToCart, cart } = useContext(StoreContext);
  const [options, setOptions] = useState({
    variantId: "",
    quantity: 0,
    size: "",
  });
  const reviewFormik = useFormik({
    initialValues: {
      title: "",
      user_name: "",
      rating: 1,
      content: ""
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required(),
      user_name: Yup.string().required(),
      rating: Yup.number().min(1).max(5),
      content: Yup.string().required()
    }),
    onSubmit: (values) => {
      axios.post(`${BACKEND_URL}/store/products/${product.id}/reviews`, {
        data: {
          title: values.title,
          user_name: values.user_name,
          rating: values.rating,
          content: values.content
        }
      })
      .then(() => {
        getReviews()
        setModalOpen(false)
      })
    }
  })

  useEffect(() => {
    if (product) {
      setOptions(resetOptions(product));
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      getReviews()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product])

  function getReviews () {
    axios.get(`${BACKEND_URL}/store/products/${product.id}/reviews`)
      .then((response) => setReviews(response.data.product_reviews))
  }

  const handleQtyChange = (action) => {
    if (action === "inc") {
      if (
        options.quantity <
        product.variants.find(({ id }) => id === options.variantId)
          .inventory_quantity
      )
        setOptions({
          variantId: options.variantId,
          quantity: options.quantity + 1,
          size: options.size,
        });
    }
    if (action === "dec") {
      if (options.quantity > 1)
        setOptions({
          variantId: options.variantId,
          quantity: options.quantity - 1,
          size: options.size,
        });
    }
  };

  const handleAddToBag = () => {
    addVariantToCart({
      variantId: options.variantId,
      quantity: options.quantity,
    });
    if (product) setOptions(resetOptions(product));
  };

  return (
    <div className={styles.container}>
      <figure className={styles.image}>
        <div className={styles.placeholder}>
          <Image
            objectFit="cover"
            layout="fill"
            loading="eager"
            src={product.thumbnail}
            alt={`${product.title}`}
          />
        </div>
      </figure>
      <div className={styles.info}>
        <span />
        <div className={styles.details}>
          <div className="title">
            <h1>{product.title}</h1>
          </div>
          <p className="price">{formatPrices(cart, product.variants[0])}</p>
          <div className={styles.selection}>
            <p>Select Size</p>
            <div className="selectors">
              {product.variants
                .slice(0)
                .reverse()
                .map((v) => {
                  return (
                    <button
                      key={v.id}
                      className={`${styles.sizebtn} ${
                        v.title === options.size ? styles.selected : null
                      }`}
                      onClick={() =>
                        setOptions({
                          variantId: v.id,
                          quantity: options.quantity,
                          size: v.title,
                        })
                      }
                    >
                      {v.title}
                    </button>
                  );
                })}
            </div>
          </div>
          <div className={styles.selection}>
            <p>Select Quantity</p>
            <div className={styles.qty}>
              <button
                className={styles.qtybtn}
                onClick={() => handleQtyChange("dec")}
              >
                -
              </button>
              <span className={styles.ticker}>{options.quantity}</span>
              <button
                className={styles.qtybtn}
                onClick={() => handleQtyChange("inc")}
              >
                +
              </button>
            </div>
          </div>
          <button className={styles.addbtn} onClick={() => handleAddToBag()}>
            <span>Add to bag</span>
            <BiShoppingBag />
          </button>
          <div className={styles.tabs}>
            <div className="tab-titles">
              <button className={styles.tabtitle}>Product Description</button>
            </div>
            <div className="tab-content">
              <p>{product.description}</p>
            </div>
          </div>
          <div style={{marginTop: "30px"}}>
            <p>Product Reviews</p>
            <HyperModal
              isOpen={isModalOpen}
              requestClose={() => setModalOpen(false)}
              renderOpenButton={() => {
                return (
                  <button className={styles.addbtn} onClick={() => setModalOpen(true)}>Add Review</button>
                );
              }}
            >
              <form onSubmit={reviewFormik.handleSubmit} style={{padding: "20px"}}>
                <h2>Add Review</h2>
                <div style={{marginBottom: "10px"}}>
                  <label htmlFor="title">Title</label>
                  <input type="text" name="title" id="title" onChange={reviewFormik.handleChange}
                    value={reviewFormik.values.title} style={{display: "block", width: "100%"}} />
                  {reviewFormik.touched.title && reviewFormik.errors.title && <span style={{color: "red"}}>{reviewFormik.errors.title}</span>}
                </div>
                <div style={{marginBottom: "10px"}}>
                  <label htmlFor="user_name">User Name</label>
                  <input type="text" name="user_name" id="user_name" onChange={reviewFormik.handleChange}
                    value={reviewFormik.values.user_name} style={{display: "block", width: "100%"}} />
                  {reviewFormik.touched.user_name && reviewFormik.errors.user_name && <span style={{color: "red"}}>{reviewFormik.errors.user_name}</span>}
                </div>
                <div style={{marginBottom: "10px"}}>
                  <label htmlFor="rating">Rating</label>
                  <input type="number" name="rating" id="rating" onChange={reviewFormik.handleChange}
                    value={reviewFormik.values.rating} min="1" max="5" style={{display: "block", width: "100%"}} />
                  {reviewFormik.touched.rating && reviewFormik.errors.rating && <span style={{color: "red"}}>{reviewFormik.errors.rating}</span>}
                </div>
                <div style={{marginBottom: "10px"}}>
                  <label htmlFor="content">Content</label>
                  <textarea name="content" id="content" onChange={reviewFormik.handleChange} 
                    value={reviewFormik.values.content} style={{display: "block", width: "100%"}} rows={5}></textarea>
                  {reviewFormik.touched.content && reviewFormik.errors.content && <span style={{color: "red"}}>{reviewFormik.errors.content}</span>}
                </div>
                <button className={styles.addbtn}>Add</button>
              </form>
            </HyperModal>
            {reviews.length === 0 && <div style={{marginTop: "10px"}}>There are no product reviews</div>}
            {reviews.length > 0 && reviews.map((review, index) => (
              <div key={review.id} style={{marginTop: "10px", marginBottom: "10px"}}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                  <h3>{review.title}</h3>
                  <div style={{display: "flex"}}>
                    {Array(review.rating).fill(0).map((_, index) => <StarIcon key={index} style={{color: "#FFDF00", height: "24px", width: "24px"}} />)}
                  </div>
                </div>
                <small style={{color: "grey"}}>By {review.user_name}</small>
                <div style={{marginTop: "10px", marginBottom: "10px"}}>{review.content}</div>
                <small style={{color: "grey"}}>{review.created_at}</small>
                {index !== reviews.length - 1 && <hr />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

//create a Medusa client
const client = createClient();

export async function getStaticPaths() {
  // Call an external API endpoint to get products
  const { products } = await client.products.list();

  // Get the paths we want to pre-render based on the products
  const paths = products.map((product) => ({
    params: { id: product.id },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  // params contains the product `id`.
  // If the route is like /product/prod_1, then params.id is 1
  const { product } = await client.products.retrieve(params.id);

  // Pass post data to the page via props
  return { props: { product } };
}

export default Product;
