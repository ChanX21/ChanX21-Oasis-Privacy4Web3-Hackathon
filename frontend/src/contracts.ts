import type { ComputedRef } from 'vue';
import { computed } from 'vue';

// import { type MessageBox, MessageBox__factory } from '@oasisprotocol/demo-starter-backend';
// export type { MessageBox } from '@oasisprotocol/demo-starter-backend';

import { type PrivaHealth, PrivaHealth__factory } from '../../backend/typechain-types';
export type { PrivaHealth } from '../../backend/typechain-types';


import { useEthereumStore } from './stores/ethereum';
import { type ContractRunner, VoidSigner } from 'ethers';


const messageBoxAddr = import.meta.env.VITE_MESSAGE_BOX_ADDR!;
// const privaHealthAddr = import.meta.env.VITE_PRIVA_HEALTH_ADDR!;
const privaHealthAddr = "0x5E4366E5B83d7ce2f35daC2f2a69a34F28d3a305";


// export function useMessageBox(): ComputedRef<MessageBox | null> {
//   const eth = useEthereumStore();

//   return computed(() => {
//     if (!eth) {
//       console.error('[useMessageBox] Ethereum Store not initialized');
//       return null;
//     }

//     if (!eth.signer) {
//       console.error('[useMessageBox] Signer is not initialized');
//       return null;
//     }

//     return MessageBox__factory.connect(messageBoxAddr, eth.signer as ContractRunner);
//   });
// }

function initializeSigner(eth: ReturnType<typeof useEthereumStore>) {
  let signer = eth.unwrappedSigner;
  if (!signer && eth.unwrappedProvider) {
    signer = new VoidSigner(eth.address!, eth.unwrappedProvider);
  }
  return signer;
}

// export function useUnwrappedMessageBox(): ComputedRef<MessageBox | null> {
//   const eth = useEthereumStore();
//   return computed(() => {
//     if (!eth) {
//       console.error('[useMessageBox] Ethereum Store not initialized');
//       return null;
//     }

//     const signer = initializeSigner(eth);
//     if (!signer) {
//       console.error('[useMessageBox] Signer not initialized');
//       return null;
//     }

//     return MessageBox__factory.connect(messageBoxAddr, signer);
//   });
// }

export function usePrivaHealth(): ComputedRef<PrivaHealth | null> {
  const eth = useEthereumStore();

  return computed(() => {
    if (!eth) {
      console.error('[usePrivaHealth] Ethereum Store not initialized');
      return null;
    }

    if (!eth.signer) {
      console.error('[usePrivaHealth] Signer is not initialized');
      return null;
    }

    return PrivaHealth__factory.connect(privaHealthAddr, eth.signer as ContractRunner);
  });
}

export function useUnwrappedPrivaHealth(): ComputedRef<PrivaHealth | null> {
  const eth = useEthereumStore();
  return computed(() => {
    if (!eth) {
      console.error('[usePrivaHealth] Ethereum Store not initialized');
      return null;
    }

    const signer = initializeSigner(eth);
    if (!signer) {
      console.error('[usePrivaHealth] Signer not initialized');
      return null;
    }

    return PrivaHealth__factory.connect(privaHealthAddr, signer);
  });
}
