/* MathX.js
 * A plugin for tinyMCE 4.X
 * by: Jephthah M. Orobia
 * (c) 2015
 */

tinymce.PluginManager.add('MathX', function (editor, url) {
  
  
  //load MathJax script into editor's iframe
  editor.on("init", function(ed){
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src  = "https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=AM_HTMLorMML-full";
    editor.getDoc().getElementsByTagName("head")[0].appendChild(script);
    editor.dom.loadCSS('MathX/MathX.css');
  })
  
  
	// Add a button that opens a window
	editor.addButton('MathX', {
		text : 'f(x)',
		icon : false,
		onclick : function () {
      // Insert a span and set caret inside it.
			editor.insertContent('<span id="currentlyInsertedEq" class="AMEdit">`');
      var bm = editor.selection.getBookmark();
      editor.insertContent('`</span>');
      editor.selection.moveToBookmark(bm);
		}
    
	});

	// Adds a menu item to the tools menu
	editor.addMenuItem('MathX', {
		text : 'MathX',
		context : 'tools', //which tab it will belong
		onclick : function () {
			// Open window with a specific url
			editor.windowManager.open({
				title : 'TinyMCE site',
				url : 'https://github.com/sirjhep/MathX',
				width : 800,
				height : 400,
				buttons : [{
						text : 'Close',
						onclick : 'close'
					}
				]
			});
		}
	});

})