(function() {
  const headerHeight = document.querySelector('#nav').offsetHeight;
  // set #hero-header height to screen height - header height
  document.querySelector('#hero-header').style.height = `calc(100vh - ${headerHeight}px)`;
})