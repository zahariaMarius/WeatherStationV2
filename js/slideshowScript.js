/**
 * @Author: Zaharia Laurentiu Jr Marius
 * @Date:   2017-12-08T16:58:10+01:00
 * @Email:  laurentiu.zaharia@edu.itspiemonte.it
 * @Project: WeatherStation
 * @Filename: slideshowScript.js
 * @Last modified by:   Zaharia Laurentiu Jr Marius
 * @Last modified time: 2017-12-08T18:03:48+01:00
 */

$('.previous_slide_button').click(function(event) {
    var slideshowContainer = $(this).parent('.slideshow_container');
    nextSlide(-1, slideshowContainer);
});

$('.next_slide_button').click(function(event) {
    var slideshowContainer = $(this).parent('.slideshow_container');
    nextSlide(1, slideshowContainer);
});

$('.previous_slide_button_historical').click(function(event) {
    var slideshowContainer = $(this).parent('.slideshow_container_historical');
    nextSlide(-1, slideshowContainer);
});

$('.next_slide_button_historical').click(function(event) {
    var slideshowContainer = $(this).parent('.slideshow_container_historical');
    nextSlide(1, slideshowContainer);
});

 /**
  * [nextSlide function that clear the setTimeout and display the next o prev slide]
  * @param  {[Int]} increment [description]
  * @return {[type]}   [description]
  */
 function nextSlide(increment, slideshowContainer) {
 	applySlideshowAnimation(slideIndex += increment, slideshowContainer);
 }

 /**
  * [showSlides function that increment the slides and show it]
  * @param  {[Int]} increment [value of increment input]
  * @return {[type]}   [description]
  */
 function applySlideshowAnimation(increment, slideshowContainer) {
 	var i;
 	var slides = slideshowContainer.children('.slide_container');
 	if (increment > slides.length) {slideIndex = 1}
 	if (increment < 1) {slideIndex = slides.length}
 	for (i = 0; i < slides.length; i++) {
 		slides[i].style.display = "none";
 	}
 	slides[slideIndex-1].style.display = "block";
 }
