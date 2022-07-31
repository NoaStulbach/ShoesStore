import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import withContext from "../withContext";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import * as DataConnection from "../DataConnection";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: false,
      username: "",
      password: ""
    };
  }

  handleChange = (e) =>
    this.setState({ [e.target.name]: e.target.value, error: "" });

  login = (e) => {
    e.preventDefault();

    const { username, password } = this.state;
    if (!username || !password) {
      return this.setState({ error: "Fill all fields!" });
    }
    this.doLogin(username, password);
  };

  doLogin = async (email, password) => {
    const auth = getAuth(DataConnection.firebaseApp);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        this.props.context.hideMenu();
      })
      .catch(() => {
        this.setState({ error: "Invalid Credentails" });
      });
  };

  render() {
    return !isLoggedIn() ? (
      <>
        <div className="hero is-primary ">
          <div className="hero-body container">
            <h4 className="title">Login</h4>
          </div>
        </div>
        <br />
        <br />
        <form onSubmit={this.login}>
          <div className="columns is-mobile is-centered">
            <div className="column is-one-third">
              <div className="field">
                <label className="label">Email: </label>
                <input
                  className="input"
                  type="email"
                  name="username"
                  onChange={this.handleChange}
                />
              </div>
              <div className="field">
                <label className="label">Password: </label>
                <input
                  className="input"
                  type="password"
                  name="password"
                  onChange={this.handleChange}
                />
              </div>
              {this.state.error && (
                <div className="has-text-danger">{this.state.error}</div>
              )}
              <div className="field is-clearfix">
                <button className="button is-primary is-outlined is-pulled-right">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </form>
      </>
    ) : (
      <Redirect to="/products" />
    );
  }
}

export default withContext(Login);

export function isLoggedIn() {
  return getAuth(DataConnection.firebaseApp).currentUser !== null;
}
