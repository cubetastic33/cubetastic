var statsInfoDialog = new mdc.dialog.MDCDialog(document.querySelector('#statsInfoDialog'));
var statsDialog = new mdc.dialog.MDCDialog(document.querySelector('#statsDialog'));
const graphDetailSelect = new mdc.select.MDCSelect(document.querySelector('#graphDetailSelect'));
var lastNSolvesTextField = new mdc.textField.MDCTextField(document.querySelector('#lastNSolvesTextField'));
var slider = document.getElementById('lastNHoursSlider');

noUiSlider.create(slider, {
	start: [7, 22],
  step: 1,
	connect: true,
  margin: 1,
  tooltips: [true, true],
	range: {
		'min': 1,
		'max': 24
	}
});

var hourMap = ['1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM', '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM','12:00 PM',
               '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM', '12:00 AM'];

$('#hoursRange').text('Range: '+hourMap[parseInt(slider.noUiSlider.get()[0])-1] + ' - '+hourMap[parseInt(slider.noUiSlider.get()[1])-1]);

slider.noUiSlider.on('change', function() {
  $('#hoursRange').text('Range: '+hourMap[parseInt(slider.noUiSlider.get()[0])-1] + ' - '+hourMap[parseInt(slider.noUiSlider.get()[1])-1]);
  drawDateTimeGraph();
});

document.querySelector('.statsInfoIcon').addEventListener('click', function (evt) {
  statsInfoDialog.lastFocusedTarget = evt.target;
  statsInfoDialog.show();
});

var ctx = $('#solves_graph');
window.chartObj = false;

document.querySelector('#statsIcon').addEventListener('click', function (evt) {
  statsDialog.lastFocusedTarget = evt.target;
  statsDialog.show();
  if (timesForAvg.length > 0) {
    if (graphDetailSelect.value === 'solves') {
      $('#solvesGraphIntro').show();
      $('#dateTimeGraphIntro').hide();
      drawGraphOfSolve(parseInt(lastNSolvesTextField.value));
      $('#lastNSolves').change(function() {
        drawGraphOfSolve(parseInt($(this).val()));
      });
    } else {
      $('#solvesGraphIntro').hide();
      $('#dateTimeGraphIntro').show();
      drawDateTimeGraph();
    }
    $('#graphDetailSelect select').change(function() {
      if ($(this).val() === 'solves') {
        $('#solvesGraphIntro').show();
        $('#dateTimeGraphIntro').hide();
        drawGraphOfSolve(parseInt(lastNSolvesTextField.value));
        $('#lastNSolves').change(function() {
          drawGraphOfSolve(parseInt($(this).val()));
        });
      } else {
        $('#solvesGraphIntro').hide();
        $('#dateTimeGraphIntro').show();
        drawDateTimeGraph();
      }
    });
  }
});

