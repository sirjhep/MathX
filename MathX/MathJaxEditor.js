// MathX requires two main libraries, jQuery & MathJax

(function () {
	// load MathJax dynamicaly
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=AM_HTMLorMML-full';
	document.getElementsByTagName('head')[0].appendChild(script);

	// what to do when max jax is fully loaded.
	script.onload = function () {
		MathJax.Hub.Config({
			showProcessingMessages : false
		});
		MathJax.Hub.Queue(function () {
			AttachClickEventToJax();
		})
	};

	// a helper function. when id is not given, all jax's "Frame" will be attach with the event.
	var AttachClickEventToJax = function (id) {
		var elems = (id) ? [document.getElementById(id)] : document.getElementsByClassName("MathJax");
		for (var i in elems) {
			elems[i].onfocus = function (e) {
				this.click();
			};

			elems[i].onclick = function (e) {
				CreateMathJaxEditor(this, false)
			}
		}
	};

	// a function that creates the editor. if newjax is set to true, a jax is also created
	window.CreateMathJaxEditor = function (frame, newjax) {
		var jax = (newjax) ? false : MathJax.Hub.getJaxFor(frame.id),
		table = document.createElement('table'),
		tr1 = document.createElement('tr'),
		tr2 = document.createElement('tr'),
		td1 = document.createElement('td'),
		td2 = document.createElement('td'),
		input = document.createElement('input');

		table.appendChild(tr1);
		table.appendChild(tr2);
		tr1.appendChild(td1);
		tr2.appendChild(td2);
		td1.appendChild(input);
		frame.parentNode.insertBefore(table, frame);
		frame.style = "display: none;";

		table.style = "display: inline;";
		td2.style = "border: 1px solid black; padding: 5px 5px;";
    if(newjax){
      input.placeholder = "Insert expression here...";
      input.value = ""
    }
    else
      input.value = jax.originalText;
		input.id = "MathJaxEditor-Input";
		input.style = "width: 100%;";
		input.type = 'text';
		td2.id = 'MathJaxEditor-Preview';
		td2.innerHTML = '`' + input.value + '`';
		MathJax.Hub.Typeset('MathJaxEditor-Preview');
    input.focus();

		// event listener as when it is being edited showing a preview
		input.onkeyup = function (e) {
			if ((e.keyCode < 38 || e.keyCode > 40) && e.keyCode != 13) {
				td2.innerHTML = '`' + this.value + '`';
				MathJax.Hub.Typeset('MathJaxEditor-Preview');
			}
		}

		// evet listener when user is done editing by pressing "Enter"
		input.onkeydown = function (e) {
			if (e.keyCode == 13) {
				this.blur();
			}
		}

		// remove editing tools and typeset the latest
		input.onblur = function (e) {
			if (newjax) {
				var txtnode = document.createTextNode('`' + this.value + '`');
				frame.parentNode.replaceChild(txtnode, table);
				MathJax.Hub.Queue(["Typeset", MathJax.Hub, frame.id])
				MathJax.Hub.Queue(function () {
					AttachClickEventToJax();
				});
			} else {
				MathJax.Hub.Queue(["Text", jax, this.value]);
				frame.style = "display: inline;";
				MathJax.Hub.Queue(function () {
					AttachClickEventToJax(jax.inputID + '-Frame');
				});
			}
			table.remove();
      frame.setAttribute("contenteditable", "false");
		}
	}

})();
