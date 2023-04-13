import * as cryptoJs from "crypto-js"

class Block {
    public id: number;
    public hash: string;
    public previousHash: string;
    public data: string;
    public timestamp: number;
    static calculateBlockHash = (id: number, previousHash: string, data: string, timestamp: number): string => {
        return cryptoJs.SHA256(id + previousHash + data + timestamp).toString()
    }
    static validate = (aBlock: Block): boolean =>
        typeof aBlock.id === "number" &&
        typeof aBlock.hash === "string" &&
        typeof aBlock.previousHash === "string" &&
        typeof aBlock.data === "string" &&
        typeof aBlock.timestamp === "number";
    constructor(id: number, hash: string,
                previousHash: string,
                data: string,
                timestamp: number
    ) {
        this.id = id;
        this.hash = hash;
        this.previousHash = previousHash;
        this.data = data;
        this.timestamp = timestamp;
    }
}

const genesisBlock: Block = new Block(0, 'H051354651', '', "hello", 123456)

let blockchain: [Block] = [genesisBlock]

const getBlockChain = (): Block[] => blockchain;

const getLastBlock = (): Block => blockchain[blockchain.length - 1]

const getTimestamp = (): number => Math.round(new Date().getTime() / 1000);

const createNewBlock = (data: string): Block => {
    const lastBlock: Block = getLastBlock();
    const newId: number = lastBlock.id + 1;
    const newTimeStamp: number = getTimestamp();
    const calculateBlockHash: string = Block.calculateBlockHash(newId, lastBlock.hash, data, newTimeStamp);
    const newBlock: Block = new Block(newId, calculateBlockHash, lastBlock.hash, data, newTimeStamp)
    addBlock(newBlock)
    return newBlock;
}

const getHashForBlock = (aBlock): string => Block.calculateBlockHash(aBlock.id, aBlock.previousHash, aBlock.data, aBlock.timestamp)
const isBlockValid = (candidateBlock: Block, lastBlock: Block): boolean => {
    if (!Block.validate(candidateBlock)) {
        return false;
    } else if (lastBlock.id + 1 !== candidateBlock.id) {
        return false;
    } else if (lastBlock.hash !== candidateBlock.previousHash) {
        return false;
    } else if (candidateBlock.hash !== getHashForBlock(candidateBlock)) {
        return false;
    }
    return true;
}

const addBlock = (candidateBlock: Block): void => {
    if (isBlockValid(candidateBlock, getLastBlock())) {
        blockchain.push(candidateBlock);
    }
}

createNewBlock('first block')
createNewBlock('second block')
createNewBlock('third block')

console.log(blockchain)


