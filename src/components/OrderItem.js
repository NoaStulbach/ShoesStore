import React from "react";

const OrderItem = (props) => {
  const { orderItem, product } = props;
  const { id, orderDate, orderState } = orderItem;

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
            <br />
            <small>{`Date of purchase: ${orderDate}`}</small>
            <br />
            <small>{`State of order: ${orderState}`}</small>
          </div>
          {orderState !== "Return in Progress" ? (
            <div className="media-right" onClick={() => props.startReturn(id)}>
              <span className="tag is-primary">Return This Item</span>
            </div>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
