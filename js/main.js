'use strict';

//@TODO User set to cookie/session storage
//@TODO edit TASK in modal window !!!!!
//@TODO NO TASK yet
//@TODO DRAG & DROP task to completted

//@TODO RegExp for links and time

/**
 * Logic
 * @type {{storage: Storage, getMessageCount: App.getMessageCount, saveToStorage: App.saveToStorage, getFromStorage: App.getFromStorage, getAllFromStorage: App.getAllFromStorage, getUncompletedTasks: App.getUncompletedTasks, getCompletedTasks: App.getCompletedTasks, completeTask: App.completeTask, removeTask: App.removeTask}}
 */
var App = {

	storage: localStorage,

	//getData: function (url, callback) {
	//	$.getJSON(url, function (data) {
	//		if (typeof callback == "function")
	//			callback(data);
	//	}).done(function () {
	//		console.log("Success");
	//	}).fail(function () {
	//		console.log("Error");
	//	});
	//},

	//App.getData('storage/user.json', getUser);
	//
	//function getUser(data) {
	//	//console.log(data);
	//}


	getMessageCount: function () {
		var keys = Object.keys(localStorage);
		var counter = 0;

		for (var i = 0; i < keys.length; i++) {
			if (keys[i].indexOf("task_") >= 0) {
				counter++;
			}
		}

		return counter;
	},


	saveToStorage: function (key, item) {
		key = (!key) ? "task_" + App.getMessageCount() : key;
		App.storage.setItem(key, JSON.stringify(item));
		var res = App.getFromStorage(key);
		var task = {};

		task[key] = {
			message: res.message,
			user: res.user,
			date: res.date,
			status: res.status
		};

		return task;
	},

	getFromStorage: function (key) {
		return JSON.parse(localStorage.getItem(key));
	},

	getAllFromStorage: function () {
		var storage = localStorage;
		var data = [];
		var regExp = /^\d+$/; // regexp for task_ ?
		for (var key in storage) {
			if (storage.hasOwnProperty(key) && key.indexOf("task_") >= 0) {
				// maybe get number of key here and sort ???
				data[key] = JSON.parse(localStorage.getItem(key));
			}
		}
		return data;
	},

	getUncompletedTasks: function () {
		var storage = localStorage;
		var data = [];
		for (var key in storage) {
			if (storage.hasOwnProperty(key) && key.indexOf("task_") >= 0 && JSON.parse(storage[key]).status == 1) {
				// maybe get number of key here and sort ???
				data[key] = JSON.parse(localStorage.getItem(key));
			}
		}
		return data;
	},

	getCompletedTasks: function () {
		var storage = localStorage;
		var data = [];
		for (var key in storage) {
			if (storage.hasOwnProperty(key) && key.indexOf("task_") >= 0 && JSON.parse(storage[key]).status == 2) {
				// maybe get number of key here and sort ???
				data[key] = JSON.parse(localStorage.getItem(key));
			}
		}
		return data;
	},

	completeTask: function (id) {
		var task = App.getFromStorage(id);
		var res = App.saveToStorage(id, {
			message: task.message,
			user: task.user,
			date: task.date,
			status: 2
		});
	},

	removeTask: function (id) {
		var task = App.getFromStorage(id);
		var res = App.saveToStorage(id, {
			message: task.message,
			user: task.user,
			date: task.date,
			status: 0
		});
	}

};


var DOM = {
	// create task
	// edit task
	// remove task
	// drag&drop
};

var menu = document.querySelector('.nav-menu');
var bar = document.querySelector('.nav-bar-menu');
var buttonMenu = document.querySelector('.menu-btn');

var uncompletedTasks = App.getUncompletedTasks();
var completedTasks = App.getCompletedTasks();

var utContainer = document.getElementById('uncompleted-tasks');
var ctContainer = document.getElementById('completed-tasks');

var utDivider = document.querySelector('#uncompleted-tasks > .divider');
var ctDivider = document.querySelector('#completed-tasks > .divider');

