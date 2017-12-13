/**
 * @Author: Zaharia Laurentiu Jr Marius
 * @Date:   2017-12-08T16:58:10+01:00
 * @Email:  laurentiu.zaharia@edu.itspiemonte.it
 * @Project: WeatherStation
 * @Filename: slideshowScript.js
 * @Last modified by:   Zaharia Laurentiu Jr Marius
 * @Last modified time: 2017-12-08T18:03:48+01:00
 */

 /**
  * [nextSlide function that clear the setTimeout and display the next o prev slide]
  * @param  {[Int]} increment [description]
  * @return {[type]}   [description]
  */
 function nextSlide(increment, slideshowContainer, timeout) {
 	clearTimeout(timeout);
 	applySlideshowAnimation(slideIndex += increment, slideshowContainer, 5000);
 }

 /**
  * [showSlides function that increme the slides and show it automatic]
  * @param  {[Int]} increment [description]
  * @return {[type]}   [description]
  */
 function applySlideshowAnimation(increment, slideshowContainer, slideTime) {
 	var i;
 	var slides = slideshowContainer.children('.slide_container');
 	if (increment > slides.length) {slideIndex = 1}
 	if (increment < 1) {slideIndex = slides.length}
 	for (i = 0; i < slides.length; i++) {
 		slides[i].style.display = "none";
 	}
 	slides[slideIndex-1].style.display = "block";
 	var timeout = setTimeout(function(){ nextSlide(1, slideshowContainer, timeout) }, slideTime);
 }
