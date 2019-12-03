


/* -------------------------------------------------------------------------- */
/*                                  Model                                     */
/* -------------------------------------------------------------------------- */

const STORE = {};



/* ---------------------------- Fetch player list --------------------------- */

function getPlayerList (query) {
    query = encodeURIComponent(query);

    fetch(`https://api.opendota.com/api/search?q=` + query)
    .then(response => {
        if (response.ok) {
            return response.json()
        } else {
            throw new Error(response.statusText);
        }})
    .then(responseJSON => {
        console.log('search results: ', responseJSON);
        displaySearchResults(responseJSON)})
    .catch(error => console.log(error))
};

async function getPlayerData (accountID) {

    // let promise = new Promise((resolve, reject) => {

    let playerData = [];

/* ------------------------ Fetch basic profile data ------------------------ */

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
    
/* -------------------------- Fetch win/loss record ------------------------- */

    fetch(`https://api.opendota.com/api/players/${accountID}/wl`)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(response.json());
        }
    })
    .then(responseJSON => console.log(responseJSON))
    .catch(error => console.log(error))

/* ------------------------- Fetch recent matches data ------------------------ */

    fetch(`https://api.opendota.com/api/players/${accountID}/recentMatches`)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(response.json());
        }
    })
    .then(responseJSON => console.log(responseJSON))
    .catch(error => console.log(error));


    // return resolve(playerData);
    // })
    // let result = await promise;
    // console.log(result);



}

/* -------------------------------------------------------------------------- */
/*                                    Views                                   */
/* -------------------------------------------------------------------------- */

function displaySearchResults (data) {

    const searchForm = `<form>
                            <label for="player-search"></label>
                            <input type="text" id="player-search">
                            <button>Search</button>
                        </form>`;

    let searchResults = `${searchForm}<ul>`;

    // Lets sort the data so that highest MMR is first
    data.sort(function(a, b){return })

    data.forEach(each => {
        searchResults += `<li class="greybox1" id="${each.account_id}">
                            <img src="${each.avatarfull}" />
                            <p>${each.personaname}</p>
                            <p><strong>Last Match:</strong> ${new Date(each.last_match_time)}</p>
                            </li>`
    })

    searchResults += `</ul>`;

    $('main').empty().append(searchResults)
}

function displayPlayerData (data) {

    const searchForm = `<form>
                            <label for="player-search"></label>
                            <input type="text" id="player-search">
                            <button>Search</button>
                        </form>`;

    const playerData = `${searchForm}
                        <div class="player-data">
                            <h2>${data.profile.profile.personaname}</h2>

                            <h3 class="greybox2">Profile</h3>
                            <table>
                                <tr>
                                    <th>Country</td>
                                    <th>MMR</th>
                                    <th>Rank</th>
                                    <th>Steam Account</th>
                                </tr>
                                <tr>
                                    <td>${data.profile.profile.loccountrycode}</td>
                                    <td>${data.profile.mmr_estimate.estimate}</td>
                                    <td>${data.profile.rank_tier}</td>
                                    <td><a href="${data.profile.profile.profileurl}" target="_blank">Link</a></td>
                                </tr>
                            </table>

                            <h3 class="greybox2">Heroes Played</h3>
                            <table></table>

                            <h3 class="greybox2">Recent Matches</h3>
                            <table></table>

                            
                            
                        </div>`

    $('main').empty().append(playerData);
}

/* -------------------------------------------------------------------------- */
/*                                   Control                                  */
/* -------------------------------------------------------------------------- */

function addEventListeners () {
    $('main').on('submit', 'form', function(e) {
        e.preventDefault();
        const searchInput = $('#player-search').val();

        getPlayerList(searchInput);
    });

    $('main').on('click', 'li', function(e) {
        const accountID = e.target.closest('li').id;

        getPlayerData(accountID);
    })
};

$(document).ready(addEventListeners());