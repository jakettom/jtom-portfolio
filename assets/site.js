/* =====================================================
   Jacob Tom Portfolio
   Shared JavaScript
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector("#menuToggle, .menu-toggle");
  const sidebar = document.querySelector("#sidebar, .sidebar");
  const overlay = document.querySelector("#mobileOverlay, .mobile-overlay");
  const content = document.querySelector(".content");

  function closeMenu() {
    if (!sidebar) return;

    sidebar.classList.remove("active");
    overlay?.classList.remove("active");
    content?.classList.remove("shifted");

    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open menu");
  }

  function toggleMenu() {
    if (!sidebar) return;

    const isOpen = sidebar.classList.toggle("active");

    overlay?.classList.toggle("active", isOpen);
    content?.classList.toggle("shifted", isOpen);

    menuToggle?.setAttribute("aria-expanded", String(isOpen));
    menuToggle?.setAttribute(
      "aria-label",
      isOpen ? "Close menu" : "Open menu"
    );
  }

  menuToggle?.addEventListener("click", toggleMenu);
  overlay?.addEventListener("click", closeMenu);

  document.querySelectorAll(".sidebar a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 767) {
        closeMenu();
      }
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 767) {
      closeMenu();
    }
  });

  /* ---------------------------------
     Reveal sections on scroll
  --------------------------------- */

  const sections = document.querySelectorAll(".section");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  } else {
    sections.forEach((section) => section.classList.add("visible"));
  }

  /* ---------------------------------
     Expandable work experience cards
  --------------------------------- */

  window.toggleDescription = function (item) {
    item.classList.toggle("active");
  };

  document.querySelectorAll(".work-experience-item").forEach((item) => {
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
    item.setAttribute("aria-expanded", "false");

    item.addEventListener("click", () => {
      const isActive = item.classList.toggle("active");
      item.setAttribute("aria-expanded", String(isActive));
    });

    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();

        const isActive = item.classList.toggle("active");
        item.setAttribute("aria-expanded", String(isActive));
      }
    });
  });

  /* ---------------------------------
     Image lightbox
  --------------------------------- */

  const lightbox = document.querySelector("#lightbox");
  const lightboxImg = document.querySelector("#lightboxImg");
  const lightboxIframe = document.querySelector("#lightboxIframe");
  const closeButton = document.querySelector("#lbCloseBtn");
  const previousButton = document.querySelector("#lbPrevBtn");
  const nextButton = document.querySelector("#lbNextBtn");

  const galleryImages = Array.from(
    document.querySelectorAll(".img-wrapper img")
  );

  let currentIndex = -1;

  function showLightboxImage(index) {
    if (!galleryImages.length) return;

    currentIndex =
      (index + galleryImages.length) % galleryImages.length;

    const image = galleryImages[currentIndex];

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");

    lightboxImg.src = image.src;
    lightboxImg.alt = image.alt || "Expanded project image";
    lightboxImg.style.display = "block";

    if (lightboxIframe) {
      lightboxIframe.src = "";
      lightboxIframe.style.display = "none";
    }

    if (previousButton) previousButton.style.display = "inline-flex";
    if (nextButton) nextButton.style.display = "inline-flex";

    document.body.style.overflow = "hidden";
    closeButton?.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;

    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");

    if (lightboxImg) {
      lightboxImg.src = "";
      lightboxImg.style.display = "none";
    }

    if (lightboxIframe) {
      lightboxIframe.src = "";
      lightboxIframe.style.display = "none";
    }

    document.body.style.overflow = "";
  }

  function changeSlide(direction) {
    if (currentIndex < 0) return;
    showLightboxImage(currentIndex + direction);
  }

  galleryImages.forEach((image, index) => {
    image.parentElement.addEventListener("click", () => {
      showLightboxImage(index);
    });
  });

  closeButton?.addEventListener("click", closeLightbox);
  previousButton?.addEventListener("click", () => changeSlide(-1));
  nextButton?.addEventListener("click", () => changeSlide(1));

  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox?.classList.contains("open")) return;

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowLeft") {
      changeSlide(-1);
    }

    if (event.key === "ArrowRight") {
      changeSlide(1);
    }
  });
});