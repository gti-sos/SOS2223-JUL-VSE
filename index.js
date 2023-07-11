import express from "express";
import { handler } from "./frontend/build/handler.js";
import cors from 'cors';



var port = process.env.PORT || 12345;
var app = express();
app.use(cors());
app.use(express.json());


import { vse } from "./backend/index-vse.js";
vse(app);


app.use(handler);

app.listen(port, ()=>{
  console.log(`server ready in port ${port}`);
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ error: 'Ocurrió un error en el servidor' });
});