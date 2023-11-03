import admin from 'firebase-admin'
import { serviceAccount } from '../../serviceAccountKey.js';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://tu-proyecto-firebase.firebaseio.com', // Reemplaza con la URL de tu proyecto Firebase
});

export const msg = (req, res) => {
    const { token, mensaje } = req.body;

    if (!token || !mensaje) {
        return res.status(400).json({ error: 'Faltan datos obligatorios.' });
    }

    const message = {
        notification: {
            title: 'Título de la notificación',
            body: mensaje,
        },
        token: token,
    };

    // Envía la notificación push a través de FCM
    admin.messaging().send(message)
        .then((response) => {
            console.log('Notificación enviada con éxito:', response);
            res.json({ success: 'Notificación enviada con éxito.' });
        })
        .catch((error) => {
            console.error('Error al enviar la notificación:', error);
            res.status(500).json({ error: 'Error al enviar la notificación.' });
        });
}