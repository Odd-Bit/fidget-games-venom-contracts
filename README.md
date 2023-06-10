iFidget Games

# About the project

Mission: Bringing gaming nostalgia through daily mini-games and NFT ownership.

Vision: Become marketplace for **ALL** games.

## The Team

Manish - CTO, gamer

Raunak - senior developer, gamer

Gokul - business developer, gamer

## The Inspiration

> Market consensus "the next wave of web3 adoption will happen through gaming", as observed in major blockchains pivoting to this sector

Gaming can be approached in two ways: AAA and casual,

**AAA games**, such as CS: GO and Minecraft, have a dedicated audience of **hardcore gamers**, making it unrealistic to expect widespread adoption among the general public in the web3 space

**Casual games** are more commonly played by the average person, but they face a challenge of **low player retention**. Casual gamers tend to quickly move on from one game to the next after experiencing initial excitement

Tokenomics, gameplay, play-to-earn, NFTs by themselves do not guarantee an ideal user base

## The Solution

> _Fidget Games_, play one new game every day.

1. Single app with a new game every day, without having to update the app or download from the store

2. In-house game development team creates fantastic games with following things at the core:

   - low complexity
   - new mechanics
   - unique artwork
   - game for everyone
   - infinite levels

3. 24-hour shelf life, so users will have to purchase the game

   - limited time to decide
   - engaging gameplay
   - extended playability
   - orginial designs

> Users will feel at home, enjoying new games from the comfort of Fidget Games app

<img src="./docs/assets/user%20flow.jpg" width="300" alt="user flow"></img>

### True Potential

> Our success would mean we become an **alternative distribution & monetization platform**

Game developers can break free from their dependency on playstore / appstore / steam, given that we will have built the ecosystem & user base.

### Games

Our team creates games that are fun, relaxing and addictive.

<video width="130" height="240" controls>
  <source src="./docs/assets/game_1.mp4" type="video/mp4">
</video>

<video width="130" height="240" controls>
  <source src="./docs/assets/game_2.mp4" type="video/mp4">
</video>

## The Opportunity

> Global mobile gaming sector market cap is $138 billion, with 2.3 billion players as of 2023 - estimated to increase by 400 million by 2027

> MENA constitutes 15% of the global player base, and is predicted to generate double the revenue by 2026 compared to $3 billion in 2021

These fact motivated us to focus on transforming the gaming experience for the people, and facilitate true ownership of games and game assets.

### Venom

> We have chosen Venom Blockchain, to explore its fast transaction speeds and infinite scalability

With the recent launch of Venom, as the blockchain gears up for mass adoption, there is a high growth potential that will mutually benefit both Fidget Games and Venom, as we strive to achieve a similar goal, to enable the next wave of web3.

# Table of Contents

- [About the project](#about-the-project)
- [Table of Contents](#table-of-contents)
- [Project structure](#project-structure)
  - [`./contracts`](#contracts)
  - [`locklift.config.ts`](#lockliftconfigts)
  - [`scripts`](#scripts)
  - [`test`](#test)
- [Getting started](#getting-started)
  - [Build contracts](#build-contracts)
  - [Test contracts](#test-contracts)
  - [Deploy contracts](#deploy-contracts)
  - [Add New Game](#add-game)
  - [Mint NFT](#mint-nft)
  - [Local node](#local-node)

# Project structure

Below you will find info about the project structure and the purpose of the main directories and files.

## `./contracts`

Directory for smart contracts.

## `locklift.config.ts`

Locklift config file. You can find the basic layout [here](https://docs.venom.foundation/build/development-guides/setting-up-the-venom-smart-contract-development-environment/#configuration)

## `scripts`

Directory for migrations scripts to deploy and set up your contracts.

## `test`

Directory for tests.

# Getting started

First, let's check configs at `locklift.config.ts` [file](#lockliftconfigts). Be sure that you provide the correct settings for all required networks.

After you check all settings, we are ready to [build](#build-contracts), [test](#test-contracts), [deploy](#deploy-contracts) and [mint](#mint-nft) NFT.

## Build contracts

```bash
npm run build
```

## Test contracts

To test contracts locally, we need to run the [local node](#local-node).

```bash
npm run run:local-node
```

To run tests on the venom devnet, make sure you have added a giver for that network in `locklift.config.ts`.

```bash
npm run test:local
npm run test:devnet
```

## Deploy contracts

```bash
# deploy on the devnet
npm run deploy:devnet

# deploy on the mainnet
npm run deploy:mainnet
```

## Add New Game

```bash
# mint on the devnet
npm run addgame:devnet

# deploy on the mainnet
npm run addgame:mainnet

```

## Mint NFT

```bash
# mint on the devnet
npm run mint:devnet

# deploy on the mainnet
npm run mint:mainnet

```

## Local node

[Local node](https://hub.docker.com/r/tonlabs/local-node). is a pre-configured Docker image with a Ganache-like local blockchain that is designed for dapp debugging and testing.

Container exposes the specified 80 port with nginx which proxies requests to /graphql to GraphQL API. You can access graphql endpoint at `http://localhost/graphql`

```bash
# run
npm run run:local-node

# stop
npm run stop:local-node
```
