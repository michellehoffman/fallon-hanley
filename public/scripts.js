$('nav li').on('click', scroll);
$('.contact input').on('focus', focusLabel);
$('.contact textarea').on('focus', focusLabel);
$('.contact input').on('blur', unfocusLabel);
$('.contact textarea').on('blur', unfocusLabel);
$('.contact input').on('blur', checkEmpty);
$('.contact textarea').on('blur', checkEmpty);
$('.contact input').on('input', tryEnableSubmit);
$('.contact textarea').on('input', tryEnableSubmit);
$('.contact input').on('input', tryRemoveError);
$('.contact textarea').on('input', tryRemoveError);
$('#contact-email').on('blur', validateEmail);
$('#contact-form').on('submit', handleSubmit);

function scroll() {
  var section = this.id;
  scrollTo(`section.${section}`);
}

function scrollTo(name) {
  $('html, body').animate({
    scrollTop: ($(name).offset().top)
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

function displayError(input, message) {
  var errorContainer = $(input).siblings('.error-container');

  $(errorContainer).html(`
    <i class="fas fa-exclamation-triangle"></i>
    <p>${ message }</p>
  `);

  $(input).parents('.field').addClass('invalid');
}

function displayMessage(status, message) {
  $('.message-container').html(`
    <div class="alert alert-${ status }">
      <p>${ message }</p>
    </div>
  `)

  scrollTo('.message-container')
  $('input[type="submit"]').val('Submit')
}

function removeError(input) {
  var errorContainer = $(input).siblings('.error-container');

  $(errorContainer).html('');
  $(input).parents('.field').removeClass('invalid');
}

function testEmail(email) {
  var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
}

function validateEmail() {
  var email = String(this.value).toLowerCase();
  var validEmail = testEmail(email);
  var invalidMessage = 'Email must be a valid format';

  validEmail ? removeError(this) : displayError(this, invalidMessage);
}

function tryRemoveError() {
  var email = this.name === 'contact-email';

  if (email) {
    var value = String(this.value).toLowerCase();
    var validEmail = testEmail(value);

    if (validEmail) {
      removeError(this)
    }
  } else {
    var empty = $(this).val() === '';

    if (!empty) {
      removeError(this)
    }
  }
}

function enableSubmit() {
  $('form input[type=submit]').prop('disabled', false);
}

function disableSubmit() {
  $('form input[type=submit]').prop('disabled', true);
}

function tryEnableSubmit() {
  var inputs = $('.contact input').not(':input[type=submit]');
  var textareas = $('.contact textarea');
  var required = [...inputs, ...textareas];
  var complete = required.every((input) => $(input).val() !== '');
  var validEmail = testEmail($('#contact-email').val());

  if (complete && validEmail) {
    enableSubmit()
  } else {
    disableSubmit()
  }
}

function checkEmpty() {
  var empty = $(this).val() === '';

  empty ? displayError(this, 'Input must have a value') : removeError(this);
}

async function apiCall(url, init = { method: 'GET' }) {
  try {
    var response = await fetch(url, init)
    var results = await response.json()

    return results
  } catch(error) {
    return error
  }
}

async function sendEmail(data) {
  var init = {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }
  var results = await apiCall('/contact', init)

  return results
}

function handleError(errors) {
  if (typeof errors === 'array') {
    errors.map(error => {
      var { param, msg } = error
      var input = `#contact-${ param }`

      displayError(input, msg)
    })
  } else {
    displayMessage('error', errors)
  }
}

function handleSuccess(message) {
  var submitButton = $('input[type="submit"]')
  submitButton.val('Sent!')

  displayMessage('success', message)
}

async function handleSubmit(e) {
  e.preventDefault()

  var submitButton = $('input[type="submit"]')
  submitButton.prop('disabled', true)
  submitButton.val('Sending...')

  var name = $(this).find('#contact-name').val()
  var email = $(this).find('#contact-email').val()
  var message = $(this).find('#contact-message').val()
  var _csrf  = $(this).find('input[name="_csrf"]').val()
  var results = await sendEmail({ name, email, message, _csrf })
  var { error, message } = results

  error ? handleError(error) : handleSuccess(message)
}

