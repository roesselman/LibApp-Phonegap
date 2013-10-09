var userarray = [];
var webpath = "http://www.maichelvanroessel.com/Libapp/";

var whatquery = 0;

// Create local database
var db = window.openDatabase("LibApp", "1.0", "Lib app database", 200000);

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
        /*if($("#page_search").length > 0){
            // Code to exit app
            navigator.app.exitApp();
        }
        else{*/
            // Code to navigate to the history action
            navigator.app.backHistory();
        //}
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

                        // Save the user
                        userarray['Id'] = phpData.User.Id;
                        userarray['Email'] = phpData.User.Email;
                        userarray['Firstname'] = phpData.User.Firstname;
                        userarray['Insertion'] = phpData.User.Insertion;
                        userarray['Lastname'] = phpData.User.Lastname;

                        // Check what data has been returned
                        if(userarray['Id'] != null && userarray['Id'] != ''){
                            // Delete login screen

                            // Store user in database (local storage)
                            db.transaction(populateDB, errorCB, successCB);
                            //db.transaction(queryDB, errorCB);

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

    // Populate the database
    //
    function populateDB(tx) {
        whatquery = 1;

        //tx.executeSql('DROP TABLE IF EXISTS SM_Users');
        //console.log("Trying to create table");
        tx.executeSql('USE LibApp;');
        tx.executeSql('CREATE TABLE IF NOT EXISTS SM_User (Id int, Email varchar(50), Firstname varchar(50), Insertion varchar(30), Lastname varchar(50));');
        //console.log("Created table");

        tx.executeSql('INSERT INTO SM_User (Id, Email, Firstname, Insertion, Lastname) VALUES (' + userarray['Id'] + ', "' + userarray['Email'] + '", "' + userarray['Firstname'] + '", "' + userarray['Insertion'] + '", "' + userarray['Lastname'] + '");');
        console.log("Created table");
        console.log("Inserted user");
        return true;
    }

    function queryDB(tx) {
        whatquery = 2;
        //console.log("Trying to use database.");
        //tx.executeSql('USE LibApp;');
        //console.log("Using database...");
        //console.log("Trying to select all from SM_User table...");
        //tx.executeSql('SELECT * FROM SM_User;', [], querySuccess, errorCB);
        //console.log("Selected * from SM_User!");
        return true;
    }

    function querySuccess(tx, results) {
        whatquery = 3;
        //console.log("Query is trying to work.");

        console.log("Returned rows = " + results.rows.length);

        // this will be true since it was a select statement and so rowsAffected was 0
        if (!results.rowsAffected) {
            console.log('No rows affected!');
            return false;
        }

        // for an insert statement, this property will return the ID of the last inserted row
        //console.log("Last inserted row ID = " + results.insertId);
        //alert("Trying to read results");
        var len = results.rows.length;

        for (var i=0; i<len; i++){
            //console.log("Row = " + i + " ID = " + results.rows.item(i).id + " Data =  " + results.rows.item(i).data);
            alert("User: " + results.rows.item(i).Firstname + " " + results.rows.item(i).Insertion + " " + results.rows.item(i).Lastname);
        }

        console.log("Read results!");

        //return true;
    }

    // Transaction error callback
    //
    function errorCB(tx, error) {
        console.log("What query are we in: " + whatquery);
        console.log("Error processing SQL: " + error);
    }

    // Transaction success callback
    //
    function successCB() {
        alert("success!");
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