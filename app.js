/* -------------------------------------------------------------------------- */
/*                                  Model                                     */
/* -------------------------------------------------------------------------- */

const STORE = {};
const heroNames = { "1": "Anti-Mage", "2": "Axe", "3": "Bane", "4": "Bloodseeker", "5": "Crystal Maiden", "6": "Drow Ranger", "7": "Earthshaker", "8": "Juggernaut", "9": "Mirana", "10": "Morphling", "11": "Shadow Fiend", "12": "Phantom Lancer", "13": "Puck", "14": "Pudge", "15": "Razor", "16": "Sand King", "17": "Storm Spirit", "18": "Sven", "19": "Tiny", "20": "Vengeful Spirit", "21": "Windranger", "22": "Zeus", "23": "Kunkka", "25": "Lina", "26": "Lion", "27": "Shadow Shaman", "28": "Slardar", "29": "Tidehunter", "30": "Witch Doctor", "31": "Lich", "32": "Riki", "33": "Enigma", "34": "Tinker", "35": "Sniper", "36": "Necrophos", "37": "Warlock", "38": "Beastmaster", "39": "Queen of Pain", "40": "Venomancer", "41": "Faceless Void", "42": "Wraith King", "43": "Death Prophet", "44": "Phantom Assassin", "45": "Pugna", "46": "Templar Assassin", "47": "Viper", "48": "Luna", "49": "Dragon Knight", "50": "Dazzle", "51": "Clockwerk", "52": "Leshrac", "53": "Nature's Prophet", "54": "Lifestealer", "55": "Dark Seer", "56": "Clinkz", "57": "Omniknight", "58": "Enchantress", "59": "Huskar", "60": "Night Stalker", "61": "Broodmother", "62": "Bounty Hunter", "63": "Weaver", "64": "Jakiro", "65": "Batrider", "66": "Chen", "67": "Spectre", "68": "Ancient Apparition", "69": "Doom", "70": "Ursa", "71": "Spirit Breaker", "72": "Gyrocopter", "73": "Alchemist", "74": "Invoker", "75": "Silencer", "76": "Outworld Devourer", "77": "Lycan", "78": "Brewmaster", "79": "Shadow Demon", "80": "Lone Druid", "81": "Chaos Knight", "82": "Meepo", "83": "Treant Protector", "84": "Ogre Magi", "85": "Undying", "86": "Rubick", "87": "Disruptor", "88": "Nyx Assassin", "89": "Naga Siren", "90": "Keeper of the Light", "91": "Io", "92": "Visage", "93": "Slark", "94": "Medusa", "95": "Troll Warlord", "96": "Centaur Warrunner", "97": "Magnus", "98": "Timbersaw", "99": "Bristleback", "100": "Tusk", "101": "Skywrath Mage", "102": "Abaddon", "103": "Elder Titan", "104": "Legion Commander", "105": "Techies", "106": "Ember Spirit", "107": "Earth Spirit", "108": "Underlord", "109": "Terrorblade", "110": "Phoenix", "111": "Oracle", "112": "Winter Wyvern", "113": "Arc Warden", "114": "Monkey King", "119": "Dark Willow", "120": "Pangolier", "121": "Grimstroke", "126": "Void Spirit", "128": "Snapfire", "129": "Mars" };
const gameModes = ["Unknown", "All Pick", "Captains Mode", "Random Draft", "Single Draft", "All Random", "Intro", "Diretide", "Reverse Captains Mode", "The Greeviling", "Tutorial", "Mid Only", "Least Played", "Limited Heroes", "Compendium", "Custom", "Captains Draft", "Balanced Draft", "Ability Draft", "Event", "All Random Deathmatch", "1v1 Solo Mid", "All Draft", "Turbo", "Mutation"];

function formatDate(date) {
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
  
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
  
    return day + ' ' + month + ' ' + year + ' ' + hour + ':' + minute + ':' + second;
}

/* ---------------------------- Fetch player list --------------------------- */
function getPlayerList (query) {
    query = encodeURIComponent(query);

    fetch(`https://api.opendota.com/api/search?q=` + query)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(response.statusText);
        }})
    .then(responseJSON => {
        if (responseJSON.length > 0) {
            displaySearchResults(responseJSON);
        } else {
            throw new Error("No search results found");
        }
    })
    .catch(error => {
        console.log(error);
        $('.error').text(`${error}`);
    })
};


/* ------------------------ Fetch player profile data ------------------------ */
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
    .catch(error => console.log(error));
}


/* ------------------------- Fetch player recent matches data ------------------------ */
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

    $('body').css('height', 'auto'); // Remove the 100vh restriction that was set on the landing page
    
    // Filter the search results to provide most recently active players first
    data = data.slice(0, 10);
    data = data.filter(each => each.last_match_time);
    data.sort((a, b) => {return a.last_match_time < b.last_match_time ? 1 : b.last_match_time < a.last_match_time ? -1 : 0});

    let resultsAmount = 3;
    if (data.length < resultsAmount) { // Handle edgecase where there are few results
        resultsAmount = data.length;
    }


/* ---------------- Put the search bar at the top of the page --------------- */
    const searchForm = `<form class="header-form">
                                <h5>Dota2 Player Search</h5>
                                <div>
                                    <label for="player-search">Player Search</label>
                                    <input type="text" id="player-search" required>
                                    <button>Go</button>
                                    <p class="error"> </p>
                                </div>
                            </form>`;
    let searchResults = `<ul>`;
    $('header').empty().append(searchForm);

