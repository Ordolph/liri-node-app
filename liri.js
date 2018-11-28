require("dotenv").config();
require("./keys.js");

var fs = require("fs");
var axios = require("axios")
var moment = require("moment")
var Spotify = require('node-spotify-api');

const command = process.argv[2];

switch (command) {
    case "concert-this":

        let artist = process.argv[3];
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

    case "spotify-this-song":
        var song;

        if (process.argv[3] === undefined) {
            song = "The Sign ace of base"
        }

        else {
            song = process.argv[3]
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

    case "movie-this":
        let movie = process.argv[3];
        var url = "http://www.omdbapi.com/?apikey=a3f03ecf&t=" + movie;

        if (movie === undefined) {
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

    case "do-what-it-says":
        fs.readFile("./random.txt", "utf8", function(err, data) {
            console.log(data)
        })
        
}
