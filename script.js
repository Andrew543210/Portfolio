
document.addEventListener("DOMContentLoaded", function () {
  const track = document.querySelector(".portfolio_brands_track");
  const slides = Array.from(track.children);
  const nextButton = document.querySelector(".portfolio_brands_arrow_next");
  const prevButton = document.querySelector(".portfolio_brands_arrow_prev");

  let currentIndex = 0;
  const slideWidth = slides[0].getBoundingClientRect().width;

  // Розставляємо позиції слайдів
  slides.forEach((slide, index) => {
    slide.style.left = slideWidth * index + "px";
  });

  function moveToSlide(index) {
    track.style.transform = `translateX(-${slideWidth * index}px)`;
  }

  nextButton.addEventListener("click", () => {
    currentIndex++;
    if (currentIndex >= slides.length) currentIndex = 0; // зациклення
    moveToSlide(currentIndex);
  });

  prevButton.addEventListener("click", () => {
    currentIndex--;
    if (currentIndex < 0) currentIndex = slides.length - 1; // зациклення
    moveToSlide(currentIndex);
  });

  // Щоб коректно перерахувати при зміні розміру вікна
  window.addEventListener("resize", () => {
    const newWidth = slides[0].getBoundingClientRect().width;
    slides.forEach((slide, index) => {
      slide.style.left = newWidth * index + "px";
    });
    track.style.transition = "none"; // щоб не було ривка
    track.style.transform = `translateX(-${newWidth * currentIndex}px)`;
    setTimeout(() => (track.style.transition = "transform 0.4s ease-in-out"), 100);
  });
});

