// Enviar mensaje a Firestore
function sendGlobalChatMessage() {
  const input = document.getElementById('global-chat-input');
  const text = input.value.trim();
  if (!text) return;

  db.collection("global_chat").add({
    author: currentUserSession ? currentUserSession.username : 'Alumno',
    role: isUserAdmin ? 'admin' : 'student',
    text: text,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    input.value = '';
  });
}

// Escuchar mensajes en vivo
db.collection("global_chat").orderBy("createdAt", "asc").onSnapshot((snapshot) => {
  const container = document.getElementById('global-chat-container');
  if (!container) return;
  container.innerHTML = '';

  snapshot.forEach((doc) => {
    const msg = doc.data();
    const timeStr = msg.createdAt ? new Date(msg.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${msg.role === 'admin' ? 'admin-msg' : ''}`;
    bubble.innerHTML = `
      <div class="chat-bubble-meta">
        <strong style="color:${msg.role === 'admin' ? '#f87171' : 'var(--cyan-accent)'};">${msg.author}</strong>
        <span style="color:#6b7280;">${timeStr}</span>
      </div>
      <div style="font-size:0.9rem; line-height:1.45; color:#e5e7eb;">${msg.text}</div>
    `;
    container.appendChild(bubble);
  });
  container.scrollTop = container.scrollHeight;
});