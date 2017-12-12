/**
 * @Author: Zaharia Laurentiu Jr Marius
 * @Date:   2017-11-30T09:25:57+01:00
 * @Email:  laurentiu.zaharia@edu.itspiemonte.it
 * @Project: WeatherStation
 * @Filename: script.js
 * @Last modified by:   Zaharia Laurentiu Jr Marius
 * @Last modified time: 2017-12-08T18:04:01+01:00
 */


 //call the function that get the weather data
 getDataFromApi('https://www.torinometeo.org/api/v1/realtime/data/');


/**
 * [selectedItem array that contain all opened accordion and it's heigth]
 * @type {Array}
 *
 */
var selectedItem = [];

function refreshPage(refreshTime) {
	var refreshData = setTimeout(getDataFromApi, refreshTime, 'https://www.torinometeo.org/api/v1/realtime/data/');
}

/**
 * [getApiData get all json weather data from API]
 * @return {[type]} [description]
 */
function getDataFromApi(myUrl) {
	$.ajax({
		url: myUrl,
		type: 'GET',
		dataType: 'JSON',
	})
	.done(function(weatherData) {
		console.log("success");
		console.log(weatherData);
		updateJsonBlob(weatherData);
		//refreshPage(10000);
	})
	.fail(function(error) {
		console.log(error);
		console.log(error.status);
		console.log(error.statusText);
		if (myUrl == 'https://www.torinometeo.org/api/v1/realtime/data/') {
			getDataFromApi('https://jsonblob.com/api/jsonBlob/8f73f269-d924-11e7-a24a-991ece7b105b');
		}
		$('#loading-text').html('Something went wrong.');
		$('#loader').hide();
		//display the error data into page
	})
	.always(function() {
		console.log("ajax call complete");
	});
}

function updateJsonBlob(updatedData) {
	$.ajax({
		url: 'https://jsonblob.com/api/jsonBlob/8f73f269-d924-11e7-a24a-991ece7b105b',
		type: 'PUT',
		data: JSON.stringify(updatedData),
		dataType: 'JSON',
		contentType: 'application/json; charset=utf-8'
	})
	.done(function(weatherData) {
		console.log("Jsonblob updated");
	})
	.fail(function(error) {
		console.log(error);
		console.log(error.status);
		console.log(error.statusText);
		//display the error data into page
	})
	.always(function() {
		console.log("ajax call put complete");
	});
}
