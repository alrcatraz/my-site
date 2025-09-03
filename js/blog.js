document.addEventListener('DOMContentLoaded', function() {
	// 博客文章数据
	const blogPosts = [
		{
			id: 1,
			title: "Getting Started with Modern Web Development",
			excerpt: "A comprehensive guide to getting started with modern web development, covering HTML5, CSS3, JavaScript, and popular frameworks.",
			content: "Full article content here...",
			category: "programming",
			tags: ["HTML5", "CSS3", "JavaScript", "Frontend"],
			date: "2024-01-15",
			readingTime: 8,
			author: "Alrcatraz",
			slug: "getting-started-modern-web-development"
		},
		{
			id: 2,
			title: "Building AI-Powered Applications with Python",
			excerpt: "Learn how to build intelligent applications using Python, machine learning libraries, and modern AI frameworks.",
			content: "Full article content here...",
			category: "programming",
			tags: ["Python", "AI", "Machine Learning", "TensorFlow"],
			date: "2024-01-10",
			readingTime: 12,
			author: "Alrcatraz",
			slug: "building-ai-powered-applications-python"
		},
		{
			id: 3,
			title: "The Future of Remote Work",
			excerpt: "Exploring the trends, challenges, and opportunities in the evolving landscape of remote work and distributed teams.",
			content: "Full article content here...",
			category: "thoughts",
			tags: ["Remote Work", "Future", "Technology", "Productivity"],
			date: "2024-01-05",
			readingTime: 6,
			author: "Alrcatraz",
			slug: "future-remote-work"
		},
		{
			id: 4,
			title: "Mastering Git: A Complete Guide",
			excerpt: "From basic commands to advanced workflows, this guide covers everything you need to know about Git version control.",
			content: "Full article content here...",
			category: "tutorials",
			tags: ["Git", "Version Control", "Development", "Tutorial"],
			date: "2023-12-28",
			readingTime: 15,
			author: "Alrcatraz",
			slug: "mastering-git-complete-guide"
		},
		{
			id: 5,
			title: "Introduction to Quantum Computing",
			excerpt: "An accessible introduction to quantum computing concepts, qubits, and the potential impact on future technology.",
			content: "Full article content here...",
			category: "technology",
			tags: ["Quantum Computing", "Physics", "Future Tech", "Science"],
			date: "2023-12-20",
			readingTime: 10,
			author: "Alrcatraz",
			slug: "introduction-quantum-computing"
		},
		{
			id: 6,
			title: "Effective Debugging Strategies",
			excerpt: "Proven techniques and tools for debugging code efficiently and finding bugs faster in any programming language.",
			content: "Full article content here...",
			category: "programming",
			tags: ["Debugging", "Programming", "Development", "Best Practices"],
			date: "2023-12-15",
			readingTime: 8,
			author: "Alrcatraz",
			slug: "effective-debugging-strategies"
		}
	];

	let currentPage = 1;
	const postsPerPage = 4;
	let filteredPosts = [...blogPosts];

	// DOM 元素
	const articlesContainer = document.getElementById('articles-container');
	const paginationContainer = document.getElementById('pagination');
	const searchInput = document.getElementById('search-input');
	const categoryFilter = document.getElementById('category-filter');
	const dateFilter = document.getElementById('date-filter');
	const searchButton = document.getElementById('search-button');

	// 渲染文章卡片
	function renderArticles(posts) {
		articlesContainer.innerHTML = '';

		if (posts.length === 0) {
			articlesContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No articles found</h3>
                    <p>Try adjusting your search criteria or browse all articles.</p>
                </div>
            `;
			return;
		}

		posts.forEach(post => {
			const articleCard = createArticleCard(post);
			articlesContainer.appendChild(articleCard);
		});

		// 添加动画效果
		setTimeout(() => {
			document.querySelectorAll('.article-card').forEach((card, index) => {
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

	// 创建文章卡片
	function createArticleCard(post) {
		const card = document.createElement('article');
		card.className = 'article-card';
		card.innerHTML = `
            <div class="article-image">
                <i class="fas fa-file-alt"></i>
            </div>
            <div class="article-content">
                <div class="article-category">${post.category}</div>
                <h3 class="article-title">
                    <a href="posts/${post.slug}.html">${post.title}</a>
                </h3>
                <p class="article-excerpt">${post.excerpt}</p>
                <div class="article-meta">
                    <span class="article-date">
                        <i class="fas fa-calendar"></i>
                        ${formatDate(post.date)}
                    </span>
                    <span class="article-reading-time">
                        <i class="fas fa-clock"></i>
                        ${post.readingTime} min read
                    </span>
                </div>
            </div>
        `;
		return card;
	}

	// 渲染分页
	function renderPagination() {
		const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
		paginationContainer.innerHTML = '';

		if (totalPages <= 1) return;

		// Previous button
		const prevButton = document.createElement('button');
		prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
		prevButton.disabled = currentPage === 1;
		prevButton.addEventListener('click', () => {
			if (currentPage > 1) {
				currentPage--;
				renderCurrentPage();
			}
		});
		paginationContainer.appendChild(prevButton);

		// Page numbers
		for (let i = 1; i <= totalPages; i++) {
			const pageButton = document.createElement('button');
			pageButton.textContent = i;
			pageButton.className = i === currentPage ? 'active' : '';
			pageButton.addEventListener('click', () => {
				currentPage = i;
				renderCurrentPage();
			});
			paginationContainer.appendChild(pageButton);
		}

		// Next button
		const nextButton = document.createElement('button');
		nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
		nextButton.disabled = currentPage === totalPages;
		nextButton.addEventListener('click', () => {
			if (currentPage < totalPages) {
				currentPage++;
				renderCurrentPage();
			}
		});
		paginationContainer.appendChild(nextButton);
	}

	// 渲染当前页面
	function renderCurrentPage() {
		const startIndex = (currentPage - 1) * postsPerPage;
		const endIndex = startIndex + postsPerPage;
		const currentPosts = filteredPosts.slice(startIndex, endIndex);

		renderArticles(currentPosts);
		renderPagination();
		updateSidebar();
	}

	// 搜索功能
	function performSearch() {
		const searchTerm = searchInput.value.toLowerCase();
		const selectedCategory = categoryFilter.value;
		const selectedYear = dateFilter.value;

		filteredPosts = blogPosts.filter(post => {
			const matchesSearch = !searchTerm ||
				post.title.toLowerCase().includes(searchTerm) ||
				post.excerpt.toLowerCase().includes(searchTerm) ||
				post.tags.some(tag => tag.toLowerCase().includes(searchTerm));

			const matchesCategory = !selectedCategory || post.category === selectedCategory;

			const matchesYear = !selectedYear || post.date.startsWith(selectedYear);

			return matchesSearch && matchesCategory && matchesYear;
		});

		currentPage = 1;
		renderCurrentPage();
	}

	// 更新侧边栏
	function updateSidebar() {
		updateRecentPosts();
		updateCategories();
		updateArchive();
		updateTagsCloud();
	}

	// 更新最近文章
	function updateRecentPosts() {
		const recentPostsContainer = document.getElementById('recent-posts');
		const recentPosts = blogPosts.slice(0, 5);

		recentPostsContainer.innerHTML = recentPosts.map(post => `
            <li>
                <a href="posts/${post.slug}.html">
                    <i class="fas fa-file-alt"></i>
                    ${post.title}
                </a>
            </li>
        `).join('');
	}

	// 更新分类列表
	function updateCategories() {
		const categoriesContainer = document.getElementById('categories-list');
		const categories = [...new Set(blogPosts.map(post => post.category))];

		categoriesContainer.innerHTML = categories.map(category => {
			const count = blogPosts.filter(post => post.category === category).length;
			return `
                <li>
                    <a href="#" data-category="${category}">
                        <i class="fas fa-folder"></i>
                        ${category} (${count})
                    </a>
                </li>
            `;
		}).join('');

		// 添加分类点击事件
		categoriesContainer.querySelectorAll('a').forEach(link => {
			link.addEventListener('click', (e) => {
				e.preventDefault();
				const category = e.target.dataset.category;
				categoryFilter.value = category;
				performSearch();
			});
		});
	}

	// 更新归档列表
	function updateArchive() {
		const archiveContainer = document.getElementById('archive-list');
		const years = [...new Set(blogPosts.map(post => post.date.split('-')[0]))];

		archiveContainer.innerHTML = years.map(year => {
			const count = blogPosts.filter(post => post.date.startsWith(year)).length;
			return `
                <li>
                    <a href="#" data-year="${year}">
                        <i class="fas fa-calendar-alt"></i>
                        ${year} (${count})
                    </a>
                </li>
            `;
		}).join('');

		// 添加归档点击事件
		archiveContainer.querySelectorAll('a').forEach(link => {
			link.addEventListener('click', (e) => {
				e.preventDefault();
				const year = e.target.dataset.year;
				dateFilter.value = year;
				performSearch();
			});
		});
	}

	// 更新标签云
	function updateTagsCloud() {
		const tagsContainer = document.getElementById('tags-cloud');
		const allTags = blogPosts.flatMap(post => post.tags);
		const tagCounts = {};

		allTags.forEach(tag => {
			tagCounts[tag] = (tagCounts[tag] || 0) + 1;
		});

		const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

		tagsContainer.innerHTML = sortedTags.map(([tag, count]) => {
			const size = count > 2 ? 'large' : count > 1 ? 'medium' : 'small';
			return `
                <a href="#" class="tag ${size}" data-tag="${tag}">
                    ${tag} (${count})
                </a>
            `;
		}).join('');

		// 添加标签点击事件
		tagsContainer.querySelectorAll('.tag').forEach(tag => {
			tag.addEventListener('click', (e) => {
				e.preventDefault();
				const tagName = e.target.dataset.tag;
				searchInput.value = tagName;
				performSearch();
			});
		});
	}

	// 格式化日期
	function formatDate(dateString) {
		const options = { year: 'numeric', month: 'long', day: 'numeric' };
		return new Date(dateString).toLocaleDateString('en-US', options);
	}

	// 事件监听器
	searchButton.addEventListener('click', performSearch);
	searchInput.addEventListener('keypress', (e) => {
		if (e.key === 'Enter') {
			performSearch();
		}
	});
	categoryFilter.addEventListener('change', performSearch);
	dateFilter.addEventListener('change', performSearch);

	// 初始化
	renderCurrentPage();
});
