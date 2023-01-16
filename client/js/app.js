document.querySelector('#read-button').addEventListener('click', function () {
  if (document.querySelector('#file-input').files.length == 0) {
    alert('Error : No file selected');
    return;
  }

  //reset display area
  let displayArea = document.getElementById('results');
  displayArea.innerHTML = '';

  // first file selected by user
  let file = document.querySelector('#file-input').files[0];

  // perform validation on file type & size if required

  // read the file
  let reader = new FileReader();

  // file reading started
  reader.addEventListener('loadstart', function () {
    console.log('File reading started');
  });

  // file reading finished successfully
  reader.addEventListener('load', function (e) {
    // contents of file in variable
    var text = e.target.result;
    //HERE RENDER TO JS OBJECT THEN FILTER AND RENDER TO WEBSITE

    document.querySelector('#pdfContent').style.display = 'block';
    document.querySelector('#pdf').style.display = 'inline-block';
    document.querySelector('#step-3').style.display = 'inline-block';

    let messagesObject = JSON.parse(text);

    document.getElementById('users').innerHTML = ` 
        ${messagesObject.participants[0].name} and ${messagesObject.participants[1].name} - Messenger call log history
		`;

    let callLog = '';
    // let callsObject = messagesObject.messages.filter(message => {
    //    return message.type === 'Call';
    // });
    let callsObject = messagesObject.messages.filter((message) => {
      return message.hasOwnProperty('call_duration');
    });

    document.getElementById('records').innerHTML = `
		Total: ${callsObject.length} record(s)
		`;

    callsObject.map((message) => {
      callLog = `
			<tr>
				<td>${getDate(message.timestamp_ms)}</td>
				<td>${getTime(message.timestamp_ms)}</td>
				<td>${message.sender_name}</td>
				<td>${message.content}</td>
				<td>${Math.floor(message.call_duration / 60)} ${
        Math.floor(message.call_duration / 60) === 1 ? 'minute' : 'minutes'
      }</td>
            </tr>
			`;
      displayArea.innerHTML += callLog;
    });

    function msToDate(ms) {
      let date = new Date(ms);
      return date.toString();
    }

    function getDate(ms) {
      return msToDate(ms).slice(4, 10) + ', ' + msToDate(ms).slice(10, 15);
    }

    function getTime(ms) {
      let date = new Date(ms);
      return date.toLocaleTimeString('en-US');
    }
  });

  // file reading failed
  reader.addEventListener('error', function () {
    alert('Error : Failed to read file');
  });

  // file read progress
  reader.addEventListener('progress', function (e) {
    if (e.lengthComputable == true) {
      var percent_read = Math.floor((e.loaded / e.total) * 100);
      console.log(percent_read + '% read');
    }
  });

  // read as text file
  reader.readAsText(file);
});
