var fs = require('fs');
var express = require('express');
var multiparty = require('connect-multiparty')();	// Import multiparty.  Note that we execute the returned function to get an instance

var app = express();
app.use(express.static('./public'));
app.use('/uploads', express.static('./uploads'));		// Serve our uploads directory from 'uploads/'
app.listen(8080, function() {
	console.log('Listening on http://localhost:8080');
});

initUploadsDir();										// Check and make sure ./uploads exists, create it if it doesn't


app.post('/upload', multiparty, function(req,res) {		// Use the multiparty middleware
	var file = req.files.file;							// The file object what was uploaded
	console.log('/upload: %j\n', file);					// Show the structure.  Note that we have name, path, size, etc

	var newPath = './uploads/' + file.name;				// Here is where we could rename the file if we wanted to (to make them consistent or assigned to some ID in a database)
	fs.rename(file.path, newPath, function(err) {
		if(err) return res.status(400).json(err);		// Return a 400 error if there was a problem
		res.json(newPath);								// Return the new file path
	});
});


function initUploadsDir() {
	fs.stat('./uploads', function(err,stats) {			// fs.stat() will return an error if the path doesn't exist
		if(!err) return;								// Return if the directory exists
		fs.mkdir('./uploads');							// Otherwise create the uploads directory for us
		console.log('Created uploads/');
	});
}
