/**
 * ARSH INTERIORS - MASTER JAVASCRIPT
 * Handles Page Transitions, Custom Dropdowns, Smart Estimator Math, Dashboard & Responsive Mobile Menu
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 0. MOBILE HAMBURGER MENU TOGGLE
    const mobileMenuBtn = document.getElementById('mobileMenuBtn'); // Aapke 3-line icon ki ID
    const navMenu = document.querySelector('.desktop-nav'); // Aapke navigation menu ki class

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('mobile-active');
            mobileMenuBtn.classList.toggle('active');
        });

        // Menu ke bahar click karne par close ho jaye
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navMenu.classList.remove('mobile-active');
                mobileMenuBtn.classList.remove('active');
            }
        });
    }

    // 1. PAGE TRANSITION ENGINE
    const pageContent = document.getElementById('page-content');
    if (pageContent) {
        pageContent.classList.add('page-enter-right');
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                pageContent.classList.remove('page-enter-right');
            });
        });
    }

    const transitionLinks = document.querySelectorAll('a[data-transition="slide"]');
    transitionLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetUrl = link.getAttribute('href');
            if (!targetUrl || targetUrl.startsWith('#') || link.getAttribute('target') === '_blank') return;
            
            const currentPath = window.location.pathname.split('/').pop() || 'index.html';
            if (targetUrl === currentPath || targetUrl === window.location.href) return;

            e.preventDefault(); 
            if (pageContent) {
                pageContent.classList.add('page-exit-left');
                setTimeout(() => { window.location.href = targetUrl; }, 650); 
            } else {
                window.location.href = targetUrl;
            }
        });
    });

    // 2. HEADER SCROLL EFFECT
    const header = document.getElementById('mainHeader');
    if(header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        });
    }

    // 3. CUSTOM PREMIUM DROPDOWNS
    const customSelects = document.querySelectorAll('.custom-premium-select');
    customSelects.forEach(select => {
        const trigger = select.querySelector('.select-trigger');
        const options = select.querySelectorAll('.option');
        const hiddenInput = select.querySelector('input[type="hidden"]');
        const spanText = trigger.querySelector('span');

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close other open selects
            customSelects.forEach(s => { if(s !== select) s.classList.remove('open'); });
            select.classList.toggle('open');
        });

        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const val = option.getAttribute('data-value');
                spanText.innerText = option.innerText;
                hiddenInput.value = val;
                
                options.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                select.classList.remove('open');
            });
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        customSelects.forEach(s => s.classList.remove('open'));
    });

    // 4. SPECIFICATION CARDS SELECTION (Step 3)
    const specCards = document.querySelectorAll('.spec-card');
    specCards.forEach(card => {
        card.addEventListener('click', () => {
            const group = card.getAttribute('data-group');
            const val = card.getAttribute('data-val');
            
            // Remove active from same group
            document.querySelectorAll(`.spec-card[data-group="${group}"]`).forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            // Set hidden input value
            if(group === 'cDesign') document.getElementById('ceilingDesign').value = val;
            if(group === 'eTaste') document.getElementById('elecTaste').value = val;
            if(group === 'eScope') document.getElementById('elecScope').value = val;
            if(group === 'pGrade') document.getElementById('paintGrade').value = val;
        });
    });

    // 5. SMART ESTIMATOR LOGIC
    const form = document.getElementById('arshEstimatorForm');
    const ESTIMATOR_SHEET_URL = "https://script.google.com/macros/s/AKfycbzN9nx8A8gIXyV0h10h_E-40q1amjw1JXtfw__E5YTioHCCVtZPIMKKxgm4U4g7cvFl8Q/exec"; // Purana main sheet URL
    
    if (form) {
        const nextBtns = document.querySelectorAll('.btn-next');
        const prevBtns = document.querySelectorAll('.btn-prev');

        // Navigation Next
        nextBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const currentStep = btn.closest('.form-step');
                const nextStepNum = btn.getAttribute('data-next');
                const nextStep = document.querySelector(`.form-step[data-step="${nextStepNum}"]`);

                // Validation Step 1
                if (currentStep.getAttribute('data-step') === "1") {
                    if (!document.getElementById('propType').value || !document.getElementById('timeline').value) {
                        alert("Arsh Interiors: Please select both 'Property Type' and 'Project Timeline' from the dropdowns.");
                        return;
                    }
                }

                // Validation Step 2 & Setup Step 3
                if (currentStep.getAttribute('data-step') === "2") {
                    const chkCeiling = document.getElementById('chkCeiling').checked;
                    const chkElectrical = document.getElementById('chkElectrical').checked;
                    const chkPainting = document.getElementById('chkPainting').checked;
                    
                    if (!chkCeiling && !chkElectrical && !chkPainting) {
                        alert("Please select at least one core service.");
                        return;
                    }

                    document.getElementById('dyn-ceiling').style.display = chkCeiling ? 'block' : 'none';
                    document.getElementById('dyn-electrical').style.display = chkElectrical ? 'block' : 'none';
                    document.getElementById('dyn-painting').style.display = chkPainting ? 'block' : 'none';
                }

                // Validation Step 3
                if (currentStep.getAttribute('data-step') === "3") {
                    if (document.getElementById('chkCeiling').checked && !document.getElementById('ceilingArea').value) {
                        alert("Please enter the Total Carpet Area for the False Ceiling.");
                        return;
                    }
                    if (document.getElementById('chkCeiling').checked && !document.getElementById('ceilingDesign').value) {
                        alert("Please select a Ceiling Design Complexity.");
                        return;
                    }
                    if (document.getElementById('chkElectrical').checked && !document.getElementById('elecScope').value) {
                        alert("Please select the Electrical Material Scope.");
                        return;
                    }
                    if (document.getElementById('chkPainting').checked && !document.getElementById('paintGrade').value) {
                        alert("Please select a Painting Material Grade.");
                        return;
                    }
                }

                currentStep.classList.remove('active');
                currentStep.style.display = 'none';
                nextStep.style.display = 'block';
                setTimeout(() => { nextStep.classList.add('active'); }, 10);
            });
        });

        // Navigation Prev
        prevBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const currentStep = btn.closest('.form-step');
                const prevStepNum = btn.getAttribute('data-prev');
                const prevStep = document.querySelector(`.form-step[data-step="${prevStepNum}"]`);

                currentStep.classList.remove('active');
                currentStep.style.display = 'none';
                prevStep.style.display = 'block';
                setTimeout(() => { prevStep.classList.add('active'); }, 10);
            });
        });

        // Form Submit & Calculation
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const propType = document.getElementById('propType').value;
            const timeline = document.getElementById('timeline').value;
            const name = document.getElementById('custName').value.trim();
            const phone = document.getElementById('custPhone').value.trim();
            const loc = document.getElementById('custLoc').value.trim();

            if(phone.length < 10) return alert("Please enter a valid 10-digit WhatsApp number.");

            const chkCeiling = document.getElementById('chkCeiling').checked;
            const chkElectrical = document.getElementById('chkElectrical').checked;
            const chkPainting = document.getElementById('chkPainting').checked;

            let detailsString = "";
            let waDetailsString = "";
            let calculatedDisplayHtml = "";
            const formatPrice = (amt) => "₹" + amt.toLocaleString('en-IN');

            let ceilingAreaVal = parseInt(document.getElementById('ceilingArea').value) || 0;

            // CEILING
            if (chkCeiling) {
                let cDesign = document.getElementById('ceilingDesign').value;
                let cRate = cDesign === 'Simple' ? 90 : (cDesign === 'Premium' ? 140 : 190);
                let cTotal = ceilingAreaVal * cRate;
                
                detailsString += `Ceiling: ${ceilingAreaVal} sqft (${cDesign}). `;
                waDetailsString += `\n*Ceiling:* ${ceilingAreaVal} sqft | Type: ${cDesign}`;
                
                calculatedDisplayHtml += `
                    <div style="display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px dashed #eee; padding-bottom:15px;">
                        <span style="font-weight:600; color:#555;">Gypsum Ceiling (${cDesign})</span>
                        <span style="font-weight:800; color:#111;">${formatPrice(cTotal)} <span style="font-size:0.8rem; color:#999; font-weight:500;">Approx</span></span>
                    </div>`;
            }

            // SMART ELECTRICAL LOGIC
            if (chkElectrical) {
                let eScope = document.getElementById('elecScope').value;
                let eTaste = document.getElementById('elecTaste').value || "Standard";
                
                let totalPoints = 0;
                if(propType.includes('1 BHK')) totalPoints = 35;
                else if(propType.includes('2 BHK')) totalPoints = 55;
                else if(propType.includes('3 BHK')) totalPoints = 75;
                else if(propType.includes('4+ BHK')) totalPoints = 95;
                else if(propType === 'Bungalow' || propType === 'Commercial') {
                    totalPoints = Math.round(ceilingAreaVal / 12);
                    if(totalPoints < 40) totalPoints = 40;
                } else {
                    totalPoints = 50;
                }

                let pointRate = (eScope === "With Lights") ? 1100 : 700;
                let eTotal = totalPoints * pointRate;

                detailsString += `Elec: ~${totalPoints} Pts (${eScope}). `;
                waDetailsString += `\n*Electrical:* ~${totalPoints} Points | Scope: ${eScope} | Vibe: ${eTaste}`;
                
                calculatedDisplayHtml += `
                    <div style="display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px dashed #eee; padding-bottom:15px;">
                        <span style="font-weight:600; color:#555;">Electrical (~${totalPoints} Pts, ${eScope})</span>
                        <span style="font-weight:800; color:#111;">${formatPrice(eTotal)} <span style="font-size:0.8rem; color:#999; font-weight:500;">Approx</span></span>
                    </div>`;
            }

            // PAINTING
            if (chkPainting) {
                let pGrade = document.getElementById('paintGrade').value;
                detailsString += `Paint: ${pGrade}. `;
                waDetailsString += `\n*Painting Grade:* ${pGrade}`;
                
                calculatedDisplayHtml += `
                    <div style="display:flex; justify-content:space-between; margin-bottom:15px; padding-bottom:15px;">
                        <span style="font-weight:600; color:#555;">Painting (${pGrade})</span>
                        <span style="font-weight:800; color:#ff6b6b; font-size:0.95rem;">Cost based on actual site measurement</span>
                    </div>`;
            }

            // Show Loader
            document.querySelector('.form-step[data-step="4"]').style.display = 'none';
            document.getElementById('form-loader').style.display = 'block';

            const payload = {
                name: name,
                phone: phone,
                loc: loc,
                propType: propType,
                timeline: timeline,
                services: (chkCeiling?"Ceiling, ":"") + (chkElectrical?"Electrical, ":"") + (chkPainting?"Painting":""),
                area: detailsString
            };

            fetch(ESTIMATOR_SHEET_URL, {
                method: "POST", mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            }).catch(e => console.log("Sent securely."));

            setTimeout(() => {
                document.getElementById('form-loader').style.display = 'none';
                const dashboard = document.getElementById('premiumResultDashboard');
                dashboard.style.display = 'block';
                
                document.getElementById('dynamicPriceInvoice').innerHTML = calculatedDisplayHtml;

                const waMsg = `*Arsh Interiors - New Blueprint Configured* 🏢\n\n` +
                              `*Name:* ${name}\n` +
                              `*Location:* ${loc}\n` +
                              `*Property:* ${propType} | *Start:* ${timeline}\n` +
                              `\n--- Execution Specifications ---` + waDetailsString +
                              `\n\n*Please share the final cost proposal.*`;
                              
                document.getElementById('waConnectBtn').href = `https://api.whatsapp.com/send?phone=919022104232&text=${encodeURIComponent(waMsg)}`;
                
            }, 1800);
        });
    }
});
