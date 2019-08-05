$('nav li').on('click', scroll);

function scroll() {
  var section = this.id;
  scrollTo(section);
}

function scrollTo(name) {
  $('html, body').animate({
    scrollTop: ($(`section.${ name }`).offset().top)
  })
}