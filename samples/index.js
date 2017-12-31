var _ = require('lodash');
var WeightedList = require('./weighted_list');
var RandomList = require('./random_list');
var RandomSample = require('./random_sample');
var IpGenerator = require('./ip_generator');
var Stochator = require('./stochator');
var roundAllGets = require('./round_all_gets');

var dayMs = 86400000;

var sets = {};

sets.lessRandomMsInDay = roundAllGets(new Stochator({
    min: 0,
    max: dayMs,
    mean: dayMs / 2,
    stdev: dayMs * 0.15,
}, 'get'));

sets.lessRandomRespSize = require('./response_size');
sets.randomRam = new RandomList(require('./ram'));
sets.randomOs = new RandomList(require('./os'));
//sets.driver = new RandomList(require('./drivers'));
sets.chrome_ver = new RandomList(require('./chrome_vers'));

sets.astronauts = new RandomList(require('./astronauts').map(function (name) {
    return name.replace(/\W+/g, '-').toLowerCase();
}));



sets.ips = new IpGenerator(100, 1000);
sets.log_type = new WeightedList(require('./log_type'));

sets.currentUser = new WeightedList(require('./current_users'));
sets.alert = new WeightedList(require('./alerts'));

sets.device = new RandomList(require('./devices'));
sets.process_list = new RandomSample(2, 10, require('./process'));


sets.timezones = new WeightedList({
    '+02:00': 1
});

 sets.airports = new RandomList(require('./airports'));
 sets.countries = new WeightedList(require('./countries'));
// sets.extensions = new WeightedList({
//   'png': 3,
//   'gif': 2,
//   'jpg': 20,
//   'css': 5,
//   'php': 1,
// });

// sets.responseCodes = new WeightedList({
//   200: 92,
//   404: 5,
//   503: 3
// });

// sets.tags = new WeightedList({
//   'error': 6,
//   'warning': 10,
//   'success': 84
// });
//
// sets.tags2 = new WeightedList({
//   'security': 20,
//   'info': 75,
//   'login': 5
// });


// sets.referrers = new WeightedList({
//   'www.slate.com':50,
//   'twitter.com': 35,
//   'facebook.com': 20,
//   'nytimes.com': 10
// });

// sets.stylesheets = new RandomList([
//   'main.css',
//   'app.css',
//   'ads.css',
//   'ad-blocker.css',
//   'pretty-layout.css',
//   'semantic-ui.css'
// ]);
//sets.relatedContent = new RandomSample(0, 5, require('./_content'));

module.exports = _.mapValues(sets, function (set) {
    return (typeof set === 'function') ? set : function () {
        return set.get();
    };
});
