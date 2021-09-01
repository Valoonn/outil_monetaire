import axios from 'axios';
import UserService from "./user.service";

const API_URL = 'http://localhost:3001/transaction/';

class TransactionService {

  balance(token) {
    return axios.post(API_URL + "balance", {
      token,
    }).then((res) => (res.data.balance))
  }

  all(token) {
    if (UserService.isAdmin(token))
      return axios.post(API_URL + "all")
    else
      return ("erreur 403")
  }
  allFromId(cookie) {
    return axios.post(API_URL + "getFromId", {cookie})
  }

  checkPayment(cookie, creditEmail, amount, callback) {
    console.log("inside makePayment")
    UserService.isEmailExist(creditEmail).then(res => {
      console.log("email existe: ", res)
      if (res) {
        console.log("email is good")
        this.balance(cookie).then(res => {

          console.log("balance: ", res)
          if (res >= amount) {
            console.log("Going to the api")
            callback({message: true})
          } else
            callback ({message: "Votre solde n'est pas assez élevé"})
        })
      } else
        callback ({message: "L'email que vous avez renseigné n'existe pas"})
    })
  }

  makePayment(cookie, creditEmail, amount, callback) {
    axios.post(API_URL + "makePayment", {cookie, creditEmail, amount}).then((res, err) => callback(res, err))
  }
}

export default new TransactionService();
