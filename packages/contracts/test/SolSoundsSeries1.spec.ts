import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import MidiWriter from "midi-writer-js";

describe("GenerativeMIDIsSeries1", function () {
  async function fixture() {
    const [owner, other] = await ethers.getSigners();
    const GenerativeMIDIs = await ethers.getContractFactory("GenerativeMIDIsSeries1");
    const image = "image";
    const player = "player";
    const note = "note";
    const generativeMIDIs = await GenerativeMIDIs.deploy(image, player, note);
    return {
      owner,
      other,
      generativeMIDIs,
      image,
      player,
      note,
    };
  }

  describe("deployment", function () {
    it("should work", async function () {
      const { generativeMIDIs, image, player, note } = await loadFixture(fixture);
      expect(generativeMIDIs.image).not.equal(image);
      expect(generativeMIDIs.player).not.equal(player);
      expect(generativeMIDIs.note).not.equal(note);
    });
  });

  describe("mint", function () {
    it("should work", async function () {
      const { other, generativeMIDIs } = await loadFixture(fixture);
      const tokenId = 1;
      await generativeMIDIs.connect(other).mint(other.address, tokenId);
      expect(await generativeMIDIs.ownerOf(tokenId)).to.eq(other.address);
    });

    it("should not work when alredy minted", async function () {
      const { other, generativeMIDIs } = await loadFixture(fixture);
      await expect(generativeMIDIs.connect(other).mint(other.address, 0)).revertedWith("ERC721: token already minted");
      await expect(generativeMIDIs.connect(other).mint(other.address, 69)).revertedWith("ERC721: token already minted");
      await expect(generativeMIDIs.connect(other).mint(other.address, 127)).revertedWith(
        "ERC721: token already minted"
      );
    });

    it("should not work when token id is more than 128", async function () {
      const { other, generativeMIDIs } = await loadFixture(fixture);
      await expect(generativeMIDIs.connect(other).mint(other.address, 128)).revertedWith(
        "GenerativeMIDIs: invalid tokenId"
      );
    });
  });

  describe("getMidi", function () {
    it("should work", async function () {
      const { generativeMIDIs } = await loadFixture(fixture);
      const track = new MidiWriter.Track();
      const note = new MidiWriter.NoteEvent({
        pitch: ["A4"],
        duration: "1",
        velocity: 64,
      });
      track.addEvent(note);
      const write = new MidiWriter.Writer(track);
      const dataUri = write.dataUri();
      const result = await generativeMIDIs.getMidi(69);
      expect(result).to.eq(dataUri);
    });
  });

  describe("getMetadata", function () {
    it("should work", async function () {
      const { owner, generativeMIDIs } = await loadFixture(fixture);
      const track = new MidiWriter.Track();
      const note = new MidiWriter.NoteEvent({
        pitch: ["C#-1"],
        duration: "1",
        velocity: 64,
      });
      track.addEvent(note);
      const write = new MidiWriter.Writer(track);
      const dataUri = write.dataUri();
      const tokenId = 32;
      generativeMIDIs.mint(owner.address, tokenId);
      const result = JSON.parse(await generativeMIDIs.getMetadata(tokenId));
      expect(result.name).to.eq(`Generative MIDIs Series 1 #${tokenId}`);
      console.log(result);
    });
  });

  // describe("tokenURI", function () {
  //   it("should work", async function () {
  //     const { generativeMIDIs, mintedTokenId } = await loadFixture(fixture);
  //     expect(await generativeMIDIs.tokenURI(mintedTokenId)).to.equal(
  //       "data:audio/midi;base64,TVRoZAAAAAYAAAABAIBNVHJrAAAABAD/LwA="
  //     );
  //   });
  // });
});
