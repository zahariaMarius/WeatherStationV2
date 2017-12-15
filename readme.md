# Real Time Weather


## Functions

##### formatTemp
Function that adds css attribute to temperature, changing color based on the temperature
**param [Number]** weatherTemp: the weather temperature
**param [HTMLElement]** pTemp: paragraph that contains the temperature

##### populateBodyAccordion
Populates the body accordion with data
**param [jQuery|HTMLElement]** bodyAccordion: body accordion from header element clicked
**param [Object]** singleWeatherData: contains the sigle weather data

##### addOnStationMapsLinkEventHandler
 Function that applies a event handler and redirects on google maps
**param [jQuery|HTMLElement]** stationLink: body accordion from header element clicked
**param [Object]** singleWeatherData: contains the sigle weather data

##### getStationLocality
Return the specified station locality
**param [Object]** singleWeatherData: contains the sigle weather data

##### getMeteoGrammerImage
function that get the meteoGrammerImage, parsed the json string between node elements
**param [Object]** singleWeatherData: contains the sigle weather data
**return [HTMLElement]** returns the img DOM element

##### getStationImage
Returns the image's url of the station
**param [Object]** singleWeatherData: contains the sigle weather data

##### populateSlideshow
Populates the slideshow dom element and applies the animation
**param [jQuery|HTMLElement]** slideshowContainer: the slideshow of the clicked header
**param [Object]** singleWeatherData: contains the sigle weather data

##### checkIfRefreshTimeInputValueIsValid
Checks if the number of seconds to refresh the data is valid or not
**param [Number]** refreshTimeInputValue: seconds of refresh submitted by the user

##### stratRefreshWeatherDataTimeOut
Starts the setTimeout to refresh the page (default is 30 seconds)

##### getNationFlag
Returns the URL of the correct flag country
**param [Object]** singleWeatherData: object that contain sigle weather data
**return [String]** returns the local url of the image of the flag

##### getStationName
Returns the name of a single station
**param [Object]** singleWeatherData: object that contain sigle weather data
**return [String]** return the specified station name

##### getWeatherData
**param [Object]** singleWeatherData: object that contain sigle weather data
**return [String]** returns a String that contains all weather data

##### setTabElementsAttribute
Function that set for each element the attributes
**param [jQuery|HTMLElement]** specifiedElement: element to apply the attributes to
**param [String]** attrType: attribute type
**param [Int]** clonedElements: number of elements cloned

##### getDataFromApi
Gets all json weather data from  [torinometeo API](https://www.torinometeo.org/api/v1/realtime/data/) or [JsobBlob](https://jsonblob.com/8f73f269-d924-11e7-a24a-991ece7b105b) using a AJAX call

##### updateAccordionData
Updates all DOM data calling the populate functions

##### populateHeaderAccordion
Function that populates header children with data from API
**param [jQuery|HTMLElement]** headerAccordion: The specified header created of the accordion
**param [Object]** singleWeatherData: contains the sigle weather data

##### addOnHeaderAccordionClickEventHandler
Applies a click event on the header
**param [jQuery|HTMLElement]** headerAccordion: he specified created header of accordion
**param [Object]** singleWeatherData: contains the sigle weather data

##### getMeteogrammerDescription
Returns the specified station's meteogrammer description
**param [Object]** singleWeatherData: contains the sigle weather data
**return [String]**  meteogrammer description

##### checkIfNull
Function that checks if an api's element is null
**param []** variable: contains the sigle weather data
**param []** content: the value of an api's element
**return []**  the value of the variable

##### imageError
da fare?

##### getSationDescription
Return the specified station description
**param [Object]** singleWeatherData: contains the sigle weather data
**return [String]**  Station's description

##### getStationClimate
function that return the climate of specified station
**param [Object]** singleWeatherData: contains the sigle weather data
**return [String]** returns the URL climate

##### getWeatherTemperature
Return the single temperature value
**param [Object]** singleWeatherData: contains the sigle weather data
**return [Int]** returns the station temperature

##### updateJsonBlob
Updates the jsonblob using the latest data from the stations
**param [Object]** updatedData: object containing the latest data

##### getLastUpdate
Gets the current Date and time and prints it on the page

##### getWebcamImage
Gets the webcam image of the station and prints it on the page.
A default image will be printed if the station's image is unavailable.
**param [String]** singleWeatherImage: The string containing the url of the station's image.

##### createAccordions
Creates all the accordions based on how many station data the API returns
**param [Array]** weatherData: array containing all the stations' data

##### createAccordion
Creates a single accordion div
**param [Object]** singleWeatherData: contains the data of a single station

##### createBodyAccordion
Creates the body div of the accordion that contains more details
**param [Object]** singleWeatherData: contains data about a single station
**return [type]** body div

##### getFlagImage
 Returns a image element containing the image flag of the nation
**param [Object]** singleWeatherData: contains data of a single station (including the nation)

##### getWeatherIcon
Returns a image element with a weather icon
**param [Object]** singleWeatherData: contains data

##### checkIfBodyAccordionNotExist
Check if the requested body of the accordion already exists
**param [jQuery|HTMLElement]** header: the header of the element clicked
**return [Boolean]** flag: returns true if the accordion has a body, otherwise false.

##### applyBodyAccordionAnimation
Function that aplly the animation on body
**param [jQuery|HTMLElement]** header: element clicked

#### getMaxPickerDate
function that return the yesterday formated date
**return [String]** yesterday date

#### formatDateForApiUrl
function that format the date for api url
**param  [String]** date: date to be formatted
**return [String]** date formatted]

#### formatDateForPickerDate
formatDateForPickerDate function that format the date for api url
**param  [String]** date: date to be formatted
**return [String]** date formatted

#### getRequestHistoricalStation
getRequestHistoricalStation function that filter the all station and retrive the speci one
**param [Array]** weatherData: all weather data form API
**param [jQuery|HTMLElement]** tabContent: tab where the station data was required

#### populateHistoricalBody
populateHistoricalBody function that populate with station data the historical body
**param [jQuery|HTMLElement]** tabContent: tab where the station data was required
**param [Object]** station: required stationn data

#### getHistoricalWeatherData
getHistoricalWeatherData function that get the weather data
**param [Object]** station: required station data
**return [String]** string: all weather data
----

## Files
##### HTML
+ index.html

##### CSS
+ reset.css
+ slideshowStyle.css
+ style.css
+ tabsStyle.css

##### Javascript
+ filterScript.js
+ script.js
+ historicalScript.js
+ slideshowScript.js
+ tabsScript.js

## Authors
**Daniele Schiavolin**: CSS enhancement, data upload on JsonBlob, loading, errors handling, historical body implementation
**Luca Spatola**: weather temperature colors, Google Maps link
**Sara Spaventa**: HTML page, Stations name and countries filter, weather data errors handling, CSS enhancement
**Laurentiu Jr Marius Zaharia**: Accordions and animations, tabs, page refresh, weather data implementation: realtime and historical
