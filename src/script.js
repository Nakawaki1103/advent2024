// import gsap from "gsap";

const OriginalMember = ['A', 'B', 'C', 'D', 'E', 'F'];
let remainingMembers = [...OriginalMember];

// ローカルストレージからデータをロード
function loadMembersFromStorage() {
  const savedMembers = localStorage.getItem('remainingMembers');
  if (savedMembers) {
    remainingMembers = JSON.parse(savedMembers);
  } else {
    remainingMembers = [...OriginalMember];
  }
  console.log('ロードされたメンバー:', remainingMembers);
}

// ローカルストレージにデータを保存
function saveMembersToStorage() {
  localStorage.setItem('remainingMembers', JSON.stringify(remainingMembers));
  console.log('メンバーを保存しました:', remainingMembers);
}

function FireInYourHeart() {
  const memberOne = Math.floor(Math.random() * remainingMembers.length);
  const output = document.getElementById('studyMember');
  const selected = remainingMembers[memberOne];
  output.innerHTML = selected;

  // GSAPアニメーション（フェードイン + ズーム）
  gsap.fromTo(
    output,
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
  );
}

function finalizeSelection() {
  const output = document.getElementById('studyMember');
  const currentMember = output.innerHTML;

  if (!currentMember || !remainingMembers.includes(currentMember)) {
    alert('選択されたメンバーがいません！');
    return;
  }

  // メンバーリストから削除
  remainingMembers = remainingMembers.filter(member => member !== currentMember);
  console.log('残りのメンバー:', remainingMembers);
  saveMembersToStorage();

  output.innerHTML = `${currentMember}さんが次回、井戸端勉強会の担当者です！`;

  // GSAPアニメーション（決定時に緑に光る）
  gsap.fromTo(
    output,
    { backgroundColor: "#1f2937" }, // Tailwindの gray-800
    {
      backgroundColor: "#10b981", // Tailwindの green-500
      duration: 0.4,
      yoyo: true,
      repeat: 1,
      ease: "power1.inOut"
    }
  );
}

function resetMembers() {
  remainingMembers = [...OriginalMember];
  const output = document.getElementById('studyMember');
  output.innerHTML = 'メンバーリストがリセットされました！';
  console.log('メンバーリストがリセットされました:', remainingMembers);

  // GSAPアニメーション（下からスライドイン）
  gsap.fromTo(
    output,
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
  );
}

loadMembersFromStorage();

document.getElementById('button').addEventListener('click', FireInYourHeart);
document.getElementById('finalizeButton').addEventListener('click', finalizeSelection);
document.getElementById('resetButton').addEventListener('click', resetMembers);
