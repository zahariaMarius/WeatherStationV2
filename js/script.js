/**
 * @Author: Zaharia Laurentiu Jr Marius
 * @Date:   2017-11-30T09:25:57+01:00
 * @Email:  laurentiu.zaharia@edu.itspiemonte.it
 * @Project: WeatherStation
 * @Filename: script.js
 * @Last modified by:   Zaharia Laurentiu Jr Marius
 * @Last modified time: 2017-12-08T18:04:01+01:00
 */


var firstDomCreation = true;
var refreshWeatherDataTimeOut;
var refreshTimeInput = $('#refresh_time');
$('.refresh_time_message_error').hide();

/**
 * [apply event handler on refreshButton to start or stop the setTimeout]
 * @param  {[type]} event [description]
 */
$('#refresh_button').click(function(event) {
	if ($(this).val() === "Ferma refresh") {
		clearTimeout(refreshWeatherDataTimeOut);
		$(this).val("Inizia refresh");
		refreshTimeInput.prop('disabled', false);
	}else {
		if (checkIfRefreshTimeInputValueIsValid(refreshTimeInput.val())) {
			statRefreshWeatherDataTimeOut(refreshTimeInput.val() * 1000);
			$(this).val("Ferma refresh");
			refreshTimeInput.prop('disabled', true);
			refreshTimeInput.removeClass('refreshTimeInput_error');
			$('.refresh_time_message_error').hide();
		}else {
			refreshTimeInput.addClass('refreshTimeInput_error');
			$('.refresh_time_message_error').show();
		}
	}
});

/**
 * [checkIfRefreshTimeInputValueIsValid function that check if the refreshTimeInputValue is valid or not]
 * @param  {[Input]} refreshTimeInputValue [description]
 */
function checkIfRefreshTimeInputValueIsValid(refreshTimeInputValue) {
	var flag = false;
	if (parseInt(refreshTimeInputValue) >= 15) {
		flag = true;
	}
	return flag;
}

/**
 * [statRefreshWeatherDataTimeOut function that start the setTimeout to refresh the page]
 * @param  {[type]} refreshTime [description]
 */
function statRefreshWeatherDataTimeOut(refreshTime) {
	refreshWeatherDataTimeOut = setTimeout(function(){getDataFromApi('https://www.torinometeo.org/api/v1/realtime/data/', "torinometeo")}, refreshTime);
	firstDomCreation = false;
}

/**
 * [getApiData get all json weather data from API]
 * @return {[type]} [description]
 */
