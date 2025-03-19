// src/index.js
const utils = require("./utils");
const layout = require("./layout");

module.exports = {
  ...utils,
  ...layout,

  // Expose as namespaces
  utils,
  layout,
};
