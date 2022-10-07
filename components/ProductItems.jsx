import Link from 'next/link';
import React from 'react';

const ProductItems = ({ product, addToCartHndler }) => {
  return (
    <div className="card">
      <Link href={`products/${product.slug}`}>
        <img
          src={product.image}
          alt={product.name}
          className="rounded shadow"
        />
      </Link>
      <div className="flex flex-col items-center justify-center p-5">
        <Link href={`products/${product.slug}`}>
          <a>
            <h2 className="text-lg">{product.name}</h2>
          </a>
        </Link>
        <p className="mb-2">{product.brand}</p>
        <p>Ksh.{product.price} </p>
        <button
          className="primary-button"
          type="button"
          onClick={() => addToCartHndler(product)}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductItems;
