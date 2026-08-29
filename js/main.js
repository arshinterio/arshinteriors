document.addEventListener("DOMContentLoaded", function () {
    
    /* ==========================================
       1. MOBILE MENU TOGGLE LOGIC
       ========================================== */
    const mobileMenuBtn = document.getElementById("mobileMenuBtn") || document.querySelector(".mobile-menu-btn");
    const desktopNav = document.querySelector(".desktop-nav");

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

    /* ==========================================
       2. ESTIMATOR CUSTOM DROPDOWNS LOGIC
       ========================================== */
    const customSelects = document.querySelectorAll('.custom-premium-select');
    
    if (customSelects.length > 0) {
        customSelects.forEach(selectContainer => {
            const trigger = selectContainer.querySelector('.select-trigger');
            const optionsBox = selectContainer.querySelector('.select-options');
            const hiddenInput = selectContainer.querySelector('input[type="hidden"]');
            const triggerSpan = trigger ? trigger.querySelector('span') : null;

            if (trigger && optionsBox && hiddenInput && triggerSpan) {
                trigger.addEventListener('click', function(e) {
                    e.stopPropagation();
                    // Close other dropdowns
                    customSelects.forEach(s => {
                        if (s !== selectContainer) {
                            const opt = s.querySelector('.select-options');
                            if (opt) opt.style.display = 'none';
                        }
                    });
                    optionsBox.style.display = optionsBox.style.display === 'block' ? 'none' : 'block';
                });

                optionsBox.querySelectorAll('.option').forEach(option => {
                    option.addEventListener('click', function() {
                        const value = this.getAttribute('data-value');
                        const text = this.textContent;
                        triggerSpan.textContent = text;
                        triggerSpan.style.color = '#111';
                        hiddenInput.value = value;
                        optionsBox.style.display = 'none';
                    });
                });
            }
        });

        document.addEventListener('click', function() {
            customSelects.forEach(s => {
                const opt = s.querySelector('.select-options');
                if (opt) opt.style.display = 'none';
            });
        });
    }

    /* ==========================================
       3. ESTIMATOR MULTI-STEP & DYNAMIC SECTIONS
       ========================================== */
    const formSteps = document.querySelectorAll('.form-step');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');

    if (formSteps.length > 0) {
        // Next Step Logic
        nextButtons.forEach(button => {
            button.addEventListener('click', function() {
                const nextStepNum = this.getAttribute('data-next');
                
                // Validation for Step 1
                if (nextStepNum === "2") {
                    const propTypeElem = document.getElementById('propType');
                    const timelineElem = document.getElementById('timeline');
                    const propType = propTypeElem ? propTypeElem.value : '';
                    const timeline = timelineElem ? timelineElem.value : '';
                    if (!propType || !timeline) {
                        alert("Please select both Property Type and Project Timeline.");
                        return;
                    }
                }

                // Show dynamic sections in Step 3 based on Step 2 checkboxes
                if (nextStepNum === "3") {
                    const chkCeilingElem = document.getElementById('chkCeiling');
                    const chkElectricalElem = document.getElementById('chkElectrical');
                    const chkPaintingElem = document.getElementById('chkPainting');
                    const chkCeiling = chkCeilingElem ? chkCeilingElem.checked : false;
                    const chkElectrical = chkElectricalElem ? chkElectricalElem.checked : false;
                    const chkPainting = chkPaintingElem ? chkPaintingElem.checked : false;

                    if (!chkCeiling && !chkElectrical && !chkPainting) {
                        alert("Please select at least one service scope.");
                        return;
                    }

                    const dynCeiling = document.getElementById('dyn-ceiling');
                    const dynElectrical = document.getElementById('dyn-electrical');
                    const dynPainting = document.getElementById('dyn-painting');

                    if (dynCeiling) dynCeiling.style.display = chkCeiling ? 'block' : 'none';
                    if (dynElectrical) dynElectrical.style.display = chkElectrical ? 'block' : 'none';
                    if (dynPainting) dynPainting.style.display = chkPainting ? 'block' : 'none';
                }

                // Switch steps
                formSteps.forEach(step => {
                    step.style.display = 'none';
                    step.classList.remove('active');
                });

                const targetStep = document.querySelector(`.form-step[data-step="${nextStepNum}"]`);
                if (targetStep) {
                    targetStep.style.display = 'block';
                    targetStep.classList.add('active');
                    window.scrollTo({ top: 200, behavior: 'smooth' });
                }
            });
        });

        // Prev Step Logic
        prevButtons.forEach(button => {
            button.addEventListener('click', function() {
                const prevStepNum = this.getAttribute('data-prev');
                formSteps.forEach(step => {
                    step.style.display = 'none';
                    step.classList.remove('active');
                });

                const targetStep = document.querySelector(`.form-step[data-step="${prevStepNum}"]`);
                if (targetStep) {
                    targetStep.style.display = 'block';
                    targetStep.classList.add('active');
                    window.scrollTo({ top: 200, behavior: 'smooth' });
                }
            });
        });
    }

    // Visual Checkbox Cards Toggle Style
    const checkboxCards = document.querySelectorAll('.custom-checkbox-card');
    if (checkboxCards.length > 0) {
        checkboxCards.forEach(card => {
            const checkbox = card.querySelector('input[type="checkbox"]');
            const visualBox = card.querySelector('.visual-box');

            if (checkbox && visualBox) {
                card.addEventListener('click', function(e) {
                    setTimeout(() => {
                        if (checkbox.checked) {
                            visualBox.style.borderColor = '#ff6b6b';
                            visualBox.style.background = 'rgba(255,107,107,0.03)';
                            const icon = visualBox.querySelector('i');
                            if (icon) icon.style.color = '#ff6b6b';
                        } else {
                            visualBox.style.borderColor = '#eee';
                            visualBox.style.background = '#fff';
                            const icon = visualBox.querySelector('i');
                            if (icon) icon.style.color = '#999';
                        }
                    }, 10);
                });
            }
        });
    }

    /* ==========================================
       4. ESTIMATOR FINAL SUBMISSION (Google Sheets)
       ========================================== */
    const estimatorForm = document.getElementById('arshEstimatorForm');
    if (estimatorForm) {
        estimatorForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const nameElem = document.getElementById('custName');
            const phoneElem = document.getElementById('custPhone');
            const locElem = document.getElementById('custLoc');
            const name = nameElem ? nameElem.value : '';
            const phone = phoneElem ? phoneElem.value : '';
            const loc = locElem ? locElem.value : '';

            if (!name || !phone || !loc) {
                alert("Please fill in all required destination details.");
                return;
            }

            // Gather selected services
            let selectedServices = [];
            document.querySelectorAll('input[name="services"]:checked').forEach(cb => {
                selectedServices.push(cb.value);
            });

            const propTypeElem = document.getElementById('propType');
            const timelineElem = document.getElementById('timeline');
            const ceilingAreaElem = document.getElementById('ceilingArea');

            const payload = {
                name: name,
                phone: phone,
                loc: loc,
                propertyType: propTypeElem ? propTypeElem.value : '',
                timeline: timelineElem ? timelineElem.value : '',
                services: selectedServices.join(', '),
                ceilingArea: ceilingAreaElem ? ceilingAreaElem.value : 'N/A'
            };

            // Show loader
            formSteps.forEach(step => step.style.display = 'none');
            const loader = document.getElementById('form-loader');
            if (loader) loader.style.display = 'block';

            // Send to Google Apps Script (same endpoint used for callback)
            fetch("https://script.google.com/macros/s/AKfycbzWeJMWLdQKLsB7qoznoorTDRxWODsSRR87xCBKUo76mdvFCxqOYiy2zDGqPpNy7LIU/exec", {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            }).then(() => {
                if (loader) {
                    loader.innerHTML = `
                        <div style="text-align:center; color: #25d366; padding: 20px;">
                            <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 15px;"></i>
                            <h3 style="color: #111;">Estimation Request Sent Successfully!</h3>
                            <p style="color: #666; margin-top: 10px;">Our team at Arsh Interiors will calculate your blueprint and contact you shortly.</p>
                        </div>
                    `;
                }
            }).catch(() => {
                if (loader) {
                    loader.innerHTML = `
                        <div style="text-align:center; color: #ff6b6b; padding: 20px;">
                            <h3 style="color: #111;">Something went wrong.</h3>
                            <p style="color: #666;">Please contact us directly via WhatsApp.</p>
                        </div>
                    `;
                }
            });
        });
    }
});
