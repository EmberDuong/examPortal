require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const connectDB = require('./config/db');

const seedAdmin = async () => {
    try {
        await connectDB();

        // Delete existing admin to recreate with correct password
        await User.deleteOne({ username: 'admin' });
        console.log('Deleted existing admin user (if any)');

        // Create admin user (password will be hashed by pre-save hook)
        const admin = await User.create({
            username: 'admin',
            email: 'admin@examportal.vn',
            password: 's@uRiengRoiVoDau123', // Will be hashed by pre-save hook
            name: 'Administrator',
            phone: '0123456789', // Required field
            role: 'admin',
            status: 'Active',
            phoneVerified: true,
            avatar: 'https://i.pravatar.cc/150?u=admin'
        });

        console.log('Admin user created successfully:');
        console.log({
            username: admin.username,
            email: admin.email,
            role: admin.role
        });

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
