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
  const request = new XMLHttpRequest()
  request.overrideMimeType('application/json')
  request.open('GET', '/resume.json', true)
  request.onreadystatechange = () => {
    if (request.readyState === 4 && request.status === 200) {
      onResumeLoad(JSON.parse(request.responseText))
    }
  }

  request.send(null)
})()

const onResumeLoad = resume => {
  const {
    basics: { name, label, website, email, location, summary, profiles },
    work,
    education,
    skills,
    languages,
  } = resume

  document.querySelector('title').innerText = name
  document.querySelector('#name').innerHTML = name
  document.querySelector('#label').innerHTML = label
  document.querySelector('.email').innerHTML = email
  document.querySelector('.website').innerHTML = website

  document.querySelector(
    '.location',
  ).innerHTML = `${location?.city}, ${location?.country}`

  document.querySelector(
    '.website',
  ).innerHTML = `<a href="${website}">${website}</a>`

  document.querySelector('#summary').innerHTML = summary

  const profilesHTML = profiles.reduce(
    (acc, { network, username, url }) =>
      (acc += `
      <div class="col-sm-6">
      <strong class="network">
        ${network}
      </strong>
      <div class="username">
        <div class="url">
          <a href="${url}">${username}</a>
        </div>
      </div>
    </div>
  `),
    '',
  )

  document.querySelector('#profiles-list').innerHTML = profilesHTML

  const workHTML = work.reduce(
    (
      acc,
      { company, startDate, endDate, position, website, highlights, summary },
    ) => {
      const start = new Date(startDate)
      const formattedStart = `${
        monthNames[start.getMonth()]
      } ${start.getFullYear()}`
      const end = new Date(endDate)
      const formattedEnd = !endDate
        ? 'present'
        : `${monthNames[start.getMonth()]} ${start.getFullYear()}`

      const technologies = highlights.reduce(
        (techAcc, highlight) =>
          (techAcc += `<li class="bullet">${highlight}</li>`),
        '',
      )

      return (acc += `
        <div class="col-sm-12">
          <h4 class="strike-through">
            <span>${company}</span>
            <span class="date">
              ${formattedStart} — ${formattedEnd}
            </span>
          </h4>
          <div class="website pull-right">
            <a href="${website}">${website}</a>
          </div>
          <div class="position">
            ${position}
          </div>
          <div class="summary">
            <p>${summary}</p>
          </div>
          <h4>Technologies</h4>
          <ul class="highlights">
            ${technologies}
          </ul>
        </div>
        `)
    },
    '',
  )

  document.querySelector('#work-list').innerHTML = workHTML

  const educationHTML = education.reduce(
    (acc, { institution, area, startDate, endDate }) =>
      (acc += `
      <div class="col-sm-12">
        <h4 class="strike-through">
          <span>${institution}</span>
          <span class="date">
            ${new Date(startDate).getFullYear()} — ${new Date(
        endDate,
      ).getFullYear()}
          </span>
        </h4>
        <div class="area">
          ${area}
        </div>
        <div class="studyType"></div>
      </div>
    `),
    '',
  )

  document.querySelector('#education-list').innerHTML = educationHTML

  const skillsHTML = skills.reduce(
    (acc, { name }) =>
      (acc += `
      <div class="col-sm-6">
        <div class="name">
          <h4>${name}</h4>
        </div>
      </div>
    `),
    '',
  )

  document.querySelector('#skills-list').innerHTML = skillsHTML

  const languagesHTML = languages.reduce(
    (acc, { language }) =>
      (acc += `
    <div class="col-sm-6">
      <div class="language">
        <strong>${language}</strong>
      </div>
      <div class="fluency"></div>
    </div>
    `),
    '',
  )

  document.querySelector('#languages-list').innerHTML = languagesHTML
}
