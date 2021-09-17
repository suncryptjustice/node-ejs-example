const express = require("express");
const fs = require("fs").promises;
const bodyParser = require("body-parser");

let ejs = require("ejs");

const config = require("./config.json");

const app = express();
const port = process.env.PORT ? process.env.PORT : 80;

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));

async function writeToDB(content) {
  try {
    const data = JSON.parse(await fs.readFile("public/posts.json"));
    data.push({
      post: content,
      createdAt: Date.now(),
    });

    const updatedFile = await fs.writeFile(
      "public/posts.json",
      JSON.stringify(data)
    );
    stories = data;
    console.log(updatedFile);
  } catch (error) {
    console.log(error);
  }
}

async function readFromDB() {
  try {
    const data = await fs.readFile("public/posts.json");
    stories = JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
}

var stories = readFromDB();

app
  .get("/", function (req, res) {
    console.log(req.headers);
    res.render("pages/home", {
      user: config.name,
    });
  })
  .post("/", function (req, res) {
    if (req.body.name && req.body.name.length > 0) {
      writeToDB(req.body.name).then(function () {
        res.redirect("/");
      });
    }
  });

app.get("/posts", function (req, res) {
  const data = readFromDB();
  res.render("pages/posts", {
    user: config.name,
    data: stories,
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
