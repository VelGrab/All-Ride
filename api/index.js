require("dotenv").config();
const PORT = process.env.PORT || 3001;
const server = require("./app.js")

/* Listening to the port 3001. */
server.listen(PORT, () => {
  console.log("server listening in port 3001");
});
