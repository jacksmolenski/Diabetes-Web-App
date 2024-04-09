window.onscroll = function() {
    scrollFunction();
  };
  
  function scrollFunction() {
    var btn = document.getElementById("backToTopBtn");
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      btn.style.display = "block";
    } else {
      btn.style.display = "none";
    }
  }

  function backToTop() {
    document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0; 
  }
  