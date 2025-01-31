let currentUser = null;
        const users = [];
        let activities = [];
        let goals = [];

        // DOM Elements
        const authContainer = document.getElementById('auth-container');
        const appContainer = document.getElementById('app-container');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const logoutBtn = document.getElementById('logout-btn');
        const navLinks = document.querySelectorAll('.nav-link');
        const activityForm = document.getElementById('activity-form');
        const activitiesList = document.getElementById('activities-list');
        const goalForm = document.getElementById('goal-form');
        const goalsList = document.getElementById('goals-list');
        const goalsListPage = document.getElementById('goals-list-page');
        const profileForm = document.getElementById('profile-form');
        const contactForm = document.getElementById('contact-form');

        // Helper Functions
        let currentPage = 'dashboard';
        function showPage(pageId) {
            document.querySelectorAll('[id$="-page"]').forEach(page => page.style.display = 'none');
            document.getElementById(pageId).style.display = 'block';
            currentPage = pageId.replace('-page', '');
            updateNavigation();
        }

        function updateNavigation() {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-page') === currentPage) {
                    link.classList.add('active');
                }
            });
        }

        // Authentication
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                currentUser = user;
                authContainer.style.display = 'none';
                appContainer.style.display = 'block';
                showPage('dashboard-page');
                updateDashboard();
            } else {
                alert('Invalid credentials');
            }
        });

        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            if (users.some(u => u.email === email)) {
                alert('Email already registered');
            } else {
                const newUser = { name, email, password, weight: 0, height: 0 };
                users.push(newUser);
                currentUser = newUser;
                authContainer.style.display = 'none';
                appContainer.style.display = 'block';
                showPage('dashboard-page');
                updateDashboard();
            }
        });

        logoutBtn.addEventListener('click', () => {
            currentUser = null;
            authContainer.style.display = 'block';
            appContainer.style.display = 'none';
        });

        // Navigation
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = e.target.getAttribute('data-page') + '-page';
                showPage(pageId);
                
            });
        });

        // Activity Tracking
        activityForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const type = document.getElementById('activity-type').value;
            const duration = parseInt(document.getElementById('activity-duration').value);
            const calories = parseInt(document.getElementById('activity-calories').value);
            const activity = { type, duration, calories, date: new Date() };
            activities.push(activity);
            updateActivitiesList();
            updateDashboard();
            activityForm.reset();
        });

        function updateActivitiesList() {
            activitiesList.innerHTML = '';
            activities.slice().reverse().forEach(activity => {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.innerHTML = `
                    <strong>${activity.type}</strong> - ${activity.duration} minutes, ${activity.calories} calories
                    <small class="text-muted">${activity.date.toLocaleString()}</small>
                `;
                activitiesList.appendChild(li);
            });
        }

        // Goal Setting
        goalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const type = document.getElementById('goal-type').value;
            const target = parseInt(document.getElementById('goal-target').value);
            const deadline = document.getElementById('goal-deadline').value;
            const goal = { type, target, deadline, progress: 0 };
            goals.push(goal);
            updateGoalsList();
            updateDashboard();
            goalForm.reset();
        });

        function updateGoalsList() {
            goalsList.innerHTML = '';
            goalsListPage.innerHTML = '';
            goals.forEach(goal => {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.innerHTML = `
                    <strong>${goal.type}</strong> - Target: ${goal.target}, Deadline: ${goal.deadline}
                    <div class="progress mt-2">
                        <div class="progress-bar" role="progressbar" style="width: ${goal.progress}%;" 
                             aria-valuenow="${goal.progress}" aria-valuemin="0" aria-valuemax="100">
                            ${goal.progress}%
                        </div>
                    </div>
                `;
                goalsList.appendChild(li.cloneNode(true));
                goalsListPage.appendChild(li);
            });
        }

        // Profile Management
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            currentUser.name = document.getElementById('profile-name').value;
            currentUser.email = document.getElementById('profile-email').value;
            currentUser.weight = parseFloat(document.getElementById('profile-weight').value);
            currentUser.height = parseInt(document.getElementById('profile-height').value);
            updateDashboard();
            alert('Profile updated successfully');
        });

        // Contact Form
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const message = document.getElementById('contact-message').value;
            
            // Here you would typically send the form data to a server
            // For now, we'll just show an alert
            alert(`Thank you for your message, ${name}! We'll get back to you at ${email} soon.`);
            contactForm.reset();
        });

        // Dashboard
        function updateDashboard() {
            // Update activity chart
            const activityChart = new Chart(document.getElementById('activity-chart'), {
                type: 'bar',
                data: {
                    labels: activities.slice(-7).map(a => a.type),
                    datasets: [{
                        label: 'Calories Burned',
                        data: activities.slice(-7).map(a => a.calories),
                        backgroundColor: 'rgba(75, 192, 192, 0.6)'
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            // Update goals progress
            updateGoalsList();

            // Update profile stats
            const statsChart = new Chart(document.getElementById('stats-chart'), {
                type: 'line',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [{
                        label: 'Weight (kg)',
                        data: [currentUser.weight, currentUser.weight - 0.5, currentUser.weight - 1, currentUser.weight - 1.5],
                        borderColor: 'rgba(75, 192, 192, 1)',
                        tension: 0.1
                    }]
                }
            });

            // Populate profile form
            document.getElementById('profile-name').value = currentUser.name;
            document.getElementById('profile-email').value = currentUser.email;
            document.getElementById('profile-weight').value = currentUser.weight;
            document.getElementById('profile-height').value = currentUser.height;
        }

        // Initial setup
        showPage('dashboard-page');
        
