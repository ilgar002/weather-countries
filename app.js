const body = document.querySelector("body")
const cards = document.querySelector(".cards")
const container = document.querySelector(".container")
const themeButton = document.querySelector(".theme-button")
const currentTheme = document.querySelector(".current-theme")
const apiKey = '73d95f3a87daaaa6d48c797815129acc'

//theme
if (localStorage.getItem('mode') === null) {
    body.style.backgroundColor = "#202C37"
    localStorage.setItem('mode', 'dark')
    container.classList.remove('light-mode')
    currentTheme.innerText = "Dark Mode"
}
else {
    if (localStorage.getItem('mode') === 'dark') {
        body.style.backgroundColor = "#202C37"
        container.classList.remove('light-mode')
        currentTheme.innerText = "Dark Mode"
        localStorage.setItem('mode', 'dark')
    }
    else if (localStorage.getItem('mode') === 'light') {
        body.style.backgroundColor = "white"
        container.classList.add('light-mode')
        currentTheme.innerText = "Light Mode"
        localStorage.setItem('mode', 'light')
    }
}
themeButton.addEventListener("click", function () {
    if (localStorage.getItem('mode') == 'dark') {
        body.style.backgroundColor = "white"
        container.classList.add('light-mode')
        currentTheme.innerText = "Light Mode"
        localStorage.setItem('mode', 'light')
    }
    else if (localStorage.getItem('mode') == 'light') {
        body.style.backgroundColor = "#202C37"
        container.classList.remove('light-mode')
        currentTheme.innerText = "Dark Mode"
        localStorage.setItem('mode', 'dark')
    }
})

//extract data from api
function extractDataByregion(region) {
    if (region == "all") {
        fetch(`https://restcountries.com/v3.1/all`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Something went wrong');
            })
            .then((data) => {
                cards.innerHTML = ""
                useData(data)
                flipCard(data)
            })
            .catch((error) => {
                cards.innerHTML = `<div class="error-message">
                        <h6>Oops...</h6>
                        <h6>Something Went Wrong...</h6>
                        <img src="./images/error-message.PNG" alt="Error Message" srcset="">
                    </div>`
            });
    }
    else {
        fetch(`https://restcountries.com/v3.1/region/${region}`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Something went wrong');
            })
            .then((data) => {
                cards.innerHTML = ""
                useData(data)
                flipCard(data)
            })
            .catch((error) => {
                cards.innerHTML = `<div class="error-message">
                        <h6>Oops...</h6>
                        <h6>Something Went Wrong...</h6>
                        <img src="./images/error-message.PNG" alt="Error Message" srcset="">
                    </div>`
            });
    }

}

