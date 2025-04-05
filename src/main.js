import { animateEggSelection, animateResetEgg, setupEggHoverAnimation } from './animations.js';

const initialMembers = ['A', 'B', 'C'];
let remainingMembers = [...initialMembers];

// 卵エリアのホバーアニメーションを設定
const eggContainer = document.getElementById('eggContainer');
setupEggHoverAnimation(eggContainer);

// ----------------------------------------
// 候補リスト更新・削除処理
// ----------------------------------------
function updateCandidateList() {
  const candidateListElement = document.getElementById('candidateList');
  const startBtn = document.getElementById('startSelectionBtn');
  if (!candidateListElement) return;

  candidateListElement.innerHTML = "";

  remainingMembers.forEach((member, index) => {
    const candidateItem = document.createElement("div");
    candidateItem.classList.add("candidate-item");
    candidateItem.style.display = "flex";
    candidateItem.style.justifyContent = "space-between";
    candidateItem.style.alignItems = "center";
    candidateItem.style.marginBottom = "4px";
    candidateItem.innerHTML = `<span>🐤 ${member}</span>`;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "削除";
    deleteBtn.style.backgroundColor = "#FF6B6B";
    deleteBtn.style.color = "white";
    deleteBtn.style.border = "none";
    deleteBtn.style.padding = "2px 6px";
    deleteBtn.style.borderRadius = "4px";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.addEventListener("click", () => {
      removeCandidate(index);
    });

    candidateItem.appendChild(deleteBtn);
    candidateListElement.appendChild(candidateItem);
  });

  // ✅ 候補が0なら「卵を割る」ボタンを無効化
  if (startBtn) {
    startBtn.disabled = remainingMembers.length === 0;
    startBtn.classList.toggle('opacity-50', remainingMembers.length === 0);
    startBtn.classList.toggle('cursor-not-allowed', remainingMembers.length === 0);
  }
}

function removeCandidate(index) {
  remainingMembers.splice(index, 1);
  updateCandidateList();
}

// ----------------------------------------
// 候補追加イベント
// ----------------------------------------
document.getElementById("addMemberBtn").addEventListener("click", () => {
  const input = document.getElementById("newMemberInput");
  const name = input.value.trim();
  if (name) {
    remainingMembers.push(name);
    input.value = "";
    updateCandidateList();
  } else {
    alert("候補を入力してください");
  }
});
document.getElementById('startSelectionBtn').addEventListener('click', () => {
  if (remainingMembers.length === 0) {
    alert('候補がありません！');
    return;
  }

  const eggContainer = document.getElementById('eggContainer');
  eggContainer.classList.remove('hidden');

  // 🐤 吸い込み演出（DOMは非表示にするだけ）
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
      onComplete: () => {
        chick.style.display = 'none'; // ← remove じゃなくて非表示！
      }
    });
  });

  // 少し遅れて卵を中央へ
  setTimeout(() => {
    selectRandomMember();
  }, remainingMembers.length * 100 + 500);
});

