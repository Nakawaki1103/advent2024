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

// egg の中に表示エリアがないので、毎回新しく作る（卵の上に絶対配置）
function showSelectedMember(name) {
  const existing = document.getElementById('selectedMemberOverlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'selectedMemberOverlay';
  overlay.innerHTML = ` ${name} it is！ `;
  overlay.style.position = 'absolute';
  overlay.style.top = '50%';
  overlay.style.left = '50%';
  overlay.style.transform = 'translate(-50%, -50%)';
  overlay.style.fontSize = '2.5rem';
  overlay.style.color = '#FFD700';
  overlay.style.fontWeight = 'bold';
  overlay.style.textAlign = 'center';
  overlay.style.textShadow = '0 0 20px rgba(255,255,255,0.9)';
  overlay.style.zIndex = '2000';
  overlay.style.pointerEvents = 'none';

  document.querySelector('.animation-area').appendChild(overlay);

  gsap.fromTo(overlay, 
    { y: 80, scale: 0.3, rotation: -20, opacity: 0 }, 
    { y: 0, scale: 1.5, rotation: 0, opacity: 1, duration: 1, ease: "elastic.out(1, 0.5)" }
  );
}

// ----------------------------------------
// 卵クリック：中央移動 → 割れるアニメーション
// ----------------------------------------
let isAnimating = false;
function selectRandomMember() {
  if (isAnimating) return;
  if (remainingMembers.length === 0) {
    alert("候補がいないです！");
    return;
  }

  isAnimating = true;

  // UIを非表示にする
  document.getElementById('candidateList').style.display = 'none';
  document.getElementById('newMemberInput').style.display = 'none';
  document.getElementById('addMemberBtn').style.display = 'none';
  document.getElementById('resetMemberListBtn').style.display = 'none';

  const eggContainer = document.getElementById('eggContainer');
  const egg = document.querySelector('#eggContainer svg'); // ← SVGを直接アニメ対象に！
  eggContainer.style.zIndex = "1000";

  gsap.set(eggContainer, { clearProps: 'all' });

  const randomIndex = Math.floor(Math.random() * remainingMembers.length);
  const selectedMember = remainingMembers[randomIndex];

  const eggRect = eggContainer.getBoundingClientRect();
  const dx = window.innerWidth / 2 - (eggRect.left + eggRect.width / 2);
  const dy = window.innerHeight / 2 - (eggRect.top + eggRect.height / 2);

  gsap.to(eggContainer, {
    duration: 0.5,
    x: dx,
    y: dy,
    ease: "power2.out",
    onComplete: function () {
      gsap.set(egg, { rotation: 0, scale: 1, opacity: 1 });

      animateEggSelection(egg, selectedMember, () => {
        showSelectedMember(selectedMember);
        document.getElementById('restartBtn').classList.remove('hidden');

        setTimeout(() => {
          isAnimating = false;
        }, 1500);
      });
    }
  });
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
  const egg = document.getElementById('eggContainer');
  
  gsap.to(egg, {
    x: 0,
    y: 0,
    duration: 0.5,
    ease: "power2.out",
    onComplete: function() {
      animateResetEgg(egg);
      gsap.fromTo(egg, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" });
      
      // 操作エリアを再表示
      document.getElementById('candidateList').style.display = '';
      document.getElementById('newMemberInput').style.display = '';
      document.getElementById('addMemberBtn').style.display = '';
      document.getElementById('resetMemberListBtn').style.display = '';
      
      // Retry ボタンは非表示に
      document.getElementById('restartBtn').classList.add('hidden');

      egg.style.zIndex = "";
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
