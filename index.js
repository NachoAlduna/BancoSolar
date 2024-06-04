const express = require("express");
const app = express();
app.use(express.json());

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

const {agregarUsuario, getUsuarios, eliminarUsuario, editUsuario, getTransferencias , nuevaTransferencia} = require('./consultas');
const pool = require("./dbConfig");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/usuario", async (req, res) => {
  const { nombre, balance } = req.body;
  try {
    const nuevoUsuario = await agregarUsuario(nombre, balance);
    console.log("Usuario agregado:", nuevoUsuario);
    res.send(nuevoUsuario);
  } catch (error) {
    console.error("Error al agregar usuario:", error);
    res.status(500).send("Error al agregar usuario");
  }
});

app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await getUsuarios();
    res.send(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).send("Error al obtener usuarios");
  }
});

app.delete("/usuario", async (req, res) => {
  const { id } = req.query;
  try {
    await eliminarUsuario(id);
    res.send("Usuario eliminado exitosamente");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al eliminar usuario");
  }
});
app.put("/usuario", async (req, res) => {
  try {
    const { id, nombre, balance } = req.body;
    const respuesta = await editUsuario(id, nombre, balance);
    res.json(respuesta);
  } catch (error) {
    res.status(500).send("Algo salio mal");
  }
});



app.post("/transferencia", async (req, res) => {
  try{
    const {emisor, receptor, monto} = req.body;
    //Llama a la funcion para realizar la transferencia
    await nuevaTransferencia({emisor, receptor, monto});
    res.status(200).send("Transferencia realizada con exito");
  }catch(error){
    console.error("Error en la transferencia:", error);
    res.status(500).send("Error en la transferencia");
  }
})

app.get("/transferencias", async(req, res) => {
  try {
    const transferencias = await getTransferencias();
    res.send(transferencias);
  } catch (error) {
    console.error("Error al obtener Transferencias:", error);
    res.status(500).send("Error al obtener Transferencias");
  }
})



