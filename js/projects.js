document.addEventListener('DOMContentLoaded', function() {
	// 项目数据
	const projects = [
		{
			id: 1,
			title: "AI Code Assistant",
			description: "An intelligent code completion tool that helps developers write better code faster with AI-powered suggestions.",
			category: "ai",
			tags: ["AI", "JavaScript", "VS Code"],
			image: "fas fa-robot",
			github: "https://github.com/alrcatraz/ai-code-assistant",
			demo: "#",
			featured: true
		},
		{
			id: 2,
			title: "Task Management System",
			description: "A comprehensive task management application with real-time collaboration features and intuitive interface.",
			category: "web",
			tags: ["React", "Node.js", "MongoDB"],
			image: "fas fa-tasks",
			github: "https://github.com/alrcatraz/task-manager",
			demo: "#",
			featured: true
		},
		{
			id: 3,
			title: "Data Visualization Dashboard",
			description: "Interactive dashboard for visualizing complex datasets with charts, graphs, and real-time updates.",
			category: "tools",
			tags: ["D3.js", "Python", "Flask"],
			image: "fas fa-chart-line",
			github: "https://github.com/alrcatraz/data-viz",
			demo: "#",
			featured: false
		},
		{
			id: 4,
			title: "Game Engine Prototype",
			description: "A lightweight 2D game engine built from scratch with physics simulation and rendering capabilities.",
			category: "games",
			tags: ["C++", "OpenGL", "Physics"],
			image: "fas fa-gamepad",
			github: "https://github.com/alrcatraz/game-engine",
			demo: "#",
			featured: false
		},
		{
			id: 5,
			title: "Machine Learning Toolkit",
			description: "A collection of machine learning algorithms and utilities for data analysis and model training.",
			category: "ai",
			tags: ["Python", "TensorFlow", "Scikit-learn"],
			image: "fas fa-brain",
			github: "https://github.com/alrcatraz/ml-toolkit",
			demo: "#",
			featured: true
		},
		{
			id: 6,
			title: "Web Scraper Framework",
			description: "A robust web scraping framework with proxy rotation, rate limiting, and data extraction capabilities.",
			category: "tools",
			tags: ["Python", "BeautifulSoup", "Selenium"],
			image: "fas fa-spider",
			github: "https://github.com/alrcatraz/web-scraper",
			demo: "#",
			featured: false
		}
	];

	let currentCategory = 'all';
	let projectsContainer = document.getElementById('projects-container');

	// 渲染项目卡片
	function renderProjects(projectsToRender) {
		projectsContainer.innerHTML = '';

		projectsToRender.forEach(project => {
			const projectCard = createProjectCard(project);
			projectsContainer.appendChild(projectCard);
		});

		// 添加动画效果
		setTimeout(() => {
			document.querySelectorAll('.project-card').forEach((card, index) => {
				card.style.opacity = '0';
				card.style.transform = 'translateY(30px)';
				card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

				setTimeout(() => {
					card.style.opacity = '1';
					card.style.transform = 'translateY(0)';
				}, index * 100);
			});
		}, 50);
	}

	// 创建项目卡片
	function createProjectCard(project) {
		const card = document.createElement('div');
		card.className = 'project-card';
		card.innerHTML = `
            <div class="project-image">
                <i class="${project.image}"></i>
            </div>
            <div class="project-content">
                <div class="project-header">
                    <h3>${project.title}</h3>
                    ${project.featured ? '<span class="featured-badge">Featured</span>' : ''}
                </div>
                <p class="project-description">${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="project-links">
                    <a href="${project.github}" target="_blank" class="project-link github-link">
                        <i class="fab fa-github"></i>
                        <span>GitHub</span>
                    </a>
                    ${project.demo !== '#' ? `
                        <a href="${project.demo}" target="_blank" class="project-link demo-link">
                            <i class="fas fa-external-link-alt"></i>
                            <span>Live Demo</span>
                        </a>
                    ` : ''}
                </div>
            </div>
        `;
		return card;
	}

	// 分类过滤
	function filterProjects(category) {
		currentCategory = category;
		let filteredProjects = projects;

		if (category !== 'all') {
			filteredProjects = projects.filter(project => project.category === category);
		}

		renderProjects(filteredProjects);
		updateCategoryLinks(category);
	}

	// 更新分类链接状态
	function updateCategoryLinks(activeCategory) {
		document.querySelectorAll('.category-link').forEach(link => {
			link.classList.remove('active');
			if (link.dataset.category === activeCategory) {
				link.classList.add('active');
			}
		});
	}

	// 分类链接点击事件
	document.querySelectorAll('.category-link').forEach(link => {
		link.addEventListener('click', function(e) {
			e.preventDefault();
			const category = this.dataset.category;
			filterProjects(category);
		});
	});

	// 搜索功能
	const searchInput = document.createElement('input');
	searchInput.type = 'text';
	searchInput.placeholder = 'Search projects...';
	searchInput.className = 'project-search';

	const searchContainer = document.createElement('div');
	searchContainer.className = 'project-search-container';
	searchContainer.appendChild(searchInput);

	const projectsHeader = document.querySelector('.projects-hero');
	projectsHeader.appendChild(searchContainer);

	searchInput.addEventListener('input', function() {
		const searchTerm = this.value.toLowerCase();
		let filteredProjects = projects;

		if (searchTerm) {
			filteredProjects = projects.filter(project =>
				project.title.toLowerCase().includes(searchTerm) ||
				project.description.toLowerCase().includes(searchTerm) ||
				project.tags.some(tag => tag.toLowerCase().includes(searchTerm))
			);
		}

		if (currentCategory !== 'all') {
			filteredProjects = filteredProjects.filter(project => project.category === currentCategory);
		}

		renderProjects(filteredProjects);
	});

	// 初始化显示所有项目
	renderProjects(projects);

	// 添加项目统计更新
	function updateStats() {
		const totalProjects = projects.length;
		const openSourceProjects = projects.filter(p => p.github && p.github !== '#').length;

		document.querySelector('.stat-number').forEach((stat, index) => {
			if (index === 0) {
				stat.textContent = totalProjects;
			} else if (index === 1) {
				stat.textContent = openSourceProjects;
			}
		});
	}

	updateStats();

	// 添加项目排序功能
	const sortContainer = document.createElement('div');
	sortContainer.className = 'project-sort-container';
	sortContainer.innerHTML = `
        <select class="project-sort">
            <option value="featured">Featured First</option>
            <option value="title">Title A-Z</option>
            <option value="category">Category</option>
        </select>
    `;

	projectsHeader.appendChild(sortContainer);

	document.querySelector('.project-sort').addEventListener('change', function() {
		const sortBy = this.value;
		let sortedProjects = [...projects];

		switch(sortBy) {
			case 'featured':
				sortedProjects.sort((a, b) => b.featured - a.featured);
				break;
			case 'title':
				sortedProjects.sort((a, b) => a.title.localeCompare(b.title));
				break;
			case 'category':
				sortedProjects.sort((a, b) => a.category.localeCompare(b.category));
				break;
		}

		if (currentCategory !== 'all') {
			sortedProjects = sortedProjects.filter(project => project.category === currentCategory);
		}

		renderProjects(sortedProjects);
	});
});
