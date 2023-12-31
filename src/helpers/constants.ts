import { AddressesList, NetworkList } from '~/types'

// values in milliseconds
export const TIME_SCALES = {
    ONE_SECOND: 1000,
    ONE_MINUTE: 60 * 1000,
    ONE_HOUR: 60 * 60 * 1000,
    ONE_DAY: 24 * 60 * 60 * 1000,
    ONE_WEEK: 7 * 24 * 60 * 60 * 1000,
    ONE_MONTH: 30 * 24 * 60 * 60 * 1000,
    ONE_YEAR: 365 * 24 * 60 * 60 * 1000
}

export const NETWORKS: NetworkList = {
    ETH: {
        chainId: 11155111,
        chainName: 'Sepolia test network',
        btpID: '0xaa36a7.eth2',
        rpcUrls: ['https://rpc2.sepolia.org'],
        nativeCurrency: {
            name: 'Sepolia ETH',
            symbol: 'ETH',
            decimals: 18
        },
        blockExplorerUrls: ['https://sepolia.etherscan.io/']
    },
    BSC: {
        chainId: 97,
        chainName: 'BSC Testnet',
        btpID: '0x61.bsc',
        rpcUrls: ['https://bsc-testnet.publicnode.com'],
        nativeCurrency: {
            name: 'Testnet BNB',
            symbol: 'tBNB',
            decimals: 18
        },
        blockExplorerUrls: ['https://testnet.bscscan.com']
    }
}

export const ADDRESSES: AddressesList = {
    BSC: {
        BMCM: '0xFd82803c9b2E92C628846012c6E5016Ac380f68d',
        BMCS: '0x6AB5fB039ABbEE20bf43F84393E528015686fB04',
        BMC: '0x193eD92257E0773ccBA097e0ba4110E588eb0F1c',
        BMV: '0xFCDD2AB0D0D98c3f74db20a0913c7e3B264dF8a1',
        XCALL: '0x6193c0b12116c4963594761d859571b9950a8686',
        MESSENGER: '0x09004F6aE035B849eADb8c8BF6ca90bA10a5018C'
    },
    ETH: {
        BMCM: '0x39FBbE3AeCbe6ED08baf16e13eFE4aA31550CaA2',
        BMCS: '0xd6298BBB8b8B8EA273C3CB470B273A1cef552Ef3',
        BMC: '0x50DD9479c45085dC64c6F0a0796040C7768f25CE',
        BMV: '0x684ba8F34f9481f7F02aCd4F143506E11AC19E3E',
        XCALL: '0x9B68bd3a04Ff138CaFfFe6D96Bc330c699F34901',
        MESSENGER: '0x65479a42e67CFF2b12bA47e57aa2E91bd88AF320'
    }
}