document.addEventListener("DOMContentLoaded", () => {
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    initNavbar();
    initHeroAnimations();
    initFeatureCards();
    initPhilosophyText();
    initProtocolStacking();
    initSmoothScroll();
});

function initNavbar() {
    const navbar = document.getElementById("navbar");
    
    ScrollTrigger.create({
        trigger: "body",
        start: "100px top",
        onEnter: () => {
            navbar.classList.add("nav-scrolled");
            navbar.classList.remove("text-white");
        },
        onLeaveBack: () => {
            navbar.classList.remove("nav-scrolled");
            navbar.classList.add("text-white");
        }
    });
}

function initHeroAnimations() {
    const heroTexts = gsap.utils.toArray(".hero-text");
    
    gsap.fromTo(heroTexts, 
        { y: 60, opacity: 0 },
        { 
            y: 0, 
            opacity: 1, 
            duration: 1.2, 
            stagger: 0.15, 
            ease: "power3.out",
            delay: 0.2
        }
    );
}

function initFeatureCards() {
    // ----------------------------------------------------
    // CARD 1: Diagnostic Shuffler
    // ----------------------------------------------------
    const shufflerContainer = document.getElementById("shuffler-container");
    const shuffleData = [
        { title: "Diagnóstico", detail: "Análisis de brechas" },
        { title: "Ejecución", detail: "Pilotos y escalamiento" },
        { title: "Resultados", detail: "Indicadores OKR" }
    ];
    
    // Create elements
    shuffleData.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = "absolute inset-0 bg-background border border-primary/10 rounded-3xl p-5 flex flex-col justify-between shadow-sm transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]";
        card.innerHTML = `
            <div class="flex justify-between items-center text-xs font-mono text-dark/50">
                <span>FASE 0${index + 1}</span>
                <i data-lucide="activity" class="w-4 h-4 text-accent"></i>
            </div>
            <div>
                <div class="font-sans font-bold text-primary text-xl">${item.title}</div>
                <div class="font-sans text-sm text-dark/70">${item.detail}</div>
            </div>
        `;
        shufflerContainer.appendChild(card);
    });
    // Reinitialize lucide icons for newly added elements
    lucide.createIcons({ root: shufflerContainer });
    
    let cards = gsap.utils.toArray(shufflerContainer.children);
    
    function applyShuffleStyles() {
        cards.forEach((card, index) => {
            // Index 0 is front, index 1 is middle, index 2 is back
            let reverseIndex = cards.length - 1 - index;
            
            let yOffset = index * 12;
            let scale = 1 - (index * 0.05);
            let opacity = 1 - (index * 0.2);
            let zIndex = 10 - index;
            
            card.style.transform = `translateY(${yOffset}px) scale(${scale})`;
            card.style.opacity = opacity;
            card.style.zIndex = zIndex;
        });
    }
    
    applyShuffleStyles();
    
    setInterval(() => {
        // Move last element to front of array
        cards.unshift(cards.pop());
        // re-apply
        applyShuffleStyles();
    }, 3000);

    // ----------------------------------------------------
    // CARD 2: Telemetry Typewriter
    // ----------------------------------------------------
    const typeText = [
        "Identificando oportunidades de nicho...",
        "Calculando ventajas competitivas...",
        "Formando talento directivo...",
        "Integración comercial B2B finalizada."
    ];
    
    const typeEl = document.getElementById("typewriter-text");
    let currentPhraseIndex = 0;
    
    function typeEffect() {
        if(currentPhraseIndex >= typeText.length) currentPhraseIndex = 0;
        
        let text = typeText[currentPhraseIndex];
        typeEl.innerHTML = '';
        
        let i = 0;
        let internalTimer = setInterval(() => {
            if(i < text.length) {
                typeEl.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(internalTimer);
                typeEl.innerHTML += '<span class="cursor inline-block w-2 h-4 bg-accent ml-1 align-middle animate-pulse-fast"></span>';
                
                setTimeout(() => {
                    currentPhraseIndex++;
                    typeEffect();
                }, 2000);
            }
        }, 50);
    }
    
    setTimeout(typeEffect, 1000);

    // ----------------------------------------------------
    // CARD 3: Cursor Protocol Scheduler
    // ----------------------------------------------------
    const gridContainer = document.getElementById("scheduler-grid");
    // Generate 14 cells
    for(let i=0; i<14; i++) {
        let el = document.createElement("div");
        el.className = "w-full aspect-square rounded-md border border-white/20 bg-white/5 transition-colors duration-300";
        el.id = `cell-${i}`;
        gridContainer.appendChild(el);
    }
    
    const cursor = document.getElementById("demo-cursor");
    
    function runCursorAnimation() {
        let targetIndex = Math.floor(Math.random() * 14);
        let targetCell = document.getElementById(`cell-${targetIndex}`);
        
        // Reset old cells
        Array.from(gridContainer.children).forEach(c => c.classList.remove('bg-accent', 'border-accent'));
        
        // Ensure boundaries are calculated correctly relative to parent container
        let targetCellRect = targetCell.getBoundingClientRect();
        let containerRect = targetCell.parentElement.getBoundingClientRect();
        
        // Calculate relative pos
        let relX = targetCellRect.left - containerRect.left + (targetCellRect.width / 2);
        let relY = targetCellRect.top - containerRect.top + (targetCellRect.height / 2);
        
        let tl = gsap.timeline({
            onComplete: () => {
                setTimeout(runCursorAnimation, 1000);
            }
        });
        
        tl.to(cursor, {
            x: relX - 10,
            y: relY - 10,
            duration: 1.5,
            ease: "power2.inOut"
        })
        .to(cursor, { scale: 0.8, duration: 0.1, ease: "power1.in" }) // Click down
        .add(() => {
            targetCell.classList.add('bg-accent', 'border-accent');
        })
        .to(cursor, { scale: 1, duration: 0.1, ease: "power1.out" }) // Click up
        .to(cursor, { 
            x: containerRect.width + 20, 
            y: containerRect.height, 
            duration: 1.2, 
            ease: "power2.in" 
        }, "+=0.2"); // Move away
    }
    
    // Wait for layout to settle before calculating bounding rects
    setTimeout(runCursorAnimation, 1000);
    
    // Fade in all feature cards
    gsap.from(".feature-card", {
        scrollTrigger: {
            trigger: "#servicios",
            start: "top 70%",
        },
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
    });
}

