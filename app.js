/* -------------------------------------------------------------------------- */
/*                                  Model                                     */
/* -------------------------------------------------------------------------- */

const Store = {};

const heroNames = ["Anti-Mage","Axe","Bane","Bloodseeker","Crystal Maiden","Drow Ranger","Earthshaker","Juggernaut","Mirana","Morphling","Shadow Fiend","Phantom Lancer","Puck","Pudge","Razor","Sand King","Storm Spirit","Sven","Tiny","Vengeful Spirit","Windranger","Zeus","Kunkka","Lina","Lion","Shadow Shaman","Slardar","Tidehunter","Witch Doctor","Lich","Riki","Enigma","Tinker","Sniper","Necrophos","Warlock","Beastmaster","Queen of Pain","Venomancer","Faceless Void","Wraith King","Death Prophet","Phantom Assassin","Pugna","Templar Assassin","Viper","Luna","Dragon Knight","Dazzle","Clockwerk","Leshrac","Nature's Prophet","Lifestealer","Dark Seer","Clinkz","Omniknight","Enchantress","Huskar","Night Stalker","Broodmother","Bounty Hunter","Weaver","Jakiro","Batrider","Chen","Spectre","Ancient Apparition","Doom","Ursa","Spirit Breaker","Gyrocopter","Alchemist","Invoker","Silencer","Outworld Devourer","Lycan","Brewmaster","Shadow Demon","Lone Druid","Chaos Knight","Meepo","Treant Protector","Ogre Magi","Undying","Rubick","Disruptor","Nyx Assassin","Naga Siren","Keeper of the Light","Io","Visage","Slark","Medusa","Troll Warlord","Centaur Warrunner","Magnus","Timbersaw","Bristleback","Tusk","Skywrath Mage","Abaddon","Elder Titan","Legion Commander","Techies","Ember Spirit","Earth Spirit","Underlord","Terrorblade","Phoenix","Oracle","Winter Wyvern","Arc Warden","Monkey King","Dark Willow","Pangolier","Grimstroke","Void Spirit","Snapfire","Mars"];

const gameModes = ["Unknown", "All Pick", "Captains Mode", "Random Draft", "Single Draft", "All Random", "Intro", "Diretide", "Reverse Captains Mode", "The Greeviling", "Tutorial", "Mid Only", "Least Played", "Limited Heroes", "Compendium", "Custom", "Captains Draft", "Balanced Draft", "Ability Draft", "Event", "All Random Deathmatch", "1v1 Solo Mid", "All Draft", "Turbo", "Mutation"]
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
        populatePlayerRecentMatches(responseJSON, accountID);
    })
    .catch(error => console.log(error));
}

/* ------------------------- Fetch player hero data ------------------------- */
function getPlayerHeroes (accountID) {

    fetch(`https://api.opendota.com/api/players/${accountID}/heroes`)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(response.json());
        }
    })
    .then(responseJSON => {
        populatePlayerHeroes(responseJSON, accountID);
    })
    .catch(error => console.log(error));

}


/* -------------------------------------------------------------------------- */
/*                                    Views                                   */
/* -------------------------------------------------------------------------- */

function displaySearchResults (data) {
    
    // Filter the search results to provide most recently active players first
    data = data.slice(0, 10);
    data = data.filter(each => each.last_match_time);
    data.sort((a,b) => {return a.last_match_time < b.last_match_time ? 1 : b.last_match_time < a.last_match_time ? -1 : 0});
    console.log('search results', data);



    const resultsAmount = 3;

/* ---------------- Put the search bar at the top of the page --------------- */
    const searchForm = `<form>
                            <h5>Dota2 Player Search</h5>
                            <label for="player-search">Player Search</label>
                            <input type="text" id="player-search">
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
                                <div class="${data[i].account_id}-profile"></div>
                            </div>
                            <div class="${data[i].account_id}-heroes heroes"></div>
                            <div class="${data[i].account_id}-matches"><h3>Recent Matches</h3></div>
                        </li>`
    }
    searchResults += `</ul>`;
    $('main').empty().append(searchResults);

/* ----------------- Populate player data for each list item ---------------- */
    for (let i = 0; i < resultsAmount; i++) {
        getPlayerData(data[i].account_id);
        getPlayerRecentMatches(data[i].account_id);
        getPlayerHeroes(data[i].account_id);
    }
}

