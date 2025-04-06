import { animateEggSelection, animateResetEgg, setupEggHoverAnimation } from './animations.js';

// ---------------------------
// 状態管理
// ---------------------------
const initialMembers = ['A', 'B', 'C'];
let remainingMembers = [...initialMembers];

// ---------------------------
// DOM要素のキャッシュ
// ---------------------------
const eggContainer = document.getElementById('eggContainer');
const candidateListEl = document.getElementById('candidateList');
const startSelectionBtn = document.getElementById('startSelectionBtn');
const addMemberBtn = document.getElementById('addMemberBtn');
const newMemberInput = document.getElementById('newMemberInput');
const resetMemberListBtn = document.getElementById('resetMemberListBtn');
const mainHeading = document.getElementById('mainHeading');
const restartBtn = document.getElementById('restartBtn');

// ---------------------------
// 初期設定：卵エリアのホバーアニメーション設定
// ---------------------------
setupEggHoverAnimation(eggContainer);

// ---------------------------
// 候補リストの更新＆削除処理
// ---------------------------
function updateCandidateList() {
  if (!candidateListEl) return;
  candidateListEl.innerHTML = "";

  remainingMembers.forEach((member, index) => {
    const candidateItem = document.createElement("div");
    candidateItem.classList.add("candidate-item");
    candidateItem.style.display = "flex";
    candidateItem.style.justifyContent = "space-between";
    candidateItem.style.alignItems = "center";
    candidateItem.style.marginBottom = "4px";
    candidateItem.innerHTML = `<span>🐤 ${member}</span>`;

    // 削除ボタンの設定
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "削除";
    deleteBtn.style.backgroundColor = "#FF6B6B";
    deleteBtn.style.color = "white";
    deleteBtn.style.border = "none";
    deleteBtn.style.padding = "2px 6px";
    deleteBtn.style.borderRadius = "4px";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.addEventListener("click", () => removeCandidate(index));

    candidateItem.appendChild(deleteBtn);
    candidateListEl.appendChild(candidateItem);
  });

  // 候補が0の場合は「卵を割る」ボタンを無効化
  if (startSelectionBtn) {
    const disable = remainingMembers.length === 0;
    startSelectionBtn.disabled = disable;
    startSelectionBtn.classList.toggle('opacity-50', disable);
    startSelectionBtn.classList.toggle('cursor-not-allowed', disable);
  }
}

function removeCandidate(index) {
  remainingMembers.splice(index, 1);
  updateCandidateList();
}

// ---------------------------
// イベント：候補追加
// ---------------------------
addMemberBtn.addEventListener("click", () => {
  const name = newMemberInput.value.trim();
  if (name) {
    remainingMembers.push(name);
    newMemberInput.value = "";
    updateCandidateList();
  } else {
    alert("候補を入力してください");
  }
});

// ---------------------------
// イベント：抽選開始（卵を割る）
// ---------------------------
startSelectionBtn.addEventListener('click', () => {
  if (remainingMembers.length === 0) {
    alert('候補がありません！');
    return;
  }

  eggContainer.classList.remove('hidden');

  // 候補リストの各アイテムを吸い込む演出
  const chickElements = document.querySelectorAll('#candidateList .candidate-item');
  chickElements.forEach((chick, index) => {
    const rect = chick.getBoundingClientRect();
    const eggRect = eggContainer.getBoundingClientRect();
    const dx = eggRect.left + eggRect.width / 2 - (rect.left + rect.width / 2);
    const dy = eggRect.top + eggRect.height / 2 - (rect.top + rect.height / 2);

    gsap.to(chick, {
      x: dx,
      y: dy,
      scale: 0.3,
      opacity: 0,
      duration: 0.6,
      delay: index * 0.1,
      ease: "power1.in",
      onComplete: () => chick.style.display = 'none'
    });
  });

  // 候補数に応じた遅延後に抽選開始
  setTimeout(selectRandomMember, remainingMembers.length * 100 + 500);
});

