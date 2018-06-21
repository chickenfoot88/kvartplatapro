import './sass/index.sass';
require('../node_modules/jquery.mmenu/dist/jquery.mmenu.all.js');
require('../node_modules/bootstrap-validator/dist/validator.min.js');
require('../node_modules/lightbox2/dist/js/lightbox.min.js');
require.context('./images', true);
require('./images/og/og-image.jpg');


$(function(){

  appendForm();
  submitForm();

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

  //Contact Form
  function appendForm() {

    var form = '<form class="callback" id="contact-form" data-toggle="validator">' +
    '<div class="success">' +
    '<span>Ваше письмо успешно отправлено!</span>' +
    '</div><input type="hidden" readonly="" name="project_name" value="Квартплата">' +
    '<input type="hidden" readonly="" name="admin_email" value="info@kvartplata.pro">' +
    '<input type="hidden" readonly="" name="form_subject" value="Письмо с сайта Квартплата">' +
    '<div class="form-group has-feedback"><input class="form-control" id="name" type="text" placeholder="Ваше имя" name="Имя" autocomplete="name" minlength="2" required="">' +
    '</div><div class="form-group has-feedback">' +
    '<input class="form-control" id="email" type="email" placeholder="Ваш email" name="Email" autocomplete="email" required="">' +
    '</div>' +
    '<div class="form-group has-feedback">' +
    '<textarea class="form-control" id="message" placeholder="Ваше сообщение" name="Сообщение">' +
    '</textarea>' +
    '</div><div class="help-block with-errors">' +
    '</div>' +
    '<div class="form-group">' +
    '<button class="btn pull-right contact-form-send disabled" type="button">Отправить</button>' +
    '</div>' +
    '</form>';

    $('.form').append(form);
  };

  function submitForm() {

    $("#contact-form").validator({
      'focus': false
    }).on('submit', function(e) {

      if(!e.isDefaultPrevented()) {

        var th = $(this);
        $.ajax({
          type: "POST",
          url: "mail.php",
          data: th.serialize(),
          success: function() {
            $(th).find(".success").addClass("active").css("display", "flex").hide().fadeIn();
            setTimeout(function() {
              $(th).find(".success").removeClass("active").fadeOut();
              th.trigger("reset");
            }, 3000);
          },
          error: function () {
          },
          failure: function () {
          }
        })

        return false;
      }

    });

  };

});
