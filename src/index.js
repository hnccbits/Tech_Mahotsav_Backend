const { app } = require("./app");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Server ready at http://localhost:${PORT}`)
);