function useData(arr) {
    for (let i = 0; i < arr.length; i++) {
        const card = document.createElement("div")
        card.classList.add("flip-card")
        card.innerHTML =
            `<div class="flip-card-inner">
                <div class="flip-card-front">
                    <div class="image-container">
                        <img src="${arr[i].flags.png}" alt="Flag">
                    </div>
                    <div class="card-text">
                        <h3 class="country-name">${arr[i].name.common}</h3>
                        <div class="country-detail"> 
                            <h6 class="population">Population: <span class="muted">${new Intl.NumberFormat().format(arr[i].population)}</span></h6>
                            <h6 class="region">Region: <span class="muted">${arr[i].region}</span></h6>
                            <h6 class="capital">Capital: <span class="muted">${arr[i].capital}</span></h6>
                        </div>
                    </div>
                </div>
                <div class="flip-card-back">
                    <div class="top">
                        <span class="location">
                            <i class="fa-solid fa-location-dot"></i>
                            <span class="capital-name">${arr[i].capital}, ${arr[i].fifa}</span>
                        </span>
                    </div>
                    <div class="bottom">
                    </div>
                </div>
            </div>`
        cards.append(card)
    }
}
//flip card
function flipCard(data) {
    const allCard = cards.querySelectorAll('.flip-card')
    for (let i = 0; i < allCard.length; i++) {
        allCard[i].addEventListener("click", function () {
            // console.log(data[i]);
            const flipCardBack = allCard[i].querySelector('.flip-card-back')
            const bottom = allCard[i].querySelector('.flip-card-back .bottom')
            allCard[i].querySelector('.flip-card-inner').classList.toggle('clickedVersion')
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${data[i].capitalInfo.latlng[0]}&lon=${data[i].capitalInfo.latlng[1]}&appid=${apiKey}&units=metric`)
                // fetch(`https://api.openweathermap.org/data/2.5/weather?q=${data[i].capital}&appid=${apiKey}&units=metric`)
                .then((response) => response.json())
                .then((data) => {
                    flipCardBack.classList.add(`${chooseBackground(new String(data.weather[0].id))}`)
                    bottom.innerHTML = `
                        <div class="icon">
                            <img src="./animated-weather-icons/${chooseBackground(new String(data.weather[0].id))}-${data.weather[0].icon[2]}.svg" alt="Weather Icon">
                        </div>
                        <span class="temperature">
                            ${Math.round(data.main.temp)}°C
                        </span>
                        <span class="description">
                            ${data.weather[0].description}
                        </span>`
                })
        })
    }
}
// background of card
function chooseBackground(id) {
    if (id == '800') {
        return 'clear';
    }
    else if (id[0] == '2') {
        return 'thunderstorm';
    }
    else if (id[0] == '3') {
        return 'drizzle';
    }
    else if (id[0] == '5') {
        return 'rain';
    }
    else if (id[0] == '6') {
        return 'snow';
    }
    else if (id[0] == '7') {
        return 'atmosphere';
    }
    else if (id[0] == '8') {
        return 'clouds';
    }
}

extractDataByregion('all')

//region dropdown
const regionFilter = document.querySelector(".region-filter")
const regionDropdown = regionFilter.querySelector(".options-dropdown")
const options = regionFilter.querySelectorAll('.option')
const dropdowns = document.querySelectorAll(".options-dropdown")
const regionDropdownArrow = regionFilter.querySelector("i")
regionFilter.addEventListener("click", function () {
    regionDropdown.classList.toggle("show")
    regionDropdownArrow.classList.toggle("rotate-180")
})

//filter by region
for (let i = 0; i < options.length; i++) {
    options[i].addEventListener("click", function () {
        let lastOption = options[0].innerText
        let newOption = this.innerText
        options[0].innerText = newOption
        // this.innerText = lastOption
        outsideClick(regionFilter)
        if (i != 0) {
            fetch('skeleton-cards.txt')
                .then(response => response.text())
                .then(data => {
                    cards.innerHTML = data
                });
            if (this.innerText == 'Filter By Region') {
                console.log(this.innerText);
                cards.innerHTML = ""
                extractDataByregion('all')
            }
            else {
                console.log(this.innerText);
                cards.innerHTML = ""
                extractDataByregion(`${options[0].innerText}`)
            }
        }
    })
}

//outside click close dropdown
function outsideClick(el) {
    document.addEventListener('click', (e) => {
        const clickedArea = e.composedPath();
        const selectBoxArrow = el.querySelector('i')
        if (!clickedArea.includes(el)) {
            for (let i = 0; i < dropdowns.length; i++) {
                dropdowns[i].classList.remove("show")
                selectBoxArrow.classList.remove('rotate-180')
            }
        }
    })
}

//Search By Country
const searchForm = document.querySelector('.searchByCountry')
const searchInput = searchForm.querySelector('input')

searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    searchInput.value
    cards.innerHTML = ""
    fetch(`https://restcountries.com/v3.1/name/${searchInput.value}`)
        .then((response) => response.json())
        .then((data) => {
            useData(data)
            flipCard(data)
        });
    searchInput.value = ''
})


