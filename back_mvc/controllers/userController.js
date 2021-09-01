const crudModel = require('../models/crud-model');
const mysql = require("mysql");
const app = require('../app');

const db = mysql.createConnection({
    user: "valoon",
    host: "valoon.fr",
    password: "root",
    database: "outil_monetaire",
});

module.exports={
  all:function(req, res) {
    res.send("Bienvenue sur le site de la Banque de France")
  },

  user:function(req, res) {
    res.send("User")
  },

  admin:function(req, res) {
    res.send("Admin")
  },

  isAdmin:function(req, res) {
    token = req.body.token

    db.query(`SELECT isAdmin FROM users WHERE cookie = ?`, token,
    (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).send({message: "error"})
        } else if (result[0] != undefined) {
            res.send({isAdmin : result[0].isAdmin})
        }
    })
  },

  getName:function(req, res) {
    id = req.body.id

    db.query(`SELECT * FROM users WHERE id = ${id}`,
    (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).send({message: "error"})
        } else if (result[0] != undefined) {
            res.send({firstName : result[0].first_name, secondeName: result[0].second_name})
        }
    })
  },

  getAll:function(req, res) {
    db.query(`SELECT * FROM users`,
    (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).send({message: "error"})
        } else if (result[0] != undefined) {
            res.send(result)
        }
    })
  },

  isEmailExist:function(req, res) {
    console.log(req.body)
    email = req.body.email
    db.query(`SELECT id FROM users where email = ?`, req.body.email,
    (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).send({message: "error"})
        } else if (result[0] != undefined) {
          res.send(true)
        } else
          res.send(false)
    })
  }
}

