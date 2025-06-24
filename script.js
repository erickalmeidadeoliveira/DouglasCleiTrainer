// Controle de Áudio do Vídeo de Fundo - Versão Mobile Otimizada
const video = document.getElementById('video');
const audioToggle = document.getElementById('audioToggle');

// Verifica se é mobile
const isMobile = /Mobi|Android/i.test(navigator.userAgent);

// Configurações iniciais
function setupVideo() {
  // Configurações para mobile
  if (isMobile) {
    video.muted = true; // Necessário para autoplay em mobile
    audioToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
  }

  // Tenta iniciar o vídeo automaticamente
  video.play().catch(e => {
    console.log("Autoplay bloqueado:", e);
    audioToggle.innerHTML = '<i class="fas fa-play"></i>';
  });

  audioToggle.style.display = 'block';
}

// Atualiza o ícone do áudio
function updateAudioIcon() {
  if (video.paused) {
    audioToggle.innerHTML = '<i class="fas fa-play"></i>';
  } else if (video.muted) {
    audioToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
  } else {
    audioToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
  }
}

// Controle de clique no botão de áudio
audioToggle.addEventListener('click', () => {
  if (video.paused) {
    video.play().then(() => {
      if (isMobile) {
        video.muted = false; // Tenta desmutar após interação
      }
      updateAudioIcon();
    }).catch(e => console.log("Erro ao reproduzir:", e));
  } else {
    if (video.muted) {
      video.muted = false;
    } else {
      video.muted = true;
    }
    updateAudioIcon();
  }
});

// Inicia quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function () {
  setupVideo();

  // Para mobile: tenta autoplay após a primeira interação
  if (isMobile) {
    document.addEventListener('click', function initVideo() {
      video.play().catch(e => console.log("Autoplay ainda bloqueado:", e));
    }, { once: true });
  }
});

// Tentar novamente quando a orientação mudar (mobile)
window.addEventListener('orientationchange', function () {
  if (isMobile) {
    video.play().catch(e => console.log("Autoplay após mudança de orientação:", e));
  }
});

// Código do carrossel (mantido igual)
document.addEventListener('DOMContentLoaded', function () {
  const carouselSlide = document.querySelector('.carousel-slide');
  const carouselItems = document.querySelectorAll('.before-after-item');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const indicators = document.querySelectorAll('.carousel-indicator');
  const carouselVideos = document.querySelectorAll('.before-after-item video');

  let counter = 0;
  const size = carouselItems[0].clientWidth;
  const totalItems = carouselItems.length;

  // Posiciona o carrossel corretamente
  carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';

  // Configura autoplay para vídeos do carrossel
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

  // Pausa todos os vídeos exceto o atual
  function pauseAllVideosExceptCurrent() {
    carouselVideos.forEach((video, index) => {
      if (index === counter * 2 || index === counter * 2 + 1) {
        video.play().catch(e => console.log("Play prevented:", e));
      } else {
        video.pause();
      }
    });
  }

  // Loop infinito quando chega ao final
  carouselSlide.addEventListener('transitionend', () => {
    if (carouselItems[counter].id === 'lastClone') {
      carouselSlide.style.transition = "none";
      counter = totalItems - 2;
      carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';
    }
    if (carouselItems[counter].id === 'firstClone') {
      carouselSlide.style.transition = "none";
      counter = totalItems - counter;
      carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';
    }
  });

  // Atualiza os indicadores
  function updateIndicators() {
    indicators.forEach((indicator, index) => {
      if (index === counter) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }

  // Clique nos indicadores
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      carouselSlide.style.transition = "transform 0.5s ease-in-out";
      counter = index;
      carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';
      updateIndicators();
      pauseAllVideosExceptCurrent();
    });
  });

  // Inicia o autoplay dos vídeos
  setupVideoAutoplay();

  // Autoplay do carrossel (opcional)
  let carouselAutoplay = setInterval(() => {
    if (counter >= totalItems - 1) counter = -1;
    carouselSlide.style.transition = "transform 0.5s ease-in-out";
    counter++;
    carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';
    updateIndicators();
    pauseAllVideosExceptCurrent();
  }, 8000);

  // Pausa o autoplay quando o mouse está sobre o carrossel
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
});

// Disparar autoplay no primeiro toque (para alguns navegadores mobile)
document.addEventListener('touchstart', function () {
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    video.play().catch(e => console.log("Autoplay prevented:", e));
  });
}, { once: true });