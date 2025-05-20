const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000; // 👈 Usa PORT de entorno para Render
const API_KEY = process.env.API_KEY || "697b2b0f6f619b11f1db45a7a536271f";
const BASE_URL = "https://api.themoviedb.org/3";

// Tus rutas (igual que antes)
app.get("/peliculas", async (req, res) => {
  const categoria = req.query.categoria || "popular";
  const genero = req.query.genero || null;

  try {
    let url = `${BASE_URL}/movie/${categoria}?api_key=${API_KEY}&language=es`;
    const respuesta = await axios.get(url);
    let peliculas = respuesta.data.results;

    if (genero) {
      peliculas = peliculas.filter(p => p.genre_ids.includes(parseInt(genero)));
    }

    res.json(peliculas);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ mensaje: "Error al obtener películas", error: error.message });
  }
});

app.get("/buscar", async (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).json({ mensaje: "Debe ingresar un término de búsqueda." });

  try {
    const respuesta = await axios.get(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=es`);
    res.json(respuesta.data.results);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ mensaje: "Error en la búsqueda", error: error.message });
  }
});

app.get("/pelicula/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const respuesta = await axios.get(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=es`);
    res.json(respuesta.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ mensaje: "Error al obtener la película", error: error.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
