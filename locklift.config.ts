import { LockliftConfig } from "locklift";
import { FactorySource } from "./build/factorySource";
import "dotenv/config";
declare global {
  const locklift: import("locklift").Locklift<FactorySource>;
}

const LOCAL_NETWORK_ENDPOINT = "http://localhost/graphql";

const VENOM_TESTNET_ENDPOINT = process.env.VENOM_TESTNET_ENDPOINT || "https://jrpc-testnet.venom.foundation/rpc";
const VENOM_TESTNET_TRACE_ENDPOINT =
  process.env.VENOM_TESTNET_TRACE_ENDPOINT || "https://gql-testnet.venom.foundation/graphql";
const VENOM_DEVNET_ENDPOINT = process.env.VENOM_DEVNET_ENDPOINT || "https://jrpc-devnet.venom.foundation/";
const VENOM_DEVNET_TRACE_ENDPOINT =
  process.env.VENOM_DEVNET_TRACE_ENDPOINT || "https://gql-devnet.venom.network/graphql";

/**
 * 
GraphQL: https://gql-devnet.venom.network/graphql
Explorer: <https://devnet.venomscan.com/ >
JRPC: https://jrpc-devnet.venom.foundation/

Instant faucet:
https://devnetfaucet.com/
Venom Blockchain Explorer
Search transactions, addresses, tokens and other activities on Venom Blockchain
in your ll config, change these urls
testnet -> devnet
 **/
const config: LockliftConfig = {
  compiler: {
    // Specify path to your TON-Solidity-Compiler
    // path: "/mnt/o/projects/broxus/TON-Solidity-Compiler/build/solc/solc",

    // Or specify version of compiler
    version: "0.58.1",

    externalContracts: {
      "node_modules/@itgold/everscale-tip/contracts/TIP4_3/compiled": ["Index", "IndexBasis"],
    },
  },
  linker: {
    // Specify path to your stdlib
    // lib: "/mnt/o/projects/broxus/TON-Solidity-Compiler/lib/stdlib_sol.tvm",
    // // Specify path to your Linker
    // path: "/mnt/o/projects/broxus/TVM-linker/target/release/tvm_linker",

    // Or specify version of linker
    version: "0.15.48",
  },
  networks: {
    local: {
      // Specify connection settings for https://github.com/broxus/everscale-standalone-client/
      connection: {
        id: 1,
        group: "localnet",
        type: "graphql",
        data: {
          endpoints: [LOCAL_NETWORK_ENDPOINT],
          latencyDetectionInterval: 1000,
          local: true,
        },
      },
      // This giver is default local-node giverV2
      giver: {
        // Check if you need provide custom giver
        address: "0:ece57bcc6c530283becbbd8a3b24d3c5987cdddc3c8b7b33be6e4a6312490415",
        key: "172af540e43a524763dd53b26a066d472a97c4de37d5498170564510608250c3",
      },
      tracing: {
        endpoint: LOCAL_NETWORK_ENDPOINT,
      },
      keys: {
        // Use everdev to generate your phrase
        // !!! Never commit it in your repos !!!
        // phrase: "action inject penalty envelope rabbit element slim tornado dinner pizza off blood",
        amount: 20,
      },
    },
    test: {
      connection: {
        id: 1000,
        type: "jrpc",
        group: "dev",
        data: {
          endpoint: VENOM_TESTNET_ENDPOINT,
        },
      },
      giver: {
        address: process.env.MY_ADDRESS || "",
        key: process.env.MY_PRIVATE_KEY || "",
      },
      tracing: {
        endpoint: VENOM_TESTNET_TRACE_ENDPOINT,
      },
      keys: {
        // Use everdev to generate your phrase
        // !!! Never commit it in your repos !!!
        phrase: process.env.SIGNER_SEED_PHRASE,
        amount: 2,
      },
    },
    devnet: {
      connection: {
        id: 1000,
        type: "jrpc",
        group: "dev",
        data: {
          endpoint: VENOM_DEVNET_ENDPOINT,
        },
      },
      giver: {
        address: process.env.MY_ADDRESS || "",
        key: process.env.MY_PRIVATE_KEY || "",
      },
      tracing: {
        endpoint: VENOM_DEVNET_TRACE_ENDPOINT,
      },
      keys: {
        // Use everdev to generate your phrase
        // !!! Never commit it in your repos !!!
        phrase: process.env.SIGNER_SEED_PHRASE,
        amount: 2,
      },
    },
  },
  mocha: {
    timeout: 2000000,
  },
};

export default config;
