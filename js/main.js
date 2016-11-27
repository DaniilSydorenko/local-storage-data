//@TODO User set to cookie/session storage
//@TODO edit messages div -> textarea
//@TODO edit messages in modal window
//@TODO round photo
//@TODO tags date,
//@TODO empty message,
//@TODO NO messages yet,
//@TODO Response about success message,


(function($){
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
				date: res.date
			};
		},

		getFromStorage: function(key) {
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
					data[key] =  JSON.parse(localStorage.getItem(key));
				}
			}
			return data;
		},

		editMessage: function (messageId) {
			var message = App.getFromStorage(messageId);
			var form = $("<form id=\"edit-form\">" +
				"<input class=\"message-text\" type=\"text\" value=" + message.message + ">" +
				"<input class=\"message-id\" type=\"hidden\" value=" + messageId	+ ">" +
				"<button>Ok</button>" +
				"</form>");
			$(".message-" + messageId).html(form);
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

	//App.getData('storage/user.json', getUser);
	//
	//function getUser(data) {
	//	//console.log(data);
	//}

	// Make a button clear all???
	// User data in session storage
	$(document).ready(function () {

		var data = App.getAllFromStorage();

		for (var item in data) {
			if (data.hasOwnProperty(item)) {
				$("#data").append($("<div class=\"message-"+ item +" visible\" data-id=" + item + ">" +
					"<p>" + data[item].message + "</p>" +
					"<em>" + data[item].user + " " + data[item].date + "</em>" +
					"</div>"));
			}
		}

		$(".edit").on('click', function() {
			var id = $(this).closest('li').data('id');
			App.editMessage(id);
		});

		$("#message-form").on('submit', function (event) {
			var date = new Date();
			var formattedDate = date.getDate() + "-" + (date.getUTCMonth() + 1) + "-" + date.getFullYear();

			var message = $('textarea[name="message"]').val();

			if (message.length != 0) {
				var item = {
					user: 'Daniil Sydorenko',
					message: message,
					date: formattedDate
				};

				var result = App.saveToStorage(null, item);

				$("#data").append($("<div class=\"message-"+ result.id +"\">" +
					"<p>" + message + "</p>" +
					"<em>" + result.user + " " + result.date + "</em>" +
					"</div>"));

				setTimeout(function () {
					$(".message-" + result.id).addClass("visible");
				}, 10);
			}

			event.preventDefault();
		});

		$("#edit-form").on('submit', function (event) {
			var text = $(".message-text").val();
			var id = $(".message-id").val();
			console.log(text, id);
			App.saveToStorage(id, text);

			//$("#data").append($("<li>").text(key + " - " + text));

			event.preventDefault();
		});

	});


})(jQuery);
