/* MathX.js
 * A plugin for tinyMCE 4.X
 * by: Jephthah M. Orobia
 * (c) 2015
 */

tinymce.PluginManager.add('MathX', function (editor, url) {
	// Add a button that opens a window
	editor.addButton('MathX', {
		text : 'Sample MathX button',
		icon : false,
		onclick : function () {
			// Open a window
			editor.windowManager.open({
				title : "Example MathX window opened by a button",
				body : [{
						type : 'textbox',
						name : 'testboxname',
						label : 'testbox label'
					}

				],
				onsubmit : function (e) {
					// Insert content when the window form is submitted
					editor.insertContent("input on testbox: " + e.data.testboxname)
				}
			});
		}
	});

	// Adds a menu item to the tools menu
	editor.addMenuItem('MathX', {
		text : 'Example MathX plugin',
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