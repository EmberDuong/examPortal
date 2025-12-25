const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'examportal_secret_key', {
        expiresIn: '7d'
    });
};

// @route   POST /api/auth/register
// @desc    Register new user (student)
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, name, phone } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            username,
            email,
            password,
            name,
            phone,
            role: 'student',
            status: 'Pending', // Needs phone verification
            avatar: `https://i.pravatar.cc/150?u=${email}`
        });

        // Generate verification code
        const verificationCode = user.generateVerificationCode();
        await user.save();

        // In production, send SMS here
        console.log(`Verification code for ${phone}: ${verificationCode}`);

        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            name: user.name,
            phone: user.phone,
            role: user.role,
            status: user.status,
            message: 'Registration successful. Please verify your phone number.',
            verificationCode: verificationCode // For testing only, remove in production
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/verify-phone
// @desc    Verify phone number with code
// @access  Public
router.post('/verify-phone', async (req, res) => {
    try {
        const { phone, code } = req.body;

        const user = await User.findOne({
            phone,
            verificationCode: code,
            verificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification code' });
        }

        user.phoneVerified = true;
        user.status = 'Active';
        user.verificationCode = undefined;
        user.verificationExpires = undefined;
        await user.save();

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            name: user.name,
            role: user.role,
            status: user.status,
            token: generateToken(user._id),
            message: 'Phone verified successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({
            $or: [{ username }, { email: username }]
        });

        if (user && (await user.matchPassword(password))) {
            if (user.status === 'Disabled') {
                return res.status(403).json({ message: 'Account is disabled' });
            }

            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                name: user.name,
                phone: user.phone,
                role: user.role,
                status: user.status,
                avatar: user.avatar,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/resend-code
// @desc    Resend verification code
// @access  Public
router.post('/resend-code', async (req, res) => {
    try {
        const { phone } = req.body;

        const user = await User.findOne({ phone, phoneVerified: false });
        if (!user) {
            return res.status(404).json({ message: 'User not found or already verified' });
        }

        const verificationCode = user.generateVerificationCode();
        await user.save();

        // In production, send SMS here
        console.log(`New verification code for ${phone}: ${verificationCode}`);

        res.json({
            message: 'Verification code sent',
            verificationCode: verificationCode // For testing only
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
