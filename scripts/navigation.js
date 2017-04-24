var Navigation = function() {
    var siteUrl = "http://localhost:8080/";
    var cookieExpiration = 3;
    var cookieName = "classRPG-user";

    var showFailedPopup = function(message) {
        Materialize.toast(message, 3000, 'red-bg')
    };

	var handleLogin = function(){
		$('#login-btn').on('click', function(e){
			e.preventDefault();

			var data = { username: $('#username').val(), password: $('#password').val()};
            console.log(data);
			$.ajax({
            type: "POST",
            url: siteUrl + "user/login",
            dataType: "json",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                //set cookie
                Cookies.set(cookieName, data, { expires: cookieExpiration});
            	window.location.replace(siteUrl);
			},
            error : function() {
                showFailedPopup("Either email or password was incorrect.");
                $('#login-form')[0].reset();
            }
            });
		});
	};

    var replaceLoginStuff = function() {
        //Remove login/register buttons
        var html = "<li><a href='/user/profile'><img class='profile-pic thumbnail right circle' src='http://kingofwallpapers.com/picture/picture-018.jpg'/>"+ JSON.parse(Cookies.get(cookieName)).username +"</a></li>";
        $('.user-info').html(html);
    };

	return {
        InitLogin: function () {
            //verifyLogin();
        	handleLogin();
        },
        ForceLogin : function() {
            if(!Cookies.get(cookieName))
            {
                //Not Logged in
                Cookies.set('error', {message: "You must be logged in to view that page."}, {expires: 1})         
                window.location = siteUrl;
            }
            replaceLoginStuff();
        },
        VerifyLogin: function() {
            if(Cookies.get(cookieName))
            {
                replaceLoginStuff();
            }
        },
        VerifyError: function() {
            if(Cookies.get('error'))
            {
                var text = JSON.parse(Cookies.get('error')).message;
                Materialize.toast(text, 3000, 'red-bg')
                Cookies.remove('error');
            }
        }
    }
}();