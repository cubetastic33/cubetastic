/*const fs = require('fs');
fs.readFile('../../../Downloads/cstimer.txt', 'utf-8', (err, data) => {
	data = JSON.parse(data);
	penalty = data['session2'][10][0][0];
	time = data['session2'][10][0][1];
	scramble = data['session2'][10][1];
	comment = data['session2'][10][2];
	console.log(`Penalty: ${penalty}\nTime: ${time}\nScramble: ${scramble}\nComment: ${comment}`);
});
*/

var importFile = false;
var importFrom = false;

$('#chooseImportFileCSV, #chooseImportFileTXT').hide();

$('#importInfo').click(() => {
	importInfoDialog.show();
});

$('#csTimer').click(() => {
	importFrom = 'csTimer';
	$('#chooseImportFileCSV').click();
});

$('#TNT').click(() => {
	importFrom = 'TNT';
	$('#chooseImportFileCSV').click();
});

$('#twistyTimer').click(() => {
	importFrom = 'twistyTimer';
	$('#chooseImportFileTXT').click();
});

var csTimerPenalty = {'0': 'None', '2000': '+2', '-1': 'DNF'}

function convertToSeconds(time) {
	if (time.includes(':') === true) {
		return (parseInt(time.split(':')[0])*60)+parseFloat(time.split(':')[1]);
	} else {
		return parseFloat(time);
	}
}

function convertToTime(milliseconds) {
	if (Math.floor(milliseconds/60000) == 0) {
    return '0:'+(milliseconds%60000-milliseconds%1000)/1000+'.'+('000'+parseInt(milliseconds%1000)).substr(-3);
  }
  return Math.floor(milliseconds/60000)+':'+(milliseconds%60000-milliseconds%1000)/1000+'.'+('000'+parseInt(milliseconds%1000)).substr(-3);
}

$('#chooseImportFileCSV').change((f) => {
	$('#importedSample').html(`
		Imported data:<br>
		<div id="importedCategory" class="mdc-select mdc-select--box">
			<select class="mdc-select__native-control">
				<option value="3x3x3">3x3x3</option>
				<option value="2x2x2">2x2x2</option>
				<option value="3x3x3 bld">3x3x3 bld</option>
				<option value="Pyraminx">Pyraminx</option>
				<option value="4x4x4">4x4x4</option>
				<option value="5x5x5">5x5x5</option>
				<option value="6x6x6">6x6x6</option>
				<option value="7x7x7">7x7x7</option>
				<option value="Megaminx">Megaminx</option>
				<option value="Skweb">Skweb</option>
				<option value="Square 1">Square 1</option>
			</select>
			<label class="mdc-floating-label">Select the category</label>
			<div class="mdc-line-ripple"></div>
		</div>
		<table>
			<thead>
				<tr>
					<th>No.</th><th>Time</th><th>Penalty</th>
				</tr>
			</thead>
			<tbody></tbody>
		</table>
	`);
	if (importFrom === 'csTimer') {
		$('#importedSample table thead tr').append('<th>Scramble</th><th>Comment</th>');
	}
	mdc.select.MDCSelect.attachTo(document.querySelector('#importedCategory'));
	window.importFile = f.target.files[0];
	var delimeters = {'csTimer': ';', 'TNT': ','};
	Papa.parse(importFile, {
		delimeter: delimeters[importFrom],
		header: true,
		step: function(results, parser) {
			if (Object.keys(results['data'][0]).length > 1) {
				var time = results['data'][0]['Time'];
				var penalty = 'None';
				if (time.includes('+') === true) {
					time = ((convertToSeconds(time.split('+')[0])*100)-200)/100;
					penalty = '+2';
				} else if (time.includes('DNF(') === true) {
					time = time.split('(')[1].split(')')[0];
					penalty = 'DNF';
				} else if (time === 'DNF') {
					time = 0;
					penalty = 'DNF';
				}
				if (importFrom === 'csTimer') {
					$('#importedSample table tbody').append(`
						<tr>
							<td>${results['data'][0]['No.']}</td><td>${time}</td><td>${penalty}</td><td class="displayScramble">${results['data'][0]['Scramble']}</td><td class="comment">${results['data'][0]['Comment'].substr(0, 50)}</td>
						</tr>
					`);
				} else if (importFrom === 'TNT') {
					$('#importedSample table tbody').append(`
						<tr>
							<td>${parseInt(results['data'][0][Object.keys(results['data'][0])[0]])+1}</td><td>${time}</td><td>${penalty}</td>
						</tr>
					`);
				}
			}
		}
	});
	$('#importDialog .mdc-button--unelevated').prop('disabled', false);
});

$('#chooseImportFileTXT').change((f) => {
	$('#importedSample').html(`
		Imported data:<br>
		<div id="importedCategory" class="mdc-select mdc-select--box">
			<select class="mdc-select__native-control">
				<option value="3x3x3">3x3x3</option>
				<option value="2x2x2">2x2x2</option>
				<option value="3x3x3 bld">3x3x3 bld</option>
				<option value="Pyraminx">Pyraminx</option>
				<option value="4x4x4">4x4x4</option>
				<option value="5x5x5">5x5x5</option>
				<option value="6x6x6">6x6x6</option>
				<option value="7x7x7">7x7x7</option>
				<option value="Megaminx">Megaminx</option>
				<option value="Skweb">Skweb</option>
				<option value="Square 1">Square 1</option>
			</select>
			<label class="mdc-floating-label">Select the category</label>
			<div class="mdc-line-ripple"></div>
		</div>
		<table>
			<thead>
				<tr>
					<th>No.</th><th>Time</th><th>DNF</th><th>Scramble</th>
				</tr>
			</thead>
			<tbody></tbody>
		</table>
	`);
	mdc.select.MDCSelect.attachTo(document.querySelector('#importedCategory'));
	window.importFile = f.target.files[0];
	var n = 0;
	Papa.parse(importFile, {
		delimeter: ';',
		step: function(results, parser) {
			if (results['data'][0].length > 1) {
				n++;
				var dnf = 'No';
				console.log(results['data'][0]);
				if (results['data'][0].length === 4 && results['data'][0][3] === 'DNF') {
					dnf = 'Yes';
				}
				$('#importedSample table tbody').append(`
					<tr><td>${n}</td><td>${results['data'][0][0]}</td><td>${dnf}</td><td class="displayScramble">${results['data'][0][1]}</td></tr>
				`);
			}
		}
	});
	$('#importDialog .mdc-button--unelevated').prop('disabled', false);
});

