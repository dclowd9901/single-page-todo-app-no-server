define('routes/index', [
  'jquery',
  'models/task',
  'collections/task',
  'views/taskList'
], function(
  $,
  TaskModel,
  TaskCollection,
  TaskListView
) {
  return {

    /**
     * Index route for the app.
     */
    index: function() {
      var tasks = new TaskCollection(),
          taskList = new TaskListView(tasks, $('#layout'));

      tasks.fetch();

      taskList.render();
    }
  };
});