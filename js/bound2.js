bound = { p: 37, name: 'Thom', todos: [{name: 'a', date:'1/1', done: 1}, {name: 'b', date:'1/2'}, {name: 'c', date:'1/3'}] };

$(function() {
	$('.change_name').click(function() {
		bound.name = bound.name + "!";
	});
	$('.change_number').click(function() {
		bound.p = parseInt(bound.p) + 1;
	});
	
	$('.add_todo').click(function() {
		bound.todos.push({name: $('.new_name').val(), date: $('.new_date').val()});
		//console.log(bound.todos);
	});
	$('.remove_todo').click(function() {
		bound.todos.pop();
		//console.log(bound.todos);
	});
	

	$('.update_name').bind('propertychange keyup input paste', function(e) {
		console.log('update name');
		bound.todos[0].name = $(this).val();
	});

	$('.update_date').bind('propertychange keyup input paste', function(e) {
		bound.todos[0].date = $(this).val();
	});
	
});









// BOUND
$(function() {
	// detect changes to form elements
	$('*[data-value]').filter(":input").bind('propertychange keyup input paste', function(e) {
		var $this = $(this);
		var val = $this.attr('data-value');
		bound[val] = $this.val();
	})
	// set each input to the data value
	.each(function() {
		var $this = $(this);
		var val = $this.attr('data-value');
		$this.val(bound[val]);
	});
	
	
	// watch for changes to bound variables
	$('*[data-value]').each(function() {
		var $this = $(this);
		var val = $this.attr('data-value');
		bound.watch(val, watchHandler);
		$this.html(bound[val]);
	});
	
	$('*[data-foreach]').each(function() {
		var $this = $(this);
		newval = bound[$this.attr('data-foreach')];
		updateForEach($(this), newval);	
	});
	
});


function watchHandler(id, oldval, newval) {
    $('*[data-value="'+id+'"]').not(":input").each(function() {
		if($(this).html() != newval) $(this).html(newval);
	});
    $('*[data-value="'+id+'"]').filter(":input").each(function() {
		if($(this).val() != newval) $(this).val(newval);
	});
	
    $('*[data-foreach="'+id+'"]').each(function() {
		updateForEach($(this), newval);	
	});
	
    return newval;
}



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
					cancelDelayedSetting = false;
					delayedSetter(prop, newval);
					return newval;
				},
				setter = function (val) {
					oldval = newval;
					cancelDelayedSetting = true;
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