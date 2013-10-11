var userID = 10;
var webpath = "http://www.maichelvanroessel.com/Libapp/";

function initApp(){
    // Wait for PhoneGap to load
    document.addEventListener('deviceready', onDeviceReady, false);

    function onDeviceReady() {
        // Setting default page transition to slide
        $.mobile.defaultPageTransition = 'slide';

        // Reset login fields
        /*-------------------- Commented for debug purpoces! --------------------*/
        /*$('#page_login').on("pageshow", function (event){
            $('#userMail').val('');
            $('#userPassword').val('');
        });*/

        // Set the action on click record button
        $('#btnLogout'). on("click", function (event){
            logout();
        });

        // Add event listener to the back button
        document.addEventListener("backbutton", backButtonHandler, false);

        // Custom functions
        checkLoginDataOnSubmit();
        checkRegisterDataOnSubmit();
    }

    // Function for back button
    function backButtonHandler(e )
    {
        if($("#page_search").length > 0){
            // Code to exit app
            navigator.app.exitApp();
        }
        /*else if($("#page_login").length > 0){

        }*/
        else{
            // Code to navigate to the history action
            navigator.app.backHistory();
        }
    }

    function logout(){
        history.go(-(history.length - 1));
    }

    // Login on submit function
    function checkLoginDataOnSubmit(){
        // When user submits registration form
        $('#loginForm').submit(function() {
            // Store form data in vars
            var usermail = $('#userMail').val();
            var password = $('#userPassword').val();

            if(usermail == '' || usermail == null){
                alert('Email is empty.');
            }
            else if(password == '' || password == null){
                alert('Password is empty.');
            }
            else{

                // If right data - put it in the database
                $.ajax({
                    type: "POST",
                    url: webpath + "login.php",
                    cache: false,
                    dataType: "json",
                    data: {
                        Email : usermail,
                        Password : password
                    },
                    success: function(phpData){

                        //Save the user id to global var
                        userID = phpData.User.Id;

                        // Check what data has been returned
                        if(userID != null && userID != ''){
                            // Delete login screen

                            // Send user to the home page
                            $.mobile.changePage("#page_search", {
                                transition : "slide"
                            })
                        }
                        else{
                            alert('No user found.');
                        }

                    },
                    error: function(xhr, status, errorThrown){
                        // When something goes wrong show error
                        alert(errorThrown);
                    }
                });
            }

            // return false to prevent the default submit of the form to the server.
            return false;
        });
    }

// Register on submit function
    function checkRegisterDataOnSubmit(){
        // When user submits registration form
        $('#registerForm').submit(function() {
            // Store form data in variables
            var email = $('#userRegEmail').val();
            var password = $('#userRegPassword').val();
            var firstname = $('#userRegFirstname').val();
            var insertion = $('#userRegInsertion').val();
            var lastname = $('#userRegLastname').val();

            if(email == '' || email == null){
                alert('Email is empty.');
            }
            else if(password == '' || password == null){
                alert('Password is empty.');
            }
            else if(firstname == '' || firstname == null){
                alert('Firstname is empty.');
            }
            else if(lastname == '' || lastname == null){
                alert('Lastname is empty.');
            }
            else{
                //alert("All correct");
                // Insert the data in database to create a user
                $.ajax({
                    type: "POST",
                    url: "http://www.maichelvanroessel.com/Libapp/signup.php",
                    cache: false,
                    dataType: "json",
                    data: {
                        Email : email,
                        Password : password,
                        Firstname : firstname,
                        Insertion : insertion,
                        Lastname : lastname
                    },
                    success: function(phpData){
                        // Check what data has been returned
                        alert('Uw account is aangemaakt.');

                        // Send user to the home page
                        $.mobile.changePage("#page_login", {
                            transition : "slide"
                        })

                    },
                    error: function(xhr, status, errorThrown){
                        // When something goes wrong show the error
                        alert("Exception: " + errorThrown + ", xhr: " + JSON.stringify(xhr) + ", Status: " + status);
                    }
                });
            }

            // return false to prevent the default submit of the form to the server.
            return false;
        });
    }
}