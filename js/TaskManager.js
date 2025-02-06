

const TaskManager = (() => {
    
    const loadTasks = () => {
        const tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    };

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    
    let tasks = loadTasks();

  
    const addTask = (task) => {
        task.id = Date.now().toString(); 
        task.createdAt = new Date().toISOString();
        tasks.push(task);
        saveTasks(); 
        return task;
    };

    const getTask = (id) => {
        return tasks.find(task => task.id === id);
    };

    const updateTask = (id, updatedTask) => {
        const index = tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            tasks[index] = { ...tasks[index], ...updatedTask }; 
            saveTasks();
            return true;
        }
        return false;
    };

    const deleteTask = (id) => {
        const index = tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            tasks.splice(index, 1); 
            saveTasks();
            return true;
        }
        return false;
    };

    const getTasks = (filters = {}) => {
        let filteredTasks = [...tasks]; 
        
        if (filters.priority && filters.priority !== 'all') {
            filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
        }

  
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filteredTasks = filteredTasks.filter(task =>
                task.title.toLowerCase().includes(searchTerm) ||
                task.description.toLowerCase().includes(searchTerm)
            );
        }

        return filteredTasks;
    };

    return {
        addTask,
        getTask,
        updateTask,
        deleteTask,
        getTasks
    };
})();



