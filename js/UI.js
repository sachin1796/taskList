
const UI = (() => {
    let currentTaskId = null;
    
    const taskManager = TaskManager; 

    const initialize = () => {
        setupEventListeners();
        renderTasks();
        setupDragAndDrop();
    };

    const setupEventListeners = () => {
        
        document.getElementById('addTaskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            handleAddTask();
        });

        document.getElementById('editTaskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            handleUpdateTask();
        });

        
        document.getElementById('deleteTask').addEventListener('click', () => {
            handleDeleteTask();
        });

  
        document.getElementById('searchInput').addEventListener('input', (e) => {
            handleSearch(e.target.value);
        });

        
        document.getElementById('priorityFilter').addEventListener('change', (e) => {
            handlePriorityFilter(e.target.value);
        });

        document.querySelector('.close').addEventListener('click', () => {
            closeModal();
        });
    };

    const setupDragAndDrop = () => {
        const taskList = document.getElementById('taskList');

        taskList.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('task-item')) {
                e.target.classList.add('dragging');
                e.dataTransfer.setData('text/plain', e.target.dataset.taskId);
            }
        });

        taskList.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('task-item')) {
                e.target.classList.remove('dragging');
            }
        });

        taskList.addEventListener('dragover', (e) => {
            e.preventDefault();
            const draggable = document.querySelector('.dragging');
            if (draggable) {
                const afterElement = getDragAfterElement(taskList, e.clientY);
                if (afterElement) {
                    taskList.insertBefore(draggable, afterElement);
                } else {
                    taskList.appendChild(draggable);
                }
            }
        });
    };

    const getDragAfterElement = (container, y) => {
        const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    };

    const handleAddTask = () => {
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const priority = document.getElementById('taskPriority').value;
        const dueDate = document.getElementById('taskDueDate').value;

        const task = taskManager.addTask({
            title,
            description,
            priority,
            dueDate,
            completed: false
        });

        renderTasks();
        showNotification('Task added successfully!');
        document.getElementById('addTaskForm').reset();
    };

    const handleUpdateTask = () => {
        if (!currentTaskId) return;

        const updatedTask = {
            title: document.getElementById('editTaskTitle').value,
            description: document.getElementById('editTaskDescription').value,
            priority: document.getElementById('editTaskPriority').value,
            dueDate: document.getElementById('editTaskDueDate').value
        };

        if (taskManager.updateTask(currentTaskId, updatedTask)) {
            renderTasks();
            closeModal();
            showNotification('Task updated successfully!');
        }
    };

    const handleDeleteTask = () => {
        if (!currentTaskId) return;

        if (taskManager.deleteTask(currentTaskId)) {
            renderTasks();
            closeModal();
            showNotification('Task deleted successfully!');
        }
    };

    const handleSearch = (searchTerm) => {
        renderTasks({ search: searchTerm });
    };

    const handlePriorityFilter = (priority) => {
        renderTasks({ priority });
    };

    const renderTasks = (filters = {}) => {
        const taskList = document.getElementById('taskList');
        const tasks = taskManager.getTasks(filters);

        taskList.innerHTML = tasks.map(task => createTaskElement(task)).join('');

        
        taskList.querySelectorAll('.task-item').forEach(item => {
            item.addEventListener('click', () => openTaskModal(item.dataset.taskId));
        });
    };

    const createTaskElement = (task) => {
        return `
            <div class="task-item ${task.priority}-priority" 
                 data-task-id="${task.id}"
                 draggable="true">
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <div class="task-meta">
                    <span class="priority">Priority: ${task.priority}</span>
                    <span class="due-date">Due: ${new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
            </div>
        `;
    };

    const openTaskModal = (taskId) => {
        const task = taskManager.getTask(taskId);
        if (!task) return;

        currentTaskId = taskId;
        document.getElementById('editTaskTitle').value = task.title;
        document.getElementById('editTaskDescription').value = task.description;
        document.getElementById('editTaskPriority').value = task.priority;
        document.getElementById('editTaskDueDate').value = task.dueDate;

        document.getElementById('taskModal').style.display = 'block';
    };

    const closeModal = () => {
        document.getElementById('taskModal').style.display = 'none';
        currentTaskId = null;
    };

    const showNotification = (message) => {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    };

    return {
        initialize
    };
})();

UI.initialize();
