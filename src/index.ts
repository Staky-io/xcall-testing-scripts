import 'dotenv/config'
import { ethers } from 'ethers'
import { logger, constants } from '~/helpers'

class Main {
    ethProvider: ethers.providers.WebSocketProvider
    bscProvider: ethers.providers.WebSocketProvider
    ethWallet: ethers.Wallet
    bscWallet: ethers.Wallet

    constructor() {
        const { PRIVATE_KEY } = process.env

        if (!PRIVATE_KEY) {
            logger.error('[ERROR:Main] No private key provided')
            process.exit(1)
        }

        this.ethProvider = new ethers.providers.WebSocketProvider(constants.NETWORKS.ETH.rpcUrls[0])
        this.bscProvider = new ethers.providers.WebSocketProvider(constants.NETWORKS.BSC.rpcUrls[0])
        this.ethWallet = new ethers.Wallet(PRIVATE_KEY, this.ethProvider)
        this.bscWallet = new ethers.Wallet(PRIVATE_KEY, this.bscProvider)

        this.init()
    }

    async init() {
        const exitFunc = (errCode = 0, exitMsg = 'exit') => {
            logger.info(`[Main/init] Exiting with code ${errCode} (${exitMsg})`)
            process.exit(errCode)
        }

        process.on('exit', () => exitFunc(0, 'exit'))
        process.on('SIGINT', () => exitFunc(0, 'SIGINT'))
        process.on('SIGUSR1', () => exitFunc(0, 'SIGUSR1'))
        process.on('SIGUSR2', () => exitFunc(0, 'SIGUSR2'))
        process.on('uncaughtException', () => exitFunc(1, 'uncaughtException'))

        try {
            logger.info('[Main/init] Initializing...')
        } catch (err) {
            logger.error('[ERROR:Main/init]', err)
        }
    }
}

new Main()