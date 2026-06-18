import Hero from '../components/hero/Hero';
import StatsSection from '../components/StatsSection';
import CategoryGrid from '../components/CategoryGrid';
import AboutSection from '../components/AboutSection';
import IndustriesGrid from '../components/IndustriesGrid';
import WhyChooseUs from '../components/WhyChooseUs';
import ProcessTimeline from '../components/ProcessTimeline';
import ProjectsGallery from '../components/ProjectsGallery';
import InquiryForm from '../components/InquiryForm';

const Home = () => {
    return (
        <div className="min-h-screen">
            <Hero />
            <StatsSection />
            <CategoryGrid />
            <AboutSection />
            <IndustriesGrid />
            <WhyChooseUs />
            <ProcessTimeline />
            <ProjectsGallery />
            <InquiryForm />
        </div>
    );
};

export default Home;
