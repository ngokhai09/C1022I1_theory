var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.post("/", (req, res) => {
  let avatar = req.files.avatar;
  avatar.mv("./public/images/" + avatar.name, (err) => {
    if (err) console.log(err);
  });
  res.end("Success");
});
module.exports = router;
