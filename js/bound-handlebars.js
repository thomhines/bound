d = new Date();
bound = { 
	name: 'Thom',
	date: d.getHours(),
	ray: ['x', 'y', 'z'], 
	todos: [
		{name: 'pick up laundry', date:'1/1', done: 1},
		{name: "I don't know.", date:'1/2'},
		{name: 'Profit', date:'1/3'}]
	};


$(function() {

	$('.change_name').click(function() {
		bound.name = 'Bob';
		updateElements('name');
	});

});



var test_clone, elem_clone;
$(function() {
	
	test_clone = $('.test').clone();
	
	
	// register all handlebar elements in data object
	registerBoundDataElements();

	
	$(document).on('keyup', '[data-bind]', function() {
		$this = $(this);
		prop = $this.attr('data-bind');
		bound[prop] = $this.val();
		updateElements(prop);
	});
});


function registerBoundDataElements() {
	// go through test_clone and changes all {{ val }} to <span data-bound="val"></span>
	test_clone.html(test_clone.html().replace(new RegExp('{{([^}]+)}}', 'g'), '<span data-bound="$1"></span>'));
/*
	output_clone = test_clone.clone();
	output_clone.removeClass('test');
	$('.output').html(output_clone);
*/
	// if property doesn't exist in bound var, add it
	var property_array = [];
	test_clone.find('[data-bound]').each(function() {
		var property = $(this).attr('data-bound');
		property_array.push(property);
	});
	// eliminate duplicates
	property_array = property_array.filter(function(elem, pos, self) {
	    return self.indexOf(elem) == pos;
	});

	for(x = 0; x < property_array.length; x++) {
		updateElements(property_array[x]);
	}
	
	// add a watch to property
}



// update elements if prop has new value
function updateElements(prop) {	
	
	// go through all elements
	test_clone.find('[data-bound="'+prop+'"]').each(function() {
		console.log('updateelements: [data-bound="'+prop+'"]');	
		
		// get path to that particular element's parent
		var elem_path = $(this).parent().getElementPath();
		
		// create new clone of element's parent
		elem_clone = test_clone.find(elem_path).clone();
					
		// if element is an input...
		if($(this).is(":input")) {
			//if($(this).attr('data-bind') == prop) {
				// replace new clone element with new version from clone and updated value
				$(".test "+elem_path).val(bound[prop]);
			//}
		} 
		// otherwise...
		else {
			console.log(bound[prop] + ": .test" + elem_path);
			// replace content in elem_clone with property value
			elem_clone.find('[data-bound="'+prop+'"]').html(bound[prop]).contents().unwrap();
			// update .test
			$(".test" + elem_path).html(elem_clone).contents().unwrap();
		}
/*
		// otherwise...
		else {
		
			var elem_content = $(this)[0].childNodes[0].nodeValue;
			if(elem_content.indexOf("{{"+prop+"}}") > -1) {
				// get path to that particular element
				elem_path = $(this).getElementPath();
				// create new clone of clone
				elem_clone = test_clone.find(elem_path).clone();
				// replace new clone element with new version from clone and updated value
				$(".test "+elem_path).html(elem_clone.text().replace(new RegExp('{{'+prop+'}}', 'g'), bound[prop]));
			}
		}
*/
	});
}




// Get absolute path of element
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
    return realpath;
}
