const OriginalMember = ['竹橋','乘木','大場','能勢','近藤','中脇'];
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

function FireInYourHeart(){
    const memberOne = Math.floor(Math.random() * remainingMembers.length);
    const output = document.getElementById('studyMember');
    // console.log(member[memberOne]);
    output.innerHTML = remainingMembers[memberOne];
}

function finalizeSelection() {
    const output = document.getElementById('studyMember');
    const currentMember = output.innerHTML;

    if (!currentMember || !remainingMembers.includes(currentMember)) {
        // 現在表示されているメンバーが無効または既に削除された場合
        alert('選択されたメンバーがいません！');
        return;
    }

    // 現在のメンバーをリストから削除
    remainingMembers = remainingMembers.filter(member => member !== currentMember);
    console.log('残りのメンバー:', remainingMembers);
    saveMembersToStorage();
    // メッセージを更新
    output.innerHTML = `${currentMember}さんが次回、井戸端勉強会の担当者です！`;
}

// リセットボタンの処理
function resetMembers() {
    remainingMembers = [...OriginalMember]; // remainingMembers を初期化
    const output = document.getElementById('studyMember');
    output.innerHTML = 'メンバーリストがリセットされました！'; // リセットメッセージ
    console.log('メンバーリストがリセットされました:', remainingMembers);
}

loadMembersFromStorage();

let get = document.getElementById('button');
get.addEventListener('click', FireInYourHeart);

let finalizeButton = document.getElementById('finalizeButton');
finalizeButton.addEventListener('click', finalizeSelection);

let resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', resetMembers);
