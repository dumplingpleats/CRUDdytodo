document.addEventListener('DOMContentLoaded', () => {
  const todoForm = document.getElementById('todo-form');
  const taskInput = document.getElementById('task');
  const todoList = document.getElementById('todo-list');

  // Fetch and display todos
  async function fetchTodos() {
    try {
      const response = await fetch('http://localhost:3000/todos');
      const todos = await response.json();
      todoList.innerHTML = '';
      todos.forEach((todo) => {
        const todoItem = document.createElement('li');
        todoItem.classList.add(todo.completed ? 'completed' : '');
        todoItem.innerHTML = `
          ${todo.task}
          <button onclick="deleteTodo('${todo._id}')">Delete</button>
          <button onclick="toggleTodo('${todo._id}', ${todo.completed})">${todo.completed ? 'Undo' : 'Complete'}</button>
        `;
        todoList.appendChild(todoItem);
      });
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  }

  // Handle form submission to add a new todo
  todoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const task = taskInput.value;

    try {
      const response = await fetch('http://localhost:3000/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task }),
      });
      const todo = await response.json();
      fetchTodos();  // Refresh the list
      taskInput.value = '';
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  });

  // Function to delete a todo
  window.deleteTodo = async function (id) {
    try {
      await fetch(`http://localhost:3000/todos/${id}`, {
        method: 'DELETE',
      });
      fetchTodos();  // Refresh the list
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // Function to toggle todo completion status
  window.toggleTodo = async function (id, completed) {
    try {
      await fetch(`http://localhost:3000/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !completed }),
      });
      fetchTodos();  // Refresh the list
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  // Initial fetch of todos
  fetchTodos();
});
