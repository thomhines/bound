bound = { p: 37, name: 'Thom', ray: ['x', 'y', 'z'], todos: [{name: 'a???', date:'1/1', done: 1}, {name: 'b', date:'1/2'}, {name: 'c', date:'1/3'}] };

$(function() {
	$('.change_name').click(function() {
		bound.name = bound.name + "!";
		console.log(bound.name);
	});
	$('.change_number').click(function() {
		bound.p = parseInt(bound.p) + 1;
	});
	
	$('.add_todo').click(function() {
		bound.todos.push({name: $('.new_name').val(), date: $('.new_date').val()});
	});
	$('.remove_todo').click(function() {
		bound.todos.pop();
	});
	

	$('.update_name').bind('propertychange keyup input paste', function(e) {
		bound.todos[0].name = $(this).val();
	});

	$('.update_date').bind('propertychange keyup input paste', function(e) {
		bound.todos[0].date = $(this).val();
	});
	
	
	$('.update_todo_name').click(function(e) {
		setValue('todos[0].name', 'new name');
	});
	
});





// Sets value in bound object
function setValue(prop, val) {
	
	// break val into array
	var prop_array = getPropertyArray(prop);
	
	if(prop_array.length == 1) bound[prop_array[0]] = val;
	if(prop_array.length == 2) bound[prop_array[0]][prop_array[1]] = val;
	if(prop_array.length == 3) bound[prop_array[0]][prop_array[1]][prop_array[2]] = val;
	if(prop_array.length == 4) bound[prop_array[0]][prop_array[1]][prop_array[2]][prop_array[3]] = val;
	if(prop_array.length == 5) bound[prop_array[0]][prop_array[1]][prop_array[2]][prop_array[3]][prop_array[4]]= val;
	if(prop_array.length == 6) bound[prop_array[0]][prop_array[1]][prop_array[2]][prop_array[3]][prop_array[4]][prop_array[5]] = val;
	if(prop_array.length == 7) bound[prop_array[0]][prop_array[1]][prop_array[2]][prop_array[3]][prop_array[4]][prop_array[5]][prop_array[6]] = val;
	if(prop_array.length == 8) bound[prop_array[0]][prop_array[1]][prop_array[2]][prop_array[3]][prop_array[4]][prop_array[5]][prop_array[6]][prop_array[7]] = val;
}

// Return an array with the correct path to object value
function getPropertyArray(prop) {
	var obj_array = prop.replace(/\[(\S)\]/g, ".$1");
	var obj_array = obj_array.split('.');
	return obj_array;
}


function getPropertyName(val) {

	return val;

	console.log("getPropertyName: " + val+":");
	var obj_name = "";
	
	// If name has brackets, convert them to 	
	var obj_chain = val.replace(/\[(\S)\]/g, ".$1");

	obj_array = obj_chain.split('.');
	obj_array.forEach(function(prop) {
		obj_name += "["+prop+"]"; 	
	});
	console.log(obj_name);
	return obj_name;
}


function getPropertyValue(val) {

	console.log("getPropertyValue: " + val+":");
	var obj_name = "";
	
	// If name has brackets, convert them to 	
	var obj_chain = val.replace(/\[(\S)\]/g, ".$1");

	var obj_array = obj_chain.split('.');
/*
	obj_array.forEach(function(prop) {
		obj_name += "["+prop+"]"; 	
	});
*/
	
	if(obj_array.length == 1) obj_val = bound[obj_array[0]];
	if(obj_array.length == 2) obj_val = bound[obj_array[0]][obj_array[1]];
	if(obj_array.length == 3) obj_val = bound[obj_array[0]][obj_array[1]][obj_array[2]];
	console.log(obj_val);
	return obj_val;
}

/*
getPropertyValue('todos[0].name');
getPropertyValue('name');
getPropertyValue('ray');

ray = 'ray[0]';
console.log(bound[ray]);
*/

