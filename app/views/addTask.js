define('views/addTask', [
  'backbone',
  'lodash'
], function(
  Backbone,
  _
) {
  /**
   * A view for handling the task adding and importing mechanisms of the UI.
   * 
   * @return {Backbone.View}      instance
   */
  return Backbone.View.extend({
    /**
     * A delegate is an 'owner' object that implements the protocol of a class
     * and awaits instructions from that class. This helps us separate concerns
     * of the various levels of the hierarchy, while still allowing cross-chat.
     * 
     * @type {Object}
     */
    delegate: null,

    /**
     * @override
     */
    events: {
      'click .add-task-button': 'addTask',
      'click .import-task-button': 'importTask'
    },

    /**
     * @override
     */
    template: _.template('<div class="add-task"><input type="text" class="task-name"><button class="add-task-button">Add task</button><button class="import-task-button">Import task</button>'),
    
    /**
     * @override
     */
    render: function() {
      this.$el.html(this.template());
      return this;
    },

    /**
     * Called when a user wants to add a task.
     */
    addTask: function() {
      var taskName = this.$el.find('.task-name').val();

      this.delegate.wantsToAddTask(taskName);
    },

    /**
     * Called when a user wants to import a task.
     */
    importTask: function() {
      var ret = prompt('Paste your shared task code');

      this.delegate.wantsToImportTask(ret);
    }
  });
});