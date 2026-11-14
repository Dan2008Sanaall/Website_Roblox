/**
 * ROBLOX SCRIPT GUIDES
 * ---------------------------------------------------------------------------
 * Every object in this list becomes one page at /scripts/<slug>/ and one card
 * on the homepage, the Roblox Scripts page and in search.
 *
 * These are SAMPLE ARTICLES. The Luau snippets are simple teaching examples
 * for Roblox Studio; test them in your own place before relying on them.
 *
 * Fields
 *   slug          URL part, lowercase with dashes (must be unique)
 *   title         Article title
 *   topic         Game or topic the article is about
 *   type          'studio'      -> written for Roblox Studio development
 *                 'third-party' -> involves an executor or other outside tool
 *   purpose       Short label describing what the script is for
 *   icon / hue    Thumbnail artwork (see content/codes.js for options)
 *   summary       One sentence for cards and the meta description
 *   published / updated   YYYY-MM-DD
 *   what          Paragraphs explaining what the script does
 *   requirements  Array of strings
 *   code          Optional Luau source (use String.raw so backslashes survive)
 *   codeLabel     Optional caption above the code block, e.g. where it goes
 *   steps         Step-by-step instructions
 *   warnings      Safety notes. Never claim a script is safe unless verified.
 */
const raw = String.raw;

