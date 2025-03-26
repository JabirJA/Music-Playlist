// When the index.html loads and the storage_table.js script file is loaded
let tableDiv;
let songName = '';
let artistName = '';
let x = 0;
let isPlaylist = false;

window.addEventListener('load', () => {
    loadDataToTable();
});

function createTable(title, tableDivId, tableId, tableBodyId) {
    let tbl = document.createElement('table');
    tbl.id = tableId;

    let tblheader = document.createElement('thead');
    let thtitle = document.createElement('th');
    thtitle.innerHTML = title;
    tblheader.appendChild(thtitle);
    thtitle.setAttribute('colspan', '4');
    tbl.appendChild(tblheader);

    let tblBody = document.createElement('tbody');
    tblBody.id = tableBodyId;

    let titlerow = document.createElement('tr');
    ['Actions', 'Song Title', 'Artist', 'Cover Art'].forEach(text => {
        let cell = document.createElement('td');
        cell.innerHTML = text;
        titlerow.appendChild(cell);
    });

    tblBody.appendChild(titlerow);
    tbl.appendChild(tblBody);

    let targetDiv = document.getElementById(tableDivId);
    if (targetDiv) {
        targetDiv.appendChild(tbl);
    }

    tbl.setAttribute("border", "1");
}

function loadDataToTable() {
    removeTable("playlistBody");  // Clear table before loading data
    let storedPlaylist = JSON.parse(localStorage.getItem('playlist')) || [];
    storedPlaylist.forEach(song => {
        addRow(song.trackName, song.artistName, song.artworkUrl, "playlistBody");
    });
}

function addRow(songName, artistName, artworkUrl, tableBodyId) {
    let body = document.getElementById(tableBodyId);
    let contentrow = document.createElement('tr');

    // Actions Column
    let actionsCell = document.createElement('td');
    actionsCell.style.display = 'flex';
    actionsCell.style.verticalAlign = 'middle';
    actionsCell.style.justifyContent = 'center'
    actionsCell.style.alignItems = 'center';
    actionsCell.style.paddingTop = '10px';
    actionsCell.style.paddingBottom = '20px';
    actionsCell.style.gap = '5px';
    isPlaylist = (tableBodyId === "playlistBody");

    if (isPlaylist) {
        // Remove Button
        let removeButton = document.createElement('button');
        removeButton.innerHTML = '–';
        removeButton.onclick = () => {
            let currentRow = removeButton.closest('tr');
            let trackName = currentRow.cells[1].innerText;
            let artistName = currentRow.cells[2].innerText;
            let artworkUrl = currentRow.cells[3].querySelector('img').src;

            let song = { trackName, artistName, artworkUrl };
            removeSongFromPlaylist(song);    // Remove from localStorage
        };
        actionsCell.appendChild(removeButton);

        // Move Up Button
        let upButton = document.createElement('button');
        upButton.innerHTML = '🔼';
        upButton.onclick = () => moveUp(contentrow);
        actionsCell.appendChild(upButton);

        // Move Down Button
        let downButton = document.createElement('button');
        downButton.innerHTML = '🔽';
        downButton.onclick = () => moveDown(contentrow);
        actionsCell.appendChild(downButton);
    } else {
        let addButton = document.createElement('button');
        addButton.innerHTML = '＋';
        addButton.onclick = () => {
            let currentRow = addButton.closest('tr');
            let trackName = currentRow.cells[1].innerText;
            let artistName = currentRow.cells[2].innerText;
            let artworkUrl = currentRow.cells[3].querySelector('img').src;

            addRow(trackName, artistName, artworkUrl, "playlistBody");

            let song = { trackName, artistName, artworkUrl };
            addSongToPlaylist(song);

            currentRow.remove();
        };
        actionsCell.appendChild(addButton);
    }
    
    contentrow.appendChild(actionsCell);

    // Song Title Column
    let songCell = document.createElement('td');
    songCell.innerHTML = songName;
    contentrow.appendChild(songCell);

    // Artist Column
    let artistCell = document.createElement('td');
    artistCell.innerHTML = artistName;
    contentrow.appendChild(artistCell);

    // Artwork Column
    let artworkCell = document.createElement('td');
    let img = document.createElement('img');
    img.src = artworkUrl;
    img.alt = "Artwork";
    img.style.width = '60px';
    img.style.height = '60px';
    artworkCell.appendChild(img);
    contentrow.appendChild(artworkCell);

    body.appendChild(contentrow);
}

function removeTable(tableBodyId) {
    let tableBody = document.getElementById(tableBodyId);
    if (tableBody) {
        while (tableBody.rows.length > 1) {
            tableBody.deleteRow(1);
        }
    }
}

function addSongToPlaylist(song) {
    const playlist = JSON.parse(localStorage.getItem('playlist')) || [];
    playlist.push(song);
    localStorage.setItem('playlist', JSON.stringify(playlist));
    loadDataToTable();
}

function removeSongFromPlaylist(song) {
    const playlist = JSON.parse(localStorage.getItem('playlist')) || [];

    // Find the index of the song to remove
    const songIndex = playlist.findIndex(s =>
        s.trackName === song.trackName &&
        s.artistName === song.artistName &&
        s.artworkUrl === song.artworkUrl
    );

    if (songIndex !== -1) {
        playlist.splice(songIndex, 1);
        localStorage.setItem('playlist', JSON.stringify(playlist));
        loadDataToTable();
    }
}

