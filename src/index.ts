import express from "express";
let app :any = express();

app.get("/", (req, res) => {
  res.send("typescript nub");
});


app.listen(3000, () => {
  console.log("http://localhost:3000/");
});
