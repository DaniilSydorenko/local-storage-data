//@TODO User set to cookie/session storage

//@TODO edit TASK in modal window !!!!!

//@TODO info about task
//@TODO remove task
//@TODO DONE task
//@TODO NO TASK yet,
//@TODO Response about success TASK,

//@TODO DRAG & DROP task to completted

(function ($) {
	'use strict';

	var App = {

		storage: localStorage,

		getData: function (url, callback) {
			$.getJSON(url, function (data) {
				if (typeof callback == "function")
					callback(data);
			}).done(function () {
				console.log("Success");
			}).fail(function () {
				console.log("Error");
			});
		},

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
			console.log(res);
		},

		init: function () {
			var menu = $('.nav-menu');
			var bar = $('.nav-bar-menu');
			$('button').on('click', function () {
				if (bar.hasClass('active')) {
					bar.removeClass('active');
				} else {
					bar.addClass('active');
				}
			});
		}
	};

	App.init();

	var DOM = {
		// create task
		// edit task
		// remove task
		// drag&drop
	};


	var uncompletedTasks = App.getUncompletedTasks();
	var completedTasks = App.getCompletedTasks();

	var utContainer = document.getElementById('uncompleted-tasks');
	var ctContainer = document.getElementById('completed-tasks');

	function createTask(id, text) {

		//	//"<em>" + result.user + " " + result.date + "</em>" +

		var task = document.createElement('div');
		task.classList.add('message-' + id);
		task.classList.add('visible');
		task.setAttribute('data-id', id);

		var textContainer = document.createElement('div');
		textContainer.classList.add('text-container');

		var textElement = document.createElement('p');
		textElement.classList.add('task-text');
		textElement.textContent = text;

		var buttonDone = document.createElement('button');
		buttonDone.classList.add('button-done');

		var buttonRemove = document.createElement('button');
		buttonRemove.classList.add('button-remove');

		var buttonInfo = document.createElement('button');
		buttonInfo.classList.add('button-info');

		textContainer.appendChild(textElement);
		task.appendChild(buttonDone);
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
				utContainer.appendChild(createTask(i, uncompletedTasks[i].message));
			}
		}
		/* Show completed tasks */
		for (var j in completedTasks) {
			if (completedTasks.hasOwnProperty(j)) {
				ctContainer.appendChild(createTask(j, completedTasks[j].message));
			}
		}
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
			var messageElement = createTask(key, taskText);
			utContainer.appendChild(messageElement);

			setTimeout(function () {
				document.querySelector(".message-" + key).classList.add('visible');
			}, 100);
		}

		event.preventDefault();
	});

	// Task complete
	var buttonsComplete = document.querySelectorAll('.button-done');
	for (var i = 0; i < buttonsComplete.length; i++) {
		buttonsComplete[i].addEventListener('click', function () {
			var taskId = this.parentElement.getAttribute('data-id');

			App.completeTask(taskId);
			
			// move complete tasks
			//ctContainer.appendChild()
		});
	}


})(jQuery);
