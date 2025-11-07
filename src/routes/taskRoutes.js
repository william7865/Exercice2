const express = require("express");
const ctrl = require("../controllers/taskController");
const router = express.Router();

router.get("/", ctrl.list);
router.post("/", ctrl.create);
router.delete("/:id", ctrl.remove);
router.patch("/:id/done", ctrl.done);

module.exports = router;
