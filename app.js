document.querySelector("#read-button").addEventListener('click', function() {
	if(document.querySelector("#file-input").files.length == 0) {
		alert('Error : No file selected');
		return;
	}

    //reset display area
    let displayArea = document.getElementById('results');
    displayArea.innerHTML = '';

	// first file selected by user
	var file = document.querySelector("#file-input").files[0];

	// perform validation on file type & size if required

	// read the file
	var reader = new FileReader();

	// file reading started
	reader.addEventListener('loadstart', function() {
	    console.log('File reading started');
	});

	// file reading finished successfully
	reader.addEventListener('load', function(e) {
	   // contents of file in variable     
        var text = e.target.result;
        //HERE RENDER TO JS OBJECT THEN FILTER AND RENDER TO WEBSITE
        

        let messagesObject = JSON.parse(text);

        document.getElementById('users').innerHTML = ` 
        ${messagesObject.participants[0].name} and ${messagesObject.participants[1].name}
        `;
        let callLog = '';
        let callsObject = messagesObject.messages.filter(message => {
           return message.type === 'Call';
        });

        
        callsObject.map(message => {
            callLog = `
            <h3>${message.sender_name}</h3>
            <p>${message.content}</p>
            <p>${message.type}</p>
            <p>Duration: ${message.call_duration}</p>
            <p>Date: ${message.timestamp_ms}</p>
            `;
            displayArea.innerHTML += callLog;
        })
        
         





	    console.log(text);
	});

	// file reading failed
	reader.addEventListener('error', function() {
	    alert('Error : Failed to read file');
	});

	// file read progress 
	reader.addEventListener('progress', function(e) {
	    if(e.lengthComputable == true) {
	    	var percent_read = Math.floor((e.loaded/e.total)*100);
	    	console.log(percent_read + '% read');
	    }
	});

	// read as text file
	reader.readAsText(file);
});