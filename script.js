
document.addEventListener("DOMContentLoaded", function () {
  // Універсальний хелпер для нескінченних каруселей
  function setupInfiniteCarousel({
    trackSelector,
    containerSelector,
    prevSelector,
    nextSelector,
    visible = 1,
  }) {
    const track = document.querySelector(trackSelector);
    const container = document.querySelector(containerSelector);
    const prevBtn = document.querySelector(prevSelector);
    const nextBtn = document.querySelector(nextSelector);
    if (!track || !container) return;

    let slides = Array.from(track.children);
    const originalCount = slides.length;
    let currentIndex = visible; // починаємо з позиції після prepended клонів

    // клонування для нескінченного циклу
    const prependClones = slides.slice(-visible).map((n) => n.cloneNode(true));
    const appendClones = slides.slice(0, visible).map((n) => n.cloneNode(true));

    prependClones.forEach((c) => track.insertBefore(c, track.firstChild));
    appendClones.forEach((c) => track.appendChild(c));

    // актуалізуємо список слайдів
    slides = Array.from(track.children);

    function setWidths() {
      const containerWidth = container.getBoundingClientRect().width;
      const slideWidth = containerWidth / visible;
      slides.forEach((s) => {
        s.style.minWidth = slideWidth + "px";
      });
      // встановлюємо стартовий зсув
      track.style.transition = "none";
      track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
      // невелика пауза, щоб трансіція далі спрацювала коректно
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          track.style.transition = "transform 0.5s ease";
        });
      });
    }

    function moveTo(index) {
      const containerWidth = container.getBoundingClientRect().width;
      const slideWidth = containerWidth / visible;
      track.style.transform = `translateX(-${slideWidth * index}px)`;
    }

    nextBtn && nextBtn.addEventListener("click", () => {
      currentIndex++;
      moveTo(currentIndex);
    });
    prevBtn && prevBtn.addEventListener("click", () => {
      currentIndex--;
      moveTo(currentIndex);
    });

    track.addEventListener("transitionend", () => {
      // коли дійшли до клонів — миттєво переносимось назад без анімації
      const containerWidth = container.getBoundingClientRect().width;
      const slideWidth = containerWidth / visible;
      // Якщо користувач встиг клікнути кілька разів — нормалізуємо індекс циклічно
      while (currentIndex >= originalCount + visible) {
        currentIndex -= originalCount;
      }
      while (currentIndex < visible) {
        currentIndex += originalCount;
      }
      // миттєвий зсув на еквівалентну позицію без анімації
      track.style.transition = "none";
      track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
      // повертаймо анімацію після кадру
      requestAnimationFrame(() => (track.style.transition = "transform 0.5s ease"));
      // оновлюємо класи active
      updateActive();
    });

    function updateActive() {
      slides.forEach((s) => s.classList.remove("active-slide"));
      for (let i = 0; i < visible; i++) {
        const idx = currentIndex + i;
        const slide = slides[idx];
        if (slide) slide.classList.add("active-slide");
      }
    }

    // ресайз
    window.addEventListener("resize", () => {
      setWidths();
    });

    // ініціалізація
    setWidths();
    updateActive();
  }

  // Налаштовуємо бренди: показати 4 одночасно, зациклення
  setupInfiniteCarousel({
    trackSelector: ".portfolio_brands_track",
    containerSelector: ".portfolio_brands_track_container",
    prevSelector: ".portfolio_brands_arrow_prev",
    nextSelector: ".portfolio_brands_arrow_next",
    visible: 4,
  });

  // Налаштовуємо Latest Works: показати 2 одночасно, зациклення
  setupInfiniteCarousel({
    trackSelector: ".carousel_track",
    containerSelector: ".carousel_track-container",
    prevSelector: ".arrow_prev",
    nextSelector: ".arrow_next",
    visible: 2,
  });

  // Додаткові дрібні анімації: клавіші стрілок керують каруселями
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      const prev = document.querySelectorAll(".portfolio_brands_arrow_prev, .arrow_prev");
      prev.forEach((b) => b.click());
    }
    if (e.key === "ArrowRight") {
      const next = document.querySelectorAll(".portfolio_brands_arrow_next, .arrow_next");
      next.forEach((b) => b.click());
    }
  });

  // Переход до форми з усіх кнопок 'Request a quote'
  const requestButtons = document.querySelectorAll(
    ".portfolio_services_container_item_button, .portfolio__shoot-button--quote, .portfolio_about_content_button"
  );
  const formSection = document.getElementById("contact-form");
  const nameInput = document.getElementById("name");
  requestButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (!formSection) return;
      formSection.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => nameInput && nameInput.focus(), 600);
    });
  });

  // Обробник форми
  const quoteForm = document.getElementById("quoteForm");
  if (quoteForm) {
    quoteForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const sendBtn = quoteForm.querySelector(".contact_send");
      if (!sendBtn) return;
      sendBtn.disabled = true;
      sendBtn.textContent = "Sending...";
      sendBtn.classList.add("sending");
      // Імітація відправки
      setTimeout(() => {
        sendBtn.classList.remove("sending");
        sendBtn.textContent = "Sent";
        sendBtn.style.boxShadow = "0 10px 30px rgba(192,139,46,0.28)";
        // очищуємо форму через 1.5s
        setTimeout(() => {
          quoteForm.reset();
          sendBtn.textContent = "Send Request";
          sendBtn.disabled = false;
        }, 1500);
      }, 900);
    });
  }
});

