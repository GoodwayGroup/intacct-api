const reporters = require('jasmine-reporters');
const path = require('path');

const junitReporter = new reporters.JUnitXmlReporter({
    savePath: path.join(__dirname, '..', '..', 'coverage', 'junit'),
    consolidateAll: false
});
jasmine.getEnv().addReporter(junitReporter);
