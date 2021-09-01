const crudModel = require('../models/crud-model');
const mysql = require("mysql");
const app = require('../app');
const passwordHash = require('password-hash');
const crypto = require('crypto')
const jwt = require('jsonwebtoken');

const db = mysql.createConnection({
    user: "valoon",
    host: "valoon.fr",
    password: "root",
    database: "outil_monetaire",
});

function genIban() {
    var generatedIban = generateIban('FR', '30004', '00001', '00000000001')
    .success(function (iban) {
        console.log(iban);
        /*
        iban = {
            iban: "FR7630004000010000000000136",
            iban_print: "FR76 3000 4000 0100 0000 0000 136",
            iban_format:
            {
            country: 'France',
            code: 'FR',
            bank: [ [ 0, 'c' ], [ 5, 'n' ], [ 5, 'n' ] ],
            bank_code_format: '0  5n 5n',
            account: [ [ 0, 'c' ], [ 11, 'c' ], [ 2, 'n' ] ],
            account_format: '0  11   2n',
            bankLength: 10,
            accountLength: 13,
            totalLength: 27
            }
        };*/
        //...
    });
}

module.exports={

register:function(req, res) {
    email = req.body.email
    firstName = req.body.firstName
    secondeName = req.body.secondeName
    password = req.body.password
    hashPassword = passwordHash.generate(password);

    db.query("SELECT id FROM users WHERE email = ?", email,
    (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).send({message: 'error', status:"error"});
            return;
        }
        if (result[0] == undefined) {
            db.query(`INSERT INTO users
            (email, password, first_name, second_name, email_verified, isAdmin)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [email, hashPassword, firstName, secondeName, false, false],
            (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send({message: 'error', status:"error"});
                } else {
                    // genIban()
                    res.send({message: `${secondeName} votre compte à été créer avec succes`, status:"succes"});

                }
            })
        } else
            res.status(500).send({message: "Un compte existe deja", status:"error"});
    })
},

login:function(req, res) {
    email = req.body.email
    password = req.body.password

    db.query(`SELECT * FROM users WHERE email = ?`, email,
    (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).send({message: "error"})
        } else if (result[0] == undefined) {
            res.status(500).send({message: `Mauvaise combinaison email - mot de passe`});
        } else {
            if (passwordHash.verify(password, result[0].password)) {
                const token = jwt.sign(
                    {
                        email: email,
                        firstName: result[0].first_name,
                        secondeName: result[0].second_name,
                    },
                    'RANDOM_TOKEN_SECRET',
                    { expiresIn: '24h' });
                res.send(
                    {
                        email: email,
                        firstName: result[0].first_name,
                        secondeName: result[0].second_name,
                        accessToken: token
                    });
                db.query(`UPDATE users SET cookie = ? WHERE email = ?`, [token, email], 
                (err, result) => {
                    if (err)
                        console.log(err)
                })
            }
            else
                res.status(500).send({message: `Mauvaise combinaison email - mot de passe`});
        }

    })
},

// crudForm:function(req, res) {
//     res.render('crud-operation');
// },
// createCrud:function(req,res){
//     const createData=crudModel.createCrud();
//     res.send('<h1>'+createData+'</h1>');
// },
// fetchCrud:function(req,res){

//     const fetchData=crudModel.fetchCrud();
//     res.send('<h1>'+fetchData+'</h1>');

// },
// editCrud:function(req,res){
//     const editId=req.params.id;
//     const editData= crudModel.editCrud(editId);
//     res.render('crud-operation',{editData:editData,editId:editId});
// },
// UpdateCrud:function(req,res){
//      const updateId=req.params.id;
//      const updateData= crudModel.UpdateCrud(updateId);
//      res.send('<h1>'+updateData+'</h1>');
// },
// deleteCrud:function(req,res){
//     const deleteId=req.params.id;
//     const deleteData= crudModel.deleteCrud(deleteId);
//     res.send('<h1>'+deleteData+'</h1>');
// }
}
