//var bound;
var bound = { p: 1, name: 'Jack' };
var name = 'Thom';
var p = 5;
$(function() {
	$('.change_name').click(function() {
		bound.name = 'Thom';
	});
	
	$('.change_number').click(function() {
		p = parseInt(p) + 1;
	});
});








// BOUND
$(function() {

	$('*[data-value]').bind('propertychange keyup input paste', function(e) {
		val = $(this).attr('data-value');
		window[val] = $(this).val();	
		//bound.name = $(this).val();	
		console.log('window ' + window[val]);
		console.log('eval ' + eval(val));

	});

	// every 100ms, set value of elements to data-value value;
	setInterval(updateContent, 1000);
});

function updateContent() {
	$('*[data-text]').each(function() {
		val = eval($(this).attr('data-text'));
		if($(this).html() != val) $(this).html(val);
	});
	$('*[data-value]').each(function() {
		val = eval($(this).attr('data-value'));
		console.log(val);
		if($(this).val() != val) $(this).val(val);
	});
}