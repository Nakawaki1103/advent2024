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
  
  export function animateEggSelection(egg, displayElement, selectedMember) {
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
      ease: "power1.inOut",
      onComplete: () => {
        egg.classList.add("hidden");
        gsap.set(egg, { opacity: 1, scale: 1 });
      }
    })
    // 0.3秒前に候補表示と紙吹雪生成を同時に実行
    .call(() => {
      displayElement.innerHTML = `${selectedMember} it is!`;
      gsap.fromTo(displayElement, 
        { y: 60, scale: 0.2, opacity: 0 }, 
        { y: 0, scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }
      );
      createConfetti();
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
  