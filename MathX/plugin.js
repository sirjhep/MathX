/* MathX
 * A plugin for tinyMCE 4.X
 * by: Jephthah M. Orobia
 * (c) 2015
 * http://github.com/sirjhep/MathX
 */

tinymce.PluginManager.add('MathX', function (editor, url) {

	var $ = editor.$; // make a jQuery like namespace

	// an object that will not return anything, MathX object, treated as global, but cannot be access outside
	var MX = {
    
		//when this is true, it means that MX is on edit mode.
		isActive : false,
    
		// insert a new equation
		insert : function () {
			if (MX.isActive)
				return;
      var AllJax = editor.getWin().MathJax.Hub.getAllJax();
      this.jaxCount = 3 + AllJax.length;
			var content = editor.selection.getContent();
			editor.insertContent('<span class="MathJax">');
			var bm = editor.selection.getBookmark();
			editor.insertContent(content + '</span>');
			editor.selection.moveToBookmark(bm);
		},

		//finish edit mode
		close : function () {
			var W = editor.getWin();
			if (!this.jax) { // if jax is new
				if ($(this.MXin).text() === '') {
					this.frame.remove();
					this.table.remove();
				} else {
          var source = $(this.MXin).text();
					var txtnode = W.document.createTextNode('`' + source + '`');
					this.frame.parentNode.replaceChild(txtnode, this.table);
					this.frame.remove();
					W.MathJax.Hub.Queue(function () {
						W.MathJax.Hub.Typeset();
					});
          var AllJax = W.MathJax.Hub.getAllJax();
          for(var j in AllJax)
            if(AllJax[j].originalText == source) this.jax = AllJax[j];
				}
			} else {
				if ($(this.MXin).text() === '') {
					this.table.remove();
					this.frame.previousSibling.remove();
					this.frame.remove();
					this.frame.nextSibling.remove();
				} else {
					W.MathJax.Hub.Queue(function () {
						MX.jax.Text($(this.MXin).text());
					});
					this.table.remove();
					$(this.frame).show();
				}
			}
			this.postHook();
		},

		//shows a preview
		showPreview : function () {
			this.MXout.innerHTML = '`' + $(this.MXin).text() + '`';
			editor.getWin().MathJax.Hub.Typeset('MXout');
		},

		esc : function () {
			this.table.remove();
			if (this.jax)
				$(this.frame).show();
			else
				this.frame.remove();
			this.postHook();
		},

		//actions after closing or ending MX.
		postHook : function () {
			this.isActive = false;
      var D = editor.getDoc();
      var script = D.getElementById(this.jax.inputID);
      var txt = D.createTextNode(' a');
      if(script.nextSibling)
        script.parentNode.insertBefore(txt, script.nextSibling)
      else
        script.parentNode.appendChild(txt);
      editor.selection.select(txt);
      editor.selection.collapse();
		},

		init : function (frame) {
			var W = editor.getWin(),
			D = editor.getDoc();
			this.isActive = true;
			this.frame = frame;
			this.jax = (frame.id) ? W.MathJax.Hub.getJaxFor(frame.id) : false;
			// a false jax would indicate that it is a new jax.

			// create the element structure needed for the MX
			this.table = D.createElement('table');
			this.table.id = "MX";
			this.MXout = D.createElement('div');
			this.MXin = this.table.insertRow(0).insertCell(0);
			this.table.insertRow(1).insertCell(0).appendChild(this.MXout);
			this.MXout.parentNode.insertBefore(D.createElement('div').appendChild(D.createTextNode('Preview:')), this.MXout);
			this.MXin.id = "MXin";
			this.MXout.id = "MXout";

			$(this.frame).hide().before(this.table);

			// if this is not a new equation
			if (this.jax) {
				this.MXin.appendChild(D.createTextNode(this.jax.originalText));
				editor.selection.setCursorLocation(this.MXin, 1);
			} else
				editor.selection.setCursorLocation(this.MXin);

			this.showPreview();
		}
	};

	//acquire MathX path
	(function () {
		var S = document.querySelectorAll('script[src]');
		var F = S[S.length - 1].src;
		var Fs = F.split('/');
		MX.path = Fs[Fs.length - 2];
	})();

	//load MathJax script into editor's iframe
	editor.on('init', function (ed) {
		var script = this.getDoc().createElement("script");
		script.type = "text/javascript";
		//script.src = 'https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=AM_HTMLorMML-full';
		script.src = '../MathJax/MathJax.js?config=AM_HTMLorMML-full';
		this.getDoc().getElementsByTagName("head")[0].appendChild(script);
		editor.dom.loadCSS(MX.path + '/style.css');
	});

	var descendantOf = function (P, name, callbackIfTrue) {
		// util function for determining if an element is a descendant/child of a certain type of parent.
		//(elemParentsArray, idOrClassOfParent)
		var call = callbackIfTrue || function (abc) {};
		for (var i in P)
			if (P[i].classList.contains(name) || P[i].id == name) {
				call(P[i]);
				return true;
			}
		return false;
	}

	// on NodeChange, tinymce bug: it fires twice/thrice. So e.selectionChange is the solution.
	// MX.isActive makes sure that there is only one editor running.
	editor.on('NodeChange', function (e) {
		if (e.selectionChange)
			if (!MX.isActive)
				descendantOf(e.parents, "MathJax", function (parent) {
					MX.init(parent);
				});
			else if (!MX.MXin == e.element || !descendantOf(e.parents, "MXin"))
				//Checks if MX.MXin has been blurred
				MX.close();
	});

	editor.on('keydown', function (e) {
		if (MX.isActive && (e.keyCode == 13 || e.which == 13))
			e.preventDefault();
	});

	editor.on('keyup', function (e) {
		if (MX.isActive) {
			if (e.keyCode == 13 || e.which == 13 || e.keyCode == 9 || e.which == 9) {
				e.preventDefault();
				MX.close();
			} else if (e.keyCode == 27 || e.which == 27) {
				e.preventDefault();
				MX.esc();
			} else if ((e.keyCode < 33 || e.keyCode > 40) && (e.keyCode < 16 || e.keyCode > 20))
				MX.showPreview();
		}

		//creates a keyboard shortcut for inserting expressions (alt + =);
		else if (e.keyCode == 61 && e.altKey)
			MX.insert();
	});
  
/*   editor.on('submit', function(e){
    var W = editor.getWin(), D = editor.getDoc();
    $(".MathJax_Preview").remove();
    $(".MathJax").remove();
    var AllJax = W.MathJax.Hub.getAllJax();
    for(var j in AllJax){
      var script = D.getElementById(AllJax[j].inputID);
      script.parentNode.replaceChild(D.createTextNode(AllJax[j].originalText), script);
    }
    $("body>div").remove();
  }); */
  
	// Add a button that opens a window
	editor.addButton('MathX', {
		text : 'f(x)',
		icon : false,
		onclick : function (e) {
			MX.insert();
		},
		tooltop : 'Insert Equation'
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