function createTask(id, text, container) {
	var task = document.createElement('div');
	task.classList.add('message-' + id);
	task.classList.add('visible');
	task.setAttribute('data-id', id);

	var textContainer = document.createElement('div');
	textContainer.classList.add('text-container');

	var textElement = document.createElement('p');
	textElement.classList.add('task-text');
	textElement.textContent = text;

	var buttonComplete = document.createElement('button');
	buttonComplete.classList.add('button-complete');

	var btnCompleteIco = document.createElement('i');
	btnCompleteIco.classList.add('fa');
	if (container === "u") {
		btnCompleteIco.classList.add('fa-thumbs-o-up');
	} else if (container === "c") {
		btnCompleteIco.classList.add('fa-thumbs-up');
	}

	var buttonRemove = document.createElement('button');
	buttonRemove.classList.add('button-remove');

	var btnRemoveIco = document.createElement('i');
	btnRemoveIco.classList.add('fa');
	btnRemoveIco.classList.add('fa-trash-o');

	var buttonInfo = document.createElement('button');
	buttonInfo.classList.add('button-info');

	var btnInfoIco = document.createElement('i');
	btnInfoIco.classList.add('fa');
	btnInfoIco.classList.add('fa-info-circle');

	textContainer.appendChild(textElement);
	buttonComplete.appendChild(btnCompleteIco);
	buttonRemove.appendChild(btnRemoveIco);
	buttonInfo.appendChild(btnInfoIco);

	task.appendChild(buttonComplete);
	task.appendChild(textContainer);
	task.appendChild(buttonRemove);
	task.appendChild(buttonInfo);

	return task;
}

/**
 * Show completed and uncompleted tasks
 */
function showTasks() {
	/* Show uncompleted tasks */
	for (var i in uncompletedTasks) {
		if (uncompletedTasks.hasOwnProperty(i)) {
			utContainer.appendChild(createTask(i, uncompletedTasks[i].message, "u"));
		}
	}
	/* Show completed tasks */
	for (var j in completedTasks) {
		if (completedTasks.hasOwnProperty(j)) {
			ctContainer.appendChild(createTask(j, completedTasks[j].message, "c"));
		}
	}

	//if (uncompletedTasks[0].length == 0) {
	//	utDivider.style.display = 'none';
	//}
	//
	//if (completedTasks[0].length == 0) {
	//	ctDivider.style.display = 'none';
	//}

}

showTasks();


/**
 * Events listeners
 */

// Form submit
document.getElementById('message-form').addEventListener('submit', function (event) {
	var date = new Date();
	var formattedDate = date.getDate() + "-" + (date.getUTCMonth() + 1) + "-" + date.getFullYear();
	var taskText = document.getElementById('task').value;

	if (taskText.length != 0) {
		var result = App.saveToStorage(null, {
			user: 'Daniil Sydorenko',
			message: taskText,
			date: formattedDate,
			status: 1
		});

		var key = Object.keys(result)[0];

		// Create and add task to the list
		var messageElement = createTask(key, taskText, "u");
		utContainer.appendChild(messageElement);

		// Clean input
		document.getElementById('task').value = '';

		setTimeout(function () {
			document.querySelector(".message-" + key).classList.add('visible');
		}, 100);
	}

	event.preventDefault();
});

// Task complete
var buttonsComplete = document.querySelectorAll('.button-complete');
for (var i = 0; i < buttonsComplete.length; i++) {
	buttonsComplete[i].addEventListener('click', function (e) {
		var task = this.parentElement;
		var taskId = task.getAttribute('data-id');
		App.completeTask(taskId);
		ctContainer.appendChild(task);
	}, true);
}

// Task remove
var buttonsRemove = document.querySelectorAll('.button-remove');
for (var j = 0; j < buttonsRemove.length; j++) {
	buttonsRemove[j].addEventListener('click', function () {
		var task = this.parentElement;
		var taskId = task.getAttribute('data-id');
		App.removeTask(taskId);
		task.style.display = "none";
	});
}

// Header
buttonMenu.addEventListener('click', function () {
	if (bar.className == 'active') {
		bar.classList.remove('active');
	} else {
		bar.classList.add('active');
	}
});

