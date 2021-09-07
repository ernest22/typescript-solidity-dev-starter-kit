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

        it("Adopting cat whilst the sale is paused fails", async () => {
            await paperCats.pause(true);

            expect(paperCats.connect(owner).adopt(1, { value: "500000000000000" })).to.be.revertedWith("Sale paused");
        })
    })

    describe("Test minting",  () => {
        it("Sending the incorrect Ether fails", async () => {
            expect(paperCats.connect(owner).adopt(1, { value: "200000000000000" })).to.be.revertedWith("Ether sent is not correct");
        })

        it("Adopting one cat succeeds.", async () => {
            await paperCats.connect(owner).adopt(1, { value: "500000000000000" })
            let ownerBalance = await paperCats.balanceOf(owner.address);

            await expect(ownerBalance).to.equal(1);
        });
        
        it("Adopting Two cats succeeds.", async () => {
            await paperCats.connect(owner).adopt(2, { value: "1000000000000000" })
            let ownerBalance = await paperCats.balanceOf(owner.address);

            await expect(ownerBalance).to.equal(2);
        });

        it("Adopting Three cats succeeds.", async () => {
            await paperCats.connect(owner).adopt(3, { value: "1500000000000000" })
            let ownerBalance = await paperCats.balanceOf(owner.address);

            await expect(ownerBalance).to.equal(3);
        });

        it("Adopting Four cats fails.", async () => {
            expect(paperCats.connect(owner).adopt(4, { value: "2000000000000000" })).to.be.revertedWith("You can adopt a maximum of 3 Paper Cats");
        });

        it("Multiple accounts can mint separately", async () => {
            await paperCats.connect(addr1).adopt(1, { value: "500000000000000" });
            let addr1Balance = await paperCats.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(1);

            await paperCats.connect(addr2).adopt(1, { value: "500000000000000" });
            let addr2Balance = await paperCats.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(1);
        })

        it("Balance updates after minting", async () => {
            let ownerBalance = await paperCats.balanceOf(owner.address);
            await expect(ownerBalance).to.equal(0);

            await paperCats.connect(owner).adopt(1, { value: "500000000000000" })
            ownerBalance = await paperCats.balanceOf(owner.address);

            await expect(ownerBalance).to.equal(1);
        });
    });
})