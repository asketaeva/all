const popperEl = document.getElementById('popper')
let popperInstance

const getHex = (value) => {
  return value.toString(16).padStart(2, '0')
}

const getColor = (ratio) => {
  const color1 = '228b22'
  const color2 = 'ffffff'

  if (!isFinite(ratio)) { return '#' + color1 }

  const r = Math.ceil(parseInt(color1.substring(0, 2), 16) * ratio + parseInt(color2.substring(0, 2), 16) * (1 - ratio))
  const g = Math.ceil(parseInt(color1.substring(2, 4), 16) * ratio + parseInt(color2.substring(2, 4), 16) * (1 - ratio))
  const b = Math.ceil(parseInt(color1.substring(4, 6), 16) * ratio + parseInt(color2.substring(4, 6), 16) * (1 - ratio))

  return '#' + getHex(r) + getHex(g) + getHex(b)
}

// 2019 Belgian population by province
const data = {
    "KAZ3195": "Aqtöbe",
    "KAZ3196": "Qostanay",
    "KAZ3197": "Qyzylorda",
    "KAZ3198": "Atyrau",
    "KAZ3201": "West Kazakhstan",
    "KAZ3202": "Aqmola",
    "KAZ3203": "Qaraghandy",
    "KAZ3204": "North Kazakhstan",
    "KAZ3205": "Pavlodar",
    "KAZ3206": "East Kazakhstan",
    "KAZ3207": "Almaty",
    "KAZ3236": "Mangghystau",
    "KAZ3251": "South Kazakhstan",
    "KAZ3252": "Zhambyl",
    "KAZ4829": "Almaty City",
    "KAZ4830": "Astana"
}

fetch('https://simplemaps.com/static/svg/be/be.svg')
  .then(response => response.text())
  .then((image) => {
    let startOfSvg = image.indexOf('<svg')
    startOfSvg = startOfSvg >= 0 ? startOfSvg : 0

    const draw = SVG(image.slice(startOfSvg))
      .addTo('#map')
      .size('100%', 450)
      .panZoom()

    // get maximum value among the supplied data
    const max = Math.max(...Object.values(data))

    for (const region of draw.find('path')) {
      const regionValue = data[region.id()]

      if (isFinite(regionValue)) {
        // color the region based on it's value with respect to the maximum
        region.fill(getColor(regionValue / max))

        // show region value as a label
        draw.text(regionValue.toString())
          .font({
            size: '1.25em'
          })
          .center(region.cx(), region.cy())
      }

      // show region data when clicking on it
      region.on('click', () => {
        alert(`${region.attr('name')} (${region.id()}): ${regionValue}`)
      })

      region.on('mouseover', () => {
        popperEl.innerText = `${region.attr('name')} (${region.id()}): ${regionValue}`
        popperEl.style.visibility = 'visible'
        popperInstance = Popper.createPopper(region.node, popperEl, { placement: 'bottom' })
      })

      region.on('mouseleave', () => {
        popperEl.style.visibility = 'hidden'
      })
    }
  })
