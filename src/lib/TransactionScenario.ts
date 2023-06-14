import { ethers, utils } from 'ethers'
import CallServiceContract from './CallServiceContract'
import MessengerContract from './MessengerContract'
import { getBTPAddress } from '~/helpers/btpAddress'
import { ADDRESSES, NETWORKS } from '~/helpers/constants'
import { CallService, Messenger } from '~/types/abi'

export default class TransactionScenario {
    ethWallet: ethers.Wallet
    bscWallet: ethers.Wallet
    messenger: MessengerContract
    callService: CallServiceContract

    constructor(ethWallet: ethers.Wallet, bscWallet: ethers.Wallet) {
        this.ethWallet = ethWallet
        this.bscWallet = bscWallet

        this.messenger = new MessengerContract(ethWallet, bscWallet)
        this.callService = new CallServiceContract(ethWallet, bscWallet)
    }

    async getFee(network: 'eth' | 'bsc', to: string, useCallback = false) {
        return await this.messenger[network].getXCallFee(to, useCallback)
    }

    async registerEvent(
        contract: ethers.Contract & Messenger | ethers.Contract & CallService,
        eventName: string | ethers.EventFilter,
        callback: (...args: any[]) => void
    ) {
        contract.on(eventName, callback)
    }

    registerAllEvents() {

        this.registerEvent(this.messenger.bsc, 'TextMessageSent', (sender, messageId) => {
            console.log('TextMessageSent event received on Messenger BSC !')
            console.log('SENDER:', sender)
            console.log('MESSAGE ID:', messageId)
        })

        this.registerEvent(this.callService.bsc, 'CallMessageSent', (fromBsc, toBsc, snBsc) => {
            console.log('CallMessageSent event received on CallService BSC !')
            if (fromBsc === this.messenger.bsc.address) {
                console.log('SN match !', snBsc)
            }

            this.registerEvent(this.callService.eth, 'CallMessage', async (fromEth, toEth, snEth, reqid) => {
                this.registerEvent(this.messenger.eth, 'TextMessageReceived', async (from, messageId) => {
                    console.log('TextMessageReceived event received on Messenger ETH !')
                    console.log('FROM:', from)
                    console.log('MESSAGE ID:', messageId)

                    const destMessage = await this.messenger.eth.receivedMessages(messageId)

                    console.log('DEST MESSAGE:', destMessage)
                })

                console.log('CallMessage event received on CallService ETH !')

                if (snEth.eq(snBsc)) {
                    console.log('NSN match !')
                    console.log('REQID:', reqid)

                    await this.executeCall('eth', reqid)
                }
            })
        })
    }

    async executeCall(network: 'eth' | 'bsc', reqId: ethers.BigNumber) {
        const execute = await this.callService[network].executeCall(reqId)
        await execute.wait()

        console.log('Call executed !')
    }

    async run() {
        try {
            this.registerAllEvents()

            const ethBalance = await this.ethWallet.getBalance()
            const bscBalance = await this.bscWallet.getBalance()

            console.log('ETH balance:', utils.formatEther(ethBalance))
            console.log('BSC balance:', utils.formatEther(bscBalance))

            const messengerBTPAddress = getBTPAddress(ADDRESSES.ETH.MESSENGER, NETWORKS.ETH.btpID)
            const sendMessageFee = await this.getFee('bsc', messengerBTPAddress, true)

            console.log('Send message fee (BSC):', utils.formatEther(sendMessageFee))

            const gasPrice = await this.bscWallet.provider.getGasPrice()
            const gasLimit = await this.messenger.bsc.estimateGas.sendMessage(
                messengerBTPAddress,
                'Hello world !!',
                { value: sendMessageFee, gasPrice }
            )

            console.log('Gas price:', utils.formatEther(gasPrice))
            console.log('Gas limit:', gasLimit.toString())
            console.log('Total cost:', utils.formatEther(gasPrice.mul(gasLimit)))

            const sendMessageTx = await this.messenger.bsc.sendMessage(
                messengerBTPAddress,
                'Hello world !!',
                { value: sendMessageFee, gasLimit, gasPrice }
            )

            await sendMessageTx.wait()

            console.log('Tx sent !')
        } catch (e) {
            console.error(e)
        }
    }
}