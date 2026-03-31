if ('Notification' in window) {
    Notification.requestPermission();
}

const peer = new Peer(undefined, {
    host: location.hostname,
    port: location.port || (location.protocol === 'https:' ? 443 : 80),
    secure: location.protocol === 'https:',
    path: '/peerjs'
});

console.log('Peer config:', { host: location.hostname, port: location.port, secure: location.protocol === 'https:' });

let conn;

peer.on('open', id => {
    document.getElementById('my-id-span').textContent = id;
});

peer.on('connection', incomingConn => {
    conn = incomingConn;
    conn.on('open', () => {
        addMessage('Подключено к ' + conn.peer);
        if (document.hidden && 'Notification' in window && Notification.permission === 'granted') {
            new Notification('Входящее подключение в MESSENGR', { body: 'Кто-то подключился' });
        }
    });
    conn.on('data', data => {
        addMessage('Собеседник: ' + data);
        if (document.hidden && 'Notification' in window && Notification.permission === 'granted') {
            new Notification('Новое сообщение в MESSENGR', { body: data });
        }
    });
});

document.getElementById('connect-btn').addEventListener('click', () => {
    const peerId = document.getElementById('peer-id').value.trim();
    if (peerId) {
        conn = peer.connect(peerId);
        conn.on('open', () => {
            addMessage('Подключено к ' + peerId);
        });
        conn.on('data', data => {
            addMessage('Собеседник: ' + data);
        });
    }
});

document.getElementById('emoji-btn').addEventListener('click', () => {
    const input = document.getElementById('message-input');
    input.value += '😀';
    input.focus();
});

document.getElementById('send-btn').addEventListener('click', () => {
    const msg = document.getElementById('message-input').value.trim();
    if (msg && conn && conn.open) {
        conn.send(msg);
        addMessage('Вы: ' + msg);
        document.getElementById('message-input').value = '';
    }
});

function addMessage(msg) {
    const messages = document.getElementById('messages');
    const div = document.createElement('div');
    div.textContent = msg;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}