import { useStepper } from "./hooks/useStepper";
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
            <li
              key={index}
              className={`${index === exp.index ? "text-red-500" : "text-black"} text-xl`}
            >
              {token}
            </li>
          );
        })}
      </ul>
      <div className="flex gap-5">
        <OperatorStack stack={operatorStack} />
        <div className="flex flex-1 flex-col justify-between">
          <RPN postfix={postfix} />
          <div className="flex gap-2">
            <button
              className="cursor-pointer rounded-md border border-transparent bg-gray-500 px-3 py-2 text-white transition-[border-color] hover:border-gray-900 "
              type="button"
              onClick={() => stepper.start()}
            >
              시작
            </button>
            <button
              className="cursor-pointer rounded-md border border-transparent bg-gray-500 px-3 py-2 text-white transition-[border-color] hover:border-gray-900 "
              type="button"
              onClick={() => stepper.stop()}
            >
              중단
            </button>
            <button
              className="cursor-pointer rounded-md border border-transparent bg-gray-500 px-3 py-2 text-white transition-[border-color] hover:border-gray-900 "
              type="button"
              onClick={() => stepper.reset()}
            >
              초기화
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function OperatorStack({ stack }: { stack: Operator[] }) {
  return (
    <ul className="flex h-48 w-32 flex-col-reverse gap-2 rounded-b-sm border-2 border-blue-500 border-t-transparent bg-blue-300 p-1">
      {stack.map((op, index) => {
        return (
          <li
            className="w-full rounded-md border-2 border-red-500 bg-red-300 p-2 text-center text-lg"
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
  return <p className="text-xl">{postfix}</p>;
}

export default App;
