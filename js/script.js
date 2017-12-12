/**
 * @Author: Zaharia Laurentiu Jr Marius
 * @Date:   2017-11-30T09:25:57+01:00
 * @Email:  laurentiu.zaharia@edu.itspiemonte.it
 * @Project: WeatherStation
 * @Filename: script.js
 * @Last modified by:   Zaharia Laurentiu Jr Marius
 * @Last modified time: 2017-12-08T18:04:01+01:00
 */

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
		$('#accordionContainer').empty();
		getLastUpdate();
		createAccordions(weatherData);
		//addEventListenerToAccordion();
		$('#loading').fadeOut('slow');
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

/**
 * [createAccordions function that create all accordion for how many weather detections returns]
 * @param  {[Array]} weatherData [all detections received]
 * @return {[type]}             [description]
 */
function createAccordions(weatherData) {
	for (var item in weatherData) {
		if (weatherData.hasOwnProperty(item)) {
			createAccordion(weatherData[item]);
		}
	}
}

/**
 * [createAccordion function that create the accordion div]
 * @param  {[Object]} singleWeatherData [object that contain sigle weather data]
 * @return {[type]}                   [description]
 */
function createAccordion(singleWeatherData) {
	/**
	 * [accordionContainer call from DOM accordionContainer div]
	 * @type {[type]}
	 */
	var accordionContainer = $('#accordionContainer');

	/**
	 * [accordionDiv that contain the header and body]
	 * @type {[type]}
	 */
	var accordionDiv = $('<div></div>').addClass('accordion');

	/**
	 * [headerAccordionDiv is the header of accordion]
	 * @type {[type]}
	 */
	var headerAccordionDiv = craeteHeaderAccordion(singleWeatherData);
	/**
	 * [bodyAccordionDiv is the body of accordion]
	 * @type {[type]}
	 */

	//append the header and body to accordion
	accordionDiv.append(headerAccordionDiv);
	//append accordion to container
	accordionContainer.append(accordionDiv);

	// var index = accordionDiv.index('.accordion');
	// if(checkIfAccordionIsOpen(index)) {
	// 	createBodyAccordionEventListener(headerAccordionDiv, singleWeatherData);
	// }
}

/**
 * [craeteHeaderAccordion function that create the header div of accordion div]
 * @param  {[Object]} singleWeatherData [object that contain sigle weather data]
 * @return {[type]}                   [header div]
 */
function craeteHeaderAccordion(singleWeatherData) {
	/**
	 * [headerAccordionDiv create headerAccordionDiv that contain the main informations]
	 * @type {[type]}
	 */
	var headerAccordionDiv = $('<div></div>').addClass('headerAccordion');

	/**
	 * [nationFlag create nationFlag]
	 * @type {[type]}
	 */
	var nationFlag = getFlagImage(singleWeatherData);


	var stationName = $('<p>' + singleWeatherData.station.name + '</p>').addClass('stationName');

	var weatherIcon = getWeatherIcon(singleWeatherData);


	var temperature = $('<p>' +  checkIfNull(temperature,singleWeatherData.temperature) + '</p>');
	temperature.addClass('temperature');
	formatTemp(singleWeatherData.temperature, temperature);

	var temperatureMax = checkIfNull(temperatureMax,singleWeatherData.temperature_max);
	var temperatureMin = checkIfNull(temperatureMin,singleWeatherData.temperature_min);
	var relativeHumidity = checkIfNull(relativeHumidity, singleWeatherData.relative_humidity);
	var windStrength = checkIfNull(windStrength,singleWeatherData.wind_strength);

	headerAccordionDiv.html("Max: " + temperatureMax + " Min: " +
						temperatureMin + ", umidità: " + relativeHumidity
						+ ", vento: " + windStrength).prepend(nationFlag,
						stationName).append(weatherIcon, temperature);

	headerAccordionDiv.click(function(event) {
		if (checkIfBodyAccordionNotExist($(this))) {
			createBodyAccordionEventListener($(this), singleWeatherData);
			// selectedItem[$(this).index('.headerAccordion')] = "bella";
			// console.log("id di quello aperto: " + selectedItem);
			// console.log(selectedItem);
		}
		applyBodyAccordionAnimation($(this));
	});
	return headerAccordionDiv;
}

