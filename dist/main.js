var openUrl = function (url) {
    var win = window.open(url, '_blank');
    win.focus();
};
var mobileCheck = function () {
    var check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
            check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};
var normalizeKey = function (key) {
    if (/\[(.*?)\]/.test(key)) {
        var keys = key.split('[').map(function (key) {
            if (key.includes(']')) {
                return key.replace(/(^.*\[|\].*$)/g, '');
            }
            return key;
        });
        return keys;
    }
    return [key];
};
var getObjValue = function (obj, keys) {
    var key = keys[0];
    if (typeof obj[key] === 'object' && keys[1]) {
        return getObjValue(obj[key], keys.slice(1));
    }
    return obj[key];
};
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
    if (mobileCheck()) {
        window.alert('In order to get the best experience, you have to open this website on a computer. Using this website on a mobile phone may lack certain functionalities.');
    }
    var term = new window.Terminal({
        theme: {
            background: '#242526',
        },
        cursorBlink: true,
        fontFamily: 'Menlo, Monaco, Courier New, monospace',
        fontSize: 14,
        fontWeightBold: 'normal',
    });
    var fitAddon = new window.FitAddon();
    var getResumeValue = function (path) {
        var resume = window.resume;
        var splittedPath = path.split('.');
        var keys = splittedPath.map(normalizeKey).flat();
        return getObjValue(resume, keys);
    };
    var writeFromResume = function (path) {
        writeGreen();
        term.writeln(getResumeValue(path));
        writeWhite();
    };
    var promptAction = null;
    var attachPromptAction = function (cb) {
        promptAction = cb;
    };
    var executePromptAction = function () {
        promptAction();
        promptAction = null;
        currentLine = '';
    };
    var commandsMapToAction = {
        name: function () { return writeFromResume('basics.name'); },
        occupation: function () { return writeFromResume('basics.label'); },
        email: function () { return writeFromResume('basics.email'); },
        about: function () { return writeFromResume('basics.summary'); },
        location: function () { return writeFromResume('basics.location.city'); },
        work: function () {
            var work = getResumeValue('work');
            work.forEach(function (value) {
                var startDate = new Date(value.startDate);
                var endDate = new Date(value.endDate);
                writeGreen();
                term.writeln("  - " + value.company);
                writeCyan();
                term.writeln("    \u2022 Start Date: \u001B[37m" + monthNames[startDate.getMonth()] + " " + startDate.getFullYear() + " " + (value.endDate
                    ? "\u001B[36mEnd Date: \u001B[37m" + monthNames[endDate.getMonth()] + " " + endDate.getFullYear()
                    : ''));
                writeCyan();
                term.writeln("    \u2022 Position: \u001B[37m" + value.position);
                writeCyan();
                term.writeln("    \u2022 Technologies: \u001B[37m" + value.highlights.join(', '));
                writeCyan();
                term.writeln("    \u2022 Summary: \u001B[37m" + value.summary);
                writeWhite();
            });
        },
        skills: function () {
            var skills = getResumeValue('skills');
            skills.forEach(function (value) {
                writeGreen();
                term.writeln("  - " + value.name);
                writeWhite();
            });
        },
        languages: function () {
            var languages = getResumeValue('languages');
            languages.forEach(function (value) {
                writeGreen();
                term.writeln("  - " + value.language);
                writeWhite();
            });
        },
        education: function () {
            var education = getResumeValue('education');
            education.forEach(function (value) {
                var startDate = new Date(value.startDate);
                var endDate = new Date(value.endDate);
                writeGreen();
                term.writeln("  \u2022 " + value.institution);
                term.writeln("    - " + value.area);
                term.writeln("    - " + startDate.getFullYear() + " - " + endDate.getFullYear());
                writeWhite();
            });
        },
        linkedin: function () {
            var key = 'basics.profiles[0].url';
            attachPromptAction(function () {
                prompt();
                openUrl(getResumeValue(key));
            });
            writeCyan();
            term.writeln(getResumeValue(key));
            term.writeln('Open LinkedIn Profile [y/n] ?');
            writeWhite();
        },
        github: function () {
            var key = 'basics.profiles[1].url';
            attachPromptAction(function () {
                prompt();
                openUrl(getResumeValue(key));
            });
            writeCyan();
            term.writeln(getResumeValue(key));
            term.writeln('Open github profile [y/n] ?');
            writeWhite();
        },
        npm: function () {
            var key = 'basics.profiles[2].url';
            attachPromptAction(function () {
                prompt();
                openUrl(getResumeValue(key));
            });
            writeCyan();
            term.writeln(getResumeValue(key));
            term.writeln('Open npm profile [y/n] ?');
            writeWhite();
        },
        resume: function () {
            attachPromptAction(function () {
                prompt();
                openUrl('https://teod.github.io/resume.html');
            });
            writeCyan();
            term.writeln('https://teod.github.io/resume.html');
            term.writeln('Open non-interactive resume [y/n] ?');
            writeWhite();
        },
    };
    var commandsWithHijackedPrompt = ['linkedin', 'github', 'npm', 'resume'];
    var currentLine = '';
    var prompt = function () {
        term.write('\r\n$ ');
    };
    var writeGreen = function () {
        term.write('\x1b[1;32m');
    };
    var writeCyan = function () {
        term.write('\x1b[36m');
    };
    var writeBrightMagenta = function () {
        term.write('\x1b[1;35m');
    };
    var writeWhite = function () {
        term.write('\x1b[37m');
    };
    var writeCommand = function (name) {
        term.writeln("  - " + name);
    };
    var unavailableCommand = function () {
        writeBrightMagenta();
        term.writeln('Command not available.');
        writeWhite();
        writeCyan();
        term.writeln('Try `help` for all available options.');
        writeWhite();
    };
    var handlePrompt = function () {
        term.writeln('');
        currentLine = currentLine.trim();
        switch (currentLine) {
            case '':
                break;
            case 'help':
                Object.keys(commandsMapToAction).forEach(function (command) {
                    writeCommand(command);
                });
                break;
            default:
                if (typeof commandsMapToAction[currentLine] === 'function') {
                    commandsMapToAction[currentLine]();
                }
                else {
                    unavailableCommand();
                }
        }
        if (commandsWithHijackedPrompt.indexOf(currentLine) === -1) {
            prompt();
        }
        currentLine = '';
    };
    term.loadAddon(fitAddon);
    term.open(document.getElementById('terminal'));
    fitAddon.fit();
    writeGreen();
    term.writeln("Welcome to Teodor Druta's interactive resume !");
    writeWhite();
    term.writeln('');
    writeWhite();
    term.writeln('This is an interactive resume requiring input of commands for specific output. If you wish to browse the non-interactive version type \x1b[35m`resume`\x1b[37m in the terminal.');
    writeCyan();
    term.writeln('Start by typing \x1b[35m`help`\x1b[36m in the command line to see a full list of commands.');
    writeWhite();
    prompt();
    term.onKey(function (e) {
        var printable = !e.domEvent.altKey &&
            !e.domEvent.ctrlKey &&
            !e.domEvent.metaKey &&
            e.domEvent.keyCode !== 38 &&
            e.domEvent.keyCode !== 40 &&
            e.domEvent.keyCode !== 9 &&
            e.domEvent.keyCode !== 39 &&
            e.domEvent.keyCode !== 37;
        if (e.domEvent.keyCode === 13) {
            if (typeof promptAction === 'function') {
                if (currentLine === 'y' || currentLine === 'yes') {
                    executePromptAction();
                }
                else {
                    prompt();
                    currentLine = '';
                    promptAction = null;
                }
            }
            else {
                handlePrompt();
            }
        }
        else if (e.domEvent.keyCode === 8) {
            // Do not delete the prompt
            if (term._core.buffer.x > 2) {
                term.write('\b \b');
                currentLine = currentLine.substring(0, currentLine.length - 1);
            }
        }
        else if (printable) {
            term.write(e.key, function () {
                currentLine += e.key;
            });
        }
    });
})();
//# sourceMappingURL=main.js.map