function smf_fileUpload(oOptions)
{
	var previewNode = document.querySelector('#au-template');
	previewNode.id = '';
	var previewTemplate = previewNode.parentNode.innerHTML;
	previewNode.parentNode.removeChild(previewNode);

	// Default values in case oOptions isn't defined.
	var dOptions = {
		url: smf_prepareScriptUrl(smf_scripturl) + 'action=uploadAttach;sa=add;' + smf_session_var + '=' + smf_session_id,
		parallelUploads:1,
		filesizeBase:1000,
		paramName: 'attachment',
		uploadMultiple:true,
		addRemoveLinks:false,
		previewsContainer: '#au-previews',
		acceptedFiles: '.doc,.gif,.jpg,.pdf,.png,.txt,.zip',
		thumbnailWidth: 100,
		thumbnailHeight: null,
		parallelUploads: 1,
		previewTemplate: previewTemplate,
		autoQueue: false,
		clickable: '.fileinput-button',
		autoProcessQueue:false,
		fallback: function(file, done) {

			// @todo show the default file input field
		}
	};

	$.extend(true, dOptions, oOptions);

	var myDropzone = new Dropzone('div#attachUpload', dOptions);

	myDropzone.on('thumbnail', function(file) {
	});

	myDropzone.on('addedfile', function(file) {

		// Hookup the start button
		file.previewElement.querySelector('.start').onclick = function() { myDropzone.enqueueFile(file); };

		// Show the main stuff!
		file.previewElement.setAttribute("class", "descbox");
	});

	// Update the total progress bar
	myDropzone.on('totaluploadprogress', function(progress) {
		document.querySelector('#total-progress .progress-bar').style.width = progress + '%';
	});

	myDropzone.on('error', function(file, errorMessage, xhr) {
		// Remove the "start" button.
		file.previewElement.querySelector('.start').remove();

		// Set a nice css class to make it more obvious theres an error.
		file.previewElement.removeAttribute("class", "descbox");
		file.previewElement.setAttribute("class", "errorbox");
	});

	myDropzone.on('success', function(file, responseText, e) {
			var _thisElement = $(file.previewElement);

		// The request was complete but the server returned an error.
		if (typeof(responseText.error) != "undefined"){

			_thisElement.toggleClass("errorbox");

			// Show the server error.
			_thisElement.find('p.error').append(responseText.error);

			// Remove the "start" button.
			_thisElement.find('.start').remove();
		}

		// If there wasn't any error, change the current cover.
		if (responseText.type == 'info'){
			_thisElement.toggleClass("infobox");
		}
	});

	myDropzone.on('complete', function(file) {

		// Doesn't matter what the result was, remove the ajax indicator.
		ajax_indicator(false);
	});

	myDropzone.on('sending', function(file) {

		// Hey! we are actually doing something!
		ajax_indicator(true);

		// Show the total progress bar when upload starts
		document.querySelector('#total-progress').style.opacity = '1';
		// And disable the start button
		file.previewElement.querySelector('.start').setAttribute('disabled', 'disabled');
	});

	// Hide the total progress bar when nothing's uploading anymore
	myDropzone.on('queuecomplete', function(progress) {
		document.querySelector('#total-progress').style.opacity = '0';
	});
}