// ---------------------------
// 表示：選ばれた候補の名前オーバーレイ
// ---------------------------
function showSelectedMember(text, isFake = false) {
  const existingOverlay = document.getElementById('selectedMemberOverlay');
  if (existingOverlay) existingOverlay.remove();

  const overlay = document.createElement('div');
  overlay.id = 'selectedMemberOverlay';
  overlay.innerText = text;
  overlay.style.position = 'fixed';
  overlay.style.top = '50%';
  overlay.style.left = '50%';
  overlay.style.transform = 'translate(-50%, -50%)';
  overlay.style.fontSize = 'clamp(1.5rem, 6vw, 4rem)'; // スマホ〜PC対応
  overlay.style.color = '#FFD700';
  overlay.style.fontWeight = 'bold';
  overlay.style.textAlign = 'center';
  overlay.style.textShadow = '0 0 20px rgba(255,255,255,0.9)';
  overlay.style.zIndex = '3000';
  overlay.style.pointerEvents = 'none';
  overlay.style.maxWidth = '90vw';
  overlay.style.width = 'auto';
  overlay.style.padding = '0 1rem';
  overlay.style.wordBreak = 'break-word';
  overlay.style.lineHeight = '1.2';

  document.body.appendChild(overlay);

  gsap.fromTo(overlay,
    { scale: 0.5, rotation: -30, opacity: 0, filter: 'blur(10px)' },
    { scale: 1.5, rotation: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'expo.out' }
  );
}

// ---------------------------
// 抽選処理：卵クリックでアニメーション開始
// ---------------------------
let isAnimating = false;
function selectRandomMember() {
  if (isAnimating) return;
  if (remainingMembers.length === 0) {
    alert("メンバーがいません！");
    return;
  }

  isAnimating = true;
  let animationStarted = false; // アニメーション開始済みフラグ

  // UI非表示
  candidateListEl.style.display = 'none';
  newMemberInput.style.display = 'none';
  addMemberBtn.style.display = 'none';
  resetMemberListBtn.style.display = 'none';
  startSelectionBtn.style.display = 'none';
  mainHeading.style.display = 'none';

  const egg = eggContainer.querySelector('svg');
  eggContainer.style.zIndex = "1000";

  // ランダムに選ばれた候補
  const randomIndex = Math.floor(Math.random() * remainingMembers.length);
  const selectedMember = remainingMembers[randomIndex];

  const eggRect = eggContainer.getBoundingClientRect();
  const dx = window.innerWidth / 2 - (eggRect.left + eggRect.width / 2);
  const dy = window.innerHeight / 2 - (eggRect.top + eggRect.height / 2);
  const isAlreadyCentered = Math.abs(dx) < 2 && Math.abs(dy) < 2;

  // アニメーション開始関数
  const startAnimation = () => {
    if (animationStarted) return;
    animationStarted = true;
    gsap.set(egg, { rotation: 0, scale: 1, opacity: 1 });

    animateEggSelection(egg, selectedMember, remainingMembers, (name, isFake) => {
      showSelectedMember(name, isFake);
      restartBtn.classList.remove('hidden');
      setTimeout(() => {
        isAnimating = false;
        animationStarted = false;
      }, 1500);
    });
  };

  if (isAlreadyCentered) {
    startAnimation();
  } else {
    gsap.to(eggContainer, {
      duration: 0.5,
      x: dx,
      y: dy,
      ease: "power2.out",
      onComplete: startAnimation
    });

    // fallback：onComplete が実行されなかった場合に備える
    setTimeout(() => {
      if (!animationStarted) {
        console.warn('onComplete failed, fallback triggered');
        startAnimation();
      }
    }, 800);
  }
}

eggContainer.addEventListener('click', selectRandomMember);

// ---------------------------
// 候補リストリセット処理
// ---------------------------
function resetMemberList() {
  remainingMembers = [...initialMembers];
  animateResetEgg(eggContainer);
  updateCandidateList();
}

resetMemberListBtn.addEventListener('click', resetMemberList);

// ---------------------------
// Retry（やり直し）処理：卵・UIの復元
// ---------------------------
function restartAnimation() {
  const existingOverlay = document.getElementById('selectedMemberOverlay');
  if (existingOverlay) existingOverlay.remove();

  eggContainer.classList.remove('hidden');
  updateCandidateList();
  isAnimating = false; // 抽選フラグリセット

  gsap.to(eggContainer, {
    x: 0,
    y: 0,
    duration: 0.5,
    ease: "power2.out",
    onComplete: () => {
      const egg = eggContainer.querySelector('svg');
      animateResetEgg(egg);
      gsap.fromTo(egg, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" });

      // UI表示の復元
      candidateListEl.style.display = '';
      newMemberInput.style.display = '';
      addMemberBtn.style.display = '';
      resetMemberListBtn.style.display = '';
      startSelectionBtn.style.display = '';
      mainHeading.style.display = '';
      restartBtn.classList.add('hidden');
      eggContainer.style.zIndex = "";
    }
  });
}

restartBtn.addEventListener('click', restartAnimation);

// ---------------------------
// キーボード入力（Enterキー）で候補追加
// ---------------------------
newMemberInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    addMemberBtn.click();
  }
});

// ---------------------------
// 初期表示：候補リスト更新
// ---------------------------
updateCandidateList();