$('#importDialog .mdc-button--unelevated').click(function() {
	if (window.importFile !== false) {
		//Import the solves
		if (firebase.auth().currentUser) {
			//Upload solves to firebase
			var solves = [$('#selectSession + div ul').attr('data-selected'), $('#importedCategory select').val()];
			Papa.parse(importFile, {
				delimeter: ';',
				step: function(results, parser) {
					if (importFrom === 'twistyTimer') {
						console.log('fewfew');
						if (results['data'][0].length > 1) {
							var penalty = 0;
							var time = results['data'][0][0];
							if (results['data'][0].length === 4 && results['data'][0][3] === 'DNF') {
								time = convertToSeconds(time)*1000;
								penalty = 1;
							} else {
								time = convertToSeconds(time)*1000;
							}
							console.log(time);
							var d = new Date();
							solves.push([time, results['data'][0][1], penalty, d.getTime()]);
						}
					} else {
						if (Object.keys(results['data'][0]).length > 1) {
							var time = results['data'][0]['Time'];
							var penalty = 0;
							if (time.includes('+') === true) {
								time = ((convertToSeconds(time.split('+')[0]))*100-200)*10;
								penalty = 2;
							} else if (time.includes('DNF(') === true) {
								time = convertToSeconds(time)*1000;
								penalty = 1;
							} else if (time === 'DNF') {
								//This is a DNF solve from TNT
								time = 0;
								penalty = 1;
							} else {
								time = convertToSeconds(time)*1000;
							}
							console.log(time);
							var d = new Date();
							if (importFrom === 'csTimer') {
								solves.push([time, results['data'][0]['Scramble'], penalty, d.getTime(), results['data'][0]['Comment'].substr(0, 50)]);
							} else if (importFrom === 'TNT') {
								solves.push([time, 'Imported from TNT', penalty, d.getTime()]);
							}
						}
					}
				},
				complete: function(results) {
					//Now, solves has all the data we need, so make an AJAX call to upload the solves
					console.log(solves);
					$('#importedSample').html(`
						<br><br>
						<div role="progressbar" class="mdc-linear-progress mdc-linear-progress--indeterminate">
							<div class="mdc-linear-progress__buffering-dots"></div>
							<div class="mdc-linear-progress__buffer"></div>
							<div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
								<span class="mdc-linear-progress__bar-inner"></span>
							</div>
							<div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
								<span class="mdc-linear-progress__bar-inner"></span>
							</div>
						</div>
					`);
					$('#importDialog footer button').prop('disabled', true);
					$.ajax({
						type: 'POST',
						url: '/uploadSolves',
						data: {
							uid: firebase.auth().currentUser.uid,
							solves: JSON.stringify(solves)
						},
						success: function(result) {
							console.log(result);
							if (result === 'Done!') {
								$('#importedSample').empty();
								$('#importDialog footer .mdc-dialog__footer__button--cancel').prop('disabled', false);
								importDialog.close();
							}
						}
					});
				}
			});
		} else {
			//Add solves to indexedDB
			Papa.parse(importFile, {
				delimeter: ';',
				header: true,
				step: function(results, parser) {
					if (Object.keys(results['data'][0]).length > 1) {
						var time = results['data'][0]['Time'];
						var plusTwo = false;
						if (time.includes('+') === true) {
							time = convertToTime((convertToSeconds(time.split('+')[0])-2) * 1000);
							plusTwo = true;
						} else if (time.includes('DNF(') === true) {
							time = 'DNF'
						} else if (time !== 'DNF') {
							time = convertToTime(convertToSeconds(time)*1000);
						}
						var times = database.transaction(['times'], 'readwrite').objectStore('times');
						var d = new Date();
						if (importFrom === 'csTimer') {
							if (results['data'][0]['Comment'].length > 0) {
								times.add({session: $('#selectSession + div ul').attr('data-selected'), time: time, scramble: results['data'][0]['Scramble'], category: $('#importedCategory select').val(), plusTwo: plusTwo, solveDate: d.getTime(), comment: results['data'][0]['Comment']});
							} else {
								times.add({session: $('#selectSession + div ul').attr('data-selected'), time: time, scramble: results['data'][0]['Scramble'], category: $('#importedCategory select').val(), plusTwo: plusTwo, solveDate: d.getTime()});
							}
						} else if (importFrom === 'TNT') {
							times.add({session: $('#selectSession + div ul').attr('data-selected'), time: time, scramble: '', category: $('#importedCategory select').val(), plusTwo: plusTwo, solveDate: d.getTime()});
						}
						showTimesFromIndexedDB();
					}
				}
			});
			importDialog.close();
		}
	}
});
