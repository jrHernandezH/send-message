import { Router } from "express";
import { msg } from "../controllers/msg.controller.js";

const router = Router();

router.post('/enviar', msg);

export default router;