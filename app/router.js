define(function(require, exports, module) {
  "use strict";

  // External dependencies.
  var Backbone = require("backbone");

  var IndexRoute = require('routes/index'); 

  // Defining the application router.
  var Router = Backbone.Router.extend({
    routes: {
      "": "index"
    },

    index:      IndexRoute.index,
  });

  module.exports = Router;
});
