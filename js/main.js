document.addEventListener("DOMContentLoaded", function () {
    
    /* 1. Mobile Menu Toggle */
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
    }

    /* 2. Custom Dropdowns */
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

    /* 3. Multi-Step Form Logic */
    const formSteps = document.querySelectorAll('.form-step');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');

    if (formSteps.length > 0) {
        nextButtons.forEach(button => {
            button.addEventListener('click', function() {
                const nextStepNum = this.getAttribute('data-next');
                
                if (nextStepNum === "2") {
                    const propType = document.getElementById('propType').value;
                    const timeline = document.getElementById('timeline').value;
                    if (!propType || !timeline) {
                        alert("Please select both Property Type and Project Timeline.");
                        return;
                    }
                }

                if (nextStepNum === "3") {
                    const chkCeiling = document.getElementById('chkCeiling').checked;
                    const chkElectrical = document.getElementById('chkElectrical').checked;
                    const chkPainting = document.getElementById('chkPainting').checked;

                    if (!chkCeiling && !chkElectrical && !chkPainting) {
                        alert("Please select at least one service scope.");
                        return;
                    }

                    document.getElementById('dyn-ceiling').style.display = chkCeiling ? 'block' : 'none';
                    document.getElementById('dyn-electrical').style.display = chkElectrical ? 'block' : 'none';
                    document.getElementById('dyn-painting').style.display = chkPainting ? 'block' : 'none';
                }

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

    /* 4. Clean Checkbox Card Selection (No Ajeeb Checkboxes) */
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

    /* 5. Live Cost Calculation & Submission Logic */
    const estimatorForm = document.getElementById('arshEstimatorForm');
    if (estimatorForm) {
        estimatorForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('custName').value;
            const phone = document.getElementById('custPhone').value;
            const loc = document.getElementById('custLoc').value;

            if (!name || !phone || !loc) {
                alert("Please fill in all required destination details.");
                return;
            }

            let selectedServices = [];
            document.querySelectorAll('input[name="services"]:checked').forEach(cb => {
                selectedServices.push(cb.value);
            });

            const areaInput = document.getElementById('ceilingArea');
            const area = areaInput && areaInput.value ? parseFloat(areaInput.value) : 600; // Default estimate base

            // Calculation Logic based on standard Pune rates (Gypsum/POP ceiling ~110/sqft, Electrical ~45/sqft, Painting ~35/sqft)
            let estimatedCost = 0;
            let breakdownText = "";

            if (selectedServices.includes("False Ceiling")) {
                let ceilingCost = area * 110;
                estimatedCost += ceilingCost;
                breakdownText += `<br>• False Ceiling (~${area} sq.ft): ₹${ceilingCost.toLocaleString('en-IN')}`;
            }
            if (selectedServices.includes("Electrical")) {
                let elecCost = area * 45;
                estimatedCost += elecCost;
                breakdownText += `<br>• Electrical Work: ₹${elecCost.toLocaleString('en-IN')}`;
            }
            if (selectedServices.includes("Painting")) {
                let paintCost = area * 35;
                estimatedCost += paintCost;
                breakdownText += `<br>• Wall Painting: ₹${paintCost.toLocaleString('en-IN')}`;
            }

            if (estimatedCost === 0) {
                estimatedCost = 45000; // Minimum baseline
                breakdownText = `<br>• General Execution Scope`;
            }

            const payload = {
                name: name,
                phone: phone,
                loc: loc,
                propertyType: document.getElementById('propType').value,
                timeline: document.getElementById('timeline').value,
                services: selectedServices.join(', '),
                ceilingArea: area,
                estimatedTotal: "₹ " + estimatedCost.toLocaleString('en-IN')
            };

            formSteps.forEach(step => step.style.display = 'none');
            const loader = document.getElementById('form-loader');
            if (loader) loader.style.display = 'block';

            // Send data to Google Sheets silently
            fetch("https://script.google.com/macros/s/AKfycbzWeJMWLdQKLsB7qoznoorTDRxWODsSRR87xCBKUo76mdvFCxqOYiy2zDGqPpNy7LIU/exec", {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            }).catch(() => {});

            // Show calculated result instantly on screen
            setTimeout(() => {
                if (loader) {
                    loader.innerHTML = `
                        <div style="text-align:center; padding: 20px;">
                            <i class="fas fa-calculator" style="font-size: 3rem; color: #ff6b6b; margin-bottom: 15px;"></i>
                            <h3 style="color: #111; margin-bottom: 10px;">Estimated Execution Budget</h3>
                            <div style="font-size: 2.2rem; font-weight: 800; color: #ff6b6b; margin: 15px 0;">
                                ₹ ${estimatedCost.toLocaleString('en-IN')} <span style="font-size: 0.9rem; color: #666; font-weight: 400;">(approx.)</span>
                            </div>
                            <p style="color: #555; font-size: 0.95rem; text-align: left; background: #faf9f8; padding: 15px; border-radius: 8px; margin: 15px 0; border: 1px solid #eee;">
                                <strong>Scope Breakdown:</strong> ${breakdownText}
                            </p>
                            <p style="color: #666; font-size: 0.9rem; margin-top: 15px;">Thank you <strong>${name}</strong>! Our team from Arsh Interiors, Dhayari will connect with you on WhatsApp (+91 ${phone}) with a detailed BOQ.</p>
                            <a href="https://wa.me/919022104232?text=Hello%20Arsh%20Interiors,%20I%20received%20an%20estimate%20of%20Rs.%20${estimatedCost.toLocaleString('en-IN')}%20for%20my%20project%20in%20${loc}." target="_blank" style="display: inline-block; background: #25d366; color: #fff; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: 700; margin-top: 15px;">
                                <i class="fab fa-whatsapp"></i> Discuss on WhatsApp
                            </a>
                        </div>
                    `;
                }
            }, 800);
        });
    }
});
