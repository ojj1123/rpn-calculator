import { useEffect, useReducer } from "react";

type State = { status: "init" | "running" | "pause" | "end"; step: number };
type Action =
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "RESET"; payload: { initialStep: number } }
  | { type: "END" }
  | { type: "INCREMENTAL" };

export function usePlayer({ initialStep = 0, endStep = 0, interval = 500 }) {
  const [state, dispatch] = useReducer(reducer, { status: "init", step: initialStep });
  const { status, step } = state;

  const start = () => {
    dispatch({ type: "START" });
  };

  const pause = () => {
    dispatch({ type: "PAUSE" });
  };

  const reset = () => {
    dispatch({ type: "RESET", payload: { initialStep } });
  };

  useEffect(() => {
    if (step >= endStep) {
      dispatch({ type: "END" });
    }
  }, [step, endStep]);

  useEffect(() => {
    let intervalId: number | null = null;

    if (status === "running") {
      intervalId = setInterval(() => {
        dispatch({ type: "INCREMENTAL" });
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
  }, [status, interval]);

  return { status, step, start, pause, reset };
}

function reducer(state: State, action: Action): State {
  const { status } = state;
  switch (action.type) {
    case "START": {
      if (status === "init" || status === "pause") {
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
      if (status !== "init") {
        return { status: "init", step: action.payload.initialStep };
      }
      break;
    }
    case "END": {
      if (status === "pause" || status === "running") {
        return { ...state, status: "end" };
      }
      break;
    }
    case "INCREMENTAL": {
      if (status === "running") {
        return { ...state, step: state.step + 1 };
      }
    }
  }
  return state;
}
