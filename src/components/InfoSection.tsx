import { FileText, Scale, Building2, ArrowRight, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const InfoSection = () => {
  const regulations = [
    {
      icon: Scale,
      title: "Правила роздрібного ринку",
      description: "Постанова НКРЕКП №312 від 14.03.2018 встановлює правила функціонування роздрібного ринку електричної енергії України",
      link: "https://zakon.rada.gov.ua/laws/show/v0312874-18",
      color: "energy-blue",
    },
    {
      icon: Building2,
      title: "Регламент УЕЕХ",
      description: "Правила Української енергетичної біржі визначають порядок проведення аукціонів з купівлі-продажу електроенергії",
      link: "https://www.ueex.com.ua/documents/auction-docs/electric-power/",
      color: "energy-cyan",
    },
    {
      icon: FileText,
      title: "Гарантійні внески",
      description: "Ставки гарантійного внеску встановлюються біржею та оновлюються відповідно до ринкової ситуації",
      link: "https://www.ueex.com.ua/documents/auction-docs/electric-power/",
      color: "energy-green",
    },
  ];

  const auctionTypes = [
    {
      title: "Спеціалізований аукціон",
      description: "Обов'язковий продаж електроенергії виробниками на організованому ринку",
      features: ["Продаж виробників", "Комісія 0.5%", "Гарантійний внесок 10-15%"],
    },
    {
      title: "Комерційна секція",
      description: "Двосторонні договори між учасниками ринку",
      features: ["Купівля-продаж", "Комісія 0.3%", "Гарантійний внесок 8-12%"],
    },
    {
      title: "Двосторонній безперервний",
      description: "Постійні торги з автоматичним зведенням заявок",
      features: ["Онлайн торги", "Комісія 0.25%", "Гарантійний внесок 5-10%"],
    },
    {
      title: "Імпорт/Експорт",
      description: "Транскордонна торгівля електроенергією",
      features: ["Міжнародні операції", "Комісія 0.6%", "Гарантійний внесок 15-20%"],
    },
  ];

  return (
    <section id="info" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Regulations */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Нормативна база
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Калькулятор базується на чинному законодавстві України та правилах біржової торгівлі
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {regulations.map((item, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className={`w-12 h-12 rounded-xl bg-${item.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon className={`w-6 h-6 text-${item.color}`} />
                </div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm"
                >
                  Переглянути документ
                  <ExternalLink className="w-4 h-4" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Auction Types */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Типи аукціонів
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Українська енергетична біржа проводить різні типи торгів електроенергією
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {auctionTypes.map((auction, index) => (
            <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-energy" />
              <CardHeader>
                <CardTitle className="text-base">{auction.title}</CardTitle>
                <CardDescription className="text-sm">{auction.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {auction.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ArrowRight className="w-3 h-3 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Market Segments */}
        <div className="mt-20 p-8 rounded-2xl bg-gradient-hero text-sidebar-foreground">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-energy-cyan">Ринок на добу наперед</h3>
              <p className="text-sidebar-foreground/70 text-sm">
                Торгівля електроенергією на наступну добу. Заявки подаються до 12:00 за день до постачання.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-energy-green">Внутрішньодобовий ринок</h3>
              <p className="text-sidebar-foreground/70 text-sm">
                Коригування позицій протягом доби постачання. Торги проводяться безперервно.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-energy-yellow">Двосторонні договори</h3>
              <p className="text-sidebar-foreground/70 text-sm">
                Довгострокові контракти між учасниками ринку на визначений період постачання.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
