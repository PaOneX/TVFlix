// console.log(option)

loadFeaturedToday();
loadTopMovie();
loadUpComingMovies();
loadHeroSection();

function searchMovie() {
  const option = document.getElementById("option").value;
  console.log(option);

  if (!option) {
    alert("select option");
    return;
  }

  // console.log("Hello, TVFlix!");

  const txtMovie = document.getElementById("txtMovie").value;
  const txtyear = document.getElementById("txtyear").value;

  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  switch (option) {
    case "title":
      fetch(
        `http://www.omdbapi.com/?t=${txtMovie}&y=${txtyear}&apikey=afa85712`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          fetch("components/result/result.html")
            .then((res) => res.text())
            .then((data) => {
              document.getElementById("resultdiv").classList.toggle("d-none");
              document.getElementById("resultsRow").innerHTML = data;
              document.getElementById("txtTitle").innerText = result.Title;
              document.getElementById("txtPlot").innerText = result.Plot;
              document.getElementById("txtDirector").innerText = result.Director;
              document.getElementById("txtActors").innerText = result.Actors;
              document.getElementById("txtGenre").innerText = result.Genre;
              document.getElementById("txtYear").innerText = result.Year;
              document.getElementById("txtCountry").innerText = result.Country;
              document.getElementById("txtDate").innerText = result.Released;
              document.getElementById("txtRuntime").innerText = result.Runtime;
              document.getElementById("txtImb").innerText = result.imdbRating;
              document.getElementById("txtTomato").innerText = result.Ratings[0].Value;
              document.getElementById(
                "txtImg"
              ).innerHTML = ` <img src="${result.Poster}" class="card-img-top" alt="...">`;
            });
        })
        .catch((error) => console.error(error));
      break;

    case "imdb":
      fetch(
        `http://www.omdbapi.com/?i=${txtMovie}&apikey=afa85712`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          fetch("components/result/result.html")
            .then((res) => res.text())
            .then((data) => {
              document.getElementById("resultdiv").classList.toggle("d-none");
              document.getElementById("resultsRow").innerHTML = data;
              document.getElementById("txtTitle").innerText = result.Title;
              document.getElementById("txtPlot").innerText = result.Plot;
              document.getElementById(
                "txtImg"
              ).innerHTML = ` <img src="${result.Poster}" class="card-img-top" alt="...">`;
            });
        })
        .catch((error) => console.error(error));
      break;
  }
}

function discover(movieTitle) {
  if (!movieTitle) return;
  
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch(
    `http://www.omdbapi.com/?t=${movieTitle}&apikey=afa85712`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      if (result.Response === "False") {
        alert("Movie not found!");
        return;
      }
      
      fetch("components/result/result.html")
        .then((res) => res.text())
        .then((data) => {
          const resultDiv = document.getElementById("resultdiv");
          resultDiv.classList.remove("d-none");
          
          document.getElementById("resultsRow").innerHTML = data;
          document.getElementById("txtTitle").innerText = result.Title;
          document.getElementById("txtPlot").innerText = result.Plot;
          document.getElementById("txtActors").innerText = result.Actors;
          document.getElementById("txtGenre").innerText = result.Genre;
          document.getElementById("txtYear").innerText = result.Year;
          document.getElementById("txtRating").innerText = result.Rated;
          document.getElementById("txtDate").innerText = result.Released;
          document.getElementById("txtRuntime").innerText = result.Runtime;
          document.getElementById("txtImb").innerText = result.imdbRating;
          
          if (result.Ratings && result.Ratings.length > 1) {
            document.getElementById("txtTomato").innerText = result.Ratings[1].Value;
          } else {
            document.getElementById("txtTomato").innerText = "N/A";
          }
          
          document.getElementById("txtImg").innerHTML = `<img src="${result.Poster}" class="card-img-top" alt="${result.Title}">`;
          
        });
    })
    .catch((error) => console.error("Error loading movie details:", error));
}

