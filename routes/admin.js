const router = require('express').Router();

router.get("/", (req, res) => {
    res.render("dashboard", { adminName: req.user.name });
});

module.exports = router