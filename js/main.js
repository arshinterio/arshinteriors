document.addEventListener("DOMContentLoaded", function () {
    const mobileMenuBtn = document.getElementById("mobileMenuBtn") || document.querySelector(".mobile-menu-btn") || document.querySelector(".hamburger");
    const desktopNav = document.querySelector(".desktop-nav") || document.querySelector(".nav-links") || document.querySelector("header nav");

    if (mobileMenuBtn && desktopNav) {
        mobileMenuBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            desktopNav.classList.toggle("active");
            mobileMenuBtn.classList.toggle("active");
        });

        desktopNav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                desktopNav.classList.remove("active");
                mobileMenuBtn.classList.remove("active");
            });
        });

        document.addEventListener("click", function (e) {
            if (!desktopNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                desktopNav.classList.remove("active");
                mobileMenuBtn.classList.remove("active");
            }
        });
    }
});
