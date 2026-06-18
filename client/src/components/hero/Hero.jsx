import HeroContent from './HeroContent';
import HeroImage from './HeroImage';

export default function Hero() {
  return (
    <section className="relative w-full bg-[#0B1220] flex items-center pt-8 lg:pt-12 pb-16 overflow-hidden">
      {/* Subtle texture grid background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(249,115,22,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 w-full h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left Column -> Content */}
          <div className="w-full h-full flex items-center">
            <HeroContent />
          </div>

          {/* Right Column -> Image */}
          <div className="w-full flex justify-center lg:justify-end">
            <HeroImage />
          </div>
        </div>
      </div>
    </section>
  );
}
