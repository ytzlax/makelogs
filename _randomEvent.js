var _ = require('lodash');
var WeightedList = require('./samples/weighted_list');

var samples = require('./samples');
var argv = require('./argv');

var eventCounter = -1;
var count = argv.total;

var countOfDays = (function () {
    var cursor = argv.start.clone();
    var count = 0;
    var end = argv.end.valueOf();

    if (cursor.valueOf() <= end) {
        do {
            cursor.add(1, 'day');
            count += 1;
        } while (cursor.valueOf() <= end);
    }

    return count;
}());
var countPerDay = Math.ceil(count / countOfDays);

var indexInterval = argv.indexInterval;
var dayMoment = argv.start.clone();
var day;

function setEvent(iEvent, iDate, iDeviceObject) {
    "use strict";
    // var events = [];
    //_.forEach(iDeviceObject.drivers, function (value, key) {
    //var event = _.cloneDeep(iEvent);
    iEvent.total_ram = iDeviceObject.totalRam;
    iEvent.driver = iDeviceObject.drivers;
    // console.log("driver", iEvent.driver);
    iEvent.geo = {
        coordinates: samples.airports(),
        src: samples.countries(),
        dest: samples.countries()
    };
    iEvent.geo.srcdest = iEvent.geo.src + ':' + iEvent.geo.dest;
    iEvent.current_user_last_login_date = iDate.setHours(iDate.getHours() - 4);

    iEvent.cpu_usage = (Math.random() * (0 - 60) + 60).toFixed(2);

    iEvent.ram_usage = (Math.random() * (0 - 8) + 8).toFixed(2);

    iEvent.bw_out_usage = (Math.random() * (0 - 10) + 10).toFixed(2);
    iEvent.bw_in_usage = (Math.random() * (0 - 50) + 50).toFixed(2);

    iEvent.user_time_load = (Math.random() * (5 - 90) + 90).toFixed(2);

    //iEvent.driver = samples.driver();
    iEvent.chrome_ver = samples.chrome_ver();

    //iEvent.process_name = samples.process_name();
    //iEvent.process_ram_usage = (Math.random() * (2 - 6) + 6).toFixed(2);
    // iEvent.process_cpu_usage = (Math.random() * (2 - 40) + 40).toFixed(2);
    iEvent.process_list = [{
        "name": "chrome",
        "ram_usage": (Math.random() * (2 - 6) + 6).toFixed(2),
        "cpu_usage": (Math.random() * (2 - 40) + 40).toFixed(2)
    }]
    // iEvent.site1 = samples.site1();
    // iEvent.site2 = samples.site2();
    // iEvent.site3 = samples.site3();
    // iEvent.site4 = samples.site4();
    iEvent.host = 'theacademyofperformingartsandscience.org';
    iEvent.request = '/people/type:astronauts/name:' + samples.astronauts() + '/profile';
    iEvent.url_data = 'https://' + iEvent.host + iEvent.request;
}

function setAlert(iEvent) {
    "use strict";
    iEvent.alert = samples.alert();
}

/**
 * 6-11 morning
 * 11- 16 noon
 * 16 -21 evening
 * 21 - 6 night
 * @param iEvent
 * @param iHour
 */
function setTimeOfDay(iEvent, iHour, iMinutes, iSeconds, iMs) {
    "use strict";
    var newTime = new Date('2017', '04', '25', iHour, iMinutes, iSeconds, iMs);
    var sixDate = new Date("2017-05-25T06:00:00.000Z");
    var elavenDate = new Date("2017-05-25T11:00:00.000Z");
    var fourDate = new Date("2017-05-25T16:00:00.000Z");
    var nineDate = new Date("2017-05-25T21:00:00.000Z");

    if (newTime > sixDate && newTime <= elavenDate) {
        iEvent.time_of_day = "morning";
    }
    else if (newTime > elavenDate && newTime <= fourDate) {
        iEvent.time_of_day = "noon";
    }
    else if (newTime > fourDate && newTime <= nineDate) {
        iEvent.time_of_day = "evening";
    }
    else {
        iEvent.time_of_day = "night";
    }
}

function setDayOfWeek(iEvent, iDate) {
    "use strict";
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    iEvent.day_of_week = days[iDate.getDay()];
}

