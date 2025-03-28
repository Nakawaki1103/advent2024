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
    // 1/50 の確率で確定演出！
    const isKakutei = Math.random() < (1 / 1);
  
    const tl = gsap.timeline();
  
    if (isKakutei) {
      // 🟡 金色フィルアニメ（既存のやつ）
      const eggShape = document.querySelector('#eggShape');
      if (eggShape) {
        gsap.fromTo(eggShape,
          { fill: '#fff7da' },
          {
            fill: '#FFD700',
            repeat: 12,
            yoyo: true,
            duration: 0.2,
            ease: 'power1.inOut'
          }
        );
      }
    
      // ⚡️ 雷エフェクト
      showLightningEffect();
    
      // 💡 フラッシュ演出（既存）
      const flash = document.createElement('div');
      flash.style.position = 'fixed';
      flash.style.top = 0;
      flash.style.left = 0;
      flash.style.width = '100%';
      flash.style.height = '100%';
      flash.style.background = 'white';
      flash.style.opacity = '0.9';
      flash.style.zIndex = '9999';
      document.body.appendChild(flash);
    
      gsap.to(flash, {
        duration: 0.5,
        opacity: 0,
        ease: 'power2.out',
        onComplete: () => flash.remove()
      });
    }
  
    // 卵の割れるモーション
    tl.to(egg, {
      rotation: 5,
      duration: isKakutei ? 0.2 : 0.1,
      repeat: isKakutei ? 8 : 5,
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
        egg.parentElement.classList.add('hidden');
        gsap.set(egg, { opacity: 1, scale: 1 });
      })
      .call(() => {
        onDisplay();
        createConfetti();
        setTimeout(() => createConfetti(), 400);
      }, null, "-=0.3");
  }
  
  export function showLightningEffect() {
    const lightning = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    lightning.setAttribute("width", "100");
    lightning.setAttribute("height", "100");
    lightning.setAttribute("viewBox", "0 0 100 100");
    lightning.style.position = "fixed";
    lightning.style.left = "50%";
    lightning.style.top = "50%";
    lightning.style.transform = "translate(-50%, -50%) scale(1.5)";
    lightning.style.zIndex = "2000";
    lightning.style.pointerEvents = "none";
    lightning.innerHTML = `
      <polygon points="50,10 40,55 55,55 45,90 80,45 60,45 70,10"
        fill="#FFFF00" stroke="#FFD700" stroke-width="5" />
    `;
  
    document.body.appendChild(lightning);
  
    gsap.fromTo(lightning,
      { opacity: 1, scale: 0.8, rotation: -15 },
      {
        opacity: 0,
        scale: 1.4,
        rotation: 15,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => lightning.remove()
      }
    );
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
  