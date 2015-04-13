define('views/task', [
  'lodash'
], function(
  _
) {
  return Backbone.View.extend({
    /**
     * @override
     */
    events: {
      'click input': 'inputChanged',
      'click .share': 'share',
      'click .restore-task': 'restoreTask'
    },

    /**
     * @override
     */
    initialize: function(taskModel) {
      this.model = taskModel;
    },

    tagName: 'li',
    className: 'task',

    template: _.template('<input type="checkbox" id="task-<%= id %>" class="task-complete" <%= complete ? "checked=checked" : ""%>"><label class="name" for="task-<%= id %>"><%= name %></label> <button class="share">Share</button>'),
    restoreButton: _.template('<button class="restore-task">Restore</button>'),

    /**
     * @override
     */
    render: function() {
      this.$el.html(this.template(this.model.attributes));
      this.$el.append(this.restoreButton(this.model.attributes));

      return this;
    },

    /**
     * Called when the user changes the checkbox.
     */
    inputChanged: function() {
      var checkboxValue = this.$el.find('input')[0].checked;

      this.model.save({complete: checkboxValue}, { table: 'tasks' });
    },

    /**
     * Called when the user wants to share a task. Displays a javascript prompt
     * window with the Base64 encoded object ready to copy.
     */
    share: function() {
      prompt('Copy and paste this code into import window.', this.model.serialize());
    },

    /**
     * Called when a user wants to restore a removed task.
     */
    restoreTask: function() {
      this.model.save({removed:false}, {table: 'tasks'});
    }
  }); 
});