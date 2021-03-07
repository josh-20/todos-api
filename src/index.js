const DEFAULT_PORT = 5050;
const expressFramework = require("express");
const express = expressFramework();
const bodyParser = require("body-parser");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const todos = [
  { id: uuidv4(), title: "DO something", done: false },
  { id: uuidv4(), title: "DO nothing", done: true },
];

const main = () => {
  express.use(cors());
  express.use(bodyParser.json());

  express.get("/api/v1/todos", (req, res) => {
    res.json(todos);
  });

  express.post("/api/v1/todos", (req, res) => {
    const response = { status: 400 };
    if (typeof req.body.title === "string" && req.body.title.length > 0) {
      todos.push({ ...req.body, done: false, id: uuidv4() });
      response.status = 200;
    }
    res.status(response.status);
    res.end();
  });

  express.put("/api/v1/todos/:id", (req, res) => {
    const response = { status: 400 };
    if (typeof req.params.id === "string" && req.params.id.length > 0) {
      if (
        typeof req.body.id === "string" &&
        req.body.id.length > 0 &&
        typeof req.body.title === "string" &&
        req.body.title.length > 0 &&
        typeof req.body.done === "boolean"
      ) {
        const todoIndex = todos.findIndex((x) => x.id === req.params.id);
        if (todoIndex >= 0) {
          todos[todoIndex] = req.body;
          response.status = 200;
        } else {
          response.status = 404;
        }
      }
    }

    res.status(response.status);
    res.end();
  });

  express.delete("/api/v1/todos/:id", (req, res) => {
    const response = { status: 400 };
    if (typeof req.params.id === "string" && req.params.id.length > 0) {
      const todoIndex = todos.findIndex((x) => x.id === req.params.id);
      if (todoIndex >= 0) {
        todos.splice(todoIndex, 1);
        response.status = 200;
      } else {
        response.status = 404;
      }
    }

    res.status(response.status);
    res.end();
  });
};

main();
express.listen(DEFAULT_PORT, () => {
  console.log(`Service is listening on ${DEFAULT_PORT}`);
});
