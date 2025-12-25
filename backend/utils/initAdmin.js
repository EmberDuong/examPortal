const User = require('./models/User');

/**
 * Initialize default admin user if not exists
 * Called automatically when server starts
 */
const initializeAdmin = async () => {
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ role: 'admin' });

        if (existingAdmin) {
            console.log('✓ Admin user already exists:', existingAdmin.email);
            return;
        }

        // Create default admin user
        const admin = await User.create({
            username: 'admin',
            email: 'admin@examportal.vn',
            password: 's@uRiengRoiVoDau123', // Will be hashed by pre-save hook
            name: 'Administrator',
            phone: '0123456789',
            role: 'admin',
            status: 'Active',
            phoneVerified: true,
            avatar: 'https://i.pravatar.cc/150?u=admin'
        });

        console.log('✓ Default admin user created:');
        console.log('  Email:', admin.email);
        console.log('  Password: Admin@123456');
        console.log('  ⚠️  Please change the password after first login!');
    } catch (error) {
        console.error('Error initializing admin:', error.message);
    }
};

module.exports = initializeAdmin;
