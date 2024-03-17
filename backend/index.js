const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
//Puerto
const PORT = 3005;

app.use(express.json());
app.use(cors());

// Conexión a la base de datos MongoDB
const connectionString = "mongodb+srv://camilo:12345@proyectosoftware1.rwe1ddx.mongodb.net/?retryWrites=true&w=majority&appName=ProyectoSoftware1";
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Definir el esquema
const todoSchema = new mongoose.Schema({
    titulo: String,
    descripcion: String,
    fecha: String,
    completed: Boolean
});

// Crear el modelo
const Todo = mongoose.model("Todo", todoSchema);

// Rutas
app.get("/", (req, res) => {
    res.json({ msg: "proyecto pagina principal" });
});

app.get("/todos", async (req, res) => {
    try {
        const todos = await Todo.find({});
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/todos/:id", async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        res.json(todo);
    } catch (error) {
        res.status(404).json({ msg: "Todo not found" });
    }
});

app.post("/todos", async (req, res) => {
    try {
        const todo = await Todo.create(req.body);
        res.status(201).json(todo);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put("/todos/:id", async (req, res) => {
    try {
        const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(todo);
    } catch (error) {
        res.status(404).json({ msg: "Todo not found" });
    }
});

app.delete("/todos/:id", async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        res.json(todo);
    } catch (error) {
        res.status(404).json({ msg: "Todo not found" });
    }
});


app.listen(PORT, () => {
    console.log(`App is running on PORT ${PORT}`);
});
