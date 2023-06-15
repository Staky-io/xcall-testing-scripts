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

    registerAllEvents(
        from: 'eth' | 'bsc' = 'bsc',
        to: 'eth' | 'bsc' = 'eth'
    ) {
        // Business logic event on Messenger contract
        this.registerEvent(this.messenger[from], 'TextMessageSent', (sender, messageId) => {
            console.log(`TextMessageSent event received from Messenger on ${from.toUpperCase()} !`)
            console.log('Sender:', sender)
            console.log('Text message ID:', messageId)
        })

        // Lifecycle events on CallService contract
        this.registerEvent(this.callService[from], 'CallMessageSent', (fromOrigin, toOrigin, snOrigin) => {
            console.log(`CallMessageSent event received from CallService on ${from.toUpperCase()} !`)

            if (fromOrigin === this.messenger[from].address) {
                console.log('X-Call tx SN:', snOrigin)

                this.registerEvent(this.callService[to], 'CallMessage', async (fromDest, toDest, snDest, reqid) => {
                    // Check the content of the data on the destination chain (Messenger contract)
                    this.registerEvent(this.messenger[to], 'TextMessageReceived', async (from, messageId) => {
                        const destMessage = await this.messenger[to].receivedMessages(messageId)

                        console.log(`TextMessageReceived event received from Messenger on ${to.toUpperCase()} !`)
                        console.log('From:', from)
                        console.log('Text message ID:', messageId)
                        console.log('Received message:', destMessage)
                    })
    
                    console.log(`CallMessage event received from CallService on ${to.toUpperCase()} !`)
    
                    if (snDest.eq(snOrigin)) {
                        console.log('X-Call tx sn match with the origin !')
                        console.log('Request ID:', reqid)
    
                        await this.executeCall('eth', reqid)
                    }
                })
            }
        })
    }

    async executeCall(network: 'eth' | 'bsc', reqId: ethers.BigNumber) {
        try {
            const execute = await this.callService[network].executeCall(reqId)
            await execute.wait()
    
            console.log('executeCall success !')
        } catch (err) {
            console.error('executeCall error:', err)
        }
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
            console.log('Total cost:', utils.formatEther(gasPrice.mul(gasLimit).add(sendMessageFee)))

            const sendMessageTx = await this.messenger.bsc.sendMessage(
                messengerBTPAddress,
                'Hello world !!', // replace with your message (only string)
                { value: sendMessageFee, gasLimit, gasPrice }
            )

            await sendMessageTx.wait()

            console.log('Tx sent !')
        } catch (e) {
            console.error(e)
        }
    }
}