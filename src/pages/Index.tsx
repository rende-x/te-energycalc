import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ElectricityCalculator from "@/components/ElectricityCalculator";
import PriceChart from "@/components/PriceChart";
import InfoSection from "@/components/InfoSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <HeroSection />
        <ElectricityCalculator />
        <PriceChart />
        <InfoSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
