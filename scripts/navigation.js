var Navigation = function() {
    var siteUrl = "http://localhost:8080/";
    var cookieExpiration = 3;
    var cookieName = "classRPG-user";
    var timeLimit = 30;

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

    var handleLogout = function() {
        $('#logout-btn').on('click', function(){
            showLoading();
            Cookies.remove(cookieName);
            setTimeout(function(){ window.location.replace(siteUrl); }, 1500);
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
        html += "<li id='logout-btn'><button class='btn-flat'>Logout</button></li>";
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
            var html = "<section class='z-depth-3 col s12' style='background-color:#f9ede7;margin: 10px 0;'><div class='input-field col s12 m9'><input class='question-description' type='text' placeholder=''><label>Description</label></div>";
            html += "<div class='input-field col s12 m3'><select class='question-type'><option selected value='fill-blank'>Fill in the Blank</option><option value='mult-choice'>Multiple Choice</option>";
            html += "</select><label>Question Type</label></div>";

            //Fill in the blank field
            html += "<div class='input-field fill-blank-answer col s12'><input type='text' placeholder=''><label>Answer</label></div>";

             var id = $('#assignment-questions').children().length;

            //Multiple choice fields
            html += "<div class='mult-choices-options' style='display:none;'><div class='col s12'><h6>Correct Answer</h6></div><div class='input-field col s12 m3'><input class='check1' name='group" + id + "' type='radio' id='option1-" + id + "'/><label for='option1-" + id + "'>Option 1</label></div>";
            html += "<div class='input-field col s12 m3'><input class='check2' name='group" + id + "' type='radio' id='option2-" + id + "'/><label for='option2-" + id + "'>Option 2</label></div>";
            html += "<div class='input-field col s12 m3'><input class='check3' name='group" + id + "' type='radio' id='option3-" + id + "'/><label for='option3-" + id + "'>Option 3</label></div>";
            html += "<div class='input-field col s12 m3'><input class='check4' name='group" + id + "' type='radio' id='option4-" + id + "'/><label for='option4-" + id + "'>Option 4</label></div>";
            html += "<div class='input-field margin-top-25 col s12 m3'><input class='choice1' type='text' placeholder=''><label>Option 1 </label></div>";
            html += "<div class='input-field margin-top-25 col s12 m3'><input class='choice2' type='text' placeholder=''><label>Option 2 </label></div>";
            html += "<div class='input-field margin-top-25 col s12 m3'><input class='choice3' type='text' placeholder=''><label>Option 3 </label></div>";
            html += "<div class='input-field margin-top-25 col s12 m3'><input class='choice4' type='text' placeholder=''><label>Option 4 </label></div></div>";

            html += "</section>";
            $('#assignment-questions').append(html);
            $('select.question-type').on('change', function(){
                var selected = $(this).parent().find('ul').find('li.active').find('span').text();
                if(selected == "Fill in the Blank") {
                    $(this).parent().parent().parent().find('.fill-blank-answer').fadeIn()
                    $(this).parent().parent().parent().find('.mult-choices-options').fadeOut()
                }
                else {
                    $(this).parent().parent().parent().find('.mult-choices-options').fadeIn()
                    $(this).parent().parent().parent().find('.fill-blank-answer').fadeOut()
                }
            }).material_select();        
            $.each($('div.question-type'), function(){
                $(this).find('ul.select-dropdown').find('li')[0].className += 'active ';
                $(this).find('ul.select-dropdown').find('li')[0].className += 'selected';
            });
        });
    };

    var handleAssignmentAdd = function() {
        $('#add-assignment-btn').on('click', function(e){
            e.preventDefault();
            var questions = [];
            var assignmentName = $('#assignment-name').val();
            var assignmentDescription = $('#assignment-description').val();
            var startDate = $('#assignment-start-date').val();
            var endDate = $('#assignment-end-date').val();

            if(assignmentName.length == 0) {
                showFailedPopup("Assigment needs a name.");
                return;
            }

            if(assignmentDescription.length == 0) {
                showFailedPopup("Assigment needs a description.");
                return;
            }

            if(startDate.length == 0) {
                showFailedPopup("Assigment needs a start date.");
                return;
            }

            if(endDate.length == 0) {
                showFailedPopup("Assigment needs an end date.");
                return;
            }

            if($('#assignment-questions').children().length == 0) {
                showFailedPopup("Assigment needs at least one description.");
                return;
            }

            $.each($('#assignment-questions').children(), function(){
                var question = {};
                var description = $(this).find('.question-description').val();

                if(description.length == 0) {
                    showFailedPopup("All questions must have a description.");
                    return;
                }

                 var type = $(this).find('ul.select-dropdown').find('li.active').find('span').text();
                 question.description = description;
                 question.type = type;
                 if(type == "Fill in the Blank") {
                     var fillAnswer = $(this).find('.fill-blank-answer').find('input').val();
                     if(fillAnswer.length == 0) {
                        showFailedPopup("All fill in the blank questions must have an answer.");
                        return;
                    }
                     question.fill_blank_answer = fillAnswer;
                 }
                 else {
                    var option1 = $(this).find('.mult-choices-options').find('.check1').is(':checked');
                    var option2 = $(this).find('.mult-choices-options').find('.check2').is(':checked');
                    var option3 = $(this).find('.mult-choices-options').find('.check3').is(':checked');
                    var option4 = $(this).find('.mult-choices-options').find('.check4').is(':checked');
                    if(option1) {
                        question.correct_choice = '1';
                    }  
                    else if(option2) {
                        question.correct_choice = '2';
                    }  
                    else if(option3) {
                        question.correct_choice = '3';
                    }  
                    else {
                        question.correct_choice = '4';
                    }  

                    var choice1 = $(this).find('.mult-choices-options').find('.choice1').val();
                    var choice2 = $(this).find('.mult-choices-options').find('.choice2').val();
                    var choice3 = $(this).find('.mult-choices-options').find('.choice3').val();
                    var choice4 = $(this).find('.mult-choices-options').find('.choice4').val();

                    if(choice1.length == 0 || choice2.length == 0 || choice3.length == 0 || choice4.length == 0) {
                        showFailedPopup("All multiple choice questions must have four options.");
                        return;
                    }
                    question.choice1 = choice1;
                    question.choice2 = choice2;
                    question.choice3 = choice3;
                    question.choice4 = choice4;
                 }
                 questions.push(question);
            });
            if(questions.length == $('#assignment-questions').children().length) {
                var url = new URL(window.location.href);
                var id = url.searchParams.get("classId");
                var assignment = { classId: id, questions: questions};

                showLoading();
                $.ajax({
                    type: "POST",
                    url: siteUrl + "classes/addAssignment",
                    dataType: "json",
                    data: JSON.stringify(assignment),
                    contentType: "application/json; charset=utf-8",
                    success: function(classInfo){
                        showSuccessPopup('Successfully added assignment.');
                        setTimeout(function(){ location.reload(); }, 1500);
                    },
                    error : function() {
                        hideLoading();
                        showFailedPopup('Failed to add assignment.');
                    }
                });
            }
        });
    };

    var handleQuestionsHtml = function(questions){
        for(i = 0; i < questions.length; i++) {
            var html = "<div data-type='"+ questions[i].type +"' class='col l12 m12 s12'><section class='card grey lighten-3 z-depth-4'><div class='card-content'><span class='card-title bold'>" + (i+1) +"." + questions[i].description + "</span><div class='row'>";
            if(questions[i].type === "fill-blank") {
                html += "<div class='input-field fill-blank-answer col s12'><input type='text' placeholder=''><label>Answer</label></div>";
            }
            else {
                html += "<div class='mult-choices-options'><div class='input-field col s12 m3'><input class='check1' name='group" + i + "' type='radio' id='option1-" + i + "'/><label for='option1-" + i + "'>" + questions[i].choice1 + "</label></div>";
                html += "<div class='input-field col s12 m3'><input class='check2' name='group" + i + "' type='radio' id='option2-" + i + "'/><label for='option2-" + i + "'>" + questions[i].choice2 + "</label></div>";
                html += "<div class='input-field col s12 m3'><input class='check3' name='group" + i + "' type='radio' id='option3-" + i + "'/><label for='option3-" + i + "'>" + questions[i].choice3 + "</label></div>";
                html += "<div class='input-field col s12 m3'><input class='check4' name='group" + i + "' type='radio' id='option4-" + i + "'/><label for='option4-" + i + "'>" + questions[i].choice4 + "</label></div>"
            }
            html += "</div></div></section></div>";
            $('#assignment-questions').append(html);
        }
    };

    var submitAssignment = function() {
        showLoading();
        var answers = [];
        $.each($('#assignment-questions').children(), function(){
            var answer = {};
            if($(this).data("type")==="fill-blank") {
                answer.type = "fill-blank";
                answer.answer = $(this).find('.fill-blank-answer').find('input').val();
            }
            else {
                answer.type = "mult-choice";
                var option1 = $(this).find('.mult-choices-options').find('.check1').is(':checked');
                var option2 = $(this).find('.mult-choices-options').find('.check2').is(':checked');
                var option3 = $(this).find('.mult-choices-options').find('.check3').is(':checked');
                var option4 = $(this).find('.mult-choices-options').find('.check4').is(':checked');
                if(option1) {
                    answer.answer = '1';
                }  
                else if(option2) {
                    answer.answer = '2';
                }  
                else if(option3) {
                    answer.answer = '3';
                }  
                else {
                    answer.answer = '4';
                }  
            }
            answers.push(answer);
        });

        var url = new URL(window.location.href);
        var classId = url.searchParams.get("classId");
        var assignmentId = url.searchParams.get("assignmentId");
        var userId = JSON.parse(Cookies.get(cookieName))._id;
        
        $.ajax({
            type: "POST",
            url: siteUrl + "classes/submitAssignment",
            dataType: "json",
            data: JSON.stringify({classId: classId, assignmentId: assignmentId, userId: userId, answers: answers}),
            contentType: "application/json; charset=utf-8",
            success: function(){
                showSuccessPopup('Assignment submitted!');
                setTimeout(function(){ 
                    window.location = siteUrl + "classes/class?userId=" + userId + "&classId=" + classId;
                }, 1500);
            },
            error : function() {
                hideLoading();
                showFailedPopup('Failed to submit assignment.');
            }
        });
    };

    var handleAssignmentTimer = function() {
        var later = new Date(new Date().getTime() + timeLimit*60000);
        var x = setInterval(function() {
            var now = new Date().getTime();
            var distance = later - now;
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            if (distance == 0) {
                clearInterval(x);
                showFailedPopup("Time limit exceeded.");
                submitAssignment();
                $('.timer').fadeOut();
            }
            else if (distance > 0) {
                $('.timer').html(minutes+":"+seconds);
            }
        }, 1000);
    };

	return {
        InitLogin: function () {
            //verifyLogin();
            handleLogout();
        	handleLogin();
        },
        InitRegister: function() {
            handleRegister();
            handleLogout();
        },
        ForceLogin : function() {
            if(!Cookies.get(cookieName))
            {
                //Not Logged in
                Cookies.set('error', {message: "You must be logged in to view that page."}, {expires: 1})         
                window.location = siteUrl + "user/login";
            }
            replaceLoginStuff();
            handleLogout();
        },
        GoToHome: function() {
            window.location = siteUrl;
        },
        VerifyLogin: function() {
            if(Cookies.get(cookieName))
            {
                replaceLoginStuff();
                handleLogout();
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
            handleLogout();
            var user = JSON.parse(Cookies.get(cookieName));
            $('#username').val(user.username);
            $('#name').val(user.name);
            $('#email').val(user.email);
            $('#student-id').val(user.studentId);

            $('#username').attr('disabled', 'disabled');
            $('#name').attr('disabled', 'disabled');
            $('#email').attr('disabled', 'disabled');
            $('#student-id').attr('disabled', 'disabled');

            $('#profile-btn').on('click', function(e){
                e.preventDefault();
                debugger;
                showLoading();
                var password = $('#password').val();
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
                debugger;
                $.ajax({
                type: "POST",
                url: siteUrl + "user/profile",
                dataType: "json",
                data: JSON.stringify({username: JSON.parse(Cookies.get(cookieName)).username, password: password}),
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
            handleLogout();
            showLoading();
            $.ajax({
                type: "POST",
                url: siteUrl + "classes/getClasses",
                dataType: "json",
                data: Cookies.get(cookieName),
                contentType: "application/json; charset=utf-8",
                success: function(classes){
                    console.log(classes);
                    for(var i = 0, len = classes.length; i < len; i++) {
                        var html = "<tr class='data-row' data-id='" + classes[i]._id +"'><td>" + classes[i].name + "</td><td>" + classes[i].code + "</td><td>" + classes[i].professor.name + "</td></tr>";
                        $('tbody').append(html);
                    }
                    hideLoading();
                    $('.data-row').on('click', function(){
                        var user = JSON.parse(Cookies.get(cookieName));
                        window.location = siteUrl + "classes/class?userId=" + user._id + "&classId=" + $(this).data('id');
                    });
                },
                error : function() {
                    hideLoading();
                    showFailedPopup('Failed to get classes.');
                }
            });
        },
        InitInventory: function() {
            handleLogout();
            showLoading();
            var user = Cookies.get(cookieName);
            $.ajax({
                type: "POST",
                url: siteUrl + "user/getInventory",
                dataType: "json",
                data: user,
                contentType: "application/json; charset=utf-8",
                success: function(inventory){
                    for(var i = 0, len = inventory.length; i < len; i++) {
                        var html = "<tr><td><img class='sprite' alt='sprite' src='../images/"+ inventory[i].sprite +"'></td><td>" + inventory[i].className + "</td><td>" + inventory[i].name + "</td><td>" + inventory[i].effect + "</td></tr>";
                        $('tbody').append(html);
                    }
                    $('#coins').text(JSON.parse(user).gold);
                    hideLoading();
                },
                error : function(data) {
                    hideLoading();
                    showFailedPopup('Failed to get inventory.');
                }
            });
        },
        InitClassStudent: function() {
            handleLogout();
            showLoading();
            $('.modal').modal();
            var url = new URL(window.location.href);
            var id = url.searchParams.get("classId");
            $.ajax({
                type: "GET",
                url: siteUrl + "classes/classInfoStudent",
                dataType: "json",
                data: {classId: id},
                contentType: "application/json; charset=utf-8",
                success: function(classInfo){
                    $('.class-name').text(classInfo.name);
                    $('.class-professor').text(classInfo.professor.name);
                    $('.class-office').text(classInfo.professor.office);
                    $('.class-office-hours').text(classInfo.officeHours);
                },
                error : function() {
                    showFailedPopup('Failed to get class info.');
                }
            });

            $.ajax({
                type: "GET",
                url: siteUrl + "classes/assignments",
                dataType: "json",
                data: {classId: id, userId: JSON.parse(Cookies.get(cookieName))._id},
                contentType: "application/json; charset=utf-8",
                success: function(assignments){
                    for(var i = 0, len = assignments.length; i < len; i++) {
                        var html = "<tr><td>" + assignments[i].name + "</td><td>" + assignments[i].description + "</td><td>" + assignments[i].startDate + "</td><td>" + assignments[i].endDate + "</td><td><button data-id='" + assignments[i].assignmentId + "' class='complete-assignment right btn teal'>Take assignment</button></td></tr>";
                        if(!assignments[i].hasTaken) {
                            $('tbody.assignments-not-taken-table').append(html);
                        }
                    }
                    $('.complete-assignment').on('click', function(){
                        $('#start-btn').data('id', $(this).data('id'));
                        $('#start-assignment').modal('open');
                        $('#start-btn').on('click', function(){
                            var user = JSON.parse(Cookies.get(cookieName));
                            window.location = siteUrl + "classes/assignment?&classId=" + id + "&assignmentId=" + $(this).data('id');
                        });
                    });
                },
                error: function(e){
                    showFailedPopup('Failed to get class assignments.');
                }
            });

            $.ajax({
                type: "GET",
                url: siteUrl + "classes/whatHasTaken",
                dataType: "json",
                data: {classId: id, userId: JSON.parse(Cookies.get(cookieName))._id},
                contentType: "application/json; charset=utf-8",
                success: function(assignments){
                    for(var i = 0, len = assignments.length; i < len; i++) {
                        var html = "<tr><td>" + assignments[i].assignmentName + "</td><td>" + assignments[i].grade + "</td><td>" + assignments[i].itemEffect + "</td></tr>";
                        $('tbody.assignments-taken-table').append(html);
                    }
                    hideLoading();
                },
                error: function(e){
                    hideLoading();
                    showFailedPopup('Failed to get class assignments.');
                }
            });
        },
        InitClassProfessor: function() {
            handleLogout();
            var url = new URL(window.location.href);
            var id = url.searchParams.get("classId");
            $('.datepicker').pickadate();
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

                showLoading();
                var item = {name: name, effect: effect, sprite: sprite, classId: id};
                $.ajax({
                    type: "POST",
                    url: siteUrl + "classes/addItem",
                    dataType: "json",
                    data: JSON.stringify(item),
                    contentType: "application/json; charset=utf-8",
                    success: function(classInfo){
                        showSuccessPopup('Successfully added item.');
                        setTimeout(function(){ location.reload(); }, 1500);
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
            handleAssignmentAdd();
            showLoading();
            $.ajax({
                type: "GET",
                url: siteUrl + "classes/classInfoProfessor",
                dataType: "json",
                data: {classId: id},
                contentType: "application/json; charset=utf-8",
                success: function(classInfo){
                    $('#office-hours').val(classInfo.classInfo.officeHours);
                    for(var i = 0, len = classInfo.items.length; i < len; i++) {
                        var html = "<tr><td><img class='sprite' alt='sprite' src='../images/"+ classInfo.items[i].sprite +"'></td><td>" + classInfo.items[i].className + "</td><td>" + classInfo.items[i].name + "</td><td>" + classInfo.items[i].effect + "</td></tr>";
                        $('tbody.items-table').append(html);
                    }

                    $.ajax({
                        type: "GET",
                        url: siteUrl + "classes/assignments",
                        dataType: "json",
                        data: {classId: id, userId: JSON.parse(Cookies.get(cookieName))._id},
                        contentType: "application/json; charset=utf-8",
                        success: function(assignments){
                            for(var i = 0, len = assignments.length; i < len; i++) {
                                var html = "<tr><td>" + assignments[i].name + "</td><td>" + assignments[i].description + "</td><td>" + assignments[i].startDate + "</td><td>" + assignments[i].endDate + "</td><td><button data-id='" + assignments[i].assignmentId + "' class='view-taken btn teal'>Grades</button> <button data-id='" + assignments[i].assignmentId + "' class='delete-assignment btn red'>Delete</button></td></tr>";
                                $('tbody.assignments-table').append(html);
                            }
                            $('.view-taken').on('click', function(e){
                                e.preventDefault();
                                var assignmentId = $(this).data('id');
                                var userId = JSON.parse(Cookies.get(cookieName))._id;
                                showLoading();
                                $.ajax({
                                        type: "GET",
                                        url: siteUrl + "classes/whoHasTaken",
                                        dataType: "json",
                                        data: {classId: id, userId: userId, assignmentId: assignmentId},
                                        contentType: "application/json; charset=utf-8",
                                        success: function(assignments){
                                            $('tbody.students-table').html('');
                                            for(var i = 0, len = assignments.length; i < len; i++) {
                                                var html = "<tr><td>" + assignments[i].name + "</td><td>" + assignments[i].studentId + "</td><td>" + assignments[i].grade + "</td><td>" + assignments[i].itemEffect + "</td></tr>";
                                                $('tbody.students-table').append(html);
                                            }
                                            hideLoading();
                                            $('#students-modal').modal('open');
                                        },
                                        error: function(){
                                            hideLoading();
                                            showFailedPopup('Failed to get class assignments.');
                                        }
                                    });
                            });
                            $('.delete-assignment').on('click', function(){
                                showLoading();
                                $.ajax({
                                    type: "POST",
                                    url: siteUrl + "classes/deleteAssignment",
                                    dataType: "json",
                                    data: JSON.stringify({classId: id, userId: JSON.parse(Cookies.get(cookieName))._id}),
                                    contentType: "application/json; charset=utf-8",
                                    success: function(){
                                        showSuccessPopup('Assignment deleted!');
                                        setTimeout(function(){ location.reload(); }, 1500);
                                    },
                                    error: function(){
                                        hideLoading();
                                        showFailedPopup('Failed to delete assignment.');
                                    }
                                });
                            });
                            hideLoading();
                        },
                        error: function(e){
                            hideLoading();
                            showFailedPopup('Failed to get class assignments.');
                        }
                    });
                },
                error : function() {
                    hideLoading();
                    showFailedPopup('Failed to get class info.');
                }
            });
        },
        InitStartAssignment: function() {
            handleLogout();
            $('.modal').modal();
            showLoading();
            var url = new URL(window.location.href);
            var classId = url.searchParams.get("classId");
            var assignmentId = url.searchParams.get("assignmentId");
            $.ajax({
                type: "GET",
                url: siteUrl + "classes/assignmentQuestions",
                dataType: "json",
                data: JSON.stringify({classId: classId, assignmentId: assignmentId}),
                contentType: "application/json; charset=utf-8",
                success: function(assignmentInfo){
                    $('.assignment-name').text(assignmentInfo.assignmentName);
                    $('.assignment-description').text(assignmentInfo.assignmentDescription);
                    handleQuestionsHtml(assignmentInfo.questions);
                    handleAssignmentTimer();
                    hideLoading();
                },
                error : function() {
                    hideLoading();
                    showFailedPopup('Failed to get assignment info.');
                }
            });
            handleAssignmentTimer();
            $('#submit-btn').on('click', function(){
                submitAssignment();
            });
        }
    }
}();