/* ------------------------- Add search results list ------------------------ */
    for (let i = 0; i < resultsAmount; i++) {
        searchResults += `<li id="${data[i].account_id}">
                            <div class="result-header">
                                <img src="${data[i].avatarfull}" />
                                <h2>${data[i].personaname}</h2>
                                <div class="${data[i].account_id}-profile"></div>
                            </div>
                            <div class="${data[i].account_id}-heroes heroes"></div>
                            <div class="${data[i].account_id}-matches"><h3>Recent Matches</h3></div>
                        </li>`;
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
                                    </table>`
    );
}

function populatePlayerRecentMatches (data, accountID) {

    $(`.${accountID}-matches`).append(`<table class="${accountID}-matches-table recent-matches">
                                            <tr>
                                                <th>Time</th>
                                                <th>Mode</th>
                                                <th>Hero</th>
                                                <th>Kills</th>
                                                <th>Deaths</th>
                                                <th>Assists</th>
                                                <th>Gold /Min</th>
                                                <th>Last Hits</th>
                                            </tr>
                                        </table>`
    );

    let matches = '';
    for (let i = 0; i < 5; i++) {   // The start_time property is formatted in Epoch time
        matches += `<tr class="matchid-${data[i].match_id}">
        <td>${formatDate(new Date(data[i].start_time * 1000))}</td>
        <td>${gameModes[data[i].game_mode]}</td>
        <td><img src="resources/hero-images/${data[i].hero_id}.png" class="hero" /> ${heroNames[data[i].hero_id]}</td>
        <td>${data[i].kills}</td><td>${data[i].deaths}</td>
        <td>${data[i].assists}</td>
        <td>${data[i].gold_per_min}</td>
        <td>${data[i].last_hits}</td>
    </tr>`;
    }
    $(`.${accountID}-matches-table`).append(matches);

    if (data.length > 5) { // Handle edgecase: Less than 5 total matches in history
        let showMoreMatches = ``;

        for (let i = 5; i < 20; i++) {   // The start_time property is formatted in Epoch time
            showMoreMatches += `<tr class="matchid-${data[i].match_id}">
            <td>${formatDate(new Date(data[i].start_time * 1000))}</td>
            <td>${gameModes[data[i].game_mode]}</td>
            <td><img src="resources/hero-images/${data[i].hero_id}.png" class="hero" /> ${heroNames[data[i].hero_id]}</td>
            <td>${data[i].kills}</td><td>${data[i].deaths}</td>
            <td>${data[i].assists}</td>
            <td>${data[i].gold_per_min}</td>
            <td>${data[i].last_hits}</td>
        </tr>`;
        }

        STORE[accountID] = showMoreMatches;
        $(`.${accountID}-show-more`).on('click', function(){
            $(`.${accountID}-show-more`).remove();
            $(`.${accountID}-matches-table`).append(STORE[accountID]);
        });

        $(`.${accountID}-matches`).append(`<button class="${accountID}-show-more">Show More</button>`);
    }

    let showMoreMatches = ``;
    for (let i = 5; i < 20; i++) {   // The start_time property is formatted in Epoch time
        showMoreMatches += `<tr class="matchid-${data[i].match_id}">
        <td>${formatDate(new Date(data[i].start_time * 1000))}</td>
        <td>${gameModes[data[i].game_mode]}</td>
        <td><img src="resources/hero-images/${data[i].hero_id}.png" class="hero" /> ${heroNames[data[i].hero_id]}</td>
        <td>${data[i].kills}</td><td>${data[i].deaths}</td>
        <td>${data[i].assists}</td>
        <td>${data[i].gold_per_min}</td>
        <td>${data[i].last_hits}</td>
    </tr>`;
    }
    STORE[accountID] = showMoreMatches;
    $(`.${accountID}-show-more`).on('click', function(){
        $(`.${accountID}-show-more`).remove();
        $(`.${accountID}-matches-table`).append(STORE[accountID]);
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
        if (data[i].games > 0) { // Handle edgecase: No games played with hero
            heroes += `<tr>
                            <td><img src="resources/hero-images/${data[i].hero_id}.png" class="hero" /> ${heroNames[data[i].hero_id]}</td>
                            <td>${data[i].games}</td>
                            <td>${Math.round((data[i].win / data[i].games) * 100)}%</td>
                        </tr>`
        }
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
                            <td><img src="resources/hero-images/${minGamesAgainst[i].hero_id}.png" class="hero" /> ${heroNames[minGamesAgainst[i].hero_id]}</td>
                            <td>${Math.round((minGamesAgainst[i].against_win / minGamesAgainst[i].against_games) * 100)}%</td>
                        </tr>`
    }
    $(`.${accountID}-strengths-table`).append(bestMatchups);

    // Populate Weakest Matchups
    minGamesAgainst.sort((a,b) => (a.against_win / a.against_games) - (b.against_win / b.against_games))
    let worstMatchups = ``;
    for (let i = 0; i < 5; i++) {
        worstMatchups += `<tr>
                            <td><img src="resources/hero-images/${minGamesAgainst[i].hero_id}.png" class="hero" /> ${heroNames[minGamesAgainst[i].hero_id]}</td>
                            <td>${Math.round((minGamesAgainst[i].against_win / minGamesAgainst[i].against_games) * 100)}%</td>
                        </tr>`
    }
    $(`.${accountID}-weakness-table`).append(worstMatchups);

}

/* -------------------------------------------------------------------------- */
/*                                   Control                                  */
/* -------------------------------------------------------------------------- */

function init () {
    $('body').on('submit', 'form', function(e) {
        e.preventDefault();
        $('#player-search').blur();

        const searchInput = $('#player-search').val();
        getPlayerList(searchInput);
    });

    $('#player-search').focus();
};

$(document).ready(init());