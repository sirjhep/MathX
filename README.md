# MathX
MathX mean Mathematical Expressions.
An attempt to create a plugin for TinyMCE's latest version (v4.1) that will enable users to add equations and other mathematical expressions.
This plugin will make use of MathJax.


## How to install

#### Method 1: If you are using TinyMCE's CDN version.
1. load MathX.js after tinyMCE is loaded.
```
  <script src="http://tinymce.cachefly.net/4.1/tinymce.min.js"></script>
  <script src="MathX/plugin.min.js"></script>
```
2. add "MathX" to 'plugins' configuration in tinymce.init({}).
3. add "MathX" to toolbar.
```
  <script>
  tinymce.init({
    selector: 'textarea',
    plugins: 'MathX',
    toolbar: 'MathX'
    });
  </script>
```

#### Method 2: If you are using your local copy of TinyMCE.

1. Download MathX, and copy it (as a folder) to tinymce's plugin directory.
2. simply add "MathX" to 'plugins' and 'toolbar' in your tinymce configuration on init.
```
  <script>
  tinymce.init({
    selector: 'textarea',
    plugins: 'MathX',
    toolbar: 'MathX'
    });
  </script>
```

#### Been Developed
- initialize plugin
- add button and menu item
- dynamically load MathJax script.
- TypeSet ascii equations inside editor onload.
- Make all Jax Editable,
- Added a keyboard shortcut for inserting an equation. (alt + =).
- A help window.
- convert all jax to ascii text wrap in ticks(`) of the editor's content before submitting the form.

#### To be develop
- think of a better color scheme for the editor.
- think of another way for the " a" scheme.