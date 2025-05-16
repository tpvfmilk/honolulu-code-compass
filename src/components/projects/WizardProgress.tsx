
import { WizardStep } from "./types";

type WizardProgressProps = {
  steps: WizardStep[];
  currentStep: number;
};

export const WizardProgress = ({ steps, currentStep }: WizardProgressProps) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between">
        {steps.map((step, i) => (
          <div
            key={step.id}
            className="flex flex-col items-center"
            style={{ width: `${100 / steps.length}%` }}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                i <= currentStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`text-xs text-center ${
                i <= currentStep ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
            {i < steps.length - 1 && (
              <div
                className={`h-[2px] w-full ${
                  i < currentStep ? "bg-primary" : "bg-secondary"
                }`}
                style={{
                  position: "absolute",
                  left: `calc(${(i + 0.5) * (100 / steps.length)}%)`,
                  width: `${100 / steps.length}%`,
                  top: "1rem",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
