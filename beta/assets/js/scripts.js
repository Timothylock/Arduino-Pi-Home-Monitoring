function updateClock() {
    var now = new Date(), // current date
        months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ampm;

    // a cleaner way than string concatenation
    var date = [months[now.getMonth()], now.getDate()].join(' ');

    // Update date and time elements
    $('#date').html(date);
    $('#time').html(strTime);
}

function getWeather() {
    $.simpleWeather({
        location: 'Toronto, ON',
        unit: 'c',
        success: function(weather) {
            $("#weather_degrees").html(weather.temp + '&deg;' + weather.units.temp);
            $("#weather_condition").html(weather.currently);
            $("#weather_lowhigh").html('Low: ' + weather.low + ' High: ' + weather.high);
        },
        error: function(error) {
            $("#weather_degrees").html('N/A');
            $("#weather_condition").html("Weather Unavailable");
            $("#weather_lowhigh").html('Low: N/A High: N/A');
        }
    });
}

function loadingModal() {
    $("#modal_title").text("Loading");
    $("#modal_content").html("Please wait...");

    $("#myModal").modal('show');
}

function togglehistoryview() {
    loadingModal();

    // Get lights / statuses and update modal
    $.ajax({
        url: '/log',
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa(Cookies.get('username') + ":" + Cookies.get('password')));
        },
        success: function(response) {
            var insert = "<ul class='list-group'>";
            for(var i = response.length - 1; i >= 0; i--){
                var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
                d.setUTCSeconds(response[i].substring(0,response[i].length - 4)/1000);
                insert += "<li class='list-group-item'>" + response[i] + "</li>";
            }

            insert += "</ul>";

            $("#modal_title").text("Last 10 History");
            $("#modal_content").html(insert);
        },
        error: function(response) {
            $("#modal_title").text("Error");
            $("#modal_content").html("The server was unable to load the history. The response was: " + response);
        }
    });
}

setInterval(updateClock, 1000);
setInterval(getWeather, 600000);