module.exports = [
  {
    slug: 'redeem-code-system',
    title: 'How to build a redeem-code system in Roblox Studio',
    topic: 'Game systems',
    type: 'studio',
    purpose: 'Reward codes',
    icon: 'code',
    hue: 220,
    summary: 'A server-side Luau example that lets players redeem one-time codes for coins in your own game.',
    published: '2026-11-09',
    updated: '2026-11-14',
    what: [
      'This example adds a basic code system to a game you are building. The server keeps the list of valid codes, checks whether a player has already used one, and then adds coins to their leaderstats.',
      'All checks happen on the server. The client only sends the text the player typed, so players cannot grant themselves rewards by editing local scripts.',
    ],
    requirements: [
      'Roblox Studio and edit access to the place.',
      'A leaderstats folder with a Coins value (see the leaderboard tutorial).',
      'A published place with “Enable Studio Access to API Services” turned on, so DataStores work while testing.',
    ],
    codeLabel: 'Script in ServerScriptService',
    code: raw`local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local DataStoreService = game:GetService("DataStoreService")

local redeemedStore = DataStoreService:GetDataStore("RedeemedCodes_v1")

-- Add or remove codes here. Keys must be upper case.
local CODES = {
	WELCOME = { coins = 100 },
	UPDATE1 = { coins = 250, expires = os.time({ year = 2030, month = 1, day = 1 }) },
}

local redeemFunction = Instance.new("RemoteFunction")
redeemFunction.Name = "RedeemCode"
redeemFunction.Parent = ReplicatedStorage

local busy = {}

local function redeem(player, rawCode)
	-- Never trust what the client sends.
	if typeof(rawCode) ~= "string" or #rawCode > 32 then
		return false, "That code is not valid."
	end

	local code = string.upper(rawCode)
	local reward = CODES[code]
	if not reward then
		return false, "That code is not valid."
	end
	if reward.expires and os.time() > reward.expires then
		return false, "That code has expired."
	end

	local key = player.UserId .. "_" .. code
	local readOk, alreadyUsed = pcall(function()
		return redeemedStore:GetAsync(key)
	end)
	if not readOk then
		return false, "Could not check the code. Please try again."
	end
	if alreadyUsed then
		return false, "You have already used that code."
	end

	local leaderstats = player:FindFirstChild("leaderstats")
	local coins = leaderstats and leaderstats:FindFirstChild("Coins")
	if not coins then
		return false, "Your data is still loading. Please try again."
	end

	local writeOk = pcall(function()
		redeemedStore:SetAsync(key, true)
	end)
	if not writeOk then
		return false, "Could not save the code. Please try again."
	end

	coins.Value += reward.coins
	return true, "Code redeemed: +" .. reward.coins .. " coins"
end

redeemFunction.OnServerInvoke = function(player, rawCode)
	if busy[player] then
		return false, "Please wait a moment."
	end
	busy[player] = true
	local ok, success, message = pcall(redeem, player, rawCode)
	busy[player] = nil
	if not ok then
		return false, "Something went wrong. Please try again."
	end
	return success, message
end

Players.PlayerRemoving:Connect(function(player)
	busy[player] = nil
end)`,
    steps: [
      'In the Explorer, hover over ServerScriptService, press + and insert a Script.',
      'Paste the code above into the script and edit the CODES table.',
      'Create a ScreenGui with a TextBox and a TextButton for players to type into.',
      'In a LocalScript under the button, call ReplicatedStorage.RedeemCode:InvokeServer(textBox.Text) and show the returned message.',
      'Publish the place, enable API access in Game Settings → Security, then press Play to test.',
    ],
    warnings: [
      'Keep the list of codes in a server Script. Anything placed in a LocalScript or ReplicatedStorage can be read by players.',
      'DataStore requests can fail or be throttled. This example reports an error instead of granting the reward, but a production game should also retry and log failures.',
    ],
  },
  {
    slug: 'leaderstats-leaderboard',
    title: 'Create a leaderstats leaderboard with Coins',
    topic: 'Beginner basics',
    type: 'studio',
    purpose: 'Leaderboard',
    icon: 'star',
    hue: 204,
    summary: 'A short beginner script that shows a Coins value next to each player on the in-game leaderboard.',
    published: '2026-11-03',
    updated: '2026-11-12',
    what: [
      'Roblox shows any values stored in a folder named leaderstats on the default player list. This script creates that folder and a Coins value whenever a player joins.',
    ],
    requirements: ['Roblox Studio and edit access to the place.'],
    codeLabel: 'Script in ServerScriptService',
    code: raw`local Players = game:GetService("Players")

local function onPlayerAdded(player)
	local leaderstats = Instance.new("Folder")
	leaderstats.Name = "leaderstats" -- must be lower case
	leaderstats.Parent = player

	local coins = Instance.new("IntValue")
	coins.Name = "Coins"
	coins.Value = 0
	coins.Parent = leaderstats
end

Players.PlayerAdded:Connect(onPlayerAdded)

-- Handle anyone who joined before this script started running.
for _, player in Players:GetPlayers() do
	task.spawn(onPlayerAdded, player)
end`,
    steps: [
      'Insert a Script into ServerScriptService.',
      'Paste the code and press Play.',
      'Open the player list in the top-right corner to see the Coins column.',
    ],
    warnings: [
      'This example does not save progress. Values reset when the player leaves unless you add DataStore saving.',
    ],
  },
  {
    slug: 'tween-sliding-door',
    title: 'Make a sliding door with TweenService',
    topic: 'Building & animation',
    type: 'studio',
    purpose: 'Animation',
    icon: 'shield',
    hue: 236,
    summary: 'Use a ProximityPrompt and TweenService to smoothly open and close a door part.',
    published: '2026-10-27',
    updated: '2026-11-08',
    what: [
      'This script slides a door sideways when a player triggers a ProximityPrompt, then slides it back the next time. TweenService handles the smooth movement.',
    ],
    requirements: [
      'Roblox Studio and edit access to the place.',
      'An anchored Part to act as the door, with a ProximityPrompt inside it.',
    ],
    codeLabel: 'Script inside the door Part',
    code: raw`local TweenService = game:GetService("TweenService")

local door = script.Parent
local prompt = door:WaitForChild("ProximityPrompt")

local closedCFrame = door.CFrame
local openCFrame = closedCFrame * CFrame.new(door.Size.X, 0, 0)
local tweenInfo = TweenInfo.new(0.6, Enum.EasingStyle.Quad, Enum.EasingDirection.Out)

local isOpen = false
local isMoving = false

prompt.Triggered:Connect(function()
	if isMoving then
		return
	end
	isMoving = true
	isOpen = not isOpen

	local goal = { CFrame = if isOpen then openCFrame else closedCFrame }
	local tween = TweenService:Create(door, tweenInfo, goal)
	tween:Play()
	tween.Completed:Wait()

	prompt.ActionText = if isOpen then "Close" else "Open"
	isMoving = false
end)`,
    steps: [
      'Create a Part for the door and tick Anchored in the Properties window.',
      'Insert a ProximityPrompt into the Part and set ActionText to Open.',
      'Insert a Script into the same Part and paste the code.',
      'Press Play, walk up to the door and hold the prompt key.',
    ],
    warnings: ['The door must be anchored, otherwise physics will fight the tween.'],
  },
  {
    slug: 'datastore-save-coins',
    title: 'Save player Coins with DataStoreService',
    topic: 'Saving data',
    type: 'studio',
    purpose: 'Data saving',
    icon: 'bolt',
    hue: 212,
    summary: 'A starter pattern for loading Coins when a player joins and saving them when they leave.',
    published: '2026-10-19',
    updated: '2026-11-05',
    what: [
      'This script loads a saved Coins value when a player joins and writes it back when they leave or the server shuts down. It is a learning example that shows the basic flow.',
    ],
    requirements: [
      'Roblox Studio and edit access to the place.',
      'A published place with “Enable Studio Access to API Services” turned on.',
    ],
    codeLabel: 'Script in ServerScriptService',
    code: raw`local Players = game:GetService("Players")
local DataStoreService = game:GetService("DataStoreService")

local coinStore = DataStoreService:GetDataStore("PlayerCoins_v1")
local loaded = {}

local function onPlayerAdded(player)
	local leaderstats = Instance.new("Folder")
	leaderstats.Name = "leaderstats"
	leaderstats.Parent = player

	local coins = Instance.new("IntValue")
	coins.Name = "Coins"
	coins.Parent = leaderstats

	local ok, saved = pcall(function()
		return coinStore:GetAsync(player.UserId)
	end)

	if ok then
		coins.Value = saved or 0
		loaded[player] = true
	else
		-- Do not mark as loaded, so we never overwrite real data with 0.
		warn("Could not load data for", player.Name)
	end
end

local function save(player)
	if not loaded[player] then
		return
	end
	local coins = player.leaderstats.Coins.Value
	local ok, err = pcall(function()
		coinStore:SetAsync(player.UserId, coins)
	end)
	if not ok then
		warn("Could not save data for", player.Name, err)
	end
end

Players.PlayerAdded:Connect(onPlayerAdded)

Players.PlayerRemoving:Connect(function(player)
	save(player)
	loaded[player] = nil
end)

game:BindToClose(function()
	for _, player in Players:GetPlayers() do
		save(player)
	end
end)`,
    steps: [
      'Publish your place, then open Game Settings → Security and enable Studio access to API services.',
      'Insert a Script into ServerScriptService and paste the code.',
      'If you already use the leaderboard script from the other tutorial, remove it so leaderstats is only created once.',
      'Play, change your Coins from the server view, stop, and play again to confirm the value loads.',
    ],
    warnings: [
      'This is a simplified example. Larger games usually add retries, session locking and UpdateAsync to avoid losing or duplicating data.',
      'Testing in Studio writes to the same DataStore as the live game. Use a separate test place if your game is already public.',
    ],
  },
  {
    slug: 'executor-scripts-risks',
    title: 'Executor scripts explained: what they are and the risks',
    topic: 'Account safety',
    type: 'third-party',
    purpose: 'Safety explainer',
    icon: 'shield',
    hue: 258,
    summary: 'An explainer on third-party “executor” scripts, why they break Roblox’s rules and how they put accounts and devices at risk.',
    published: '2026-11-06',
    updated: '2026-11-13',
    what: [
      'Some scripts shared online are not made for Roblox Studio. They are meant to be run inside other people’s games using a separate program, usually called an executor or injector. That makes them very different from the Studio tutorials on this site.',
      'BloxBeacon does not publish executor scripts or link to executors. This article exists so you can recognise them and understand the risks before you come across one elsewhere.',
    ],
    requirements: [
      'Executor scripts depend on third-party software that is not made or supported by Roblox.',
      'That software must modify or attach to the Roblox client, which Roblox’s Terms of Use do not allow.',
    ],
    steps: [
      'Check where a script is supposed to run. If the instructions mention an executor, injector or “loadstring”, it is not a Roblox Studio script.',
      'Be cautious of download pages that ask you to turn off antivirus software, complete surveys or install extra programs.',
      'Never enter your Roblox password, a login code or your .ROBLOSECURITY cookie into a script, tool or website other than the official Roblox login.',
      'If you want to learn scripting, use Roblox Studio instead. It is free, official, and the skills carry over to making your own games.',
    ],
    warnings: [
      'Using exploits can lead to warnings, temporary bans or permanent account deletion, including the loss of purchased items.',
      'Executors and the scripts they load are a common way to spread malware and account stealers. We have not verified any third-party tool as safe and do not recommend any.',
      'No script can honestly promise to be “undetectable” or “guaranteed to work”. Treat those claims as a warning sign.',
    ],
  },
  {
    slug: 'check-free-models-for-backdoors',
    title: 'How to check free models for hidden scripts',
    topic: 'Account safety',
    type: 'studio',
    purpose: 'Safety check',
    icon: 'tower',
    hue: 196,
    summary: 'A Command Bar snippet that lists every script in your place so you can review anything you did not add.',
    published: '2026-10-12',
    updated: '2026-11-04',
    what: [
      'Free models from the Toolbox sometimes contain extra scripts you did not ask for. This snippet prints the location of every script in your place so you can open and read each one.',
      'It only lists scripts. It cannot tell you whether a script is harmful, so you still need to review them yourself.',
    ],
    requirements: [
      'Roblox Studio with the Command Bar and Output windows open (both are in the View tab).',
    ],
    codeLabel: 'Paste into the Studio Command Bar',
    code: raw`local count = 0
for _, item in game:GetDescendants() do
	local ok, isScript = pcall(function()
		return item:IsA("LuaSourceContainer")
	end)
	if ok and isScript then
		count += 1
		print(item.ClassName, item:GetFullName())
	end
end
print("Scripts found:", count)`,
    steps: [
      'Open View → Command Bar and View → Output.',
      'Paste the snippet into the Command Bar and press Enter.',
      'Go through the list in Output. Open any script you do not recognise.',
      'Look for require() calls with long number IDs, getfenv, loadstring, or code that is deliberately unreadable. Delete scripts you cannot explain.',
    ],
    warnings: [
      'A clean result from this snippet does not prove a model is safe. Plugins can also insert scripts, so only install plugins from creators you trust.',
    ],
  },
];
