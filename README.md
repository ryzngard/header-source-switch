# header-source-switch
Header-source switch for VS code

## Usage

* Press 'Alt+O' while a header or source file is open
**OR**
* Press 'Ctrl+Shift+P' ('Cmd+Shift+P' on mac) and select 'Switch Header/Source'

### Commands available 

#### Switch Header/Source

Opens the associated file mapping in the current pane

![Example of switch working](gifs/switch_example.gif?raw=true "Switch Example")

#### Switch Header (Left/Right) Pane

Switches to the associated mapping in a pane to the left or right

#### Switch Header (Other) Pane

Switches to the associated mapping in a different pane than the current one.

#### Toggle Header/Source Tracking Mode 

Toggles the tracking mode on/off, which will automatically open the equivalent header/source file (or other mapping) in an adjacent pane when the current pane switches files.

![Example of tracking mode working](gifs/tracker_example.gif?raw=true "Tracking Mode Example")

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

### 1.3.0

Add toggle mode, which automatically opens associated mapping files when the current pane switches to a new file. 

### 1.2.0

Add command to open in left pane. Panes are now relative to current pane, so left/right will always be -/+ one pane from active.

### 1.1.0

Add mappings configuration

Re-released and rewritten using the latest extension practices for vscode.

