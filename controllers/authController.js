import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// POST /api/auth/register
export const registerUser = async (req, res) => {
    try {
        const { name, email, phone, address, password, role } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const user = new User({ name, email, phone, address, password, role });
        await user.save();

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/auth/login
export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({message: "Invalid email or password"});
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    if (user) res.json(user);
    else res.status(404).json({ message: "User not found" });
};

export const updateUserProfile = async (req, res) => {
    try {
        // Find the user by ID from the authenticated request
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const { name, email, phone, address, password, role } = req.body;

        // Update fields only if provided
        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.address = address || user.address;
        user.role = role || user.role;

        // Update password if provided
        if (password) user.password = password; // pre-save hook will hash it

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            address: updatedUser.address,
            role: updatedUser.role,
            token: generateToken(updatedUser._id), // optional: refresh JWT
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
