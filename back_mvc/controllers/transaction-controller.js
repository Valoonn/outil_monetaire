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

  balance:function(req, res) {
    token = req.body.token

    db.query(`SELECT balance FROM users WHERE cookie = ?`, token,
    (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).send({message: "error"})
        } else if (result[0] != undefined) {
            res.send({balance : result[0].balance})
        }
    })
  },

  all:function(req, res) {
    db.query(`SELECT * FROM transaction`,
    (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).send({message: "error"})
        } else if (result[0] != undefined) {
            res.send(result)
        }
    })
  },

  getFromId:function(req, res) {
    cookie = req.body.cookie

    db.query(`SELECT id FROM users WHERE cookie = ?`, cookie,
    (err, result) => {
        if (err) {
          console.log(err)
        } else if (result[0] != undefined) {
          let id = result[0].id
          db.query(`SELECT * FROM transaction WHERE debit_id = ? OR credit_id = ?`, [id, id],
          (err, result) => {
              if (result) {
                res.send(result)
              }
            if (err) {
              console.log(err)
              res.status(500).send({message: "error"})
            }
          })
        }
    })
  },

  makePayment:function(req, res) {
    cookie = req.body.cookie
    creditEmail = req.body.creditEmail
    amount = req.body.amount

    console.log("Start")
    db.query(`SELECT id FROM users WHERE cookie = ?`, cookie,
    (err, result) => {
        if (err) {
          console.log(err)
        } else if (result[0] != undefined) {
          let debitId = result[0].id
          console.log("debitId")
          db.query(`SELECT id FROM users WHERE email = ?`, creditEmail,

          (err, result) => {
              if (result[0] != undefined) {
                creditId = result[0].id

                db.query(`INSERT INTO transaction
                (debit_id, credit_id, amount)
                VALUES (?, ?, ?)`,
                [debitId, creditId, amount],
                (err, result) => {

                  if (result) {

                    db.query(`UPDATE users
                      SET balance = balance + ?
                    WHERE id = ?`, [amount, creditId],

                    (err, result) => {
                      if (result) {
                        db.query(`UPDATE users
                        SET balance = balance - ?
                        WHERE id = ?`, [amount, debitId],

                        (err, result) => {
                          if (result) {
                            res.send({message: "Transaction effecté avec succés"})
                          }
                          if (err)
                          res.status(500).send({message: "Une erreur est survenue"})
                        })

                      }
                      if (err) {
                        res.status(500).send({message: "Une erreur est survenue"})
                      }
                    })

                  if (err)
                    res.status(500).send({message: "Une erreur est survenue"})
                  }
                })

              }
            if (err) {
              console.log(err)
              res.status(500).send({message: "error"})
            }
          })
        }
    })
  }
}
