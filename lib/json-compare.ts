export type DiffType = "added" | "removed" | "modified" | "type_changed" | "unchanged";

export interface DiffNode {
  key: string;
  path: string;
  type: DiffType;
  leftValue?: unknown;
  rightValue?: unknown;
  leftType?: string;
  rightType?: string;
  children?: DiffNode[];
}

export interface CompareOptions {
  ignoreKeyOrder: boolean;
  ignoreWhitespace: boolean;
  ignoreCase: boolean;
  compareArraysByValue: boolean;
  sortKeys: boolean;
}

export interface CompareResult {
  diffs: DiffNode[];
  summary: {
    total: number;
    added: number;
    removed: number;
    modified: number;
    typeChanged: number;
  };
  leftOnly: string[];
  rightOnly: string[];
  both: string[];
}

const DEFAULT_OPTIONS: CompareOptions = {
  ignoreKeyOrder: true,
  ignoreWhitespace: true,
  ignoreCase: false,
  compareArraysByValue: true,
  sortKeys: false,
};

function getType(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function normalizeValue(value: unknown, options: CompareOptions): unknown {
  if (typeof value === "string") {
    let normalized = value;
    if (options.ignoreCase) {
      normalized = normalized.toLowerCase();
    }
    if (options.ignoreWhitespace) {
      normalized = normalized.trim().replace(/\s+/g, " ");
    }
    return normalized;
  }
  return value;
}

function sortObjectKeys(obj: unknown): unknown {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }

  const sorted: Record<string, unknown> = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sorted[key] = sortObjectKeys((obj as Record<string, unknown>)[key]);
  }
  return sorted;
}

function compareValues(
  left: unknown,
  right: unknown,
  path: string,
  key: string,
  options: CompareOptions
): DiffNode | null {
  const leftType = getType(left);
  const rightType = getType(right);

  if (leftType !== rightType) {
    return {
      key,
      path,
      type: "type_changed",
      leftValue: left,
      rightValue: right,
      leftType,
      rightType,
    };
  }

  if (leftType === "object" && left !== null && right !== null) {
    const leftObj = left as Record<string, unknown>;
    const rightObj = right as Record<string, unknown>;

    let leftKeys = Object.keys(leftObj);
    let rightKeys = Object.keys(rightObj);

    if (options.sortKeys) {
      leftKeys = leftKeys.sort();
      rightKeys = rightKeys.sort();
    }

    const allKeys = new Set([...leftKeys, ...rightKeys]);
    const children: DiffNode[] = [];

    for (const childKey of allKeys) {
      const childPath = path ? `${path}.${childKey}` : childKey;
      const leftHas = childKey in leftObj;
      const rightHas = childKey in rightObj;

      if (leftHas && rightHas) {
        const childDiff = compareValues(
          leftObj[childKey],
          rightObj[childKey],
          childPath,
          childKey,
          options
        );
        if (childDiff && childDiff.type !== "unchanged") {
          children.push(childDiff);
        }
      } else if (leftHas) {
        children.push({
          key: childKey,
          path: childPath,
          type: "removed",
          leftValue: leftObj[childKey],
          leftType: getType(leftObj[childKey]),
        });
      } else {
        children.push({
          key: childKey,
          path: childPath,
          type: "added",
          rightValue: rightObj[childKey],
          rightType: getType(rightObj[childKey]),
        });
      }
    }

    if (children.length === 0) {
      return {
        key,
        path,
        type: "unchanged",
        leftValue: left,
        rightValue: right,
        leftType,
        rightType,
      };
    }

    return {
      key,
      path,
      type: children.some((c) => c.type !== "unchanged") ? "modified" : "unchanged",
      leftValue: left,
      rightValue: right,
      leftType,
      rightType,
      children,
    };
  }

  if (leftType === "array") {
    const leftArr = left as unknown[];
    const rightArr = right as unknown[];

    if (options.compareArraysByValue) {
      const maxLength = Math.max(leftArr.length, rightArr.length);
      const children: DiffNode[] = [];

      for (let i = 0; i < maxLength; i++) {
        const childPath = `${path}[${i}]`;
        const leftHas = i < leftArr.length;
        const rightHas = i < rightArr.length;

        if (leftHas && rightHas) {
          const childDiff = compareValues(
            normalizeValue(leftArr[i], options),
            normalizeValue(rightArr[i], options),
            childPath,
            `[${i}]`,
            options
          );
          if (childDiff && childDiff.type !== "unchanged") {
            children.push(childDiff);
          }
        } else if (leftHas) {
          children.push({
            key: `[${i}]`,
            path: childPath,
            type: "removed",
            leftValue: leftArr[i],
            leftType: getType(leftArr[i]),
          });
        } else {
          children.push({
            key: `[${i}]`,
            path: childPath,
            type: "added",
            rightValue: rightArr[i],
            rightType: getType(rightArr[i]),
          });
        }
      }

      if (children.length === 0) {
        return {
          key,
          path,
          type: "unchanged",
          leftValue: left,
          rightValue: right,
          leftType,
          rightType,
        };
      }

      return {
        key,
        path,
        type: children.some((c) => c.type !== "unchanged") ? "modified" : "unchanged",
        leftValue: left,
        rightValue: right,
        leftType,
        rightType,
        children,
      };
    } else {
      const leftStr = JSON.stringify(leftArr);
      const rightStr = JSON.stringify(rightArr);
      const normalizedLeft = options.ignoreWhitespace
        ? leftStr.replace(/\s+/g, " ")
        : leftStr;
      const normalizedRight = options.ignoreWhitespace
        ? rightStr.replace(/\s+/g, " ")
        : rightStr;

      if (normalizedLeft === normalizedRight) {
        return {
          key,
          path,
          type: "unchanged",
          leftValue: left,
          rightValue: right,
          leftType,
          rightType,
        };
      }

      return {
        key,
        path,
        type: "modified",
        leftValue: left,
        rightValue: right,
        leftType,
        rightType,
      };
    }
  }

  const normalizedLeft = normalizeValue(left, options);
  const normalizedRight = normalizeValue(right, options);

  if (JSON.stringify(normalizedLeft) === JSON.stringify(normalizedRight)) {
    return {
      key,
      path,
      type: "unchanged",
      leftValue: left,
      rightValue: right,
      leftType,
      rightType,
    };
  }

  return {
    key,
    path,
    type: "modified",
    leftValue: left,
    rightValue: right,
    leftType,
    rightType,
  };
}

