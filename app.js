var tputChart;
var cycleTimeChart;
function queueTimeModel(nIn, wIn, fIn, cIn) {
    // check if charts already exist
    let chartStatus = Chart.getChart("tputChart");
    if (chartStatus != undefined) {
        chartStatus.destroy();
    }
    let chartStatus2 = Chart.getChart("cycleTimeChart");
    if (chartStatus2 != undefined) {
        chartStatus2.destroy();
    }

    console.log(nIn+wIn+fIn+cIn);
    // input data
    let N = nIn;
    let W = wIn;
    let f = fIn;
    let C = cIn;
    
    let nOpt = N/W;
    let F = f*W;
    let E = 1-F;
    let T = N/C;
    let eOpt = 1-f;
    
    let ctf = 0;
    if (E > 0) {
        ctf = W/(E/eOpt);
    }
    let cOpt = C/ctf;
    let tOpt = nOpt/cOpt;
    
    // create data for chart
    numProjectArr = [];
    effArr = [];
    cycleTimeArr = [];
    throughputArr = [];
    
    let maxProjShown = N*2;
    
    for (let i=maxProjShown%5;i<maxProjShown;i+=5) {
      numProjectArr[i/5] = i;
      effArr[i/5] = Max(1-(Max(i,nOpt)/nOpt)*f,0);
      if (effArr[i/5] > 0) {
        cycleTimeArr[i/5] = (cOpt*Max(i,nOpt)/nOpt)/(effArr[i/5]/eOpt);
        throughputArr[i/5] = i/cycleTimeArr[i/5];
      } else {
        cycleTimeArr[i/5] = -1;
        throughputArr[i/5] = 0;
      }
    }

    const ctx = document.getElementById('tputChart').getContext('2d');
    var tputChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: numProjectArr,
            datasets: [{
                label: 'Throughput',
                data: throughputArr,
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 4
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    const ctx2 = document.getElementById('cycleTimeChart').getContext('2d');
    var cycleTimeChart = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: numProjectArr,
            datasets: [{
                label: 'Throughput',
                data: cycleTimeArr,
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 4
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
  }
  
  
  function Max(a, b) {
    if (a > b) {
      return a;
    } else
    {
      return b;
    }
  }