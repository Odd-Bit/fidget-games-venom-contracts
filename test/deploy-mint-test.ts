import { expect, use } from "chai";
import { Account, Signer } from "everscale-standalone-client/nodejs";
import { Address, Contract, WalletTypes, getRandomNonce, lockliftChai, toNano } from "locklift";
import * as nt from "nekoton-wasm";

import { FactorySource } from "../build/factorySource";

let collection: Contract<FactorySource["Collection"]>;
let owner: Account;
let ownerKeys: nt.Ed25519KeyPair;
let nft1Address: Address;
let nft2Address: Address;

use(lockliftChai);

describe("Test NFT Collection deployment and NFT minting", async function () {
  before(async () => {
    ownerKeys = {
      publicKey: process.env.MY_PUBLIC_KEY || "",
      secretKey: process.env.MY_PRIVATE_KEY || "",
    };
    locklift.keystore.addKeyPair(ownerKeys);
    const { account } = await locklift.factory.accounts.addNewAccount({
      type: WalletTypes.WalletV3,
      publicKey: ownerKeys.publicKey,
      value: locklift.utils.toNano(10),
    });
    owner = account;
  });

  it("Load Collection contract factory", async function () {
    const contractData = locklift.factory.getContractArtifacts("Collection");
    expect(contractData.code).not.to.equal(undefined, "Code should be available");
    expect(contractData.abi).not.to.equal(undefined, "ABI should be available");
    expect(contractData.tvc).not.to.equal(undefined, "tvc should be available");
  });

  it("Load Nft contract factory", async function () {
    const contractData = locklift.factory.getContractArtifacts("Nft");
    expect(contractData.code).not.to.equal(undefined, "Code should be available");
    expect(contractData.abi).not.to.equal(undefined, "ABI should be available");
    expect(contractData.tvc).not.to.equal(undefined, "tvc should be available");
  });

  it("Load Index contract factory", async function () {
    const contractData = locklift.factory.getContractArtifacts("Index");
    expect(contractData.code).not.to.equal(undefined, "Code should be available");
    expect(contractData.abi).not.to.equal(undefined, "ABI should be available");
    expect(contractData.tvc).not.to.equal(undefined, "tvc should be available");
  });

  it("Load IndexBasis contract factory", async function () {
    const contractData = locklift.factory.getContractArtifacts("IndexBasis");
    expect(contractData.code).not.to.equal(undefined, "Code should be available");
    expect(contractData.abi).not.to.equal(undefined, "ABI should be available");
    expect(contractData.tvc).not.to.equal(undefined, "tvc should be available");
  });

  it(`Deploy Collection contract`, async function () {
    this.timeout(60000);
    const Nft = locklift.factory.getContractArtifacts("Nft");
    const Index = await locklift.factory.getContractArtifacts("Index");
    const IndexBasis = await locklift.factory.getContractArtifacts("IndexBasis");
    const signer = (await locklift.keystore.getSigner("0"))!;

    const { contract } = await locklift.factory.deployContract({
      contract: "Collection",
      publicKey: signer.publicKey,
      initParams: {
        _nonce: getRandomNonce(),
      },
      constructorParams: {
        codeNft: Nft.code,
        codeIndex: Index.code,
        json: `{
          "type": "Basic NFT",
          "name": "NFT Collection for Fidget Games",
          "description": "Fidget Games NFTs give you access to play corresponding game in Fidget Games ecosystem.",
          "preview": {
              "source": "https://ipfs.io/ipfs/QmNm59CenWgC5MNuqB9EjYjNpbZgARshxQ6ZCqWYNSGsPR?filename=logo.png",
              "mimetype": "image/png"
          },
          "files": [
              {
                  "source": "https://ipfs.io/ipfs/QmNm59CenWgC5MNuqB9EjYjNpbZgARshxQ6ZCqWYNSGsPR?filename=logo.png",
                  "mimetype": "image/png"
              }
          ]
      }`,
        codeIndexBasis: IndexBasis.code,
        ownerPubkey: `0x` + ownerKeys.publicKey,
      },
      value: toNano(0.4),
    });
    collection = contract;

    const { count: id } = await collection.methods.totalSupply({ answerId: 0 }).call();

    expect(id).equal("0", "Amount of NFT in collection should be 0");
  });

  it(`should add new game info`, async function () {
    this.timeout(60000);
    await collection.methods
      .addNewGameInfo({
        gameInfo: {
          id: "0x080ecd63",
          startTimestamp: Math.floor(Date.now() / 1000),
          endTimestamp: Math.floor((Date.now() + 24 * 60 * 60 * 1000) / 1000),
        },
        json: `{
            "type": "Basic NFT",
            "name": "Tetris Jump",
            "description": "Tetris seems harmless doesn't it? Well its not that for our innocent little block.",
              "preview": {
                  "source": "https://firebasestorage.googleapis.com/v0/b/fidget-f6a9f.appspot.com/o/gameImages%2F080ecd63-large.jpeg?alt=media",
                  "mimetype": "image/jpeg"
              },
              "files": [
                  {
                      "source": "https://firebasestorage.googleapis.com/v0/b/fidget-f6a9f.appspot.com/o/gameImages%2F080ecd63-large.jpeg?alt=media",
                      "mimetype": "image/jpeg"
                  }
              ]
          }`,
      })
      .send({ from: owner.address, amount: toNano(0.3) });
  });

  it(`should get game info`, async function () {
    this.timeout(60000);
    const gameInfo = await collection.methods
      .getGameInfo({
        gameId: 0x080ecd63,
      })
      .call();
    console.log(gameInfo);
    expect(gameInfo.id).equal("0x080ecd63", "Game id should be 0x080ecd63");
  });

  it(`should not mint nft for incorrect id`, async function () {
    this.timeout(60000);
    // call mintNft function
    await collection.methods
      .mintGameNft({
        gameId: "0x0",
        seed: getRandomNonce(),
      })
      .send({ from: owner.address, amount: locklift.utils.toNano(0.3), bounce: true });

    const { count: id } = await collection.methods.totalSupply({ answerId: 0 }).call();

    const { nft: nftAddress } = await collection.methods.nftAddress({ answerId: 0, id: id }).call();

    expect(id).equal("0", "NFT id should be 0");
  });

  it(`should mint 1st nft with correct game id`, async function () {
    this.timeout(60000);
    // call mintNft function
    await collection.methods
      .mintGameNft({
        gameId: "0x080ecd63",
        seed: getRandomNonce(),
      })
      .send({ from: owner.address, amount: locklift.utils.toNano(1), bounce: true });
    const { count: id } = await collection.methods.totalSupply({ answerId: 0 }).call();

    const { nft: nftAddress } = await collection.methods.nftAddress({ answerId: 0, id: id }).call();
    nft1Address = nftAddress;

    expect(id).equal("1", "NFT id should be 1");
  });

  it(`should mint 2nd nft with correct game id`, async function () {
    this.timeout(60000);
    // call mintNft function
    await collection.methods
      .mintGameNft({
        gameId: "0x080ecd63",
        seed: getRandomNonce(),
      })
      .send({ from: owner.address, amount: locklift.utils.toNano(1), bounce: true });
    const { count: id } = await collection.methods.totalSupply({ answerId: 0 }).call();

    const { nft: nftAddress } = await collection.methods.nftAddress({ answerId: 0, id: id }).call();
    nft2Address = nftAddress;

    expect(id).equal("2", "NFT id should be 2");
  });

  this.afterAll(function () {
    console.log(`  collection address: ${collection.address.toString()}`);
    console.log(`  NFT1 address: ${nft1Address.toString()}`);
    console.log(`  NFT2 address: ${nft2Address.toString()}`);
    console.log(`  owner address: ${owner.address.toString()}`);
    console.log(`  owner public key: ${ownerKeys.publicKey}`);
    console.log(`  owner private key: ${ownerKeys.secretKey}`);
  });
});
