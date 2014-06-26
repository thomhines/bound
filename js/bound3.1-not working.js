var bound = { p: 37, name: 'Thom', ray: ['x', 'y', 'z'], todos: [{name: 'a???', date:'1/1', done: 1}, {name: 'b', date:'1/2'}, {name: 'c', date:'1/3'}] };
var bound_temp = { p: 37, name: 'Thom', ray: ['x', 'y', 'z'], todos: [{name: 'a???', date:'1/1', done: 1}, {name: 'b', date:'1/2'}, {name: 'c', date:'1/3'}] };
//var bound_temp = jQuery.extend(true, {}, bound);


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
		bound.todos[0].name =  'new name';
		console.log(bound);
	});
	
});






// Sets value in bound object
function setValue(prop, val) {
	
	// break val into array
	var prop_array = getPropertyArray(prop);
	console.log('setvalue: '+prop+val);
	console.log(prop_array[0]);
	
	if(prop_array.length == 1) bound_temp[prop_array[0]] = val;
	if(prop_array.length == 2) bound_temp[prop_array[0]][prop_array[1]] = val;
	if(prop_array.length == 3) bound_temp[prop_array[0]][prop_array[1]][prop_array[2]] = val;
	if(prop_array.length == 4) bound_temp[prop_array[0]][prop_array[1]][prop_array[2]][prop_array[3]] = val;
	if(prop_array.length == 5) bound_temp[prop_array[0]][prop_array[1]][prop_array[2]][prop_array[3]][prop_array[4]]= val;
	if(prop_array.length == 6) bound_temp[prop_array[0]][prop_array[1]][prop_array[2]][prop_array[3]][prop_array[4]][prop_array[5]] = val;
	if(prop_array.length == 7) bound_temp[prop_array[0]][prop_array[1]][prop_array[2]][prop_array[3]][prop_array[4]][prop_array[5]][prop_array[6]] = val;
	if(prop_array.length == 8) bound_temp[prop_array[0]][prop_array[1]][prop_array[2]][prop_array[3]][prop_array[4]][prop_array[5]][prop_array[6]][prop_array[7]] = val;
}

// Return an array with the correct path to object value
function getPropertyArray(prop) {
	var obj_array = prop.replace(/\[(\S)\]/g, ".$1");
	var obj_array = obj_array.split('.');
	return obj_array;
}


function getPropertyName(val) {

	return val;

	var obj_name = "";
	
	// If name has brackets, convert them to 	
	var obj_chain = val.replace(/\[(\S)\]/g, ".$1");

	obj_array = obj_chain.split('.');
	obj_array.forEach(function(prop) {
		obj_name += "["+prop+"]"; 	
	});
	return obj_name;
}


function getPropertyValue(val) {

	console.log("getPropertyValue: " + val);
	var obj_name = "";
	
	// If name has brackets, convert them to 	
	var obj_chain = val.replace(/\[(\S)\]/g, ".$1");
	// split name into an array
	var obj_array = obj_chain.split('.');
	
	if(obj_array.length == 1) obj_val = bound_temp[obj_array[0]];
	if(obj_array.length == 2) obj_val = bound_temp[obj_array[0]][obj_array[1]];
	if(obj_array.length == 3) obj_val = bound_temp[obj_array[0]][obj_array[1]][obj_array[2]];
	return obj_val;
}




// BOUND
$(function() {
	// detect changes to form elements
	$('*[data-value]').filter(":input").bind('propertychange input paste', function(e) { // add keyup
		var $this = $(this);
		var prop = $this.attr('data-value');
		console.log('input set '+$this.val());
		setValue(prop, $this.val());
	})
	// initialize set each input to the data value
	.each(function() {
		var $this = $(this);
		var val = getPropertyValue($this.attr('data-value'));
		$this.val(val);
	});
	
	
	// watch for changes to bound variables
	$('*[data-value]').each(function() {
		var $this = $(this);
		var val = getPropertyName($this.attr('data-value'));
		console.log('watch: '+ val);
		bound.watch(val, watchHandler);
		$this.html(val);
	});
	
	$('*[data-foreach]').each(function() {
		var $this = $(this);
		newval = bound[$this.attr('data-foreach')];
		updateForEach($(this), newval);	
	});
});


cancelUpdateElements = false;
function updateElements(id) {
	
	console.log("updateElements: id=" + id);
	
	// Prevent from triggering multiple times
	if(cancelUpdateElements) return;
	cancelUpdateElements = true;

	//$('*[data-value~="'+id+'"]').each(function() {
	$('*[data-value]').each(function() {
		var $this = $(this);
		var this_prop = $(this).attr('data-value');
		var newval = getPropertyValue(this_prop);
		console.log("updateElements: id=" + id + ", prop=" + this_prop + ", val="+newval);
		if($(this).val()) $this.val(newval);
		else $this.html(newval);
	});
	cancelUpdateElements = false;
}


function watchHandler(id, newval, setter) {
	console.log('watchHandler: '+id+newval);
	// update all non-inputs when a change is detected
/*
    $('*[data-value~="'+id+'"]').not(":input").each(function() {
		if($(this).html() != newval) $(this).html(newval);
	});
	
	// update all inputs when a change is detected
    $('*[data-value~="'+id+'"]').filter(":input").each(function() {
		if($(this).val() != newval) $(this).val(newval);
	});
*/

	//if(setter) updateElements(id);
	
	// update all
	
	// update all foreach loops when a changes is detected
    $('*[data-foreach="'+id+'"]').each(function() {
		updateForEach($(this), newval);	
	});
	
    return newval;
}





function updateForEach($this, newval) {
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

cancelDelayedSetting = true;
function delayedSetter(id, newval) {
	setTimeout(function() {
		if(cancelDelayedSetting) return;
			watchHandler(id, newval, newval);
	}, 10);
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
					// since objects don't trigger setter, we have to update content when getter is run
					console.log("getter: "+newval);
					//cancelDelayedSetting = false;
					//updateElements(prop);
					//delayedSetter(prop, newval);
					return newval;
				},
				setter = function (val) {
					//oldval = newval;
					//updateElements(prop);
					//oldval = newval;
					//cancelDelayedSetting = true;
					handler.call(this, prop, val, true); //newval = handler.call(this, prop, oldval, val);
					//updateElements(prop);
					
					console.log("setter: "+prop+val);
					
					setTimeout(setTempObject, 100);
					return val;
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


function setTempObject() {
	// set temp object to 
	setTimeout(function() {
		//bound_temp.name = 'blue';
		console.log('settempobject: value=' + bound_temp.name);
		console.log(bound);
		console.log(bound_temp);
	}, 1000);
};
