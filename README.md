# project-horse

Website for Sunsfan's Auto Battler Project

To run locally

- npm install at root
- npm install in client
- npm run dev to launch

init.sql will initialize the postgres database

# Queries that run for each player when the game starts

Routes

/:steamID
getPlayer()

/plus_benefits
canUseWeeklyDoubleDown()
canClaimDailyPlusGold()

/cosmetics
getCosmetics()

/cosmetics/unviewed_types
getUnviewedCosmeticTypes()

/gods
getGods()

There are a lot of other requests that can happen during the game, such was when a player opens the armory, it will load the battle pass/battle pass levels.

Here's a couple seconds of logs from the server, to give you an idea of what endpoints are getting hit, and how long they take.
