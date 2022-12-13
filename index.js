const express = require('express')
const bodyParser = require("body-parser")
const app = express()
const port = 3001
const sqlite3 = require('sqlite3').verbose();
var cors = require('cors')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));

let db = new sqlite3.Database('test1.db');

app.get('/students', (req, res) => {
    db.all("select id, name, surname, lesson, instructor, score from students", (error, rows) => {
        if (error) {
            res.status(400).send(error.message);
        } else {
            res.status(200).send(rows);
        }
    })
})

app.get('/students/:studentID', (req, res) => {
    let sorgu = "select * from students where id=" + req.params.studentID
    db.all(sorgu, (error, rows) => {
        if (error) {
            res.status(400).send(error.message);
        } else {
            res.status(201).send(rows);
        }
    })
})


app.delete('/students/:studentID', (req, res) => {
    let kontrolSorgu = 'select count(*) from students where id=' + req.params.studentID
    db.all(kontrolSorgu, (error, rows) => {
        if (error) {
            res.status(400).send(error.message);
        } else {
            let adet = rows[0]['count(*)'];

            if (adet == 0) {
                res.status(400).send("bu id kayıtlı değildir");
            } else {
                let sorgu = "delete from students where id=" + req.params.studentID
                db.run(sorgu, (error, rows) => {
                    if (error) {
                        res.status(400).send(error.message);
                    } else {
                        res.status(201).send("ok");
                    }
                })
            }
        }
    })


})

app.post('/students', (req, res) => {
    if (!req.body.name) {
        res.status(400).send("name alanı boş bırakılamaz");
    } else {
        db.run("insert into students(name, surname, lesson, instructor, score) values (?,?,?,?,?)",
            [req.body.name, req.body.surname, req.body.lesson, req.body.instructor, req.body.score], (error, rows) => {
                if (error) {
                    res.status(400).send(error.message);
                } else {
                    res.status(201).send("ok");
                }
            })
    }
})

app.put('/students/:studentID', (req, res) => {
    db.run('update students set name=? , surname=? , lesson=? , instructor=? , score=? where id=?',
        [req.body.name, req.body.surname, req.body.lesson, req.body.instructor, req.body.score, req.params.studentID], (error, rows) => {
            if (error) {
                res.status(400).send(error.message);
            } else {
                res.status(204);
            }
        })
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

