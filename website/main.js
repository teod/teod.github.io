;(function () {
  const intro = document.querySelector('.animated-intro')
  const introTextBottom = intro.querySelector('div.text-bottom')

  introTextBottom.addEventListener('animationend', function () {
    setTimeout(function () {
      intro.style.transition = 'opacity 400ms ease-in-out'
      intro.style.opacity = '0'
      setTimeout(function () {
        intro.parentNode.removeChild(intro)
      }, 400)

      const container = document.querySelector('.container')

      container.style.display = 'block'
    }, 350)
  })

  // fetch resume json
  const request = new XMLHttpRequest()
  request.overrideMimeType('application/json')
  request.open('GET', '/resume.json', true)
  request.onreadystatechange = () => {
    if (request.readyState === 4 && request.status === 200) {
      const response = JSON.parse(request.responseText)

      console.log(response)

      const aboutParagraph = document.querySelector('.about > p')
      aboutParagraph.innerHTML = response.basics.summary
      const profiles = response.basics.profiles

      const githubUrl = profiles.find(profile => profile.network === 'github')
        .url
      const linkedinUrl = profiles.find(
        profile => profile.network === 'LinkedIn',
      ).url
      const npmUrl = profiles.find(profile => profile.network === 'npm').url

      const github = document.querySelector('#github')
      const linkedin = document.querySelector('#linkedin')
      const npm = document.querySelector('#npm')

      github.setAttribute('href', githubUrl)
      linkedin.setAttribute('href', linkedinUrl)
      npm.setAttribute('href', npmUrl)
    }
  }

  request.send(null)
})()
