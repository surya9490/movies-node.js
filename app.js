const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "moviesData.db");

const app = express();

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const convertObjectToResponseObject = (dbObject) => {
  return {
    movieId: object.movie_id,
    directorId: object.director_id,
    movieName: object.movie_name,
    leadActor: object.lead_actor,
  };
};

app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `
    SELECT 
    movie_name
    FROM
    movie;`;
  const movieName = await database.all(getMoviesQuery);
  response.send(movieName);
});

app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const postMovieQuery = `
  INSERT INTO
  movie(director_id,movie_name,lead_actor)
  VALUES
  ('${directorId}','${movieName}','${leadActor}');`;
  const movie = await database.run(postMovieQuery);
  response.send("Movie Successfully Added");
});

app.get("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const getMovieIdQuery = `
    SELECT *
    FROM 
    movie
    WHERE
    movie_id = ${movieId};`;
  const movie = await database.all(getMovieIdQuery);
  response.send(convertObjectToResponseObject(movie));
});

app.put("/movies/:movieId/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const { movieId } = request.params;

  const updateMovieQuery = `
  UPDATE 
  movie 
  SET 
  director_id = ${directorId},
  movie_name = '${movieName}',
  lead_actor = '${leadActor}'
  WHERE
  movie_id = ${movieId};
`;
  await database.run(updateMovieQuery);
  response.send("Movie Details Updated");
});
