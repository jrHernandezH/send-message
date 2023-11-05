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
    const notificationPromises = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const message = {
        notification: {
          title: `Clase de ${coleccion}`,
          body: "Tu maestr@ ah llegado al salon de clases presentate en este momento",
        },
        token: data.token,
      };

      const notificationPromise = admin.messaging().send(message);
      notificationPromises.push(notificationPromise);
    });

    // Espera a que se resuelvan todas las promesas de notificación
    await Promise.all(notificationPromises);

    // Luego responde al cliente
    res.json({ success: 'Notificaciones enviadas con éxito.' });
  } catch (error) {
    console.error("Error al obtener los datos de la colección: ", error);
    res.status(500).json({ error: "Error al obtener los datos de la colección" });
  }
}

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
      res.json({message: "registrado"});
    } catch (error) {
      console.error('Error al listar colecciones:', error);
      res.status(500).json({ error: 'Error al listar colecciones' });
    }
  };
  
  
