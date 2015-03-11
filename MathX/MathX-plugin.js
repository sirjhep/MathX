/* MathX.js
 * A plugin for tinyMCE 4.X
 * by: Jephthah M. Orobia
 * (c) 2015
 * http://github.com/sirjhep/MathX
 */

tinymce.PluginManager.add('MathX', function (editor, url) {

	//load MathJax script into editor's iframe
	editor.on('init', function (ed) {
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "MathX/MathX-editor.js";
		this.getDoc().getElementsByTagName("head")[0].appendChild(script);
	});

	editor.on('keydown', function (e) {
		//prevent rendered jax from going to next line.
		if (e.target.id == 'MathXEditor-Input' && (e.keyCode == 13 || e.which == 13))
			e.preventDefault();
	});

	var insertMathX = function () {
		editor.insertContent('<span class="MathJax">');
		var bm = editor.selection.getBookmark();
		editor.insertContent('</span>  ');
		editor.selection.moveToBookmark(bm);
		editor.getWin().CreateMathJaxEditor(editor.selection.getNode(), true);
	};

	editor.on('keyup', function (e) {
		//creates a keyboard shortcut for inserting expressions (alt + =);
		if (e.keyCode == 61 && e.altKey)
      insertMathX();
	})

	// Add a button that opens a window
	editor.addButton('MathX', {
		text : 'f(x)',
		icon : false,
		onclick : insertMathX
	});

	// Adds a menu item to the tools menu
	editor.addMenuItem('MathX', {
		text : 'MathX Help',
		context : 'tools', //which tab it will belong
		onclick : function () {
			// Open window with a specific url
			editor.windowManager.open({
				title : 'ASCII Syntax Guide',
				url : 'http://asciimath.org/',
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