module.exports = function RandomEvent(indexPrefix) {
    "use strict";
    //var events = [];
    var event = {};

    var i = ++eventCounter;
    var iInDay = i % countPerDay;

    if (day && iInDay === 0) {
        dayMoment.add(1, 'day');
        day = null;
    }

    if (day == null) {
        day = {
            year: dayMoment.year(),
            month: dayMoment.month(),
            date: dayMoment.date(),
        };
    }

    var ms = samples.lessRandomMsInDay();

    // extract number of hours from the milliseconds
    var hours = Math.floor(ms / 3600000);
    ms = ms - hours * 3600000;

    // extract number of minutes from the milliseconds
    var minutes = Math.floor(ms / 60000);
    ms = ms - minutes * 60000;

    // extract number of seconds from the milliseconds
    var seconds = Math.floor(ms / 1000);
    ms = ms - seconds * 1000;

    // apply the values found to the date
    var date = new Date(day.year, day.month, day.date, hours, minutes, seconds, ms);
    setTimeOfDay(event, hours, minutes, seconds, ms);
    setDayOfWeek(event, date);
    var dateAsIso = date.toISOString();

    switch (indexInterval) {
        case 'yearly':
            event.index = indexPrefix + dateAsIso.substr(0, 4);
            break;

        case 'monthly':
            event.index = indexPrefix + dateAsIso.substr(0, 4) + '.' + dateAsIso.substr(5, 2);
            break;
        case 'daily':
            event.index = indexPrefix + dateAsIso.substr(0, 4) + '.' + dateAsIso.substr(5, 2) + '.' + dateAsIso.substr(8, 2);
            break;

        default:
            event.index = indexPrefix + Math.floor(i / indexInterval);
            break;
    }

    event['@timestamp'] = dateAsIso;
    event.log_type = samples.log_type();
    event.time = dateAsIso;
    event.device_ip = samples.ips();
    var deviceObject = samples.device();
    event.device_name = deviceObject.name;
    event.current_user = samples.currentUser();

    if (event.log_type === "log") {
        setEvent(event, date, deviceObject);
    }
    else {
        setAlert(event);

    }
    //event.extension = samples.extensions();
    //event.response = samples.responseCodes();


    // event['@tags'] = [
    //     samples.tags(),
    //     samples.tags2()
    // ];

    //event.referer = 'http://' + samples.referrers() + '/' + samples.tags() + '/' + samples.astronauts();

    //event.bytes = event.response < 500 ? samples.lessRandomRespSize(event.extension) : 0;

    // switch (event.extension) {
    //     case 'php':
    //         event.host = 'theacademyofperformingartsandscience.org';
    //         event.request = '/people/type:astronauts/name:' + samples.astronauts() + '/profile';
    //         event.phpmemory = event.memory = event.bytes * 40;
    //         break;
    //     case 'gif':
    //         event.host = 'motion-media.theacademyofperformingartsandscience.org';
    //         event.request = '/canhaz/' + samples.astronauts() + '.' + event.extension;
    //         break;
    //     case 'css':
    //         event.host = 'cdn.theacademyofperformingartsandscience.org';
    //         event.request = '/styles/' + samples.stylesheets();
    //         break;
    //     default:
    //         event.host = 'media-for-the-masses.theacademyofperformingartsandscience.org';
    //         event.request = '/uploads/' + samples.astronauts() + '.' + event.extension;
    //         break;
    // }

    //event['@message'] = event.ip + ' - - [' + dateAsIso + '] "GET ' + event.request + ' HTTP/1.1" ' +
    //  event.response + ' ' + event.bytes + ' "-" "' + event.agent + '"';
    //event.spaces = 'this   is   a   thing    with lots of     spaces       wwwwoooooo';
    //event.xss = '<script>console.log("xss")</script>';
    // event.headings = [
    //     '<h3>' + samples.astronauts() + '</h5>',
    //     'http://' + samples.referrers() + '/' + samples.tags() + '/' + samples.astronauts()
    // ];
    // event.links = [
    //     samples.astronauts() + '@' + samples.referrers(),
    //     'http://' + samples.referrers() + '/' + samples.tags2() + '/' + samples.astronauts(),
    //     'www.' + samples.referrers()
    // ];

    //event.relatedContent = samples.relatedContent();

    // event.machine = {
    //     os: samples.randomOs(),
    //     ram: samples.randomRam()
    // };
    return event;
};
