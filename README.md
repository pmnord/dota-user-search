# Dota2 Player Stats Lookup

Live Demo: https://pmnord.github.io/dota-player-lookup/

Try searching Pete or Dendi or Arteezy. You can enter almost any value, and the Open Dota API will search for player usernames with that value.  Results will be sorted based on recent account activity.

**Limited to 6 searches per minute. Each search makes 10 calls to the API (one for the search, three for each of the three user profiles) and the API is limited to 60/minute.**

## Summary

This application allows users to look up DOTA players by their username and find competitive player performance information. DOTA player names are non-unique, which can make looking up users difficult. By displaying multiple profiles, profile images, and recent game information, users can much more easily identify the actual player they're searching for. The app also has very few click-throughs - just one search term and enter - to make player research relatively fast and easy.

## Technologies Used
- HTML5
- CSS3
- JavaScript
- jQuery
- AJAX

## Screenshots

**Landing Page**

![Desktop Landing Page](/screenshots/dota-app-ss-1.png)

**Search Results**

![Desktop Search Results](/screenshots/dota-app-ss-2.png)

## User Stories

| Role  | Task  | Importance  |
|---|---|---|
| As a new user  | I want to understand how to use the search input  | High  |
| As a new user  | I want to look up a player by their name  | High  |
| As a new user  | I want to learn more about a player's performance stats  | High  |
| As a new user  | I want to see a recent history of a player's games  | High  |
| As a new user  | I want to find a player's steam profile and be linked there  | High  |
| As a returning user  | I want to easly do multiple searches to research multiple players | Medium  |
| As a color-blind user  | I want to have key information represented by more than just colors  | High  |
| As a blind user  | I want to navigate the page with a keyboard  | High  |

## User Flow

**What the user sees, what the user does, what happens**
- Landing page with search input
    - User enters a valid search term
        - User sent to Search Results
    - User enters an invalid search term
        - Told that search input is required
        - If no results, displays "no results" to screen

- Search Results List
    - User clicks 'show more' on recent games
        - Full list of recent matches from API displayed
    - User enters a new search term
        - User sees a new list of search results
    - User clicks a link in search results
        - Redirected off-site