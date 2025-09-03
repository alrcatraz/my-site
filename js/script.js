document.addEventListener('DOMContentLoaded', function () {
	// 平滑滚动
	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', function (e) {
			e.preventDefault();
			const target = document.querySelector(this.getAttribute('href'));
			if (target) {
				target.scrollIntoView({
					behavior: 'smooth',
					block: 'start'
				});
			}
		});
	});

	// CTA按钮点击事件
	const ctaButton = document.querySelector('.cta-button');
	if (ctaButton) {
		ctaButton.addEventListener('click', function () {
			document.querySelector('#about').scrollIntoView({
				behavior: 'smooth'
			});
		});
	}

	// 导航栏滚动效果
	let lastScroll = 0;
	window.addEventListener('scroll', function () {
		const currentScroll = window.pageYOffset;
		const header = document.querySelector('header');

		if (currentScroll > 100) {
			header.style.background = 'rgba(102, 126, 234, 0.95)';
			header.style.backdropFilter = 'blur(10px)';
		} else {
			header.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
			header.style.backdropFilter = 'none';
		}

		lastScroll = currentScroll;
	});

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

	// 观察所有项目卡片
	document.querySelectorAll('.project-card').forEach(card => {
		card.style.opacity = '0';
		card.style.transform = 'translateY(20px)';
		card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
		observer.observe(card);
	});
});
