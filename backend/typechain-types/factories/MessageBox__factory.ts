/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../common";
import type { MessageBox, MessageBoxInterface } from "../MessageBox";

const _abi = [
  {
    inputs: [],
    name: "author",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "message",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "in_message",
        type: "string",
      },
    ],
    name: "setMessage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60808060405234610016576103fb908161001c8239f35b600080fdfe604060808152600436101561001357600080fd5b600090813560e01c8063368b8772146101ea578063a6c3e6b9146101c25763e21f37ce1461004057600080fd5b346101be57816003193601126101be57600180546001600160a01b0316330361018c578151809184908554906100758261038b565b8085529181811690811561016e5750600114610110575b5050601f801993849203011681019381851067ffffffffffffffff8611176100fc5791849192828552602090818452845191828186015281955b8387106100e45750508394508582601f949501015201168101030190f35b868101820151898801890152958101958895506100c6565b634e487b7160e01b81526041600452602490fd5b8680529092915085907f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e5635b8483106101535750508160209293500101388061008c565b8193509081602092548385890101520191019091849261013b565b9150506020925060ff191682840152151560051b820101388061008c565b815162461bcd60e51b815260206004820152600b60248201526a1b9bdd08185b1b1bddd95960aa1b6044820152606490fd5b5080fd5b50346101be57816003193601126101be5760015490516001600160a01b039091168152602090f35b50903461038857602091826003193601126101be5767ffffffffffffffff6004358181116103845736602382011215610384578060040135918211610384576024903682848301011161038057610241855461038b565b601f8111610322575b508495601f841160011461029d575094849583949593610290575b5050508160011b916000199060031b1c19161782555b600180546001600160a01b0319163317905551f35b0101359050388080610265565b601f198416967f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563939187905b898210610308575050846001969798106102ec575b50505050811b01825561027b565b60001960f88660031b161c1992010135169055388080806102de565b8060018497868395968901013581550196019201906102c9565b7f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563601f850160051c810191888610610376575b601f0160051c01905b81811061036b575061024a565b86815560010161035e565b9091508190610355565b8480fd5b8380fd5b80fd5b90600182811c921680156103bb575b60208310146103a557565b634e487b7160e01b600052602260045260246000fd5b91607f169161039a56fea26469706673582212201754fbd13535d1498f3a5f221f6a06020ad2518e45c1c7a49962001da65fbb8364736f6c63430008100033";

type MessageBoxConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MessageBoxConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MessageBox__factory extends ContractFactory {
  constructor(...args: MessageBoxConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      MessageBox & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): MessageBox__factory {
    return super.connect(runner) as MessageBox__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MessageBoxInterface {
    return new Interface(_abi) as MessageBoxInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): MessageBox {
    return new Contract(address, _abi, runner) as unknown as MessageBox;
  }
}
