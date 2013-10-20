/**
 * Created with JetBrains WebStorm.
 * User: guidokersten
 * Date: 11-10-13
 * Time: 11:34
 * To change this template use File | Settings | File Templates.
 */

// Set the right div visible when the content type selection changes
function contentTypeChanged(elem){
    var divAudio = document.getElementById('divAddContentAudio');
    var divVideo = document.getElementById('divAddContentVideo');
    var divBook = document.getElementById('divAddContentBook');

    if(elem.value == 1) {
        divAudio.style.display = "block";
        divVideo.style.display = "none";
        divBook.style.display = "none";
    }
    else if(elem.value == 2) {
        divAudio.style.display = "none";
        divVideo.style.display = "block";
        divBook.style.display = "none";
    }
    else if(elem.value == 3) {
        divAudio.style.display = "none";
        divVideo.style.display = "none";
        divBook.style.display = "block";
    }

    var divAudio = null;
    var divVideo = null;
    var divBook = null;
}