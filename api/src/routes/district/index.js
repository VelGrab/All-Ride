const express = require("express");
const router = express.Router();
const { getDataApi } = require('../../controllers/fetchAPI');

/* This is a route handler. It is a function that is called when a request is made to the specified
route. */
router.get("/", async (req, res) => {
    try {
        const data = await getDataApi();
        res.status(200).json(data);
    } catch (error) {
        res.status(400).send({msg: error.msg})
    }
});

module.exports = router;
