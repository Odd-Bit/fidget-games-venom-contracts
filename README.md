Fidget Games

# About the project

- only owner can add new games
- minting and burning NFTs
- transferring NFTs from one account to another
- selling your NFTs

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
