


// MODEL

function getPlayerList (query) {
    query = encodeURIComponent(query);

    fetch(`https://api.opendota.com/api/search?q=` + query)
    .then(response => {
        if (response.ok) {
            return response.json()
        } else {
            throw new Error(response.statusText);
        }})
    .then(responseJSON => displaySearchResults(responseJSON))
    .catch(error => console.log(error))
};

function getPlayerData (accountID) {

    fetch(`https://api.opendota.com/api/players/` + accountID)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(response.json());
        }
    })
    .then(responseJSON => displayPlayerData(responseJSON))
    .catch(error => console.log(error))
}

// VIEWS

function displaySearchResults (data) {
    console.log(data);

    const searchForm = `<form>
                            <label for="player-search"></label>
                            <input type="text" id="player-search">
                            <button>Search</button>
                        </form>`;

    let searchResults = `${searchForm}`;

    // Lets sort the data so that highest MMR is first
    data.sort(function(a, b){return })

    data.forEach(each => {
        searchResults += `<li id="${each.account_id}">${each.personaname}</li>`
    })


    $('main').empty().append(searchResults)
}

function displayPlayerData (data) {
    console.log(data);

    const searchForm = `<form>
                            <label for="player-search"></label>
                            <input type="text" id="player-search">
                            <button>Search</button>
                        </form>`;

    const playerData = `${searchForm}
                        <div class="player-data">
                            <h2>${data.profile.personaname}</h2>
                            <p>Country: ${data.profile.loccountrycode}</p>
                            <p>MMR estimate: ${data.mmr_estimate.estimate}</p>
                            <p>Rank tier: ${data.rank_tier}</p>
                            <p><a href="${data.profile.profileurl}">Steam Account</a></p>
                        </div>`

    $('main').empty().append(playerData);
}

// CONTROL

function addEventListeners () {
    $('main').on('submit', 'form', function(e) {
        e.preventDefault();
        console.log('you clicked submit')
        const searchInput = $('#player-search').val();
        console.log(searchInput);

        getPlayerList(searchInput);
    });

    $('main').on('click', 'li', function(e) {
        console.log(e.target.id);
        const accountID = e.target.id;

        getPlayerData(accountID);
    })
};

$(document).ready(addEventListeners());