function populatePlayerData (data, accountID) {
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

function populatePlayerRecentMatches (data, accountID) {

    $(`.${accountID}-matches`).append(`<table class="${accountID}-matches-table">
                                            <tr>
                                                <th>Time</th>
                                                <th>Mode</th>
                                                <th>Hero</th>
                                                <th>Kills</th>
                                                <th>Deaths</th>
                                                <th>Assists</th>
                                                <th>Gold/Min</th>
                                                <th>Last Hits</th>
                                            </tr>
                                        </table>
                                        <button class="${accountID}-show-more">Show More</button>`
    );

    let matches = ``;
    for (let i = 0; i < 5; i++) {   // The start_time property is formatted in Epoch time
        matches += `<tr class="matchid-${data[i].match_id}">
        <td>${new Date(data[i].start_time * 1000)}</td>
        <td>${gameModes[data[i].game_mode]}</td>
        <td>${heroNames[data[i].hero_id]}</td>
        <td>${data[i].kills}</td><td>${data[i].deaths}</td>
        <td>${data[i].assists}</td>
        <td>${data[i].gold_per_min}</td>
        <td>${data[i].last_hits}</td>
    </tr>`
    }
    $(`.${accountID}-matches-table`).append(matches);

    let showMoreMatches = ``;
    for (let i = 5; i < 20; i++) {   // The start_time property is formatted in Epoch time
        showMoreMatches += `<tr class="matchid-${data[i].match_id}">
        <td>${new Date(data[i].start_time * 1000)}</td>
        <td>${gameModes[data[i].game_mode]}</td>
        <td>${heroNames[data[i].hero_id]}</td>
        <td>${data[i].kills}</td><td>${data[i].deaths}</td>
        <td>${data[i].assists}</td>
        <td>${data[i].gold_per_min}</td>
        <td>${data[i].last_hits}</td>
    </tr>`
    }
    Store[accountID] = showMoreMatches;
    $(`.${accountID}-show-more`).on('click', function(){
        $(`.${accountID}-show-more`).remove();
        $(`.${accountID}-matches-table`).append(Store[accountID]);
    });

}

function populatePlayerHeroes (data, accountID) {
    
    $(`.${accountID}-heroes`).append(`<div><h3>Most Played</h3>
                                    <table class="${accountID}-heroes-table">
                                        <tr>
                                            <th>Hero</th>
                                            <th>Games</th>
                                            <th>Win Rate</th>
                                        </tr>
                                    </table></div>`);

    let heroes = ``;
    for (let i = 0; i < 5; i++) {
        heroes += `<tr>
                        <td>${heroNames[data[i].hero_id]}</td>
                        <td>${data[i].games}</td>
                        <td>${Math.round((data[i].win / data[i].games) * 100)}%</td>
                    </tr>`
    }
    $(`.${accountID}-heroes-table`).append(heroes);

/* -------------------------------- Matchups -------------------------------- */
    const minGamesAgainst = data.filter(each => each.against_games >= 10);

    // Add Matchup Headers
    $(`.${accountID}-heroes`).append(`<div>
                                        <h3>Best Matchups</h3>
                                        <table class="${accountID}-strengths-table">
                                            <tr>
                                                <th>Opponent</th>
                                                <th>Win Rate</th>
                                            </tr>
                                        </table>
                                    </div>`);
    
    $(`.${accountID}-heroes`).append(`<div>
                                        <h3>Weakest Matchups</h3>
                                        <table class="${accountID}-weakness-table">
                                            <tr>
                                                <th>Opponent</th>
                                                <th>Win Rate</th>
                                            </tr>
                                        </table>
                                    </div>`);

    // Populate Best Matchups
    minGamesAgainst.sort((a,b) => (b.against_win / b.against_games) - (a.against_win / a.against_games));
    let bestMatchups = ``;
    for (let i = 0; i < 5; i++) {
        bestMatchups += `<tr>
                            <td>${heroNames[minGamesAgainst[i].hero_id]}</td>
                            <td>${Math.round((minGamesAgainst[i].against_win / minGamesAgainst[i].against_games) * 100)}%</td>
                        </tr>`
    }
    $(`.${accountID}-strengths-table`).append(bestMatchups);

    // Populate Weakest Matchups
    minGamesAgainst.sort((a,b) => (a.against_win / a.against_games) - (b.against_win / b.against_games))
    let worstMatchups = ``;
    for (let i = 0; i < 5; i++) {
        worstMatchups += `<tr>
                            <td>${heroNames[minGamesAgainst[i].hero_id]}</td>
                            <td>${Math.round((minGamesAgainst[i].against_win / minGamesAgainst[i].against_games) * 100)}%</td>
                        </tr>`
    }
    $(`.${accountID}-weakness-table`).append(worstMatchups);


}

/* -------------------------------------------------------------------------- */
/*                                   Control                                  */
/* -------------------------------------------------------------------------- */

function addEventListeners () {
    $('body').on('submit', 'form', function(e) {
        e.preventDefault();
        $('#player-search').blur();

        const searchInput = $('#player-search').val();
        getPlayerList(searchInput);
    });

    $('#player-search').focus();
};

$(document).ready(addEventListeners());