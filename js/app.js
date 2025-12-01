// console.log(option)

loadFeaturedToday();
loadTopMovie();
loadUpComingMovies();
loadHeroSection();

function discover(title) {
  console.log(title);
  
  document.getElementById("txtMovie").value = title;
}
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
              document.getElementById("txtActors").innerText = result.Actors;
              document.getElementById("txtGenre").innerText = result.Genre;
              document.getElementById("txtYear").innerText = result.Year;
              document.getElementById("txtRating").innerText = result.Rated;
              document.getElementById("txtDate").innerText = result.Released;
              document.getElementById("txtRuntime").innerText = result.Runtime;
              document.getElementById("txtImb").innerText = result.imdbRating;
              document.getElementById("txtTomato").innerText =
                result.Ratings[1].Value;
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
    `http://www.omdbapi.com/?t=${encodeURIComponent(movieTitle)}&apikey=afa85712`,
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
          // Show the results section
          const resultDiv = document.getElementById("resultdiv");
          resultDiv.classList.remove("d-none");
          
          // Populate the results
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
          
          // Handle Rotten Tomatoes rating
          if (result.Ratings && result.Ratings.length > 1) {
            document.getElementById("txtTomato").innerText = result.Ratings[1].Value;
          } else {
            document.getElementById("txtTomato").innerText = "N/A";
          }
          
          document.getElementById("txtImg").innerHTML = `<img src="${result.Poster}" class="card-img-top" alt="${result.Title}">`;
          
          // Scroll to results section
          resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    })
    .catch((error) => console.error("Error loading movie details:", error));
}

function loadHeroSection() {
  fetch("json/movie.json")
    .then((res) => res.json())
    .then((data) => {
      if (!Array.isArray(data) || data.length === 0) return;
      const container = document.getElementById("navrow");
      if (!container) return;
      container.innerHTML = "";
      
      // Fetch all movies first
      const fetchPromises = data.map((item) => {
        if (!item) return Promise.resolve(null);
        return fetch(`https://www.omdbapi.com/?i=${item}&apikey=afa85712`)
          .then((r) => r.json())
          .catch((err) => {
            console.error("Featured item fetch error", err);
            return null;
          });
      });
      
      Promise.all(fetchPromises).then((movies) => {
        const validMovies = movies.filter(m => m && m.Poster && m.Title);
        
        // Group movies into sets of 3 for each carousel item
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
                    <h2 class="movie-title">${movie.Title}</h2>
                    <div class="movie-info">
                      <span class="release-badge">${movie.Year}</span>
                      <span class="platform-text">${movie.Genre || 'N/A'}</span>
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
            const html = `<div class="col-lg-4 col-md-6">
                <div class="movie-card">
                   <div class="imgDiv">
                    <div class="movie-poster">
                        <img src=${data1.Poster}" alt="${data1.Title}" class="movie-image">
                    </div>
                    </div>
                    <div class="text-white p-1 fw-bold text-center">${data1.Title}</div>
                    <div class="movie-info">
                        <p><strong>Year:</strong> ${data1.Year}</p>
                        <p><strong>Genre:</strong> ${data1.Genre} </p>
                        <p><strong>Director:</strong> ${data1.Director} </p>
                        <p><strong>Stars:</strong> ${data1.Actors} </p>
                        <button class="show-more-btn">Show More</button>
                    </div>
                </div>
            </div>`;

            container.insertAdjacentHTML("beforeend", html);
          })
          .catch((err) => {
            console.error("Featured item fetch error", err);
          });
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
            const html = `<div class="col-lg-4 col-md-6">
                <div class="movie-card">
                   <div class="imgDiv">
                    <div class="movie-poster">
                        <img src=${data1.Poster}" alt="${data1.Title}" class="movie-image">
                    </div>
                    </div>
                    <div class="text-white p-1 fw-bold text-center">${data1.Title}</div>
                    <div class="movie-info">
                        <p><strong>Year:</strong> ${data1.Year}</p>
                        <p><strong>Genre:</strong> ${data1.Genre} </p>
                        <p><strong>Director:</strong> ${data1.Director} </p>
                        <p><strong>Stars:</strong> ${data1.Actors} </p>
                        <button class="show-more-btn">Show More</button>
                    </div>
                </div>
            </div>`;

            container.insertAdjacentHTML("beforeend", html);
          })
          .catch((err) => {
            console.error("Featured item fetch error", err);
          });
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
            const html = `<div class="col-lg-4 col-md-6">
                <div class="movie-card">
                   <div class="imgDiv">
                    <div class="movie-poster">
                        <img src=${data1.Poster}" alt="${data1.Title}" class="movie-image">
                    </div>
                    </div>
                    <div class="text-white p-1 fw-bold text-center">${data1.Title}</div>
                    <div class="movie-info">
                        <p><strong>Year:</strong> ${data1.Year}</p>
                        <p><strong>Genre:</strong> ${data1.Genre} </p>
                        <p><strong>Director:</strong> ${data1.Director} </p>
                        <p><strong>Stars:</strong> ${data1.Actors} </p>
                        <button class="show-more-btn">Show More</button>
                    </div>
                </div>
            </div>`;

            container.insertAdjacentHTML("beforeend", html);
          })
          .catch((err) => {
            console.error("Featured item fetch error", err);
          });
      });
    })
    .catch((err) => console.error("Could not load json/movie.json", err));
}
