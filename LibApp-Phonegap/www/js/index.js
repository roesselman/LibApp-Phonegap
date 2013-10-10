var userarray = [];
var webpath = "http://www.maichelvanroessel.com/Libapp/";

var whatquery = 0;
insertuser = true;

var contentPhoto = '';

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

        $('#page_addcontent').on("pageshow", function (event){
            // Empty photo var
            contentPhotoPhoto = '';
        });

        // Set the action on click record button
        $('#btnLogout'). on("click", function (event){
            logout();
        });

        $('#btnAddPhoto').on("click", function(){
            takephoto();
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

    function takephoto(){
        // Take picture using device camera and retrieve image as base64-encoded string
        navigator.device.capture.captureImage(captureContentImage, captureError);
    }

    function captureContentImage(mediaFiles) {
        //Save the photo
        contentPhoto = mediaFiles[0];
        var photofilename = contentPhoto.name;

        if(photofilename == '' || photofilename == null || contentPhoto.fullPath == ''|| contentPhoto.fullPath == null){
            alert('Er ging wat mis met de foto. Of je hebt geen foto genomen.');
        }else{
            // Upload photo
            uploadCapturedFile('ContentImages/', challengePhoto);
        }
    }

    function uploadCapturedFile(pathextention, item){
        var ft = new FileTransfer(),
            path = item.fullPath,
            name = item.name;

        ft.upload(path,
            webpath + pathextention,
            function(result) {
                console.log('Upload success: ' + result.responseCode);
                //console.log(result.bytesSent + ' bytes sent');
                //alert('Upload image succeeded!');
            },
            function(error) {
                //console.log('Error uploading file ' + path + ': ' + error.code);
                alert('The upload of the image went wrong!');
            },
            { fileName: name }
        );
    }

    function captureError(error) {
        var msg = 'An error occurred during capture: ' + error.code;
        navigator.notification.alert(msg, null, 'Uh oh!');
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
                        console.log("Id = " + userarray['Id']);
                        // Check what data has been returned
                        if(userarray['Id'] != null && userarray['Id'] != ''){
                            // Delete login screen

                            // See if user is already in local storage
                            insertuser == true
                            db.transaction(checkuserexistsDB, errorCB, successCB1);

                            if(insertuser == false){
                                db.transaction(queryDB, errorCB);
                            }

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

    function checkuserexistsDB(tx){
        // Add if table exists!!

        //tx.executeSql('DELETE FROM SM_User');
        tx.executeSql('SELECT Id FROM SM_User', [], successCheckUserExists, errorCB);
    }

    function successCheckUserExists(tx, results){
        if (!results.rowsAffected) {
            var len = results.rows.length;

            //  When no users, allow to insert the user
            /*if(len == 0 || len == null){
                insertuser = true;
                console.log("No user available");
            }*/

            for (var i=0; i<len; i++){
                console.log("Id: " + results.rows.item(i).Id + " == " + userarray['Id']);
                                          3
                // When user doesn't already exists, allow to insert it
                if(results.rows.item(i).Id == userarray['Id']){
                    insertuser = false;
                    console.log("User does exist! Permission denied!");
                }
            }

            // If user doesn't exist put it in database
            if(insertuser == true){
                // Store user in database (local storage)
                db.transaction(populateDB, errorCB, successCB2);
                console.log("Insert user = true.");
            }

            return false;
        }
    }

    // Populate the database
    //
    function populateDB(tx) {
        //console.log("Id = " + userarray['Id'] + ", Email = " + userarray['Email'] + ", Naam = " + userarray['Firstname'] + " " + userarray['Insertion'] + " " + userarray['Lastname']);
        //tx.executeSql('DROP TABLE IF EXISTS SM_User');
        tx.executeSql('CREATE TABLE IF NOT EXISTS SM_User (Id int, Email varchar(50), Firstname varchar(50), Insertion varchar(30), Lastname varchar(50))');
        tx.executeSql('INSERT INTO SM_User VALUES (' + userarray['Id'] + ', "' + userarray['Email'] + '", "' + userarray['Firstname'] + '", "' + userarray['Insertion'] + '", "' + userarray['Lastname'] + '")');

        // In debug phase
        db.transaction(queryDB, errorCB);
    }

    function queryDB(tx) {
        tx.executeSql('SELECT * FROM SM_User', [], querySuccess, errorCB);
    }

    function querySuccess(tx, results) {

        console.log("Returned rows = " + results.rows.length);
        // this will be true since it was a select statement and so rowsAffected was 0
        if (!results.rowsAffected) {
            console.log('No rows affected!');

            // Read result
            var len = results.rows.length;
            console.log("SM_User table: " + len + " rows found.");
            for (var i=0; i<len; i++){


                console.log("Row = " + i + " ID = " + results.rows.item(i).Id + " Naam =  " + results.rows.item(i).Firstname + " " + results.rows.item(i).Insertion + " " + results.rows.item(i).Lastname + ".");
            }

            return false;
        }
        // for an insert statement, this property will return the ID of the last inserted row
        //console.log("Last inserted row ID = " + results.insertId);
    }

    // Transaction error callback
    //
    function errorCB(tx, err) {
        //console.log("What query are we in: " + whatquery);
        console.log("Error processing SQL: " + err.message);
    }

    // Transaction success callback
    //
    function successCB1() {
        alert("Success!");
        // Show all users in database in console.log
        //db.transaction(queryDB, errorCB);
    }

    function successCB2() {
        alert("Success!");
        // Show all users in database in console.log
        db.transaction(queryDB, errorCB);
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