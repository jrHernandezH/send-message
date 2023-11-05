import { Router } from "express";
import { msg, alumn, obtenerTodosLosDatos } from "../controllers/msg.controller.js";

const router = Router();

router.post('/enviar', msg);

router.post('/alumnos', alumn);

router.post('/galumnos', obtenerTodosLosDatos)

export default router;