function drawGraphOfSolve(lastNSolves) {
  if (window.chartObj !== false) {
    window.chartObj.destroy();
  }
  window.chartObj = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',
    // The data for our dataset
    data: {
      labels: Array.from(Array(Math.min(timesForAvg.length, lastNSolves)),(x,i)=>i+1+(timesForAvg.length - ((Array.from(timesForAvg, x => x/1000)).slice(-lastNSolves)).length)),
      datasets: [
        {
          label: 'Solve Time',
          lineTension: 0,
          borderColor: '#FFC107',
          data: (Array.from(timesForAvg, x => x/1000)).slice(-lastNSolves),
          spanGaps: true
        }
      ]
    },

    // Configuration options go here
    options: {
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}

function drawDateTimeGraph() {
  if (window.chartObj !== false) {
    window.chartObj.destroy();
  }
  var timesForHourlyAvg = {};
  var yesterdaysTimes = Array(24).fill('-');
  var todaysTimes = Array(24).fill('-');
  todaysTimes[0] = yesterdaysTimes[0] = todaysTimes[23] = yesterdaysTimes[23] = 0;
  var latestDate = new Date();
  timesForHourlyAvg[latestDate.getDate()-1] = {};
  timesForHourlyAvg[latestDate.getDate()] = {};
  for (var i = 0; i < Object.keys(allTimes).length; i++) {
    var date = new Date(parseInt(Object.keys(allTimes)[i]));
    if (date.getDate() === latestDate.getDate() || date.getDate() === (latestDate.getDate()-1)) {
      if (timesForHourlyAvg[date.getDate()][date.getHours()] == null) {
        timesForHourlyAvg[date.getDate()][date.getHours()] = [];
      }
      timesForHourlyAvg[date.getDate()][date.getHours()].push(allTimes[Object.keys(allTimes)[i]]);
    }
  }
  /*Now, timesForHourlyAvg should have a structure like this:
  {
    16: {
      7: [23096, 25025],
      18: [24175, 26413]
    },
    17: {
      7: [30962, 33032],
      20: [27415, 21489]
    }
  }*/
  if (Object.keys(timesForHourlyAvg).length > 1 && Object.keys(timesForHourlyAvg[Object.keys(timesForHourlyAvg)[0]]).length > 0) {
    //The user has done at least one solve yesterday
    for (var i = 0; i < Object.keys(timesForHourlyAvg[Object.keys(timesForHourlyAvg)[0]]).length; i++) {
      var calcAvgOf = timesForHourlyAvg[Object.keys(timesForHourlyAvg)[0]][Object.keys(timesForHourlyAvg[Object.keys(timesForHourlyAvg)[0]])[i]];
      avg = (calcAvgOf.reduce(add, 0) - Array.min(calcAvgOf) - Array.max(calcAvgOf))/(calcAvgOf.length-2);
      yesterdaysTimes[parseInt(Object.keys(timesForHourlyAvg[Object.keys(timesForHourlyAvg)[0]])[i])] = parseInt(avg)/1000;
    }
  }
  if (Object.keys(timesForHourlyAvg).length > 1 && Object.keys(timesForHourlyAvg[Object.keys(timesForHourlyAvg)[1]]).length > 0) {
    //The user has done at least one solve today
    for (var i = 0; i < Object.keys(timesForHourlyAvg[Object.keys(timesForHourlyAvg)[1]]).length; i++) {
      var calcAvgOf = timesForHourlyAvg[Object.keys(timesForHourlyAvg)[1]][Object.keys(timesForHourlyAvg[Object.keys(timesForHourlyAvg)[1]])[i]];
      avg = (calcAvgOf.reduce(add, 0) - Array.min(calcAvgOf) - Array.max(calcAvgOf))/(calcAvgOf.length-2);
      console.log(calcAvgOf, avg);
      todaysTimes[parseInt(Object.keys(timesForHourlyAvg[Object.keys(timesForHourlyAvg)[1]])[i])] = parseInt(avg)/1000;
    }
  }
  if (todaysTimes[parseInt(slider.noUiSlider.get()[0])-1] == '-') {
    todaysTimes[parseInt(slider.noUiSlider.get()[0])-1] = [0];
  }
  if (todaysTimes[parseInt(slider.noUiSlider.get()[1])-1] == '-') {
    todaysTimes[parseInt(slider.noUiSlider.get()[1])-1] = [0];
  }
  if (yesterdaysTimes[parseInt(slider.noUiSlider.get()[0])-1] == '-') {
    yesterdaysTimes[parseInt(slider.noUiSlider.get()[0])-1] = [0];
  }
  if (yesterdaysTimes[parseInt(slider.noUiSlider.get()[1])-1] == '-') {
    yesterdaysTimes[parseInt(slider.noUiSlider.get()[1])-1] = [0];
  }

  window.chartObj = new Chart(ctx, {
  // The type of chart we want to create
  type: 'line',
  // The data for our dataset
  data: {
    labels: hourMap.slice(parseInt(slider.noUiSlider.get()[0])-1, parseInt(slider.noUiSlider.get()[1])),
    datasets: [
      {
        label: 'Yesterday',
        lineTension: 0.1,
        borderColor: '#1A237E',
        data: yesterdaysTimes.slice(parseInt(slider.noUiSlider.get()[0])-1, parseInt(slider.noUiSlider.get()[1])),
        spanGaps: true
      },
      {
        label: 'Today',
        lineTension: 0.1,
        borderColor: '#FFC107',
        data: todaysTimes.slice(parseInt(slider.noUiSlider.get()[0])-1, parseInt(slider.noUiSlider.get()[1])),
        spanGaps: true
      }
    ]
  },

  // Configuration options go here
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});
}
