var openUrl = function (url) {
    var win = window.open(url, '_blank');
    win.focus();
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
        summary: function () { return writeFromResume('basics.summary'); },
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