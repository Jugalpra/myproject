const tasks = {
    school: [
        { id: 1, title: "Plant a Tree", description: "Plant one tree in your school campus to help the environment", points: 20 },
        { id: 2, title: "Reduce Plastic", description: "Avoid using plastic products for a week", points: 30 }
    ],
    college: [
        { id: 3, title: "Solar Panel Workshop", description: "Attend or organize a solar energy awareness workshop", points: 40 },
        { id: 4, title: "Community Clean-Up", description: "Lead a community cleaning drive", points: 35 }
    ]
};

let users = [];
let leaderboard = [];

let currentUser = null;

function registerUser() {
    const nameInput = document.getElementById('inputName').value.trim();
    const group = document.getElementById('groupSelect').value;

    if (!nameInput) {
        alert('Please enter your name.');
        return;
    }

    currentUser = {
        id: Date.now(),
        name: nameInput,
        group: group,
        points: 0,
        acceptedTasks: []
    };

    users.push(currentUser);

    showGameScreen();
    updateTaskList();
    updateLeaderboard();
}

function showGameScreen() {
    document.getElementById('registerScreen').classList.remove('active');
    document.getElementById('gameScreen').classList.add('active');

    document.getElementById('playerName').textContent = currentUser.name;
    document.getElementById('playerGroup').textContent = currentUser.group.charAt(0).toUpperCase() + currentUser.group.slice(1);
}

function updateTaskList() {
    const taskUl = document.getElementById('tasksUl');
    taskUl.innerHTML = '';

    tasks[currentUser.group].forEach(task => {
        if (!currentUser.acceptedTasks.includes(task.id)) {
            const li = document.createElement('li');
            li.textContent = `${task.title} (${task.points} pts) - ${task.description} `;

            const btn = document.createElement('button');
            btn.textContent = 'Accept Task';
            btn.classList.add('task-accept-btn');
            btn.onclick = () => acceptTask(task.id);

            li.appendChild(btn);
            taskUl.appendChild(li);
        }
    });

    updateMyTasks();
}

function acceptTask(taskId) {
    currentUser.acceptedTasks.push(taskId);
    updateTaskList();
    updateMyTasks();
}

function updateMyTasks() {
    const myTasksUl = document.getElementById('myTasksUl');
    myTasksUl.innerHTML = '';

    currentUser.acceptedTasks.forEach(taskId => {
        const task = tasks[currentUser.group].find(t => t.id === taskId);
        const li = document.createElement('li');
        li.textContent = `${task.title} (${task.points} pts)`;

        const btn = document.createElement('button');
        btn.textContent = 'Complete Task';
        btn.onclick = () => completeTask(taskId);

        li.appendChild(btn);
        myTasksUl.appendChild(li);
    });
}

function completeTask(taskId) {
    const task = tasks[currentUser.group].find(t => t.id === taskId);
    if (task) {
        if (!leaderboard.find(u => u.id === currentUser.id)) {
            leaderboard.push(currentUser);
        }
        currentUser.points += task.points;
        currentUser.acceptedTasks = currentUser.acceptedTasks.filter(id => id !== taskId);
        updateTaskList();
        updateLeaderboard();
        updateMyTasks();
        alert(`Task Completed! You earned ${task.points} points.`);
    }
}

function updateLeaderboard() {
    leaderboard.sort((a, b) => b.points - a.points);
    const lbUl = document.getElementById('leaderboardUl');
    lbUl.innerHTML = '';

    leaderboard.forEach(user => {
        const li = document.createElement('li');
        li.textContent = `${user.name} (${user.group}): ${user.points} pts`;
        lbUl.appendChild(li);
    });
}

function logout() {
    currentUser = null;
    document.getElementById('registerScreen').classList.add('active');
    document.getElementById('gameScreen').classList.remove('active');
}