$('nav li').on('click', scroll);
$('.contact input').on('focus', focusLabel);
$('.contact input').on('blur', unfocusLabel);
$('.contact textarea').on('focus', focusLabel);
$('.contact textarea').on('blur', unfocusLabel);

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
