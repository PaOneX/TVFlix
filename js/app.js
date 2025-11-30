// console.log(option)

loadFeaturedToday();
loadTopMovie();
loadUpComingMovies();
lo
function searchMovie(){
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
  redirect: "follow"
};

  switch (option) {
    case 'title':
      
fetch(`http://www.omdbapi.com/?t=${txtMovie}&y=${txtyear}&apikey=afa85712`, requestOptions)
  .then((response) => response.json())
  .then((result) => {
    fetch("components/result/result.html").then(res=>res.text()).then(data=>{
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
      document.getElementById("txtTomato").innerText = result.Ratings[1].Value;
      document.getElementById("txtImg").innerHTML = ` <img src="${result.Poster}" class="card-img-top" alt="...">`;
    })


  })
  .catch((error) => console.error(error));
      break;
      
      case 'imdb':
        
  fetch(`http://www.omdbapi.com/?i=${txtMovie}&apikey=afa85712`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      fetch("components/result/result.html").then(res=>res.text()).then(data=>{
        document.getElementById("resultdiv").classList.toggle("d-none");      
        document.getElementById("resultsRow").innerHTML = data;
        document.getElementById("txtTitle").innerText = result.Title;
        document.getElementById("txtPlot").innerText = result.Plot;
        document.getElementById("txtImg").innerHTML = ` <img src="${result.Poster}" class="card-img-top" alt="...">`;
      })
  
  
    })
    .catch((error) => console.error(error));
        break;
      
      


      default:
      break;
  }

}

function loadFeaturedToday() {
  fetch('json/movie.json')
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data) || data.length === 0) return;
      const container = document.getElementById('featuresRow');
      if (!container) return;
      container.innerHTML = '';

      // For each entry in movie.json, fetch details by IMDb ID and render a small card
      data.forEach(item => {
        if (!item) return;
        fetch(`https://www.omdbapi.com/?i=${item}&apikey=afa85712`)
          .then(r => r.json())
          .then(data1 => {
            const title = data1.Title || item.title || 'Untitled';
            const year = data1.Year || '';
            const poster = data1.Poster && data1.Poster !== 'N/A' ? data1.Poster : 'img/placeholder.png';

            const html =              
              `<div class="col-lg-4 col-md-6">
                <div class="movie-card">
                   <div class="imgDiv">
                    <div class="movie-poster">
                        <img src=${poster}" alt="${title}" class="movie-image">
                    </div>
                    </div>
                    <div class="text-warning fw-bold text-center">${title}</div>
                    <div class="movie-info">
                        <p><strong>Year:</strong> ${year}</p>
                        <p><strong>Genre:</strong> Musical / Fantasy</p>
                        <p><strong>Director:</strong> Jon M. Chu</p>
                        <p><strong>Stars:</strong> Ariana Grande (Glinda), Cynthia Erivo (Elphaba), Jonathan Bailey (Fiyero), along with Ethan Slater.</p>
                        <button class="show-more-btn">Show More</button>
                    </div>
                </div>
            </div>`;

            container.insertAdjacentHTML('beforeend', html);
          })
          .catch(err => {
            console.error('Featured item fetch error', err);
          });
      });
    })
    .catch(err => console.error('Could not load json/movie.json', err));
}

function loadTopMovie() {
  fetch('json/topMovie.json')
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data) || data.length === 0) return;
      const container = document.getElementById('topMoviesRow');
      if (!container) return;
      container.innerHTML = '';

      data.forEach(item1 => {
        if (!item1) return;
        fetch(`https://www.omdbapi.com/?i=${item1}&apikey=afa85712`)
          .then(r => r.json())
          .then(data1 => {
          

            const html =              
              `<div class="col-lg-4 col-md-6">
                <div class="movie-card">
                   <div class="imgDiv">
                    <div class="movie-poster">
                        <img src=${data1.Poster && data1.Poster}" alt="${data1.Title}" class="movie-image">
                    </div>
                    </div>
                    <div class="text-warning fw-bold text-center">${data1.Year}</div>
                    <div class="movie-info">
                        <p><strong>Year:</strong> ${data1.Year}</p>
                        <p><strong>Genre:</strong> Musical / Fantasy</p>
                        <p><strong>Director:</strong> Jon M. Chu</p>
                        <p><strong>Stars:</strong> Ariana Grande (Glinda), Cynthia Erivo (Elphaba), Jonathan Bailey (Fiyero), along with Ethan Slater.</p>
                        <button class="show-more-btn">Show More</button>
                    </div>
                </div>
            </div>`;

            container.insertAdjacentHTML('beforeend', html);
          })
          .catch(err => {
            console.error('Featured item fetch error', err);
          });
      });
    })
    .catch(err => console.error('Could not load json/movie.json', err));
}

function loadUpComingMovies() {
  fetch('json/upComing.json')
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data) || data.length === 0) return;
      const container = document.getElementById('upComingRow');
      if (!container) return;
      container.innerHTML = '';

      data.forEach(item1 => {
        if (!item1) return;
        fetch(`https://www.omdbapi.com/?i=${item1}&apikey=afa85712`)
          .then(r => r.json())
          .then(data1 => {
            
            const html =              
              `<div class="col-lg-4 col-md-6">
                <div class="movie-card">
                   <div class="imgDiv">
                    <div class="movie-poster">
                        <img src=${data1.Poster && data1.Poster}" alt="${data1.Title}" class="movie-image">
                    </div>
                    </div>
                    <div class="text-warning fw-bold text-center">${data1.Year}</div>
                    <div class="movie-info">
                        <p><strong>Year:</strong> ${data1.Year}</p>
                        <p><strong>Genre:</strong> Musical / Fantasy</p>
                        <p><strong>Director:</strong> Jon M. Chu</p>
                        <p><strong>Stars:</strong> Ariana Grande (Glinda), Cynthia Erivo (Elphaba), Jonathan Bailey (Fiyero), along with Ethan Slater.</p>
                        <button class="show-more-btn">Show More</button>
                    </div>
                </div>
            </div>`;

            container.insertAdjacentHTML('beforeend', html);
          })
          .catch(err => {
            console.error('Featured item fetch error', err);
          });
      });
    })
    .catch(err => console.error('Could not load json/movie.json', err));
}
