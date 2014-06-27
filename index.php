<!DOCTYPE html>
<html lang="en-us">
<head>
<title>bound</title>
<meta charset="utf-8" />
<meta name="description" content="" />
<meta name="keywords" content="" />
<meta name="viewport" content="width=device-width">
<link rel="shortcut icon" href="favicon.ico" />

<link rel="Stylesheet" href="/cinch-0.7/?files=/bound/css/style.scss" type="text/css" media="all" />
<script src="/cinch-0.7/?files=[jquery],/bound/js/bound-handlebars.js&min=0"></script>

</head>

<body class="body">

	
	
	<div class="test">
		<h3>{{name}}!!!</h3>
		<h4>subtitle</h4>
		<div>
			<h3>
				<span>
					<a>span</a>
					<span>here is a name: {{name}}</span>
				</span>
			</h3>	
		</div>
		<input data-bind="name">
		<input data-bind="name">
		<button class="change_name">change name</button>
		
		<h4>{{date}}</h4>
		<input data-bind="date" placeholder="enter date here">
	</div>
	
	<div class="output">
		<h6>OUTPUT</h6>
	</div>
	
	<hr>
	
	<h3 data-value="p"></h3>
	<h3 data-value="p"></h3>
	<h3 data-value="p"></h3>
	<input data-value="p">
	<button class="change_number">change number</button>
	
	<hr>


	<span data-foreach="todos">
		<div class="todo">
			<input type="checkbox" data-val="done">
			<p data-val="name">name</p>
			<p class="date" data-val="date">date</p>
			<p data-val="done">0</p>
			<input data-val="name">
		</div>
	</span>
	
	<div class="new todo">
		<input type="checkbox" disabled="disabled">
		<p data-value="new_name">name</p>
		<p class="date" data-value="new_date">date</p>
		<p data-value="new_done">0</p>
		<input class="blank">
	</div>
	
	<br>
	<div class="add_new_todo">
		<input class="new_name" data-value="new_name">
		<input class="new_date" data-value="new_date">
		<button class="add_todo">add</button>
	</div>
	
	<br>
	
	<button class="remove_todo">remove</button>
	
	<br>

	<button class="update_todo_name">update first todo name</button>
	<input data-value="todos[0].name">
	<input data-value="todos[0].date">
	
	
	<hr>
	
	<div data-foreach="todos">
		<div class="thing">
			<div data-val="name"></div>
		</div>
	</div>
	


	

</body>

</html>