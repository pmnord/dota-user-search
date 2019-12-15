# Dota2 Player Stats Lookup

Live Demo: https://pmnord.github.io/dota-player-lookup/

Try searching Pete or Dendi or Arteezy. You can enter almost any value, and the Open Dota API will search for player usernames with that value.  Results will be sorted based on recent account activity.

**Limited to 6 searches per minute. Each search makes 10 calls to the API (one for the search, three for each of the three user profiles) and the API is limited to 60/minute.**

## Technologies Used
- HTML5
- CSS3
- JavaScript
- jQuery
- AJAX

## Screenshots
![Desktop Landing Page](/screenshots/dota-app-ss-1.png)
![Desktop Search Results](/screenshots/dota-app-ss-2.png)

![Mobile Landing Page](/screenshots/dota-app-ss-mobile-1.png)
![Mobile Search Results](/screenshots/dota-app-ss-mobile-2.png)

## User Stories

| Role  | Task  | Importance  |
|---|---|---|
| As a new user  | I want to understand how to use the search input  | High  |
| As a new user  | I want to be able to choose from a list of search results  | High  |
| As a new user  | I want to look up my own stats to better understand my performance  | High  |
| As a new user  | I want to look up other people's stats to learn their strengths and weakness  | High  |
| As a new user  | I want to look up my team stats to see our performance  | Medium  |
| As a new user  | I want to look up other team's stats to learn their strengths and weakness  | Medium  |
| As a returning user  | I want to see generally relevant stats on the starting view  | Medium  |
| As a returning user  | I want to do multiple searches in a row for deeper research  | Medium  |
| As a returning user  | I want to get links to further information for deeper research | Medium  |
| As a returning user  | I want to share the data that I've found with others  | Low  |
| As an administrator  | I want to add new data to player pages to show the user  | High  |
| As an administrator  | I want to add new types of searches and data  | Low  |
| As a color-blind user  | I want to be able to clearly see the data on the page  | High  |
| As a blind user  | I want to navigate the page with a keyboard  | High  |

## User Flow

**Views**
- Landing page
- Search Results

**What the user sees, what the user does, what happens**
- Landing page with search input
    - User enters a valid search term
        - User sent to Search Results
    - User enters an invalid search term
        - Told that search input is required
        - If no results, displays "no results" to screen

- Search Results List
    - User clicks 'show more' for further information
        - Additional data displayed to screen
    - User enters a new search term
        - User sees a new list of search results
    - Clicks a link in search results
        - Redirected off-site

### Todos

**Edgecases:** 
- ~~Search returns no results~~
- ~~Fewer results than our display for loop~~
- ~~Too few recent matches for the 'show more' button~~
- ~~No games played with hero in heroes array~~
- ~~Undefined returned when we try to access data~~
    - This was actually being caused by an error in the heroNames object

### Notes

This project has definitely showed me the limitations of working with a small number of API calls - I would like to add further search refinement and player details, but it would require many more calls to the API
- For example, showing the user a player's performance stats compared to the average player performance - which would recall a separate API call for each hero to get the average performance
