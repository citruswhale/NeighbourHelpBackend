import express from "express";
import { addReview, getReviewsForService, deleteReview, getReviewsByUser } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/add/:serviceId").post(protect, addReview).get(getReviewsForService);
router.route("/:serviceId").get(getReviewsForService);
router.route("/delete/:id").delete(protect, deleteReview);
router.route("/user/:userId").get(getReviewsByUser);

export default router;
