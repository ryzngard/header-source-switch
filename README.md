# header-source-switch
Header-source switch for VS code

## Usage

* Press 'Alt+O' while a header or source file is open
**OR**
* Press 'Ctrl+Shift+P' ('Cmd+Shift+P' on mac) and select 'Switch Header/Source'

## Source

[github](https://github.com/ryzngard/header-source-switch)

Please contact [me](mailto:ryzngard@live.com) if you have any questions, concerns, or feature requests.

## Extension Settings

```
"headerSourceSwitch.mappings": {
          "type": "array",
          "description": "Array of mappings, defaults to C++ mappings",
          "default": [
            {
              "header": [
                ".h",
                ".hpp",
                ".hh",
                ".hxx"
              ],
              "source": [
                ".cpp",
                ".c",
                ".cc",
                ".cxx",
                ".m",
                ".mm"
              ],
              "name": "C++"
            }
          ]
```

## Release Notes

### 1.2.0 

Add command to open in left pane. Panes are now relative to current pane, so left/right will always be -/+ one pane from active.

### 1.1.0

Add mappings configuration

Re-released and rewritten using the latest extension practices for vscode.

