// Hardhat tests are normally written with Mocha and Chai.
// We import Chai to use its asserting functions here.
const { expect } = require("chai");
const { ethers } = require("hardhat");

// We use `loadFixture` to share common setups (or fixtures) between tests.
// Using this simplifies your tests and makes them run faster, by taking
// advantage of Hardhat Network's snapshot functionality.
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

// `describe` is a Mocha function that allows you to organize your tests.
// Having your tests organized makes debugging them easier. All Mocha
// functions are available in the global scope.
//
// `describe` receives the name of a section of your test suite, and a
// callback. The callback must define the tests of that section. This callback
// can't be an async function.
describe("Lottery contract", function () {
  // We define a fixture to reuse the same setup in every test. We use
  // loadFixture to run this setup once, snapshot that state, and reset Hardhat
  // Network to that snapshot in every test.
  async function deployLotteryFixture() {
    // Get the ContractFactory and Signers here.
    const Lottery = await ethers.getContractFactory("Lottery");
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();

    // To deploy our contract, we just have to call Bet.deploy() and await
    // its deployed() method, which happens once its transaction has been
    // mined.
    const hardLottery = await Lottery.deploy();

    await hardLottery.deployed();

    const amount = "0.0001";

    // Fixtures can return anything you consider useful for your tests
    return { Lottery, hardLottery, owner, addr1, addr2, addr3,amount };
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
      const { hardLottery, owner } = await loadFixture(deployLotteryFixture);

      // `expect` receives a value and wraps it in an assertion object. These
      // objects have a lot of utility methods to assert values.

      // This test expects the owner variable stored in the contract to be
      // equal to our Signer's owner.
      expect(await hardLottery.owner()).to.equal(owner.address);
      console.log(await hardLottery.getOwner());
    });
  //});
  describe("Enter into lottery",function(){

    it("Should enter", async function () {
      const { hardLottery, owner, addr1, addr2, addr3, amount } = await loadFixture(deployLotteryFixture);
    //   //const ownerBalance = await hardhatBet.balanceOf(owner.address);

    //   const ownerbalance = await hardLottery.getBalanceOf(owner.address);

    // Envoyer 1 ether à la fonction enter() en tant que joueur 1
    await hardLottery.connect(addr1).enter({ value: ethers.utils.parseEther(amount) });

    // Vérifier que le joueur 1 a été ajouté au tableau players
    var players = await hardLottery.getPlayers();
    expect(players).to.have.lengthOf(1);
    expect(players[0]).to.equal(addr1.address);

    await hardLottery.connect(addr2).enter({ value: ethers.utils.parseEther(amount) });
    await hardLottery.connect(addr3).enter({ value: ethers.utils.parseEther(amount) });

    });

    it("Should check if player already played", async function (){
      const { hardLottery, addr1, addr2, addr3,amount } = await loadFixture(deployLotteryFixture);

      var played = await hardLottery.checkIfPlayerPlayed(addr1.address);
      expect(played).to.be.false;

      await hardLottery.connect(addr1).enter({ value: ethers.utils.parseEther(amount) });

      var players = await hardLottery.getPlayers();
      expect(players).to.have.lengthOf(1); // Il doit y avoir 3 joueur avant le tirage 

      played = await hardLottery.checkIfPlayerPlayed(addr1.address);
      expect(played).to.be.true;

    });
  });

  describe("Pick a Winner", function(){

    it("Should pick a winner from the list", async function(){
        const { hardLottery, owner, addr1, addr2, addr3, amount} = await loadFixture(deployLotteryFixture);
    
        await hardLottery.connect(addr1).enter({ value: ethers.utils.parseEther(amount) });
        await hardLottery.connect(addr2).enter({ value: ethers.utils.parseEther(amount) });
        await hardLottery.connect(addr3).enter({ value: ethers.utils.parseEther(amount) });

        var players = await hardLottery.getPlayers();
        //console.log(players)
        expect(players).to.have.lengthOf(3); // Il doit y avoir 3 joueur avant le tirage 

        await hardLottery.connect(owner).pickWinner();
    
        const balance = await ethers.provider.getBalance(hardLottery.address);
        expect(balance).to.equal(0);
    })

    it("Should check if the array is empty", async function(){
        const { hardLottery, owner, addr1, addr2, addr3, amount} = await loadFixture(deployLotteryFixture);
    
        await hardLottery.connect(addr1).enter({ value: ethers.utils.parseEther(amount) });
        await hardLottery.connect(addr2).enter({ value: ethers.utils.parseEther(amount) });
        await hardLottery.connect(addr3).enter({ value: ethers.utils.parseEther(amount) });

        var players = await hardLottery.getPlayers();
        //console.log(players)
        expect(players).to.have.lengthOf(3); // Il doit y avoir 3 joueur avant le tirage 

        expect(await hardLottery.connect(owner).pickWinner());
    
        players = await hardLottery.getPlayers();
        //console.log(players)

        expect(players).to.have.lengthOf(0); // Il doit rester 0 joueur aprés le tirage 
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
  });
});