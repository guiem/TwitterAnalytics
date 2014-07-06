google.load("visualization", "1", {packages:["corechart"]});
//google.setOnLoadCallback(drawTweetsPerDayChart(false));

function drawTweetsPerDayChart(dataAux) {
    var data = google.visualization.arrayToDataTable(dataAux);
    var options = {
        //title: 'Tweets por d’a',
        legend: { position: 'bottom' },
        hAxis: { textPosition: 'none' },
        width:1000,
        height:500,
    };
    var chart = new google.visualization.LineChart(document.getElementById('tweets-per-day-chart'));
    chart.draw(data, options);
}
