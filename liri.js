// code to read and set any environment variables with the dotenv package
require("dotenv").config();

//required to import 
// variables
var keys =require('./keys.js');
var fs = require("fs");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var request = require("request");
liriReturn = process.argv[2];
var movieName = process.argv.slice(3).join(" ");
var artist = process.argv.slice(3).join(" ");
var moment = require("moment");

//switches commands
switch (liriReturn) {
    case "concert-this":
        concertThis();
        break;

    case "spotify-this-song":
        spotifyThisSong();
        break;

    case "movie-this":
        movieThis();
        break;

    case "do-what-it-says":
        doWhatItSays();
        break

    // default if the user didn't put a request
    default: console.log("Mr. Nobody" + "\n" + "http://www.imdb.com/title/tt0485947/")
}

//function for concert artis or band name
function concertThis() {
    
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=6ed39e2172dd306dd90a7d5593d3bd5d";

    request(queryUrl, function(error, response, body) {
        if(!error && response.statusCode === 200) {
            var myConcert = JSON.parse(body)[0];
            var queryUrlThis =
                "Name Of The Venue: " + myConcert.venue.name + "\n" +
                "Venue Location: " + myConcert.venue.city + "\n" + 
                "Date Of The Event: " + moment(myConcert.datetime).format("MM/DD/YYYY");

            console.log(queryUrlThis);
        } else {
            console.log("error: " + err);
            return;
        };
    });
};

//Spotify  command for artist, song name, preview, album
function spotifyThisSong(trackName) {
    
    var trackName = process.argv.slice(3).join(" ");
    if (!trackName) {
        trackName = "The Sign";
    };
    songRequest = trackName;
    spotify.search({ type: 'track', query: songRequest},
    function(err, data) {
        if (!err) {
            var trackInfo = data.tracks.items;
            for (var i = 0; i < 5; i++) {
                if (trackInfo[i] != undefined) {
                    var spotifyResults = 
                        "Artist: " + trackInfo[i].artists[0].name + "\n" +
                        "Song: " + trackInfo[i].name +  "\n " +
                        "Preview URL: " + trackInfo[i].preview_url + "\n " +
                        "Album: " + trackInfo[i].album.name + "\n "

                    console.log(spotifyResults);
                    console.log(' ');
                };
            };
        } else {
            console.log("error: " + err);
            return;
        };
    });
};


// run a request to the OMDB API with the movie 
function movieThis() {
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(error, response, body) {
        //if the request is successful
        if (!error && response.statusCode === 200) {
            //pull requested data is readable format
            var myMovieData = JSON.parse(body);
            var queryUrlResults =
                "Title: " + myMovieData.Title + "\n" +
                "Year: " + myMovieData.Year + "\n" +
                "iMDB Rating: " + myMovieData.imdbRating + "\n" +
                "Rotten Tomatoes Rating: " + myMovieData.Ratings[0].Value + "\n" +
                "Origin Country: " + myMovieData.Country + "\n" +
                "Language: " + myMovieData.Language + "\n" +
                "Plot: " + myMovieData.Plot + "\n" +
                "Actors: " + myMovieData.Actors + "\n"
            
            console.log(queryUrlResults);
        }
    })
};

//function for the do what it says using the "fs" node pakacge 
function doWhatItSays() {
    fs.writeFile("random.txt", 'spotify-this-song,"The Sign"', function (err) {
        var song = "spotify-this-song,'The Sign'"

        if (err) {
            return console.log(err);
        };

        console.log(song)
    })
}