import { useEffect, useState } from "react";

type Status = "running" | "pause";

export function usePlayer({ initialStep = 0, endStep = 0 }) {
  const [step, setStep] = useState(initialStep);
  const [status, setStatus] = useState<Status>("pause");

  const start = () => {
    setStatus("running");
  };

  const stop = () => {
    setStatus("pause");
  };

  const reset = () => {
    setStep(initialStep);
  };

  useEffect(() => {
    if (step >= endStep) {
      setStatus("pause");
    }
  }, [step, endStep]);

  useEffect(() => {
    let intervalId: number | null = null;

    if (status === "running") {
      intervalId = setInterval(() => {
        setStep((prev) => prev + 1);
      }, 300);
    } else {
      if (intervalId) {
        clearInterval(intervalId);
      }
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [status]);

  return { step, start, stop, reset };
}
