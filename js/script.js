/**
 * @Author: Zaharia Laurentiu Jr Marius
 * @Date:   2017-11-30T09:25:57+01:00
 * @Email:  laurentiu.zaharia@edu.itspiemonte.it
 * @Project: WeatherStation
 * @Filename: script.js
 * @Last modified by:   Zaharia Laurentiu Jr Marius
 * @Last modified time: 2017-12-08T18:04:01+01:00
 */

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
		createAccordions(weatherData);
		//refreshPage(10000);
	})
	.fail(function(error) {
		console.log(error);
		console.log(error.status);
		console.log(error.statusText);
		if (myUrl == 'https://www.torinometeo.org/api/v1/realtime/data/') {
			getDataFromApi('https://jsonblob.com/api/jsonBlob/8f73f269-d924-11e7-a24a-991ece7b105b');
		}
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
	var accordion = $('.main_accordion').clone().attr('class', 'accordion').appendTo('.accordion_container');
	accordion.find('.body_accordion').remove();
	populateHeaderAccordion(accordion.children('.header_accordion'), singleWeatherData);
}

/**
 * [populateHeaderAccordion function that populate header children with data from API]
 * @param  {[jQuery|HTMLElement]} headerAccordion [description]
 * @param  {[Object]} singleWeatherData [description]
 * @return {[type]}                   [description]
 */
function populateHeaderAccordion(headerAccordion, singleWeatherData) {
	headerAccordion.children('.nation_flag').attr('src', getNationFlag(singleWeatherData));
	headerAccordion.children('.station_name').html(getStationName(singleWeatherData));
	headerAccordion.children('.weather_data').html(getWeatherData(singleWeatherData));
	headerAccordion.children('.weather_icon').attr('src', getWeatherIcon(singleWeatherData));
	headerAccordion.children('.weather_temperature').html(getWeatherTemperature(singleWeatherData));
	addOnHeaderAccordionClickEventHandler(headerAccordion, singleWeatherData);
}

/**
 * [addOnHeaderAccordionClickEventHandler description]
 * @param {[type]} headerAccordion   [description]
 * @param {[type]} singleWeatherData [description]
 */
function addOnHeaderAccordionClickEventHandler(headerAccordion, singleWeatherData) {
	headerAccordion.click(function(event) {
		if (checkIfBodyAccordionNotExist($(this))) {
			createBodyAccordion($(this), singleWeatherData);
			// selectedItem[$(this).index('.headerAccordion')] = "bella";
			// console.log("id di quello aperto: " + selectedItem);
			// console.log(selectedItem);
		}
		applyBodyAccordionAnimation($(this));
	});
}

/**
* [checkIfBodyAccordionExist function that check if the requested body already exist]
* @param  {[type]} header [header element clicked]
* @return {[type]}        [description]
*/
function checkIfBodyAccordionNotExist(header) {
	var flag = false;
	if (header.next('.body_accordion').length == 0) {
		flag = true;
	}
	return flag;
}

/**
 * [createBodyAccordion function that clone the body accordion ad appent it to clicked headerAccordion parent]
 * @param  {[type]} headerAccordion   [description]
 * @param  {[type]} singleWeatherData [description]
 * @return {[type]}                   [description]
 */
function createBodyAccordion(headerAccordion, singleWeatherData) {
	//create body accordion
	var bodyAccordion = $('.main_accordion').find('.body_accordion').clone(true);

	//get all variables needed to set attributes on tabs elements
	var tabsLink = bodyAccordion.find('.tabs').children('.tab_link');
	var tabsContent = bodyAccordion.find('.tab_content');
	var allTabsLink = $('.tab_link').length;
	var allTabsContent = $('.tab_content').length;
	setTabElementsAttribute(tabsLink, 'data-tab', allTabsLink);
	setTabElementsAttribute(tabsContent, 'id', allTabsContent);

	//populate slideshow
	var slideshowContainer = bodyAccordion.find('.slideshow_container');
	populateSlideshow(slideshowContainer, singleWeatherData);
	applySlideshowAnimation(0, slideshowContainer, 5000);

	//append bodyAccordion to parent accordion
	bodyAccordion.appendTo(headerAccordion.parent('.accordion'));
}

/**
 * [populateSlideshow function that populate the slideshow dom element]
 * @param  {[type]} slideshowContainer [description]
 * @param  {[type]} singleWeatherData  [description]
 * @return {[type]}                    [description]
 */
function populateSlideshow(slideshowContainer, singleWeatherData) {
	//get the elements to populate
	var slidesContainer = slideshowContainer.children('.slide_container');
	var slidesDescription = slideshowContainer.find('.slide_description');
	//populate slide image with the image data
	$(slidesContainer[0]).children('.slide_image').attr('src', getWebcamImage(singleWeatherData));
	$(slidesContainer[1]).children('.slide_image').attr('src', getStationImage(singleWeatherData));
	$(slidesContainer[2]).children('.slide_image').attr('src', getMeteoGrammerImage(singleWeatherData));
	//populate slide description with the description data
	$(slidesDescription[0]).html("numero 0");
	$(slidesDescription[1]).html("numero 1");
	$(slidesDescription[2]).html("numero 2");
}

/**
 * [setTabElementsAttribute description]
 * @param {[type]} specifiedElement [description]
 * @param {[type]} attrType         [description]
 * @param {[type]} clonedElements   [description]
 */
function setTabElementsAttribute(specifiedElement, attrType, clonedElements) {
	specifiedElement.each(function(index, el) {
		switch (index) {
			case 0:
				$(el).attr(attrType, 'tab' + (clonedElements - 1));
				break;
			case 1:
				$(el).attr(attrType, 'tab' + clonedElements);
				break;
			default:
				break;
		}
	});
}

/**
* [getFlagImage function that return the image element containing image flag]
* @param  {[Object]} singleWeatherData [object that contain sigle weather data]
* @return {[type]}                   [description]
*/
function getNationFlag(singleWeatherData) {
	switch (singleWeatherData.station.nation.name) {
		case "Italia":
		return 'media/italy_flag.jpg';
		case "Francia":
		return 'media/france_flag.jpeg';
		case "Svizzera":
		return 'media/swiss_flag.jpg';
		default:
		return 'media/no_flag_avaible.jpeg';
	}
}

/**
 * [getStationName function that retunr the name of single station]
 * @param  {[Object]} singleWeatherData [description]
 * @return {[type]}                   [description]
 */
function getStationName(singleWeatherData) {
	var stationName = checkIfNull(stationName, singleWeatherData.station.name);
	return stationName;
}

function getWeatherData(singleWeatherData) {
	var temperatureMax = checkIfNull(temperatureMax, singleWeatherData.temperature_max);
	var temperatureMin = checkIfNull(temperatureMin, singleWeatherData.temperature_min);
	var relativeHumidity = checkIfNull(relativeHumidity, singleWeatherData.relative_humidity);
	var windStrength = checkIfNull(windStrength, singleWeatherData.wind_strength);

	return temperatureMax + " " + temperatureMin + " " + relativeHumidity + " " + windStrength;
}

/**
 * [getWeatherIcon function that return the img element containing weather icon]
 * @param  {[Objec]} singleWeatherData [object that contain sigle weather data]
 * @return {[type]}                   [description]
 */
function getWeatherIcon(singleWeatherData) {
	if ((singleWeatherData.hasOwnProperty("weather_icon")) && (singleWeatherData.weather_icon != null)) {
		return singleWeatherData.weather_icon.icon;
	}
}

/**
 * [getWeatherTemperature function that return the single temperature value]
 * @param  {[Object]} singleWeatherData [description]
 * @return {[type]}                   [description]
 */
function getWeatherTemperature(singleWeatherData) {
	var weatherTemperature = checkIfNull(weatherTemperature, singleWeatherData.temperature);
	return weatherTemperature;
}

/**
* [getMeteoGrammerImage function that get the meteoGrammerImage, parsed the json string between node elements]
* @param  {[type]} singleWeatherData [object that contain sigle weather data]
* @return {[type]}                   [return the img DOM element]
*/
function getMeteoGrammerImage(singleWeatherData) {
	var descriptionString = singleWeatherData.station.description;
	var htmlElements = $.parseHTML(descriptionString);
	var meteoGrammerImageURL;
	$.each(htmlElements, function(i, el) {
		var a = $(el).children();
		if (a.hasClass('lightbox-image')) {
			meteoGrammerImageURL = a.attr('href');
		}
	});
	return meteoGrammerImageURL;
}

/**
 * [getStationImage function that return the imgae url]
 * @param  {[type]} singleWeatherData [object that contain sigle weather data]
 * @return {[type]}                   [description]
 */
function getStationImage(singleWeatherData) {
	return singleWeatherData.station.image_url;
}

/**
 * [getWebcamImage  function to get the webcam image]
 * @param  {[Object]} singleWeatherData [description]
 * @return {[type]}                   [description]
 */
function getWebcamImage(singleWeatherData){
	return singleWeatherData.station.webcam;
	// if (singleWeatherData.station['webcam'] == ""){
	// 	return $('<img>').attr('src', 'media/no_flag_avaible.jpeg' );
	// }else{
	// 	return $('<img onerror = "imageError(this)">').attr('src', singleWeatherData.station['webcam']);
	// }
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
 * [applyBodyAccordionAnimation function that aplly the animation on body]
 * @param  {[type]} header [header element clicked]
 * @return {[type]}        [description]
 */
function applyBodyAccordionAnimation(header) {
	var bodyAccordion = header.next('.body_accordion');
	console.log(bodyAccordion);
	console.log(bodyAccordion.prop("scrollHeight"));
		if(bodyAccordion[0].style.maxHeight) {
			bodyAccordion[0].style.maxHeight = null;
		}else {
			bodyAccordion[0].style.maxHeight = bodyAccordion[0].scrollHeight + "px";
		}
}




//call the function that get the weather data
getDataFromApi('https://www.torinometeo.org/api/v1/realtime/data/');
