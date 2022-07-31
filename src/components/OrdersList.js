import React from "react";
import withContext from "../withContext";
import OrderItem from "./OrderItem";

const OrdersList = (props) => {
  const { orders, products } = props.context;
  const orderKeys = Object.keys(orders || {});
  return (
    <>
      <div className="hero is-primary">
        <div className="hero-body container">
          <h4 className="title">My Orders</h4>
        </div>
      </div>
      <br />
      <div className="container">
        {orderKeys.length ? (
          <div className="column columns is-multiline">
            {orderKeys.map((key) => (
              <OrderItem
                key={key}
                orderItem={orders[key]}
                product={
                  products.filter((obj) => obj.id === orders[key]["product"])[0]
                }
                startReturn={props.context.startReturn}
              />
            ))}
          </div>
        ) : (
          <div className="column">
            <div className="title has-text-grey-light">
              You don't have any orders!
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default withContext(OrdersList);
