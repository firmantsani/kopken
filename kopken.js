const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys'); 
const qrcode = require('qrcode-terminal'); const { Boom } = require('@hapi/boom');

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('sesi_multi');

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom) && lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                connectToWhatsApp();
            } else {
                console.log('Connection closed. You are logged out.');
            }
        } else if (connection === 'open') {
            console.log('Connected');
sendWhatsAppMessage(sock);
        }
    });

    sock.ev.on('creds.update', saveCreds);

    return sock;
}

async function sendWhatsAppMessage(sock) {
//    const sock = await connectToWhatsApp();

    const number = '628170993101@s.whatsapp.net';

    function shuffleString(str) {
        let arr = str.split('');
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr.join('');
    }

    while (true) {
        const referenceid = `#vyzRvpmY${shuffleString('palsi')}#`;
        const message = `Halo Kopi Kenangan, mau klaim voucher Gratis Kopi Kenangan Mantan Regular dong.\nreferenceid:${referenceid}`;

        await sock.sendMessage(number, { text: message });
        console.log('Pesan terkirim dengan referenceid:', referenceid);
        console.log("Join diskusi channel https://t.me/Si_New_Bie\n\n");
        await new Promise(resolve => setTimeout(resolve, 10000));
    }
}

connectToWhatsApp().catch(err => console.log(`Terjadi kesalahan: ${err}`));
