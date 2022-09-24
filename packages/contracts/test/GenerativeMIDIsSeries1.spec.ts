import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import MidiWriter, { Pitch } from "midi-writer-js";

const basePitchSequence: Pitch[] = [
  "A0",
  "A#0",
  "B0",
  "C1",
  "C#1",
  "D1",
  "D#1",
  "E1",
  "F1",
  "F#1",
  "G1",
  "G#1",
  "A1",
  "A#1",
  "B1",
  "C2",
  "C#2",
  "D2",
  "D#2",
  "E2",
  "F2",
  "F#2",
  "G2",
  "G#2",
  "A2",
  "A#2",
  "B2",
  "C3",
  "C#3",
  "D3",
  "D#3",
  "E3",
  "F3",
  "F#3",
  "G3",
  "G#3",
  "A3",
  "A#3",
  "B3",
  "C4",
  "C#4",
  "D4",
  "D#4",
  "E4",
  "F4",
  "F#4",
  "G4",
  "G#4",
  "A4",
  "A#4",
  "B4",
  "C5",
  "C#5",
  "D5",
  "D#5",
  "E5",
  "F5",
  "F#5",
  "G5",
  "G#5",
  "A5",
  "A#5",
  "B5",
  "C6",
  "C#6",
  "D6",
  "D#6",
  "E6",
  "F6",
  "F#6",
  "G6",
  "G#6",
  "A6",
  "A#6",
  "B6",
  "C7",
  "C#7",
  "D7",
  "D#7",
  "E7",
  "F7",
  "F#7",
  "G7",
  "G#7",
  "A7",
  "A#7",
  "B7",
  "C8",
];

const description = "description";
const image = "image";
const player = "player";

describe("GenerativeMIDIsSeries1", function () {
  async function fixture() {
    const [owner, other] = await ethers.getSigners();
    const GenerativeMIDIs = await ethers.getContractFactory("GenerativeMIDIsSeries1");
    const generativeMIDIs = await GenerativeMIDIs.deploy();
    return {
      owner,
      other,
      generativeMIDIs,
    };
  }

  describe("deployment", function () {
    it("should work", async function () {
      const { generativeMIDIs } = await loadFixture(fixture);
      expect(generativeMIDIs.description).not.equal(description);
      expect(generativeMIDIs.image).not.equal(image);
      expect(generativeMIDIs.player).not.equal(player);
    });
  });

  describe("mint", function () {
    it("should work", async function () {
      const { other, generativeMIDIs } = await loadFixture(fixture);
      const tokenId = 0;
      await generativeMIDIs.connect(other).mint(other.address, tokenId);
      expect(await generativeMIDIs.ownerOf(tokenId)).to.eq(other.address);
    });

    it("should not work when alredy minted", async function () {
      const { other, generativeMIDIs } = await loadFixture(fixture);
      const tokenId = 0;
      await generativeMIDIs.mint(other.address, tokenId);
      await expect(generativeMIDIs.connect(other).mint(other.address, tokenId)).revertedWith(
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
      const { other, generativeMIDIs } = await loadFixture(fixture);
      for (let i = 0; i < 88; i++) {
        const track = new MidiWriter.Track();
        const note = new MidiWriter.NoteEvent({
          pitch: [basePitchSequence[i]],
          duration: "1",
          velocity: 64,
        });
        track.addEvent(note);
        const write = new MidiWriter.Writer(track);
        const dataUri = write.dataUri();
        const tokenId = i;
        await generativeMIDIs.connect(other).mint(other.address, tokenId);
        const result = await generativeMIDIs.getMidi(tokenId);
        expect(result).to.eq(dataUri);
      }
    });
  });

  describe("getMetadata", function () {
    it("should work", async function () {
      const { owner, generativeMIDIs } = await loadFixture(fixture);
      const tokenId = 0;
      const track = new MidiWriter.Track();
      const note = new MidiWriter.NoteEvent({
        pitch: ["A0"],
        duration: "1",
        velocity: 64,
      });
      track.addEvent(note);
      const write = new MidiWriter.Writer(track);
      const dataUri = write.dataUri();
      await generativeMIDIs.mint(owner.address, tokenId);
      const result = JSON.parse(await generativeMIDIs.getMetadata(tokenId));
      expect(result.name).to.eq(`Generative MIDIs Series 1 #${tokenId}`);
      expect(result.description).to.eq(description);
      expect(result.image).to.eq(image);
      expect(result.animation_url).to.eq(`${player}?tokenId=${tokenId}`);
      expect(result.midi).to.eq(dataUri);
      expect(result.attributes[0].trait_type).to.eq("INDEX");
      expect(result.attributes[0].value).to.eq("0");
    });
  });

  describe("tokenURI", function () {
    it("should work", async function () {
      const { owner, generativeMIDIs } = await loadFixture(fixture);
      const tokenId = 0;
      const track = new MidiWriter.Track();
      const note = new MidiWriter.NoteEvent({
        pitch: ["A0"],
        duration: "1",
        velocity: 64,
      });
      track.addEvent(note);
      const write = new MidiWriter.Writer(track);
      const dataUri = write.dataUri();
      await generativeMIDIs.mint(owner.address, tokenId);
      const tokenURI = await generativeMIDIs.tokenURI(tokenId);
      const result = JSON.parse(
        Buffer.from(tokenURI.replace("data:application/json;base64,", ""), "base64").toString()
      );
      expect(result.name).to.eq(`Generative MIDIs Series 1 #${tokenId}`);
      expect(result.description).to.eq(description);
      expect(result.image).to.eq(image);
      expect(result.animation_url).to.eq(`${player}?tokenId=${tokenId}`);
      expect(result.midi).to.eq(dataUri);
      expect(result.attributes[0].trait_type).to.eq("INDEX");
      expect(result.attributes[0].value).to.eq("0");
    });
  });
});
