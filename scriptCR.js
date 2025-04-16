// Select DOM elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// Load tasks from local storage
document.addEventListener('DOMContentLoaded', loadTodos);

// Add new task
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const task = todoInput.value.trim();
    if (task) {
        addTodoToDOM(task);
        saveTodoToLocalStorage(task);
        todoInput.value = '';
    }
});

// Add task to DOM
function addTodoToDOM(task) {
    const li = document.createElement('li');
    li.textContent = task;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
        removeTodoFromDOM(li);
        removeTodoFromLocalStorage(task);
    });

    li.appendChild(deleteBtn);
    todoList.appendChild(li);
}

// Remove task from DOM
function removeTodoFromDOM(todoItem) {
    todoItem.remove();
}

// Save task to local storage
function saveTodoToLocalStorage(task) {
    const todos = getTodosFromLocalStorage();
    todos.push(task);
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Get tasks from local storage
function getTodosFromLocalStorage() {
    return JSON.parse(localStorage.getItem('todos')) || [];
}

// Load tasks into DOM
function loadTodos() {
    const todos = getTodosFromLocalStorage();
    todos.forEach(task => addTodoToDOM(task));
}

// Remove task from local storage
function removeTodoFromLocalStorage(task) {
    let todos = getTodosFromLocalStorage();
    todos = todos.filter(t => t !== task);
    localStorage.setItem('todos', JSON.stringify(todos));
}
