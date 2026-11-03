import path from "node:path";

import { workspace } from "vscode";

import { getPythonInterpreter } from "./python.js";

export const activate = async () => {
  const configSection = workspace.getConfiguration("vsenv");
  const paths = configSection.get("paths") as string[];

  const workspaceRoot = workspace.workspaceFolders?.[0]?.uri;
  if (workspaceRoot) {
    console.log("attemptiung to get python scripts dir for workspace:", workspaceRoot);
    const pythonInterpreter = await getPythonInterpreter(workspaceRoot);
    if (pythonInterpreter) {
      const scriptsPath = path.join(pythonInterpreter, "..");
      paths.push(scriptsPath);
    }
  } else {
    console.log("no workspace detected, skipping python scripts dir");
  }

  // eslint-disable-next-line node/no-process-env -- we are relying on a vscode bug here, see https://github.com/microsoft/vscode/issues/325459
  process.env["PATH"] += `${path.delimiter}${paths.join(path.delimiter)}`;
};

export const deactivate = () => {
  // intentionally empty
};