/**
* [checkIfBodyAccordionExist function that check if the requested body already exist]
* @param  {[type]} header [header element clicked]
* @return {[type]}        [description]
*/
function checkIfBodyAccordionNotExist(header) {
	var flag = false;
	if (header.next('.bodyAccordion').length == 0) {
		flag = true;
	}
	return flag;
}

/**
* [createBodyAccordionEventListener function that create a body of the accordion header clicked and append it to accordion]
* @param  {jQuery|HTMLElement} header            [header clicked]
* @param  {[Object]} singleWeatherData [single weather object]
* @return {[type]}                   [description]
*/
function createBodyAccordionEventListener(header, singleWeatherData, dim) {
	var index = header.index('.headerAccordion');
	console.log(index);
	var bodyAccordionDiv = createBodyAccordion(singleWeatherData);
	//bodyAccordionDiv[0].style.maxHeight = dim;
	$('.accordion')[index].append(bodyAccordionDiv[0]);
	var slideshowContainer = bodyAccordionDiv.children('.slideshow-container');
	console.log(slideshowContainer);
	applySlideshowAnimation(0, slideshowContainer, 5000);
}

/**
 * [applyBodyAccordionAnimation function that aplly the animation on body]
 * @param  {[type]} header [header element clicked]
 * @return {[type]}        [description]
 */
function applyBodyAccordionAnimation(header) {
	var bodyAccordion = header.next('.bodyAccordion');
	console.log("bodyAccordion");
	console.log(bodyAccordion.prop("scrollHeight"));
		if(bodyAccordion[0].style.maxHeight) {
			bodyAccordion[0].style.maxHeight = null;
		}else {
			bodyAccordion[0].style.maxHeight = bodyAccordion[0].scrollHeight + "px";
		}
}

/**
 * [createBodyAccordion function that create the body div of accordion div]
 * @param  {[Object]} singleWeatherData [object that contain sigle weather data]
 * @return {[type]}                   [body div]
 */

function createBodyAccordion(singleWeatherData) {
	/**
	 * [bodyAccordionDiv create bodyAccordionDiv that contain the descriptions]
	 * @type {[type]}
	 */
	var bodyAccordionDiv = $('<div></div>').addClass('bodyAccordion');
	var pLocation = $('<p> Località: ' + singleWeatherData.station.city + ' in provincia di ' + singleWeatherData.station.province.name + ', ' + singleWeatherData.station.region.name + ' in ' + singleWeatherData.station.nation.name + '  </p>');
	var imageWebcam = getWebcamImage(singleWeatherData);
	var pClimate = $('<p> Clima: ' + singleWeatherData.station.climate + '</p>')
	var pDescription = $("<p> Descrizione della stazione: " + singleWeatherData.station.description + "</p>");
	var linkMaps = $("<a>").attr('href', 'https://www.google.it/maps/place/' + singleWeatherData.station.name + '/@'
				+ singleWeatherData.station.lat + ',' + singleWeatherData.station.lng);
	linkMaps.html('Vedi sulla mappa');

	var slideshow = getSlideshow(singleWeatherData);
	console.log(slideshow[0]);

	bodyAccordionDiv.append(pLocation, slideshow, linkMaps);
	return bodyAccordionDiv;
}

/**
* [getMeteoGrammerImage function that get the meteoGrammerImage, parsed the json string between node elements]
* @param  {[type]} singleWeatherData [object that contain sigle weather data]
* @return {[type]}                   [return the img DOM element]
*/
function getMeteoGrammerImage(singleWeatherData) {
	var descriptionString = singleWeatherData.station.description;
	var htmlElements = $.parseHTML(descriptionString);
	var meteoGrammerImage = $('<img></img>');
	$.each(htmlElements, function(i, el) {
		var a = $(el).children();
		console.log(a);
		if (a.hasClass('lightbox-image')) {
			console.log(a.attr('href'));
			meteoGrammerImage.attr('src', a.attr('href'));
		}
	});
	return meteoGrammerImage;
}

/**
 * [getStationImage function that return the img DOM element]
 * @param  {[type]} singleWeatherData [object that contain sigle weather data]
 * @return {[type]}                   [description]
 */
function getStationImage(singleWeatherData) {
	var stationImage = $('<img></img>').attr('src', singleWeatherData.station.image_url);
	return stationImage;
}

/**
 * [getFlagImage function that return the image element containing image flag]
 * @param  {[Object]} singleWeatherData [object that contain sigle weather data]
 * @return {[type]}                   [description]
 */
