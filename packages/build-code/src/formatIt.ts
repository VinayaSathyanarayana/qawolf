import { Step } from "@qawolf/types";
import { describeDoc } from "@qawolf/web";

export const formatIt = (step: Step): string => {
  if (step.action === "scroll") {
    return `scroll`;
  }

  const description = describeDoc(step.html);

  const target = step.html.node;

  // link/input
  const tagName = `${target.name === "a" ? " link" : ` ${target.name}` || ""}`;

  if (step.action === "click") {
    return `click${description}${tagName}`;
  }

  if (step.action === "select") {
    return `select${description}`;
  }

  if (step.action === "type") {
    if (!step.value) {
      return `clear${description}${tagName}`;
    }

    const value = step.value as string;
    if (value.indexOf("↓Enter") === 0) {
      return `Enter`;
    }

    if (value.indexOf("↓Tab") === 0) {
      return `Tab`;
    }

    return `type into${description}${tagName}`;
  }

  throw new Error(`Invalid step action ${step.action}`);
};
