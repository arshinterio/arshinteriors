/**
 * ARSH INTERIORS - ADVANCED MASTER JAVASCRIPT
 * Handles Page Sliding Transitions, Scroll Effects, Calculation Math, and API Submissions
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. ADVANCED PAGE TRANSITION ENGINE (Left/Right Slide)
       ========================================================================== */
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
            if (targetUrl.startsWith('#') || link.getAttribute('target') === '_blank') return;
            
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

    /* ==========================================================================
       2. HEADER SCROLL EFFECT
       ========================================================================== */
    const header = document.getElementById('mainHeader');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });

    /* ==========================================================================
       3. MULTI-STEP FORM & ESTIMATOR ENGINE
       ========================================================================== */
    const form = document.getElementById('arshEstimatorForm');
    const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbzN9nx8A8gIXyV0h10h_E-40q1amjw1JXtfw__E5YTioHCCVtZPIMKKxgm4U4g7cvFl8Q/exec";
    
    if (form) {
        // Dynamically Inject Painting Options in Step 3 (No HTML edit needed)
        const step3 = document.querySelector('.form-step[data-step="3"]');
        if (step3 && !document.getElementById('dynamic-painting-fields')) {
            const paintHtml = `
            <div id="dynamic-painting-fields" style="display: none; margin-bottom: 30px; padding: 20px; border: 1px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-light);">
                <h4 style="margin-bottom: 20px; color: var(--primary);"><i class="fas fa-paint-roller"></i> Painting Specifications</h4>
                <div class="input-grid">
                    <div class="input-group full-width">
                        <label for="paintQuality">Paint Quality Required *</label>
                        <div class="input-icon-wrapper">
                            <i class="fas fa-fill-drip"></i>
                            <select id="paintQuality">
                                <option value="Standard">Standard (Tractor Emulsion)</option>
                                <option value="Premium">Premium (Apcolite / Premium Emulsion)</option>
                                <option value="Luxury">Luxury (Royale / Jotun / Textures)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>`;
            const noDynMsg = document.getElementById('no-dynamic-msg');
            if(noDynMsg) noDynMsg.insertAdjacentHTML('beforebegin', paintHtml);
        }

        const nextBtns = document.querySelectorAll('.btn-next');
        const prevBtns = document.querySelectorAll('.btn-prev');

        // Form Navigation Logic
        nextBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const currentStep = btn.closest('.form-step');
                const nextStepNum = btn.getAttribute('data-next');
                const nextStep = document.querySelector(`.form-step[data-step="${nextStepNum}"]`);

                // Validation Step 1
                if (currentStep.getAttribute('data-step') === "1") {
                    if (!document.getElementById('propType').value || !document.getElementById('timeline').value) {
                        alert("Arsh Interiors: Please select both 'Property Type' and 'Project Timeline'.");
                        return;
                    }
                }

                // Validation Step 2 & Setup Step 3 Visibility
                if (currentStep.getAttribute('data-step') === "2") {
                    const chkCeiling = document.getElementById('chkCeiling').checked;
                    const chkElectrical = document.getElementById('chkElectrical').checked;
                    const chkPainting = document.getElementById('chkPainting').checked;
                    
                    if (!chkCeiling && !chkElectrical && !chkPainting) {
                        alert("Arsh Interiors: Please select at least one core service.");
                        return;
                    }

                    // Show exactly what they selected
                    if(document.getElementById('dynamic-ceiling-fields')) 
                        document.getElementById('dynamic-ceiling-fields').style.display = chkCeiling ? 'block' : 'none';
                    if(document.getElementById('dynamic-electrical-fields')) 
                        document.getElementById('dynamic-electrical-fields').style.display = chkElectrical ? 'block' : 'none';
                    if(document.getElementById('dynamic-painting-fields')) 
                        document.getElementById('dynamic-painting-fields').style.display = chkPainting ? 'block' : 'none';
                }

                // Validation Step 3
                if (currentStep.getAttribute('data-step') === "3") {
                    if (document.getElementById('chkCeiling').checked && !document.getElementById('ceilingArea').value) {
                        alert("Please enter approximate False Ceiling Area.");
                        return;
                    }
                }

                // Transition Steps
                currentStep.classList.remove('active');
                currentStep.style.display = 'none';
                nextStep.style.display = 'block';
                setTimeout(() => { nextStep.classList.add('active'); }, 10);
            });
        });

        // Previous Button Logic
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

        // --------------------------------------------------------
        // FORM SUBMIT & CALCULATION LOGIC
        // --------------------------------------------------------
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('custName').value.trim();
            const phone = document.getElementById('custPhone').value.trim();
            const loc = document.getElementById('custLoc').value.trim();
            const propType = document.getElementById('propType').value;
            const timeline = document.getElementById('timeline').value;

            if(phone.length < 10) return alert("Please enter a valid 10-digit WhatsApp number.");

            // Gather Selections
            const chkCeiling = document.getElementById('chkCeiling').checked;
            const chkElectrical = document.getElementById('chkElectrical').checked;
            const chkPainting = document.getElementById('chkPainting').checked;

            let detailsString = "";
            let waDetailsString = "";
            let calculatedDisplayHtml = "";
            const formatPrice = (amt) => "₹" + amt.toLocaleString('en-IN');

            // 1. CEILING LOGIC
            if (chkCeiling) {
                let cArea = parseInt(document.getElementById('ceilingArea').value) || 0;
                let cDesign = document.getElementById('ceilingDesign').value;
                let cRate = cDesign === 'Simple' ? 100 : (cDesign === 'Premium' ? 150 : 200);
                
                detailsString += `Ceiling: ${cArea} sqft (${cDesign}). `;
                waDetailsString += `\n*Ceiling:* ${cArea} sqft | Type: ${cDesign}`;
                
                calculatedDisplayHtml += `
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px dashed #ccc; padding-bottom:10px;">
                        <span style="font-weight:600; color:var(--text-body);">Ceiling Estimate (${cDesign})</span>
                        <span style="font-weight:800; color:var(--text-dark);">${formatPrice(cArea * cRate)} Approx</span>
                    </div>`;
            }

            // 2. ELECTRICAL LOGIC (Strict Point Math)
            if (chkElectrical) {
                let liv = parseInt(document.getElementById('elecLiving').value) || 0;
                let bed = parseInt(document.getElementById('elecBed').value) || 0;
                let kit = parseInt(document.getElementById('elecKitchen').value) || 0;
                let pas = parseInt(document.getElementById('elecPassage').value) || 0;
                let bal = parseInt(document.getElementById('elecBalcony').value) || 0;
                let eScope = document.getElementById('elecScope').value;

                // Points Formula
                let totalPoints = (liv * 20) + (bed * 10) + (kit * 8) + (pas * 4) + (bal * 4);
                let pointRate = (eScope === "With Lights") ? 1100 : 700;
                let eTotal = totalPoints * pointRate;

                detailsString += `Elec: ${totalPoints} Pts (${eScope}). `;
                waDetailsString += `\n*Electrical:* ${totalPoints} Points | Scope: ${eScope}`;
                
                calculatedDisplayHtml += `
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px dashed #ccc; padding-bottom:10px;">
                        <span style="font-weight:600; color:var(--text-body);">Electrical (${totalPoints} Pts, ${eScope})</span>
                        <span style="font-weight:800; color:var(--text-dark);">${formatPrice(eTotal)} Approx</span>
                    </div>`;
            }

            // 3. PAINTING LOGIC
            if (chkPainting) {
                let pQuality = document.getElementById('paintQuality').value;
                detailsString += `Paint: ${pQuality}. `;
                waDetailsString += `\n*Painting:* Quality: ${pQuality}`;
                
                calculatedDisplayHtml += `
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px; padding-bottom:10px;">
                        <span style="font-weight:600; color:var(--text-body);">Painting (${pQuality})</span>
                        <span style="font-weight:800; color:var(--text-dark);">As per carpet area</span>
                    </div>`;
            }

            // UI Transitions: Form -> Loader
            document.querySelector('.form-step[data-step="4"]').style.display = 'none';
            document.getElementById('form-loader').style.display = 'block';

            // Google Sheets Payload (Matching old script requirement)
            const payload = {
                name: name,
                phone: phone,
                loc: loc,
                propType: propType,
                timeline: timeline,
                services: (chkCeiling?"Ceiling, ":"") + (chkElectrical?"Electrical, ":"") + (chkPainting?"Painting":""),
                area: detailsString // Sending all specific details here
            };

            // Send to Google Sheets (Background API Call)
            fetch(GOOGLE_SHEET_URL, {
                method: "POST", 
                mode: "no-cors", // Required for Google Scripts from external HTML
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            }).catch(e => console.log("Secure submission completed."));

            // After 1.5 seconds, hide loader, show Result Box & Optional WA Button
            setTimeout(() => {
                document.getElementById('form-loader').style.display = 'none';
                
                const resultBox = document.getElementById('estimator-result');
                resultBox.style.display = 'block';
                resultBox.style.animation = 'fadeIn 0.5s ease forwards';
                
                // Inject Prices
                document.getElementById('price-display-container').innerHTML = calculatedDisplayHtml;

                // Setup WhatsApp Button (Optional Click)
                const waMsg = `*Arsh Interiors - New Inquiry* 🏢\n\n` +
                              `*Name:* ${name}\n` +
                              `*Location:* ${loc}\n` +
                              `*Property:* ${propType} | *Start:* ${timeline}\n` +
                              `--- Requirement Details ---` + waDetailsString;
                              
                const waBtn = document.getElementById('waConnectBtn');
                waBtn.href = `https://api.whatsapp.com/send?phone=919022104232&text=${encodeURIComponent(waMsg)}`;
                
            }, 1500);
        });
    }
});