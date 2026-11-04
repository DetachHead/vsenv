# VSenv

A VSCode extension for adding project-specific directories to `PATH` that works with other
extensions.

> [!IMPORTANT]
> This extension is currently experimental and is subject to breaking changes. In fact it may break
> entirely because it relies on a VSCode bug. [See below](#disclaimer) for more info.

## Installation

- [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=detachhead.vsenv)
- OpenVSX (coming soon)

## What is this?

### The problem

Most VSCode extensions for language servers and other command-line tools either expect that tool to
be installed globally, or come bundled with their own version.

This means if your project pins a specific version that's installed as a dev dependency instead of
globally, the extension will either need to be explicitly configured to point to your project's
version, or it might just not work at all.

The issue is even worse when those tools are installed in a python environment, because for some
insane reason,
[the scripts directory is different depending on your OS](https://github.com/astral-sh/uv/issues/15800).
This means many extensions need to be configured using
[disgusting polyglot scripts](https://github.com/dprint/dprint/issues/859#issuecomment-6011183803)
if you want to be able to commit a `.vscode/settings.json` file that works for all contributors.

### The solution

This extension loads (hopefully) before your other extensions do. It then modifies the `PATH`
variable visible to those extensions with any directories specified in its config.

## Usage

Configure additional directories to add to the `PATH` variable in `.vscode/settings.json`:

```jsonc
{
  "vsenv.paths": [
    // relative paths are resolved relative to the workspace root
    "./node_modules/.bin",
  ],
}
```

> [!TIP]
> If your project requires VSenv, you should add it as a recommended extension so that other
> contributors are prompted to install it:
>
> ```jsonc
> // .vscode/extensions.json
>
> {
>   "recommendations": ["detachhead.vsenv"],
> }
> ```

### Python environment detection

As mentioned [above](#the-problem), Python environments have a different scripts path on Windows and
Unix-like operating systems.

VSenv solves this by automatically detecting your Python environment using either the
[Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python) or
[Python Environments](https://marketplace.visualstudio.com/items?itemName=ms-python.vscode-python-envs).
If an environment is detected, it's automatically added to the `PATH` along with any additional
paths specified in [`vsenv.paths`](#the-solution).

## Disclaimer

I don't know for sure how reliable this is. It seems to work with every extension I've tried, but it
may not work for you if the other extension gets loaded first.

It also
[relies on behavior in VSCode that may or may not be intentional](https://github.com/microsoft/vscode/issues/325459),
so it's possible that a future VSCode update may break this extension.
