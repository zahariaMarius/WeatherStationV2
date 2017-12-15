/**
 * [getApiData get all json weather data from API]
 * @return {[type]} [description]
 */
function getHistoryDataFromApi(myUrl, tabContent) {
	$.ajax({
		url: myUrl,
		type: 'GET',
		dataType: 'JSON',
	})
	.done(function(weatherData) {
		console.log("success");
		console.log(weatherData);
        getRequestHistoricalStation(weatherData, tabContent);
	})
	.fail(function(error) {
		console.log(error);
		console.log(error.status);
		console.log(error.statusText);
	})
	.always(function() {
		console.log("ajax call complete");
	});
}

$('.historical_weather_input').attr('max', "1979-12-31");

getMaxPickerDate();

function getMaxPickerDate() {
	var todayDate = new Date().toLocaleDateString();
	var a=  formatDateForPickerDate(todayDate);
	console.log(a);
}

/**
 * [formatDateForApiUrl function that format the date for api url]
 * @param  {[String]} date [date to be formatted]
 * @return {[String]}      [date formatted]
 */
function formatDateForApiUrl(date) {
    return date.replace(/-/g, "/");
}

/**
 * [formatDateForApiUrl function that format the date for api url]
 * @param  {[String]} date [date to be formatted]
 * @return {[String]}      [date formatted]
 */
function formatDateForPickerDate(date) {
    return date.replace(/\//g, "-");
}

/**
 * [event handler that call a function that required data from API URL]
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */
$('#find_historical_button').click(function(event) {
    var pickerDate = $(this).prev('.historical_weather_input').val();
    var formatPickerDate = formatDateForApiUrl(pickerDate);
    var historyApiUrl = 'https://www.torinometeo.org/api/v1/realtime/history/' + formatPickerDate;
    getHistoryDataFromApi(historyApiUrl, $(this).parent('.tab_content'));
});

/**
 * [getRequestHistoricalStation function that filter the all station and retrive the speci one]
 * @param  {[Array]} weatherData [all weather data form API]
 * @param  {[jQuery|HTMLElement]} tabContent  [tab where the station data was required]
 * @return {[type]}             [description]
 */
function getRequestHistoricalStation(weatherData, tabContent) {
    var stationId = tabContent.find('.station_locality').attr('id');
    var station = "";
    weatherData.forEach(function (singleWeatherData, index) {
        if (singleWeatherData.station.id == stationId) {
            station = singleWeatherData;
        }
	});
    populateHistoricalBody(tabContent, station);
}

/**
 * [populateHistoricalBody function that populate with station data the historical body]
 * @param  {[jQuery|HTMLElement]} tabContent [tab where the station data was required]
 * @param  {[Object]} station    [required stationn data]
 * @return {[type]}            [description]
 */
function populateHistoricalBody(tabContent, station) {
    tabContent.find('.weather_data').text(getHistoricalWeatherData(station));
	console.log(tabContent.find('.slideshow_container_historical'));
	populateHistoricalSlideshow(tabContent.find('.slideshow_container_historical'), station);
}

/**
 * [getHistoricalWeatherData function that get the weather data]
 * @param  {[Object]} station [required station data]
 * @return {[String]}         [all weather data]
 */
function getHistoricalWeatherData(station) {
    var temperatureMean = station.temperature_mean;
    var temperatureMin = station.temperature_min;
    var temperatureMax = station.temperature_max;
    var relativeHumidity = station.relative_humidity_mean;
    var pressureMean = station.pressure_mean;
    return temperatureMin + temperatureMean + temperatureMax + relativeHumidity + pressureMean;
}

/**
 * [populateSlideshow function that populate the slideshow dom element and aplly the animation]
 * @param  {[jQuery|HTMLElement]} slideshowContainer [description]
 * @param  {[object]} singleWeatherData  [object that contain sigle weather data]
 */
function populateHistoricalSlideshow(slideshowContainer, singleWeatherData) {
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
	slideshowContainer.show();
}