// egg の中に表示エリアがないので、毎回新しく作る（卵の上に絶対配置）
function showSelectedMember(text, isFake = false) {
  const existing = document.getElementById('selectedMemberOverlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'selectedMemberOverlay';
  overlay.innerText = text;
  overlay.style.position = 'fixed';
  overlay.style.top = '50%';
  overlay.style.left = '50%';
  overlay.style.transform = 'translate(-50%, -50%)';
  overlay.style.fontSize = 'clamp(1.5rem, 6vw, 4rem)'; // 📱スマホ〜PCまで最適
  overlay.style.color = '#FFD700';
  overlay.style.fontWeight = 'bold';
  overlay.style.textAlign = 'center';
  overlay.style.textShadow = '0 0 20px rgba(255,255,255,0.9)';
  overlay.style.zIndex = '3000';
  overlay.style.pointerEvents = 'none';
  overlay.style.maxWidth = '90vw';
  overlay.style.width = 'auto';
  overlay.style.padding = '0 1rem'; // ← 余白つけて見やすく
  overlay.style.wordBreak = 'break-word'; // ← 改行許可
  overlay.style.lineHeight = '1.2';

  document.body.appendChild(overlay);

  gsap.fromTo(overlay,
    {
      scale: 0.5,
      rotation: -30,
      opacity: 0,
      filter: 'blur(10px)',
    },
    {
      scale: 1.5,
      rotation: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1.2,
      ease: 'expo.out',
    }
  );
}

// ----------------------------------------
// 卵クリック：中央移動 → 割れるアニメーション
// ----------------------------------------
let isAnimating = false;
function selectRandomMember() {
  if (isAnimating) return;
  if (remainingMembers.length === 0) {
    alert("メンバーがいません！");
    return;
  }

  isAnimating = true;
  let animationStarted = false; // 追加: アニメーション開始済みフラグ

  // UI の非表示
  document.getElementById('candidateList').style.display = 'none';
  document.getElementById('newMemberInput').style.display = 'none';
  document.getElementById('addMemberBtn').style.display = 'none';
  document.getElementById('resetMemberListBtn').style.display = 'none';
  document.getElementById('startSelectionBtn').style.display = 'none';
  document.getElementById('mainHeading').style.display = 'none';

  const eggContainer = document.getElementById('eggContainer');
  const egg = eggContainer.querySelector('svg');
  eggContainer.style.zIndex = "1000";

  const randomIndex = Math.floor(Math.random() * remainingMembers.length);
  const selectedMember = remainingMembers[randomIndex];

  const eggRect = eggContainer.getBoundingClientRect();
  const dx = window.innerWidth / 2 - (eggRect.left + eggRect.width / 2);
  const dy = window.innerHeight / 2 - (eggRect.top + eggRect.height / 2);

  const isAlreadyCentered = Math.abs(dx) < 2 && Math.abs(dy) < 2;

  const startAnimation = () => {
    if (animationStarted) return; // すでに開始済みなら何もしない
    animationStarted = true;
    gsap.set(egg, { rotation: 0, scale: 1, opacity: 1 });

    animateEggSelection(egg, selectedMember, remainingMembers, (name, isFake) => {
      showSelectedMember(name, isFake);
      document.getElementById('restartBtn').classList.remove('hidden');
      setTimeout(() => {
        isAnimating = false;
        animationStarted = false; // 次回のためにフラグをリセット
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

    // fallback タイマーもフラグで重複防止
    setTimeout(() => {
      if (!animationStarted) {
        console.warn('onComplete failed, fallback triggered');
        startAnimation();
      }
    }, 800);
  }
}

document.getElementById('eggContainer').addEventListener('click', selectRandomMember);

// ----------------------------------------
// 候補リストリセットイベント
// ----------------------------------------
function resetMemberList() {
  remainingMembers = [...initialMembers];
  
  const egg = document.getElementById('eggContainer');
  animateResetEgg(egg);

  updateCandidateList();
}

document.getElementById('resetMemberListBtn').addEventListener('click', resetMemberList);

// ----------------------------------------
// Retry（やり直し）イベント：卵と操作エリアの復元
// ----------------------------------------
function restartAnimation() {
  const existing = document.getElementById('selectedMemberOverlay');
  if (existing) existing.remove();

  const eggContainer = document.getElementById('eggContainer');
  const egg = eggContainer.querySelector('svg');

  eggContainer.classList.remove('hidden');
  updateCandidateList();

  // 🧠 抽選フラグをリセット！（←ここが重要！）
  isAnimating = false;

  gsap.to(eggContainer, {
    x: 0,
    y: 0,
    duration: 0.5,
    ease: "power2.out",
    onComplete: function () {
      animateResetEgg(egg);
      gsap.fromTo(egg, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" });

      // UI表示
      document.getElementById('candidateList').style.display = '';
      document.getElementById('newMemberInput').style.display = '';
      document.getElementById('addMemberBtn').style.display = '';
      document.getElementById('resetMemberListBtn').style.display = '';
      document.getElementById('startSelectionBtn').style.display = '';
      document.getElementById('mainHeading').style.display = '';
      document.getElementById('restartBtn').classList.add('hidden');
      eggContainer.style.zIndex = "";
    }
  });
}

document.getElementById('newMemberInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault(); // Enter キーのデフォルト動作をキャンセル
    document.getElementById('addMemberBtn').click();
  }
});

document.getElementById('restartBtn').addEventListener('click', restartAnimation);

// ----------------------------------------
// 初回：候補リストを更新
// ----------------------------------------
updateCandidateList();
