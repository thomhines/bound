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