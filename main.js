// --- CONFIGURACIÓN DE VELOCIDAD PARA EL MOTOR ---
gsap.config({ nullTargetWarn: false });

// Activamos "Superpoderes" en los elementos que se mueven
gsap.set(".protocol-card, .feature-card", { force3D: true });

document.addEventListener("DOMContentLoaded", () => {
    // Registramos la herramienta de movimiento con el scroll
    gsap.registerPlugin(ScrollTrigger);

    // Encendemos todas las funciones de la página
    initNavbar();
    initHeroAnimations();
    initFeatureCards();
    initPhilosophyText();
    initProtocolStacking();
    initSmoothScroll();
});

// 1. FUNCIÓN DE LA BARRA DE NAVEGACIÓN (Menú de arriba)
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

// 2. FUNCIÓN DE BIENVENIDA (Letras que suben al principio)
function initHeroAnimations() {
    gsap.fromTo(".hero-text", 
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power3.out", delay: 0.2 }
    );
}

// 3. FUNCIÓN DE LAS TARJETAS DE SERVICIOS (Interactividad)
function initFeatureCards() {
    // Tarjeta 1: El mezclador de fases
    const shufflerContainer = document.getElementById("shuffler-container");
    const shuffleData = [
        { title: "Diagnóstico", detail: "Análisis de brechas" },
        { title: "Ejecución", detail: "Pilotos y escalamiento" },
        { title: "Resultados", detail: "Indicadores OKR" }
    ];
    
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
    lucide.createIcons({ root: shufflerContainer });
    
    let cards = gsap.utils.toArray(shufflerContainer.children);
    function applyShuffleStyles() {
        cards.forEach((card, index) => {
            let yOffset = index * 12;
            let scale = 1 - (index * 0.05);
            let opacity = 1 - (index * 0.2);
            card.style.transform = `translateY(${yOffset}px) scale(${scale})`;
            card.style.opacity = opacity;
            card.style.zIndex = 10 - index;
        });
    }
    applyShuffleStyles();
    setInterval(() => { cards.unshift(cards.pop()); applyShuffleStyles(); }, 3000);

    // Tarjeta 2: Efecto de máquina de escribir
    const typeText = ["Identificando oportunidades...", "Calculando ventajas...", "Formando talento...", "Integración finalizada."];
    const typeEl = document.getElementById("typewriter-text");
    let currentIdx = 0;
    
    function typeEffect() {
        if(currentIdx >= typeText.length) currentIdx = 0;
        let text = typeText[currentIdx];
        typeEl.innerHTML = '';
        let i = 0;
        let timer = setInterval(() => {
            if(i < text.length) { typeEl.innerHTML += text.charAt(i); i++; }
            else {
                clearInterval(timer);
                typeEl.innerHTML += '<span class="cursor inline-block w-2 h-4 bg-accent ml-1 align-middle animate-pulse-fast"></span>';
                setTimeout(() => { currentIdx++; typeEffect(); }, 2000);
            }
        }, 50);
    }
    setTimeout(typeEffect, 1000);

    // Tarjeta 3: El cursor que se mueve solo
    const gridContainer = document.getElementById("scheduler-grid");
    for(let i=0; i<14; i++) {
        let el = document.createElement("div");
        el.className = "w-full aspect-square rounded-md border border-white/20 bg-white/5 transition-colors duration-300";
        el.id = `cell-${i}`;
        gridContainer.appendChild(el);
    }
    
    const demoCursor = document.getElementById("demo-cursor");
    function runCursorAnimation() {
        let targetIdx = Math.floor(Math.random() * 14);
        let targetCell = document.getElementById(`cell-${targetIdx}`);
        Array.from(gridContainer.children).forEach(c => c.classList.remove('bg-accent', 'border-accent'));
        let tRect = targetCell.getBoundingClientRect();
        let cRect = targetCell.parentElement.getBoundingClientRect();
        let relX = tRect.left - cRect.left + (tRect.width / 2);
        let relY = tRect.top - cRect.top + (tRect.height / 2);
        
        let tl = gsap.timeline({ onComplete: () => { setTimeout(runCursorAnimation, 1000); } });
        tl.to(demoCursor, { x: relX - 10, y: relY - 10, duration: 1.5, ease: "power2.inOut" })
          .to(demoCursor, { scale: 0.8, duration: 0.1 })
          .add(() => { targetCell.classList.add('bg-accent', 'border-accent'); })
          .to(demoCursor, { scale: 1, duration: 0.1 })
          .to(demoCursor, { x: cRect.width + 20, y: cRect.height, duration: 1.2, ease: "power2.in" }, "+=0.2");
    }
    setTimeout(runCursorAnimation, 1000);

    gsap.from(".feature-card", {
        scrollTrigger: { trigger: "#servicios", start: "top 70%" },
        y: 80, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out"
    });
}

// 4. FUNCIÓN DE TEXTOS DE FILOSOFÍA
function initPhilosophyText() {
    gsap.utils.toArray(".philosophy-line").forEach((line) => {
        gsap.from(line, {
            scrollTrigger: { trigger: line, start: "top 80%" },
            y: 50, opacity: 0, duration: 1.2, ease: "power3.out"
        });
    });
}

// 5. FUNCIÓN DE TARJETAS APILADAS (¡LA QUE OPTIMIZAMOS PARA MÓVIL!)
function initProtocolStacking() {
    const cards = gsap.utils.toArray(".protocol-card");
    const esCelular = window.innerWidth < 768;

    cards.forEach((card, i) => {
        if(i === cards.length - 1) return; 
        
        ScrollTrigger.create({
            trigger: card,
            start: "top " + (esCelular ? "80px" : (96 + (i * 32)) + "px"),
            endTrigger: ".protocol-container",
            end: "bottom top",
            scrub: esCelular ? 0.5 : true,
            animation: gsap.to(card, {
                scale: esCelular ? 0.95 : 0.92,
                opacity: esCelular ? 0.6 : 0.4,
                filter: esCelular ? "blur(0px)" : "blur(10px)", // Quitamos blur en móvil
                ease: "none"
            })
        });
    });
    
    // Animaciones de apoyo
    gsap.to(".spin-slow", { rotation: 360, duration: 30, repeat: -1, ease: "linear" });
    gsap.to(".spin-slow-reverse", { rotation: -360, duration: 35, repeat: -1, ease: "linear" });
    gsap.to(".laser-scan", { y: esCelular ? 120 : 200, duration: 2, yoyo: true, repeat: -1, ease: "sine.inOut" });

    const waveform = document.querySelector(".waveform-svg path");
    if(waveform) {
        const len = waveform.getTotalLength();
        waveform.style.strokeDasharray = len;
        waveform.style.strokeDashoffset = len;
        gsap.to(waveform, { strokeDashoffset: 0, duration: 3, repeat: -1, ease: "linear", scrollTrigger: { trigger: waveform, start: "top 80%" } });
    }
}

// 6. FUNCIÓN DE DESPLAZAMIENTO SUAVE (Para los botones del menú)
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) { target.scrollIntoView({ behavior: 'smooth' }); }
        });
    });
}
