function moveUp(row) {
    let prevRow = row.previousElementSibling;

    // Ensure the row is not the first row in the table body
    if (prevRow && row.rowIndex > 1) {  // Check if the row isn't the first one (index 1 is typically the first data row)
        row.parentNode.insertBefore(row, prevRow);
    }
}


function moveDown(row) {
    let nextRow = row.nextElementSibling;
    if (nextRow) {
        row.parentNode.insertBefore(nextRow, row);
    }
}

