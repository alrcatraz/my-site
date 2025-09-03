document.addEventListener('DOMContentLoaded', function () {
	// 导航tab指示器功能
	const navLinks = document.querySelectorAll('nav a[href^="#"], nav a:not([href^="#"])');
	const navUl = document.querySelector('nav ul');

	// 创建tab指示器
	if (navUl) {
		const tabIndicator = document.createElement('div');
		tabIndicator.className = 'nav-tab-indicator';
		navUl.appendChild(tabIndicator);

		// 更新tab位置和大小
		function updateTabPosition(targetLink) {
			if (!targetLink) return;

			const linkRect = targetLink.getBoundingClientRect();
			const navRect = navUl.getBoundingClientRect();

			// 计算相对于navUl的位置
			const left = linkRect.left - navRect.left;
			const width = linkRect.width;

			// 设置CSS变量
			tabIndicator.style.setProperty('--nav-tab-width', width + 'px');
			tabIndicator.style.left = left + 'px';
			tabIndicator.style.width = width + 'px';
		}

		// 激活特定链接
		function activateLink(targetLink) {
			// 移除所有active类
			navLinks.forEach(link => link.classList.remove('active'));

			// 添加active类到目标链接
			if (targetLink) {
				targetLink.classList.add('active');
				updateTabPosition(targetLink);
				tabIndicator.classList.add('active');
			} else {
				tabIndicator.classList.remove('active');
			}
		}

		// 鼠标悬停效果
		navLinks.forEach(link => {
			link.addEventListener('mouseenter', function () {
				updateTabPosition(this);
			});
		});

		// 鼠标离开导航区域时恢复到激活状态
		navUl.addEventListener('mouseleave', function () {
			const activeLink = document.querySelector('nav a.active');
			if (activeLink) {
				updateTabPosition(activeLink);
			} else {
				tabIndicator.classList.remove('active');
			}
		});

		// 点击链接时激活
		navLinks.forEach(link => {
			link.addEventListener('click', function (e) {
				// 如果是外部链接或页面跳转，不阻止默认行为
				if (this.getAttribute('href').startsWith('#') || this.getAttribute('href').includes('.html')) {
					// 对于页面内锚点，阻止默认行为并平滑滚动
					if (this.getAttribute('href').startsWith('#')) {
						e.preventDefault();
						activateLink(this);

						const target = document.querySelector(this.getAttribute('href'));
						if (target) {
							target.scrollIntoView({
								behavior: 'smooth',
								block: 'start'
							});
						}
					} else {
						// 对于页面跳转，激活链接
						activateLink(this);
					}
				}
			});
		});

		// 初始化时设置激活状态
		const currentPath = window.location.pathname;
		const currentPage = currentPath.split('/').pop() || 'index.html';

		navLinks.forEach(link => {
			const linkPath = link.getAttribute('href');
			if (linkPath === currentPage ||
				(currentPage === 'index.html' && linkPath === 'index.html') ||
				(currentPage === '' && linkPath === 'index.html')) {
				activateLink(link);
			}
		});
	}

	// 滚动时更新激活状态（仅对单页应用）
	if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
		function updateActiveNavOnScroll() {
			const sections = document.querySelectorAll('section[id]');
			const scrollPosition = window.pageYOffset + 150;

			let currentSection = null;

			sections.forEach(section => {
				const sectionTop = section.offsetTop;
				const sectionHeight = section.offsetHeight;

				if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
					currentSection = section;
				}
			});

			if (currentSection) {
				const correspondingLink = document.querySelector(`nav a[href="#${currentSection.id}"]`);
				if (correspondingLink) {
					activateLink(correspondingLink);
				}
			}
		}

		// 滚动事件监听
		let scrollTimeout;
		window.addEventListener('scroll', function () {
			clearTimeout(scrollTimeout);
			scrollTimeout = setTimeout(updateActiveNavOnScroll, 10);
		});
	}

	// 导航栏滚动效果
	let lastScroll = 0;
	const header = document.querySelector('header');

	window.addEventListener('scroll', function () {
		const currentScroll = window.pageYOffset;

		if (currentScroll > 100) {
			header.style.background = 'rgba(102, 126, 234, 0.95)';
			header.style.backdropFilter = 'blur(15px)';
			header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
		} else {
			header.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
			header.style.backdropFilter = 'blur(10px)';
			header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
		}

		// 隐藏/显示导航栏
		if (currentScroll > lastScroll && currentScroll > 300) {
			header.style.transform = 'translateY(-100%)';
		} else {
			header.style.transform = 'translateY(0)';
		}

		lastScroll = currentScroll;
	});

	// CTA按钮点击事件
	const ctaButton = document.querySelector('.cta-button');
	if (ctaButton) {
		ctaButton.addEventListener('click', function () {
			const target = this.getAttribute('onclick')?.match(/scrollToSection\('([^']+)'\)/);
			if (target && target[1]) {
				document.querySelector(`#${target[1]}`).scrollIntoView({
					behavior: 'smooth'
				});
			}
		});
	}

	// 滚动到指定部分的函数
	window.scrollToSection = function(sectionId) {
		const section = document.querySelector(`#${sectionId}`);
		if (section) {
			section.scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});
		}
	};

	// 项目卡片动画
	const observerOptions = {
		threshold: 0.1,
		rootMargin: '0px 0px -50px 0px'
	};

	const observer = new IntersectionObserver(function (entries) {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.style.opacity = '1';
				entry.target.style.transform = 'translateY(0)';
			}
		});
	}, observerOptions);

	// 观察所有需要动画的元素
	const animatedElements = document.querySelectorAll('.project-card, .about-card, .contact-item, .article-card');
	animatedElements.forEach(element => {
		element.style.opacity = '0';
		element.style.transform = 'translateY(30px)';
		element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
		observer.observe(element);
	});

	// 鼠标跟随效果
	const hero = document.querySelector('.hero');
	if (hero) {
		hero.addEventListener('mousemove', function (e) {
			const rect = hero.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			const centerX = rect.width / 2;
			const centerY = rect.height / 2;

			const deltaX = (x - centerX) / centerX;
			const deltaY = (y - centerY) / centerY;

			hero.style.background = `
				radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
				linear-gradient(135deg, #667eea 0%, #764ba2 100%)
			`;
		});

		hero.addEventListener('mouseleave', function () {
			hero.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
		});
	}

	// 添加打字机效果到标题
	const heroTitle = document.querySelector('.hero h2');
	if (heroTitle) {
		const originalText = heroTitle.textContent;
		heroTitle.textContent = '';
		let charIndex = 0;

		function typeWriter() {
			if (charIndex < originalText.length) {
				heroTitle.textContent += originalText.charAt(charIndex);
				charIndex++;
				setTimeout(typeWriter, 100);
			}
		}

		setTimeout(typeWriter, 500);
	}

	// 添加滚动进度指示器
	const progressBar = document.createElement('div');
	progressBar.style.cssText = `
		position: fixed;
		top: 0;
		left: 0;
		width: 0%;
		height: 3px;
		background: linear-gradient(90deg, #667eea, #764ba2);
		z-index: 1001;
		transition: width 0.3s ease;
	`;
	document.body.appendChild(progressBar);

	window.addEventListener('scroll', function () {
		const scrollTop = window.pageYOffset;
		const docHeight = document.body.scrollHeight - window.innerHeight;
		const scrollPercent = (scrollTop / docHeight) * 100;
		progressBar.style.width = scrollPercent + '%';
	});

	// 添加页面加载动画
	window.addEventListener('load', function () {
		document.body.style.opacity = '0';
		document.body.style.transition = 'opacity 0.5s ease';

		setTimeout(() => {
			document.body.style.opacity = '1';
		}, 100);
	});

	// 添加键盘导航支持（仅对单页应用）
	if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
		document.addEventListener('keydown', function (e) {
			const sections = ['home', 'about', 'recent-projects', 'contact'];
			const currentSection = getCurrentSection();
			const currentIndex = sections.indexOf(currentSection);

			if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
				e.preventDefault();
				const nextLink = document.querySelector(`nav a[href="#${sections[currentIndex + 1]}"]`);
				if (nextLink) {
					nextLink.click();
				}
			} else if (e.key === 'ArrowUp' && currentIndex > 0) {
				e.preventDefault();
				const prevLink = document.querySelector(`nav a[href="#${sections[currentIndex - 1]}"]`);
				if (prevLink) {
					prevLink.click();
				}
			}
		});

		function getCurrentSection() {
			const scrollPosition = window.pageYOffset + 100;
			const sections = document.querySelectorAll('section[id]');

			for (let section of sections) {
				const sectionTop = section.offsetTop;
				const sectionHeight = section.offsetHeight;

				if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
					return section.id;
				}
			}
			return 'home';
		}
	}

	// 添加复制功能到联系信息
	const contactLinks = document.querySelectorAll('.contact-link');
	contactLinks.forEach(link => {
		link.addEventListener('click', function (e) {
			// 如果是邮件链接，不阻止默认行为
			if (this.href.startsWith('mailto:')) {
				return;
			}

			// 对于其他链接，可以添加复制功能
			const textToCopy = this.querySelector('.contact-text p').textContent;

			if (navigator.clipboard) {
				navigator.clipboard.writeText(textToCopy).then(() => {
					showNotification('已复制到剪贴板: ' + textToCopy);
				});
			}
		});
	});

	// 通知函数
	window.showNotification = function(message) {
		const notification = document.createElement('div');
		notification.style.cssText = `
			position: fixed;
			top: 100px;
			right: 20px;
			background: linear-gradient(135deg, #667eea, #764ba2);
			color: white;
			padding: 1rem 1.5rem;
			border-radius: 10px;
			box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
			z-index: 1002;
			transform: translateX(100%);
			transition: transform 0.3s ease;
			max-width: 300px;
			font-size: 0.9rem;
		`;
		notification.textContent = message;
		document.body.appendChild(notification);

		// 显示通知
		setTimeout(() => {
			notification.style.transform = 'translateX(0)';
		}, 100);

		// 3秒后隐藏通知
		setTimeout(() => {
			notification.style.transform = 'translateX(100%)';
			setTimeout(() => {
				if (document.body.contains(notification)) {
					document.body.removeChild(notification);
				}
			}, 300);
		}, 3000);
	};
});
