define('models/task', ['backbone'], function(Backbone){

  /**
   * Task Model - Represents a task in the store. Also has functionality
   * to serialize and deserialize a task for sharing. Probably would want to move
   * that functionality into a LocalStorage Model abstraction.
   *
   * @Class
   */
  return Backbone.Model.extend({
    defaults: {
      name: '',
      complete: false,
      removed: false
    },

    /**
     * Turns attributes into a Base64 encoding that can be shared with other
     * consumers of this app.
     * 
     * @return {String} Base64 string that represents a model's object
     */
    serialize: function() {
      var toShare = _.clone(this.attributes);

      // We have to remove the id, otherwise when it's created on the other side
      // Backbone will treat it like an update.
      delete toShare.id;
      return window.btoa(JSON.stringify(toShare));
    },

    /**
     * Turns a Base64 string into an object that could be set into this model.
     * 
     * @param  {String} encoded Base64 string from the `serialize` method
     * @return {Object}         Object that would otherwise be this model
     */
    deserialize: function(encoded) {
      return JSON.parse(window.atob(encoded));
    }
  });
});