const { Router } = require("express");
const router = Router();

/* Parsing the body of the request. */
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

/* Importing the districtRoute from the district folder. */
const districtRoute = require("./district/index.js");

/* Using the districtRoute. */
router.use("/", districtRoute);

module.exports = router;