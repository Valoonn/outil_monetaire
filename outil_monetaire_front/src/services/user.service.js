import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:3001/user/';

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  getUserBoard() {
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  }

  isAdmin(token) {
    return axios.post(API_URL + "isAdmin", {
      token,
    }).then((res) => {
      if ((res.data.isAdmin))
        return (true)
      return false
    })
  }

  getName(token, id) {
    if (this.isAdmin(token))
      return axios.post(API_URL + "getName", {
        id,
        }).then(
        res => {
          if ((res.data.firstName && res.data.secondeName)) {
            return (`${res.data.firstName} - ${res.data.secondeName}`)
          }
        },
          err => {
            return "error 500"
          }
        )
    else
      return ("erreur 403")
  }

  getAll(token) {
    if (this.isAdmin(token))
      return axios.post(API_URL + "all")
    else
      return ("erreur 403")
  }

  isEmailExist(email) {
    return axios.post(API_URL + "isEmailExist", {
      email,
    }).then((res) => {
      if ((res.data))
        return (true)
      return false
    })
  }

}

export default new UserService();
