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
    <main className="flex h-full flex-col items-center justify-center gap-10">
      <h1 className="text-3xl font-semibold">중위표기식 👉 후위표기식 변환기</h1>
      <ul className="flex gap-2">
        {tokens.map((token, index) => {
          return (
            <li
              key={index}
              className={`${index === exp.index ? "rounded-sm bg-red-400 px-1 text-white" : "text-black"} text-2xl`}
            >
              {token}
            </li>
          );
        })}
      </ul>
      <section className="flex gap-20">
        <div className="flex flex-col items-center gap-3">
          <p className="text-2xl">연산자 스택</p>
          <OperatorStack stack={operatorStack} />
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div className="flex flex-col items-center gap-3">
            <p className="text-2xl">후위 표기식</p>
            <p className="text-2xl">{postfix}</p>
          </div>
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
      </section>
    </main>
  );
}

function OperatorStack({ stack }: { stack: Operator[] }) {
  return (
    <ul className="flex h-96 w-36 flex-col-reverse gap-2 rounded-b-sm border-2 border-blue-500 border-t-transparent bg-blue-300 p-1">
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

export default App;
