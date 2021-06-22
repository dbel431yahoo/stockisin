// $("#file").change(function (ev) {
//   var reader = new FileReader();
//   reader.onload = function (e) {
//     var data = new Uint8Array(e.target.result);
//     var workbook = XLSX.read(data, { type: 'array' });
//     var jsonArr = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
//     var arrmm = jsonArr.map(function (d) {
//       return [keyArr[d.Symbol].ISIN_NUMBER];
//     })
//     var filename = new Date().getTime() + ".csv";
//     var ws_name = "SheetJS";
//     var wb = XLSX.utils.book_new(), ws = XLSX.utils.aoa_to_sheet(arrmm);
//     XLSX.utils.book_append_sheet(wb, ws, ws_name);
//     XLSX.writeFile(wb, filename);
//   };
//   reader.readAsArrayBuffer(ev.target.files[0]);
// })


function csvDownload(rows) {
  let csvContent = "data:text/csv;charset=utf-8,"
    + rows.map(e => e.join(",")).join("\n");
  var encodedUri = encodeURI(csvContent);
  var downloadLink = document.createElement("a");
  downloadLink.href = encodedUri;
  downloadLink.download = new Date().getTime() + ".csv";  //Name the file here
  document.body.appendChild(downloadLink);
  downloadLink.click();
}


///////////////////////////////////
$("#upload").click(function () {
  $($(this).data("click")).click();
})
function writeFile(arrmm) {
  var filename = new Date().getTime() + "_.csv";
  var ws_name = "SheetJS";
  var wb = XLSX.utils.book_new(), ws = XLSX.utils.aoa_to_sheet(arrmm);
  XLSX.utils.book_append_sheet(wb, ws, ws_name);
  XLSX.writeFile(wb, filename);
}
function read(file) {

  return new Promise(function (rev, rej) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var data = new Uint8Array(e.target.result);
      var workbook = XLSX.read(data, { type: 'array' });

      var jsonArr = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      var _arrData = jsonArr.map(function (d) {

        var k = "";
        if (keyArr[d.Symbol] && keyArr[d.Symbol].ISIN_NUMBER) {
          k = keyArr[d.Symbol].ISIN_NUMBER
        }
        return k;
        // return _.values(d);
      })
      rev(_arrData);
    };
    reader.readAsArrayBuffer(file);
  })

}
function readFile(fileData, arrData, cb) {
  if (fileData.length == 0) {
    cb(arrData.flat());
  } else {
    var file = fileData.shift();
    read(file).then(function (resp) {
      arrData.push(resp);
      readFile(fileData, arrData, cb)
    })
  }

}
$("#file").change(function (ev) {
  debugger;

  readFile(Array.from(ev.target.files), [], function (data) {
    data = _.chain(data).filter(function (d) { return d != ""; }).map(function (d) { return [d]; }).uniq().value();
    csvDownload(data);
    // writeFile(data);
  })
})


