// Controle de Áudio Simplificado e Eficiente
document.addEventListener('DOMContentLoaded', function () {
  // Elementos principais
  const videoBg = document.getElementById('video');
  const audioToggle = document.getElementById('audioToggle');

  // Configuração inicial
  if (videoBg && audioToggle) {
    // Inicia sempre mudo (conforme HTML)
    videoBg.muted = true;

    // Atualiza ícone inicial
    audioToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';

    // Evento de clique simplificado
    audioToggle.addEventListener('click', () => {
      videoBg.muted = !videoBg.muted;
      updateAudioIcon();
    });

    // Função para atualizar ícone
    function updateAudioIcon() {
      audioToggle.innerHTML = videoBg.muted
        ? '<i class="fas fa-volume-mute"></i>'
        : '<i class="fas fa-volume-up"></i>';
    }

    // Tenta reproduzir o vídeo
    videoBg.play().catch(e => {
      console.log("Autoplay bloqueado:", e);
    });
  }

  // Botão "Quero Começar Agora"
  const startButton = document.getElementById('startButton');
  if (startButton) {
    startButton.addEventListener('click', () => {
      const actionButtons = document.querySelector('.action-buttons');
      if (actionButtons) {
        actionButtons.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Código do Carrossel (mantido funcional)
  const carouselSlide = document.querySelector('.carousel-slide');
  if (carouselSlide) {
    const carouselItems = document.querySelectorAll('.before-after-item');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const indicators = document.querySelectorAll('.carousel-indicator');
    const carouselVideos = document.querySelectorAll('.before-after-item video');

    let counter = 0;
    const size = carouselItems[0].clientWidth;
    const totalItems = carouselItems.length;

    carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';

    function setupVideoAutoplay() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(e => console.log("Autoplay prevented:", e));
          } else {
            video.pause();
          }
        });
      }, { threshold: 0.7 });

      carouselVideos.forEach(video => {
        video.muted = true;
        video.playsInline = true;
        video.loop = true;
        observer.observe(video);
      });
    }

    // Botão próximo
    nextBtn.addEventListener('click', () => {
      if (counter >= totalItems - 1) return;
      carouselSlide.style.transition = "transform 0.5s ease-in-out";
      counter++;
      carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';
      updateIndicators();
      pauseAllVideosExceptCurrent();
    });

    // Botão anterior
    prevBtn.addEventListener('click', () => {
      if (counter <= 0) return;
      carouselSlide.style.transition = "transform 0.5s ease-in-out";
      counter--;
      carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';
      updateIndicators();
      pauseAllVideosExceptCurrent();
    });

    function pauseAllVideosExceptCurrent() {
      carouselVideos.forEach((video, index) => {
        if (index === counter * 2 || index === counter * 2 + 1) {
          video.play().catch(e => console.log("Play prevented:", e));
        } else {
          video.pause();
        }
      });
    }

    function updateIndicators() {
      indicators.forEach((indicator, index) => {
        if (index === counter) {
          indicator.classList.add('active');
        } else {
          indicator.classList.remove('active');
        }
      });
    }

    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        carouselSlide.style.transition = "transform 0.5s ease-in-out";
        counter = index;
        carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';
        updateIndicators();
        pauseAllVideosExceptCurrent();
      });
    });

    setupVideoAutoplay();

    let carouselAutoplay = setInterval(() => {
      if (counter >= totalItems - 1) counter = -1;
      carouselSlide.style.transition = "transform 0.5s ease-in-out";
      counter++;
      carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';
      updateIndicators();
      pauseAllVideosExceptCurrent();
    }, 8000);

    carouselSlide.addEventListener('mouseenter', () => {
      clearInterval(carouselAutoplay);
    });

    carouselSlide.addEventListener('mouseleave', () => {
      carouselAutoplay = setInterval(() => {
        if (counter >= totalItems - 1) counter = -1;
        carouselSlide.style.transition = "transform 0.5s ease-in-out";
        counter++;
        carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';
        updateIndicators();
        pauseAllVideosExceptCurrent();
      }, 9000);
    });
  }
});

