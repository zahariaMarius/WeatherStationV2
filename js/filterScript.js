function filter(){
	//what the user write in the input text
	var inputText = $('#input-station-name').val().toLowerCase();
	//the id of the selected option
	var selectedOption = $('#select-country')[0].selectedOptions[0].id;
	//variable to store all the p tags that contains the station name
	var pStationName = $('p.station_name');
	//variable to store all the div tags that contains the accordions
	var divAccordion = $('div.accordion');
	//variable to store all the img tags that contains the flag images
	var imgFlag = $('img.nation_flag');
	//iterate for all accordions
	for (var i = 0; i < divAccordion.length; i++) {
		//check if the station name is equal to the search input and the alt of the flag image is equal to the selected option's id
		if(pStationName[i].innerHTML.toLowerCase().indexOf(inputText) > -1 &&
			(selectedOption === '-' || imgFlag[i].alt === selectedOption )){

			divAccordion[i].style.display = 'block';

		}else{
			divAccordion[i].style.display = 'none';
		}

	}
}

//add events to the input text and the select
$("#input-station-name").on("keyup", filter);
$('#select-country').on('click', filter);


//$("#input-station-name").on("keyup", filterStation);

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
