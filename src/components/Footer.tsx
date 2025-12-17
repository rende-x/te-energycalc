import { Zap, ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-energy-dark py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-energy flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-sidebar-foreground">ЕнергоКалькулятор</span>
            </div>
            <p className="text-sidebar-foreground/60 text-sm">
              Інструмент для розрахунку вартості купівлі та продажу електроенергії 
              на українському біржовому ринку
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sidebar-foreground mb-4">Корисні посилання</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.ueex.com.ua/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sidebar-foreground/60 hover:text-energy-cyan text-sm inline-flex items-center gap-1"
                >
                  Українська енергетична біржа
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.nerc.gov.ua/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sidebar-foreground/60 hover:text-energy-cyan text-sm inline-flex items-center gap-1"
                >
                  НКРЕКП
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://zakon.rada.gov.ua/laws/show/2019-19"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sidebar-foreground/60 hover:text-energy-cyan text-sm inline-flex items-center gap-1"
                >
                  Закон про ринок електроенергії
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sidebar-foreground mb-4">Інформація</h4>
            <p className="text-sidebar-foreground/60 text-sm mb-4">
              Калькулятор має інформаційний характер. Для точних розрахунків 
              звертайтесь до офіційних джерел та біржових документів.
            </p>
            <p className="text-sidebar-foreground/40 text-xs">
              Дані актуальні станом на грудень 2025 року
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-sidebar-border text-center">
          <p className="text-sidebar-foreground/40 text-sm">
            © {new Date().getFullYear()} ЕнергоКалькулятор. Всі права захищено.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
