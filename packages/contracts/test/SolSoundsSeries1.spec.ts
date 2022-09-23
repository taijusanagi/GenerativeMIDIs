import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import MidiWriter from "midi-writer-js";

const extract = (track: MidiWriter.Track) => {
  const write = new MidiWriter.Writer(track);
  const dataUri = write.dataUri();
  const data = dataUri.replace("data:audio/midi;base64,", "");
  const raw = Buffer.from(data, "base64url").toString("hex");
  return { dataUri, raw };
};

describe("Midi", function () {
  async function fixture() {
    const SolSounds = await ethers.getContractFactory("SolSoundsSeries0");
    const image = "image";
    const player = "player";
    const note = "note";
    const solSounds = await SolSounds.deploy(image, player, note);
    const mintedTokenId = 0;
    return {
      solSounds,
      image,
      player,
      note,
      mintedTokenId,
    };
  }

  describe("deployment", function () {
    it("should work", async function () {
      const { solSounds, image, player, note } = await loadFixture(fixture);
      expect(solSounds.image).not.equal(image);
      expect(solSounds.player).not.equal(player);
      expect(solSounds.note).not.equal(note);
    });
  });

  describe("getTrack", function () {
    it("empty", async function () {
      const { solSounds } = await loadFixture(fixture);
      const track = new MidiWriter.Track();
      const result = extract(track);
      // console.log(result);
    });
  });

  // it("instrument", async function () {
  //   const { midi } = await loadFixture(fixture);
  //   const track = new MidiWriter.Track();
  //   track.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: 1 }));
  //   const result = extract(track);
  //   console.log(result);
  // });

  // it("note", async function () {
  //   const { midi } = await loadFixture(fixture);
  //   const track = new MidiWriter.Track();
  //   track.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: 1 }));
  //   const note = new MidiWriter.NoteEvent({
  //     pitch: ["C4"],
  //     duration: "1",
  //   });
  //   track.addEvent(note);
  //   const result = extract(track);
  //   console.log(result);
  // });

  describe("getMidiRaw", function () {
    it("should work", async function () {
      const { solSounds, mintedTokenId } = await loadFixture(fixture);
      expect(await solSounds.getMidiRaw(mintedTokenId)).to.equal(
        "0x4d546864000000060000000100804d54726b0000000400ff2f00"
      );
    });
  });

  describe("getMidiDataURI", function () {
    it("should work", async function () {
      const { solSounds, mintedTokenId } = await loadFixture(fixture);
      expect(await solSounds.getMidiDataURI(mintedTokenId)).to.equal(
        "data:audio/midi;base64,TVRoZAAAAAYAAAABAIBNVHJrAAAABAD/LwA="
      );
    });
  });

  describe("tokenURI", function () {
    it("should work", async function () {
      const { solSounds, mintedTokenId } = await loadFixture(fixture);
      expect(await solSounds.getMidiDataURI(mintedTokenId)).to.equal(
        "data:audio/midi;base64,TVRoZAAAAAYAAAABAIBNVHJrAAAABAD/LwA="
      );
    });
  });
});
