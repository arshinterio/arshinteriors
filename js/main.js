document.addEventListener("DOMContentLoaded", function () {
    const mobileMenuBtn = document.getElementById("mobileMenuBtn") || document.querySelector(".mobile-menu-btn");
    const desktopNav = document.querySelector(".desktop-nav");

    if (mobileMenuBtn && desktopNav) {
        // Hamburger click par menu toggle ho
        mobileMenuBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            desktopNav.classList.toggle("active");
        });

        // Menu ke kisi bhi link par click karne par menu band ho jaye
        const navLinks = desktopNav.querySelectorAll("a");
        navLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                desktopNav.classList.remove("active");
            });
        });

        // Screen par kahin aur click karne par menu band ho jaye
        document.addEventListener("click", function (e) {
            if (!desktopNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                desktopNav.classList.remove("active");
            }
        });
    }
});
