/* MathX
 * A plugin for tinyMCE 4.X
 * by: Jephthah M. Orobia
 * (c) 2015
 * http://github.com/sirjhep/MathX
 */

tinymce.PluginManager.add('MathX', function (editor, url) {

	var $ = editor.$; // make a jQuery like namespace

	//Create MathX object that is not visible in global.
	var MathX = {
		init : function (jaxFrame, TS) {
			// initializes MathX and activate it. TS is timestamp
			this.isActive = true;
      this.startedAt = TS;
			var W = editor.getWin();
			var jax = (jaxFrame.id) ? W.MathJax.Hub.getJaxFor(jaxFrame.id) : false; // a false jax would indicate that it is a new jax.
			this.currentMXE = new this.editor(jaxFrame, jax); // creates a new object (Math X Editor object) and store it in currentMXE.
		},
		// insert a new equation
		insert : function () {
			var content = editor.selection.getContent();
			editor.insertContent('<span class="MathJax">');
			MathX.currentMXE.input.value = content;
		},
		// should be called as a new instance.
		editor : function (jaxFrame, jax) {
			this.isNew = (jax) ? false : true;
			this.jax = (this.isNew) ? false : jax;
			this.frame = jaxFrame;
			var cMXE = this;
			var W = editor.getWin();
			var doc = editor.getDoc();

			this.init = function () { // initializes
				// create needed nodes
				this.table = doc.createElement('table');
				this.row1 = this.table.insertRow(0);
				this.cell11 = this.row1.insertCell(0);
				this.row2 = this.table.insertRow(1);
				this.cell21 = this.row2.insertCell(0);
				this.input = doc.createElement('input');
				
        // configure each node
				this.table.id = "MXE";
				this.cell21.title = "Preview";
				if (this.isNew) {
					this.input.placeholder = "Insert expression here...";
					this.input.value = "";
				} else
					this.input.value = this.jax.originalText;
				this.input.id = "MathXE-Input";
				this.input.type = 'text';
				this.cell21.id = 'MathXE-Preview';
				this.input.oninput = function (e) {
					cMXE.showPreview();
				};
				this.input.onblur = function (e) {
          if(e.timeStamp - MathX.startedAt < 1000)
            cMXE.input.focus();
          else
            cMXE.close();
				};

				// add table#MXE before frame after hiding that frame.
				this.cell11.appendChild(this.input);
				$(this.frame).hide().before(this.table);

				this.showPreview();
				this.input.focus();
			};

			this.showPreview = function () {
				this.cell21.innerHTML = '`' + this.input.value + '`';
				W.MathJax.Hub.Typeset('MathXE-Preview');
			};

			this.close = function () {
				if (this.isNew) {
					if (this.input.value === '') {
						this.frame.remove();
						this.table.remove();
					} else {
						var txtnode = W.document.createTextNode('`' + this.input.value + '`');
						this.frame.parentNode.replaceChild(txtnode, this.table);
						this.frame.remove();
						W.MathJax.Hub.Queue(function () {
							W.MathJax.Hub.Typeset();
						});
					}
				} else {
					W.MathJax.Hub.Queue(function () {
						cMXE.jax.Text(cMXE.input.value);
					});
					this.table.remove();
					$(this.frame).show();
				}
				MathX.isActive = false;
				MathX.currentMXE = false;
			};

			this.esc = function () {
				this.table.remove();
				$(this.frame).show();
				MathX.isActive = false;
				MathX.currentMXE = false;
			};

			this.init();
		}
	};

	//acquire MathX path
	(function () {
		var S = document.querySelectorAll('script[src]');
		var F = S[S.length - 1].src;
		var Fs = F.split('/');
		MathX.path = Fs[Fs.length - 2];
	})();

	//load MathJax script into editor's iframe
	//load a style which is intended for the MathX.editor.input
	editor.on('init', function (ed) {
		var script = this.getDoc().createElement("script");
		script.type = "text/javascript";
		script.src = 'https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=AM_HTMLorMML-full';
		//script.src = '../MathJax Extension Development/MathJax/MathJax.js?config=AM_HTMLorMML-full';
		this.getDoc().getElementsByTagName("head")[0].appendChild(script);
		editor.dom.loadCSS(MathX.path + '/style.css');
	});

	// on NodeChange, tinymce bug: it fires twice/thrice. So MathX.isActive is the solution.
	editor.on('NodeChange', function (e) {
    if(MathX.isActive) return;
		if (e.element.tagName === 'SCRIPT' && e.element.type === 'math/asciimath') {
			MathX.init(e.element.previousElementSibling, Date.now());
			return;
		} else {
			var P = e.parents;
			for (var i in P)
				if (P[i].classList.contains('MathJax')) {
					MathX.init(P[i], Date.now());
					return;
				}
		}
	});

	editor.on('keydown', function (e) {
		//prevent rendered jax from going to next line.
		if (e.target.id == 'MathXE-Input' && (e.keyCode == 13 || e.which == 13) && MathX.isActive) {
			e.preventDefault();
			MathX.currentMXE.close();
		} else if (e.target.id == 'MathXE-Input' && (e.keyCode == 27 || e.which == 27) && MathX.isActive)
			MathX.currentMXE.esc();
		else if (e.target.id == 'MathXE-Input' && (e.keyCode == 8 || e.which == 8) && MathX.isActive)
			// bug fix for backspace not working when it is a new equation.
			MathX.currentMXE.input.value = MathX.currentMXE.input.value.substr(0, MathX.currentMXE.input.value.length - 1);

	});

	editor.on('keyup', function (e) {
		//creates a keyboard shortcut for inserting expressions (alt + =);
		if (e.keyCode == 61 && e.altKey)
			MathX.insert();
	});

	// Add a button that opens a window
	editor.addButton('MathX', {
		text : 'f(x)',
		icon : false,
		onclick : function (e) {
			MathX.insert();
		}
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
});
