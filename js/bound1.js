var bound = {};

// BOUND
$(function() {
	// detect changes to form elements
	$('*[data-value]').bind('propertychange keyup input paste', function(e) {
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
	$('*[data-text]').each(function() {
		var $this = $(this);
		var val = $this.attr('data-text');
		bound.watch(val, watchHandler);
		$this.html(bound[val]);
	});
	
	$('*[data-foreach]').each(function() {
		var $this = $(this);
		var val = bound[$this.attr('data-foreach')];
		bound.watch(bound['set'][0]['letter'], watchHandler);
		bound.watch(val, watchHandler);
		
		console.log('data-foreach');
		console.log(val);
		
		// convert template to model
		var model = $this.children().addClass('bound-model').hide();
		
		// duplicate model for each data item
		for (x = 0; x < val.length; x++) {
			clone = model.clone().appendTo($this).show();
			
			// look for any elements inside with particular value
			clone.find('*[data-val]').each(function() {
				thisval = $(this).attr('data-val');
				$(this).html(val[x][thisval]);
			});	
		}		
	});
	
});


function watchHandler(id, oldval, newval) {
    console.log( "bound." + id + " changed from " + oldval + " to " + newval );
    $('*[data-text="'+id+'"]').each(function() {
		if($(this).html() != newval) $(this).html(newval);
	});
    $('*[data-value="'+id+'"]').each(function() {
		if($(this).val() != newval) $(this).val(newval);
	});
	
    $('*[data-value="'+id+'"]').each(function() {
		if($(this).val() != newval) $(this).val(newval);
	});
	
    return newval;
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
		  enumerable: false
		, configurable: true
		, writable: false
		, value: function (prop, handler) {
			var
			  oldval = this[prop]
			, newval = oldval
			, getter = function () {
				return newval;
			}
			, setter = function (val) {
				oldval = newval;
				return newval = handler.call(this, prop, oldval, val);
			}
			;
			
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