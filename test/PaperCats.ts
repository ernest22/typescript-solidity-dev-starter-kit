import {ethers} from "hardhat";
import chai from "chai";
import {solidity} from "ethereum-waffle";
import {it} from "mocha";
import {PaperCats} from "../typechain/PaperCats";

chai.use(solidity);
const {expect} = require("chai");

const uri = "https://test.com"

describe("Load Paper Cats Contract", () => {
    let paperCats: PaperCats;

    let owner: any;
    let addr1: any;
    let addr2: any;

    beforeEach(async () => {
        // Get Eth signers
        [owner, addr1, addr2] = await ethers.getSigners();

        // Prepare contract for deployment
        const catFactory = await ethers.getContractFactory("PaperCats", owner);

        // Deploy Paper Cats
        paperCats = (await catFactory.deploy(uri)) as PaperCats;
        await paperCats.deployed();
        await paperCats.pause(false);
    });

    describe("Deployment tests", () => {
        it("Owner is set correctly", async () => {
            expect(await paperCats.owner()).to.equal(owner.address);
        });
    })
})