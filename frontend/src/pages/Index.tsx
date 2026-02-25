import { useState } from "react";
import Header from "@/components/Header";
import ImageUploader from "@/components/ImageUploader";
import PredictionResult, { Prediction } from "@/components/PredictionResult";
import { Brain } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [predictions, setPredictions] = useState<Prediction[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const normalizeConfidenceToPercent = (confidence: unknown): number => {
    const raw = typeof confidence === "number" ? confidence : Number(confidence);
    if (!Number.isFinite(raw)) return 0;

    // Some backends return 0..1, others 0..100. Normalize to 0..100.
    const asPercent = raw <= 1 ? raw * 100 : raw;
    return Math.min(100, Math.max(0, asPercent));
  };

  const mapBackendResponse = (data: any): Prediction[] => {
    const isMelanoma = data.class === "Melanoma";
    const isTinea = data.class === "Tinea";
    const isRandom = data.class === "Random Object";

    let description = "";
    let severity: "low" | "medium" | "high" | "unknown" = "unknown";
    let whatToDo: string[] = [];
    let whatNotToDo: string[] = [];
    let additionalInfo = "";

    if (isMelanoma) {
      description = "Malignant skin cancer arising from pigment-producing cells. Early detection is critical for treatment success.";
      severity = "high";
      whatToDo = [
        "Schedule an appointment with a dermatologist immediately.",
        "Keep the area protected from sun exposure.",
        "Take a baseline photo to monitor any rapid changes."
      ];
      whatNotToDo = [
        "Do not scratch, pick, or attempt to remove the lesion.",
        "Avoid prolonged sun exposure and tanning beds.",
        "Do not apply over-the-counter hydrocortisone or home remedies."
      ];
      additionalInfo = "Melanoma is the most dangerous type of skin cancer but is often highly treatable when detected early.";
    } else if (isTinea) {
      description = "Fungal infection causing circular, red, itchy patches on the skin. Treatable with antifungal medication.";
      severity = "medium";
      whatToDo = [
        "Keep the affected area clean and dry.",
        "Use over-the-counter antifungal creams unless a doctor prescribes otherwise.",
        "Wash your hands thoroughly after touching the affected area.",
        "Wash clothes and towels in hot water."
      ];
      whatNotToDo = [
        "Avoid sharing towels, clothing, or personal items.",
        "Do not wear tight, non-breathable clothing over the area.",
        "Do not scratch the area to prevent secondary bacterial infections."
      ];
      additionalInfo = "Tinea, also known as ringworm, is highly contagious and can spread to other parts of your body or to other people and pets.";
    } else if (isRandom) {
      description = "The uploaded image does not appear to contain skin tissue. Please upload a clear photo of the skin area you wish to analyze.";
      severity = "unknown";
      additionalInfo = "Our AI system first checks to ensure the image contains human skin before attempting a diagnosis.";
    }

    // Main prediction
    const output: Prediction[] = [
      {
        label: data.class,
        confidence: normalizeConfidenceToPercent(data.confidence),
        description: description,
        severity: severity,
        whatToDo: whatToDo.length > 0 ? whatToDo : undefined,
        whatNotToDo: whatNotToDo.length > 0 ? whatNotToDo : undefined,
        additionalInfo: additionalInfo || undefined
      }
    ];

    return output;
  };

  const handleImageUpload = async (file: File) => {
    setIsAnalyzing(true);
    setPredictions(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://zrn2003-skinsight-ai.hf.space/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.statusText}`);
      }

      const data = await response.json();
      const formattedPredictions = mapBackendResponse(data);

      setPredictions(formattedPredictions);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Analysis failed:", error);
      toast.error("Failed to analyze image. Please ensure the backend is running.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setPredictions(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Hero Section */}
          {!predictions && (
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="font-heading font-bold text-4xl sm:text-5xl text-foreground mb-4">
                AI-Powered{" "}
                <span className="gradient-text">Skin Analysis</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Upload a photo of your skin concern and get instant AI-powered predictions
                for conditions like melanoma, tinea, and more.
              </p>
            </div>
          )}

          {/* Main Content */}
          {predictions ? (
            <PredictionResult predictions={predictions} onReset={handleReset} />
          ) : (
            <ImageUploader onImageUpload={handleImageUpload} isAnalyzing={isAnalyzing} />
          )}

          {/* Features */}
          {!predictions && !isAnalyzing && (
            <div className="mt-16 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="bg-card/50 rounded-2xl p-8 md:p-12 text-center hover-lift border border-border/50">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-2xl text-foreground mb-4">Our Idea</h3>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  SkinSight bridges the gap between patient uncertainty and professional diagnosis.
                  By leveraging state-of-the-art computer vision technology, we provide an accessible,
                  first-line screening tool for common skin conditions. Our two-stage AI pipeline
                  ensures robust analysis: first verifying the image contains skin, and then providing
                  a precise classification between critical conditions like Melanoma and treatable
                  issues like Tinea. We aim to empower users with information, encouraging timely
                  medical consultations and early intervention.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
