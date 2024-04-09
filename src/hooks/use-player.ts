import { useEffect, useReducer } from "react";

type State = { status: "running" | "pause"; step: number };
type Action =
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "RESET"; payload: { initialStep: number } }
  | { type: "END" }
  | { type: "INCREMENTAL"; payload: { endStep: number } }
  | { type: "DECREMENTAL"; payload: { initialStep: number } };

export function usePlayer({ initialStep = 0, endStep = 0, interval = 500 }) {
  const [{ status, step }, dispatch] = useReducer(reducer, { status: "pause", step: initialStep });
  const isFirst = step === initialStep;
  const isLast = step === endStep;

  const start = () => {
    dispatch({ type: "START" });
  };

  const pause = () => {
    dispatch({ type: "PAUSE" });
  };

  const reset = () => {
    dispatch({ type: "RESET", payload: { initialStep } });
  };

  const prev = () => {
    dispatch({ type: "DECREMENTAL", payload: { initialStep } });
  };

  const next = () => {
    dispatch({ type: "INCREMENTAL", payload: { endStep } });
  };

  useEffect(() => {
    let intervalId: number | null = null;

    if (status === "running") {
      intervalId = setInterval(() => {
        dispatch({ type: "INCREMENTAL", payload: { endStep } });
      }, interval);
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
  }, [status, interval, endStep]);

  const state = {
    step,
    status,
    isFirst,
    isLast,
  };

  return { state, start, pause, reset, prev, next };
}

function reducer(state: State, action: Action): State {
  const { status } = state;
  switch (action.type) {
    case "START": {
      if (status === "pause") {
        return { ...state, status: "running" };
      }
      break;
    }
    case "PAUSE": {
      if (status === "running") {
        return { ...state, status: "pause" };
      }
      break;
    }
    case "RESET": {
      return { status: "pause", step: action.payload.initialStep };
    }
    case "END": {
      return { ...state, status: "pause" };
    }
    case "INCREMENTAL": {
      if (state.step === action.payload.endStep) {
        return { ...state, status: "pause" };
      }
      return { ...state, step: state.step + 1 };
    }
    case "DECREMENTAL": {
      if (state.step === action.payload.initialStep) {
        return { ...state, status: "running" };
      }
      return { ...state, step: state.step - 1 };
    }
  }
  return state;
}
