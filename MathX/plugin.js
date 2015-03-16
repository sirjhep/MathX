/* MathX.js
 * A plugin for tinyMCE 4.X
 * by: Jephthah M. Orobia
 * (c) 2015
 * http://github.com/sirjhep/MathX
 */

tinymce.PluginManager.add('MathX', function (editor, url) {

	var $ = editor.$; // make a jQuery like namespace
	var MathX = {
		isActive : false,
		jaxOn : false,
		init : function (jaxFrame) {
			// initializes MathX and activate it.
			this.isActive = true;
			var W = editor.getWin();
			var jax = (jaxFrame.id) ? W.MathJax.Hub.getJaxFor(jaxFrame.id) : false; // a false jax would indicate that it is a new jax.
			this.currentMXE = new this.editor(jaxFrame, jax); // creates a new object (Math X Editor object) and store it in currentMXE.
		},

    insert : function(){
      editor.insertContent('<span class="MathJax"> ..<span>');
      var bm = editor.selection.getBookmark();
      editor.insertContent('.</span> </span> ');
      editor.selection.moveToBookmark(bm);
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
        this.input.oninput = function(e){
          cMXE.showPreview();
        };
        this.input.onblur = function(e){
          cMXE.close();
        }

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
          if(this.input.value == ''){
            this.frame.remove();
            this.table.remove();
          }else{
            var txtnode = W.document.createTextNode('`' + this.input.value + '`');
            this.frame.parentNode.replaceChild(txtnode, this.table);
            this.frame.remove();
            W.MathJax.Hub.Queue(function(){
              W.MathJax.Hub.Typeset();
            });
          }
				} else {
          console.log(this.input.value);
					W.MathJax.Hub.Queue(function(){
            cMXE.jax.Text(cMXE.input.value);
          });
					this.table.remove();
					$(this.frame).show();
				}
        MathX.isActive = false;
        MathX.currentMXE = false;
        editor.selection.moveToBookmark(MathX.endBM);
			};
      
      this.esc = function(){
        this.table.remove();
        $(this.frame).show();
        MathX.isActive = false;
        MathX.currentMXE = false;
        editor.selection.moveToBookmark(MathX.endBM);
      }

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
		this.getDoc().getElementsByTagName("head")[0].appendChild(script);
		script.onload = function () {
			editor.getWin().MathJax.Hub.Queue(function () {
				editor.getWin().MathJax.Hub.Config({
					showProcessingMessages : false
				});
			});
		};
		editor.dom.loadCSS(MathX.path + '/style.css');
	});

	// on NodeChange, tinymce bug: it fires twice. So MathX.isActive is the solution.
	editor.on('NodeChange', function (e) {
		var P = e.parents;
		for (var i in P)
			if (P[i].classList.contains('MathJax') && !MathX.isActive) {
				MXE = MathX.init(P[i]);
			}
	});

	editor.on('keydown', function (e) {
		//prevent rendered jax from going to next line.
		if (e.target.id == 'MathXE-Input' && (e.keyCode == 13 || e.which == 13) && MathX.isActive) {
			e.preventDefault();
			MathX.currentMXE.close();
		}
    if (e.target.id == 'MathXE-Input' && (e.keyCode == 27 || e.which == 27) && MathX.isActive){
      MathX.currentMXE.esc();
    }
	});
  
	editor.on('keyup', function (e) {
		//creates a keyboard shortcut for inserting expressions (alt + =);
		if (e.keyCode == 61 && e.altKey)
			MathX.insert();
	})

	// Add a button that opens a window
	editor.addButton('MathX', {
		text : 'f(x)',
		icon : false,
		onclick : function(e){
      MathX.insert()
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

})
