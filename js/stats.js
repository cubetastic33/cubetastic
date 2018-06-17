var statsInfoDialog = new mdc.dialog.MDCDialog(document.querySelector('#statsInfoDialog'));
var statsDialog = new mdc.dialog.MDCDialog(document.querySelector('#statsDialog'));
const graphDetailSelect = new mdc.select.MDCSelect(document.querySelector('#graphDetailSelect'));
var lastNSolvesTextField = new mdc.textField.MDCTextField(document.querySelector('#lastNSolvesTextField'));

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
  window.chartObj = new Chart(ctx, {
  // The type of chart we want to create
  type: 'line',
  // The data for our dataset
  data: {
    labels: ['11 - 6', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00'],
    datasets: [
      {
        label: 'Yesterday',
        borderColor: '#1A237E',
        data: ['-', 19.167, '-', 16.147, 18.832, 14.416, 17.175, 21.426, 19.145, 13.637, '-', 14.167, 17.415, 15.157, '-', 16.748, '-'],
        spanGaps: true
      },
      {
        label: 'Today',
        borderColor: '#FFC107',
        data: [20.465, '-', '-', 15.415, 20.498, 16.167, 18.635, '-', 20.574, 13.184, 21.842, 14.164, 16.475, 19.765, 18.845, 14.167, '-'],
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
