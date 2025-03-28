/*
  animations.js
  -------------
  Functions for egg and confetti animations.
*/

export function createConfetti() {
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
    const confettiContainer = document.getElementById('confetti');
    if (!confettiContainer) return;
  
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'absolute w-2 h-2 rounded-full';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = '50%';
      confetti.style.top = '50%';
      confettiContainer.appendChild(confetti);
  
      gsap.fromTo(confetti, 
        { opacity: 1, scale: 0 },
        { 
           x: gsap.utils.random(-300, 300), 
           y: gsap.utils.random(-300, 300), 
           rotation: gsap.utils.random(0, 360), 
           scale: 1,
           opacity: 0,
           duration: gsap.utils.random(0.8, 1.5),
           ease: 'power2.out',
           onComplete: () => confettiContainer.removeChild(confetti)
        }
      );
    }
  }
  
  export function animateEggSelection(egg, selectedMember, onDisplay) {
    const tl = gsap.timeline();
  
    tl.to(egg, {
      rotation: 5,
      duration: 0.1,
      repeat: 5,
      yoyo: true,
      ease: "power1.inOut"
    })
    .to(egg, {
      scale: 1.2,
      duration: 0.3,
      delay: 0.5,
      ease: "power1.inOut"
    })
    .to(egg, {
      opacity: 0,
      scale: 1.5,
      duration: 0.3,
      delay: 0.1,
      ease: "power1.inOut"
    })
    .call(() => {
      egg.parentElement.classList.add('hidden'); // svgの親（eggContainer）を非表示に
      gsap.set(egg, { opacity: 1, scale: 1 });
    })
    .call(() => {
      onDisplay(); // ← ここで外から渡された表示処理を実行！
      createConfetti();
      setTimeout(() => createConfetti(), 400); // 二段紙吹雪
    }, null, "-=0.3");
  }
  
  export function animateResetEgg(egg) {
    egg.classList.remove('hidden');
    gsap.set(egg, { rotation: 0, scale: 1, opacity: 1 });
  }
  
  export function setupEggHoverAnimation(eggContainer) {
    eggContainer.addEventListener('mouseenter', () => {
      gsap.to(eggContainer, {
        scaleY: 0.85,
        duration: 0.1,
        ease: "power1.out"
      });
      gsap.to(eggContainer, {
        scaleY: 1,
        duration: 0.3,
        delay: 0.1,
        ease: "bounce.out"
      });
    });
  
    eggContainer.addEventListener('mouseleave', () => {
      gsap.killTweensOf(eggContainer);
      gsap.to(eggContainer, {
        scaleY: 1,
        duration: 0.2,
        ease: "power1.out"
      });
    });
  }
  