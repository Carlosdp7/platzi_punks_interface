import Web3 from 'web3/dist/web3.min';
import { InjectedConnector } from '@web3-react/injected-connector'

const injected = new InjectedConnector({ supportedChainIds: [4] })

function getLibrary(provider, connector) {
  return new Web3(provider)
}

export { injected, getLibrary }