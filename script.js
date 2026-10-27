// script.js
let peer, conn;
const isMobile = /iPhone|iPad|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

function host() {
  const code = Math.random().toString(36).substr(2, 4).toUpperCase();
  peer = new Peer(code);
  peer.on('open', () => {
    document.getElementById('setup').style.display = 'none';
    document.getElementById('info').style.display = 'block';
    document.getElementById('code').textContent = code;
    document.getElementById('chat').style.display = 'block';
    document.getElementById('sendDiv').style.display = 'flex';
    document.getElementById('status').textContent = 'Waiting for guest...';
  });
  peer.on('connection', (c) => { 
    setupConnection(c);
    document.getElementById('status').textContent = 'Connected!';
  });
  peer.on('error', (e) => { document.getElementById('status').textContent = 'Error: ' + e; });
}

function join() {
  const code = document.getElementById('joinCode').value.toUpperCase();
  if (!code) return;
  peer = new Peer();
  peer.on('open', () => {
    conn = peer.connect(code);
    conn.on('open', () => {
      document.getElementById('setup').style.display = 'none';
      document.getElementById('chat').style.display = 'block';
      document.getElementById('sendDiv').style.display = 'flex';
      document.getElementById('status').textContent = 'Connected!';
      setupConnection(conn);
    });
    conn.on('error', (e) => { document.getElementById('status').textContent = 'Error: ' + e; });
  });
}

function setupConnection(c) {
  conn = c;
  conn.on('data', (msg) => {
    const msgs = document.getElementById('messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'msg';
    msgDiv.textContent = msg;
    msgs.appendChild(msgDiv);
    msgs.parentElement.scrollTop = msgs.parentElement.scrollHeight;
  });
}

function send() {
  const input = document.getElementById('msgInput');
  const msg = input.value.trim();
  if (msg && conn) {
    conn.send(msg);
    const msgs = document.getElementById('messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'msg mine';
    msgDiv.textContent = msg;
    msgs.appendChild(msgDiv);
    document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight;
    input.value = '';
  }
}

document.getElementById('msgInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !isMobile) {
    if (!e.shiftKey) {
      e.preventDefault();
      send();
    }
  }
});
