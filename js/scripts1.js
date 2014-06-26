var bound;
//var bound = { p: 1, name: 'Thom' };
$(function() {

	//$('*[data-value]')
	$('*[data-value]').bind('propertychange keyup input paste', function(e) {
		val = $(this).attr('data-value');
		console.log("data-value: " + val);
		bound[val] = $(this).val();		
	});
	

	$('.change_name').click(function() {
		bound.name = bound.name + "!";
	});
	$('.change_number').click(function() {
		bound.p = parseInt(bound.p) + 1;
	});


	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/watch#Examples
	//var o = { p: 1 };

	$('*[data-text]').each(function() {
		val = $(this).attr('data-text');
		console.log('val: ' + val);
		bound[val] = "";//$(this).html();
	});	


	bound.watch("name", watchHandler);
	bound.watch("p", watchHandler);

	
});


function watchHandler(id, oldval, newval) {
    console.log( "bound." + id + " changed from " + oldval + " to " + newval );
    $('*[data-text="'+id+'"]').each(function() {
		//val = $(this).attr('data-text');
		$(this).html(newval);
	});
    $('*[data-value="'+id+'"]').each(function() {
		//val = $(this).attr('data-text');
		$(this).val(newval);
	});
	
    return newval;
	
}


