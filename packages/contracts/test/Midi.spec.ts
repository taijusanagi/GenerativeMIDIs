import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Midi", function () {
  async function fixture() {
    const [owner] = await ethers.getSigners();
    const Midi = await ethers.getContractFactory("Midi");
    const midi = await Midi.deploy();
    return {
      owner,
      midi,
    };
  }

  it("deployment", async function () {
    const { owner, midi } = await loadFixture(fixture);
    expect(midi.address).not.empty;
  });
});