function getDataFromApi(myUrl, source) {
	$.ajax({
		url: myUrl,
		type: 'GET',
		dataType: 'JSON',
	})
	.done(function(weatherData) {
		console.log("success");
		console.log(weatherData);
		if (firstDomCreation) {
			createAccordions(weatherData);
		}else {
			updateAccordionData(weatherData);
		}
		$('#loading').fadeOut();
		getLastUpdate(source);
		if (myUrl == 'https://www.torinometeo.org/api/v1/realtime/data/') {
			updateJsonBlob(weatherData);
		}
		statRefreshWeatherDataTimeOut(refreshTimeInput.val() * 1000);
	})
	.fail(function(error) {
		console.log(error);
		console.log(error.status);
		console.log(error.statusText);
		if (myUrl == 'https://www.torinometeo.org/api/v1/realtime/data/') {
			getDataFromApi('https://jsonblob.com/api/jsonBlob/8f73f269-d924-11e7-a24a-991ece7b105b', "jsonblob");
		} else {
			$('#loading').fadeIn();
			$('#loading-text').html('Errore nella richiesta dei dati.');
			$('#loader').hide();
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
 * [updateAccordionData function that upload all DOM data calling the populate functions]
 * @param  {[Array]} weatherData [array containing all json objs]
 */
function updateAccordionData(weatherData) {
	weatherData.forEach(function (el, index) {
		var headerAccordion = $('.header_accordion')[index+1];
		populateHeaderAccordion($(headerAccordion), weatherData[index]);
		if (checkIfBodyAccordionNotExist($(headerAccordion))) {
			$(headerAccordion).unbind('click');
			addOnHeaderAccordionClickEventHandler($(headerAccordion), weatherData[index]);
		} else {
			populateBodyAccordion($(headerAccordion).next('.body_accordion'), weatherData[index]);
		}
	});
}

/**
 * [createAccordions function that create all accordion for how many weather detections returns]
 * @param  {[Array]} weatherData [array containing all json objs]
 */
function createAccordions(weatherData) {
	for (var item in weatherData) {
		if (weatherData.hasOwnProperty(item)) {
			createAccordion(weatherData[item]);
		}
	}
}

/**
 * [createAccordion function that clone the main accordion and calling the populate function]
 * @param  {[Object]} singleWeatherData [object that contain sigle weather data]
 */
function createAccordion(singleWeatherData) {
	var accordion = $('.main_accordion').clone().attr('class', 'accordion').appendTo('.accordion_container');
	accordion.find('.body_accordion').remove();
	populateHeaderAccordion(accordion.children('.header_accordion'), singleWeatherData);
	addOnHeaderAccordionClickEventHandler(accordion.children('.header_accordion'), singleWeatherData);
}

/**
 * [populateHeaderAccordion function that populate header children with data from API]
 * @param  {[jQuery|HTMLElement]} headerAccordion [the specified created header of accordion]
 * @param  {[Object]} singleWeatherData [object that contain sigle weather data]
 */
function populateHeaderAccordion(headerAccordion, singleWeatherData) {
	headerAccordion.children('.nation_flag').attr('src', getNationFlag(singleWeatherData));
	headerAccordion.children('.station_name').html(getStationName(singleWeatherData));
	headerAccordion.children('.weather_data').html(getWeatherData(singleWeatherData));
	headerAccordion.children('.weather_icon').attr('src', getWeatherIcon(singleWeatherData));
	var weatherTemperature = headerAccordion.children('.weather_temperature').html(getWeatherTemperature(singleWeatherData));
	formatTemp(singleWeatherData.temperature, weatherTemperature);
}

/**
 * [addOnHeaderAccordionClickEventHandler function that apply an click event on header]
 * @param {[jQuery|HTMLElement]} headerAccordion   [he specified created header of accordion]
 * @param {[type]} singleWeatherData [object that contain sigle weather data]
 */
function addOnHeaderAccordionClickEventHandler(headerAccordion, singleWeatherData) {
	headerAccordion.click(function(event) {
		if (checkIfBodyAccordionNotExist($(this))) {
			createBodyAccordion($(this), singleWeatherData);
		}
		applyBodyAccordionAnimation($(this));
	});
}

/**
* [checkIfBodyAccordionExist function that check if the requested body already exist]
* @param  {[jQuery|HTMLElement]} header [header element clicked]
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
 * @param  {[jQuery|HTMLElement]} headerAccordion   [header element clicked]
 * @param  {[type]} singleWeatherData [object that contain sigle weather data]
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
	//populate bodyAccordion
	populateBodyAccordion(bodyAccordion, singleWeatherData);
	//append bodyAccordion to parent accordion
	bodyAccordion.appendTo(headerAccordion.parent('.accordion'));
}

/**
 * [populateBodyAccordion function that populate the body accordion]
 * @param  {[jQuery|HTMLElement]} bodyAccordion	[body accordion from header element clicked]
 * @param  {[Object]} singleWeatherData [object that contain sigle weather data]
 */
function populateBodyAccordion(bodyAccordion, singleWeatherData) {
	bodyAccordion.find('.station_locality').text(getStationLocality(singleWeatherData)).attr('id', getStationId(singleWeatherData));
	var stationLink = bodyAccordion.find('.station_view_map');
	var slideshowContainer = bodyAccordion.find('.slideshow_container');
	addOnStationMapsLinkEventHandler(stationLink, singleWeatherData);
	populateSlideshow(slideshowContainer, singleWeatherData);
}

/**
 * [getStationId function that return the station id]
 * @param  {[Object]} singleWeatherData [[object that contain sigle weather data]]
 * @return {[Int]}                   [station id]
 */
function getStationId(singleWeatherData) {
	return singleWeatherData.station.id;
}

/**
 * [addOnStationMapsLinkEventHandler function that applied a event handle and redirect on maps]
 * @param {[jQuery|HTMLElement]} stationLink	[HTMLElement to apply the event]
 * @param {[Object]} singleWeatherData [object that contain sigle weather data]
 */
function addOnStationMapsLinkEventHandler(stationLink, singleWeatherData) {
	stationLink.click(function(event) {
		window.open('https://www.google.it/maps/place/' + singleWeatherData.station.name + '/@'
					+ singleWeatherData.station.lat + ',' + singleWeatherData.station.lng);
	});
}

/**
 * [getStationLocality function that return the specified station locality]
 * @param  {[Object]} singleWeatherData [object that contain sigle weather data]
 */
function getStationLocality(singleWeatherData) {
	var city = singleWeatherData.station.city;
	var region = singleWeatherData.station.region.name;
	var province = singleWeatherData.station.province.name;
	var nation = singleWeatherData.station.nation.name;
	return city + " " + region + " " + province + " " + nation;
}

/**
 * [populateSlideshow function that populate the slideshow dom element and aplly the animation]
 * @param  {[jQuery|HTMLElement]} slideshowContainer [description]
 * @param  {[object]} singleWeatherData  [object that contain sigle weather data]
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
	$(slidesDescription[0]).html(getStationClimate(singleWeatherData));
	$(slidesDescription[1]).html(getSationDescription(singleWeatherData));
	$(slidesDescription[2]).html(getMeteogrammerDescription(singleWeatherData));
	applySlideshowAnimation(0, slideshowContainer);
}

/**
 * [setTabElementsAttribute function that set forEach element the attributes]
 * @param {[jQuery|HTMLElement]} specifiedElement [element to apply attributes to]
 * @param {[String]} attrType	[attribute type]
 * @param {[Int]} clonedElements	[number of elements cloned]
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
* [getFlagImage function that return the URL of interested image]
* @param  {[Object]} singleWeatherData [object that contain sigle weather data]
* @return {[src]}	[return the image src path]
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
 * @param  {[Object]} singleWeatherData [object that contain sigle weather data]
 * @return {[String]}                   [return the specified station name]
 */
function getStationName(singleWeatherData) {
	var stationName = checkIfNull(stationName, singleWeatherData.station.name);
	return stationName;
}

/**
 * [getWeatherData function that return the specified station weather data]
 * @param  {[Object]} singleWeatherData [object that contain sigle weather data]
 * @return {[String]}                   [String that contain all weather data]
 */
function getWeatherData(singleWeatherData) {
	var temperatureMax = checkIfNull(temperatureMax, singleWeatherData.temperature_max);
	var temperatureMin = checkIfNull(temperatureMin, singleWeatherData.temperature_min);
	var relativeHumidity = checkIfNull(relativeHumidity, singleWeatherData.relative_humidity);
	var windStrength = checkIfNull(windStrength, singleWeatherData.wind_strength);

	return temperatureMax + " " + temperatureMin + " " + relativeHumidity + " " + windStrength;
}

/**
 * [getWeatherIcon function that return the URL of station weather icon]
 * @param  {[Objec]} singleWeatherData [object that contain sigle weather data]
 * @return {[URL]}                   [URL of station weather icon]
 */
function getWeatherIcon(singleWeatherData) {
	if ((singleWeatherData.hasOwnProperty("weather_icon")) && (singleWeatherData.weather_icon != null)) {
		return singleWeatherData.weather_icon.icon;
	}
}

/**
 * [getWeatherTemperature function that return the single temperature value]
 * @param  {[Object]} singleWeatherData [object that contain sigle weather data]
 * @return {[String]}                   [station weather temperature]
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
	var meteoGrammerImageURL = "";
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
 * @return {[URL]}                   [station URL image]
 */
function getStationImage(singleWeatherData) {
	return singleWeatherData.station.image_url;
}

/**
 * [getWebcamImage  function to get the webcam image]
 * @param  {[Object]} singleWeatherData [object that contain sigle weather data]
 * @return {[URL]}                   [station URL webcam image]
 */
function getWebcamImage(singleWeatherData) {
	return singleWeatherData.station.webcam;
}

/**
 * [getStationClimate function that return the climate of specified station]
 * @param  {[type]} singleWeatherData [object that contain sigle weather data]
 * @return {[String]}                   [station URL climate]
 */
function getStationClimate(singleWeatherData) {
	return singleWeatherData.station.climate;
}

/**
 * [getMeteogrammerDescription function that return the specified station meteogrammer description]
 * @param  {[Object]} singleWeatherData [object that contain sigle weather data]
 * @return {[String]}                   [String of meteogrammer description]
 */
function getMeteogrammerDescription(singleWeatherData) {
	var descriptionString = singleWeatherData.station.description;
	var htmlElements = $.parseHTML(descriptionString);
	var meteogrammerDescription = $(htmlElements).first();
	if (!meteogrammerDescription.html().split("<br>")[1]) {
		return "Descrizione non disponibile";
	}else {
		return meteogrammerDescription.html().split("<br>")[1];
	}
}

/**
 * [getSationDescriptionfunction that return the specified station description]
 * @param  {[Object]} singleWeatherData [object that contain sigle weather data]
 * @return {[String]}                   [string of station description]
 */
function getSationDescription(singleWeatherData) {
	var descriptionString = singleWeatherData.station.description;
	var htmlElements = $.parseHTML(descriptionString);
	var stationDescription = $(htmlElements).first();
	return stationDescription.html().split("<br>")[0];
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

/**
 * [imageError da fare]
 * @param  {[type]} img [description]
 */
function imageError(img) {
    img.onerror='';
    img.src='media/no_flag_avaible.jpeg';
}


/**
 * [applyBodyAccordionAnimation function that aplly the animation on body]
 * @param  {[jQuery|HTMLElement]} header [header element clicked]
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

/**
 * [formatTemp function that add css class to temperature]
 * @param  {[type]} weatherTemp [description]
 * @param  {[type]} pTemp       [description]
 */
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

/**
 * [getLastUpdate function to print the last date of the page's refresh]
 */
function getLastUpdate(source){
	var formatDate = new Date();
	var date = $('p.lastUpdate')
	date.html("Refresh date: " + formatDate.toLocaleString() + "<br>" + getSourceWeatherData(source));
	var divDate = $('div#divDate');
	divDate.append(date);
}

function getSourceWeatherData(source) {
	var sourceLink = "";
	if (source === "torinometeo") {
		sourceLink = "Data source: www.torinometeo.org";
	}else {
		sourceLink = "Data source: https://jsonblob.com"
	}
	return sourceLink;
}

//call the function that get the weather data
getDataFromApi('https://www.torinometeo.org/api/v1/realtime/data/', "torinometeo");
