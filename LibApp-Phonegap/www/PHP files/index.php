<?php
		
	$tmpName = $_FILES["file"]["tmp_name"];
	$name = $_FILES["file"]["name"];
	
    move_uploaded_file($tmpName, $name);
	
?>