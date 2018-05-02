function showTable() {
  $('#algTable').show();
  $('#noTable').show();
}

function hideTable() {
  $('#algTable').hide();
  $('#noTable').hide();
}

function removeAlg(requiredAlg, algArray, solAlgArray) {
  var result;
  for (index = 0; index < algArray.length; ++index) {
    value = solAlgArray[index];
    if (value == requiredAlg) {
      result = value;
      algArray.splice(index, 1);
      solAlgArray.splice(index, 1);
      break;
    }
  }
}

function callPhp(opt, algorithm, arrayReq) {
  if (arrayReq == 'ollAlgs') {
    var algType = 'oll';
    arrayReq = ollAlgs;
    solArrayReq = ollAlgsSol;
    parent = parentOllAlgs;
    parentSol = parentOllAlgsSol;
  }
  if (arrayReq == 'pllAlgs') {
    var algType = 'pll';
    arrayReq = pllAlgsSol;
    solArrayReq = pllAlgsSol;
    parent = parentPllAlgs;
    parentSol = parentPllAlgsSol;
  }
  if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
  }
  else {
    // code for IE6, IE5
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("debug").innerHTML = this.responseText;
    }
  };
  xmlhttp.open("GET", "selectknown.php?q="+opt+"&alg="+algorithm+"&algtype="+algType, true);
  xmlhttp.send();
  if (opt == 1) {
    removeAlg(algorithm, arrayReq, solArrayReq);
  	var pos = parentSol.indexOf(algorithm);
  	arrayReq.push(parent[pos]);
  	solArrayReq.push(algorithm);
  }
  else if ((opt == 2) || (opt == 3)) {
  	removeAlg(algorithm, arrayReq, solArrayReq);
  }
}

function createTable() {
  var table = document.getElementById("algTable");
  var r = 1;
  var insertCellHere = table.insertRow();
  while ((row = table.rows[r++]) && (r <= parentOllAlgsSol.length+2)) {
    var c=0;
    insertCellHere = table.insertRow();
    insertCellHere.insertCell(0);
    insertCellHere.insertCell(1);
    insertCellHere.insertCell(2);
    insertCellHere.insertCell(3);
    insertCellHere.insertCell(4);
    while(cell = row.cells[c++]) {
      if (c == 1) {
        cell.innerHTML = "OLL";
      }
      if (c == 2) {
        cell.innerHTML = parentOllAlgsSol[r-3];
	  }
      if (c == 3) {
        cell.innerHTML = '\
          <input type="radio" name="o'+(r+1)+'" id="k'+(r+1)+'" onclick="callPhp(1, parentOllAlgsSol['+(r-3)+'], \'ollAlgs\')">\
          <label for="k'+(r+1)+'" class="option">\
            <div class="box">\
              <div class="row1 green"></div><div class="row1 orange"></div><div class="row1 green"></div>\
              <div class="row2 yellow"></div><div class="row2 blue"></div><div class="row2 yellow"></div>\
              <div class="row3 green"></div><div class="row3 red"></div><div class="row3 white"></div>\
            </div>\
          </label>\
        ';
      }
      if (c == 4) {
        cell.innerHTML = '\
          <input type="radio" name="o'+(r+1)+'" id="l'+(r+1)+'" onclick="callPhp(2, parentOllAlgsSol['+(r-3)+'], \'ollAlgs\')">\
          <label for="l'+(r+1)+'" class="option">\
            <div class="box">\
              <div class="row1 green"></div><div class="row1 orange"></div><div class="row1 green"></div>\
              <div class="row2 yellow"></div><div class="row2 blue"></div><div class="row2 yellow"></div>\
              <div class="row3 green"></div><div class="row3 red"></div><div class="row3 white"></div>\
            </div>\
      	  </label>\
      	';
      }
      if (c == 5) {
        cell.innerHTML = '\
          <input type="radio" name="o'+(r+1)+'" id="n'+(r+1)+'" onclick="callPhp(3, parentOllAlgsSol['+(r-3)+'], \'ollAlgs\')" checked>\
          <label for="n'+(r+1)+'" class="option">\
            <div class="box">\
              <div class="row1 green"></div><div class="row1 orange"></div><div class="row1 green"></div>\
              <div class="row2 yellow"></div><div class="row2 blue"></div><div class="row2 yellow"></div>\
              <div class="row3 green"></div><div class="row3 red"></div><div class="row3 white"></div>\
            </div>\
          </label>\
        ';
      }
    }
  }
  insertCellHere = table.insertRow();
  while ((row = table.rows[r++]) && (r <= parentPllAlgsSol.length+61)) {
  	c=0;
  	insertCellHere = table.insertRow();
  	insertCellHere.insertCell(0);
  	insertCellHere.insertCell(1);
  	insertCellHere.insertCell(2);
  	insertCellHere.insertCell(3);
  	insertCellHere.insertCell(4);
  	while(cell = row.cells[c++]) {
      if (c == 1) {
        cell.innerHTML = "PLL";
      }
      if (c == 2) {
        cell.innerHTML = parentPllAlgsSol[r-62];
      }
      if (c == 3) {
        cell.innerHTML = '\
          <input type="radio" name="o'+(r+1)+'" id="k'+(r+1)+'" onclick="callPhp(1, parentPllAlgsSol['+(r-62)+'], pllAlgsSol)">\
      	  <label for="k'+(r+1)+'" class="option">\
            <div class="box">\
              <div class="row1 green"></div><div class="row1 orange"></div><div class="row1 green"></div>\
              <div class="row2 yellow"></div><div class="row2 blue"></div><div class="row2 yellow"></div>\
              <div class="row3 green"></div><div class="row3 red"></div><div class="row3 white"></div>\
            </div>\
      	  </label>\
      	';
      }
	  if (c == 4) {
        cell.innerHTML = '\
          <input type="radio" name="o'+(r+1)+'" id="l'+(r+1)+'" onclick="callPhp(2, parentPllAlgsSol['+(r-62)+'], pllAlgsSol)">\
          <label for="l'+(r+1)+'" class="option">\
            <div class="box">\
              <div class="row1 green"></div><div class="row1 orange"></div><div class="row1 green"></div>\
              <div class="row2 yellow"></div><div class="row2 blue"></div><div class="row2 yellow"></div>\
              <div class="row3 green"></div><div class="row3 red"></div><div class="row3 white"></div>\
            </div>\
          </label>\
        ';
	  }
      if (c == 5) {
        cell.innerHTML = '\
          <input type="radio" name="o'+(r+1)+'" id="n'+(r+1)+'" onclick="callPhp(3, parentPllAlgsSol['+(r-62)+'], pllAlgsSol)" checked>\
          <label for="n'+(r+1)+'" class="option">\
            <div class="box">\
              <div class="row1 green"></div><div class="row1 orange"></div><div class="row1 green"></div>\
              <div class="row2 yellow"></div><div class="row2 blue"></div><div class="row2 yellow"></div>\
              <div class="row3 green"></div><div class="row3 red"></div><div class="row3 white"></div>\
            </div>\
          </label>\
        ';
      }
    }
  }
}