const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

let urls = [];

app.post("/download", (req, res) => {
  const body = req.body;

  if (urls.includes(body.item.url)) {
    res.json({ check: "no" });
    return;
  }

  urls.push(body.item.url);
  res.json({ check: "yes" });
});

app.listen(3000, () => {
  console.log("server listening on port 3000");
});