function getFlagImage(singleWeatherData) {
	switch (singleWeatherData.station.nation.name) {
		case "Italia":
			return $('<img></img>').addClass('nationFlag').attr({src: 'media/italy_flag.jpg', alt: 'italy'});
		case "Francia":
			return $('<img></img>').addClass('nationFlag').attr({src: 'media/france_flag.jpeg', alt: 'france'});
		case "Svizzera":
			return $('<img></img>').addClass('nationFlag').attr({src: 'media/swiss_flag.jpg', alt: 'switzerland'});
		default:
			return $('<img></img>').addClass('nationFlag').attr({src: 'media/no_flag_avaible.jpeg', alt: 'no image avaible'});
	}
}

/**
 * [getWeatherIcon function that return the img element containing weather icon]
 * @param  {[Objec]} singleWeatherData [object that contain sigle weather data]
 * @return {[type]}                   [description]
 */
function getWeatherIcon(singleWeatherData) {
	if ((singleWeatherData.hasOwnProperty("weather_icon")) && (singleWeatherData.weather_icon != null)) {
		return $('<img></img>').addClass('weatherIcon').attr('src', singleWeatherData.weather_icon.icon);
	}else if(singleWeatherData.weather_icon == null){
		return  $('<p> nd </p>').addClass('weatherIcon') ;
	}
}

/**
 * [checkIfNull function that checks if an api's element is null]
 * @param  variable [the variable that is printend in html]
 * @param  content [the value of an api's element]
 * @return the value of the variable
 */
function checkIfNull(variable, content){
	if (content == null){
		return variable = 'nd';
	}else{
		return variable = content;
	}
}

function imageError(img) {
    img.onerror='';
    img.src='media/no_flag_avaible.jpeg';
}

/**
 * [checkIfAccordionIsOpen function that control if accordio was open, if true remain open]
 * @param  {[Int]} accordionIndex [index of created accordion]
 * @return {[type]}                [description]
 */
function checkIfAccordionIsOpen(accordionIndex) {
	var flag = false;
	for (var index in selectedItem) {
		if (selectedItem.hasOwnProperty(index)) {
			if (accordionIndex == index) {
				flag = true;
			}
		}
	}
	return flag;
}

/**
 * [getLastUpdate function to print the last date of the page's refresh]
 * @return {[type]} [description]
 */
function getLastUpdate(){
	var formatDate = new Date();
	var date = $('p.lastUpdate')
	date.html(formatDate.toUTCString());
	var divDate = $('div#divDate');
	divDate.append(date);
}

/**
 * [getWebcamImage  function to get the webcam image]
 * @param  {[Object]} singleWeatherData [description]
 * @return {[type]}                   [description]
 */
function getWebcamImage(singleWeatherData){
	if (singleWeatherData.station['webcam'] == ""){
		return $('<p>').html('there is no image for this weather station').addClass('imageNotFound');
	}else{
		return $('<img onerror = "imageError(this)">').attr('src', singleWeatherData.station['webcam']);
	}
}

function formatTemp(weatherTemp, pTemp){
	var grade = parseInt(weatherTemp);
	if (grade < -5){
		pTemp.css('color', '#00004d');
	}else if(grade >= -5 && grade <= 0){
		pTemp.css('color', '#000099');
	}else if(grade > 0 && grade <= 10 ){
		pTemp.css('color', '#0000ff');
	}else if (grade > 10 && grade <= 15 ){
		pTemp.css('color', '#4d4dff');
	}else if (grade > 15 && grade <= 20 ){
		pTemp.css('color', '#ff9900');
	}else if (grade > 20 ){
		pTemp.css('color', '#ff6600');
	}
}

function filterStation(){
    var value = $(this).val().toLowerCase();

    $(".accordion").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
   });
}

$("#input-station-name").on("keyup", filterStation);

$( "#input-station-name").focus(function() {
 $("#txt-station-name").css("color", "black");
});

$( "#input-station-name").blur(function() {
 $("#txt-station-name").css("color", "#666");
});

$( "#select-country").focus(function() {
 $("#txt-country").css("color", "black");
});

$( "#select-country").blur(function() {
 $("#txt-country").css("color", "#666");
});

//call the function that get the weather data
getDataFromApi('https://www.torinometeo.org/api/v1/realtime/data/');
