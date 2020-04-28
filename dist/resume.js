var monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];
(function () {
    var request = new XMLHttpRequest();
    request.overrideMimeType('application/json');
    request.open('GET', '/resume.json', true);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            onResumeLoad(JSON.parse(request.responseText));
        }
    };
    request.send(null);
})();
var onResumeLoad = function (resume) {
    var _a = resume.basics, name = _a.name, label = _a.label, website = _a.website, email = _a.email, location = _a.location, summary = _a.summary, profiles = _a.profiles, work = resume.work, education = resume.education, skills = resume.skills, languages = resume.languages;
    document.querySelector('title').innerText = name;
    document.querySelector('#name').innerHTML = name;
    document.querySelector('#label').innerHTML = label;
    document.querySelector('.email').innerHTML = email;
    document.querySelector('.website').innerHTML = website;
    document.querySelector('.location').innerHTML = (location === null || location === void 0 ? void 0 : location.city) + ", " + (location === null || location === void 0 ? void 0 : location.country);
    document.querySelector('.website').innerHTML = "<a href=\"" + website + "\">" + website + "</a>";
    document.querySelector('#summary').innerHTML = summary;
    var profilesHTML = profiles.reduce(function (acc, _a) {
        var network = _a.network, username = _a.username, url = _a.url;
        return (acc += "\n      <div class=\"col-sm-6\">\n      <strong class=\"network\">\n        " + network + "\n      </strong>\n      <div class=\"username\">\n        <div class=\"url\">\n          <a href=\"" + url + "\">" + username + "</a>\n        </div>\n      </div>\n    </div>\n  ");
    }, '');
    document.querySelector('#profiles-list').innerHTML = profilesHTML;
    var workHTML = work.reduce(function (acc, _a) {
        var company = _a.company, startDate = _a.startDate, endDate = _a.endDate, position = _a.position, website = _a.website, highlights = _a.highlights, summary = _a.summary;
        var start = new Date(startDate);
        var formattedStart = monthNames[start.getMonth()] + " " + start.getFullYear();
        var end = new Date(endDate);
        var formattedEnd = !endDate
            ? 'present'
            : monthNames[start.getMonth()] + " " + start.getFullYear();
        var technologies = highlights.reduce(function (techAcc, highlight) {
            return (techAcc += "<li class=\"bullet\">" + highlight + "</li>");
        }, '');
        return (acc += "\n        <div class=\"col-sm-12\">\n          <h4 class=\"strike-through\">\n            <span>" + company + "</span>\n            <span class=\"date\">\n              " + formattedStart + " \u2014 " + formattedEnd + "\n            </span>\n          </h4>\n          <div class=\"website pull-right\">\n            <a href=\"" + website + "\">" + website + "</a>\n          </div>\n          <div class=\"position\">\n            " + position + "\n          </div>\n          <div class=\"summary\">\n            <p>" + summary + "</p>\n          </div>\n          <h4>Technologies</h4>\n          <ul class=\"highlights\">\n            " + technologies + "\n          </ul>\n        </div>\n        ");
    }, '');
    document.querySelector('#work-list').innerHTML = workHTML;
    var educationHTML = education.reduce(function (acc, _a) {
        var institution = _a.institution, area = _a.area, startDate = _a.startDate, endDate = _a.endDate;
        return (acc += "\n      <div class=\"col-sm-12\">\n        <h4 class=\"strike-through\">\n          <span>" + institution + "</span>\n          <span class=\"date\">\n            " + new Date(startDate).getFullYear() + " \u2014 " + new Date(endDate).getFullYear() + "\n          </span>\n        </h4>\n        <div class=\"area\">\n          " + area + "\n        </div>\n        <div class=\"studyType\"></div>\n      </div>\n    ");
    }, '');
    document.querySelector('#education-list').innerHTML = educationHTML;
    var skillsHTML = skills.reduce(function (acc, _a) {
        var name = _a.name;
        return (acc += "\n      <div class=\"col-sm-6\">\n        <div class=\"name\">\n          <h4>" + name + "</h4>\n        </div>\n      </div>\n    ");
    }, '');
    document.querySelector('#skills-list').innerHTML = skillsHTML;
    var languagesHTML = languages.reduce(function (acc, _a) {
        var language = _a.language;
        return (acc += "\n    <div class=\"col-sm-6\">\n      <div class=\"language\">\n        <strong>" + language + "</strong>\n      </div>\n      <div class=\"fluency\"></div>\n    </div>\n    ");
    }, '');
    document.querySelector('#languages-list').innerHTML = languagesHTML;
};
//# sourceMappingURL=resume.js.map