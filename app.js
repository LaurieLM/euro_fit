// const express = require('express');
// const app = express();
// const port = 3000;
​
// app.use(express.static('public'));//créé dans le CMD en tapant: mkdir public pour créer un fichier public
// //on utilise app.set pour utiliser le moteur de template ejs
// app.set('views', './IHM')//définition du chemin de mes views 
// app.set('view engine', 'ejs')// définition du moteur de template = moteur de views
​
// app.get('/',(req, res)=>{
//     res.status(200).sendFile('/IHM/index.html', {root:__dirname})
// })
​
// app.get('a-propos',(req, res)=>{
//     res.status(200).sendFile('/IHM/apropos.html', {root:__dirname})
// })
​
// app.use((req, res)=>{
//     res.status(404).sendFile('/IHM/pageintrouvable.html',{root:__dirname})
// })
    
// app.listen(port, ()=>{
//     console.log("Server listening on port" + port);
// })
​
​
// AUTRE METHODE render  et en changeant les extensions dans les fichiers .html par .ejs
// const express = require('express');
// const app = express();
// const port = 3000;
// // const prenom = "Anka"
// const humain = {
//     name: "Anka",
//     age: 25
// };
// const liste = [
//     {titre:"Apprendre NodeJS", description:"Node c'est compliqué!"},
//     {titre:"Apprendre Express", description:"Express c'est encore plus tendu!"}
// ]
​
// app.use(express.static('public'));//créé dans le CMD en tapant: mkdir public pour créer un fichier public
// app.set('views', './IHM')//définition du chemin de mes views 
// app.set('view engine', 'ejs')// définition du moteur de template = moteur de views
​
// app.get('/',(req, res)=>{
//     res.status(200).render('index', {humain, liste})
// });
​
// app.get('/a-propos',(req, res)=>{
//     res.status(200).render('apropos', {humain})
// });
​
// app.use((req, res)=>{
//     res.status(404).render('pageintrouvable')
// });
    
// app.listen(port, ()=>{
//     console.log("Server listening on port" + port);
// })
​
​
// EXERCICE
// créer des objets avec un titre et une description , qu'on transmet à notre index (objets dans un tableau et on transmet le li) et qui apparaissent sous forme de li et de ul dans la liste des tâches
​
// EXERCICE SUR MYSQL
const express = require('express');
const app = express();
const mysql= require('mysql');
const myConnection = require('express-myconnection');
const port = 3000;
const optionBDD = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 3306,
    database: 'todolist'
}
​
app.use(myConnection(mysql, optionBDD, 'pool'));//middleware pour nous connecter a la base de données
app.use(express.static('public'));//créé dans le CMD en tapant: mkdir public pour créer un fichier public
app.set('views', './IHM')//définition du chemin de mes views 
app.set('view engine', 'ejs')// définition du moteur de template = moteur de views
app.use(express.urlencoded({extended : false}));//midlleware à utiliser avec la methode post pour envoyer des donnees pour parser l'url pour encoder les données d'une requete de type string qd c'est false ou qd c'est true
​
// requete préparée permet de mieux sécuriser la base de données. On a utilisé le moteur de templates ejs pour créer des composants, ce qui nous permet de mettre des balises ejs <% pour insérer du code.
app.get('/', (req, res)=>{
    req.getConnection((error, connection)=>{
        if(error){
            console.error(error);
        } else{
            connection.query('SELECT*FROM liste', [], (error, data)=>{//query est une requete sql
                if (error) {
                    console.error(error)
                } else {
                    res.status(200).render('index', {data})
                }
            })
        }
    })
});
​
// Méthode post pour envoyer des données avec 2 parametres: l url et une callback de mes objets requeste et repsonse, et en plus dans le fichier html index on créer une formulaire action et méthod
app.post('/liste', (req,res)=>{
    let id = req.body.id === "" ? null : req.body.id;
    let title = req.body.title;
    let description = req.body.description;
    let requeteSQL = id === null ? 'INSERT INTO liste(title, description) VALUES (?, ?) ' : 'UPDATE liste SET title = ?,description = ? WHERE id = ?';
    let data = id ===null ? [title,description] : [title, description, id]
    req.getConnection((error, connection)=>{
        if(error){
            console.error(error);
        } else{
            connection.query(
                requeteSQL, 
                data,
             (error, data)=>{//query est une requete sql, 3eme parametre
                if (error) {
                    console.error(error)
                } else {
                    res.status(302).redirect('/');//on redirige vers la page localhost:3000/ et pas vers localhost:3000/liste
                }
            })
        }
    })
})
// Pour activier le bouton supprimer, on a fait dans app le middleware delete et aores dans index, puis on remplace dans le on clik le deletedata
app.delete('/liste/:id', (req,res)=>{
    let id = req.params.id;
    req.getConnection((error, connection)=>{
        if(error){
            console.error(error);
        } else{
            connection.query('DELETE FROM liste WHERE id = ?', [id], (error, data)=>{
                if (error) {
                    console.error(error)
                } else {
                    res.status(200).json({routeRacine : '/'})// On le redirige sur localhost:3000/
                }
            })
        }
    })
})
​
// créer une alerte qui demande si l'utilisateur veut vraiment supprimer la tâche
​
​
app.get('/a-propos',(req, res)=>{
    res.status(200).render('apropos', {humain})
});
​
app.use((req, res)=>{
    res.status(404).render('pageintrouvable')
});
    
app.listen(port, ()=>{
    console.log("Server listening on port" + port);
})
​
​
​