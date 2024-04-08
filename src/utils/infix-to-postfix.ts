const operatorMap = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2,
  "(": 3,
  ")": 3,
};

export type Operator = keyof typeof operatorMap;

type Result = {
  exp: { index: number; token: string };
  operatorStack: Operator[];
  postfix: string[];
};

const initialResult: Result[] = [{ exp: { index: -1, token: "" }, operatorStack: [], postfix: [] }];

export function tokenize(input: string) {
  return input.split(" ");
}

export function infixToPostfix(tokens: string[]) {
  let result = initialResult;

  tokens.forEach((token, index) => {
    if (token === "(") {
      // push
      const last = result[result.length - 1];
      const item = {
        ...last,
        exp: { index, token },
        operatorStack: last.operatorStack.concat(token),
      };
      result = result.concat(item);
    } else if (token === ")") {
      let last = result[result.length - 1];
      while (
        last.operatorStack.length !== 0 &&
        last.operatorStack[last.operatorStack.length - 1] !== "("
      ) {
        const { operatorStack, postfix } = last;
        const peek = operatorStack[operatorStack.length - 1];
        const item = {
          ...last,
          operatorStack: operatorStack.slice(0, -1),
          postfix: postfix.concat(peek),
        };
        result = result.concat(item);
        last = item;
      }
      // 왼쪽 괄호 제거(Pop)
      const item = {
        ...last,
        exp: { index, token },
        operatorStack: last.operatorStack.slice(0, -1),
      };
      result = result.concat(item);
    } else if (isOperator(token)) {
      let last = result[result.length - 1];
      while (
        last.operatorStack.length > 0 &&
        operatorMap[last.operatorStack[last.operatorStack.length - 1]] >= operatorMap[token]
      ) {
        if (last.operatorStack[last.operatorStack.length - 1] === "(") break;

        const { operatorStack, postfix } = last;
        const peek = operatorStack[operatorStack.length - 1];
        const item = {
          ...last,
          operatorStack: operatorStack.slice(0, -1),
          postfix: postfix.concat(peek),
        };
        result = result.concat(item);
        last = item;
      }
      const item = {
        ...last,
        exp: { index, token },
        operatorStack: last.operatorStack.concat(token),
      };
      result = result.concat(item);
    } else {
      // postfix에 추가
      const last = result[result.length - 1];
      const item = {
        ...last,
        exp: { index, token },
        postfix: last.postfix.concat(token),
      };
      result = result.concat(item);
    }
  });

  let last = result[result.length - 1];

  while (last.operatorStack.length > 0) {
    const peek = last.operatorStack[last.operatorStack.length - 1];
    const item = {
      ...last,
      exp: { index: -1, token: "" },
      operatorStack: last.operatorStack.slice(0, -1),
      postfix: last.postfix.concat(peek),
    };
    result = result.concat(item);
    last = result[result.length - 1];
  }

  return result;
}

function isOperator(token: string): token is Operator {
  return token in operatorMap;
}
