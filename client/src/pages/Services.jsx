
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Settings, Box, PenTool, ArrowRight } from 'lucide-react';

const services = [
    {
        id: 1,
        title: "Industrial Automation",
        description: "End-to-end automation solutions to streamline your manufacturing processes, improve efficiency, and reduce operational costs.",
        icon: <Settings size={48} className="text-primary" />,
        features: ["PLC Programming", "HMI Design", "SCADA Systems", "Robotic Integration"]
    },
    {
        id: 2,
        title: "Machine Structures",
        description: "Robust and modular aluminum profile structures custom-designed for your machines, workstations, and safety guarding.",
        icon: <Box size={48} className="text-primary" />,
        features: ["Aluminum Profiles", "Safety Fencing", "Workstations", "Conveyor Supports"]
    },
    {
        id: 3,
        title: "Fabrication Services",
        description: "Precision fabrication services including cutting, drilling, tapping, and assembly of industrial components.",
        icon: <PenTool size={48} className="text-primary" />,
        features: ["CNC Machining", "Sheet Metal Work", "Assembly Services", "Custom Fixtures"]
    }
];

const Services = () => {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl mb-4">
                        Our <span className="text-primary">Services</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        We provide comprehensive solutions tailored to your industrial needs, from design to execution.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -10 }}
                            className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 flex flex-col h-full"
                        >
                            <div className="mb-6 bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto md:mx-0">
                                {service.icon}
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center md:text-left">{service.title}</h3>
                            <p className="text-slate-600 mb-6 text-center md:text-left flex-grow">
                                {service.description}
                            </p>

                            <ul className="space-y-2 mb-8">
                                {service.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center text-slate-700 bg-slate-50 p-2 rounded-md">
                                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                to="/contact"
                                state={{ productName: service.title }} // Pre-fill enquiry with service name
                                className="mt-auto w-full flex items-center justify-center space-x-2 bg-white text-primary border-2 border-primary py-3 rounded-lg font-bold hover:bg-primary hover:text-white transition-all group"
                            >
                                <span>Request Service</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="mt-20 bg-primary rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden"
                >
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Need a Custom Solution?</h2>
                        <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                            Our engineering team is ready to tackle your most challenging projects. Let's discuss how we can optimize your operations.
                        </p>
                        <Link
                            to="/contact"
                            className="bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors inline-block shadow-lg"
                        >
                            Contact Our Experts
                        </Link>
                    </div>

                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute top-[-50%] left-[-20%] w-[800px] h-[800px] rounded-full bg-white blur-3xl"></div>
                        <div className="absolute bottom-[-50%] right-[-20%] w-[800px] h-[800px] rounded-full bg-blue-400 blur-3xl"></div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Services;