export function compareJson(
  leftJson: string,
  rightJson: string,
  options: Partial<CompareOptions> = {}
): CompareResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  const leftParsed = JSON.parse(leftJson);
  const rightParsed = JSON.parse(rightJson);

  let leftObj = leftParsed;
  let rightObj = rightParsed;

  if (opts.sortKeys) {
    leftObj = sortObjectKeys(leftParsed);
    rightObj = sortObjectKeys(rightParsed);
  }

  const diff = compareValues(leftObj, rightObj, "", "root", opts);

  const result: CompareResult = {
    diffs: diff?.children || [],
    summary: {
      total: 0,
      added: 0,
      removed: 0,
      modified: 0,
      typeChanged: 0,
    },
    leftOnly: [],
    rightOnly: [],
    both: [],
  };

  function countDiffs(node: DiffNode) {
    if (node.type === "added") {
      result.summary.added++;
      result.summary.total++;
      result.rightOnly.push(node.path || "root");
    } else if (node.type === "removed") {
      result.summary.removed++;
      result.summary.total++;
      result.leftOnly.push(node.path || "root");
    } else if (node.type === "modified") {
      result.summary.modified++;
      result.summary.total++;
      result.both.push(node.path || "root");
    } else if (node.type === "type_changed") {
      result.summary.typeChanged++;
      result.summary.total++;
      result.both.push(node.path || "root");
    }

    if (node.children) {
      for (const child of node.children) {
        countDiffs(child);
      }
    }
  }

  if (diff) {
    countDiffs(diff);
  }

  return result;
}

export function getDiffTypeColor(type: DiffType): string {
  switch (type) {
    case "added":
      return "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30";
    case "removed":
      return "bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30";
    case "modified":
      return "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30";
    case "type_changed":
      return "bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30";
    default:
      return "bg-transparent";
  }
}

export function getDiffTypeLabel(type: DiffType): string {
  switch (type) {
    case "added":
      return "Added";
    case "removed":
      return "Removed";
    case "modified":
      return "Modified";
    case "type_changed":
      return "Type Changed";
    default:
      return "Unchanged";
  }
}
