const openUrl = url => {
  console.log('url', url)
  const win = window.open(url, '_blank')
  win.focus()
}

const normalizeKey = key => {
  if (/\[(.*?)\]/.test(key)) {
    const keys = key.split('[').map(key => {
      if (key.includes(']')) {
        return key.replace(/(^.*\[|\].*$)/g, '')
      }
      return key
    })

    return keys
  }

  return [key]
}

const getObjValue = (obj, keys) => {
  const key = keys[0]

  if (typeof obj[key] === 'object' && keys[1]) {
    return getObjValue(obj[key], keys.slice(1))
  }

  return obj[key]
}

const monthNames = [
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
]

;(function () {
  const term: XTerminal = new (<any>window).Terminal({
    theme: {
      background: '#242526',
    },
    cursorBlink: true,
    fontFamily: 'Menlo, Monaco, Courier New, monospace',
    fontSize: 14,
    fontWeightBold: 'normal',
  })

  const fitAddon = new (<any>window).FitAddon()

  const getResumeValue = path => {
    const resume = (<any>window).resume

    const splittedPath = path.split('.')
    const keys = splittedPath.map(normalizeKey).flat()

    return getObjValue(resume, keys)
  }

  const writeFromResume = path => {
    writeGreen()
    term.writeln(getResumeValue(path))
    writeWhite()
  }

  let promptAction = null
  const attachPromptAction = cb => {
    promptAction = cb
  }

  const executePromptAction = () => {
    promptAction()
    promptAction = null
    currentLine = ''
  }

  const commandsMapToAction = {
    name: () => writeFromResume('basics.name'),
    occupation: () => writeFromResume('basics.label'),
    email: () => writeFromResume('basics.email'),
    summary: () => writeFromResume('basics.summary'),
    location: () => writeFromResume('basics.location.city'),
    work: () => {
      const work = getResumeValue('work')

      work.forEach(value => {
        const startDate = new Date(value.startDate)
        const endDate = new Date(value.endDate)

        writeGreen()
        term.writeln(`  - ${value.company}`)
        writeCyan()
        term.writeln(
          `    • Start Date: \x1b[37m${
            monthNames[startDate.getMonth()]
          } ${startDate.getFullYear()} ${
            value.endDate
              ? `\x1b[36mEnd Date: \x1b[37m${
                  monthNames[endDate.getMonth()]
                } ${endDate.getFullYear()}`
              : ''
          }`,
        )
        writeCyan()
        term.writeln(`    • Position: \x1b[37m${value.position}`)
        writeCyan()
        term.writeln(
          `    • Technologies: \x1b[37m${value.highlights.join(', ')}`,
        )
        writeWhite()
      })
    },
    skills: () => {
      const skills = getResumeValue('skills')

      skills.forEach(value => {
        writeGreen()
        term.writeln(`  - ${value.name}`)
        writeWhite()
      })
    },
    languages: () => {
      const languages = getResumeValue('languages')

      languages.forEach(value => {
        writeGreen()
        term.writeln(`  - ${value.language}`)
        writeWhite()
      })
    },
    linkedin: () => {
      const key = 'basics.profiles[0].url'
      attachPromptAction(() => {
        prompt()
        openUrl(getResumeValue(key))
      })
      writeCyan()
      term.writeln(getResumeValue(key))
      term.writeln('Open LinkedIn Profile [y/n] ?')
      writeWhite()
    },
    github: () => {
      const key = 'basics.profiles[1].url'
      attachPromptAction(() => {
        prompt()
        openUrl(getResumeValue(key))
      })
      writeCyan()
      term.writeln(getResumeValue(key))
      term.writeln('Open github profile [y/n] ?')
      writeWhite()
    },
    npm: () => {
      const key = 'basics.profiles[2].url'
      attachPromptAction(() => {
        prompt()
        openUrl(getResumeValue(key))
      })
      writeCyan()
      term.writeln(getResumeValue(key))
      term.writeln('Open npm profile [y/n] ?')
      writeWhite()
    },
    resume: () => {
      attachPromptAction(() => {
        prompt()
        openUrl('https://teod.github.io/resume.html')
      })
      writeCyan()
      term.writeln('https://teod.github.io/resume.html')
      term.writeln('Open non-interactive resume [y/n] ?')
      writeWhite()
    },
  }

  const commandsWithHijackedPrompt = ['linkedin', 'github', 'npm', 'resume']

  let currentLine = ''

  const prompt = () => {
    term.write('\r\n$ ')
  }

  const writeGreen = () => {
    term.write('\x1b[1;32m')
  }

  const writeCyan = () => {
    term.write('\x1b[36m')
  }

  const writeBrightMagenta = () => {
    term.write('\x1b[1;35m')
  }

  const writeWhite = () => {
    term.write('\x1b[37m')
  }

  const writeCommand = name => {
    term.writeln(`  - ${name}`)
  }

  const unavailableCommand = () => {
    writeBrightMagenta()
    term.writeln('Command not available.')
    writeWhite()
    writeCyan()
    term.writeln('Try `help` for all available options.')
    writeWhite()
  }

  const handlePrompt = () => {
    term.writeln('')

    currentLine = currentLine.trim()

    switch (currentLine) {
      case '':
        break
      case 'help':
        Object.keys(commandsMapToAction).forEach(command => {
          writeCommand(command)
        })
        break
      default:
        if (typeof commandsMapToAction[currentLine] === 'function') {
          commandsMapToAction[currentLine]()
        } else {
          unavailableCommand()
        }
    }

    if (commandsWithHijackedPrompt.indexOf(currentLine) === -1) {
      prompt()
    }

    currentLine = ''
  }

  term.loadAddon(fitAddon)
  term.open(document.getElementById('terminal'))
  fitAddon.fit()

  writeGreen()
  term.writeln("Welcome to Teodor Druta's interactive resume !")
  writeWhite()

  term.writeln('')

  writeWhite()
  term.writeln(
    'This is an interactive resume requiring input of commands for specific output. If you wish to browse the non-interactive version type \x1b[35m`resume`\x1b[37m in the terminal.',
  )
  writeCyan()
  term.writeln(
    'Start by typing \x1b[35m`help`\x1b[36m in the command line to see a full list of commands.',
  )
  writeWhite()

  prompt()

  term.onKey(e => {
    const printable =
      !e.domEvent.altKey &&
      !e.domEvent.ctrlKey &&
      !e.domEvent.metaKey &&
      e.domEvent.keyCode !== 38 &&
      e.domEvent.keyCode !== 40 &&
      e.domEvent.keyCode !== 9 &&
      e.domEvent.keyCode !== 39 &&
      e.domEvent.keyCode !== 37

    if (e.domEvent.keyCode === 13) {
      console.log('currentLine', currentLine)
      // handlePrompt()
      if (typeof promptAction === 'function') {
        if (currentLine === 'y' || currentLine === 'yes') {
          executePromptAction()
        } else {
          prompt()
          currentLine = ''
          promptAction = null
        }
      } else {
        handlePrompt()
      }
      // prompt()
    } else if (e.domEvent.keyCode === 8) {
      // Do not delete the prompt
      if ((term as any)._core.buffer.x > 2) {
        term.write('\b \b')
        currentLine = currentLine.substring(0, currentLine.length - 1)
      }
    } else if (printable) {
      term.write(e.key, () => {
        currentLine += e.key
      })
    }
  })
})()
