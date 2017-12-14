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

/**
 * [formatDate function that format the date for api url]
 * @param  {[String]} date [date to be formatted]
 * @return {[String]}      [date formatted]
 */
function formatDate(date) {
    return date.replace(/-/g, "/");
}

$('#find_historical_button').click(function(event) {
    var pickerDate = $(this).prev('.historical_weather_input').val();
    var formatPickerDate = formatDate(pickerDate);
    var historyApiUrl = 'https://www.torinometeo.org/api/v1/realtime/history/' + formatPickerDate;
    getHistoryDataFromApi(historyApiUrl, $(this).parent('.tab_content'));
});


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


function populateHistoricalBody(tabContent, station) {
    tabContent.find('.weather_data').text(getHistoricalWeatherData(station));
}

function getHistoricalWeatherData(station) {
    var temperatureMean = station.temperature_mean;
    var temperatureMin = station.temperature_min;
    var temperatureMax = station.temperature_max;
    var relativeHumidity = station.relative_humidity_mean;
    var pressureMean = station.pressure_mean;
    return temperatureMin + temperatureMean + temperatureMax + relativeHumidity + pressureMean;
}
