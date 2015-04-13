/**
 * TaskList class -- handles all functionality relating to organizing
 * and displaying the task list, as well as meta functions like removing
 * or adding tasks
 *
 * @protocol AddTask
 * 
 * @return {[type]} [description]
 */
define('views/taskList', [
  'backbone',
  'lodash',
  'views/addTask',
  'views/task',
  'models/task'
], function(
  Backbone,
  _,
  AddTaskView,
  TaskView,
  TaskModel
) {
  return Backbone.View.extend({

    showAll: false,

    events: {
      'click .toggle-show-all': 'toggleShowAll',
      'click .remove-finished': 'removeFinished'
    },

    /**
     * @override
     */
    initialize: function(tasks, $parentEl) {
      this.tasksCollection = tasks;
      this.$parentEl = $parentEl;

      this.tasksCollection.on('change', this.render, this);
    },

    template: _.template('<ul class="tasks<%= showAll ? " show-all" : "" %>"></ul>'),
    removeFinishedTemplate: _.template('<button class="remove-finished">Remove completed tasks</button>'),
    toggleShowAllTemplate: _.template('<button class="toggle-show-all">Show all (<%= showAll ? "on" : "off"%>)</button>'),
    nullTemplate: _.template('<div class="empty">You have no tasks currently. Type the name of a task in above and click \'Add task\'</div>'),

    /**
     * @override
     */
    render: function() {
      var addTaskView = new AddTaskView(),
          $ul = $(this.template(this));

      addTaskView.delegate = this;

      this.$el.html('');
      this.$el.append(addTaskView.render().$el);
      
      if (this.tasksCollection.where({removed: false}).length === 0 && this.showAll === false) {
        this.$el.append(this.nullTemplate());
      } else {
        this.$el.append($ul);
        this.tasksCollection.forEach(function(taskModel) {
          $ul.append((new TaskView(taskModel)).render().$el);
        });        
      }
      
      this.$el.append(this.removeFinishedTemplate());
      this.$el.append(this.toggleShowAllTemplate(this));

      this.$parentEl.append(this.$el);

      return this;
    },

    /**
     * AddTask delegate method. Called when AddTaskView's addTask button is clicked
     * 
     * @param  {String} taskName Task's name as described when entered
     * @return {Collection}      Updated collection object
     */
    wantsToAddTask: function(taskName) {
      this.tasksCollection.create({
        name: taskName
      }, {
        table: 'tasks'
      });
    },

    /**
     * Implementation of AddTask delegate protocol. Called when AddTaskView's 
     * import task button was clicked.
     * 
     * @param  {String} encodedTask The Base64 string provided by the user to import.
     */
    wantsToImportTask: function(encodedTask) {
      var task = new TaskModel();

      task.set(task.deserialize(encodedTask));
      this.tasksCollection.create(task, { table: 'tasks' });
    },

    /**
     * Called when user wants to toggle between showing removed tasks or not.
     */
    toggleShowAll: function() {
      this.showAll = !this.showAll;
      this.render();
    },

    /**
     * Called when user wants to remove finished tasks from his list. Simply
     * flags those tasks as "removed".
     */
    removeFinished: function() {
      this.tasksCollection.forEach(function(taskModel) {
        if (taskModel.get('complete')) {
          taskModel.save({ removed: true }, {table: 'tasks'});
        }
      });
    }
  });
});