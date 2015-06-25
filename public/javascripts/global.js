var userListData = [];

$(document).ready(function(){
	populateTable();
	$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
	$("#btnAddUser").on('click', addUser);
	$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
	$("#btnUpdateUser").on('click', updateUser);
});

var populateTable = function(){
	var tableContent = '';
	$.getJSON('/users/userlist', function(data){
		userListData = data
		$.each(data, function(){
			tableContent += '<tr>';
			tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
			tableContent += '<td>' + this.email + '</td>';
			tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
			tableContent += '</tr>';
		});
		$("#userList table tbody").html(tableContent);
	});
}

var showUserInfo = function(event){
	event.preventDefault();
	var thisUserName = $(this).attr('rel');
	var arrayPosition = userListData.map(function(arrayItem){
		return arrayItem.username;
	}).indexOf(thisUserName);
	
	var thisUserObject = userListData[arrayPosition];
	
	$("#userInfoName").text(thisUserObject.fullname);
	$("#userInfoAge").text(thisUserObject.age);
	$("#userInfoGender").text(thisUserObject.gender);
	$("#userInfoLocation").text(thisUserObject.location);
}

var addUser = function(event){
	
	event.preventDefault();
	var errorCount = 0;
	
	$("#addUser input").each(function(index, val){
		if ($(this).val() === ''){
			errorCount++;
		}
	});
	if (errorCount == 0){
		var newUser = {
			'username': $('#addUser fieldset input#inputUserName').val(),
			'email': $('#addUser fieldset input#inputUserEmail').val(),
			'fullname': $('#addUser fieldset input#inputUserFullname').val(),
			'age': $('#addUser fieldset input#inputUserAge').val(),
			'location': $('#addUser fieldset input#inputUserLocation').val(),
			'gender': $('#addUser fieldset input#inputUserGender').val()
		};
			
		$.ajax({
			type: 'POST',
			data: newUser,
			url: '/users/adduser',
			dataType: 'JSON'
		}).done(function(resp){
			if (resp.msg === ''){
				$('#addUser fieldset input').val('');
				populateTable();
			} else{
				alert('Error: ' + resp.msg);
			}
		});
	} else{
		alert("Please fill all the fields!");
		return false;
	}
}

// Delete User
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};

var updateUser = function(event){
	event.preventDefault();
	var upUser = {
			'username': $('#updateUser fieldset input#inputUserName').val(),
			'email': $('#updateUser fieldset input#inputUserEmail').val(),
			'fullname': $('#updateUser fieldset input#inputUserFullname').val(),
			'age': $('#updateUser fieldset input#inputUserAge').val(),
			'location': $('#updateUser fieldset input#inputUserLocation').val(),
			'gender': $('#updateUser fieldset input#inputUserGender').val()
		};
			
	$.ajax({
		type: "PUT",
		url: '/users/updateuser',
		data: upUser,
		dataType: 'JSON'
	}).done(function(resp){
			if (resp.msg === ''){
				$('#addUser fieldset input').val('');
				populateTable();
			} else{
				alert('Error: ' + resp.msg);
			}
		});
}

	