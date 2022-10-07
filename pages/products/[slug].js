import React, { useContext } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { Store } from '../../utils/Store';
import db from '../../utils/db';
import Product from '../../models/Product';
import { toast } from 'react-toastify';
const ProductScreen = ({ product }) => {
  const router = useRouter();

  const {
    state: { cart },
    dispatch,
  } = useContext(Store);
  const addToCartHndler = async () => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error('Sorry product is out of stock');
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
    router.push('/cart');
  };
  if (!product)
    return <Layout title="product not found">Product not Found</Layout>;

  return (
    <Layout title={product.name}>
      <div className="py-2">
        <Link href="/">Back to broducts </Link>
        <div className="grid md:grid-cols-4 md:gap-3">
          <div className="col-span-2">
            <Image
              src={product.image}
              alt={product.name}
              width={640}
              height={640}
              Layout="responsive"
            />
          </div>
          <div>
            <ul>
              <li>
                <h1 className="text-lg">{product.name}</h1>
              </li>
              <li>Category: {product.category}</li>
              <li>Category: {product.brand}</li>
              <li>
                Category: {product.rating} of {product.numReviews} reviews
              </li>
              <li>Description:{product.description}</li>
            </ul>
          </div>
          <div>
            <div className="card p-5">
              <div className="mb-2 flex justify-between">
                <div>Price</div>
                <div>Ksh. {product.price}</div>
              </div>
              <div className="mb-2 flex justify-between">
                <div>Status</div>
                <div>
                  {product.countInStock > 0 ? 'In Stock' : 'Unavailable'}
                </div>
              </div>
              <Link href="/cart">
                <a>
                  <button
                    onClick={addToCartHndler}
                    className="primary-button w-full"
                  >
                    Add to cart
                  </button>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductScreen;

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();

  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}
