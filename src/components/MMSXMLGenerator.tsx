import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileCode2, Download, Plus, Trash2, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface TimeSeriesEntry {
  id: string;
  senderEIC: string;
  senderName: string;
  receiverEIC: string;
  receiverName: string;
  inDomain: string;
  outDomain: string;
  hourlyValues: number[];
}

const DOMAINS = [
  { code: "10Y1001C--000182", name: "Україна (OEC)" },
  { code: "10YUA-WEPS-----0", name: "Україна (УЕЕХ)" },
  { code: "10YHU-MAVIR----U", name: "Угорщина" },
  { code: "10YSK-SEPS-----K", name: "Словацька республіка" },
  { code: "10YPL-AREA-----S", name: "Польща" },
  { code: "10YRO-TEL------P", name: "Румунія" },
];

const PROCESS_TYPES = [
  { code: "A01", name: "Ринок на добу наперед (РДН)" },
  { code: "A18", name: "Внутрішньодобовий ринок (ВДР)" },
  { code: "A05", name: "Двосторонні договори" },
];

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const MMSXMLGenerator = () => {
  const [documentId, setDocumentId] = useState(generateUUID().toUpperCase());
  const [revision, setRevision] = useState("1");
  const [processType, setProcessType] = useState("A01");
  const [senderEIC, setSenderEIC] = useState("");
  const [senderRole, setSenderRole] = useState("A01");
  const [receiverEIC, setReceiverEIC] = useState("10X1001A1001A450");
  const [receiverRole, setReceiverRole] = useState("A04");
  const [selectedDate, setSelectedDate] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [timeSeries, setTimeSeries] = useState<TimeSeriesEntry[]>([
    {
      id: generateUUID(),
      senderEIC: "",
      senderName: "",
      receiverEIC: "",
      receiverName: "",
      inDomain: "10Y1001C--000182",
      outDomain: "10Y1001C--000182",
      hourlyValues: Array(24).fill(0),
    },
  ]);
  const [generatedXML, setGeneratedXML] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const addTimeSeries = () => {
    setTimeSeries([
      ...timeSeries,
      {
        id: generateUUID(),
        senderEIC: "",
        senderName: "",
        receiverEIC: "",
        receiverName: "",
        inDomain: "10Y1001C--000182",
        outDomain: "10Y1001C--000182",
        hourlyValues: Array(24).fill(0),
      },
    ]);
  };

  const removeTimeSeries = (id: string) => {
    if (timeSeries.length > 1) {
      setTimeSeries(timeSeries.filter((ts) => ts.id !== id));
    }
  };

  const updateTimeSeries = (id: string, field: keyof TimeSeriesEntry, value: any) => {
    setTimeSeries(
      timeSeries.map((ts) => (ts.id === id ? { ...ts, [field]: value } : ts))
    );
  };

  const updateHourlyValue = (tsId: string, hour: number, value: number) => {
    setTimeSeries(
      timeSeries.map((ts) => {
        if (ts.id === tsId) {
          const newValues = [...ts.hourlyValues];
          newValues[hour] = value;
          return { ...ts, hourlyValues: newValues };
        }
        return ts;
      })
    );
  };

  const fillAllHours = (tsId: string, value: number) => {
    setTimeSeries(
      timeSeries.map((ts) => {
        if (ts.id === tsId) {
          return { ...ts, hourlyValues: Array(24).fill(value) };
        }
        return ts;
      })
    );
  };

  const formatDateForXML = (date: string, hour: number = 0) => {
    const d = new Date(date);
    d.setUTCHours(hour, 0, 0, 0);
    return d.toISOString().replace('.000', '');
  };

  const generateXML = useCallback(() => {
    const startDate = new Date(selectedDate);
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setUTCDate(endDate.getUTCDate() + 1);

    const timeSeriesXML = timeSeries
      .map((ts, index) => {
        const pointsXML = ts.hourlyValues
          .map((value, hour) => `
          <Point>
            <position>${hour + 1}</position>
            <quantity>${value}</quantity>
          </Point>`)
          .join("");

        return `
    <TimeSeries>
      <mRID>${index + 1}</mRID>
      <businessType>A01</businessType>
      <product>8716867000016</product>
      <objectAggregation>A01</objectAggregation>
      <in_Domain.mRID codingScheme="A01">${ts.inDomain}</in_Domain.mRID>
      <out_Domain.mRID codingScheme="A01">${ts.outDomain}</out_Domain.mRID>
      <in_MarketParticipant.mRID codingScheme="A01">${ts.senderEIC || senderEIC}</in_MarketParticipant.mRID>
      <out_MarketParticipant.mRID codingScheme="A01">${ts.receiverEIC || receiverEIC}</out_MarketParticipant.mRID>
      <measurement_Unit.name>MAW</measurement_Unit.name>
      <curveType>A01</curveType>
      <Period>
        <timeInterval>
          <start>${startDate.toISOString().replace('.000', '')}</start>
          <end>${endDate.toISOString().replace('.000', '')}</end>
        </timeInterval>
        <resolution>PT60M</resolution>${pointsXML}
      </Period>
    </TimeSeries>`;
      })
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Schedule_MarketDocument xmlns="urn:iec62325.351:tc57wg16:451-7:scheduledocument:7:0">
  <mRID>${documentId}</mRID>
  <revisionNumber>${revision}</revisionNumber>
  <type>A01</type>
  <process.processType>${processType}</process.processType>
  <sender_MarketParticipant.mRID codingScheme="A01">${senderEIC}</sender_MarketParticipant.mRID>
  <sender_MarketParticipant.marketRole.type>${senderRole}</sender_MarketParticipant.marketRole.type>
  <receiver_MarketParticipant.mRID codingScheme="A01">${receiverEIC}</receiver_MarketParticipant.mRID>
  <receiver_MarketParticipant.marketRole.type>${receiverRole}</receiver_MarketParticipant.marketRole.type>
  <createdDateTime>${new Date().toISOString().replace('.000', '')}</createdDateTime>
  <schedule_Time_Period.timeInterval>
    <start>${startDate.toISOString().replace('.000', '')}</start>
    <end>${endDate.toISOString().replace('.000', '')}</end>
  </schedule_Time_Period.timeInterval>${timeSeriesXML}
</Schedule_MarketDocument>`;

    setGeneratedXML(xml);
    toast.success("XML документ згенеровано успішно!");
  }, [documentId, revision, processType, senderEIC, senderRole, receiverEIC, receiverRole, selectedDate, timeSeries]);

  const downloadXML = () => {
    if (!generatedXML) return;

    const blob = new Blob([generatedXML], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Schedule_${selectedDate}_rev${revision}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("XML файл завантажено!");
  };

  const copyXML = async () => {
    if (!generatedXML) return;
    await navigator.clipboard.writeText(generatedXML);
    setCopied(true);
    toast.success("XML скопійовано в буфер обміну!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="mms-xml" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-energy-green/10 border border-energy-green/20 mb-4">
            <FileCode2 className="w-4 h-4 text-energy-green" />
            <span className="text-sm font-medium text-energy-green">MMS XML</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Генератор MMS XML
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Створення XML документів формату ENTSO-E Schedule_MarketDocument для ринку електроенергії
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Параметри документа */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Параметри документа</CardTitle>
              <CardDescription>Загальні налаштування XML документа</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="docId">ID документа</Label>
                  <Input
                    id="docId"
                    value={documentId}
                    onChange={(e) => setDocumentId(e.target.value)}
                    className="font-mono text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="revision">Ревізія</Label>
                  <Input
                    id="revision"
                    type="number"
                    min="1"
                    value={revision}
                    onChange={(e) => setRevision(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Дата постачання</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="processType">Тип процесу</Label>
                  <Select value={processType} onValueChange={setProcessType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROCESS_TYPES.map((pt) => (
                        <SelectItem key={pt.code} value={pt.code}>
                          {pt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-3">Відправник</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="senderEIC">EIC код відправника</Label>
                    <Input
                      id="senderEIC"
                      value={senderEIC}
                      onChange={(e) => setSenderEIC(e.target.value)}
                      placeholder="62X..."
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="senderRole">Роль</Label>
                    <Select value={senderRole} onValueChange={setSenderRole}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A01">Виробник (A01)</SelectItem>
                        <SelectItem value="A02">Постачальник (A02)</SelectItem>
                        <SelectItem value="A06">Споживач (A06)</SelectItem>
                        <SelectItem value="A08">Трейдер (A08)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Отримувач</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="receiverEIC">EIC код отримувача</Label>
                    <Input
                      id="receiverEIC"
                      value={receiverEIC}
                      onChange={(e) => setReceiverEIC(e.target.value)}
                      placeholder="10X..."
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="receiverRole">Роль</Label>
                    <Select value={receiverRole} onValueChange={setReceiverRole}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A04">Системний оператор (A04)</SelectItem>
                        <SelectItem value="A32">Оператор ринку (A32)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* TimeSeries */}
          <div className="space-y-4">
            {timeSeries.map((ts, tsIndex) => (
              <Card key={ts.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      TimeSeries #{tsIndex + 1}
                    </CardTitle>
                    {timeSeries.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTimeSeries(ts.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>In Domain</Label>
                      <Select
                        value={ts.inDomain}
                        onValueChange={(v) => updateTimeSeries(ts.id, "inDomain", v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DOMAINS.map((d) => (
                            <SelectItem key={d.code} value={d.code}>
                              {d.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Out Domain</Label>
                      <Select
                        value={ts.outDomain}
                        onValueChange={(v) => updateTimeSeries(ts.id, "outDomain", v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DOMAINS.map((d) => (
                            <SelectItem key={d.code} value={d.code}>
                              {d.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>EIC контрагента (In)</Label>
                      <Input
                        value={ts.senderEIC}
                        onChange={(e) => updateTimeSeries(ts.id, "senderEIC", e.target.value)}
                        placeholder="62X..."
                        className="font-mono text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>EIC контрагента (Out)</Label>
                      <Input
                        value={ts.receiverEIC}
                        onChange={(e) => updateTimeSeries(ts.id, "receiverEIC", e.target.value)}
                        placeholder="62X..."
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Погодинні значення (МВт)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="Значення"
                          className="w-24 h-8 text-sm"
                          id={`fill-${ts.id}`}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const input = document.getElementById(`fill-${ts.id}`) as HTMLInputElement;
                            const value = parseFloat(input?.value || "0");
                            fillAllHours(ts.id, value);
                          }}
                        >
                          Заповнити всі
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-6 md:grid-cols-8 gap-1">
                      {ts.hourlyValues.map((value, hour) => (
                        <div key={hour} className="space-y-1">
                          <span className="text-[10px] text-muted-foreground block text-center">
                            {hour.toString().padStart(2, "0")}:00
                          </span>
                          <Input
                            type="number"
                            value={value}
                            onChange={(e) => updateHourlyValue(ts.id, hour, parseFloat(e.target.value) || 0)}
                            className="h-8 text-xs text-center px-1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button onClick={addTimeSeries} variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Додати TimeSeries
            </Button>
          </div>
        </div>

        {/* Кнопки генерації */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button onClick={generateXML} size="lg" className="bg-energy-green hover:bg-energy-green/90">
            <FileCode2 className="w-5 h-5 mr-2" />
            Згенерувати XML
          </Button>
          {generatedXML && (
            <>
              <Button onClick={downloadXML} variant="outline" size="lg">
                <Download className="w-5 h-5 mr-2" />
                Завантажити XML
              </Button>
              <Button onClick={copyXML} variant="outline" size="lg">
                {copied ? (
                  <Check className="w-5 h-5 mr-2" />
                ) : (
                  <Copy className="w-5 h-5 mr-2" />
                )}
                {copied ? "Скопійовано!" : "Копіювати"}
              </Button>
            </>
          )}
        </div>

        {/* Preview XML */}
        {generatedXML && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">Попередній перегляд XML</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono max-h-96 overflow-y-auto">
                {generatedXML}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default MMSXMLGenerator;
