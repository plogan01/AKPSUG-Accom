$j(document).ready(function () {

    function exportTableToCSV($table, filename) {

        var $rows = $table.find('tr:has(td),tr:has(th)'),

            // Temporary delimiter characters unlikely to be typed by keyboard
            // This is to avoid accidentally splitting the actual contents
            tmpColDelim = String.fromCharCode(11), // vertical tab character
            tmpRowDelim = String.fromCharCode(0), // null character

            // actual delimiter characters for CSV format
            colDelim = '","',
            rowDelim = '"\r\n"',

            // Grab text from table into CSV formatted string
            csv = '"' + $rows.map(function (i, row) {
                var $row = $j(row), $cols = $row.find('td,th');

                return $cols.map(function (j, col) {
                    if (!$j(col).hasClass('ng-hide')) {
                        var $col = $j(col);
                        if ($col.find('p:first').length) {
                            if (!$col.find('p:first').hasClass('ng-hide')) {
                                var text = 'X';
                            } else {
                                var text = '';
                            }
                        } else {
                            var text = $col.text().trim();
                        }
                        return text.replace(/"/g, '""'); // escape double quotes
                    }

                }).get().join(tmpColDelim);

            }).get().join(tmpRowDelim)
                .split(tmpRowDelim).join(rowDelim)
                .split(tmpColDelim).join(colDelim) + '"',



            // Data URI
            csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

        console.log(csv);

        if (window.navigator.msSaveBlob) { // IE 10+
            //alert('IE' + csv);
            window.navigator.msSaveOrOpenBlob(new Blob([csv], { type: "text/plain;charset=utf-8;" }), "csvname.csv")
        }
        else {
            $j(this).attr({ 'download': filename, 'href': csvData, 'target': '_blank' });
        }
    }

    // This must be a hyperlink
    $j("#xx").on('click', function (event) {

        exportTableToCSV.apply(this, [$j('#computer'), 'PEAKS_Computer_Accomodations.csv']);

        // IF CSV, don't do event.preventDefault() or return false
        // We actually need this to be a typical hyperlink
    });

    $j("#xy").on('click', function (event) {

        exportTableToCSV.apply(this, [$j('#paper'), 'PEAKS_Paper_Accomodations.csv']);

        // IF CSV, don't do event.preventDefault() or return false
        // We actually need this to be a typical hyperlink
    });

});