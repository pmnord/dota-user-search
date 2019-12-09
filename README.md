# Dota2 Player Stats Lookup

Live Demo: https://pmnord.github.io/dota-player-lookup/
> Try searching Pete or Dendi or Arteezy. You can enter almost any value, and the Open Dota API will search for player usernames with that value.  Results will be sorted based on recent account activity.

**Limited to 6 searches per minute. Each search makes 10 calls to the API and the API is limited to 60/minute.**

### Todos

1. Format match dates more neatly
1. Style the app
1. Find a banner image/background

### Notes

This project has definitely showed me the limitations of working with a small number of API calls - I would like to add further search refinement and player details, but it would require many more calls to the API
- For example, showing the user a player's performance stats compared to the average player performance - which would recall a separate API call for each hero to get the average performance
