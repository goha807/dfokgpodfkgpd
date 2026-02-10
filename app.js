import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
getAuth,
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
getFirestore,
collection,
addDoc,
setDoc,
doc,
onSnapshot,
getDocs,
query,
orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAaKLv0igSR4UUaROdQtnUxBdtYNF-PtXc",
  authDomain: "lusue-a77ab.firebaseapp.com",
  projectId: "lusue-a77ab"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

let currentChatUser = null;


// =================
// Реєстрація
// =================
window.register = async () => {

let user = await createUserWithEmailAndPassword(
auth,
regEmail.value,
regPass.value
);

// записуємо користувача в базу
await setDoc(doc(db,"users",user.user.uid),{
email:user.user.email
});

};


// =================
// Логін
// =================
window.login = async () => {

await signInWithEmailAndPassword(
auth,
loginEmail.value,
loginPass.value
);

};


// =================
// Вихід
// =================
window.logout = () => signOut(auth);


// =================
// Перевірка входу
// =================
onAuthStateChanged(auth,(user)=>{

if(user){

authBox.style.display="none";
chatApp.style.display="block";

loadUsers();

}else{

authBox.style.display="block";
chatApp.style.display="none";

}

});


// =================
// Завантаження користувачів
// =================
async function loadUsers(){

let snap = await getDocs(collection(db,"users"));

users.innerHTML="";

snap.forEach(u=>{

let data = u.data();

if(u.id !== auth.currentUser.uid){

users.innerHTML += `
<div class="user" onclick="openChat('${u.id}','${data.email}')">
${data.email}
</div>
`;

}

});

}


// =================
// Відкрити чат
// =================
window.openChat = (uid,email)=>{

currentChatUser = uid;

chatTitle.innerText = "Чат з " + email;

loadMessages();

};


// =================
// Генерація ID чату
// =================
function chatId(){

let a = auth.currentUser.uid;
let b = currentChatUser;

return [a,b].sort().join("_");

}


// =================
// Відправка повідомлення
// =================
window.sendMessage = async ()=>{

if(!currentChatUser) return;

await addDoc(collection(db,"messages"),{

chat:chatId(),
text:messageInput.value,
sender:auth.currentUser.email,
time:Date.now()

});

messageInput.value="";

};


// =================
// Завантаження повідомлень
// =================
function loadMessages(){

const q = query(collection(db,"messages"),orderBy("time"));

onSnapshot(q,(snap)=>{

messages.innerHTML="";

snap.forEach(m=>{

let msg = m.data();

if(msg.chat === chatId()){

messages.innerHTML += `
<p><b>${msg.sender}:</b> ${msg.text}</p>
`;

}

});

});

}
