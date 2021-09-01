import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import TransactionService from "../services/transaction.service";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { username: "" },
      isAdmin: "Non",
      balance: 0
    };
  }

  async componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    const isAdmin = await UserService.isAdmin(currentUser.accessToken)
    if (isAdmin)
      this.setState({isAdmin : "Oui"})
    const balance = await TransactionService.balance(currentUser.accessToken)
    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser, userReady: true, balance : balance})
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    const { currentUser, balance } = this.state;

    return (
      <div className="container">
        {(this.state.userReady) ?
        <div>
        <header className="jumbotron">
          <h3>
            Profile de <strong>{currentUser.secondeName} {currentUser.firstName}</strong>
          </h3>
        </header>
        <p>
          <strong>Token:</strong>{" "}
          {currentUser.accessToken.substring(0, 20)} ...{" "}
          {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
        </p>
        <p>
          <strong>Admin: </strong>{" "}
          {this.state.isAdmin}
        </p>
        <p>
          <strong>Email:</strong>{" "}
          {currentUser.email}
        </p>
        <p>
          <strong>Nom:</strong>{" "}
          {currentUser.firstName}
        </p>
        <p>
          <strong>Prenom:</strong>{" "}
          {currentUser.secondeName}
        </p>
        <p>
          <strong>Solde:</strong>{" "}
          {balance}€
        </p>
      </div>: null}
      </div>
    );
  }
}
