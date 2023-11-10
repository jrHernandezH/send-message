import admin from 'firebase-admin'
import { serviceAccount } from '../../serviceAccountKey.js';
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

import { db } from '../firebase.js';

const dataCollection = {
  "Investigacion1": "Investigacion 1 9:00",
  "Investigacion2": "Investigacion 2 12:00",
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://tu-proyecto-firebase.firebaseio.com', // Reemplaza con la URL de tu proyecto Firebase
});

export const msg = async (req, res) => {
  try {
    const { coleccion } = req.body;
    if (!coleccion) {
      return res.status(400).json({ error: 'Debes proporcionar un nombre de colección.' });
    }

    const querySnapshot = await getDocs(collection(db, coleccion));

    const notificationPromises = querySnapshot.docs.map(async (documento) => {
      const message = {
        notification: {
          title: `Clase de ${coleccion}`,
          body: 'Tu maestr@ ha llegado al salón',
        },
        token: documento.data().token,
      };

      try {
        const envioA = await admin.messaging().send(message);
        console.log('Notificación enviada con éxito:', envioA);
        return { success: true, token: documento.data().token };
      } catch (error) {
        if (error.code === 'messaging/registration-token-not-registered') {
          console.error('Token no registrado:', documento.data().token);
        } else {
          console.error('Error al enviar la notificación:', error);
        }
        return { success: false, token: documento.data().token, error: error.message };
      }
    });

    // Espera a que todas las promesas se resuelvan, independientemente de si fueron exitosas o no
    const results = await Promise.allSettled(notificationPromises);

    // Luego responde al cliente con los resultados
    res.json({ success: 'Notificaciones enviadas con éxito.', results });
  } catch (error) {
    console.error("Error al obtener los datos de la colección: ", error);
    res.status(500).json({ error: "Error al obtener los datos de la colección" });
  }
};

export const alumn = async (req, res) => {
    try {
      const { nombre, numeroControl, token, coleccion } = req.body; // Los datos que deseas guardar en Firestore
  
      if (!coleccion) {
        return res.status(400).json({ error: 'Debes proporcionar un nombre de colección.' });
      }
  
      const docRef = await addDoc(collection(db, coleccion),{
        nombre,
        numeroControl,
        token,
      });
  
      console.log("Documento guardado con ID: ", docRef.id);
      res.json({ message: "Datos guardados con éxito en la colección " + coleccion });
    } catch (error) {
      console.error("Error al guardar datos en Firestore: ", error);
      res.status(500).json({ error: "Error al guardar datos en Firestore en la colección " + coleccion });
    }
  };

  export const obtenerTodosLosDatos = async (req, res) => {
    try {
      const { coleccion } = req.body; // Obtén el nombre de la colección de los datos de la solicitud
  
      if (!coleccion) {
        return res.status(400).json({ error: 'Debes proporcionar un nombre de colección.' });
      }
  
      // Referencia a la colección especificada por el usuario
      const querySnapshot = await getDocs(collection(db, coleccion));
  
      const datos = [];
  
      querySnapshot.forEach((doc) => {
        // Accede a los datos de cada documento
        const data = doc.data();
        datos.push(data);
      });
  
      res.json({ datos });
    } catch (error) {
      console.error("Error al obtener los datos de la colección: ", error);
      res.status(500).json({ error: "Error al obtener los datos de la colección" });
    }
  };

  export const colleciones = async (req, res) => {
    try {
      const userToken = req.body.token; // Obtener el token de la solicitud
  
      if (!userToken) {
        return res.status(400).json({ error: 'Debes proporcionar un token.' });
      }
  
      const allData = {};
  
      for (const collectionName in dataCollection) {
        const querySnapshot = await getDocs(collection(db, dataCollection[collectionName]));
        const datos = [];
  
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.token === userToken) {
            datos.push(data);
          }
        });
  
        allData[collectionName] = datos;
      }
     res.json(allData);
    } catch (error) {
      console.error('Error al listar colecciones:', error);
      res.status(500).json({ error: 'Error al listar colecciones' });
    }
  };
  
  
