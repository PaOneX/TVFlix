let option = document.getElementById("option").value;
// cons

function searchMovie(){
  
  console.log("Hello, TVFlix!");

    let txtMovie = document.getElementById("txtMovie").value;

const requestOptions = {
  method: "GET",
  redirect: "follow"
};

fetch(`http://www.omdbapi.com/?t=${txtMovie}&apikey=afa85712`, requestOptions)
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
}
