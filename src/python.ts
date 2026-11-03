import { PythonEnvironments } from "@vscode/python-environments";
import { PythonExtension } from "@vscode/python-extension";
import { Uri } from "vscode";

export const getPythonInterpreter = async (workspaceRoot: Uri) => {
  try {
    const envsApi = await PythonEnvironments.api();
    const environment = await envsApi.getEnvironment(workspaceRoot);
    return environment?.execInfo.run.executable;
  } catch (error) {
    console.log(
      "failed to get python interpreter from the new environments extension, falling back to the old API:",
      error,
    );
    const api = await PythonExtension.api();
    return api.environments.getActiveEnvironmentPath().path;
  }
};
