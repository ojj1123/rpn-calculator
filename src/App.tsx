import { useEffect, useState } from "react";
import { infixToPostfix, type Operator, tokenize } from "./utils/infix-to-postfix";

// TODO would be input form state
const expression = "A + B / C * D * ( E + F )";
const tokens = tokenize(expression);
const result = infixToPostfix(tokens);

function App() {
  const stepper = useStepper({ initialStep: 0, endStep: result.length - 1 });
  const exp = result[stepper.step].exp;
  const operatorStack = result[stepper.step].operatorStack;
  const postfix = result[stepper.step].postfix.join(" ");

  return (
    <main className="flex flex-col gap-10">
      <ul className="flex gap-3">
        {tokens.map((token, index) => {
          return (
            <li key={index} className={`${index === exp.index ? "text-red-500" : "text-black"}`}>
              {token}
            </li>
          );
        })}
      </ul>
      <div className="flex gap-5">
        <OperatorStack stack={operatorStack} />
        <div className="flex flex-col">
          <RPN postfix={postfix} />
          <div className="flex">
            <button type="button" onClick={() => stepper.start()}>
              시작
            </button>
            <button type="button" onClick={() => stepper.stop()}>
              중단
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function OperatorStack({ stack }: { stack: Operator[] }) {
  return (
    <ul className="flex h-48 w-24 flex-col-reverse gap-2 rounded-b-sm border-2 border-blue-500 border-t-transparent bg-blue-300 p-1">
      {stack.map((op, index) => {
        return (
          <li
            className="w-full rounded-sm border-2 border-red-500 bg-red-300 p-2 text-center"
            key={index}
          >
            {op}
          </li>
        );
      })}
    </ul>
  );
}

function RPN({ postfix }: { postfix: string }) {
  return <>{postfix}</>;
}

type Status = "running" | "pause";

function useStepper({ initialStep = 0, endStep = 0 }) {
  const [step, setStep] = useState(initialStep);
  const [status, setStatus] = useState<Status>("pause");

  const start = () => {
    setStatus("running");
  };

  const stop = () => {
    setStatus("pause");
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

  return { step, start, stop };
}

export default App;
