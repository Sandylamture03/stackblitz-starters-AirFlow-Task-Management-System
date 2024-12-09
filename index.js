const express = require('express');
const { resolve } = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
const port = 3000;

app.use(express.static('static'));

/*  Add a Task to the Task List

Objective: Add a new task to the task list using the provided details.

Endpoint: /tasks/add

Query Parameters:

taskId: The ID of the task (integer).

text: The description of the task (string).

priority: The priority of the task (integer).

Your Task: Create a function that will add a new task to the task list using the details provided in the query parameters.

Example Call:

<http://localhost:3000/tasks/add?taskId=4&text=Review%20code&priority=1>
 */

let tasks = [
  { taskId: 1, text: 'Fix bug #101', priority: 2 },
  { taskId: 2, text: 'Implement feature #202', priority: 1 },
  { taskId: 3, text: 'Write documentation', priority: 3 },
];

function addTask(taskId, text, priority) {
  // Convert taskId and priority to integers
  const id = parseInt(taskId);
  const prio = parseInt(priority);

  // Check if the taskId already exists
  const existingTask = tasks.find((task) => task.taskId === id);
  if (existingTask) {
    return { error: `Task with ID ${id} already exists.` };
  }

  // Create a new task object
  const newTask = { taskId: id, text, priority: prio };

  // Add the new task to the tasks array
  tasks.push(newTask);
  console.log(`Task added: ${JSON.stringify(newTask)}`);

  return newTask; // Return the newly added task
}

app.get('/tasks/add', (req, res) => {
  let taskId = parseInt(req.query.taskId);
  let text = req.query.text;
  let priority = parseInt(req.query.priority);
  let result = addTask(taskId, text, priority);
  res.json({ tasks: result });
});

/*  Endpoint 2. Read All Tasks in the Task List

Objective: Return the current list of tasks.

Endpoint: /tasks

Your Task: Create a function that will return the current state of the task list.

Example Call:

<http://localhost:3000/tasks> */

app.get('/tasks', (req, res) => {
  let result = tasks;
  res.json({ tasks: result });
});

/*  Endpoint 3. Sort Tasks by Priority

Objective: Sort tasks by their priority in ascending order.

Endpoint: /tasks/sort-by-priority

Your Task: Create a function that will sort the tasks by their priority in ascending order.

Example Call:

<http://localhost:3000/tasks/sort-by-priority> */

function sortAscendingOrder(taskObj1, taskObj2) {
  return taskObj1.priority - taskObj2.priority;
}

app.get('/tasks/sort-by-priority', (req, res) => {
  tasks.sort(sortAscendingOrder);
  res.json(tasks);
});

/*  Endpoint 4. Edit Task Priority

Objective: Edit the priority of an existing task based on the task ID.

Endpoint: /tasks/edit-priority

Query Parameters:

taskId: The ID of the task (integer).

priority: The new priority of the task (integer).

Your Task: Create a function that will update the priority of a task based on the task ID.

Example Call:

<http://localhost:3000/tasks/edit-priority?taskId=1&priority=1>  */

const updateTaskPriority = (taskId, newPriority) => {
  const task = tasks.find((t) => t.taskId === taskId);
  if (task) {
    task.priority = newPriority;
    return { success: true, task };
  }
  return { success: false };
};

// Endpoint to edit task priority
app.get('/tasks/edit-priority', (req, res) => {
  const taskId = parseInt(req.query.taskId);
  const newPriority = parseInt(req.query.priority);

  const result = updateTaskPriority(taskId, newPriority);

  if (result.success) {
    res.status(200).json({
      message: 'Task priority updated successfully',
      task: result.task,
    });
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

/*  Endpoint 5. Edit/Update Task Text

Objective: Edit the text of an existing task based on the task ID.

Endpoint: /tasks/edit-text

Query Parameters:

taskId: The ID of the task (integer).

text: The new text of the task (string).

Your Task: Create a function that will update the text of a task based on the task ID.

Example Call:

<http://localhost:3000/tasks/edit-text?taskId=3&text=Update%20documentation> */

const updateTaskText = (taskId, newText) => {
  const task = tasks.find((t) => t.taskId === taskId);
  if (task) {
    task.text = newText;
    return { success: true, task };
  }
  return { success: false };
};

app.get('/tasks/edit-text', (req, res) => {
  const taskId = parseInt(req.query.taskId);
  const newText = req.query.text;

  const result = updateTaskText(taskId, newText);

  if (result.success) {
    res
      .status(200)
      .json({ message: 'Task text updated successfully', task: result.task });
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

/*  Endpoint 6. Delete a Task from the Task List

Objective: Delete a task from the task list based on the task ID.

Endpoint: /tasks/delete

Query Parameters:

taskId: The ID of the task to be deleted (integer).

Note: You’ll have to update the original array with the results of .filter() method. For example tasks = task.filter(...)

Your Task: Create a function that will remove a task from the task list based on the task ID.

Example Call:

<http://localhost:3000/tasks/delete?taskId=2> */

const deleteTask = (taskId) => {
  const initialLength = tasks.length;
  tasks = tasks.filter((task) => task.taskId !== taskId);
  return tasks.length < initialLength; // Returns true if a task was deleted
};

// Endpoint to delete a task
app.get('/tasks/delete', (req, res) => {
  const taskId = parseInt(req.query.taskId);

  const wasDeleted = deleteTask(taskId);

  if (wasDeleted) {
    res.status(200).json({ tasks });
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

/* Endpoint 7. Filter Tasks by Priority

Objective: Return tasks that match a specified priority.

Endpoint: /tasks/filter-by-priority

Query Parameters:

priority: The priority to filter tasks by (integer).

Your Task: Create a function that will return tasks that match a specified priority.

Example Call:

<http://localhost:3000/tasks/filter-by-priority?priority=1>
*/

// Helper function to filter tasks by priority
const filterTasksByPriority = (priority) => {
  return tasks.filter((task) => task.priority === priority);
};

// Endpoint to filter tasks by priority
app.get('/tasks/filter-by-priority', (req, res) => {
  const priority = parseInt(req.query.priority);

  const filteredTasks = filterTasksByPriority(priority);

  if (filteredTasks.length > 0) {
    res.status(200).json(filteredTasks);
  } else {
    res
      .status(404)
      .json({ message: 'No tasks found with the specified priority' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
