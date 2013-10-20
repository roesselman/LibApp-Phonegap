var userarray = [];
var webpath = "http://www.maichelvanroessel.com/Libapp/";

var whatquery = 0;
insertuser = true;

// Create local database
var db = window.openDatabase("LibApp", "1.0", "Lib app database", 200000);

function initApp(){
    // Wait for PhoneGap to load
    document.addEventListener('deviceready', onDeviceReady, false);

    function onDeviceReady() {
//        showAlert("alert");

        // Setting default page transition to slide
        $.mobile.defaultPageTransition = 'slide';

        // Reset login fields
        /*-------------------- Commented for debug purpoces! --------------------*/
//        $(document.getElementById('page_login')).ready(function() {
//            $('#userMail').val('');
//            $('#userPassword').val('');
//        });

//        $('#page_login').on("pageshow", function (event){
//            $('#userMail').val('');
//            $('#userPassword').val('');
//        });

        // Set the action on click record button
        $('#btnLogout'). on("click", function (event){
            logout();
        });

        // Add event listener to the back button
        document.addEventListener("backbutton", backButtonHandler, false);

        // Custom functions
        checkLoginDataOnSubmit();
        checkRegisterDataOnSubmit();
        checkContentDataOnSubmit();

        $(document.getElementById('page_search')).ready(function() {
            // do stuff when div is ready
            loadContent();
        });
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
                showAlert('Email is empty.');
            }
            else if(password == '' || password == null){
                showAlert('Password is empty.');
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

                            // See if user is already in local storage
                            db.transaction(checkuserexistsDB, errorCB, successTransactionCheckUser);

                            // If not allowed to insert a user get the user from db
                            if(insertuser == false){
                                db.transaction(queryDB, errorCB);
                            }

                            db.transaction(queryDB, errorCB);

                            console.log("Logged in with Id = " + userarray['Id']);

                            // Send user to the home page
                            $.mobile.changePage("#page_search", {
                                transition : "slide"
                            })
                        }
                        else{
                            showAlert('No user found.');
                        }

                    },
                    error: function(xhr, status, errorThrown){
                        // When something goes wrong show error
                        showAlert(errorThrown);
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
        console.log("successCheckUserExists");
        if (!results.rowsAffected) {
            var len = results.rows.length;

            for (var i=0; i<len; i++){
                // When user already exists, don't allow to insert
                if(results.rows.item(i).Id == userarray['Id']){
                    insertuser = false;
                    console.log("Userid " + results.rows.item(i).Id + " already exists, permission denied!");
                }
            }

            // If user doesn't exist put it in database
            if(insertuser == true){
                // Store user in database (local storage)
                db.transaction(populateDB, errorCB, successTransactionPopulate);
            }

            return false;
        }
    }

    // Populate the database
    function populateDB(tx) {
        console.log("populateDB");
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
        console.log("querySuccess");
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
//        showAlert("Error processing SQL: " + err.message);
        console.log("Error processing SQL: " + err.message);
    }

    // Transaction success callback
    //
    function successTransactionCheckUser() {
        // Show all users in database in console.log
        //db.transaction(queryDB, errorCB);
    }

    function successTransactionPopulate() {
        // Show all users in database in console.log
        //db.transaction(queryDB, errorCB);
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
                showAlert('Email is empty.');
            }
            else if(password == '' || password == null){
                showAlert('Password is empty.');
            }
            else if(firstname == '' || firstname == null){
                showAlert('Firstname is empty.');
            }
            else if(lastname == '' || lastname == null){
                showAlert('Lastname is empty.');
            }
            else{
                //showAlert("All correct");
                // Insert the data in database to create a user
                $.ajax({
                    type: "POST",
                    url: webpath + "signup.php",
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
                        showAlert('Uw account is aangemaakt.');

                        // Send user to the home page
                        $.mobile.changePage("#page_login", {
                            transition : "slide"
                        })

                    },
                    error: function(xhr, status, errorThrown){
                        // When something goes wrong show the error
                        showAlert("Exception: " + errorThrown + ", xhr: " + JSON.stringify(xhr) + ", Status: " + status);
                    }
                });
            }

            // return false to prevent the default submit of the form to the server.
            return false;
        });
    }

    // Add content on submit function
    function checkContentDataOnSubmit(){
        // When user submits add content form
        $('#addContentForm').submit(function() {
            // Store form data in variables
            var libraryid = 12;
            var contenttype = $('#selectAddContentType').val();
            var title = $('#etAddContentTitle').val();
            var location = $('#selectAddContentLocation').val();
            var position = $('#etAddContentPosition').val();
            var language = $('#selectAddContentLanguage').val();
            var url = $('#etAddContentURL').val();
            var genre;
            var artist;
            var duration;

            if (contenttype == 1) {
                // Audio
                genre = $('#selectAddContentAudioGenre').val();
                artist = $('#selectAddContentArtist').val();
                duration = $('#etAddContentAudioDuration').val();
            } else if (contenttype == 2) {
                // Video
                genre = $('#selectAddContentVideoGenre').val();
                artist = $('#selectAddContentProducer').val();
                duration = $('#etAddContentVideoDuration').val();
                var actors = $('#selectAddContentActors').val();
                var subtitles = $('#selectAddContentSubtitles').val();
            } else {
                // Book
                genre = $('#selectAddContentBookGenre').val();
                artist = $('#selectAddContentAuthor').val();
                var isbn = $('#etAddContentISBN').val();
            }

            if(title == '' || title == null){
                showAlert('Title is empty.');
            }
            else if(contenttype == '' || contenttype == null){
                showAlert('Contenttype is empty.');
            }
            else if(libraryid == '' || libraryid == null){
                showAlert('Library is empty.');
            }
            else{
                // Insert the data in database to create the conten
                $.ajax({
                    type: "POST",
                    url: webpath + "createcontent.php",
                    cache: false,
                    dataType: "json",
                    data: {
                        LibraryId : libraryid,
                        ContentType : contenttype,
                        Title : title,
                        Location : location,
                        Position : position,
                        Language : language,
                        URL : url,
                        Genre : genre,
                        Artist : artist,
                        Duration : duration,
//                        Actors : actors,
                        Subtitles : subtitles,
                        ISBN : isbn
                    },
                    success: function(phpData){

                        //showAlert("success: " + phpData);

                        // Check what data has been returned
//                        showAlert('Uw account is aangemaakt.');
                    },
                    error: function(xhr, status, errorThrown){
                        // When something goes wrong show the error
                        showAlert("error: " + errorThrown + ", xhr: " + JSON.stringify(xhr) + ", Status: " + status);
                    }
                });
            }

            // return false to prevent the default submit of the form to the server.
            return false;
        });
    }

    function loadContent () {

        // Load all content
        // If right data - put it in the database
        $.ajax({
            type: "POST",
            url: webpath + "getcontent2.php",
            cache: false,
            dataType: "json",
            data: {
                UserId : 10
            },
            success: function(phpData){
                if (phpData['Response code'] == 1) {
                    setupContentList (phpData.Contents);
                } else {
                    showAlert('Something went wrong while loading content: ' + phpData['Response message']);
                    setupContentList ();
                }
            },
            error: function(xhr, status, errorThrown){
                setupContentList ();

                // When something goes wrong show error
                showAlert(errorThrown);
            }
        });
    }

    function setupContentList(contents) {
        var contentlist = $("#contentlist"),
            length = contents.length,
            content = null,
            contentview = null;

        // Clear all content
        contentlist.empty();

        // Add dividers
        contentlist.append("<li data-role='list-divider' id='divider_audio'>Audio</li>");
        contentlist.append("<li data-role='list-divider' id='divider_video'>Video</li>");
        contentlist.append("<li data-role='list-divider' id='divider_book'>Book</li>");

        // Add contents
        for (var i = 0; i < length; i++) {
            content = contents[i];
            contentview = '<li><a href="#page_seeItem" id="1-regina">' +
                          '<h1>' + content.Title + '</h1>' +
                          '<p>' + content.Location + ' [' + content.Position + ']</p>' +
                          '</a></li>';

            if (content.Contenttype == 1) {
                $(contentview).insertAfter('#divider_audio');
            } else if (content.Contenttype == 2) {
                $(contentview).insertAfter('#divider_video');
            } else if(content.Contenttype == 3) {
                $(contentview).insertAfter('#divider_book');
            }
        }

        contentlist = null;
        content = null;
        contentview = null;
        length = null;
    }

    // Show a custom alert
    //
    function showAlert(message) {
        navigator.notification.alert(
            message,  // message
            alertDismissed,         // callback
            'Alert',            // title
            'Ok'                  // buttonName
        );
    }

    // alert dialog dismissed
    function alertDismissed() {
        // do something
    }
}