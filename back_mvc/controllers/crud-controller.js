const crudModel = require('../models/crud-model');
const mysql = require("mysql");
const app = require('../app');
const passwordHash = require('password-hash');
const crypto = require('crypto')

const db = mysql.createConnection({
    user: "valoon",
    host: "localhost",
    password: "root",
    database: "outil_monetaire",
});

module.exports={

register:function(req, res) {
    email = req.body.email
    password = req.body.password
    firstName = req.body.firstName
    secondeName = req.body.secondeName
    age = req.body.age
    adress = req.body.adress
    postalCode = req.body.postalCode
    city = req.body.city
    password = req.body.password
    hashPassword = passwordHash.generate(password);

    db.query("SELECT id FROM users WHERE email = ?", email,
    (err, result) => {
        if (err) {
            console.log(err)
            res.send({message: 'error'})
            return;
        }
        if (result[0] == undefined) {
            db.query(`INSERT INTO users
            (email, password, first_name, second_name, age, adresse, postal_code, city)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
            [email, hashPassword, firstName, secondeName, age, adress, postalCode, city],
            (err, result) => {
                if (err) {
                    console.log(err);
                    res.send({message: 'error'});
                } else
                    res.send({message: "Compte créer avec succes"});
            })
        } else
            res.send({message: "Un compte existe deja"});
    })
},

login:function(req, res) {
    email = req.body.email
    password = req.body.password

    db.query("SELECT password FROM users WHERE email = ?", email,
    (err, result) => {
        if (err)
            res.send({message: err})
        if (result[0] == undefined)
            res.send({message: `Mauvaise combinaison email - mot de passe`});
        else {
            if (passwordHash.verify(password, result[0].password))
                res.send({message: `Connecté en tant que ${email}`, token: crypto.randomBytes(64).toString('hex')});
            else
                res.send({message: `Mauvaise combinaison email - mot de passe`});
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
