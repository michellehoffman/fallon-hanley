$('nav li').on('click', scroll);
$('.contact input').on('focus', focusLabel);
$('.contact input').on('blur', unfocusLabel);
$('.contact textarea').on('focus', focusLabel);
$('.contact textarea').on('blur', unfocusLabel);
$('#contact-email').on('blur', validateEmail);

function scroll() {
  var section = this.id;
  scrollTo(section);
}

function scrollTo(name) {
  $('html, body').animate({
    scrollTop: ($(`section.${ name }`).offset().top)
  });
}

function focusLabel() {
  var label = $(this).siblings('label');
  $(label).addClass('focus');
}

function unfocusLabel() {
  var label = $(this).siblings('label');
  $(label).removeClass('focus');
}

function displayError(element, message) {
  $(element).text(message);
}

function removeError(element) {
  $(element).text('');
}

function testEmail(email) {
  var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
}

function validateEmail(e) {
  var email = String(this.value).toLowerCase();
  var validEmail = testEmail(email);
  var errorContainer = $(this).siblings('.error-container');
  var invalidMessage = 'Email must be a valid format';

  validEmail ? removeError(errorContainer) : displayError(errorContainer, invalidMessage);
}




