


/* -------------------------------------------------------------------------- */
/*                                  Model                                     */
/* -------------------------------------------------------------------------- */

const heroNames = ["Anti-Mage","Axe","Bane","Bloodseeker","Crystal Maiden","Drow Ranger","Earthshaker","Juggernaut","Mirana","Morphling","Shadow Fiend","Phantom Lancer","Puck","Pudge","Razor","Sand King","Storm Spirit","Sven","Tiny","Vengeful Spirit","Windranger","Zeus","Kunkka","Lina","Lion","Shadow Shaman","Slardar","Tidehunter","Witch Doctor","Lich","Riki","Enigma","Tinker","Sniper","Necrophos","Warlock","Beastmaster","Queen of Pain","Venomancer","Faceless Void","Wraith King","Death Prophet","Phantom Assassin","Pugna","Templar Assassin","Viper","Luna","Dragon Knight","Dazzle","Clockwerk","Leshrac","Nature's Prophet","Lifestealer","Dark Seer","Clinkz","Omniknight","Enchantress","Huskar","Night Stalker","Broodmother","Bounty Hunter","Weaver","Jakiro","Batrider","Chen","Spectre","Ancient Apparition","Doom","Ursa","Spirit Breaker","Gyrocopter","Alchemist","Invoker","Silencer","Outworld Devourer","Lycan","Brewmaster","Shadow Demon","Lone Druid","Chaos Knight","Meepo","Treant Protector","Ogre Magi","Undying","Rubick","Disruptor","Nyx Assassin","Naga Siren","Keeper of the Light","Io","Visage","Slark","Medusa","Troll Warlord","Centaur Warrunner","Magnus","Timbersaw","Bristleback","Tusk","Skywrath Mage","Abaddon","Elder Titan","Legion Commander","Techies","Ember Spirit","Earth Spirit","Underlord","Terrorblade","Phoenix","Oracle","Winter Wyvern","Arc Warden","Monkey King","Dark Willow","Pangolier","Grimstroke","Void Spirit","Snapfire","Mars"];

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
        displaySearchResults(responseJSON);
    })
    .catch(error => console.log(error))


};


/* ------------------------ Fetch basic profile data ------------------------ */
function getPlayerData(accountID) {

    fetch(`https://api.opendota.com/api/players/${accountID}`)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(response.json());
        }
    })
    .then(responseJSON => {
        populatePlayerData(responseJSON, accountID);
    })
    .catch(error => console.log(error))
}

/* ------------------------- Fetch recent matches data ------------------------ */
function getPlayerRecentMatches (accountID) {
    fetch(`https://api.opendota.com/api/players/${accountID}/recentMatches`)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(response.json());
        }
    })
    .then(responseJSON => {
        populateRecentMatches(responseJSON, accountID);
    })
    .catch(error => console.log(error));
}



/* -------------------------------------------------------------------------- */
/*                                    Views                                   */
/* -------------------------------------------------------------------------- */

function displaySearchResults (data) {

    const resultsAmount = 2;
/* ---------------- Put the search bar at the top of the page --------------- */
    const searchForm = `<form>
                            <label for="player-search"></label>
                            <input type="text" id="player-search" placeholder="Enter a player name">
                            <button>Search</button>
                        </form>`;
    let searchResults = `<ul>`;
    $('header').empty().append(searchForm);

/* ------------------------- Add search results list ------------------------ */
    for (let i = 0; i < resultsAmount; i++) {
        searchResults += `<li class="greybox1" id="${data[i].account_id}">
                            <div class="result-header">
                                <img src="${data[i].avatarfull}" />
                                <h2>${data[i].personaname}</h2>
                                <p><strong>Last Match:</strong> ${new Date(data[i].last_match_time)}</p>
                            </div>
                            <div class="${data[i].account_id}-profile"></div>
                            <ul class="${data[i].account_id}-matches"><h3>Recent Matches</h3></ul>
                        </li>`
    }
    searchResults += `</ul>`;
    $('main').empty().append(searchResults);

/* ----------------- Populate player data for each list item ---------------- */
    for (let i = 0; i < resultsAmount; i++) {
        getPlayerData(data[i].account_id);
        getPlayerRecentMatches(data[i].account_id);
    }

}

function populatePlayerData (data, accountID) {
    console.log(data, accountID);
    $(`.${accountID}-profile`).append(`<table>
                                    <tr>
                                        <th>Country</td>
                                        <th>MMR</th>
                                        <th>Rank</th>
                                        <th>Steam Account</th>
                                    </tr>
                                    <tr>
                                        <td>${data.profile.loccountrycode || 'Unknown'}</td>
                                        <td>${data.mmr_estimate.estimate || 'Unranked'}</td>
                                        <td>${data.rank_tier || 'Unranked'}</td>
                                        <td><a href="${data.profile.profileurl}" target="_blank">Link</a></td>
                                    </tr>
                                </table>`);
}

function populateRecentMatches (data, accountID) {
    console.log(data, accountID);

    $(`.${accountID}-matches`).append(`<table class="${accountID}-matches-table">
                                            <tr>
                                                <th>Time</th>
                                                <th>Hero</th>
                                                <th>Kills</th>
                                                <th>Deaths</th>
                                                <th>Assists</th>
                                            </tr>
                                        </table>`
    );

    const matches = data.reduce(function(acc, cur){
        return acc += `<tr><td>${new Date(cur.start_time * 1000)}</td><td>${heroNames[cur.hero_id]}</td><td>${cur.kills}</td><td>${cur.deaths}</td><td>${cur.assists}</td></tr>`;
    }, ``);
    $(`.${accountID}-matches-table`).append(matches);

}



// function displayPlayerData (data, accountID) {

//     const playerData = `<div class="player-data">
                            
//                             <table>
//                                 <tr>
//                                     <th>Country</td>
//                                     <th>MMR</th>
//                                     <th>Rank</th>
//                                     <th>Steam Account</th>
//                                 </tr>
//                                 <tr>
//                                     <td>${player.profile.loccountrycode || ''}</td>
//                                     <td>${player.mmr_estimate.estimate}</td>
//                                     <td>${player.rank_tier || ''}</td>
//                                     <td><a href="${player.profile.profileurl}" target="_blank">Link</a></td>
//                                 </tr>
//                             </table>

//                             <h3 class="greybox2">Recent Matches</h3>
//                             <ul class="recent-matches">
                                
//                             </ul>

                            
                            
//                         </div>`

//     $(`#${accountID}`).append(playerData);
    
// }

/* -------------------------------------------------------------------------- */
/*                                   Control                                  */
/* -------------------------------------------------------------------------- */

function addEventListeners () {
    $('body').on('submit', 'form', function(e) {
        e.preventDefault();
        const searchInput = $('#player-search').val();

        console.log('form submitted')
        getPlayerList(searchInput);
    });
    $('#player-search').focus();

    // $('main').on('click', 'li', function(e) {
    //     const accountID = e.target.closest('li').id;

    //     getPlayerData(accountID);
    //     getPlayerWl(accountID);
    //     getPlayerRecentMatches(accountID);
    // })
};

$(document).ready(addEventListeners());