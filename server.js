const express = require('express');
const path = require('path');
const fs = require('fs');
var dbJson = require('./db/db.json');

const PORT = process.env.PORT||3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);


app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

var p;
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        if(data) {
          p = JSON.parse(data);
          var jssss = JSON.parse(data.toString());
          return res.json(jssss);
        } else {
            console.log(err);
        }
    })
});

app.post('/api/notes', (req, res) => {
    const {title, text} = req.body;
    const newObj = {
        title: title,
        text: text,
        id: uuidMaker(),
    };
    var  eex = p;
    eex.push(newObj);
    const x = JSON.stringify(eex);
    fs.writeFile('./db/db.json', x, (err) => {
    });
    const response = {
      status: 'success',
      body: x,
    };
    return res.status(201).json(response);
});

app.delete('/api/notes/:id', (req, res) => {
  var oppp = p;
  oppp = oppp.filter(({ id }) => id !== req.params.id);
  fs.writeFile('./db/db.json', JSON.stringify(oppp), (err) => {
  });
  return res.status(201).json();
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);


uuidMaker = () =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
