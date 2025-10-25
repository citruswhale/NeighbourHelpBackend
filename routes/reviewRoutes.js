import express from "express";
import { addReview, getReviewsForService, deleteReview } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/add/:serviceId").post(protect, addReview).get(getReviewsForService);
router.route("/:serviceId").get(getReviewsForService);
router.route("/delete/:id").delete(protect, deleteReview);

export default router;
