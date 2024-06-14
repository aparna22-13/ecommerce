// script.js

// Elements
const taskInput = document.getElementById('new-task');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

// Load tasks from local storage
document.addEventListener('DOMContentLoaded', loadTasks);

// Event listeners
addTaskBtn.addEventListener('click', addTask);
taskList.addEventListener('click', handleTaskAction);

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const task = { text: taskText, completed: false };
        addTaskToDOM(task);
        saveTaskToLocal(task);
        taskInput.value = '';
    }
}

function addTaskToDOM(task) {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';
    li.innerHTML = `
        <span>${task.text}</span>
        <div>
            <button class="complete-btn">${task.completed ? 'Uncomplete' : 'Complete'}</button>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;
    taskList.appendChild(li);
}

function handleTaskAction(e) {
    const target = e.target;
    const li = target.closest('li');

    if (target.classList.contains('complete-btn')) {
        toggleCompleteTask(li);
    } else if (target.classList.contains('edit-btn')) {
        editTask(li);
    } else if (target.classList.contains('delete-btn')) {
        deleteTask(li);
    }
}

function toggleCompleteTask(li) {
    const taskText = li.querySelector('span').textContent;
    const tasks = getTasksFromLocal();
    const task = tasks.find(task => task.text === taskText);
    task.completed = !task.completed;
    saveTasksToLocal(tasks);
    li.classList.toggle('completed');
    li.querySelector('.complete-btn').textContent = task.completed ? 'Uncomplete' : 'Complete';
}

function editTask(li) {
    const taskText = li.querySelector('span').textContent;
    const newTaskText = prompt('Edit task:', taskText);
    if (newTaskText) {
        const tasks = getTasksFromLocal();
        const task = tasks.find(task => task.text === taskText);
        task.text = newTaskText;
        saveTasksToLocal(tasks);
        li.querySelector('span').textContent = newTaskText;
    }
}

function deleteTask(li) {
    const taskText = li.querySelector('span').textContent;
    const tasks = getTasksFromLocal().filter(task => task.text !== taskText);
    saveTasksToLocal(tasks);
    taskList.removeChild(li);
}

function saveTaskToLocal(task) {
    const tasks = getTasksFromLocal();
    tasks.push(task);
    saveTasksToLocal(tasks);
}

function getTasksFromLocal() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

function saveTasksToLocal(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = getTasksFromLocal();
    tasks.forEach(addTaskToDOM);
}
