import { getRandomNonce, toNano } from "locklift";
import ora from "ora";

import "dotenv/config";
import {
  Ed25519KeyPair,
  EverWalletAccount,
  HighloadWalletV2,
  WalletV3Account,
} from "everscale-standalone-client/nodejs";

export async function computeAddressFromPublicKey(publicKey: string, walletType = "EverWallet", workchain = 0) {
  let wallet;
  switch (walletType) {
    case "WalletV3":
      wallet = WalletV3Account;
      break;
    case "EverWallet":
      wallet = EverWalletAccount;
      break;
    case "HighloadWalletV2":
      wallet = HighloadWalletV2;
      break;
    default:
      return "";
  }
  // Compute the address
  const address = await wallet.computeAddress({
    publicKey: publicKey,
    workchain: workchain, // You may need to adjust this based on your needs
  });
  return address.toString();
}

async function main() {
  const spinner = ora();
  spinner.start(`Deploy Collection`);
  try {
    const Nft = await locklift.factory.getContractArtifacts("Nft");
    const Index = await locklift.factory.getContractArtifacts("Index");
    const IndexBasis = await locklift.factory.getContractArtifacts("IndexBasis");

    const keyPair: Ed25519KeyPair = {
      publicKey: process.env.MY_PUBLIC_KEY || "",
      secretKey: process.env.MY_PRIVATE_KEY || "",
    };
    locklift.keystore.addKeyPair(keyPair);
    const signer = (await locklift.keystore.getSigner("1"))!;
    const { contract: collection, tx } = await locklift.factory.deployContract({
      contract: "Collection",
      publicKey: signer.publicKey,
      initParams: {},
      constructorParams: {
        codeNft: Nft.code,
        codeIndex: Index.code,
        json: `{
          "type": "Basic NFT",
          "name": "NFT Collection for Fidget Games",
          "description": "Fidget Games NFTs give you access to games in Fidget Games ecosystem.",
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
        ownerPubkey: "0x" + process.env.MY_PUBLIC_KEY,
      },
      value: toNano(0.5),
    });
    spinner.succeed(`Deploy Collection`);
    console.log(`Collection deployed at: ${collection.address.toString()}`);
  } catch (err) {
    spinner.fail(`Failed`);
    console.log(JSON.stringify(err, null, 2));
  }
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
