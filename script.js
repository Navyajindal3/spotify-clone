let card = document.querySelectorAll('.card-container');
let currentSong = new Audio();
function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);

    // Add leading zeros if needed
    if (minutes < 10) minutes = "0" + minutes;
    if (secs < 10) secs = "0" + secs;

    return minutes + ":" + secs;
}
card.forEach((element) => {
    element.addEventListener("mouseenter", () => {
        element.querySelector('.play').style.opacity = "1";
        element.querySelector('.play').style.bottom = "110px";
    });
    element.addEventListener("mouseleave", () => {
        element.querySelector('.play').style.opacity = "0";
        element.querySelector('.play').style.bottom = "70px";
    });
    let playButton = element.querySelector('.play');
    playButton.addEventListener("click", () => {
        document.querySelector('.main-right h2').style.display = "none";
        document.querySelector('.spotify-playlists').style.display = "none";
        document.querySelector('.now-playing').style.display = "flex";
        document.querySelector(".back").style.display = "block";
    });

})
async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let i = 0; i < as.length; i++) {
        if (as[i].href.endsWith(".mp3")) {
            songs.push(as[i].href.split("/songs/")[1]);
        };


    };
    return songs;

}
const playMusic = (track) => {
    currentSong.src = "http://127.0.0.1:5500/songs/" + track;
    currentSong.play();
    document.getElementById("play-icon").src = "icons/pause.svg"

    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}


async function main() {
    let songs = await getSongs();
    console.log(songs);

    let songul = document.querySelector(".song-list")
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li class="flex-row">
              <img src="icons/music-icon.svg" width="25px" height="25px">
              <div class="flex-column">
              <span class="song-name">${song.replaceAll("%20", " ")}</span>
              <span class="artist-name">${"By navya"}</span>
              </div>
              <img class="playBtn" src="icons/play-white.svg" width="25px" height="25px">
            </li>`



    }
    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach((e) => {
        e.addEventListener("click", () => {
            playMusic(e.querySelector("span").innerText)
        })

    }
    )
    document.getElementById("play-icon").addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            document.getElementById("play-icon").src = "icons/pause.svg"
        }
        else {
            currentSong.pause();
            document.getElementById("play-icon").src = "icons/play-white.svg"
        }
    })


    document.querySelector(".back").addEventListener("click", () => {
        document.querySelector('.main-right h2').style.display = "block";
        document.querySelector('.spotify-playlists').style.display = "flex";
        document.querySelector('.now-playing').style.display = "none";
        document.querySelector(".back").style.display = "none";
    })
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML =`${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`
        document.getElementById("circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })

    document.getElementById("seekbar").addEventListener("click", (e) => {
        document.getElementById("circle").style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";
        currentSong.currentTime = currentSong.duration * (e.offsetX / e.target.getBoundingClientRect().width);

    })
    document.querySelector(".logo").addEventListener("click",(e)=>{
        if(document.querySelector(".main-left").style.left != "0px"){
            document.querySelector(".main-left").style.left = "0px"
        }
        else{
            document.querySelector(".main-left").style.left = "-100%"
            
        }
    })
    document.getElementById("previous").addEventListener("click", (e)=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if((index-1)>=0){playMusic(songs[index-1].replaceAll("%20", " "))}; 
    }) 
    document.getElementById("next").addEventListener("click", (e)=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if((index+1)<songs.length){playMusic(songs[index+1].replaceAll("%20", " "));}
         
    }) 

    
}



main();
