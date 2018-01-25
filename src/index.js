import './sass/index.sass';
import './js/mail.js';
require('../node_modules/jquery.mmenu/dist/jquery.mmenu.all.js');
require('../node_modules/bootstrap-validator/dist/validator.min.js');
require.context('./images', true);
require('./images/og/og-image.jpg');

$(function(){

  $(window).scroll(function() {

    if( $(this).scrollTop() >= 10 && $('body').width() > 767 ) {
      $('.top-line').addClass('stickytop');
      $('header').css('padding-top', '115px');
    }

    else {
      $('.top-line').removeClass('stickytop');
      $('header').css('padding-top', '100px');
    }

  })

  // Menu scroll

  $(".menu a").click(function (event) {
    if ($('body').width() >= 992) {

      event.preventDefault();
  		var id  = $(this).attr('href'),
  		top = $(id).offset().top;
  		$('html, body').animate({
        scrollTop: top
      }, 1500);

    }
  });

  // Mobile menu
  $("#my-menu").mmenu({
    navbar: {
      title: 'Меню'
    },
    "extensions": [
      "theme-white",
      "pagedim-black"
    ],
    offCanvas: {
      blockUI: true
    },
   "pageScroll": true
  });

  var MMENU = $("#my-menu").data( "mmenu" );

  $("#mmenu-button").click(function(e) {
    e.preventDefault();
    MMENU.open();
  });

  var hamburger = $('.hamburger')

  MMENU.bind( "open:finish", function() {
    hamburger.addClass( "is-active" );
  });

  MMENU.bind( "close:finish", function() {
    hamburger.removeClass( "is-active" );
  });

  var preloader = document.createElement("div");
  document.body.appendChild(preloader);
  $('.preloader').addClass('preloader')

  $(window).resize(function(){
    if($('body').width() >= 992) {
      MMENU.close();
    };
  });

  // Preloader
  $(window).on('load', function() {
    $('.preloader').delay(50).fadeOut('slow');
    if($(window).scroll() > 10) {
      $('.top-line').addClass('stickytop');
    };
  });

});
