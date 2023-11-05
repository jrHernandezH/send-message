import { Router } from "express";
import { msg, alumn, obtenerTodosLosDatos, colleciones } from "../controllers/msg.controller.js";

const router = Router();

router.post('/enviar', msg);

router.post('/alumnos', alumn);

router.post('/galumnos', obtenerTodosLosDatos)

router.post('/listar', colleciones);
export default router;
