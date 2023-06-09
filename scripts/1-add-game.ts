import { Ed25519KeyPair } from "everscale-standalone-client";
import { Address, toNano, WalletTypes } from "locklift";
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
  spinner.start(`Add new game to Collection`);
  try {
    // initialize collection contract object by locklift
    const collectionInstance = locklift.factory.getDeployedContract("Collection", new Address(answers.collectionAddr));

    const keyPair: Ed25519KeyPair = {
      publicKey: process.env.MY_PUBLIC_KEY || "",
      secretKey: process.env.MY_PRIVATE_KEY || "",
    };
    locklift.keystore.addKeyPair(keyPair);
    const { account: someAccount } = await locklift.factory.accounts.addNewAccount({
      type: WalletTypes.WalletV3,
      value: toNano(10),
      publicKey: keyPair.publicKey,
    });
    await collectionInstance.methods
      .addNewGameInfo({
        gameInfo: {
          id: "0x080ecd63",
          startTimestamp: Date.now(),
          endTimestamp: Date.now() + 24 * 60 * 60 * 1000,
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
      .send({ from: someAccount.address, amount: toNano(0.3) });
  } catch (err) {
    spinner.fail(`Failed`);
    console.log(err);
  }
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
