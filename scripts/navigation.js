var Navigation = function() {
    var siteUrl = "http://localhost:8080/";
    var cookieExpiration = 3;
    var cookieName = "classRPG-user";

    var showLoading = function () {
        $('.overlay').fadeIn();
    };

    var hideLoading = function () {
        $('.overlay').fadeOut();
    };

    var showSuccessPopup = function(message) {
        Materialize.toast(message, 3000, 'green-bg')
    };

    var showFailedPopup = function(message) {
        Materialize.toast(message, 3000, 'red-bg')
    };

	var handleLogin = function(){
		$('#login-btn').on('click', function(e){
			e.preventDefault();
            showLoading();
            var username = $('#username').val();
            var password = $('#password').val();

            if(username.length == 0) {
                showFailedPopup("Username can't be empty.");
                hideLoading();
                return;
            }
            else if(!/^[A-Za-z\s]+$/.test(username)) {
                showFailedPopup("Invalid username.");
                hideLoading();
                return;
            }

            if(password.length == 0) {
                showFailedPopup("Password can't be empty.");
                hideLoading();
                return;
            }
            else if(password.length < 5) {
                showFailedPopup("Password must be at least 5 characters long.");
                hideLoading();
                return;
            }
            else if (!/\d/.test(password) || !/[a-zA-Z]/.test(password) || !/[^a-zA-Z\d]/.test(password))
            {
                showFailedPopup("Password must have atleast 1 letter, 1 number, and 1 special character");
                hideLoading();
                return;
            }

			var data = { username: username, password: password};
            console.log(data);
			$.ajax({
            type: "POST",
            url: siteUrl + "user/login",
            dataType: "json",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            success: function(user){
                //set cookie
                Cookies.set(cookieName, user, { expires: cookieExpiration});
                Cookies.remove('error');
                hideLoading();
            	window.location.replace(siteUrl);
			},
            error : function() {
                showFailedPopup("Either email or password was incorrect.");
                hideLoading();
                $('#login-form')[0].reset();
            }
            });
		});
	};

    var handleRegister = function(){
		$('#register-btn').on('click', function(e){
			e.preventDefault();
            showLoading();
            var username = $('#username').val();
            var name = $('#name').val();
            var email = $('#email').val();
            var studentId = $('#student-id').val();
            var password = $('#password').val();

            if(username.length == 0 || !/^[A-Za-z\s]+$/.test(username)) {
                showFailedPopup("Invalid username.");
                hideLoading();
                return;
            }

            if(name.length == 0 || !/^[A-Za-z\s]+$/.test(name)) {
                showFailedPopup("Invalid name.");
                hideLoading();
                return;
            }

            var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (email.length == 0 && !emailRegex.test(email)) {
                showFailedPopup("Invalid email.");
                hideLoading();
                return;
            }

            var idRegex = /^[0-9]{3}[-\s\.]?[0-9]{2}[-\s\.]?[0-9]{4}$/;
            if (studentId.length == 0 || !idRegex.test(studentId)) {
                showFailedPopup("Invalid student id.");
                hideLoading();
                return;
            }

            if(password.length == 0) {
                showFailedPopup("Password can't be empty.");
                hideLoading();
                return;
            }
            else if(password.length < 5) {
                showFailedPopup("Password must be at least 5 characters long.");
                hideLoading();
                return;
            }
            else if (!/\d/.test(password) || !/[a-zA-Z]/.test(password) || !/[^a-zA-Z\d]/.test(password))
            {
                showFailedPopup("Password must have atleast 1 letter, 1 number, and 1 special character");
                hideLoading();
                return;
            }

			var data = { username: username, name: name, email: email, studentId: studentId, password: password, student: true};
			$.ajax({
            type: "POST",
            url: siteUrl + "user/register",
            dataType: "json",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            success: function(user){
                //set cookie
                Cookies.set(cookieName, user, { expires: cookieExpiration});
                Cookies.remove('error');
                hideLoading();
            	window.location.replace(siteUrl);
			},
            error : function(message) {
                showFailedPopup(message);
                hideLoading();
                $('#password').val('');
            }
            });
		});
	};

    var replaceLoginStuff = function() {
        //Remove login/register buttons
        var html = "<li><a href='/user/profile'>"+ JSON.parse(Cookies.get(cookieName)).name +"</a></li>";
        $('.user-info').html(html);
    };

    var ForceLogin = function(){
        if(!Cookies.get(cookieName))
            {
                //Not Logged in
                Cookies.set('error', {message: "You must be logged in to view that page."}, {expires: 1})         
                window.location = siteUrl + "user/login";
            }
            replaceLoginStuff();
    };

    var handleQuestionAdd = function() {
        $('#question-add-btn').on('click', function(e){      
            e.preventDefault();      
            var html = "<section class='z-depth-3 col s12' style='background-color:#f9ede7;margin: 10px 0;'><div class='input-field col s12 m9'><input type='text' placeholder=''><label>Description</label></div>";
            html += "<div class='input-field col s12 m3'><select class='question-type'><option value='fill-blank'>Fill in the Blank</option><option value='mult-choice'>Multiple Choice</option>";
            html += "</select><label>Question Type</label></div>";

            //Fill in the blank field
            html += "<div class='input-field fill-blank-answer col s12'><input type='text' placeholder=''><label>Answer</label></div>";

            //Multiple choice fields
            html += "<div class='mult-choices-options' style='display:none;'><div class='input-field col s12 m3'><input name='group1' type='radio' id='option1'/><label for='option1'>Option 1</label></div>";
            html += "<div class='input-field col s12 m3'><input name='group1' type='radio' id='option2'/><label for='option1'>Option 2</label></div>";
            html += "<div class='input-field col s12 m3'><input name='group1' type='radio' id='option3'/><label for='option1'>Option 3</label></div>";
            html += "<div class='input-field col s12 m3'><input name='group1' type='radio' id='option4'/><label for='option1'>Option 4</label></div>";
            html += "<div class='input-field col s12 m3'><input type='text' placeholder=''><label>Option 1 </label></div>";
            html += "<div class='input-field col s12 m3'><input type='text' placeholder=''><label>Option 2 </label></div>";
            html += "<div class='input-field col s12 m3'><input type='text' placeholder=''><label>Option 3 </label></div>";
            html += "<div class='input-field col s12 m3'><input type='text' placeholder=''><label>Option 4 </label></div></div>";

            html += "</section>";
            $('#assignment-questions').append(html);
            $('select').material_select();        
        });
    };

    var handleQuestionTypeChange = function() {
        //$('.question-type').parent().parent().find('.mult-choices-options').fadeIn()
        
    };

    var handleAssignmentAdd = function() {
        $('#add-assignment-btn').on('click', function(){
            //ajax to save assignment
            
            //setTimeout(function(){ location.reload(); }, 3000);
        });
    };

	return {
        InitLogin: function () {
            //verifyLogin();
        	handleLogin();
        },
        InitRegister: function() {
            handleRegister();
        },
        ForceLogin : function() {
            if(!Cookies.get(cookieName))
            {
                //Not Logged in
                Cookies.set('error', {message: "You must be logged in to view that page."}, {expires: 1})         
                window.location = siteUrl + "user/login";
            }
            replaceLoginStuff();
        },
        GoToHome: function() {
            window.location = siteUrl;
        },
        VerifyLogin: function() {
            if(Cookies.get(cookieName))
            {
                replaceLoginStuff();
                return true;
            }
            else
            {
                return false;
            }
        },
        VerifyError: function() {
            if(Cookies.get('error'))
            {
                var text = JSON.parse(Cookies.get('error')).message;
                Materialize.toast(text, 3000, 'red-bg')
                Cookies.remove('error');
            }
        },
        InitProfile: function() {
            var user = JSON.parse(Cookies.get(cookieName));
            $('#username').val(user.username);
            $('#name').val(user.name);
            $('#email').val(user.email);
            $('#student-id').val(user.studentId);

            $('#username').attr('disabled', 'disabled');
            $('#name').attr('disabled', 'disabled');
            $('#email').attr('disabled', 'disabled');
            $('#student-id').attr('disabled', 'disabled');

            $('.profile-btn').on('click', function(e){
                e.preventDefault();
                showLoading();
                var password = $('#password');
                if(password.length == 0) {
                    showFailedPopup("Password can't be empty.");
                    hideLoading();
                    return;
                }
                else if(password.length < 5) {
                    showFailedPopup("Password must be at least 5 characters long.");
                    hideLoading();
                    return;
                }
                else if (!/\d/.test(password) || !/[a-zA-Z]/.test(password) || !/[^a-zA-Z\d]/.test(password))
                {
                    showFailedPopup("Password must have atleast 1 letter, 1 number, and 1 special character");
                    hideLoading();
                    return;
                }

                $.ajax({
                type: "POST",
                url: siteUrl + "user/profile",
                dataType: "json",
                data: JSON.stringify({password: password}),
                contentType: "application/json; charset=utf-8",
                success: function(){
                    hideLoading();
                    showSuccessPopup('Password updated successfully.');
                    $('#password').val('');
                },
                error : function() {
                    hideLoading();
                    showFailedPopup('Failed to update password.');
                    $('#password').val('');
                }
                });
            });
        },
        InitClasses: function() {
            showLoading();
            $.ajax({
                type: "GET",
                url: siteUrl + "classes/getClasses",
                dataType: "json",
                data: Cookies.get(cookieName),
                contentType: "application/json; charset=utf-8",
                success: function(classes){
                    for(var i = 0, len = classes.length; i < len; i++) {
                        var html = "<tr class='data-row' data-id='" + classes[i].id +"'><td>" + classes[i].name + "</td><td>" + classes[i].code + "</td><td>" + classes[i].professor.name + "</td></tr>";
                        $('tbody').append(html);
                    }
                    hideLoading();
                    $('.data-row').on('click', function(){
                        var user = JSON.parse(Cookies.get(cookieName));
                        window.location = siteUrl + "classes/class?userId=" + user.id + "&classId=" + $(this).data('id');
                    });
                },
                error : function() {
                    hideLoading();
                    showFailedPopup('Failed to get classes.');
                }
            });
        },
        InitInventory: function() {
            showLoading();
            $.ajax({
                type: "GET",
                url: siteUrl + "user/getInventory",
                dataType: "json",
                data: Cookies.get(cookieName),
                contentType: "application/json; charset=utf-8",
                success: function(inventory){
                    for(var i = 0, len = inventory.length; i < len; i++) {
                        var html = "<tr><td><img class='sprite' alt='sprite' src='../images/"+ inventory[i].sprite +"'></td><td>" + inventory[i].className + "</td><td>" + inventory[i].name + "</td><td>" + inventory[i].effect + "</td></tr>";
                        $('tbody').append(html);
                    }
                    $('#coins').text(JSON.parse(Cookies.get(cookieName)).gold);
                    hideLoading();
                },
                error : function() {
                    hideLoading();
                    showFailedPopup('Failed to get classes.');
                }
            });
        },
        InitClassStudent: function() {
            showLoading();
            var url = new URL(window.location.href);
            var id = url.searchParams.get("classId");
            $.ajax({
                type: "GET",
                url: siteUrl + "classes/classInfoStudent",
                dataType: "json",
                data: JSON.stringify({classId: id}),
                contentType: "application/json; charset=utf-8",
                success: function(classInfo){
                    $('.class-name').text(classInfo.name);
                    $('.class-professor').text(classInfo.professor.name);
                    $('.class-office').text(classInfo.professor.office);
                    $('.class-office-hours').text(classInfo.officeHours);
                    hideLoading();
                },
                error : function() {
                    hideLoading();
                    showFailedPopup('Failed to get class info.');
                }
            });
        },
        InitClassProfessor: function() {
            var url = new URL(window.location.href);
            var id = url.searchParams.get("classId");

            $('.modal').modal();
            $('select').material_select();
            $('#add-item-btn').on('click', function(){
                var name = $('#item-name').val();
                var effect = $('#item-effect').val();
                var sprite = $('#item-sprite').find(":selected").text();

                if(name.length == 0) {
                    showFailedPopup("Name can't be empty.");
                    return;
                }
                else if(!/^[A-Za-z\s]+$/.test(name)) {
                    showFailedPopup("Name is not valid.");
                    return;
                }

                if(effect.length == 0) {
                    showFailedPopup("Effect can't be empty.");
                    return;
                }

                var item = {name: name, effect: effect, sprite: sprite, classId: id};
                $.ajax({
                    type: "POST",
                    url: siteUrl + "classes/addItem",
                    dataType: "json",
                    data: JSON.stringify(item),
                    contentType: "application/json; charset=utf-8",
                    success: function(classInfo){
                        hideLoading();
                        showSuccessPopup('Successfully added item.');
                        setTimeout(function(){ location.reload(); }, 3000);
                    },
                    error : function() {
                        hideLoading();
                        showFailedPopup('Failed to add item.');
                    }
                });
            });

            $('#update-class-btn').on('click', function(){
                var officeHours = $('#office-hours').val();
                if(officeHours.length == 0) {
                    showFailedPopup("Office hours can't be empty.");
                    return;
                }
                $.ajax({
                    type: "POST",
                    url: siteUrl + "classes/update",
                    dataType: "json",
                    data: JSON.stringify({classId: id, officeHours: officeHours}),
                    contentType: "application/json; charset=utf-8",
                    success: function(classInfo){
                        showSuccessPopup('Successfully updated info.');
                        hideLoading();
                    },
                    error : function() {
                        hideLoading();
                        showFailedPopup('Failed to get class info.');
                    }
                });
            });
            handleQuestionAdd();
            handleQuestionTypeChange();
            handleAssignmentAdd();
            showLoading();
            $.ajax({
                type: "GET",
                url: siteUrl + "classes/classInfoProfessor",
                dataType: "json",
                data: JSON.stringify({classId: id}),
                contentType: "application/json; charset=utf-8",
                success: function(classInfo){
                    $('#office-hours').val(classInfo.classInfo.officeHours);
                    for(var i = 0, len = classInfo.items.length; i < len; i++) {
                        var html = "<tr><td><img class='sprite' alt='sprite' src='../images/"+ classInfo.items[i].sprite +"'></td><td>" + classInfo.items[i].className + "</td><td>" + classInfo.items[i].name + "</td><td>" + classInfo.items[i].effect + "</td></tr>";
                        $('tbody').append(html);
                    }

                    hideLoading();
                },
                error : function() {
                    hideLoading();
                    showFailedPopup('Failed to get class info.');
                }
            });
        }
    }
}();