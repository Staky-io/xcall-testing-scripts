import { ethers, utils } from 'ethers'
import { ADDRESSES } from '~/helpers/constants'
import MessengerABI from '~/abis/Messenger.json'
import { Messenger } from '~/types/abi'

export default class MessengerContract {
    eth: ethers.Contract & Messenger
    bsc: ethers.Contract & Messenger

    constructor(ethWallet: ethers.Wallet, bscWallet: ethers.Wallet) {
        const IMessenger = new utils.Interface(MessengerABI)
        this.eth = new ethers.Contract(ADDRESSES.ETH.MESSENGER, IMessenger, ethWallet) as Messenger
        this.bsc = new ethers.Contract(ADDRESSES.BSC.MESSENGER, IMessenger, bscWallet) as Messenger
    }
}