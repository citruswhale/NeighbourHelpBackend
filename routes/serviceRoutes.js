import express from "express";
import {getAllServices, getServiceById, createService, updateService, deleteService, getServicesByUser} from "../controllers/serviceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllServices);
router.get("/user/:userId", getServicesByUser);
router.get("/:id", getServiceById);
router.post("/", protect, createService);
router.put("/:id", protect, updateService);
router.delete("/:id", protect, deleteService);

export default router;
