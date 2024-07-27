import express from "express";
import cors from "cors";
//import dataOutput from './dataOutput.json';
const app = express();
const spawn = require("child_process").spawn;
app.use(cors());
app.use(express.json());
app.get("/", async (req, res) => {
  res.status(200).send({
    message: "hola mundo (⌐■_■)",
  });
});

const process = spawn("python", ["./process.py"]);


// el script de python devolverá la salida en el objeto data
// devuelve un objeto Readable
process.stdout.on("data", (data) => {
  console.log(data);
});

process.kill();

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const response = await (async () => {}); // completar con una funcion asincrona que se quiera realizar de la api

    res.status(200).send({}); // completar con un objeto parámetro dependiendo de la api

    // Esperar antes de hacer la próxima solicitud
    await delay(1000); // Espera 1 segundo
  } catch (error) {
    console.log(error);
    alert(error);
    res.status(500).send({ error });
  }
});

app.listen(5000, () =>
  console.log("El servidor está en https://localhost:5000")
);
