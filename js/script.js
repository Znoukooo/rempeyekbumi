/* ==========================================================================
   SCRIPT.JS - Rempeyek Bumi
   ========================================================================= */

document.addEventListener("DOMContentLoaded", () => {
    // === 1. Preloader ===
    const preloader = document.getElementById("preloader");
    if (preloader) {
        window.addEventListener("load", () => {
            preloader.style.opacity = "0";
            preloader.style.visibility = "hidden";
        });
        // Fallback to remove preloader after 3 seconds in case window load doesn't fire immediately
        setTimeout(() => {
            preloader.style.opacity = "0";
            preloader.style.visibility = "hidden";
        }, 3000);
    }

    // === 2. Scroll Progress Bar ===
    const progressBar = document.querySelector(".scroll-progress-bar");
    if (progressBar) {
        window.addEventListener("scroll", () => {
            const windowScroll = document.documentElement.scrollTop || document.body.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (windowScroll / height) * 100;
            progressBar.style.width = scrolled + "%";
        });
    }

    // === 3. Sticky Navbar & Back to Top Toggle ===
    const navbar = document.querySelector(".navbar");
    const backToTopBtn = document.querySelector(".back-to-top");
    const stickyOrderBar = document.querySelector(".sticky-order-bar");

    window.addEventListener("scroll", () => {
        const scrollPos = window.scrollY;

        // Sticky Navbar
        if (navbar) {
            if (scrollPos > 50) {
                navbar.classList.add("navbar-scrolled");
            } else {
                navbar.classList.remove("navbar-scrolled");
            }
        }

        // Back to Top Button
        if (backToTopBtn) {
            if (scrollPos > 400) {
                backToTopBtn.classList.add("active");
            } else {
                backToTopBtn.classList.remove("active");
            }
        }

        // Sticky Order Bar (Show after scrolling past hero section, only on product page or homepage)
        if (stickyOrderBar) {
            if (scrollPos > 500) {
                stickyOrderBar.classList.add("active");
            } else {
                stickyOrderBar.classList.remove("active");
            }
        }
    });

    // Smooth scroll for Back to Top Button
    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // === 4. Active Navigation Page Highlighter ===
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
    navLinks.forEach(link => {
        const linkHref = link.getAttribute("href");
        if (currentPath.includes(linkHref) && linkHref !== "index.html") {
            link.classList.add("active");
        } else if (currentPath.endsWith("/") || currentPath.includes("index.html")) {
            if (linkHref === "index.html") {
                link.classList.add("active");
            }
        }
    });

    // === 5. Dark Mode Toggle ===
    const themeToggleBtn = document.getElementById("themeToggle");
    if (themeToggleBtn) {
        // Check local storage for theme preference
        const currentTheme = localStorage.getItem("theme");
        if (currentTheme === "dark") {
            document.body.classList.add("dark-theme");
            updateThemeIcon(true);
        } else {
            updateThemeIcon(false);
        }

        themeToggleBtn.addEventListener("click", () => {
            document.body.classList.toggle("dark-theme");
            const isDark = document.body.classList.contains("dark-theme");
            localStorage.setItem("theme", isDark ? "dark" : "light");
            updateThemeIcon(isDark);
            
            // showToast(
            //     isDark ? "Dark Mode Aktif" : "Light Mode Aktif",
            //     isDark ? "Nuansa malam yang ramah mata berhasil diaktifkan." : "Nuansa segar terang berhasil diaktifkan.",
            //     "success"
            // );
        });
    }

    function updateThemeIcon(isDark) {
        const icon = themeToggleBtn.querySelector("i");
        if (icon) {
            if (isDark) {
                icon.className = "bi bi-sun-fill";
            } else {
                icon.className = "bi bi-moon-stars-fill";
            }
        }
    }

    // === 6. Toast Notification System ===
    function showToast(title, message, type = "success") {
        const container = document.getElementById("toastContainer");
        if (!container) return;

        const toastId = "toast-" + Date.now();
        const iconClass = type === "success" ? "bi-check-circle-fill text-success" : "bi-exclamation-triangle-fill text-danger";
        const borderClass = type === "success" ? "toast-success" : "toast-error";

        const toastHtml = `
            <div id="${toastId}" class="toast toast-custom ${borderClass}" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="4000">
                <div class="toast-header border-0 bg-transparent">
                    <i class="bi ${iconClass} me-2 fs-5"></i>
                    <strong class="me-auto text-dark dark-text-light">${title}</strong>
                    <small class="text-muted">Baru saja</small>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body pt-0 pb-3">
                    ${message}
                </div>
            </div>
        `;

        container.insertAdjacentHTML("beforeend", toastHtml);
        const toastElement = document.getElementById(toastId);
        
        // Initialize bootstrap toast
        if (window.bootstrap && window.bootstrap.Toast) {
            const bsToast = new bootstrap.Toast(toastElement);
            bsToast.show();
            
            // Remove element from DOM after toast is hidden
            toastElement.addEventListener("hidden.bs.toast", () => {
                toastElement.remove();
            });
        }
    }

    // === 7. Counter Animation (Stats) ===
    const statsNumbers = document.querySelectorAll(".stats-number");
    if (statsNumbers.length > 0) {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: "0px"
        };

        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const endValue = parseInt(target.getAttribute("data-count"), 10);
                    animateCounter(target, endValue);
                    counterObserver.unobserve(target);
                }
            });
        }, observerOptions);

        statsNumbers.forEach(num => counterObserver.observe(num));
    }

    function animateCounter(element, end) {
        let start = 0;
        const duration = 2000; // 2 seconds animation
        const stepTime = Math.abs(Math.floor(duration / end));
        
        // Ensure steps aren't too fast/slow
        const step = end > 100 ? Math.ceil(end / 100) : 1;
        const timer = setInterval(() => {
            start += step;
            if (start >= end) {
                clearInterval(timer);
                element.textContent = formatStatNumber(end, element.getAttribute("data-suffix") || "");
            } else {
                element.textContent = formatStatNumber(start, element.getAttribute("data-suffix") || "");
            }
        }, Math.max(stepTime, 15));
    }

    function formatStatNumber(num, suffix) {
        return num.toLocaleString() + suffix;
    }

    // === 8. Fade-Up Intersection Observer (Scroll Animations) ===
    const fadeUpElements = document.querySelectorAll(".fade-up-element");
    if (fadeUpElements.length > 0) {
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animated");
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        fadeUpElements.forEach(el => fadeObserver.observe(el));
    }

    // === 9. Product Search and Filter Logic ===
    const productSearchInput = document.getElementById("productSearch");
    const filterButtons = document.querySelectorAll(".product-filter-btn");
    const productCols = document.querySelectorAll(".product-col");

    // Search function
    if (productSearchInput) {
        productSearchInput.addEventListener("input", filterProducts);
    }

    // Filter Badges
    filterButtons.forEach(btn => {
        btn.addEventListener("click", function() {
            filterButtons.forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            filterProducts();
        });
    });

    function filterProducts() {
        const query = productSearchInput ? productSearchInput.value.toLowerCase().trim() : "";
        const activeFilterBtn = document.querySelector(".product-filter-btn.active");
        const category = activeFilterBtn ? activeFilterBtn.getAttribute("data-filter") : "all";

        productCols.forEach(col => {
            const card = col.querySelector(".product-card");
            const title = card.querySelector(".product-title").textContent.toLowerCase();
            const desc = card.querySelector(".product-desc").textContent.toLowerCase();
            const prodCategory = card.getAttribute("data-category");

            const matchesQuery = title.includes(query) || desc.includes(query);
            const matchesCategory = category === "all" || prodCategory === category;

            if (matchesQuery && matchesCategory) {
                col.style.display = "block";
                // Trigger reflow/animation
                col.style.opacity = "0";
                setTimeout(() => {
                    col.style.transition = "opacity 0.4s ease";
                    col.style.opacity = "1";
                }, 50);
            } else {
                col.style.display = "none";
            }
        });

        // Show "No products found" if all display are none
        const noProductMsg = document.getElementById("noProductsMessage");
        if (noProductMsg) {
            const anyVisible = Array.from(productCols).some(col => col.style.display !== "none");
            noProductMsg.style.display = anyVisible ? "none" : "block";
        }
    }

    // === 10. Form Submissions (Contact & Newsletter) ===
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // Basic Bootstrap validation styling
            if (!contactForm.checkValidity()) {
                e.stopPropagation();
                contactForm.classList.add("was-validated");
                return;
            }

            const name = document.getElementById("contactName").value;
            showToast(
                "Pesan Terkirim!",
                `Terima kasih <strong>${name}</strong>, pesan Anda telah kami terima. Kami akan segera menghubungi Anda kembali!`,
                "success"
            );
            contactForm.reset();
            contactForm.classList.remove("was-validated");
        });
    }

    const newsletterForm = document.getElementById("newsletterForm");
    if (newsletterForm) {
        newsletterForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector("input[type='email']");
            if (emailInput && emailInput.value) {
                showToast(
                    "Berlangganan Berhasil!",
                    `Email <strong>${emailInput.value}</strong> berhasil terdaftar dalam newsletter Zero Waste kami.`,
                    "success"
                );
                newsletterForm.reset();
            }
        });
    }

    // === 11. WhatsApp Order Handler ===
    // This intercepts detail button orders or floating button order triggers
    window.orderProductViaWhatsApp = function(productName, price) {
        const phoneNumber = "6281234567890"; // Dummy green-business WA phone number
        const textTemplate = `Halo Rempeyek Bumi 🍃\nSaya tertarik dengan produk *${productName}* (Harga: ${price}).\nMohon informasi cara pemesanan dan pengirimannya. Terima kasih!`;
        const encodedText = encodeURIComponent(textTemplate);
        const waUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
        window.open(waUrl, "_blank");

        showToast(
            "Mengarahkan ke WhatsApp",
            `Membuka chat WhatsApp untuk memesan <strong>${productName}</strong>.`,
            "success"
        );
    };

    // Quick Newsletter bottom bar or modal order trigger
    const stickyOrderBtn = document.getElementById("stickyOrderBtn");
    if (stickyOrderBtn) {
        stickyOrderBtn.addEventListener("click", () => {
            orderProductViaWhatsApp("Paket Rempeyek Bumi Assorted", "Rp 85.000");
        });
    }
});
