// animations.js

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

export function animateEggSelection(egg, selectedMember, allMembers, onDisplayFinal) {
  const isSuperKakutei = Math.random() < (1 / 40);
  const isNormalKakutei = !isSuperKakutei && Math.random() < (1 / 20);
  const isReach = !isSuperKakutei && !isNormalKakutei && Math.random() < (1 / 40);
  const useFakeReveal = Math.random() < 0.1; // 10% の確率でフェイク演出

  const tl = gsap.timeline();

  if (isReach) {
    setTimeout(() => {
      const reach = document.createElement('div');
      reach.innerText = 'リーチ！！';
      reach.id = 'reachEffect';
      reach.style.position = 'fixed';
      reach.style.top = '50%';
      reach.style.left = '50%';
      reach.style.transform = 'translate(-50%, -50%)';
      reach.style.fontSize = '6rem';
      reach.style.fontWeight = 'bold';
      reach.style.color = 'red';
      reach.style.zIndex = '9999';
      reach.style.pointerEvents = 'none';
      reach.style.textShadow = '0 0 20px rgba(255,0,0,0.7)';
      document.body.appendChild(reach);

      gsap.fromTo(reach,
        { scale: 0.5, opacity: 0 },
        {
          scale: 1.5,
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(reach, {
              opacity: 0,
              duration: 0.5,
              ease: 'power2.in',
              onComplete: () => reach.remove()
            });
          }
        }
      );
    }, 100);
  }

  if (isNormalKakutei || isSuperKakutei) {
    const eggShape = document.querySelector('#eggShape');
    if (eggShape) {
      gsap.fromTo(eggShape,
        { fill: '#fff7da' },
        {
          fill: '#FFD700',
          repeat: 4,
          yoyo: true,
          duration: 0.2,
          ease: 'power1.inOut'
        }
      );
    }

    showLightningEffect();

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

  tl.to(egg, {
      rotation: 5,
      duration: 0.1,
      repeat: isNormalKakutei || isSuperKakutei ? 12 : 5,
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
      if (useFakeReveal && allMembers.length > 1) {
        // フェイク表示の場合、他の候補から偽の名前を選択
        let fake;
        const otherCandidates = allMembers.filter(name => name !== selectedMember);
        if (otherCandidates.length > 0) {
          fake = otherCandidates[Math.floor(Math.random() * otherCandidates.length)];
        } else {
          fake = selectedMember;
        }
        // 最初に偽の名前を表示
        onDisplayFinal(`${fake} it is!`, true);

        // 3秒後にアニメーションでテキストの変更を開始
        setTimeout(() => {
          const tempText = document.getElementById('selectedMemberOverlay');
          if (tempText) {
            gsap.to(tempText, {
              scale: 1.2,
              rotation: 10,
              color: '#FF4444',
              duration: 0.3,
              ease: 'power1.inOut',
              onComplete: () => {
                tempText.innerText = 'Wait a second... That’s wrong！！';
                gsap.fromTo(tempText,
                  { scale: 0.8, opacity: 0 },
                  { scale: 1.5, opacity: 1, duration: 0.6, ease: 'back.out(2)' }
                );
              }
            });
          }
          // さらに5秒後に最終的な正しい名前を表示
          setTimeout(() => {
            onDisplayFinal(`${selectedMember} it is!`, false);
            createConfetti();
          }, 5000);
        }, 3000);
      } else {
        onDisplayFinal(`${selectedMember} it is!`, false);
        createConfetti();
      }
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

function showLightningEffect() {
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

