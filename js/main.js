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
			// can make count by key...
			return Object.keys(localStorage).length;
		},

		saveToStorage: function (key, item) {
			key = (!key) ? App.getMessageCount() : key;
			if (!App.storage.getItem(key)) {
				App.storage.setItem(key, JSON.stringify(item));
			}

			var res = App.getFromStorage(key);

			return {
				id: key,
				message: res.message,
				user: res.user,
				date: res.date,
				status: res.status
			};
		},

		getFromStorage: function (key) {
			return JSON.parse(localStorage.getItem(key));
		},

		getAllFromStorage: function () {
			// implement filter for keys ... like callback ???
			var storage = localStorage;
			var data = [];
			var regExp = /^\d+$/;
			for (var key in storage) {
				if (storage.hasOwnProperty(key) && regExp.test(key)) {
					// maybe get number of key here and sort ???
					data[key] = JSON.parse(localStorage.getItem(key));
				}
			}
			return data;
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

	};


	var tasks = App.getAllFromStorage();
	var dataContainer = document.getElementById('data');

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

	for (var item in tasks) {
		if (tasks.hasOwnProperty(item)) {
			var messageElement = createTask(item, tasks[item].message);
			dataContainer.appendChild(messageElement);
		}
	}

	/**
	 * Events listeners
	 */
	document.getElementById('message-form').addEventListener('submit', function (event) {
		var date = new Date();
		var formattedDate = date.getDate() + "-" + (date.getUTCMonth() + 1) + "-" + date.getFullYear();

		var taskText = document.getElementById('task').value;

		if (taskText.length != 0) {
			var item = {
				user: 'Daniil Sydorenko',
				message: taskText,
				date: formattedDate,
				status: 1
			};

			var result = App.saveToStorage(null, item);

			// Create and add task to the list
			var messageElement = createTask(result.id, taskText);
			dataContainer.appendChild(messageElement);

			setTimeout(function () {
				document.querySelector(".message-" + result.id).classList.add('visible');
			}, 100);
		}

		event.preventDefault();
	});


})(jQuery);
