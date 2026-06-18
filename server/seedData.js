/**
 * seedData.js — Autocon Solutions Demo Data Seeder
 * 
 * Uploads images to Cloudinary → saves URLs to MongoDB
 * Run: node seedData.js
 *
 * ⚠️  Clears existing Products, Projects and CaseStudies before seeding.
 *     Admin account is NOT touched.
 */

const mongoose = require('mongoose');
const dotenv   = require('dotenv');
const path     = require('path');
const cloudinary = require('cloudinary').v2;

const Product   = require('./models/Product');
const Project   = require('./models/Project');
const CaseStudy = require('./models/CaseStudy');
const Booking   = require('./models/Booking');

// ─── Load env ────────────────────────────────────────────────────────────────
dotenv.config({ path: path.join(__dirname, '.env') });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Helper: upload a remote URL to Cloudinary ───────────────────────────────
const uploadToCloudinary = async (remoteUrl, folder, publicId) => {
    try {
        const result = await cloudinary.uploader.upload(remoteUrl, {
            folder,
            public_id: publicId,
            overwrite: true,
            resource_type: 'image',
        });
        console.log(`  ✅ Uploaded: ${publicId}`);
        return result.secure_url;
    } catch (err) {
        console.warn(`  ⚠️  Failed to upload ${publicId}: ${err.message}`);
        // Return a reliable fallback from picsum instead of breaking
        return `https://picsum.photos/seed/${publicId}/800/600`;
    }
};

// ─── Slug helper ─────────────────────────────────────────────────────────────
const slugify = (str) =>
    str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// ─── Remote image sources (Unsplash — stable direct links) ───────────────────
