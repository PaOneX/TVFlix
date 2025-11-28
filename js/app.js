console.log("Hello, TVFlix!");


function searchMovie(){


    let txtMovie = document.getElementById("txtMovie").value;

const requestOptions = {
  method: "GET",
  redirect: "follow"
};

fetch(`http://www.omdbapi.com/?t=${txtMovie}&apikey=afa85712`, requestOptions)
  .then((response) => response.json())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}