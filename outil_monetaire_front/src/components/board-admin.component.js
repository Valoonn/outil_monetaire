import React, { Component} from "react";

import UserService from "../services/user.service";
import AuthService from "../services/auth.service";
import TransactionService from "../services/transaction.service";
import EventBus from "../common/EventBus";
import { MDBDataTable } from 'mdbreact';


export default class BoardAdmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      transaction: [
        {id: "Chargement ...", debit_id: "Chargement ...", credit_id: "Chargement ...", amount: "Chargement ..."},
        {id: "Chargement ...", debit_id: "Chargement ...", credit_id: "Chargement ...", amount: "Chargement ..."}],
      Utilisateur: [
        {id: "Chargement ...", email: "Chargement ...", firstName: "Chargement ...", secondeName: "Chargement ..."}],
        name: [],
    };
  }

  async getDataName(response) {
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
    let tmpTab = []
    let tmpRes = []
    response.data.map(async row => {
      await UserService.getName(AuthService.getCurrentUser().accessToken, row.debit_id).then(res => tmpTab[row.debit_id] = res)
      await UserService.getName(AuthService.getCurrentUser().accessToken, row.credit_id).then(res => tmpTab[row.credit_id] = res)
    })
    tmpRes = response.data.map(row => {
      tmpRes.push({id : row.id, debit_id : tmpTab[row.debit_id], credit_id : tmpTab[row.credit_id], amount : row.amount})
      return (tmpRes)
    })
    console.log(tmpRes)
    const tmpObj = {columns : columns, rows: response.data};
    return (tmpObj)
  }

  componentDidMount() {

    UserService.getAdminBoard().then(
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
    TransactionService.all(AuthService.getCurrentUser().accessToken).then(
      response => {
        this.getDataName(response).then(res => {
          this.setState({
            transaction: res
          });
        })
      },
      error => {
        this.setState({
          transaction: "error"
        });
      }
    );
    UserService.getAll(AuthService.getCurrentUser().accessToken).then(
      response => {
        const columns =  [
          {
            label: '#',
            field: 'id',
            sort: 'asc',
            width: 100
          },
          {
            label: 'Email',
            field: 'email',
            sort: 'asc',
            width: 270
          },
          {
            label: 'Nom',
            field: 'first_name',
            sort: 'asc',
            width: 200
          },
          {
            label: 'Prenom',
            field: 'second_name',
            sort: 'asc',
            width: 200
          },
          {
            label: 'Email verifié',
            field: 'email_verified',
            sort: 'asc',
            width: 200
          },
          {
            label: 'Admin ?',
            field: 'isAdmin',
            sort: 'asc',
            width: 200
          },
          {
            label: 'Solde',
            field: 'balance',
            sort: 'asc',
            width: 200
          },
        ];
        const tmpObj = {columns : columns, rows: response.data};
        this.setState({
          Utilisateur: tmpObj
        });
      },
      error => {
      }
    );
  }

  render() {

    const { transaction, Utilisateur, debitName, creditName } = this.state

    // async function getName(id1, id2) {
    //   UserService.getName(await AuthService.getCurrentUser().accessToken, id1).then(res => console.log("res: ", res))
    //   let res1 = await UserService.getName(AuthService.getCurrentUser().accessToken, id1)
    //   let res2 = await UserService.getName(AuthService.getCurrentUser().accessToken, id2)
    //   if (res1 && res2) {
    //     let tmp1 = this.state.debitName
    //     tmp1.push(res1)
    //     let tmp2 = this.state.creditName
    //     tmp2.push(res2)
    //     this.setState({
    //       debitName: tmp1,
    //       creditName: tmp2,
    //     })
    //   }
    // }

    return (
      <div className="container">
        <header className="jumbotron">
          <h3>{this.state.content}</h3>
        </header>
        <h1>Transaction</h1>
          <MDBDataTable
            striped
            bordered
            small
            data={transaction}
          />
        <h1>Utilisateurs</h1>
        <MDBDataTable
          striped
          bordered
          small
          data={Utilisateur}
        />
        {/* <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            {transaction.map((row, index) => {
              console.log(row.debit_id, row.credit_id)
              getName(row.debit_id, row.credit_id)
              return (
              <tr>
                  <td>{row.id}</td>
                  {debitName && debitName[index] ? <td>{debitName[index]}</td> : null}
                  {creditName && creditName[index] ? <td>{creditName[index]}</td> : null}
                  <td>{row.amount}</td>
                </tr>
              )
              }
            )}
          </tbody>
        </Table> */}
      </div>
    );
  }
}
