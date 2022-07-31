import React, { Component } from "react";
import { Switch, Route, Link, BrowserRouter as Router } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

import Cart from "./components/Cart";
import OrdersList from "./components/OrdersList";
import Login, { isLoggedIn } from "./components/Login";
import ProductList from "./components/ProductList";

import * as DataConnection from "./DataConnection";

import Context from "./Context";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastAction: null,
      cart: {},
      orders: {},
      products: []
    };
    this.routerRef = React.createRef();
  }

  async componentDidMount() {
    let user = localStorage.getItem("user");
    let cart = localStorage.getItem("cart");

    let products = await DataConnection.getProducts();
    let orders = await DataConnection.getOrders();
    user = user ? JSON.parse(user) : null;
    cart = cart ? JSON.parse(cart) : {};

    this.setState({ user, products: products, orders: orders, cart });
  }

  logout = (e) => {
    e.preventDefault();
    const auth = getAuth();
    signOut(auth).then(() => {
      this.updateOrders();
      this.forceUpdate();
    });
  };

  addToCart = (cartItem) => {
    let cart = this.state.cart;
    if (cart[cartItem.id]) {
      cart[cartItem.id].amount += cartItem.amount;
    } else {
      cart[cartItem.id] = cartItem;
    }
    if (cart[cartItem.id].amount > cart[cartItem.id].product.stock) {
      cart[cartItem.id].amount = cart[cartItem.id].product.stock;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    this.setState({ cart });
  };

  removeFromCart = (cartItemId) => {
    let cart = this.state.cart;
    delete cart[cartItemId];
    localStorage.setItem("cart", JSON.stringify(cart));
    this.setState({ cart });
  };

  clearCart = () => {
    let cart = {};
    localStorage.removeItem("cart");
    this.setState({ cart });
  };

  hideMenu = () => {
    this.setState({ showMenu: false });
  };

  async updateOrders() {
    let orders = await DataConnection.getOrders();
    this.setState({ orders: orders });
  }

  async startReturn(orderId) {
    await DataConnection.sendReturn(orderId).then(this.updateOrders());
  }

  render() {
    return (
      <Context.Provider
        value={{
          ...this.state,
          removeFromCart: this.removeFromCart,
          addToCart: this.addToCart,
          login: this.login,
          clearCart: this.clearCart,
          startReturn: this.startReturn.bind(this),
          hideMenu: this.hideMenu
        }}
      >
        <Router ref={this.routerRef}>
          <div className="App">
            <nav
              className="navbar container"
              role="navigation"
              aria-label="main navigation"
            >
              <div className="navbar-brand">
                <b className="navbar-item is-size-4">Golden Shoe</b>
                <label
                  role="button"
                  className="navbar-burger burger"
                  aria-label="menu"
                  aria-expanded="false"
                  data-target="navbarBasicExample"
                  onClick={(e) => {
                    e.preventDefault();
                    this.setState({ showMenu: !this.state.showMenu });
                  }}
                >
                  <span aria-hidden="true"></span>
                  <span aria-hidden="true"></span>
                  <span aria-hidden="true"></span>
                </label>
              </div>
              <div
                className={`navbar-menu ${
                  this.state.showMenu ? "is-active" : ""
                }`}
              >
                <Link to="/products" className="navbar-item">
                  Products
                </Link>
                <Link to="/cart" className="navbar-item">
                  Cart
                  <span
                    className="tag is-primary"
                    style={{ marginLeft: "5px" }}
                  >
                    {Object.keys(this.state.cart).length}
                  </span>
                </Link>
                {isLoggedIn() && (
                  <Link
                    to="/orders"
                    onClick={this.updateOrders.bind(this)}
                    className="navbar-item"
                  >
                    My Orders
                  </Link>
                )}
                {!isLoggedIn() ? (
                  <Link to="/login" className="navbar-item">
                    Login
                  </Link>
                ) : (
                  <Link to="/" onClick={this.logout} className="navbar-item">
                    Logout
                  </Link>
                )}
              </div>
            </nav>
            <Switch>
              <Route exact path="/" component={ProductList} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/cart" component={Cart} />
              <Route exact path="/orders" component={OrdersList} />
              <Route exact path="/products" component={ProductList} />
            </Switch>
          </div>
        </Router>
      </Context.Provider>
    );
  }
}
