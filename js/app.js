// console.log(option)

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
