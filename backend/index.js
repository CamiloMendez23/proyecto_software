const express = require("express");
const app = express();
const uuid = require("uuid");
const cors = require("cors");

const PORT = 3004;

app.use(express.json());
app.use(cors());

const todos = [
    {
        id:1,
        titulo: "tarea redes",
        descripcion: "entregarlo en neo",
        fecha:"12/04/2024",
        completed: true
    },
    {
        id:2,
        titulo: "tarea historio",
        descripcion: "entregar el resumen",
        fecha:"24/04/2024",
        completed: true
    },
    {
        id:3,
        titulo: "tarea de casa",
        descripcion: "lavar los platos",
        fecha:"17/04/2024",
        completed: true
    }
]

app.get("/", (req, res) => {
    res.json({msg: "proyecto pagina principal"});
})

app.get("/todos",(req,res)=>{
    res.json(todos);
});


app.get("/todos/:id", (req, res)=>{
    let todo = todos.filter((todo) => todo.id == req.params.id);
    res.json({msg: "1 Todo" ,data: todo})
});


//GET,POST,PUT,DELETE,PATCH
app.post("/todos",(req,res)=>{
    console.log(req.body);
    todos.push({id: uuid.v4(), ...req.body});
    res.json({msg: "Add Todo", data: todos});
});


app.put("/todos/:id",(req,res)=>{
    let todo = todos.find((todo) => todo.id == req.params.id);
    if(todo) {
        todo.titulo = req.body.titulo;
        todo.descripcion = req.body.descripcion;
        todo.fecha = req.body.fecha;
        todo.completed = req.body.completed;
        res.json({msg: "Edit Todo", data: todos});
    }else{
        res.json({msg: "Todo no funciona en editar"})
    }
});


app.delete("/todos/:id",(req,res)=>{
    let index = todos.findIndex(todo => todo.id == req.params.id);
    todos.splice(index, 1);
    res.json({msg: "Delete Todo", data: todos});
});


app.listen(PORT, () => {
  console.log(`App is running on PORT ${PORT}`);
});
