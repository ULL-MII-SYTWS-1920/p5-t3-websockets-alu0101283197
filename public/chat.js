'use strict';

$(function(){
	//make connection
	
	const activeRoomLink = document.querySelector('.room.active');
	const currentRoomId = activeRoomLink.getAttribute('data-room-id');
	var socket = io.connect(`/${currentRoomId}`)

	//buttons and inputs
	var message = $("#message")
	var username = $("#username")
	var sendMessageForm = $("#send_message_form")
	var send_username = $("#send_username")
	var chatroom = $("#chatroom")
	var feedback = $("#feedback")

	//Emit message
	sendMessageForm.on('submit', (event) => {
		event.preventDefault();
		socket.emit('new_message', {message : message.val()})
	});

	//Listen on new_message
	socket.on("new_message", (data) => {
		feedback.html('');
		message.val('');
		chatroom.append("<p class='message'>" + data.username + ": " + data.message + "</p>")
	})

	//Emit a username
	send_username.click(function(){
		socket.emit('change_username', {username : username.val()})
	})

	//Emit typing
	message.bind("keypress", () => {
		socket.emit('typing')
	})

	//Listen on typing
	let typingTimeout;
	socket.on('typing', (data) => {
		feedback.html("<p><i>" + data.username + " está escribiendo un mensaje..." + "</i></p>");
		clearTimeout(typingTimeout);

		typingTimeout = setTimeout(() => {
			feedback.html('');
			clearTimeout(typingTimeout);
		}, 1000);
	})
});


