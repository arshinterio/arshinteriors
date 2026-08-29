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
                        triggerSpan.textContent = this.textContent;
                        triggerSpan.style.color = '#111';
                        hiddenInput.value = this.getAttribute('data-value');
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
       3. ESTIMATOR MULTI-STEP NAVIGATION LOGIC
       ========================================== */
    const formSteps = document.querySelectorAll('.form-step');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');

    if (formSteps.length > 0) {
        nextButtons.forEach(button => {
            button.addEventListener('click', function() {
                const nextStepNum = this.getAttribute('data-next');
                
                if (nextStepNum === "2") {
                    const propTypeElem = document.getElementById('propType');
                    const timelineElem = document.getElementById('timeline');
                    if (!propTypeElem || !propTypeElem.value || !timelineElem || !timelineElem.value) {
                        alert("Please select both Property Type and Project Timeline.");
                        return;
                    }
                }

                if (nextStepNum === "3") {
                    const chkCeiling = document.getElementById('chkCeiling')?.checked || false;
                    const chkElectrical = document.getElementById('chkElectrical')?.checked || false;
                    const chkPainting = document.getElementById('chkPainting')?.checked || false;
                    const chkFurniture = document.getElementById('chkFurniture')?.checked || false;

                    if (!chkCeiling && !chkElectrical && !chkPainting && !chkFurniture) {
                        alert("Please select at least one service scope.");
                        return;
                    }

                    const dynC = document.getElementById('dyn-ceiling');
                    const dynE = document.getElementById('dyn-electrical');
                    const dynP = document.getElementById('dyn-painting');
                    const dynF = document.getElementById('dyn-furniture');

                    if (dynC) dynC.style.display = chkCeiling ? 'block' : 'none';
                    if (dynE) dynE.style.display = chkElectrical ? 'block' : 'none';
                    if (dynP) dynP.style.display = chkPainting ? 'block' : 'none';
                    if (dynF) dynF.style.display = chkFurniture ? 'block' : 'none';
                }

                formSteps.forEach(step => step.classList.remove('active'));

                const targetStep = document.querySelector(`.form-step[data-step="${nextStepNum}"]`);
                if (targetStep) {
                    targetStep.classList.add('active');
                    window.scrollTo({ top: 200, behavior: 'smooth' });
                }
            });
        });

        prevButtons.forEach(button => {
            button.addEventListener('click', function() {
                const prevStepNum = this.getAttribute('data-prev');
                formSteps.forEach(step => step.classList.remove('active'));

                const targetStep = document.querySelector(`.form-step[data-step="${prevStepNum}"]`);
                if (targetStep) {
                    targetStep.classList.add('active');
                    window.scrollTo({ top: 200, behavior: 'smooth' });
                }
            });
        });
    }

    /* ==========================================
       4. CHECKBOX CARDS STYLING TOGGLE
       ========================================== */
    const checkboxCards = document.querySelectorAll('.custom-checkbox-card');
    if (checkboxCards.length > 0) {
        checkboxCards.forEach(card => {
            const checkbox = card.querySelector('input[type="checkbox"]');
            const visualBox = card.querySelector('.visual-box');

            if (checkbox && visualBox) {
                card.addEventListener('click', function() {
                    setTimeout(() => {
                        if (checkbox.checked) {
                            visualBox.style.borderColor = '#ff6b6b';
                            visualBox.style.background = 'rgba(255,107,107,0.05)';
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
       5. 3-TIER ESTIMATE SUBMISSION LOGIC
       ========================================== */
    const estimatorForm = document.getElementById('arshEstimatorForm');
    if (estimatorForm) {
        estimatorForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('custName')?.value || '';
            const phone = document.getElementById('custPhone')?.value || '';
            const loc = document.getElementById('custLoc')?.value || '';

            if (!name || !phone || !loc) {
                alert("Please fill in all required destination details.");
                return;
            }

            let selectedServices = [];
            document.querySelectorAll('input[name="services"]:checked').forEach(cb => {
                selectedServices.push(cb.value);
            });

            const areaInput = document.getElementById('ceilingArea');
            const area = areaInput && areaInput.value ? parseFloat(areaInput.value) : 600;

            let baseCost = 0;
            if (selectedServices.includes("False Ceiling")) baseCost += area * 100;
            if (selectedServices.includes("Electrical")) baseCost += area * 40;
            if (selectedServices.includes("Painting")) baseCost += area * 30;
            if (selectedServices.includes("Furniture")) baseCost += area * 250;

            if (baseCost === 0) baseCost = 50000;

            let budgetCost = Math.round(baseCost * 0.85);
            let premiumCost = Math.round(baseCost * 1.15);
            let luxuryCost = Math.round(baseCost * 1.55);

            const payload = {
                name: name,
                phone: phone,
                loc: loc,
                propertyType: document.getElementById('propType')?.value || 'N/A',
                timeline: document.getElementById('timeline')?.value || 'N/A',
                services: selectedServices.join(', '),
                ceilingArea: area,
                estimateTier1: "₹ " + budgetCost.toLocaleString('en-IN'),
                estimateTier2: "₹ " + premiumCost.toLocaleString('en-IN'),
                estimateTier3: "₹ " + luxuryCost.toLocaleString('en-IN')
            };

            formSteps.forEach(step => step.style.display = 'none');
            const loader = document.getElementById('form-loader');
            if (loader) loader.style.display = 'block';

            fetch("https://script.google.com/macros/s/AKfycbzWeJMWLdQKLsB7qoznoorTDRxWODsSRR87xCBKUo76mdvFCxqOYiy2zDGqPpNy7LIU/exec", {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            }).catch(() => {});

            setTimeout(() => {
                if (loader) {
                    loader.innerHTML = `
                        <div style="text-align:center; padding: 10px;">
                            <i class="fas fa-award" style="font-size: 2.8rem; color: #ff6b6b; margin-bottom: 12px;"></i>
                            <h3 style="color: #111; margin-bottom: 8px;">Estimated Tier Options for ${name}</h3>
                            <p style="color: #666; font-size: 0.9rem; margin-bottom: 20px;">Based on your scope (${selectedServices.join(', ')}) across ${area} sq.ft in ${loc}:</p>
                            
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 15px; text-align: left; margin-bottom: 20px;">
                                <!-- Budget Friendly -->
                                <div style="background: #faf9f8; padding: 20px; border-radius: 12px; border: 1px solid #eaeaea; box-sizing: border-box;">
                                    <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: #666; letter-spacing: 1px;">Standard / Basic</span>
                                    <h4 style="color: #111; font-size: 1.1rem; margin: 5px 0 10px 0;">Budget Friendly</h4>
                                    <div style="font-size: 1.4rem; font-weight: 800; color: #ff6b6b;">₹ ${budgetCost.toLocaleString('en-IN')}</div>
                                    <p style="font-size: 0.8rem; color: #777; margin-top: 8px;">Standard branded materials & functional layouts.</p>
                                </div>
                                
                                <!-- Premium -->
                                <div style="background: #fff5f5; padding: 20px; border-radius: 12px; border: 2px solid #ff6b6b; box-sizing: border-box; position: relative;">
                                    <span style="position: absolute; top: -10px; right: 15px; background: #ff6b6b; color: #fff; font-size: 0.65rem; padding: 3px 8px; border-radius: 20px; font-weight: 700;">MOST POPULAR</span>
                                    <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: #ff6b6b; letter-spacing: 1px;">Recommended</span>
                                    <h4 style="color: #111; font-size: 1.1rem; margin: 5px 0 10px 0;">Premium Finish</h4>
                                    <div style="font-size: 1.4rem; font-weight: 800; color: #ff6b6b;">₹ ${premiumCost.toLocaleString('en-IN')}</div>
                                    <p style="font-size: 0.8rem; color: #777; margin-top: 8px;">Superior Gyproc boards, profile lighting & Royale emulsions.</p>
                                </div>

                                <!-- Luxury -->
                                <div style="background: #faf9f8; padding: 20px; border-radius: 12px; border: 1px solid #eaeaea; box-sizing: border-box;">
                                    <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: #666; letter-spacing: 1px;">High-End Designer</span>
                                    <h4 style="color: #111; font-size: 1.1rem; margin: 5px 0 10px 0;">Luxury Living</h4>
                                    <div style="font-size: 1.4rem; font-weight: 800; color: #ff6b6b;">₹ ${luxuryCost.toLocaleString('en-IN')}</div>
                                    <p style="font-size: 0.8rem; color: #777; margin-top: 8px;">Bespoke textures, PU furniture polish & smart automation.</p>
                                </div>
                            </div>

                            <p style="color: #666; font-size: 0.85rem; margin-top: 10px;">Our team from Arsh Interiors, Dhayari will connect with you on WhatsApp (+91 ${phone}) with an exact BOQ.</p>
                            <a href="https://wa.me/919022104232?text=Hello%20Arsh%20Interiors,%20I%20reviewed%20the%20estimate%20tiers%20for%20my%20project%20in%20${loc}." target="_blank" style="display: inline-block; background: #25d366; color: #fff; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: 700; margin-top: 15px;">
                                <i class="fab fa-whatsapp"></i> Discuss on WhatsApp
                            </a>
                        </div>
                    `;
                }
            }, 800);
        });
    }
});
