bound = { 
	name: 'Thom', 
	ray: ['x', 'y', 'z'], 
	todos: [
		{name: 'pick up laundry', date:'1/1', done: 1},
		{name: "I don't know.", date:'1/2'},
		{name: 'Profit', date:'1/3'}]
	};


$(function() {
	
	var test_clone = $('.test').clone(), elem_clone;
	
	updateElements('name');
	
	$(document).on('keyup', '[data-bind]', function() {
		$this = $(this);
		prop = $this.attr('data-bind');
		bound[prop] = $this.val();
		updateElements(prop);
	});
	
	
	
	
	
	
	
	// update elements if prop has new value
	function updateElements(prop) {		
		// go through all elements
		test_clone.find('*').each(function() {
			// if element contains {{prop}}, update italics
						
			// if element is an input...
			if($(this).is(":input")) {
				console.log('input');
				if($(this).attr('data-bind') == prop) {
					console.log('has right value');
					// get path to that particular element
					elem_path = $(this).getElementPath();
					// create new clone of clone
					elem_clone = test_clone.find(elem_path).clone();
					console.log("?"+elem_path);
					// replace new clone element with new version from clone and updated value
					$(".test "+elem_path).val(bound.name);
					
				}
			
			// otherwise...
			} else {
			
				var elem_content = $(this)[0].childNodes[0].nodeValue;
				if(elem_content.indexOf("{{"+prop+"}}") > -1) {
					// get path to that particular element
					elem_path = $(this).getElementPath();
					// create new clone of clone
					elem_clone = test_clone.find(elem_path).clone();
					// replace new clone element with new version from clone and updated value
					$(".test "+elem_path).html(elem_clone.text().replace(/{{name}}/g, bound.name));
				}
			}
		});
	}
	
	

	
});

// http://stackoverflow.com/a/16865599
jQuery.fn.getElementPath = function () {
    var current = $(this);
    var path = new Array();
    var realpath = "";
    //while ($(current).prop("tagName") != "BODY") {
    while(!$(current).hasClass('test')) {
        var index = $(current).parent().find($(current).prop("tagName")).index($(current)) + 1;
        var name = $(current).prop("tagName");
        var selector = " > " + name + ":nth-of-type(" + index + ") ";
        path.push(selector);
        current = $(current).parent();
    }
    while (path.length != 0) {
        realpath += path.pop();
    }
    console.log(realpath);    
    return realpath;
}
