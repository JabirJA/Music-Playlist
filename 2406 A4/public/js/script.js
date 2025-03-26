let isTableCreated = false; 
createTable("Playlist", "playlistTable", "table1", "playlistBody");
window.onload = loadDataToTable;

document.getElementById('submit_button').addEventListener('click', getSong);
document.getElementById('song').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        getSong();  // Call the same function as for the button click
    }
});

function getSong() {
    let songName = document.getElementById('song').value.trim();
    if (songName === '') {
        return alert('Please enter a song');
    }

    let songDiv = document.getElementById('songTitle');
    songDiv.innerHTML = ''; // Clear previous results


    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // Parse the response text into a JavaScript object
            let response = JSON.parse(xhr.responseText);
            let songList = `<h3>Songs matching: ${songName}</h3><ul>`;

            if (!isTableCreated) { // creates song list only when button is pressed first
                createTable("Songs", "SongsTable", "table2", "songsBody");
                isTableCreated = true;
            }

            // Ensure we're working with the 'results' array
            if (response.results && Array.isArray(response.results)) {
                // Loop through the 'results' array and display song details
                removeTable("songsBody");
                response.results.forEach((song) => {
                    let artistName = song.artistName;
                    let trackName = song.trackName;
                    let songImg = song.artworkUrl60;
                    addRow(trackName, artistName, songImg, "songsBody");
                });
            } else {
                songList += '<li>No songs found</li>';
            }
            songList += '</ul>';
            songDiv.innerHTML = songList;
        }
    };
    // Send the GET request to your API endpoint
    xhr.open('GET', `/search?song=${encodeURIComponent(songName)}`, true);
    xhr.send();
}

