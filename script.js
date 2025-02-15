$(document).ready(function () {

	var baseurl = $('body').attr('data-base');
	var basedir = $('body').attr('data-dir');
	var easing = 'easeInOutQuart';
	var uiready = false;
	var replacepagetype = 'default';
	var viewportHeight = $(window).height();
	var viewportWidth = $(window).width();
	var loadingcircle = false;
	var docHeight = $(document).height();
	var imagefadespeed = 300;
	var minHeight = "250px";
	var headerHeight = "auto";
	var History = window.History;
	var rootUrl = History.getRootUrl();
	var relativeUrl;
	var pageInfoGlobal = pageInfoGlobal || $('#content').data('info');
	var oktoScroll = true;

	// device detection
	var device;

	function checkdevice() {
		if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			device = 'mobile';
		} else if (/iPad/i.test(navigator.userAgent)) {
			device = 'desktop';
		} else {
			device = 'desktop';
			if ($(window).width() <= 800)
				device = "desktop_small";
		}
		if (device != 'desktop')
			minHeight = 0;
		if (viewportWidth <= 900)
			device = "mobile";
	}

	checkdevice();

	console.log("Removed Router function because it's causing issues.");
	// Router.init({
	//   home: baseurl,
	//   before: function(url){
	//     $("#content, #footer").fadeOut();
	//     $('.loader').addClass('active')
	//     $('.search input').blur();
	//   },
	//   after: function($response){

	//     var pageInfo = $response.find('#content').data('info');
	//     pageInfoGlobal = pageInfo;

	//     if (!pageInfo)
	//       pageInfo = {};

	//     one = $response.find('#content').html();
	//     two = $response.find('#footer').html();

	//     targetTitle = $response.filter('title').text();

	//     scrollToTop();

	//     $("#content, #footer").stop(true).hide().empty()
	//       .ahem(function() {
	//         $("#content").append(one).data('info', pageInfo);
	//         $('#footer').remove();
	//         // if (!$('#footer')[0])
	//         $("#wrapper").append($response.find('#footer'))
	//       }).fadeIn('slow');

	//     initPage();

	//     $('.loader').removeClass('active')

	//     document.title = targetTitle;
	//   }
	// })


	var black = '#221e1e'; // _palette.scss $black
	var gray = '#c6c3c3'; // $gray
	var white = '#fff'; // $white


	function initPage() {
		oktoScroll = true;

		$('.post-image-w ').height(viewportHeight);

		var pageInfo = $('#content').data('info');

		if (pageInfo.type == 'archive') {
			$('header').addClass('black')
		}
		else
			$('header').removeClass('black')


		if (pageInfo.name == 'home') {
			// $('#footer').removeClass('footer-page').addClass('footer-home')
			// 	.find('.footer-hr').removeClass('hr dark-gray').addClass('hr-home white');
			$('header').addClass('black aw-home-page');

			$('#footer').removeClass('footer-home').addClass('footer-page')
				.find('.footer-hr').removeClass('hr-home white').addClass('hr dark-gray');

		} else {
			// $('#footer').removeClass('footer-home').addClass('footer-page')
			// 	.find('.footer-hr').removeClass('hr-home white').addClass('hr dark-gray');

			if (pageInfo.name == 'works' || pageInfo.name == 'projects' || pageInfo.name == 'news') {
				initIsotope();
			}

			if ($('.swiper-gallery-container').length) {
				createGallerySwiper();
				createPanzoom();
			}
			showPostNav();
		}


		if ($('.swiper-container').length) {
			createSwiper();
		}

		registerClicks();

		$(".player").mb_YTPlayer();
		$(".player").on("YTPReady", function () {
			if ($(this).parent().hasClass('swiper-slide-active'))
				$(this).playYTP()
			else
				$(this).pauseYTP()
		})

		// AW - Flickity 
		var $bannerCarousel = $('.banner-carousel').flickity({
			freeScroll: false,
			imagesLoaded: true,
			wrapAround: true,
			cellAlign: 'center',
			cellSelector: '.carousel-cell',
			groupCells: true,
			contain: true,
			prevNextButtons: false,
			pageDots: false,
			autoPlay: 3000,
			//autoPlay: false,
			pauseAutoPlayOnHover: false
		});

		$bannerCarousel.show().flickity('resize');


		var $carousel = $('.related-carousel').flickity({
			freeScroll: true,
			imagesLoaded: true,
			wrapAround: true,
			cellAlign: 'center',
			cellSelector: '.carousel-cell',
			groupCells: true,
			contain: true,
			prevNextButtons: false,
			lazyLoad: true,
			autoPlay: 3000,
			pageDots: false,
			pauseAutoPlayOnHover: false
		});

		$carousel.show().flickity('resize');

		// AW - Read more collapse

		$('.link-collapse-ctn').click(function () {

			$('.aw-row-more-infos').slideToggle('slow');
			$(this).toggleClass('opened');

		});

		// play and pause button

		$("#aw-video").on("click", function () {

			var txt = $(this).next(".video-play-img");
			this.paused ? this.play() : this.pause();
			this.paused ? txt.fadeIn("slow") : txt.fadeOut("slow");
		});

		$(".inner-ctn").on("click", function () {
			$("#aw-video").trigger('play');
			$(this).parent(".video-play-img").fadeOut("slow");
		});



		//Modal with Carousel

		$(document).ready(function () {

			var $modalCarousel = $('.modal-carousel').flickity({
				freeScroll: false,
				imagesLoaded: true,
				wrapAround: true,
				cellAlign: 'center',
				cellSelector: '.modal-carousel-cell',
				fullscreen: true,
				groupCells: true,
				contain: true,
				prevNextButtons: false,
				pageDots: false,
				autoPlay: false,
				//autoPlay: false,
				pauseAutoPlayOnHover: false,
        draggable: true
			});

			$('.aw-button-group').on('click', '.aw-button', function () {
				var selector = $(this).attr('data-selector');
				$modalCarousel.flickity('selectCell', selector);
			});

			// previous
			$('.button--previous').on('click', function () {
				$modalCarousel.flickity('previous');
			});

			// next
			$('.button--next').on('click', function () {
				$modalCarousel.flickity('next');
			});

			$modalCarousel.show().flickity('resize');

		});

		// Single Card Modal

		$('.aw-fea-image__card').click(function () {

			$('html').addClass('show-modal');

			// var cardId = $(this).attr('card-item');

			// $('.aw-fea-image__card').removeClass('aw-active');
			// $('.aw-featured-modal__img-wrap').removeClass('aw-active');

			// $(this).addClass('aw-active');
			// $("#featured-modal-" + cardId).addClass('aw-active');

		});

		// Close Modal

		$('.aw-modal-close').click(function () {
			$('html').removeClass('show-modal');
		});

	}




	initPage();



	// show bottom-most post navigation on product and news pages
	function showPostNav() {
		$('.post-navigation').removeClass('hidden');

	}



	/* SCROLL */
	var navOffset = 0
	// $('nav').offset().top;

	$(window).scroll(function (e) {

		var scrolled = $(document).scrollTop();

		/* INFINITE */

		docHeight = $(document).height();

		if (viewportHeight + scrolled + 300 > docHeight && oktoScroll) {

			oktoScroll = false;

			var container = $('.gridContainer');
			var totalPageCount = container.attr('data-pages');
			var requestUrl = $('#nextPage').attr('data-url');
			var requestPageNum = sliceRel(requestUrl);

			if (!requestPageNum || requestPageNum > totalPageCount) {
				$('.loading-gif').hide();
				return;
			}

			// if ($('#nextPage').length) {

			$('.loading-gif').show();

			$.ajax({
				url: requestUrl,
				type: 'get',
				dataType: 'html',
				success: function (data) {

					var $data = $(data);
					var next = $data.find('#nextPage');
					var items = $data.find('.gridContainer').children();

					// container.isotope('reLayout');
					// isotopeSetMobileItemClass();

					container.append(items);

					$('#nextPage').replaceWith(next);
					$('.loading-gif').hide();
					oktoScroll = true;

				},
				error: function () {
					$('.loading-gif').hide();
					oktoScroll = true;
				}
			});
		}
	});

	function scrollToTop() {
		$('body, html').animate({
			'scrollTop': 0
		}, 'fast');
	}

	function noModal() {
		return $('#modal').length === 0 || !$('#modal').hasClass('active');
	}


	/* CLICKS */

	$('body').on('click', '.grid.simple', function () {
		$(this).toggleClass('flip')
	})


	$('body').on('click', '#menuButton', function () {
		$('.home, .sliding, #mobile, #menu').addClass('openMenu');
	});

	$('body').on('click', '#just-modal-btn', function () {
		$('.home, .sliding, #mobile, #menu').addClass('openMenu');
	});

	$('body').on('click', '#header #menuButton', function () {
		$('#menu').addClass('active');
	});

	$('body').on('click', '#just-modal-btn', function () {
		$('#menu').addClass('active');
	});


	$('body').on('click', '.closeMenu, #menu li, #menu h1, #site-title', function () {
		$('.home, .sliding, #mobile, #menu').removeClass('openMenu');
		$('.menuModal').removeClass('active');
	});

	$('body').on('click', '.contactButton, .contactButton2', function () {
		$('#contact').addClass('active');
		$('#menu').removeClass('active');
	});

	$('body').on('click', '.newsletterButton', function () {
		$('#newsletter').addClass('active');
		$('#menu').removeClass('active');
	});


	function registerClicks() {
		if (pageInfoGlobal.name == 'works' || pageInfoGlobal.name == 'projects' || pageInfoGlobal.name == 'selected-works') {
			$('#view-works, #imgFour').on('click', function () {
				showGallery();
			});
		}
	}




	/* HOVERS */


	$("body").on('mouseover', "#news-archive-nav", function () {
		$('#news-archive-nav ul').slideDown();
	})
	$("body").on('mouseleave', "#news-archive-nav", function () {
		$('#news-archive-nav ul').hide();
	})
	$("body").on('click', "#news-archive-nav,#news-archive-nav a ", function () {
		$('#news-archive-nav ul').hide();
	})

	$("body").on('mouseover', ".socialHover", function () {
		$(this).fadeOut()
		$(".socialLinks").fadeIn()
	})
	$("body").on('mouseleave', ".socialLinks", function () {
		$(this).fadeOut()
		$(".socialHover").fadeIn()
	})





	/* SWIPERS
		------------------------------------------------------------*/

	/* -- MAIN SLIDESHOWS -- */


	/* ZOOMER
		------------------------------------------------------------*/

	



		


	






	/* ISOTOPE
		------------------------------------------------------------*/

	function initIsotope() {
		var speed = 0;
		var container = $('#isotope-container');

		var itemWidth = device == 'mobile' ? viewportWidth : 391;
		var itemHeight = device == 'mobile' ? itemWidth * 0.7179487179487179 : 281;

		container.isotope({
			itemSelector: '.item-w',
			layoutMode: 'masonry',
			masonry: {
				columnWidth: 1,
				rowHeight: 1
			},
			isStill: true,
			transitionDuration: speed,
			animationEngine: 'best-available',
			animationOptions: {
				transitionDuration: speed
			}
		});
		setupFilters(container, speed);

		isotopeSetMobileItemClass();
	}

	function isotopeSetMobileItemClass() {
		if (device == 'mobile') {
			$('.item-w').removeClass('large, portrait').addClass('small');
		}
	}


	function setupFilters(container, speed) {
		if (device == 'mobile') {
			return;
		}

		var items = $('.item-w'),
			items2 = $('.grid'),
			container = $('.gridContainer')
		noposts = $('#no-posts'),
			speed = speed || 0;

		$('.filter').on('click', function (e) {
			// e.preventDefault();
			noposts.hide(speed);

			var sel = $(this).attr('data-filter');
			$('#isotope-container').isotope({
				filter: sel
			});


			if (items.not('.isotope-hidden').length === 0) {
				noposts.text('The ' + sel.slice(1) + ' category has no related posts.');
				noposts.show(speed);
			}

			// return false;
		});
	}

	function layout() {
		var itemWidth = device == 'mobile' ? viewportWidth : 391;
		var itemHeight = device == 'mobile' ? itemWidth * 0.7179487179487179 : 281;

		if (device == 'mobile') {
			$('#isotope-container').isotope('option', {
				masonry: {
					columnWidth: 1,
					rowHeight: 1
				}
			});
		}
		$('#isotope-container').isotope('reLayout');
		isotopeSetMobileItemClass();
	}

	window.doSearch = function () {

		if ($('.search-box').width() > 30) {
			return;
		}

		$('.search input').show().focus();

		setTimeout(function () {
			$('.search input').focus();
		}, 100)
	}

	var delay = (function () {
		var timer = 0;

		return function (callback, ms) {
			clearTimeout(timer);
			timer = setTimeout(callback, ms);
		};
	})();

	var wp_search = {
		query: '',
		init: function () {
			var $search = $('.search input');

			var $searchBox = $('.search-box');

			$search.focus(function (e) {

				$(this).parent().addClass('focus');
				// $searchBox.slideDown('fast');
				// });


			})
			$search.blur(function (e) {

				self = $(this);

				setTimeout(function () {

					self.parent().removeClass('focus')

					if (!$search.is(':focus'))

						if (!$search.val().length)
							$search.parent().removeClass('find').find('ul').html('');
				}, 100);

			}).bind('keyup keypress paste', function () {

				if (wp_search.query == $search.val())
					return;

				if (!$search.val().length) {
					$search.parent().removeClass('find').find('ul').html('');

					return;
				}

				wp_search.query = $search.val();

				delay(function () {
					if (!$search.is(':focus'))
						return;

					if (!$search.val().length)
						return;

					$search.parent().addClass('loading');

					$.post(setting.host + 'wp-admin/admin-ajax.php', {
						'action': 'search',
						'value': $search.val()
					}, function (data) {

						$search.parent().removeClass('loading');

						if (!$search.is(':focus'))
							return;

						$search.parent().addClass('find').find('.search-ul').show().html(data);
					});
				}, 1000);
			});
		}
	};

	wp_search.init();


	/* UTILS
		------------------------------------------------------------*/

	// http://stackoverflow.com/questions/4994201/is-object-empty
	// Speed up calls to hasOwnProperty
	var hasOwnProperty = Object.prototype.hasOwnProperty;

	function isEmpty(obj) {
		// null and undefined are "empty"
		if (obj === null) return true;
		// Assume if it has a length property with a non-zero value
		// that that property is correct.
		if (obj.length > 0) return false;
		if (obj.length === 0) return true;
		// Otherwise, does it have any properties of its own?
		// Note that this doesn't handle
		// toString and valueOf enumeration bugs in IE < 9
		for (var key in obj) {
			if (hasOwnProperty.call(obj, key)) return false;
		}
		return true;
	}

	function setDimensions(el) {
		el.width(viewportWidth).height(viewportHeight);
	}

	function sliceRel(url, preSlash, trailingSlash) {
		if (url === undefined) {
			return;
		}

		var hasTrailing = false;

		if (url.slice(-1) === '/') {
			hasTrailing = true;
			// we slice off last '/' either way, to easily
			// use lastIndexOf for last url string
			url = url.slice(0, -1);
		}
		// snatch last part
		url = url.slice(url.lastIndexOf('/') + 1);
		// only if url already had trailing will we add it back
		// when trailingSlash is true.
		if (hasTrailing && trailingSlash) {
			url = url.concat('/');
		}
		if (preSlash) {
			url = '/'.concat(url);
		}
		return url;
	}


	$.fn.extend({

		// implementation of underscore's _.tap ?
		ahem: function (fn) {
			if (typeof fn == 'function') {
				fn.call(this);
			}
			return this;
		},

	});

});