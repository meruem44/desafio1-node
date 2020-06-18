const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validRepositorie(req, res, next){
  const { id } = req.params;

  if(!isUuid(id)) {
      return res.status(400).json({ error: 'Invalid Repositorie.'})
  }

  return next();
}

app.use('/repositories/:id', validRepositorie);

app.post("/repositories", (request, response) => {
  const {url, title, techs} = request.body

  try {

    const repositorie = {id:uuid(), url, title, techs, likes: 0}

    repositories.push(repositorie)
    return response.json(repositorie) 

  }
  catch (e) {
      console.log(e); 
      return response.status(400).json({error: 'Invalid Input'})
  }
});

app.get("/repositories", (request, response) => {
  try {
    return response.json(repositories) 
  }
  catch (e) {
      return response.status(400).json({error: 'Invalid Repositories'})
  }
});

app.put("/repositories/:id", (request, response) => {
  const {url, title, techs} = request.body
  const {id} = request.params

  try {

    const repositorieIndex = repositories.findIndex(repositorie => repositorie.id == id)
    const like = 0

    if (repositorieIndex < 0) {
      return response.status(400).json({ error: "Repositorie not found"})
    }

    const repositorie = {
      id,
      url, 
      title, 
      techs,
      likes: like
    }

    repositories[repositorieIndex] = repositorie

    return response.json(repositorie) 
  }
  catch (e) {
      return response.status(400).json({error: 'Invalid input'})
  }
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params

  try {

    const repositorieIndex = repositories.findIndex(repositorie => repositorie.id == id)

    if (repositorieIndex < 0) {
      return response.status(400).json({ error: "Repositorie not found"})
    }

    repositories.splice(repositorieIndex, 1)

    return response.status(204).send();
  }
  catch (e) {
      return response.status(400).json({error: 'Invalid input parameter'})
  }
});

app.post("/repositories/:id/like", (request, response) => {
  const {url, title, techs} = request.body
  const {id} = request.params

  try {

    const repositorieIndex = repositories.findIndex(repositorie => repositorie.id == id)

    if (repositorieIndex < 0) {
      return response.status(400).json({ error: "Repositorie not found"})
    }

    let newlike = repositories[repositorieIndex].likes;
    newlike++;

    let like = newlike
    const repositorie = {
      id,
      url, 
      title, 
      techs,
      likes:like
    }

    repositories[repositorieIndex] = repositorie
    return response.json(repositorie) 
  }
  catch (e) {
      console.log(e); // passa o objeto de exceção para o manipulador de erro
      return response.status(400).json({error: 'Invalid Input'})
  }
});

module.exports = app;
