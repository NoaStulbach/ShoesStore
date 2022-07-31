import React from "react";

const ProductItem = (props) => {
  const { product } = props;
  return (
    <div className=" column is-half">
      <div className="box">
        <div className="media">
          <div className="media-left">
            <figure className="image is-128x128">
              <img src={product.imageUrl} alt={product.shortDesc} />
            </figure>
          </div>
          <div className="media-content">
            <b style={{ textTransform: "capitalize" }}>
              {product.name}{" "}
              <span className="tag is-secondary">${product.price}</span>
            </b>
            <div>{product.shortDesc}</div>
            <div className="is-clearfix">
              <text style={{ color: "red" }}>
                {product.stock === 1 ? "Last in stock!" : ""}
              </text>
              <button
                disabled={product.stock === 0}
                className="button is-small is-outlined is-primary   is-pulled-right"
                onClick={() =>
                  props.addToCart({
                    id: product.name,
                    product,
                    amount: 1
                  })
                }
              >
                {product.stock === 0 ? "Out of stock" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
