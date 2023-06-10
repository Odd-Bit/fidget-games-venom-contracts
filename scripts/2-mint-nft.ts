import { Ed25519KeyPair } from "everscale-standalone-client";
import { Address, getRandomNonce, toNano, WalletTypes } from "locklift";
import ora from "ora";
import prompts from "prompts";

async function main() {
  const spinner = ora();
  const answers = await prompts([
    {
      type: "text",
      name: "collectionAddr",
      message: "Collection address",
    },
  ]);
  spinner.start(`Mint Nft`);
  try {
    // initialize collection contract object by locklift
    const collectionInstance = locklift.factory.getDeployedContract("Collection", new Address(answers.collectionAddr));

    const keyPair: Ed25519KeyPair = {
      publicKey: process.env.MY_PUBLIC_KEY || "",
      secretKey: process.env.MY_PRIVATE_KEY || "",
    };
    locklift.keystore.addKeyPair(keyPair);

    // get current nft id (totalSupply) for future NFT address calculating
    const { count: id } = await collectionInstance.methods.totalSupply({ answerId: 0 }).call();
    spinner.succeed(`id: ${id}`);
    await collectionInstance.methods
      .mintGameNft({
        gameId: "0xd4fda1b5",
        seed: getRandomNonce(),
      })
      .send({ from: new Address(process.env.MY_ADDRESS || ""), amount: toNano(1.3) });

    const { nft: nftAddress } = await collectionInstance.methods.nftAddress({ answerId: 0, id: id }).call();
    console.log("Total Supply: ", await collectionInstance.methods.totalSupply({ answerId: 0 }).call());
    spinner.succeed(`NFT: ${nftAddress.toString()}`);
  } catch (err) {
    spinner.fail(`Failed`);
    console.log(err);
  }
}
/**
0:94550b809012f64384fa3ad526b81dd3690405fafe5629d567ff16cc179b7378
**/
main()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
