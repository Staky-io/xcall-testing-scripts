import { ethers, utils } from 'ethers'
import { ADDRESSES } from '~/helpers/constants'
import CallServiceABI from '~/abis/CallService.json'
import { CallService } from '~/types/abi'

export default class CallServiceContract {
    eth: ethers.Contract & CallService
    bsc: ethers.Contract & CallService

    constructor(ethWallet: ethers.Wallet, bscWallet: ethers.Wallet) {
        const ICallService = new utils.Interface(CallServiceABI)
        this.eth = new ethers.Contract(ADDRESSES.ETH.XCALL, ICallService, ethWallet) as CallService
        this.bsc = new ethers.Contract(ADDRESSES.BSC.XCALL, ICallService, bscWallet) as CallService
    }
}