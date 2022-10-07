import { useContext } from 'react';
import Layout from '../components/Layout';
import ProductItems from '../components/ProductItems';
import Product from '../models/Product';
import db from '../utils/db';
import axios from 'axios';
import { Store } from '../utils/Store';
import { toast } from 'react-toastify';

export default function Home({ products }) {
  const {
    state: { cart },
    dispatch,
  } = useContext(Store);
  const addToCartHndler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      alert('Sorry product is out of stock');
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });

    toast.success('Product added to the cart');
  };
  return (
    <Layout title="Home page">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductItems
            product={product}
            key={product.slug}
            addToCartHndler={addToCartHndler}
          />
        ))}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}
