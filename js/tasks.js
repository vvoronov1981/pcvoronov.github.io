(() => {
    const STORAGE_KEY = 'vv_visitor_tasks';
    const LEGACY_STORAGE_KEY = 'vv_tasks';
    let currentFilter = 'all';

    const taskInput = document.getElementById('task-input');
    const taskPriority = document.getElementById('task-priority');
    const taskAddBtn = document.getElementById('task-add-btn');
    const taskList = document.getElementById('task-list');
    const tasksClearDone = document.getElementById('tasks-clear-done');
    const tasksTotal = document.getElementById('tasks-total');
    const tasksDone = document.getElementById('tasks-done');

    if (!taskInput) return;

    function normalizeTasks(value) {
        if (!Array.isArray(value)) return [];
        return value.filter(task => task && typeof task.text === 'string').map(task => ({
            id: typeof task.id === 'string' ? task.id : createId(),
            text: task.text.trim(),
            priority: ['low', 'medium', 'high'].includes(task.priority) ? task.priority : 'medium',
            done: Boolean(task.done),
            createdAt: Number.isFinite(task.createdAt) ? task.createdAt : Date.now()
        })).filter(task => task.text.length > 0);
    }

    function migrateLegacyTasks() {
        const existing = localStorage.getItem(STORAGE_KEY);
        if (existing !== null) return;

        const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
        if (!legacy) return;

        try {
            const migrated = normalizeTasks(JSON.parse(legacy));
            localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
            localStorage.removeItem(LEGACY_STORAGE_KEY);
        } catch (error) {
            console.error('Unable to migrate legacy visitor tasks:', error);
        }
    }

    function loadTasks() {
        try {
            const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            return normalizeTasks(parsed);
        } catch (error) {
            console.error('Unable to load visitor tasks:', error);
            return [];
        }
    }

    function saveTasks(tasks) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }

    function createId() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2);
    }

    function addTask() {
        const text = taskInput.value.replace(/\s+/g, ' ').trim();
        if (!text) return;

        const tasks = loadTasks();
        tasks.unshift({
            id: createId(),
            text,
            priority: taskPriority.value,
            done: false,
            createdAt: Date.now()
        });
        saveTasks(tasks);
        taskInput.value = '';
        taskPriority.value = 'medium';
        render();
        taskInput.focus();
    }

    function toggleTask(id) {
        const tasks = loadTasks();
        const task = tasks.find(t => t.id === id);
        if (task) task.done = !task.done;
        saveTasks(tasks);
        render();
    }

    function deleteTask(id) {
        const tasks = loadTasks().filter(t => t.id !== id);
        saveTasks(tasks);
        render();
    }

    function clearDone() {
        const tasks = loadTasks().filter(t => !t.done);
        saveTasks(tasks);
        render();
    }

    function priorityLabel(p) {
        return { low: '🟢', medium: '🟡', high: '🔴' }[p] || '';
    }

    function filteredTasks(tasks) {
        if (currentFilter === 'pending') return tasks.filter(t => !t.done);
        if (currentFilter === 'done') return tasks.filter(t => t.done);
        return tasks;
    }

    function render() {
        const tasks = loadTasks();
        const visible = filteredTasks(tasks);
        const doneCount = tasks.filter(t => t.done).length;

        tasksTotal.textContent = `${tasks.length} task${tasks.length !== 1 ? 's' : ''}`;
        tasksDone.textContent = `${doneCount} completed`;

        if (visible.length === 0) {
            taskList.innerHTML = `
                <li class="task-empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <p>${currentFilter === 'done' ? 'No completed tasks yet.' : currentFilter === 'pending' ? 'All visitor tasks are done! 🎉' : 'No visitor tasks yet. Add your first task above!'}</p>
                </li>`;
            return;
        }

        taskList.innerHTML = visible.map(task => `
            <li class="task-item ${task.done ? 'task-done' : ''} task-priority-${task.priority}" data-id="${task.id}">
                <button class="task-check-btn" data-id="${task.id}" aria-label="${task.done ? 'Mark incomplete' : 'Mark complete'}">
                    <i class="fas ${task.done ? 'fa-check-circle' : 'fa-circle'}"></i>
                </button>
                <span class="task-priority-icon">${priorityLabel(task.priority)}</span>
                <span class="task-text">${escapeHtml(task.text)}</span>
                <button class="task-delete-btn" data-id="${task.id}" aria-label="Delete task">
                    <i class="fas fa-times"></i>
                </button>
            </li>
        `).join('');
    }

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // Event delegation for task list
    taskList.addEventListener('click', e => {
        const checkBtn = e.target.closest('.task-check-btn');
        const deleteBtn = e.target.closest('.task-delete-btn');
        if (checkBtn) toggleTask(checkBtn.dataset.id);
        if (deleteBtn) deleteTask(deleteBtn.dataset.id);
    });

    taskAddBtn.addEventListener('click', addTask);

    taskInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') addTask();
    });

    tasksClearDone.addEventListener('click', clearDone);

    document.querySelectorAll('.task-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.dataset.filter;
            document.querySelectorAll('.task-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            render();
        });
    });

    migrateLegacyTasks();
    render();
})();
