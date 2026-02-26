// --- CONFIGURACIÓN PARA QUE EL MOTOR VAYA RÁPIDO ---
gsap.config({ nullTargetWarn: false });

// Esto le dice al celular: "¡Prepárate que vamos a mover estas piezas!"
gsap.set(".protocol-card, .feature-card", { force3D: true });

document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);
    initNavbar();
    initHeroAnimations();
    initFeatureCards();
    initPhilosophyText();
    initProtocolStacking(); // Aquí es donde ocurre la magia
    initSmoothScroll();
});

// --- LAS FUNCIONES SIGUEN IGUAL QUE ANTES ---

function initNavbar() {
    const navbar = document.getElementById("navbar");
    ScrollTrigger.create({
        trigger: "body",
        start: "100px top",
        onEnter: () => { navbar.classList.add("nav-scrolled"); navbar.classList.remove("text-white"); },
        onLeaveBack: () => { navbar.classList.remove("nav-scrolled"); navbar.classList.add("text-white"); }
    });
}

function initHeroAnimations() {
    gsap.fromTo(".hero-text", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power3.out", delay: 0.2 });
}

// --- ESTA ES LA PARTE QUE OPTIMIZAMOS PARA TU CELULAR ---
function initProtocolStacking() {
    const cards = gsap.utils.toArray(".protocol-card");
    // Le preguntamos al navegador: "¿Es una pantalla pequeña (móvil)?"
    const esCelular = window.innerWidth < 768;

    cards.forEach((card, i) => {
        if(i === cards.length - 1) return; 
        
        ScrollTrigger.create({
            trigger: card,
            // Si es celular, le damos un espacio diferente arriba
            start: "top " + (esCelular ? "80px" : (96 + (i * 32)) + "px"),
            endTrigger: ".protocol-container",
            end: "bottom top",
            // Si es celular, el movimiento es un poquito más suave (0.5)
            scrub: esCelular ? 0.5 : true,
            animation: gsap.to(card, {
                scale: esCelular ? 0.95 : 0.92,
                opacity: esCelular ? 0.6 : 0.4,
                // Si es celular, quitamos el efecto de "borroso" porque lo pone lento
                filter: esCelular ? "blur(0px)" : "blur(10px)",
                ease: "none"
            })
        });
    });

    // Animaciones de decoración
    gsap.to(".spin-slow", { rotation: 360, duration: 30, repeat: -1, ease: "linear" });
    gsap.to(".spin-slow-reverse", { rotation: -360, duration: 35, repeat: -1, ease: "linear" });
    gsap.to(".laser-scan", { y: esCelular ? 120 : 200, duration: 2, yoyo: true, repeat: -1, ease: "sine.inOut" });
}

// --- COPIAR LAS DEMÁS FUNCIONES DE TU ARCHIVO ANTERIOR AQUÍ ---
// (Por espacio no pongo todo el archivo, pero asegúrate de que initFeatureCards, 
// initPhilosophyText e initSmoothScroll estén en tu archivo final).
