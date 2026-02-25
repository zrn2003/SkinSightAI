import { AlertTriangle, CheckCircle, Info, HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ConfidenceBar from "./ConfidenceBar";
import { cn } from "@/lib/utils";

export interface Prediction {
  label: string;
  confidence: number;
  description: string;
  severity: "low" | "medium" | "high" | "unknown";
  whatToDo?: string[];
  whatNotToDo?: string[];
  additionalInfo?: string;
}

interface PredictionResultProps {
  predictions: Prediction[];
  onReset: () => void;
}

const PredictionResult = ({ predictions, onReset }: PredictionResultProps) => {
  const topPrediction = predictions[0];

  const getSeverityConfig = (severity: Prediction["severity"]) => {
    switch (severity) {
      case "high":
        return {
          icon: AlertTriangle,
          color: "text-destructive",
          bgColor: "bg-destructive/10",
          borderColor: "border-destructive/30",
          variant: "danger" as const,
        };
      case "medium":
        return {
          icon: Info,
          color: "text-warning",
          bgColor: "bg-warning/10",
          borderColor: "border-warning/30",
          variant: "warning" as const,
        };
      case "low":
        return {
          icon: CheckCircle,
          color: "text-success",
          bgColor: "bg-success/10",
          borderColor: "border-success/30",
          variant: "success" as const,
        };
      default:
        return {
          icon: HelpCircle,
          color: "text-muted-foreground",
          bgColor: "bg-muted",
          borderColor: "border-border",
          variant: "default" as const,
        };
    }
  };

  const topConfig = getSeverityConfig(topPrediction.severity);
  const TopIcon = topConfig.icon;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-slide-up">
      {/* Top Prediction Card */}
      <Card className={cn(
        "p-6 border-2 shadow-elevated",
        topConfig.borderColor,
        topConfig.bgColor
      )}>
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className={cn(
            "w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shrink-0",
            topConfig.bgColor
          )}>
            <TopIcon className={cn("w-6 h-6 sm:w-7 sm:h-7", topConfig.color)} />
          </div>

          <div className="flex-1 w-full min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Primary Detection
              </span>
            </div>
            <h3 className="font-heading font-bold text-2xl text-foreground mb-2">
              {topPrediction.label}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {topPrediction.description}
            </p>

            <div className="space-y-1">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Confidence score</span>
                <span className={cn("font-bold", topConfig.color)}>
                  {Number.isFinite(topPrediction.confidence)
                    ? `${topPrediction.confidence.toFixed(1)}%`
                    : "0.0%"}
                </span>
              </div>
              <ConfidenceBar
                value={topPrediction.confidence}
                variant={topConfig.variant}
                size="lg"
                showPercentage={false}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Disease Details Grid */}
      {(topPrediction.whatToDo || topPrediction.whatNotToDo) && (
        <div className="grid sm:grid-cols-2 gap-4">
          {topPrediction.whatToDo && topPrediction.whatToDo.length > 0 && (
            <Card className="p-5 border-success/30 bg-success/5 shadow-sm hover-lift">
              <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-success shrink-0" />
                What to do
              </h4>
              <ul className="space-y-2">
                {topPrediction.whatToDo.map((item, idx) => (
                  <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-success mt-0.5 shrink-0 px-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {topPrediction.whatNotToDo && topPrediction.whatNotToDo.length > 0 && (
            <Card className="p-5 border-destructive/30 bg-destructive/5 shadow-sm hover-lift">
              <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
                What NOT to do
              </h4>
              <ul className="space-y-2">
                {topPrediction.whatNotToDo.map((item, idx) => (
                  <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-destructive mt-0.5 shrink-0 px-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}

      {/* Additional Information */}
      {topPrediction.additionalInfo && (
        <Card className="p-5 border-primary/20 bg-primary/5 shadow-sm hover-lift">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground mb-1">
                Important Information
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {topPrediction.additionalInfo}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Other Predictions */}
      {predictions.length > 1 && (
        <div className="space-y-3">
          <h4 className="font-heading font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Other Possible Conditions
          </h4>

          <div className="grid gap-3">
            {predictions.slice(1).map((prediction, index) => {
              const config = getSeverityConfig(prediction.severity);
              const Icon = config.icon;

              return (
                <Card
                  key={index}
                  className="p-4 hover-lift border border-border/50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                        config.bgColor
                      )}>
                        <Icon className={cn("w-5 h-5", config.color)} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-foreground">
                          {prediction.label}
                        </h5>
                        <p className="text-xs text-muted-foreground truncate">
                          {prediction.description}
                        </p>
                      </div>
                    </div>

                    <div className="w-full sm:w-32 shrink-0 mt-2 sm:mt-0 pl-14 sm:pl-0">
                      <ConfidenceBar
                        value={prediction.confidence}
                        variant={config.variant}
                        size="sm"
                        showPercentage={true}
                      />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Disclaimer & Actions */}
      <Card className="p-4 bg-accent/50 border-accent">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-accent-foreground shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-accent-foreground">
              This analysis is for informational purposes only and should not replace professional medical advice.
              Please consult a dermatologist for accurate diagnosis.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex justify-center pt-2">
        <Button variant="hero" size="lg" onClick={onReset}>
          Analyze Another Image
        </Button>
      </div>
    </div>
  );
};

export default PredictionResult;
