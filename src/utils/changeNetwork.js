import { chainIds } from "chainIds";
import config from "appConfig";

const environment = config.ENVIRONMENT;

const rpcMeta = {
  mainnet: {
    Ethereum: undefined,
    Chikochain: {
      chainId: '0x42',
      chainName: 'Chikochain Network',
      nativeCurrency:
      {
        name: 'Chiko',
        symbol: 'CHK',
        decimals: 18
      },
      rpcUrls: ['http://70.34.216.42:9933'],
      blockExplorerUrls: ['https://kovan-api.ethplorer.io/'],
    },
    Polygon: {
      chainId: '0x89',
      chainName: 'Polygon Network',
      nativeCurrency:
      {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18
      },
      rpcUrls: ['https://rpc-mainnet.maticvigil.com'],
      blockExplorerUrls: ['https://polygonscan.com/'],
    }
  },
  testnet: {
    Ethereum: undefined, // kovan
    Chikochain: {
      chainId: '0x42',
      chainName: 'Chikochain Network',
      nativeCurrency:
      {
        name: 'Chiko',
        symbol: 'CHK',
        decimals: 18
      },
      rpcUrls: ['http://70.34.216.42:9933'],
      blockExplorerUrls: ['https://kovan-api.ethplorer.io/'],
    },
    Polygon: {
      chainId: '0x13881',
      chainName: 'Polygon TEST Network',
      nativeCurrency:
      {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18
      },
      rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
      blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
    }
  },
  devnet: {
    Ethereum: 1337, // ganache
    Chikochain: null,
  },
};

export const changeNetwork = async (network) => {
  const chainId = chainIds[environment][network];
  return await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: `0x${Number(chainId).toString(16)}` }],
  }).catch(async (switchError) => {
    if (switchError.code === 4902) {
      const params = rpcMeta[environment][network];

      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [params],
      });

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${Number(chainId).toString(16)}` }],
      }).catch((e) => {
        throw new Error("wallet_switchEthereumChain error", e);
      })

      return Promise.resolve()
    } else {
      throw new Error("wallet_switchEthereumChain error");
    }
  });
}
