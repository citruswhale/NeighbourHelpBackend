import Service from "../models/Service.js";

// ✅ Get all service providers
export const getAllServices = async (req, res) => {
    try {
        const services = await Service.find()
            .populate("provider", "name email phone") // only show minimal provider info
            .sort({ createdAt: -1 });
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: "Error fetching services", error });
    }
};

// ✅ Get single provider details by ID
export const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id)
            .populate("provider", "name email phone");
        if (!service)
            return res.status(404).json({ message: "Service provider not found" });
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: "Error fetching service", error });
    }
};

// ✅ Create a new service (Provider only)
export const createService = async (req, res) => {
    try {
        const { serviceName, description, contactInfo, workingHours, photo } = req.body;

        const service = new Service({
            provider: req.user._id, // assuming `protect` middleware sets req.user
            serviceName,
            description,
            contactInfo,
            workingHours,
            photo,
        });

        const createdService = await service.save();
        res.status(201).json(createdService);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update service (only provider who created it)
export const updateService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) return res.status(404).json({ message: "Service not found" });
        if (service.provider.toString() !== req.user._id.toString())
            return res.status(401).json({ message: "Not authorized" });

        const { serviceName, description, contactInfo, workingHours, images } = req.body;

        service.serviceName = serviceName || service.serviceName;
        service.description = description || service.description;
        service.contactInfo = contactInfo || service.contactInfo;
        service.workingHours = workingHours || service.workingHours;
        service.images = images || service.images;

        const updatedService = await service.save();
        res.json(updatedService);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete service
export const deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ message: "Service not found" });
        if (service.provider.toString() !== req.user._id.toString())
            return res.status(403).json({ message: "Not authorized" });

        await service.deleteOne();
        res.json({ message: "Service removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
