// animations.js

/**
 * Helper: 落雷エフェクトを生成する関数
 */
function showLightningEffect() {
  const lightning = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  lightning.setAttribute("width", "100");
  lightning.setAttribute("height", "100");
  lightning.setAttribute("viewBox", "0 0 100 100");

  Object.assign(lightning.style, {
    position: "fixed",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%) scale(1.5)",
    zIndex: "2000",
    pointerEvents: "none"
  });

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

/**
 * Confetti（紙吹雪）を生成し、アニメーションさせる関数
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

/**
 * 卵アニメーション（抽選）の実行
 *
 * @param {HTMLElement} egg - 対象の卵要素
 * @param {string} selectedMember - 抽選で選ばれた候補
 * @param {Array<string>} allMembers - 全候補リスト
 * @param {Function} onDisplayFinal - 最終結果表示のコールバック
 */
export function animateEggSelection(egg, selectedMember, allMembers, onDisplayFinal) {
  // 特別な演出の確率判定
  const isSuperKakutei = Math.random() < (1 / 40);
  const isNormalKakutei = !isSuperKakutei && Math.random() < (1 / 20);
  const isReach = !isSuperKakutei && !isNormalKakutei && Math.random() < (1 / 40);
  const useFakeReveal = Math.random() < 0.1; // 10% の確率でフェイク演出

  const tl = gsap.timeline();

  // リーチ演出
  if (isReach) {
    setTimeout(() => {
      const reach = document.createElement('div');
      reach.innerText = 'リーチ！！';
      reach.id = 'reachEffect';
      Object.assign(reach.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '6rem',
        fontWeight: 'bold',
        color: 'red',
        zIndex: '9999',
        pointerEvents: 'none',
        textShadow: '0 0 20px rgba(255,0,0,0.7)'
      });
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

  // 通常or確定時の演出：卵シェイプの色変更、落雷、フラッシュ
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
    Object.assign(flash.style, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'white',
      opacity: '0.9',
      zIndex: '9999'
    });
    document.body.appendChild(flash);

    gsap.to(flash, {
      duration: 0.5,
      opacity: 0,
      ease: 'power2.out',
      onComplete: () => flash.remove()
    });
  }

  // 卵のアニメーションシーケンス
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
      // フェイク演出の場合は、まず偽の候補名を表示し、後で正しい名前に変更
      if (useFakeReveal && allMembers.length > 1) {
        const otherCandidates = allMembers.filter(name => name !== selectedMember);
        const fake = otherCandidates.length > 0 
          ? otherCandidates[Math.floor(Math.random() * otherCandidates.length)]
          : selectedMember;
        onDisplayFinal(`${fake} it is!`, true);

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

/**
 * 卵リセット時のアニメーション処理
 *
 * @param {HTMLElement} egg - 対象の卵要素
 */
export function animateResetEgg(egg) {
  egg.classList.remove('hidden');
  gsap.set(egg, { rotation: 0, scale: 1, opacity: 1 });
}

/**
 * 卵エリアのホバー時アニメーション設定
 *
 * @param {HTMLElement} eggContainer - 卵エリアのコンテナ
 */
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