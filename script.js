// Carrega tarefas do localStorage ao iniciar
document.addEventListener('DOMContentLoaded', loadTasks);

// Adiciona uma nova tarefa
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Por favor, insira uma tarefa!');
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    saveTask(task);
    renderTask(task);
    taskInput.value = '';
}

// Salva tarefa no localStorage
function saveTask(task) {
    let tasks = getTasks();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Carrega tarefas do localStorage
function loadTasks() {
    const tasks = getTasks();
    tasks.forEach(task => renderTask(task));
}

// Obtém tarefas do localStorage
function getTasks() {
    return JSON.parse(localStorage.getItem('tasks') || '[]');
}

// Renderiza uma tarefa na lista
function renderTask(task) {
    const taskList = document.getElementById('taskList');
    const li = document.createElement('li');
    li.dataset.id = task.id;
    if (task.completed) li.classList.add('completed');

    li.innerHTML = `
<span>${task.text}</span>

<div> <button onclick="toggleTask(${task.id})">${task.completed ? 'Desmarcar' : 'Concluir'}</button> <button onclick="deleteTask(${task.id})">Excluir</button> </div> `;
    taskList.appendChild(li);

// Envia notificação quando a tarefa é adicionada
    if (Notification.permission === 'granted') {
        new Notification('Nova tarefa adicionada!', {
            body: task.text,
            icon: 'https://via.placeholder.com/16'
        });
    }
}

// Alterna estado de conclusão da tarefa
function toggleTask(id) {
    let tasks = getTasks();
    tasks = tasks.map(task => {
        if (task.id === id) task.completed = !task.completed;
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    refreshTaskList();
}

// Exclui uma tarefa
function deleteTask(id) {
    let tasks = getTasks();
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    refreshTaskList();
}

// Atualiza a lista de tarefas
function refreshTaskList() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    loadTasks();
}

// Solicita permissão para notificações
function requestNotificationPermission() {
    if (!('Notification' in window)) {
        alert('Este navegador não suporta notificações.');
        return;
    }

    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            alert('Notificações ativadas!');
        }
    });
}