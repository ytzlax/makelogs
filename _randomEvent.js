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

module.exports = function RandomEvent(indexPrefix) {
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
    event.ip = samples.ips();
    event.extension = samples.extensions();
    event.response = samples.responseCodes();

    event.geo = {
        coordinates: samples.airports(),
        src: samples.countries(),
        dest: samples.countries()
    };
    event.geo.srcdest = event.geo.src + ':' + event.geo.dest;

    event['@tags'] = [
        samples.tags(),
        samples.tags2()
    ];
    event.utc_time = dateAsIso;
    event.referer = 'http://' + samples.referrers() + '/' + samples.tags() + '/' + samples.astronauts();
    event.agent = samples.userAgents();
    event.clientip = event.ip;
    event.bytes = event.response < 500 ? samples.lessRandomRespSize(event.extension) : 0;

    switch (event.extension) {
        case 'php':
            event.host = 'theacademyofperformingartsandscience.org';
            event.request = '/people/type:astronauts/name:' + samples.astronauts() + '/profile';
            event.phpmemory = event.memory = event.bytes * 40;
            break;
        case 'gif':
            event.host = 'motion-media.theacademyofperformingartsandscience.org';
            event.request = '/canhaz/' + samples.astronauts() + '.' + event.extension;
            break;
        case 'css':
            event.host = 'cdn.theacademyofperformingartsandscience.org';
            event.request = '/styles/' + samples.stylesheets();
            break;
        default:
            event.host = 'media-for-the-masses.theacademyofperformingartsandscience.org';
            event.request = '/uploads/' + samples.astronauts() + '.' + event.extension;
            break;
    }

    event.url = 'https://' + event.host + event.request;

    event['@message'] = event.ip + ' - - [' + dateAsIso + '] "GET ' + event.request + ' HTTP/1.1" ' +
        event.response + ' ' + event.bytes + ' "-" "' + event.agent + '"';
    event.spaces = 'this   is   a   thing    with lots of     spaces       wwwwoooooo';
    event.xss = '<script>console.log("xss")</script>';
    event.headings = [
        '<h3>' + samples.astronauts() + '</h5>',
        'http://' + samples.referrers() + '/' + samples.tags() + '/' + samples.astronauts()
    ];
    event.links = [
        samples.astronauts() + '@' + samples.referrers(),
        'http://' + samples.referrers() + '/' + samples.tags2() + '/' + samples.astronauts(),
        'www.' + samples.referrers()
    ];

    event.relatedContent = samples.relatedContent();

    event.machine = {
        os: samples.randomOs(),
        ram: samples.randomRam()
    };

    event.relation = getRelation();
    addBlahFields(event);
    return event;
};

function addBlahFields(event) {
    event.a = event.machine.os;
    event.b = event.machine.ram;
    event.c = event.xss;
    event.d = event.xss;
    event.e = event.xss;
    event.f = event.xss;
    event.g = event.xss;
    event.h = event.machine.ram;
    event.i = event.machine.ram;
    event.g = event.machine.ram;
    event.k = event.machine.ram;
    event.l = event.machine.ram;
    event.m = event.machine.ram;
    event.n = event.machine.ram;
    event.o = event.machine.os;
    event.p = event.machine.ram;
    event.q = event.xss;
    event.r = event.xss;
    event.s = event.xss;
    event.t = event.xss;
    event.u = event.xss;
    event.v = event.machine.ram;
    event.w = event.machine.ram;
    event.x = event.machine.ram;
    event.y = event.machine.ram;
    event.z = event.machine.ram;
    event.aa = event.machine.os;
    event.ba = event.machine.ram;
    event.ca = event.xss;
    event.da = event.xss;
    event.ea = event.xss;
    event.fa = event.xss;
    event.ga = event.xss;
    event.ha = event.machine.ram;
    event.ia = event.machine.ram;
    event.ga = event.machine.ram;
    event.ka = event.machine.ram;
    event.la = event.machine.ram;
    event.ma = event.machine.ram;
    event.na = event.machine.ram;
    event.oa = event.machine.os;
    event.pa = event.machine.ram;
    event.qa = event.xss;
    event.ra = event.xss;
    event.sa = event.xss;
    event.ta = event.xss;
    event.ua = event.xss;
    event.va = event.machine.ram;
    event.wa = event.machine.ram;
    event.xa = event.machine.ram;
    event.ya = event.machine.ram;
    event.za = event.machine.ram;
    event.ab = event.machine.os;
    event.bb = event.machine.ram;
    event.cb = event.xss;
    event.db = event.xss;
    event.eb = event.xss;
    event.fb = event.xss;
    event.gb = event.xss;
    event.hb = event.machine.ram;
    event.ib = event.machine.ram;
    event.gb = event.machine.ram;
    event.kb = event.machine.ram;
    event.lb = event.machine.ram;
    event.mb = event.machine.ram;
    event.nb = event.machine.ram;
    event.ob = event.machine.os;
    event.pb = event.machine.ram;
    event.qb = event.xss;
    event.rb = event.xss;
    event.sb = event.xss;
    event.tb = event.xss;
    event.ub = event.xss;
    event.nc = event.machine.ram;
    event.oc = event.machine.os;
    event.pc = event.machine.ram;
    event.qc = event.xss;
    event.rc = event.xss;
    event.sc = event.xss;
    event.tc = event.xss;
    event.uc = event.xss;


}

function getRandomId() {
    return Math.floor((Math.random() * argv.count) + 1);
}

function getRelation() {
    const idsArr = [];
    for (let i = 0; 4 > i; i++) {
        const randomId = getRandomId();
        if (idsArr.indexOf(randomId) < 0) {
            idsArr.push(randomId);
        }
    }
    return idsArr;
}
