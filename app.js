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
query,
orderBy,
onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// 🔥 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAaKLv0igSR4UUaROdQtnUxBdtYNF-PtXc",
  authDomain: "lusue-a77ab.firebaseapp.com",
  projectId: "lusue-a77ab",
  storageBucket: "lusue-a77ab.firebasestorage.app",
  messagingSenderId: "49150290567",
  appId: "1:49150290567:web:066682f27e1f158c752622"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();


// =====================
// ✅ Реєстрація
// =====================
window.register = async () => {

try {

await createUserWithEmailAndPassword(
auth,
regEmail.value,
regPass.value
);

alert("Акаунт створено");

} catch(e) {

alert(e.message);

}

};


// =====================
// ✅ Логін
// =====================
window.login = async () => {

try {

await signInWithEmailAndPassword(
auth,
loginEmail.value,
loginPass.value
);

} catch(e) {

alert(e.message);

}

};


// =====================
// ✅ Вихід
// =====================
window.logout = () => signOut(auth);


// =====================
// ✅ Перевірка входу
// =====================
onAuthStateChanged(auth, (user) => {

if (user) {

authBox.style.display = "none";
mainBox.style.display = "block";

loadPosts();

} else {

authBox.style.display = "block";
mainBox.style.display = "none";

}

});


// =====================
// 📝 Створення поста
// =====================
window.createPost = async () => {

let user = auth.currentUser;

if (!postText.value) return;

await addDoc(collection(db, "posts"), {
text: postText.value,
user: user.email,
time: Date.now()
});

postText.value = "";

};


// =====================
// 📡 Завантаження постів
// =====================
function loadPosts() {

const q = query(collection(db, "posts"), orderBy("time", "desc"));

onSnapshot(q, (snapshot) => {

feed.innerHTML = "";

snapshot.forEach(doc => {

let post = doc.data();

feed.innerHTML += `
<div class="post">
<b>${post.user}</b>
<p>${post.text}</p>
</div>
`;

});

});

}
