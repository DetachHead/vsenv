import path from "node:path";

import { workspace } from "vscode";

import { getPythonInterpreter } from "./python.js";

export const activate = async () => {
  const configSection = workspace.getConfiguration("vsenv");
  let paths = configSection.get("paths") as string[];

  const workspaceRoot = workspace.workspaceFolders?.[0]?.uri;
  if (workspaceRoot) {
    // if we have a workspace root, we can resolve any relative paths
    paths = paths.map((dir) => path.resolve(workspaceRoot.fsPath, dir));

    console.log("attempting to get python scripts dir for workspace:", workspaceRoot);
    const pythonInterpreter = await getPythonInterpreter(workspaceRoot);
    if (pythonInterpreter) {
      const scriptsPath = path.join(pythonInterpreter, "..");
      paths.push(scriptsPath);
    }
  } else {
    console.log("no workspace detected, skipping relative path resolution and python scripts dir");
  }

  const joinedPaths = paths.join(path.delimiter);
  // eslint-disable-next-line node/no-process-env -- we are relying on a vscode bug here, see https://github.com/microsoft/vscode/issues/325459
  const currentPath = process.env["PATH"];

  // eslint-disable-next-line node/no-process-env -- see above
  process.env["PATH"] += currentPath?.endsWith(path.delimiter)
    ? joinedPaths
    : `${path.delimiter}${joinedPaths}`;
};

export const deactivate = () => {
  // intentionally empty
};
