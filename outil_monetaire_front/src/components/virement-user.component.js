import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import AuthService from "../services/auth.service";
import TransactionService from "../services/transaction.service";

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.onChangeemail = this.onChangeemail.bind(this);
    this.onChangeamount = this.onChangeamount.bind(this);

    this.state = {
      email: "",
      amount: "",
      loading: false,
      successful: false,
      message: ""
    };
  }

  onChangeemail(e) {
    this.setState({
      email: e.target.value
    });
  }

  onChangeamount(e) {
    this.setState({
      amount: e.target.value
    });
  }

  async handleLogin(e) {
    e.preventDefault();

    this.setState({
      message: "",
      loading: true
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      TransactionService.checkPayment(AuthService.getCurrentUser().accessToken, this.state.email, this.state.amount, (res) => {
        if (res.message === true) {
          TransactionService.makePayment(AuthService.getCurrentUser().accessToken, this.state.email, this.state.amount, (response, error) => {
            if (response.data.message) {
              this.setState({
                message: response.data.message,
                successful: true
              });
            }
            else if (error)
              this.setState({
                message: error.data.message,
                successful: false,
                loading: false
              });
            })
        }
        else if (res.message) {
              this.setState({
                successful: false,
                message: res.message,
                loading: false
              });
          }
        })
    } else {
      this.setState({
        loading: false
      });
    }
  }

  render() {
    return (
      <div className="col-md-12">
        <div className="card card-container">
          <h1>Faire un virement</h1>
          <Form
            onSubmit={this.handleLogin}
            ref={c => {
              this.form = c;
            }}
          >

          {!this.state.successful && (
            <div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <Input
                type="text"
                className="form-control"
                name="email"
                value={this.state.email}
                onChange={this.onChangeemail}
                validations={[required]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="amount">Montant</label>
              <Input
                type="amount"
                className="form-control"
                name="amount"
                value={this.state.amount}
                onChange={this.onChangeamount}
                validations={[required]}
              />
            </div>

            <div className="form-group">
              <button
                className="btn btn-primary btn-block"
                disabled={this.state.loading}
              >
                {this.state.loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Envoyer</span>
              </button>
            </div>
            </div>
          )}

          {this.state.message && (
              <div className="form-group">
                <div
                  className={
                    this.state.successful
                      ? "alert alert-success"
                      : "alert alert-danger"
                  }
                  role="alert"
                >
                  {this.state.message}
                </div>
              </div>
            )}

            <CheckButton
              style={{ display: "none" }}
              ref={c => {
                this.checkBtn = c;
              }}
            />
          </Form>
        </div>
      </div>
    );
  }
}
