import Review from "../models/Review.js";
import Service from "../models/Service.js";

// Helper to update service's average rating
const updateServiceRating = async (serviceId) => {
    const reviews = await Review.find({ service: serviceId });

    if (reviews.length === 0) {
        await Service.findByIdAndUpdate(serviceId, {
            averageRating: 0,
            totalReviews: 0,
        });
        return;
    }

    const avg = reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;
    await Service.findByIdAndUpdate(serviceId, {
        averageRating: avg.toFixed(1),
        totalReviews: reviews.length,
    });
};

// POST /api/reviews/:serviceId
export const addReview = async (req, res) => {
    try {
        const { rating, comment, photos } = req.body;
        const { serviceId } = req.params;

        const service = await Service.findById(serviceId);
        if (!service) return res.status(404).json({ message: "Service not found" });

        // Check if user already reviewed
        const alreadyReviewed = await Review.findOne({
            user: req.user._id,
            service: serviceId,
        });
        if (alreadyReviewed) {
            return res.status(400).json({ message: "You have already reviewed this service" });
        }

        const review = await Review.create({
            service: serviceId,
            user: req.user._id,
            rating,
            comment,
            photos,
        });

        await updateServiceRating(serviceId);

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/reviews/:serviceId
export const getReviewsForService = async (req, res) => {
    try {
        const reviews = await Review.find({ service: req.params.serviceId })
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Get all reviews written by a specific user (consumer)
export const getReviewsByUser = async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.params.userId })
            .populate("service", "serviceName description") // show basic service info
            .populate("user", "name email") // show user info
            .sort({ createdAt: -1 });

        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching user's reviews:", error);
        res.status(500).json({ message: "Error fetching user's reviews", error });
    }
};

// DELETE /api/reviews/:id
export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: "Review not found" });

        if (review.user.toString() !== req.user._id.toString())
            return res.status(401).json({ message: "Not authorized" });

        await review.deleteOne();
        await updateServiceRating(review.service);

        res.json({ message: "Review deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
