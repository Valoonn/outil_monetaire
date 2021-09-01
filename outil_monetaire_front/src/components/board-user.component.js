import React, { Component } from "react";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import TransactionService from "../services/transaction.service";
import AuthService from "../services/auth.service";
import { MDBDataTable } from 'mdbreact';

export default class BoardUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      transaction: [
        {id: "Chargement ...", debit_id: "Chargement ...", credit_id: "Chargement ...", amount: "Chargement ..."},
        {id: "Chargement ...", debit_id: "Chargement ...", credit_id: "Chargement ...", amount: "Chargement ..."}],
    };
  }

  componentDidMount() {
    UserService.getUserBoard().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
    TransactionService.allFromId(AuthService.getCurrentUser().accessToken).then(
      response => {
        console.log(response.data)
        const columns =  [
          {
            label: '#',
            field: 'id',
            sort: 'asc',
            width: 100
          },
          {
            label: 'Debité à',
            field: 'debit_id',
            sort: 'asc',
            width: 270
          },
          {
            label: 'Credité à',
            field: 'credit_id',
            sort: 'asc',
            width: 200
          },
          {
            label: 'Montant',
            field: 'amount',
            sort: 'asc',
            width: 100
          },
        ];
        const tmpObj = {columns : columns, rows: response.data};
        this.setState({
          transaction: tmpObj
        });
      },
      error => {
        this.setState({
          transaction: "error"
        });
      }
    );
  }

  render() {
    const { transaction } = this.state

    return (
      <div className="container">
        <header className="jumbotron">
          <h3>{this.state.content}</h3>
        </header>
        <h1>Mes transactions</h1>
        <MDBDataTable
          striped
          bordered
          small
          data={transaction}
        />
      </div>
    );
  }
}
