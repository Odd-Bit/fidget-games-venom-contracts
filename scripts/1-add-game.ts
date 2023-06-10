import { Ed25519KeyPair } from "everscale-standalone-client";
import { Address, toNano, WalletTypes } from "locklift";
import ora from "ora";
import prompts from "prompts";

const games = [
  {
    description:
      "Tired is our celestial centipede, from living inside the cracks of walls. Steer it towards the blue shimmer and avoid the blood thirsty lice.",
    id: "2cc1ebc6",
    name: "Frame Shooter",
    preview:
      "https://firebasestorage.googleapis.com/v0/b/fidget-f6a9f.appspot.com/o/gameImages%2F2cc1ebc6-large.jpeg?alt=media",
  },
  {
    id: "d4fda1b5",
    name: "Notebook Shooter",
    preview:
      "https://firebasestorage.googleapis.com/v0/b/fidget-f6a9f.appspot.com/o/gameImages%2Fd4fda1b5-large.jpeg?alt=media",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/fidget-f6a9f.appspot.com/o/gameImages%2Fd4fda1b5-sm.jpeg?alt=media",
    description: "Steer the doodle tank and get rid of the bullying bombs that have invaded your notebook. ",
  },
];
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
    for (let idx in games) {
      const game = games[idx];
      console.log(game);
      await collectionInstance.methods
        .addNewGameInfo({
          gameInfo: {
            id: `0x${game.id}`,
            startTimestamp: Math.floor(Date.now() / 1000),
            endTimestamp: Math.floor((Date.now() + 10 * 24 * 60 * 60 * 1000) / 1000),
          },
          json: JSON.stringify(
            {
              type: "Basic NFT",
              name: game.name,
              description: game.description,
              preview: {
                source: game.preview,
                mimetype: "image/jpeg",
              },
              files: [
                {
                  source: game.preview,
                  mimetype: "image/jpeg",
                },
              ],
            },
            null,
            2,
          ),
        })
        .sendExternal({ publicKey: keyPair.publicKey });
      const { value0: gameInfo } = await collectionInstance.methods
        .getGameInfo({
          gameId: `0x${game.id}`,
        })
        .call();
      console.log(gameInfo);
    }
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
