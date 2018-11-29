require("dotenv").config();
require("./keys.js");

var fs = require("fs");
var axios = require("axios");
var moment = require("moment");
var Spotify = require('node-spotify-api');
var inquirer = require("inquirer");

let doIt = 0

const choicesArray = ["Get Concerts.", "Get Song.", "Get Movie.", "Do what the txt file says."]

let concertThis = function () {
    inquirer.prompt([{
        type: "input",
        message: "What artist would you like to search for?",
        name: "artist"
    }]).then(result => {
        var artist = result.artist.replace(/\s/g, "+");

        if (artist === undefined || artist === "") {
            artist = "BrunoMars"
        }

        var url = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

        axios({
            method: 'get',
            url: url,
            responseType: 'json'
        }).then(function (response) {
            console.log("Here is your result" + "\n" +
                "Location: " + response.data[0].venue.name + ", " + response.data[0].venue.city + ", " + response.data[0].venue.region + ", " + response.data[0].venue.country + "." + "\n" +
                "Date: " + moment(response.data[0].datetime).format("MM/DD/YYYY"))
        });
    })

}
let spotifyThis = function () {

    inquirer.prompt([{
        type: "input",
        message: "What is the name of your song?",
        name: "song",
    }]).then(result => {

        var song = result.song;

        if (song === undefined || song === "") {
            song = "The Sign ace of base"
        }

        var spotify = new Spotify({
            id: process.env.SPOTIFY_ID,
            secret: process.env.SPOTIFY_SECRET,
        });

        spotify.search({
            type: "track",
            query: song,
        }).then(function (response) {
            console.log("Here is your result." + "\n" +
                "Artist(s): " + response.tracks.items[0].artists[0].name + "\n" +
                "Song: " + response.tracks.items[0].name + "\n" +
                "Link: " + response.tracks.items[0].preview_url + "\n" +
                "Album: " + response.tracks.items[0].album.name)
        })
    })


}

let movieThis = function () {
    inquirer.prompt([{
        type: "input",
        message: "What movie would you like to search for?",
        name: "movie"
    }]).then(result => {
        var movie = result.movie.replace(/\s/g, "+");

        var url = "http://www.omdbapi.com/?apikey=a3f03ecf&t=" + movie;

        if (movie === undefined || movie === "") {
            console.log("If you haven't watched 'Mr.Nobody' then you should: http://www.imdb.com/title/tt0485947/" + "\nIt's on Netflix!")
        }

        else {
            axios({
                method: "get",
                url: url,
                responseType: "json"
            }).then(function (response) {
                console.log("Here is your result." + "\n" +
                    "Title: " + response.data.Title + "\n" +
                    "Year: " + response.data.Year + "\n" +
                    "IMDB Rating: " + response.data.Ratings[0].Value + "\n" +
                    "Rotten Tomatoes Score: " + response.data.Ratings[1].Value + "\n" +
                    "Country: " + response.data.Country + "\n" +
                    "Language: " + response.data.Language + "\n" +
                    "Plot Synopsis: " + response.data.Plot + "\n" +
                    "Actors: " + response.data.Actors)
            })
        }
    }).catch(err => {
        console.log(err)
    })


}

let doWhatItSays = function () {
    fs.readFile("./random.txt", "utf8", function (err, data) {
        console.log("Doing what it says.")

        var cmdString = data.split(',');
        var fileCommand = cmdString[0].trim();
        var param = cmdString[1].trim();

        switch (fileCommand) {

            case "concert-this":
                concertThis(param);
                break;

            case "spotify-this-song":
                spotifyThis(param);
                break;

            case "movie-this":
                movieThis(param);
                break;
        }
    })
}


inquirer.prompt([{
    type: "list",
    message: "What would you like to do?",
    choices: choicesArray,
    name: "command",
}
]).then(result => {
    console.log(result.command)
    switch (result.command) {
        case "Get Concerts.":
            concertThis();
            break;

        case "Get Song.":
            spotifyThis()
            break;

        case "Get Movie.":
            movieThis()
            break;

        case "Do what the txt file says.":
            doWhatItSays();
    }
})

