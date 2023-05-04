const { expect } = require("chai");
const { ethers } = require("hardhat");

const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("CoinFlip contract", function () {
    // We define a fixture to reuse the same setup in every test. We use
    // loadFixture to run this setup once, snapshot that state, and reset Hardhat
    // Network to that snapshot in every test.
    async function deployCoinFlipFixture() {
      // Get the ContractFactory and Signers here.
      const CoinFlip = await ethers.getContractFactory("CoinFlip");
      const [owner, addr1, addr2, addr3] = await ethers.getSigners();
  
      const hardCoinFlip = await CoinFlip.deploy();
  
      await hardCoinFlip.deployed();
  
      const amount = "1";
  
      // Fixtures can return anything you consider useful for your tests
      return { CoinFlip, hardCoinFlip, owner, addr1, addr2, addr3,amount };
    }
  
    // You can nest describe calls to create subsections.
    describe("Deployment", function () {
      // `it` is another Mocha function. This is the one you use to define each
      // of your tests. It receives the test name, and a callback function.
      //
      // If the callback function is async, Mocha will `await` it.
      it("Should set the right owner", async function () {
        // We use loadFixture to setup our environment, and then assert that
        // things went well
        const { hardCoinFlip, owner } = await loadFixture(deployCoinFlipFixture);
  
        expect(await hardCoinFlip.owner()).to.equal(owner.address);
        console.log(await hardCoinFlip.getOwner());
      });

      it("Should add funds via owner", async function(){
        const { hardCoinFlip, owner, addr1, amount} = await loadFixture(deployCoinFlipFixture);

        await hardCoinFlip.connect(owner).addFunds({value: ethers.utils.parseEther(amount)});

        expect(await hardCoinFlip.getBalance()).to.equal(ethers.utils.parseEther(amount));

      });
    }); 

    describe("Withdraw",async function(){
        it("Should get all the funds via owner",async function(){
            const { hardCoinFlip, owner, addr1,amount} = await loadFixture(deployCoinFlipFixture);

            await hardCoinFlip.connect(owner).addFunds({value: ethers.utils.parseEther(amount)});

            expect(await hardCoinFlip.getBalance()).to.equal(ethers.utils.parseEther(amount));


            await hardCoinFlip.connect(owner).withDrawEther();

            expect(await hardCoinFlip.getBalance()).to.equal(ethers.utils.parseEther("0.0"));

        });
    });

    describe("Bet",function(){
            
            it("Should bet on a side", async function () {
                const { hardCoinFlip, owner, addr1,amount } = await loadFixture(deployCoinFlipFixture);
                //const ownerBalance = await hardhatBet.balanceOf(owner.address);

                await hardCoinFlip.connect(owner).addFunds({value: ethers.utils.parseEther("3000.0")});

                console.log(await hardCoinFlip.getBalance())

                await hardCoinFlip.connect(owner).bet(0,{value: ethers.utils.parseEther(amount)})

                console.log(await hardCoinFlip.getBalance())
        
            });
        });
});
    // describe("Bet",function(){
  
    //   it("Should bet on match with id = 001", async function () {
    //     const { hardhatBet, owner } = await loadFixture(deployBetFixture);
    //     //const ownerBalance = await hardhatBet.balanceOf(owner.address);
  
    //     await expect(hardhatBet.bet(001,2,2,"1"))
  
    //   });
    // });
  
    // describe("Transactions", function () {
    //   it("Should transfer Bets between accounts", async function () {
    //     const { hardhatBet, owner, addr1, addr2 } = await loadFixture(
    //       deployBetFixture
    //     );
    //     // Transfer 50 Bets from owner to addr1
    //     await expect(
    //       hardhatBet.transfer(addr1.address, 50)
    //     ).to.changeBetBalances(hardhatBet, [owner, addr1], [-50, 50]);
  
    //     // Transfer 50 Bets from addr1 to addr2
    //     // We use .connect(signer) to send a transaction from another account
    //     await expect(
    //       hardhatBet.connect(addr1).transfer(addr2.address, 50)
    //     ).to.changeBetBalances(hardhatBet, [addr1, addr2], [-50, 50]);
    //   });
  
      // it("Should emit Transfer events", async function () {
      //   const { hardhatBet, owner, addr1, addr2 } = await loadFixture(
      //     deployBetFixture
      //   );
  
      //   // Transfer 50 Bets from owner to addr1
      //   await expect(hardhatBet.transfer(addr1.address, 50))
      //     .to.emit(hardhatBet, "Transfer")
      //     .withArgs(owner.address, addr1.address, 50);
  
      //   // Transfer 50 Bets from addr1 to addr2
      //   // We use .connect(signer) to send a transaction from another account
      //   await expect(hardhatBet.connect(addr1).transfer(addr2.address, 50))
      //     .to.emit(hardhatBet, "Transfer")
      //     .withArgs(addr1.address, addr2.address, 50);
      // });
  
      // it("Should fail if sender doesn't have enough Bets", async function () {
      //   const { hardhatBet, owner, addr1 } = await loadFixture(
      //     deployBetFixture
      //   );
      //   const initialOwnerBalance = await hardhatBet.balanceOf(owner.address);
  
      //   // Try to send 1 Bet from addr1 (0 Bets) to owner.
      //   // `require` will evaluate false and revert the transaction.
      //   await expect(
      //     hardhatBet.connect(addr1).transfer(owner.address, 1)
      //   ).to.be.revertedWith("Not enough Bets");
  
      //   // Owner balance shouldn't have changed.
      //   expect(await hardhatBet.balanceOf(owner.address)).to.equal(
      //     initialOwnerBalance
      //   );
      // });
