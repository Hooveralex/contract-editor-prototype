$('.content-nav-list-item > a').click(function(e){
	var id = $(this).attr('href');
	e.preventDefault();
	$('.content-nav-list-item').removeClass('active');
	$(this).parent('.content-nav-list-item').addClass('active');

	$('.org-landing-page-content').addClass('hidden');
	$(id).removeClass('hidden');

	console.log(id);

});

$('.clause-panel > .panel-heading').click(function(e){
	$(this).parent('.clause-panel').find('.clause-more-info-container').toggleClass('hidden');
});
