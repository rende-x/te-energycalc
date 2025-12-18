import { Menu, X } from "lucide-react";
import { useState } from "react";
import logoEsg from "@/assets/logo-esg.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-energy-dark/95 backdrop-blur-md border-b border-sidebar-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <img src={logoEsg} alt="ESG Logo" className="h-10 w-auto" />
            <span className="font-bold text-sidebar-foreground hidden sm:block">
              Номінація Е/Е
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#calculator" className="text-sidebar-foreground/70 hover:text-energy-cyan transition-colors text-sm font-medium">
              Калькулятор
            </a>
            <a href="#mms-xml" className="text-sidebar-foreground/70 hover:text-energy-cyan transition-colors text-sm font-medium">
              MMS XML
            </a>
            <a href="#prices" className="text-sidebar-foreground/70 hover:text-energy-cyan transition-colors text-sm font-medium">
              Ціни
            </a>
            <a href="#info" className="text-sidebar-foreground/70 hover:text-energy-cyan transition-colors text-sm font-medium">
              Інформація
            </a>
            <a
              href="https://www.ueex.com.ua/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sidebar-foreground/70 hover:text-energy-cyan transition-colors text-sm font-medium"
            >
              УЕЕХ
            </a>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a
              href="#calculator"
              className="px-5 py-2 bg-gradient-energy text-primary-foreground font-medium rounded-lg text-sm hover:opacity-90 transition-opacity"
            >
              Розрахувати
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-sidebar-foreground"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-sidebar-border">
            <nav className="flex flex-col gap-4">
              <a
                href="#calculator"
                onClick={() => setIsMenuOpen(false)}
                className="text-sidebar-foreground/70 hover:text-energy-cyan transition-colors text-sm font-medium"
              >
                Калькулятор
              </a>
              <a
                href="#mms-xml"
                onClick={() => setIsMenuOpen(false)}
                className="text-sidebar-foreground/70 hover:text-energy-cyan transition-colors text-sm font-medium"
              >
                MMS XML
              </a>
              <a
                href="#prices"
                onClick={() => setIsMenuOpen(false)}
                className="text-sidebar-foreground/70 hover:text-energy-cyan transition-colors text-sm font-medium"
              >
                Ціни
              </a>
              <a
                href="#info"
                onClick={() => setIsMenuOpen(false)}
                className="text-sidebar-foreground/70 hover:text-energy-cyan transition-colors text-sm font-medium"
              >
                Інформація
              </a>
              <a
                href="https://www.ueex.com.ua/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sidebar-foreground/70 hover:text-energy-cyan transition-colors text-sm font-medium"
              >
                УЕЕХ
              </a>
              <a
                href="#calculator"
                onClick={() => setIsMenuOpen(false)}
                className="px-5 py-2 bg-gradient-energy text-primary-foreground font-medium rounded-lg text-sm text-center"
              >
                Розрахувати
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
