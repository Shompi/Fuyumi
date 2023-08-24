import { getStats } from "../controllers/stats.controller.js";
import { Router } from "express";

const router = Router()

router.get("/stats", getStats)

export default router