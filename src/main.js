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

// ----------------------------------------
// 卵クリック：中央移動 → 割れるアニメーション
// ----------------------------------------
let isAnimating = false;
function selectRandomMember() {
  if (remainingMembers.length === 0) {
    alert("メンバーがいません！");
    return;
  }

  isAnimating = true;
  
  // 非表示にする（操作エリア）
  document.getElementById('candidateList').style.display = 'none';
  document.getElementById('newMemberInput').style.display = 'none';
  document.getElementById('addMemberBtn').style.display = 'none';
  document.getElementById('resetMemberListBtn').style.display = 'none';
  // Retry ボタンは表示
  document.getElementById('restartBtn').classList.remove('hidden');
  
  const egg = document.getElementById('eggContainer');

  egg.style.zIndex = "1000";
  // 以前の transform をクリア
  gsap.set(egg, { clearProps: 'all' });
  
  const randomIndex = Math.floor(Math.random() * remainingMembers.length);
  const selectedMember = remainingMembers[randomIndex];
  const displayElement = document.getElementById('selectedPerson');
  displayElement.innerHTML = "";
  
  // 卵の現在の中央座標取得
  const eggRect = egg.getBoundingClientRect();
  const eggCenterX = eggRect.left + eggRect.width / 2;
  const eggCenterY = eggRect.top + eggRect.height / 2;
  const viewportCenterX = window.innerWidth / 2;
  const viewportCenterY = window.innerHeight / 2;
  const dx = viewportCenterX - eggCenterX;
  const dy = viewportCenterY - eggCenterY;
  
  // 卵を中央に移動
  gsap.to(egg, {
    duration: 0.5,
    x: dx,
    y: dy,
    ease: "power2.out",
    onComplete: function() {
      gsap.set(egg, { rotation: 0, scale: 1, opacity: 1 });
      // 卵が割れるアニメーション開始
      animateEggSelection(egg, displayElement, selectedMember);
      // animateEggSelection 内で紙吹雪などが実行された後、完了処理で isAnimating を false に戻す
      // ここでの完了処理は、animateEggSelection の onComplete 内で行うか、
      // この関数内で一定の遅延後にフラグをリセットするなどの方法が考えられます。
      
      // 例: 1.5秒後にアニメーション完了と仮定してフラグをリセット
      setTimeout(() => {
        isAnimating = false;
      }, 1500);
    }
  });
}

document.getElementById('eggContainer').addEventListener('click', selectRandomMember);

// ----------------------------------------
// 候補リストリセットイベント
// ----------------------------------------
function resetMemberList() {
  remainingMembers = [...initialMembers];
  const displayElement = document.getElementById('selectedPerson');
  displayElement.innerHTML = 'メンバーリストがリセットされました！';
  const egg = document.getElementById('eggContainer');
  animateResetEgg(egg);
  gsap.fromTo(displayElement, 
    { y: 20, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
  );
  updateCandidateList();
}

document.getElementById('resetMemberListBtn').addEventListener('click', resetMemberList);

// ----------------------------------------
// Retry（やり直し）イベント：卵と操作エリアの復元
// ----------------------------------------
function restartAnimation() {
  const displayElement = document.getElementById('selectedPerson');
  displayElement.innerHTML = "";
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
