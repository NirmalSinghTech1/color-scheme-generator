// DOM elements
const colorEl = document.getElementById('color-picker')
const getSchemeBtn = document.getElementById('get-scheme')
const colorsContainer = document.getElementById('colors-container')
const colorSelect = document.getElementById('mode-select')


document.addEventListener('DOMContentLoaded', () => apiCall())

// handling dataset-copy event listener
document.addEventListener('click', (e) => {
    e.target.dataset.copy && copyToClipboard(e.target)
})

document.addEventListener('mouseout', (e)=> {
    e.target.dataset.copy && handleTipText(e.target)
})

// storing color value & mode
let colorHexValue = "#000000"
let colorMode = ''

// getting color value from color picker
colorEl.addEventListener('change', (e)=> {
    colorHexValue = e.target.value
})

// getting color mode
colorSelect.addEventListener('change', (e) => {
    colorMode = e.target.value
})

// getting color scheme 
getSchemeBtn.addEventListener('click', ()=>  apiCall())
const apiCall = () => {
    fetch(`https://www.thecolorapi.com/scheme?hex=${colorHexValue.slice(1)}&mode=${colorMode}`)
        .then(response => {
            if(!response.ok){
                throw new Error("Network is not ok")
            }
            return response.json()
        })
        .then(data => {
            getImages(data)
        })
        .catch(err => console.error("Error:" + err))
}

// rendering color images 
const getImages = (data) => {
    const colorsArray = data.colors

    let colorDiv = ``
    colorsArray.forEach((color, index) => {
        colorDiv += `
                <div class="color-code-container">
                    <div class="color">
                        <img src="${color.image.bare}" data-copy="${index}" alt="${color.name.value}" width="110" height="420" />
                        <span class="tooltiptext" id="tooltiptext-${index}" aria-live="polite" role="tooltip">Copy</span>
                        <svg class="icon clipboard" data-copy="${index}" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg>
                        <svg class="icon copied" aria-live="polite" id="copied-${index}" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Z"/></svg>
                    </div>
                    <span class="color-code" id="code-${index}">${color.hex.value}</span>
                </div>
                `
            })
    colorsContainer.innerHTML = colorDiv
}

// handling copy to clipboard functionality
const copyToClipboard = (id) => {
    const clickedId = id.dataset.copy
    if(clickedId){
        const colorCode = document.getElementById(`code-${clickedId}`).innerText
        navigator.clipboard.writeText(colorCode)
        
        document.getElementById(`copied-${clickedId}`).style.display = 'block'
        document.getElementById(`tooltiptext-${clickedId}`).innerText = 'Copied!'
    }
}

// handling tooltip text 
const handleTipText = (id) => {
    const moutseOutId = id.dataset.copy
    if(moutseOutId){
        document.getElementById(`copied-${moutseOutId}`).style.display = 'none'
        document.getElementById(`tooltiptext-${moutseOutId}`).innerHTML = 'Copy'
    }
}