function loadHeroSection() {
  fetch("json/carouselMovie.json")
    .then((res) => res.json())
    .then((data) => {
      if (!Array.isArray(data) || data.length === 0) return;
      const container = document.getElementById("navrow");
      if (!container) return;
      container.innerHTML = "";
      
      const fetchPromises = data.map(async (item) => {
        if (!item) return Promise.resolve(null);
        try {
          const r = await fetch(`https://www.omdbapi.com/?t=${item}&apikey=afa85712`);
          return await r.json();
        } catch (err) {
          console.error("Featured item fetch error", err);
          return null;
        }
      });
      
      Promise.all(fetchPromises).then((movies) => {
        const validMovies = movies.filter(m => m && m.Poster && m.Title);
        
        const moviesPerSlide = 3;
        for (let i = 0; i < validMovies.length; i += moviesPerSlide) {
          const slideMovies = validMovies.slice(i, i + moviesPerSlide);
          const isActive = i === 0 ? 'active' : '';
          
          let moviesHtml = '';
          slideMovies.forEach((movie) => {
            moviesHtml += `
              <div class="col-md-4">
                <div class="movie-card">
                  <img
                    src="${movie.Poster}"
                    alt="${movie.Title}"
                    class="movie-image"
                  />
                  <div class="movie-overlay">
                    <div class="movie-infoNav">
                      <span class="release-badge">${movie.Year}</span>
                    </div>
                    <button class="discover-btn" onclick="discover('${movie.Title}');" >Discover a Movie</button>
                  </div>
                </div>
              </div>`;
          });
          
          const carouselItem = `
            <div class="carousel-item ${isActive}">
              <div class="row g-4 px-5">
                ${moviesHtml}
              </div>
            </div>`;
          
          container.insertAdjacentHTML("beforeend", carouselItem);
        }
        
        const carouselElement = document.getElementById('movieCarousel');
        if (carouselElement && typeof bootstrap !== 'undefined') {
          const carousel = new bootstrap.Carousel(carouselElement, {
            interval: 5000,
            ride: 'carousel'
          });
        }
      });
    })
    .catch((err) => console.error("Could not load json/movie.json", err));
}
function loadFeaturedToday() {
  fetch("json/movie.json")
    .then((res) => res.json())
    .then((data) => {
      if (!Array.isArray(data) || data.length === 0) return;
      const container = document.getElementById("featuresRow");
      if (!container) return;
      container.innerHTML = "";
      data.forEach((item) => {
        if (!item) return;
        fetch(`https://www.omdbapi.com/?i=${item}&apikey=afa85712`)
          .then((r) => r.json())
          .then((data1) => {
            const html = `<div data-aos="fade-up-left" data-aos-duration="1000" class="col-lg-3 col-md-4 col-sm-6">
                <div class="movie-card">
                    <div class="movie-rating">${data1.imdbRating || 'N/A'}</div>
                    <img src="${data1.Poster}" alt="${data1.Title}" class="movie-poster">
                    <div class="movie-info">
                        <h3 class="movie-title">${data1.Title}</h3>
                        <div class="movie-meta">
                            <div class="meta-item"><span>${data1.Year}</span></div>
                            <div class="meta-item"><span>${data1.Runtime || 'N/A'}</span></div>
                        </div>
                        <div class="movie-meta">
                            <div class="meta-item"><span>${data1.Genre}</span></div>
                        </div>
                        <div class="action-buttons">
                            <button class="btn btn-watch" onclick="discover('${data1.Title}');">Show More</button>
                            <button class="btn btn-remove"></button>
                        </div>
                    </div>
                </div>
            </div>`;

            container.insertAdjacentHTML("beforeend", html);
          })          
      });
    })
    .catch((err) => console.error("Could not load json/movie.json", err));
}

function loadTopMovie() {
  fetch("json/topMovie.json")
    .then((res) => res.json())
    .then((data) => {
      if (!Array.isArray(data) || data.length === 0) return;
      const container = document.getElementById("topMoviesRow");
      if (!container) return;
      container.innerHTML = "";

      data.forEach((item1) => {
        if (!item1) return;
        fetch(`https://www.omdbapi.com/?i=${item1}&apikey=afa85712`)
          .then((r) => r.json())
          .then((data1) => {
            const html = `<div data-aos="fade-up" data-aos-duration="1000" class="col-lg-3 col-md-4 col-sm-6">
                <div class="movie-card">
                    <div class="movie-rating">${data1.imdbRating || 'N/A'}</div>
                    <img src="${data1.Poster}" alt="${data1.Title}" class="movie-poster">
                    <div class="movie-info">
                        <h3 class="movie-title">${data1.Title}</h3>
                        <div class="movie-meta">
                            <div class="meta-item"><span>${data1.Year}</span></div>
                            <div class="meta-item"><span>${data1.Runtime || 'N/A'}</span></div>
                        </div>
                        <div class="movie-meta">
                            <div class="meta-item"><span>${data1.Genre}</span></div>
                        </div>
                        <div class="action-buttons">
                            <button class="btn btn-watch" onclick="discover('${data1.Title}');">Show More</button>
                            <button class="btn btn-remove"></button>
                        </div>
                    </div>
                </div>
            </div>`;

            container.insertAdjacentHTML("beforeend", html);
          })
      });
    })
    .catch((err) => console.error("Could not load json/movie.json", err));
}

function loadUpComingMovies() {
  fetch("json/upComing.json")
    .then((res) => res.json())
    .then((data) => {
      if (!Array.isArray(data) || data.length === 0) return;
      const container = document.getElementById("upComingRow");
      if (!container) return;
      container.innerHTML = "";

      data.forEach((item1) => {
        if (!item1) return;
        fetch(`https://www.omdbapi.com/?i=${item1}&apikey=afa85712`)
          .then((r) => r.json())
          .then((data1) => {
            const html = `<div data-aos="fade-up" data-aos-duration="1000" class="col-lg-3 col-md-4 col-sm-6">
                <div class="movie-card">
                    <div class="movie-rating">${data1.imdbRating || 'N/A'}</div>
                    <img src="${data1.Poster}" alt="${data1.Title}" class="movie-poster">
                    <div class="movie-info">
                        <h3 class="movie-title">${data1.Title}</h3>
                        <div class="movie-meta">
                            <div class="meta-item"><span>${data1.Year}</span></div>
                            <div class="meta-item"><span>${data1.Runtime || 'N/A'}</span></div>
                        </div>
                        <div class="movie-meta">
                            <div class="meta-item"><span>${data1.Genre}</span></div>
                        </div>
                        <div class="action-buttons">
                            <button class="btn btn-watch" onclick="discover('${data1.Title}');">Show More</button>
                            <button class="btn btn-remove"></button>
                        </div>
                    </div>
                </div>
            </div>`;

            container.insertAdjacentHTML("beforeend", html);
          })
      });
    })
    .catch((err) => console.error("Could not load json/movie.json", err));
}
