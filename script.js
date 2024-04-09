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

  let slideIndex = 0;
  const slides = document.querySelectorAll('.slideshow-item');
  
  function showSlides() {
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = 'none';
    }
    slideIndex++;
    if (slideIndex > slides.length) {
      slideIndex = 1;
    }
    slides[slideIndex - 1].style.display = 'block';
    setTimeout(showSlides, 8000); // Change image every 2 seconds
  }
  
  showSlides();
  
  