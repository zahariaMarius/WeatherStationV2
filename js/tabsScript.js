$('ul.tabs li').click(function() {
		var tab_id = $(this).attr('data-tab');
		var bodyAccordion = $(this).parent().parent();
		$(this).siblings().removeClass('current');
		bodyAccordion.find('.tab_content').removeClass('current');
		$(this).addClass('current');
		$("#"+tab_id).addClass('current');
})