const IMG = {
    // Products
    beltConveyor:     'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900&q=80',
    rollerConveyor:   'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=900&q=80',
    screwConveyor:    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=900&q=80',
    chainConveyor:    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80',
    bucketElevator:   'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=900&q=80',
    vibratingConveyor:'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=900&q=80',

    // Projects
    proj1: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&q=80',
    proj2: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=900&q=80',
    proj3: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=900&q=80',
    proj4: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80',

    // Case Studies
    cs1: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900&q=80',
    cs2: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&q=80',
    cs3: 'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=900&q=80',
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('\n✅ Connected to MongoDB\n');

        // ── Clear existing demo data ────────────────────────────────────────
        await Product.deleteMany({});
        await Project.deleteMany({});
        await CaseStudy.deleteMany({});
        await Booking.deleteMany({});
        console.log('🗑️  Cleared Products, Projects, CaseStudies, Bookings\n');

        // ══════════════════════════════════════════════════════════════════
        // 1. PRODUCTS
        // ══════════════════════════════════════════════════════════════════
        console.log('📦 Uploading Product images…');

        const pImgs = {
            belt:     await uploadToCloudinary(IMG.beltConveyor,     'autocon/products', 'belt-conveyor'),
            roller:   await uploadToCloudinary(IMG.rollerConveyor,   'autocon/products', 'roller-conveyor'),
            screw:    await uploadToCloudinary(IMG.screwConveyor,    'autocon/products', 'screw-conveyor'),
            chain:    await uploadToCloudinary(IMG.chainConveyor,    'autocon/products', 'chain-conveyor'),
            bucket:   await uploadToCloudinary(IMG.bucketElevator,   'autocon/products', 'bucket-elevator'),
            vibrating:await uploadToCloudinary(IMG.vibratingConveyor,'autocon/products', 'vibrating-conveyor'),
        };

        const products = [
            {
                name: 'Heavy-Duty Belt Conveyor',
                slug: 'heavy-duty-belt-conveyor',
                shortDesc: 'High-capacity flat belt conveyor for bulk material handling in mining, cement & logistics.',
                description: 'Our Heavy-Duty Belt Conveyor is engineered for continuous bulk material transport in the most demanding industrial environments. Featuring reinforced steel frame construction, variable-speed drives, and multi-ply conveyor belts rated up to 800 mm width, this system delivers reliable performance at inclinations up to 30°. Ideal for coal, limestone, gravel, and packaged goods.',
                image: pImgs.belt,
                images: [pImgs.belt],
                category: 'Conveyors',
                subcategory: 'Belt Conveyor',
                featured: true,
                features: [
                    'Capacity up to 500 TPH',
                    'Belt width: 400–1200 mm',
                    'Variable speed drive (VFD)',
                    'Self-cleaning tail pulley',
                    'Emergency stop & overload protection',
                    'Dust-sealed idler frames',
                ],
                specifications: [
                    { label: 'Belt Width', value: '400 – 1200 mm' },
                    { label: 'Capacity', value: 'Up to 500 TPH' },
                    { label: 'Max Inclination', value: '30°' },
                    { label: 'Drive Power', value: '5 – 150 kW' },
                    { label: 'Belt Speed', value: '0.5 – 4 m/s' },
                    { label: 'Frame Material', value: 'MS / SS 304 optional' },
                ],
                applications: ['Mining & Quarrying', 'Cement Plants', 'Fertiliser Industry', 'Logistics & Warehousing', 'Steel Plants'],
            },
            {
                name: 'Gravity Roller Conveyor',
                slug: 'gravity-roller-conveyor',
                shortDesc: 'Unpowered roller conveyor for smooth package, carton & pallet movement without electricity.',
                description: 'The Autocon Gravity Roller Conveyor uses the force of gravity to transport goods over a slightly inclined track. Constructed from high-tensile steel rollers mounted on a robust frame, it requires zero energy during operation making it the most economical choice for warehouses, assembly lines and distribution centres. Available in straight, curved and telescopic configurations.',
                image: pImgs.roller,
                images: [pImgs.roller],
                category: 'Conveyors',
                subcategory: 'Roller Conveyor',
                featured: true,
                features: [
                    'Zero energy consumption',
                    'Roller diameter: 50–89 mm',
                    'Load capacity up to 500 kg/m',
                    'Available in straight, curved & telescopic',
                    'Galvanised or SS roller option',
                    'Quick-fit roller replacement',
                ],
                specifications: [
                    { label: 'Roller Diameter', value: '50 / 63.5 / 76 / 89 mm' },
                    { label: 'Frame Width', value: '300 – 900 mm' },
                    { label: 'Load per Roller', value: 'Up to 100 kg' },
                    { label: 'Inclination', value: '2° – 5° (gravity)' },
                    { label: 'Roller Pitch', value: '50 – 300 mm' },
                    { label: 'Frame Material', value: 'MS Powder Coated / SS' },
                ],
                applications: ['Warehousing & Distribution', 'E-Commerce Fulfilment', 'Automotive Assembly', 'FMCG Packaging', 'Cold Storage'],
            },
            {
                name: 'Screw / Auger Conveyor',
                slug: 'screw-auger-conveyor',
                shortDesc: 'Enclosed screw conveyor for hygienic transport of powders, granules & semi-solids.',
                description: 'Autocon Screw Conveyors (also known as Auger Conveyors) are the preferred choice for conveying free-flowing and sluggish bulk materials in a completely enclosed, dust-free manner. The helical screw blade pushes material forward along a trough or tube. Available in horizontal, inclined and vertical configurations with optional heating/cooling jacket.',
                image: pImgs.screw,
                images: [pImgs.screw],
                category: 'Conveyors',
                subcategory: 'Screw Conveyor',
                featured: true,
                features: [
                    'Fully enclosed dust-free operation',
                    'Horizontal, inclined & vertical models',
                    'Food-grade SS304 / SS316 option',
                    'Variable pitch screw design',
                    'Optional heating / cooling jacket',
                    'CIP (Clean-in-Place) compatible',
                ],
                specifications: [
                    { label: 'Screw Diameter', value: '150 – 600 mm' },
                    { label: 'Capacity', value: '1 – 100 m³/hr' },
                    { label: 'Max Length', value: 'Up to 15 m per section' },
                    { label: 'Inclination', value: '0° – 90°' },
                    { label: 'Drive Power', value: '0.37 – 22 kW' },
                    { label: 'Material', value: 'MS / SS 304 / SS 316' },
                ],
                applications: ['Food & Pharma', 'Chemical Processing', 'Grain & Flour Mills', 'Plastic & Rubber', 'Waste Treatment'],
            },
            {
                name: 'Drag Chain Conveyor',
                slug: 'drag-chain-conveyor',
                shortDesc: 'Rugged en-masse chain conveyor for handling hot, abrasive or heavy bulk materials.',
                description: 'The Autocon Drag Chain Conveyor is designed for the en-masse movement of bulk materials in demanding high-temperature environments. Constructed from hardened alloy steel chains and wear-resistant UHMW liners, it handles materials like fly-ash, clinker, hot chips and biomass at temperatures up to 400°C. Completely sealed body minimises fugitive dust emissions.',
                image: pImgs.chain,
                images: [pImgs.chain],
                category: 'Conveyors',
                subcategory: 'Chain Conveyor',
                featured: false,
                features: [
                    'Handles temperatures up to 400°C',
                    'Sealed housing — near-zero fugitive dust',
                    'Hardened alloy steel chain',
                    'UHMW-PE or ceramic liner option',
                    'Reverse-run capability',
                    'Multiple inlet / outlet points',
                ],
                specifications: [
                    { label: 'Chain Type', value: 'Malleable / Forged alloy steel' },
                    { label: 'Trough Width', value: '250 – 1000 mm' },
                    { label: 'Capacity', value: 'Up to 300 TPH' },
                    { label: 'Temperature', value: 'Up to 400°C' },
                    { label: 'Drive Power', value: '5 – 110 kW' },
                    { label: 'Speed', value: '0.1 – 0.5 m/s' },
                ],
                applications: ['Cement & Lime Plants', 'Steel & Sinter Plants', 'Power Plants (fly-ash)', 'Biomass & Pellet Plants', 'Foundries'],
            },
            {
                name: 'Bucket Elevator',
                slug: 'bucket-elevator',
                shortDesc: 'Vertical bucket elevator for high-capacity elevation of grains, powders & granules.',
                description: 'Autocon Bucket Elevators provide the most efficient method of vertically elevating bulk materials over heights up to 60 m. The centrifugal or continuous-discharge design ensures gentle handling with minimal product degradation. Available in belt or chain boot configurations with capacities up to 400 TPH, they serve grain, sugar, cement and mineral industries worldwide.',
                image: pImgs.bucket,
                images: [pImgs.bucket],
                category: 'Conveyors',
                subcategory: 'Bucket Elevator',
                featured: false,
                features: [
                    'Elevation height up to 60 m',
                    'Centrifugal & continuous discharge models',
                    'Belt or chain boot option',
                    'Inspect doors at every 3 m interval',
                    'Anti-runback backstop device',
                    'Optional explosion-proof motor',
                ],
                specifications: [
                    { label: 'Capacity', value: 'Up to 400 TPH' },
                    { label: 'Elevator Height', value: 'Up to 60 m' },
                    { label: 'Bucket Width', value: '200 – 630 mm' },
                    { label: 'Belt / Chain Speed', value: '1 – 3 m/s' },
                    { label: 'Drive Power', value: '5 – 90 kW' },
                    { label: 'Casing', value: 'MS / SS / GI' },
                ],
                applications: ['Grain & Feed Mills', 'Sugar Industry', 'Cement & Lime', 'Mining & Minerals', 'Fertilizer Plants'],
            },
            {
                name: 'Vibrating Conveyor',
                slug: 'vibrating-conveyor',
                shortDesc: 'Electromechanical vibrating conveyor for delicate, hot or sticky material transport.',
                description: 'The Autocon Vibrating Conveyor uses controlled resonant vibration to move materials forward gently along a trough. It is the preferred choice when material must not be damaged, contaminated or mixed. The open trough design allows integration of cooling, screening, drying and dewatering operations inline. Available in single- and two-mass natural-frequency designs.',
                image: pImgs.vibrating,
                images: [pImgs.vibrating],
                category: 'Conveyors',
                subcategory: 'Vibrating Conveyor',
                featured: false,
                features: [
                    'Gentle handling — no product damage',
                    'Inline cooling / screening / drying possible',
                    'Natural frequency (low-energy) design',
                    'No lubrication required',
                    'Handles hot materials up to 800°C',
                    'Available in SS 304 / 316 for food grade',
                ],
                specifications: [
                    { label: 'Trough Width', value: '200 – 1500 mm' },
                    { label: 'Capacity', value: '0.5 – 150 TPH' },
                    { label: 'Length per Section', value: 'Up to 6 m' },
                    { label: 'Temperature', value: 'Up to 800°C' },
                    { label: 'Drive Type', value: 'Electromechanical / Electromagnetic' },
                    { label: 'Amplitude', value: '3 – 12 mm' },
                ],
                applications: ['Foundry & Casting', 'Food Processing', 'Chemical Industry', 'Glass & Ceramics', 'Recycling Plants'],
            },
        ];

        console.log('\n💾 Inserting Products…');
        for (const p of products) {
            await Product.create(p);
            console.log(`  ✅ Product: ${p.name}`);
        }

        // ══════════════════════════════════════════════════════════════════
        // 2. PROJECTS
        // ══════════════════════════════════════════════════════════════════
        console.log('\n📦 Uploading Project images…');

        const prImgs = {
            p1: await uploadToCloudinary(IMG.proj1, 'autocon/projects', 'project-cement-plant'),
            p2: await uploadToCloudinary(IMG.proj2, 'autocon/projects', 'project-grain-mill'),
            p3: await uploadToCloudinary(IMG.proj3, 'autocon/projects', 'project-pharma-plant'),
            p4: await uploadToCloudinary(IMG.proj4, 'autocon/projects', 'project-steel-plant'),
        };

        const projects = [
            {
                title: 'Cement Plant Material Handling — Navi Mumbai',
                category: 'Cement Industry',
                description: 'Designed and commissioned a complete material handling system for a 2,500 TPD greenfield cement plant. Scope included 4.2 km of belt conveyors, 6 dust-suppressed transfer towers, 3 bucket elevators (H=42m) for raw meal, kiln feed and cement circuits. Project delivered in 18 months ahead of schedule.',
                images: [prImgs.p1],
                status: 'Completed',
                completedAt: new Date('2023-11-15'),
            },
            {
                title: 'Grain Handling & Storage — Nagpur Flour Mill',
                category: 'Food & Grain Processing',
                description: 'End-to-end grain intake, cleaning, and storage conveying system for a 200 TPD flour mill. Installed 12 gravity roller conveyors, 4 screw conveyors (SS304), 2 vertical bucket elevators, and an automated diverter gate system with PLC control. Full food-grade compliance ensured throughout.',
                images: [prImgs.p2],
                status: 'Completed',
                completedAt: new Date('2024-03-10'),
            },
            {
                title: 'Pharmaceutical Powder Transfer — Pune',
                category: 'Pharmaceutical',
                description: 'Installed a cGMP-compliant enclosed screw conveyor and pneumatic transfer system for API (Active Pharmaceutical Ingredient) powder transport between floors in a WHO-GMP certified facility. Complete SS316L construction with CIP compatibility, explosion-proof drives, and real-time weight verification.',
                images: [prImgs.p3],
                status: 'Completed',
                completedAt: new Date('2024-07-22'),
            },
            {
                title: 'Steel Plant Slag & Scrap Handling — Raipur',
                category: 'Steel & Metal',
                description: 'Currently executing a 3-phase slag handling and scrap conveyance project for a 1 MTPA steel melt shop. Phase 1 (drag chain conveyors for hot slag at 350°C) is complete and operational. Phases 2 & 3 (scrap yard reclaimer and billet transfer) are in fabrication. Expected commissioning Q2 2025.',
                images: [prImgs.p4],
                status: 'Ongoing',
            },
        ];

        console.log('\n💾 Inserting Projects…');
        for (const p of projects) {
            await Project.create(p);
            console.log(`  ✅ Project: ${p.title}`);
        }

        // ══════════════════════════════════════════════════════════════════
        // 3. CASE STUDIES
        // ══════════════════════════════════════════════════════════════════
        console.log('\n📦 Uploading Case Study images…');

        const csImgs = {
            c1: await uploadToCloudinary(IMG.cs1, 'autocon/case-studies', 'cs-ambuja-cement'),
            c2: await uploadToCloudinary(IMG.cs2, 'autocon/case-studies', 'cs-itc-agri'),
            c3: await uploadToCloudinary(IMG.cs3, 'autocon/case-studies', 'cs-godrej-feed'),
        };

        const caseStudies = [
            {
                title: 'Eliminating Belt Slippage at a 2500 TPD Cement Plant',
                slug: 'eliminating-belt-slippage-cement-plant',
                client: 'Ambuja Cements Ltd.',
                industry: 'Cement Manufacturing',
                location: 'Raigad, Maharashtra',
                mainImage: csImgs.c1,
                images: [csImgs.c1],
                problem: `The client's existing third-party belt conveyor system on the raw mill feed circuit experienced frequent belt slippage and misalignment, causing unplanned shutdowns averaging 4 hours every 72 hours of operation. This resulted in an estimated production loss of ₹18 lakh per month and increased maintenance costs.`,
                solution: 'Autocon replaced the drive pulley with a ceramic-lagged motorised pulley and redesigned the take-up system with a gravity counterweight arrangement. Self-aligning training idlers were installed every 10 m on the return run. We also introduced a belt-tracking alarm integrated into the existing SCADA panel, giving operators real-time misalignment warnings before they escalate.',
                results: [
                    'Belt slippage incidents reduced from 10/month to 0 in 6 months post-commissioning',
                    'Unplanned downtime on the raw mill circuit decreased by 94%',
                    'Maintenance cost down by ₹4.2 lakh per month',
                    'Overall conveyor availability improved from 81% to 99.2%',
                ],
                stats: [
                    { label: 'Downtime Reduction', value: '94%' },
                    { label: 'Monthly Savings', value: '₹16L' },
                    { label: 'Availability', value: '99.2%' },
                    { label: 'Payback Period', value: '4 months' },
                ],
                featured: true,
                date: new Date('2023-09-01'),
            },
            {
                title: 'Reducing Grain Damage in High-Speed Bucket Elevator',
                slug: 'reducing-grain-damage-bucket-elevator',
                client: 'ITC Agri Business',
                industry: 'Grain & Food Processing',
                location: 'Munger, Bihar',
                mainImage: csImgs.c2,
                images: [csImgs.c2],
                problem: `A newly commissioned high-speed centrifugal bucket elevator at a wheat procurement silo was generating an unacceptable 2.8% broken grain (brokens) rate during peak throughput of 180 TPH. This was causing financial losses on quality deductions and rejection from export-grade lots.`,
                solution: 'Autocon conducted a full elevator audit including high-speed camera analysis of bucket discharge trajectory. The root cause was identified as excessive belt speed (3.4 m/s) combined with insufficient bucket projection. Autocon redesigned the bucket geometry, reduced belt speed to 2.8 m/s, and introduced a continuous-discharge (StarBelt) boot section which significantly reduced grain tumbling at the foot.',
                results: [
                    'Broken grain rate reduced from 2.8% to 0.4% — well within export grade tolerance',
                    'Throughput maintained at 180 TPH at the lower belt speed',
                    'Annual savings of ₹32 lakh on quality deductions',
                    'System now qualifies for APEDA export-grade certification',
                ],
                stats: [
                    { label: 'Grain Damage', value: '0.4%' },
                    { label: 'Annual Savings', value: '₹32L' },
                    { label: 'Throughput', value: '180 TPH' },
                    { label: 'Export Certified', value: 'Yes' },
                ],
                featured: true,
                date: new Date('2024-01-15'),
            },
            {
                title: 'Hygienic Screw Conveyor for Poultry Feed Line',
                slug: 'hygienic-screw-conveyor-poultry-feed',
                client: 'Godrej Agrovet Ltd.',
                industry: 'Animal Feed Manufacturing',
                location: 'Khopoli, Maharashtra',
                mainImage: csImgs.c3,
                images: [csImgs.c3],
                problem: 'Existing MS screw conveyors in the premix blending line were corroding due to the highly acidic nature of vitamin premix compounds. Metal contamination was detected in batch QC tests leading to batch rejections and a potential audit risk. The client needed a food-safe, corrosion-proof replacement without stopping production for more than 48 hours.',
                solution: 'Autocon engineered a complete drop-in replacement using SS316L troughs with internal bead-blasted finish (Ra < 0.8 µm). The screw flights were fabricated from SS316L with a continuous weld and electro-polished finish. A CIP (clean-in-place) spray nozzle manifold was integrated along the trough for weekly washdown. Flanged coupling ends allowed the swap to be completed in planned weekend downtime — precisely 41 hours.',
                results: [
                    'Zero metal contamination events since installation (14+ months)',
                    'Corrosion-free confirmed at 12-month internal inspection',
                    'CIP cycle reduces cleaning time from 8 hours to 90 minutes',
                    'Batch rejection rate in premix line dropped from 3.1% to 0%',
                ],
                stats: [
                    { label: 'Contamination Events', value: '0' },
                    { label: 'Cleaning Time', value: '-81%' },
                    { label: 'Batch Rejection', value: '0%' },
                    { label: 'Installation Time', value: '41 hrs' },
                ],
                featured: false,
                date: new Date('2024-05-20'),
            },
        ];

        console.log('\n💾 Inserting Case Studies…');
        for (const cs of caseStudies) {
            await CaseStudy.create(cs);
            console.log(`  ✅ Case Study: ${cs.title}`);
        }

        // ══════════════════════════════════════════════════════════════════
        // 4. BOOKINGS / ENQUIRIES
        // ══════════════════════════════════════════════════════════════════
        console.log('\n💾 Inserting sample Enquiries…');

        const enquiries = [
            {
                type: 'PRODUCT',
                name: 'Rajesh Sharma',
                company: 'UltraTech Cement',
                phone: '+91 9876543210',
                email: 'rajesh.sharma@ultratech.com',
                product: 'Heavy-Duty Belt Conveyor',
                quantity: 2,
                industry: 'Cement Industry',
                message: 'Requirement for 2 units of heavy-duty belt conveyors for our Navi Mumbai raw mill feed circuit. Please share competitive quote.',
                status: 'NEW',
            },
            {
                type: 'VISIT',
                name: 'Amit Patel',
                company: 'Reliance Logistics',
                phone: '+91 8765432109',
                email: 'amit.patel@ril.com',
                preferredDate: new Date('2024-10-15'),
                industry: 'Logistics',
                message: 'Interested in seeing a live demo of your roller conveyors and discussing our warehouse automation project.',
                status: 'NEW',
            },
            {
                type: 'ENQUIRY',
                name: 'Suresh Kumar',
                company: 'Adani Agri Logistics',
                phone: '+91 7654321098',
                email: 'suresh.k@adani.com',
                product: 'Bucket Elevator',
                industry: 'Grain Processing',
                message: 'Looking for a vertical bucket elevator for our Nagpur wheat terminal. Need 40 TPH capacity with zero grain damage.',
                status: 'CONTACTED',
            },
            {
                type: 'GENERAL',
                name: 'Vikram Singh',
                company: 'JSW Steel',
                phone: '+91 6543210987',
                email: 'vikram.singh@jsw.in',
                message: 'Do you provide AMC (Annual Maintenance Contracts) for existing third-party conveyor systems?',
                status: 'NEW',
            },
        ];

        for (const e of enquiries) {
            await Booking.create(e);
            console.log(`  ✅ Enquiry: ${e.name} (${e.type})`);
        }

        // ── Summary ────────────────────────────────────────────────────────
        console.log('\n=============================================');
        console.log('  🎉 SEED COMPLETE');
        console.log('=============================================');
        console.log(`  Products    : ${products.length}`);
        console.log(`  Projects    : ${projects.length}`);
        console.log(`  CaseStudies : ${caseStudies.length}`);
        console.log(`  Enquiries   : ${enquiries.length}`);
        console.log('  Admin account untouched.');
        console.log('=============================================\n');

        process.exit(0);
    } catch (err) {
        console.error('\n❌ Seed Error:', err);
        process.exit(1);
    }
};

seed();
