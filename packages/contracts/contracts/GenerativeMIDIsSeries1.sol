// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract GenerativeMIDIsSeries1 is ERC721 {
  string public image;
  string public player;
  string public note;

  constructor(
    string memory _image,
    string memory _player,
    string memory _note
  ) ERC721("GenerativeMIDIsSeries1", "GMIDIS1") {
    image = _image;
    player = _player;
    note = _note;
    mint(msg.sender, 0); //C-1
    mint(msg.sender, 69); //A4
    mint(msg.sender, 127); //G9
  }

  function mint(address to, uint256 tokenId) public payable {
    require(tokenId <= 127, "GenerativeMIDIs: invalid tokenId");
    _mint(to, tokenId);
  }

  function getMidi(uint256 tokenId) public view returns (string memory) {
    _requireMinted(tokenId);
    bytes memory headerChunk;
    {
      bytes4 chunkType = hex"4d546864";
      bytes2 format = hex"0000";
      bytes2 ntrks = hex"0001";
      bytes2 division = hex"0080";
      bytes memory header = abi.encodePacked(format, ntrks, division);
      headerChunk = abi.encodePacked(chunkType, bytes4(uint32(header.length)), header);
    }
    bytes memory truckChunk;
    {
      bytes4 chunkType = hex"4d54726b";
      bytes1 defaultDeltaTime = hex"00";
      bytes1 noteOn = hex"90";
      bytes1 noteOff = hex"80";
      bytes1 noteNumber = bytes1(uint8(tokenId));
      bytes1 velocity = hex"51";
      bytes3 endOfTrack = hex"ff2f00";
      bytes memory track = abi.encodePacked(
        defaultDeltaTime,
        noteOn,
        noteNumber,
        velocity,
        hex"8400", // delta time for duration 1
        noteOff,
        noteNumber,
        velocity,
        defaultDeltaTime,
        endOfTrack
      );
      truckChunk = abi.encodePacked(chunkType, bytes4(uint32(track.length)), track);
    }
    bytes memory raw = abi.encodePacked(headerChunk, truckChunk);
    return string(abi.encodePacked("data:audio/midi;base64,", Base64.encode(raw)));
  }

  function getMetadata(uint256 tokenId) public view returns (string memory) {
    string memory midi = getMidi(tokenId);
    string memory tokenIdString = Strings.toString(tokenId);
    return
      string(
        abi.encodePacked(
          '{"name":"Generative MIDIs Series 1 #',
          tokenIdString,
          '","description": "MIDI data generated fully on chain.","image_data":"',
          image,
          '","animation_url":"',
          player,
          "?tokenId=",
          tokenIdString,
          '","sound":"',
          midi,
          '","attributes":',
          abi.encodePacked('[{"trait_type":"TONE NUMBER","value":"', tokenIdString, '"}]'),
          "}"
        )
      );
  }

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    string memory metadata = getMetadata(tokenId);
    return string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(metadata))));
  }
}
