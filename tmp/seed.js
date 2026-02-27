"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
require("dotenv/config");
const prisma = new client_1.PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
});
async function main() {
    console.log('🌱 Seeding database...');
    // --- Roles ---
    const roles = await Promise.all([
        prisma.role.upsert({
            where: { slug: 'admin' },
            update: {},
            create: { name: 'Administrator', slug: 'admin', description: 'Full system access including user management, content management, reports, and system configuration.', accessLevel: 'admin', icon: '👑', badge: 'Super Admin', badgeCls: 'badge-error', cardCls: 'admin' },
        }),
        prisma.role.upsert({
            where: { slug: 'headoffice' },
            update: {},
            create: { name: 'Head Office', slug: 'headoffice', description: 'Access to all sessions, reports, analytics, and content. Cannot modify system settings.', accessLevel: 'manager', icon: '🏢', badge: 'Senior Access', badgeCls: 'badge-warning', cardCls: 'headoffice' },
        }),
        prisma.role.upsert({
            where: { slug: 'territorymanager' },
            update: {},
            create: { name: 'Territory Manager', slug: 'territorymanager', description: 'Manage sessions and view analytics for assigned territory. Can generate reports.', accessLevel: 'manager', icon: '🗺️', badge: 'Manager', badgeCls: 'badge-info', cardCls: 'manager' },
        }),
        prisma.role.upsert({
            where: { slug: 'unitmanager' },
            update: {},
            create: { name: 'Unit Manager', slug: 'unitmanager', description: 'Manage sessions for assigned unit. Can view content and add training sessions.', accessLevel: 'manager', icon: '🏠', badge: 'Manager', badgeCls: 'badge-info', cardCls: 'manager' },
        }),
        prisma.role.upsert({
            where: { slug: 'ro' },
            update: {},
            create: { name: 'Regional Officer (RO)', slug: 'ro', description: 'View and manage sessions. Can access content and basic reporting.', accessLevel: 'staff', icon: '📋', badge: 'Staff', badgeCls: 'badge-primary', cardCls: 'manager' },
        }),
        prisma.role.upsert({
            where: { slug: 'beneficiary' },
            update: {},
            create: { name: 'Beneficiary', slug: 'beneficiary', description: 'Access to learning content and modules. Can view own progress and download certificates.', accessLevel: 'basic', icon: '👤', badge: 'Learner', badgeCls: 'badge-success', cardCls: 'beneficiary' },
        }),
    ]);
    const [adminRole, hoRole, tmRole, umRole, roRole, benefRole] = roles;
    // --- Permissions for each role ---
    const modules = ['Dashboard', 'Courses', 'Modules', 'Users', 'Roles', 'Permissions', 'Analytics', 'Reports', 'Sessions', 'Certificates', 'Settings', 'Profile'];
    for (const role of roles) {
        for (const mod of modules) {
            const isAdmin = role.slug === 'admin';
            const isStaff = ['headoffice', 'territorymanager', 'unitmanager', 'ro'].includes(role.slug);
            const isBeneficiary = role.slug === 'beneficiary';
            let canView = false, canCreate = false, canEdit = false, canDelete = false;
            if (isAdmin) {
                canView = canCreate = canEdit = canDelete = true;
            }
            else if (isStaff) {
                canView = true;
                if (['Courses', 'Modules', 'Sessions'].includes(mod)) {
                    canCreate = true;
                    canEdit = true;
                }
                if (['Users', 'Roles', 'Permissions', 'Settings'].includes(mod)) {
                    canCreate = false;
                    canEdit = false;
                }
            }
            else if (isBeneficiary) {
                canView = ['Dashboard', 'Courses', 'Modules', 'Profile', 'Certificates'].includes(mod);
                canEdit = mod === 'Profile';
            }
            await prisma.permission.upsert({
                where: { roleId_module: { roleId: role.id, module: mod } },
                update: { canView, canCreate, canEdit, canDelete },
                create: { roleId: role.id, module: mod, canView, canCreate, canEdit, canDelete },
            });
        }
    }
    console.log('✅ Roles & Permissions seeded');
    // --- Users ---
    const hashedPassword = await bcryptjs_1.default.hash('password123', 10);
    const demoUsers = [
        { mobile: '01700000001', name: 'Admin User', email: 'admin@lms.com', role: adminRole, district: undefined },
        { mobile: '01700000002', name: 'Head Office User', email: 'karim@lms.com', role: hoRole, district: 'Dhaka' },
        { mobile: '01700000003', name: 'Territory Manager', email: 'fatima@lms.com', role: tmRole, district: 'Chittagong' },
        { mobile: '01700000004', name: 'Unit Manager', email: 'ali@lms.com', role: umRole, district: 'Cumilla' },
        { mobile: '01700000005', name: 'Regional Officer', email: 'rashida@lms.com', role: roRole, district: 'Feni' },
        { mobile: '01700000006', name: 'Beneficiary User', email: 'abdul@example.com', role: benefRole, district: 'Tangail' },
        { mobile: '01700000007', name: 'Sadia Islam', email: 'sadia@example.com', role: benefRole, district: 'Narsingdi' },
    ];
    for (const u of demoUsers) {
        await prisma.user.upsert({
            where: { mobile: u.mobile },
            update: {},
            create: {
                name: u.name,
                email: u.email,
                mobile: u.mobile,
                password: hashedPassword,
                roleId: u.role.id,
                district: u.district,
                status: u.mobile === '01700000007' ? 'Inactive' : 'Active',
            },
        });
    }
    console.log('✅ Users seeded');
    // --- Courses ---
    const course1 = await prisma.course.upsert({
        where: { id: 'course-1' },
        update: {},
        create: {
            id: 'course-1',
            title: 'Digital Financial Literacy',
            description: 'Learn essential financial concepts including budgeting, saving, banking services, and digital payments.',
            category: 'Financial Literacy',
            duration: '4h 30min',
            icon: '💰',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
    });
    await prisma.course.upsert({
        where: { id: 'course-2' },
        update: {},
        create: {
            id: 'course-2',
            title: 'Mobile Banking Essentials',
            description: 'Master mobile banking applications, understand security practices, and navigate digital financial services.',
            category: 'Digital Skills',
            duration: '2h 15min',
            icon: '📱',
            gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        },
    });
    await prisma.course.upsert({
        where: { id: 'course-3' },
        update: {},
        create: {
            id: 'course-3',
            title: 'Small Business Management',
            description: 'Learn how to start and manage a small business, track finances, and grow your enterprise.',
            category: 'Business',
            duration: '5h 00min',
            icon: '🏪',
            gradient: 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)',
        },
    });
    await prisma.course.upsert({
        where: { id: 'course-4' },
        update: {},
        create: {
            id: 'course-4',
            title: 'Agricultural Best Practices',
            description: 'Discover modern farming techniques, sustainable practices, and market opportunities.',
            category: 'Agriculture',
            duration: '3h 45min',
            icon: '🌾',
            gradient: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
        },
    });
    console.log('✅ Courses seeded');
    // --- Modules (for course 1) ---
    const modulesData = [
        { id: 'mod-1', title: 'Introduction to Financial Literacy', description: 'Understanding basic financial concepts and their importance in daily life', duration: '45 min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: '/images/module1_thumbnail.png', sortOrder: 1 },
        { id: 'mod-2', title: 'Budgeting and Saving', description: 'Learn how to create a budget and develop effective saving habits', duration: '50 min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: '/images/module2_thumbnail.png', sortOrder: 2 },
        { id: 'mod-3', title: 'Banking Services and Digital Payments', description: 'Explore banking services and how to use digital payment platforms safely', duration: '55 min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: '/images/module3_thumbnail.png', sortOrder: 3 },
        { id: 'mod-4', title: 'Remittance Management', description: 'Best practices for sending and receiving remittances efficiently', duration: '40 min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: '/images/module4_thumbnail.png', sortOrder: 4 },
        { id: 'mod-5', title: 'Investment and Insurance', description: 'Understanding investment options and the importance of insurance', duration: '60 min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: '/images/module5_thumbnail.png', sortOrder: 5 },
    ];
    for (const m of modulesData) {
        await prisma.module.upsert({
            where: { id: m.id },
            update: {},
            create: { ...m, courseId: course1.id, type: 'Video Lesson' },
        });
    }
    console.log('✅ Modules seeded');
    // --- Sessions ---
    await prisma.session.upsert({
        where: { id: 'session-1' },
        update: {},
        create: {
            id: 'session-1',
            name: 'Financial Literacy Workshop - Dhaka',
            date: new Date('2026-01-10'),
            district: 'Dhaka',
            upazila: 'Savar',
            unionName: 'Ashulia',
            unitOffice: 'Dhaka Central',
            participants: 45,
            male: 20,
            female: 25,
            unitManager: 'Karim Rahman',
            status: 'Completed',
        },
    });
    await prisma.session.upsert({
        where: { id: 'session-2' },
        update: {},
        create: {
            id: 'session-2',
            name: 'Digital Banking Training - Chittagong',
            date: new Date('2026-01-08'),
            district: 'Chittagong',
            upazila: 'Rangunia',
            unionName: 'Betagi',
            unitOffice: 'Chittagong South',
            participants: 38,
            male: 18,
            female: 20,
            unitManager: 'Fatima Begum',
            status: 'Completed',
        },
    });
    console.log('✅ Sessions seeded');
    // --- Districts & Upazilas ---
    const locationData = {
        Chattogram: ['Anwara', 'Banshkhali', 'Boalkhali', 'Chandanaish', 'Fatikchhari', 'Hathazari', 'Lohagara', 'Mirsharai', 'Patiya', 'Rangunia', 'Raozan', 'Sandwip', 'Satkania', 'Sitakunda'],
        Feni: ['Chhagalnaiya', 'Daganbhuiyan', 'Feni Sadar', 'Fulgazi', 'Parshuram', 'Sonagazi'],
        Cumilla: ['Barura', 'Brahmanpara', 'Burichang', 'Chandina', 'Chauddagram', 'Cumilla Sadar', 'Daudkandi', 'Debidwar', 'Homna', 'Laksam', 'Meghna', 'Muradnagar', 'Nangalkot', 'Titas'],
        Munshiganj: ['Gazaria', 'Lohajang', 'Munshiganj Sadar', 'Sirajdikhan', 'Sreenagar', 'Tongibari'],
        Narsingdi: ['Belabo', 'Monohardi', 'Narsingdi Sadar', 'Palash', 'Raipura', 'Shibpur'],
        Tangail: ['Basail', 'Bhuapur', 'Delduar', 'Dhanbari', 'Ghatail', 'Gopalpur', 'Kalihati', 'Madhupur', 'Mirzapur', 'Nagarpur', 'Sakhipur', 'Tangail Sadar'],
    };
    for (const [districtName, upazilaNames] of Object.entries(locationData)) {
        const district = await prisma.district.upsert({
            where: { name: districtName },
            update: {},
            create: { name: districtName },
        });
        for (const upazilaName of upazilaNames) {
            await prisma.upazila.upsert({
                where: { districtId_name: { districtId: district.id, name: upazilaName } },
                update: {},
                create: { name: upazilaName, districtId: district.id },
            });
        }
    }
    console.log('✅ Districts & Upazilas seeded');
    console.log('🎉 Seeding complete!');
}
main()
    .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
