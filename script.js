document.addEventListener('DOMContentLoaded', () => {
  // Slideshow
  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  if (slides.length > 0) {
    showSlide(currentSlide);
    setInterval(nextSlide, 5000);
  }

  // 折叠区块
  const toggles = document.querySelectorAll('.section-toggle');
  toggles.forEach(toggle => {
    if (!toggle.hasAttribute('aria-expanded')) {
      toggle.setAttribute('aria-expanded', 'false');
    }
    toggle.addEventListener('click', () => {
      const contentId = toggle.getAttribute('aria-controls');
      const content = document.getElementById(contentId);
      if (content) {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!isExpanded));
        if (isExpanded) {
          content.setAttribute('hidden', '');
        } else {
          content.removeAttribute('hidden');
        }
      }
    });
  });

  // 手机端自动收起证书区
  if (window.innerWidth < 900) {
    const certToggle = document.querySelector('#certificates .section-toggle');
    const certContent = document.getElementById('certificates-content');
    if (certToggle && certContent) {
      certToggle.setAttribute('aria-expanded', 'false');
      certContent.setAttribute('hidden', '');
    }
  }

  // 多个 Experience gallery 支持（每个都能左右轮播）
  document.querySelectorAll('.experience-gallery').forEach(gallery => {
    const imgs = gallery.querySelectorAll('img');
    const leftBtn = gallery.querySelector('.arrow-left');
    const rightBtn = gallery.querySelector('.arrow-right');
    let idx = 0;

    // 确保有一张是 .active
    let foundActive = false;
    imgs.forEach((img, i) => {
      if (img.classList.contains('active')) {
        idx = i;
        foundActive = true;
      }
    });
    if (!foundActive && imgs.length > 0) {
      imgs[0].classList.add('active');
      idx = 0;
    }

    function show(idxNow) {
      imgs.forEach((img, i) => img.classList.toggle('active', i === idxNow));
    }
    show(idx);

    if (leftBtn && rightBtn) {
      leftBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        idx = (idx - 1 + imgs.length) % imgs.length;
        show(idx);
      });
      rightBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        idx = (idx + 1) % imgs.length;
        show(idx);
      });
    }
  });

  // 回到顶部按钮
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.style.display = 'block';
      } else {
        backToTopBtn.style.display = 'none';
      }
    });

    // 初始化隐藏/显示状态
    backToTopBtn.style.display = window.pageYOffset > 300 ? 'block' : 'none';
  }

  // 图片加载错误处理
  document.querySelectorAll('img').forEach(img => {
    if (!img.complete) {
      img.addEventListener('error', () => {
        console.error(`图片加载失败: ${img.src}`);
        // 可以设置默认图片: img.src = 'default.png';
      });
    }
  });

  // ===== 互動性設計 =====

  // 技能卡片點擊彈窗
  document.querySelectorAll('#skills .card').forEach(card => {
    card.addEventListener('click', function() {
      const title = card.querySelector('h3')?.textContent || '';
      const detail = card.querySelector('p')?.textContent || '';
      showSkillModal(title, detail);
    });
  });

  function showSkillModal(title, detail) {
    let modal = document.getElementById('skill-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'skill-modal';
      modal.innerHTML = `
        <div class="modal-bg"></div>
        <div class="modal-content">
          <span class="modal-close" tabindex="0">&times;</span>
          <h2></h2>
          <p></p>
        </div>`;
      document.body.appendChild(modal);
      // 關閉
      modal.querySelector('.modal-close').onclick = closeSkillModal;
      modal.querySelector('.modal-bg').onclick = closeSkillModal;
      // 鍵盤Esc關閉
      document.addEventListener('keydown', e => {
        if (modal.style.display === "flex" && (e.key === "Escape" || e.key === "Esc")) closeSkillModal();
      });
    }
    modal.querySelector('h2').textContent = title;
    modal.querySelector('p').textContent = detail;
    modal.style.display = 'flex';
  }
  function closeSkillModal() {
    let modal = document.getElementById('skill-modal');
    if (modal) modal.style.display = 'none';
  }

  // 證書圖片點擊全螢幕預覽
  document.querySelectorAll('#certificates .card img').forEach(img => {
    img.addEventListener('click', function(e) {
      showImageModal(img.src, img.alt);
    });
  });

  function showImageModal(src, alt) {
    let modal = document.getElementById('image-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'image-modal';
      modal.innerHTML = `
        <div class="modal-bg"></div>
        <img class="modal-img" alt="">
        <span class="modal-close">&times;</span>
      `;
      document.body.appendChild(modal);
      modal.querySelector('.modal-bg').onclick = closeImageModal;
      modal.querySelector('.modal-close').onclick = closeImageModal;
      document.addEventListener('keydown', e => {
        if (modal.style.display === "flex" && (e.key === "Escape" || e.key === "Esc")) closeImageModal();
      });
    }
    modal.querySelector('.modal-img').src = src;
    modal.querySelector('.modal-img').alt = alt;
    modal.style.display = 'flex';
  }
  function closeImageModal() {
    let modal = document.getElementById('image-modal');
    if (modal) modal.style.display = 'none';
  }
});