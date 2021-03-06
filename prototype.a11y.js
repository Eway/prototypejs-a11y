Prototype.a11y = {
	focusTimer: false,
	prepareBuffer: function() {
		var objHidden = document.createElement('input');

		objHidden.setAttribute('type', 'hidden');
		objHidden.setAttribute('value', '1');
		objHidden.setAttribute('id', 'virtualbufferupdate');
		objHidden.setAttribute('name', 'virtualbufferupdate');
		document.body.appendChild(objHidden);
	},
	updateBuffer: function() {
		var objHidden = $('virtualbufferupdate');
		if (objHidden)
		{
				if (objHidden.readAttribute('value') == '1'){
						objHidden.writeAttribute('value', '0');
				} else {			
						objHidden.writeAttribute('value', '1');
				}
		}
	},
	// inspired by Paul Ratcliffe - http://www.communis.co.uk/blog/2009-06-02-skip-links-chrome-safari-and-added-wai-aria
	fixFocus: function() {
		var container = $('sitenav');
		if(!container) {	return false;	}
		if (Prototype.Browser.WebKit || Prototype.Browser.IE) {
			container.select('a').each(function(el){
				var target = el.href.substr(el.href.indexOf('#')+1);
				el.targetElement = $(target);
				if(el.targetElement) {
					el.observe('click', function(ev) {
						var el = ev.findElement('a');
						if(el.targetElement.tagName == 'A') {
							el.targetElement.up().setFocus();
						} else {
							el.targetElement.setFocus();
						}
					});
				}
			});
		}
	}		
}

var a11yElement = {
		setTabIndex: function(element,index) {
			 var element = $(element);
			if(Prototype.Browser.IE) {
				return element.writeAttribute('tabIndex',index);
			} else {
				return element.writeAttribute('tabindex',index);
			}	
		},
		removeTabIndex: function(element,index) {
			 var element = $(element);
			if(Prototype.Browser.IE) {
				return element.removeAttribute('tabIndex');
			} else {
				return element.removeAttribute('tabindex');
			}	
		},
		setFocus: function(element,time){ 
			if(!time) {var time = 0 };
			var element = $(element);  
			clearTimeout(Prototype.a11y.focusTimer); 
			element.setTabIndex('-1');
			setTimeout(Prototype.a11y.updateBuffer, 0); 
			Prototype.a11y.focusTimer = setTimeout(function(){  
				try{  
					element.focus();  
				} catch(e){}  
			}, time || 1);  
			return this;  
		},
		hide: function(element) {
			var element = $(element);
			element.style.display = 'none';
			element.writeAttribute('aria-hidden', 'true');
			element.setTabIndex('-1');
			return element;
		},
		show: function(element) {
			var element = $(element);
			element.style.display = '';
			element.writeAttribute('aria-hidden', 'false');
			element.removeTabIndex();
			return element;
		}		
}
Element.addMethods(a11yElement);