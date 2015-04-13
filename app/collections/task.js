define('collections/task', ['models/task'], function(Task) {

  /**
   * Defines Task Collection, which handles all inbound and outbound changes
   * to the Tasks table in the local storage.
   * 
   * @type {Class}
   */
  return Backbone.Collection.extend({

    /**
     * @override
     */
    model: Task,

    /**
     * noop, but we have to set it or Backbone starts crying.
     */
    url: '',

    /**
     * An attempt to avoid having to include this option on every save
     * call
     * 
     * @override
     * @type {method}
     */
    fetch: _.partial(Backbone.Collection.prototype.fetch, {
      table: 'tasks'
    })
  });
});