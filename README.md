# MathX
An attempt to create a plugin for TinyMCE's latest version (v4.1) that will enable users to add equations and other mathematical expressions.
This plugin will make use of MathJax.

## How to install
1. load MathX.js after tinyMCE is loaded.
2. add MathX to 'plugins' configuration in tinymce.init({}).


#### Been Developed
1. initialize plugin
2. add button and menu item
3. dynamically load MathJax script.
4. removed loading of css from ini and move it to plugin file.
3. TypeSet ascii equations inside editor onload.

#### To be develop
1. A button that will add an editable box to the content with overlaying display of the output.