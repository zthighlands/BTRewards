$(document).ready(function(){
	$('#add-task-form').on('submit',function(e){
		addTask(e);
	}); //Only call when add-task-form is submitted
	
//////////////////////////////////////////edit event 
	$('#edit-task-form').on('submit',function(e){
		updateTask(e);
		});//Only call when edit-task-form is submitted

		displayTasks();	 //Always called when ready

///////////////////////////////////// remove task event 
$('#task-table').on('click','#remove-task',function(){
	id =$(this).data('id');  //What is this
	removeTask(id);
});
//////////////////////////////Remove task function 
function removeTask(id){
	if(confirm('Are you sure you want to delete this task?')){
		var taskList = JSON.parse(localStorage.getItem('tasks'));
		for(var i =0; i < taskList.length; i++){ 
			if(taskList[i].id == id){
				taskList.splice(i,1)
			}
		localStorage.setItem('tasks',JSON.stringify(taskList));
		}
		location.reload();
}
}
///////////////////////////////////Clear All Tasks
$('#clear-tasks').on('click',function(){
	clearAllTasks();
});
///create function 

function clearAllTasks(){
	if(confirm('Clear All?')){
		localStorage.clear();
		location.reload();
	}
}

/////////////////////////////////////////Function to Display Tasks
		function displayTasks(){	
			var taskList = JSON.parse(localStorage.getItem('tasks'));
			//sort tasks
			if(taskList != null){
				taskList= taskList.sort(sortByTime); //sort takes in a custom function, refer below
			}
			//Set counter
/* 			var i = 0 ; */ //I don't think this code is necessary? 
			//check tasks
			if(localStorage.getItem('tasks') !=null){
				//loop through an display
				$.each(taskList,function(key,value){ //for each key in taskList... 
				//.append attaches specified at the last (as opposed to prepend) Note using double and single quotes!!!!
				//use value.() for values of keys in an erray 
				//since #task-table is referenced, it only applies when there is #task-table
					$('#task-table').append('<tr id="'+ value.id + '">'+
											'<td>' + value.task +'</td>' +
											'<td>' + value.task_priority + '</td>'+
											'<td>' + value.task_date + '</td>'+
											'<td>' + value.task_time + '</td>'+
											'<td><a href="edit.html?id=' + value.id + '">Edit</a> | <a href="#" id="remove-task" data-id="'+value.id+'">Remove</a>' + 
											'</tr>'); //note that info after "?" does not affect filepath, rather for people to use as info (recall PHP)
				})
			}
		}
		
///////////////////////////////////// Function to sort tasks
	function sortByTime(a, b){
		var aTime = a.task_time;
		var bTime = b.task_time;
		return ((aTime < bTime) ? -1 : ((aTime > bTime) ? 1 : 0));
	}
//sort function (called above) allows for a function(a,b), where (a,b) are 2 keys in an array 
// the "." refers to what element to compare the key by 
// if a<b then -1, hence sort a in front of b (a has a smaller index)
//if a>b then 1, hence sort b in front of a (b has a smaller index)
//http://www.javascriptkit.com/javatutors/arraysort.shtml



////////////////////////////function to add task 
	function addTask(e){
		//add Unique ID
		var newDate= new Date();
		id =newDate.getTime();
		//Extract Info from form submitted on HTML 
		var task = $('#task').val();
		var task_priority = $('#priority').val();
		var task_date = $('#date').val();
		var task_time = $('#time').val();
		
		//simple validation
		if(task ==''){
			alert('Task is Required');
			e.preventDefault();
		} else{
			tasks = JSON.parse(localStorage.getItem('tasks')); //JSON.parse converts text to a JS object, such as array
		//Check Tasks
			if(tasks == null){
				tasks =[]; // if tasks is empty, make the tasks object into an empty array, so that you can push key values in later
			} //note that tasks is a nested array!!! Browser assigns its own keys to your array!! 
			var taskList = JSON.parse(localStorage.getItem('tasks')); 
		//New Task Object
			
			var new_task = {
				"id": id,
				"task": task,
				"task_priority":task_priority,
				"task_date":task_date,
				"task_time":task_time
			}
		tasks.push(new_task);
		localStorage.setItem('tasks', JSON.stringify(tasks)); //Use SET ITEM to commit to memory. Must be stringified. 
		console.log('Task Added'); //Gives a message box thing.
	}
	}
	
////////////////////////////////////function updateTask

//since above already actives this code on edit-table, no need to further specify
	function updateTask(e){
		var id=$('#task_id').val();
		var task = $('#task').val();
		var task_priority = $('#priority').val();
		var task_date = $('#date').val();
		var task_time = $('#time').val();
		
		taskList = JSON.parse(localStorage.getItem('tasks')); 
		
		for(var i =0; i < taskList.length; i++){ //array.length returns number of keys in the array. Note of nested arrays
			if (taskList[i].id==id){
				taskList.splice(i,1) //At position i, remove 1 item (in this case the item itself)
				//https://www.w3schools.com/jsref/jsref_splice.asp
			}
				localStorage.setItem('tasks',JSON.stringify(taskList));
		}
		//simple validation
		if(task ==''){
			alert('Task is Required');
			e.preventDefault();
		} else{
			tasks = JSON.parse(localStorage.getItem('tasks')); //JSON.parse converts text to a JS object
		
			//Check Tasks
			if(tasks == null){
				tasks =[];
			}
			var taskList = JSON.parse(localStorage.getItem('tasks')); //Tasks is array, taskList is the string form
			//New Task Object
			
			var new_task = {
				"id": id,
				"task": task,
				"task_priority":task_priority,
				"task_date":task_date,
				"task_time":task_time
			}
		tasks.push(new_task);
		localStorage.setItem('tasks', JSON.stringify(tasks));
		}
	}
});

//The getTask function must be out of the jQuery document ready, so that the function is available before the document is actually ready. Therefore, this code always runs!
//Function for getting single task 

function getTask(){
	var $_GET = getQueryParams(document.location.search); 
	id = $_GET['id']; 
	
	var taskList = JSON.parse(localStorage.getItem('tasks'));
	for(var i=0;i<taskList.length;i++){
		if(taskList[i].id==id){
			$('#edit-task-form #task_id').val(taskList[i].id); //Filling the table with info from localstorage!! Contrast to val()
			$('#edit-task-form #task').val(taskList[i].task);
			$('#edit-task-form #priority').val(taskList[i].task_priority);
			$('#edit-task-form #date').val(taskList[i].task_date);
			$('#edit-task-form #time').val(taskList[i].task_time);
	};
	
};

//Function to get HTTP GET Requests
/* function getQueryParams(qs){
	qs = qs.split("+").join(" ");
	var params= {},
		tokens,
		re= /[?&]?([^=}+)=([^&]*)/g;
		
	while(tokens=re.exec(qs)){
		params[decodeURIComponent(tokens[1])]
		= decodeURIComponent(tokens[2]);
	}
	return params;
} */

function getQueryParams(qs){
    qs = qs.split("+").join(" ");
    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            = decodeURIComponent(tokens[2]);
    }
//WHAT THE FUCK IS THIS
    return params;
}
}