document.addEventListener("DOMContentLoaded", function () {
  // ========================================================
  // CAROUSEL SETUP - Infinite Scroll Functionality
  // ========================================================
  function setupInfiniteCarousel({
    trackSelector,
    containerSelector,
    prevSelector,
    nextSelector,
    visible = 1,
    transitionDuration = "0.5s ease",
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
          track.style.transition = `transform ${transitionDuration}`;
        });
      });
    }

    let isResetting = false;

    function moveTo(index) {
      if (isResetting) return; // Prevent clicks during reset
      const containerWidth = container.getBoundingClientRect().width;
      const slideWidth = containerWidth / visible;
      track.style.transform = `translateX(-${slideWidth * index}px)`;
    }

    nextBtn && nextBtn.addEventListener("click", () => {
      if (!isResetting) {
        currentIndex++;
        moveTo(currentIndex);
      }
    });
    prevBtn && prevBtn.addEventListener("click", () => {
      if (!isResetting) {
        currentIndex--;
        moveTo(currentIndex);
      }
    });

    track.addEventListener("transitionend", () => {
      isResetting = true;
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
      // Force reflow to apply the transform immediately
      void track.offsetHeight;
      // Use requestAnimationFrame to ensure browser renders the change
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          track.style.transition = `transform ${transitionDuration}`;
          isResetting = false;
        });
      });
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

  // ========================================================
  // BRANDS CAROUSEL INITIALIZATION - Show 4 items
  // ========================================================
  setupInfiniteCarousel({
    trackSelector: ".portfolio_brands_track",
    containerSelector: ".portfolio_brands_track_container",
    prevSelector: ".portfolio_brands_arrow_prev",
    nextSelector: ".portfolio_brands_arrow_next",
    visible: 4,
  });

  // ========================================================
  // LATEST WORKS CAROUSEL INITIALIZATION - Show 2 items
  // ========================================================
  setupInfiniteCarousel({
    trackSelector: ".carousel_track",
    containerSelector: ".carousel_track-container",
    prevSelector: ".arrow_prev",
    nextSelector: ".arrow_next",
    visible: 2,
    transitionDuration: "0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  });

  // ========================================================
  // KEYBOARD NAVIGATION - Arrow keys control carousels
  // ========================================================
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

  // ========================================================
  // ALL BUTTONS NAVIGATION HANDLERS
  // ========================================================
  
  const formSection = document.getElementById("portfolio_contact");
  const nameInput = document.getElementById("name");
  const faqSection = document.getElementById("portfolio_faq");
  const servicesSection = document.getElementById("portfolio_services");
  
  // Helper function to scroll to section and focus input if needed
  function scrollToSection(sectionId, focusInput = false) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      if (focusInput && nameInput) {
        setTimeout(() => nameInput.focus(), 600);
      }
    }
  }
  
  // Hero "Contact Ryan!" button → Contact Form
  const heroButton = document.querySelector(".portfolio_hero_info button");
  if (heroButton) {
    heroButton.addEventListener("click", (e) => {
      e.preventDefault();
      scrollToSection("portfolio_contact", true);
    });
  }
  
  // About "Learn More" button → Contact Form
  const aboutButton = document.querySelector(".portfolio_about_content_button");
  if (aboutButton) {
    aboutButton.addEventListener("click", (e) => {
      e.preventDefault();
      scrollToSection("portfolio_contact", true);
    });
  }
  
  // Services "Request a quote" buttons → Contact Form
  const serviceButtons = document.querySelectorAll(".portfolio_services_container_item_button");
  serviceButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      scrollToSection("portfolio_contact", true);
    });
  });
  
  // Let's Shoot "Request a Quote" button → Contact Form
  const shootQuoteButton = document.querySelector(".portfolio__shoot-button--quote");
  if (shootQuoteButton) {
    shootQuoteButton.addEventListener("click", (e) => {
      e.preventDefault();
      scrollToSection("portfolio_contact", true);
    });
  }
  
  // Let's Shoot "Learn More" button → Why Ryan Section
  const learnMoreButton = document.querySelector(".portfolio__shoot-button--learn");
  if (learnMoreButton) {
    learnMoreButton.addEventListener("click", (e) => {
      e.preventDefault();
      scrollToSection("portfolio_reasons");
    });
  }

  // ========================================================
  // FORM SUBMISSION HANDLER - Process quote requests
  // ========================================================
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
