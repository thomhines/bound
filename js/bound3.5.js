bound = { 
	name: 'Thom', 
	ray: ['x', 'y', 'z'], 
	todos: [
		{name: 'pick up laundry', date:'1/1', done: 1},
		{name: "I don't know.", date:'1/2'},
		{name: 'Profit', date:'1/3'}]
	};

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
		bound.new_name = bound.new_date = '';
	});
	$('.remove_todo').click(function() {
		bound.todos.pop();
	});
	
	$('.update_todo_name').click(function(e) {
		setValue('todos[0].name', 'new name');
		
	});
	
	//setInterval(function() { bound.p++; }, 1000);
	
});





// Sets value in bound object
function setValue(prop, val) {
	
	// break val into array
	var prop_array = getPropertyArray(prop);
	
	// update bound, depending on the length of the property path array length
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

// Return the name of the propery in bracket notation
function getPropertyName(prop) {

	// ????
	return prop;

	console.log("getPropertyName: " + prop+":");

	
	// If name has brackets, convert them to dots
	//var obj_chain = val.replace(/\[(\S)\]/g, ".$1");
	var obj_array = getPropertyArray(prop);
	var obj_name = "";
	obj_array.forEach(function(prop) {
		obj_name += "["+prop+"]"; 	
	});
	return obj_name;
}


// Get value of specific property value
function getPropertyValue(prop) {	
	var obj_array = getPropertyArray(prop);
	
	if(obj_array.length == 1) obj_val = bound[obj_array[0]];
	if(obj_array.length == 2) obj_val = bound[obj_array[0]][obj_array[1]];
	if(obj_array.length == 3) obj_val = bound[obj_array[0]][obj_array[1]][obj_array[2]];
	return obj_val;
}



// BOUND
$(function() {

	// Look for changes on inputs that have data-value attribute
	$(document).on('propertychange input paste change', '*[data-value]:input', function(e) { // keyup
		var $this = $(this);
		var prop = $this.attr('data-value');
		setValue(prop, $this.val());
	});
	
/*
	$(document).on('propertychange input paste change', '*[data-val]', function(e) { // keyup
		var $this = $(this);
		var prop = $this.attr('data-val');
		console.log('data-val change: '+prop);
		var for_each = $this.closest('*[data-foreach]');
		console.log(for_each.attr('data-foreach'));
		//setValue(prop, $this.val());
	});
*/

	// update all bound elements
	updateElements();
	
});






function updateForEach($this, newval) {
	console.log('updateforeach');
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
			if($(this).is(':checkbox')) {
				if(newval[x][thisval]) $(this).attr('checked','checked');
				else $(this).removeAttr('checked');
				$(this).attr('data-value', prop+'['+x+'].'+thisval);
			}
			else if($(this).is(':input')) {
				$(this).val(newval[x][thisval]);
				$(this).attr('data-value', prop+'['+x+'].'+thisval);
			}
			else $(this).html(newval[x][thisval]);
		});	
	}
}

cancelDelayedSetting = false;
function delayedSetter(id, newval) {
	console.log('delayedsetter: '+id);
	// prevent function from running recursively
	if(cancelDelayedSetting) return;
	setTimeout(function() {
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
					//console.log("getter");
					if(!cancelDelayedSetting) delayedSetter(prop, newval);
					return newval;
				},
				setter = function (val) {
					//console.log("setter");
					oldval = newval;
					return newval = handler.call(this, prop, val);
				};
			
			if (delete this[prop]) { // can't watch constants
				Object.defineProperty(this, prop, {
					  get: getter,
					  set: setter,
					  enumerable: true,
					  configurable: true
				});
			}
		}
	});
}

function watchHandler(id, newval) {
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
	
	// update input element values
	$('*[data-value]').filter(":input").each(function() {
		var $this = $(this);
		var val = getPropertyValue($this.attr('data-value'));
		$this.val(val);
	});
	
	// update all non-input elements content
	$('*[data-value]').each(function() {
		var $this = $(this);
		var name = getPropertyName($this.attr('data-value'));
		var val = getPropertyValue($this.attr('data-value'));
		bound.watch(name, watchHandler);
		$this.html(val);
	});
	
	// update each foreach loop
	$('*[data-foreach]').each(function() {
		var $this = $(this);
		var newval = bound[$this.attr('data-foreach')];
		updateForEach($(this), newval);	
	});

}