// todos[0]			>	todos.0			>	bound[todos][0]
// todos[0].name	>	todos.0.name	>	bound[todos][0][name]
// name				>	bound[name]


// BOUND
$(function() {
	// detect changes to form elements
	updateElements();
	
});






function updateForEach($this, newval) {
	console.log('updateforeach');
	console.log(newval[newval.length-1]);
	var prop = $this.attr('data-foreach');
	
	// if element doesn't have a model, build one

	if(!$this.data('model')) {
		bound.watch(prop, watchHandler);
		// convert template to model
		$this.data('model', $this.children());
	}
	
	$this.html('');	
	
	// duplicate model for each data item
	for (x = 0; x < Object.keys(newval).length; ++x) {
		clone = $this.data('model').clone().appendTo($this);
		
		// look for any elements inside with particular value
		clone.find('*[data-val]').each(function() {
			thisval = $(this).attr('data-val');
			$(this).html(newval[x][thisval]);
		});	
	}
}

cancelDelayedSetting = false;
function delayedSetter(id, newval) {
	console.log('delayedsetter: '+id);
	// prevent function from running recursively
	if(cancelDelayedSetting) return;
	setTimeout(function() {

		//temp_bound = jQuery.extend(true, {}, bound);
		console.log('temp_bound:');
		//console.log(temp_bound);
		//watchHandler(id, newval, newval);
		updateElements();
		cancelDelayedSetting = false;
	}, 10);
	cancelDelayedSetting = true;
}



// https://gist.github.com/eligrey/384583
/*
 * object.watch polyfill
 *
 * 2012-04-03
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */
// object.watch
if (!Object.prototype.watch) {
	Object.defineProperty(Object.prototype, "watch", {
		enumerable: false,
		configurable: true,
		writable: false,
		value: function (prop, handler) {
			var oldval = this[prop],
				newval = oldval,
				getter = function () {
					// since changes to objects don't trigger setter, we have to update content when getter is run
					console.log("getter");
					if(!cancelDelayedSetting) delayedSetter(prop, newval);
					return newval;
				},
				setter = function (val) {
					console.log("setter");
					oldval = newval;
					return newval = handler.call(this, prop, oldval, val);
				};
			
			if (delete this[prop]) { // can't watch constants
				Object.defineProperty(this, prop, {
					  get: getter
					, set: setter
					, enumerable: true
					, configurable: true
				});
			}
		}
	});
}

function watchHandler(id, oldval, newval) {
	console.log("watchhandler: "+id);
    $('*[data-value="'+id+'"]').not(":input").each(function() {
		if($(this).html() != newval) $(this).html(newval);
	});
    $('*[data-value="'+id+'"]').filter(":input").each(function() {
		if($(this).val() != newval) $(this).val(newval);
	});
	
    $('*[data-foreach="'+id+'"]').each(function() {
		updateForEach($(this), newval);	
	});
	//updateElements();	
    return newval;
}

function updateElements() {
	console.log('updateelements');
	$('*[data-value]').filter(":input").bind('propertychange keyup input paste', function(e) {
		var $this = $(this);
		var prop = $this.attr('data-value');
		setValue(prop, $this.val());
	})
	// initialize set each input to the data value
	.each(function() {
		var $this = $(this);
		var val = getPropertyValue($this.attr('data-value'));
		console.log("each: " + $this.attr('data-value'));
		console.log("val: " + val);
		$this.val(val);
	});
	
	
	// watch for changes to bound variables
	$('*[data-value]').each(function() {
		var $this = $(this);
		var name = getPropertyName($this.attr('data-value'));
		var val = getPropertyValue($this.attr('data-value'));
		bound.watch(name, watchHandler);
		$this.html(val);
	});
	
	$('*[data-foreach]').each(function() {
		var $this = $(this);
		var newval = bound[$this.attr('data-foreach')];
		updateForEach($(this), newval);	
	});

}