function initPhilosophyText() {
    const lines = gsap.utils.toArray(".philosophy-line");
    
    lines.forEach((line, i) => {
        gsap.from(line, {
            scrollTrigger: {
                trigger: line,
                start: "top 80%",
            },
            y: 50,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out"
        });
    });
}

function initProtocolStacking() {
    const cards = gsap.utils.toArray(".protocol-card");
    
    cards.forEach((card, i) => {
        if(i === cards.length - 1) return; // Skip last card
        
        // When the card reaches the top and starts sticking
        ScrollTrigger.create({
            trigger: card,
            start: "top " + (96 + (i * 32)) + "px", // Approximate sticky offset
            endTrigger: ".protocol-container",
            end: "bottom top",
            scrub: true,
            animation: gsap.to(card, {
                scale: 0.92,
                opacity: 0.4,
                filter: "blur(10px)",
                ease: "none"
            })
        });
    });
    
    // Custom SVG animations for Protocol Cards
    
    // Rotate 1
    gsap.to(".spin-slow", { rotation: 360, duration: 20, repeat: -1, ease: "linear" });
    gsap.to(".spin-slow-reverse", { rotation: -360, duration: 25, repeat: -1, ease: "linear" });
    
    // Laser line scan
    gsap.to(".laser-scan", {
        y: 200,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
    });
    
    // EKG Waveform Path Animation
    const waveform = document.querySelector(".waveform-svg path");
    const len = waveform.getTotalLength();
    waveform.style.strokeDasharray = len;
    waveform.style.strokeDashoffset = len;
    
    gsap.to(waveform, {
        strokeDashoffset: 0,
        duration: 3,
        repeat: -1,
        ease: "linear",
        scrollTrigger: {
            trigger: waveform,
            start: "top 80%"
        }
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetEl = document.querySelector(targetId);
            if(targetEl) {
                targetEl.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}
