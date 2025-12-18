import { Zap, TrendingUp, Shield } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] bg-gradient-hero overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-energy-blue/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-energy-cyan/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-energy-green/5 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(hsl(200 100% 50% / 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(200 100% 50% / 0.1) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="container relative z-10 mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-energy-blue/20 border border-energy-blue/30 mb-8 animate-fade-in">
            <Zap className="w-4 h-4 text-energy-cyan" />
            <span className="text-sm font-medium text-energy-cyan">
              Energy Store Group
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-slide-up text-sidebar-foreground">
            Номінація{" "}
            <span className="bg-gradient-to-r from-energy-blue to-energy-green bg-clip-text text-transparent">
              Е/Е
            </span>
          </h1>

          <p className="text-lg md:text-xl text-sidebar-foreground/70 mb-12 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Калькулятор для розрахунку вартості продажу та купівлі електричної енергії на біржових аукціонах 
            відповідно до правил НКРЕКП та регламенту УЕЕХ
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <a
              href="#calculator"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-energy text-primary-foreground font-semibold rounded-xl shadow-glow hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Zap className="w-5 h-5" />
              Розрахувати зараз
            </a>
            <a
              href="#info"
              className="inline-flex items-center gap-2 px-8 py-4 bg-sidebar-accent/50 text-sidebar-foreground border border-energy-blue/30 font-semibold rounded-xl hover:bg-sidebar-accent transition-all duration-300"
            >
              Дізнатися більше
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: "0.6s" }}>
            <div className="p-6 rounded-2xl bg-sidebar-accent/30 border border-energy-blue/20 backdrop-blur-sm">
              <TrendingUp className="w-8 h-8 text-energy-blue mb-3 mx-auto" />
              <div className="text-3xl font-bold text-sidebar-foreground mb-1">24/7</div>
              <div className="text-sm text-sidebar-foreground/60">Доступ</div>
            </div>
            <div className="p-6 rounded-2xl bg-sidebar-accent/30 border border-energy-cyan/20 backdrop-blur-sm">
              <Shield className="w-8 h-8 text-energy-cyan mb-3 mx-auto" />
              <div className="text-3xl font-bold text-sidebar-foreground mb-1">100%</div>
              <div className="text-sm text-sidebar-foreground/60">Відповідність НКРЕКП</div>
            </div>
            <div className="p-6 rounded-2xl bg-sidebar-accent/30 border border-energy-green/20 backdrop-blur-sm">
              <Zap className="w-8 h-8 text-energy-green mb-3 mx-auto" />
              <div className="text-3xl font-bold text-sidebar-foreground mb-1">МВт·год</div>
              <div className="text-sm text-sidebar-foreground/60">Точні розрахунки</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
