// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.15;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract SolSoundsSeries0 is ERC721 {
  uint256 public constant maxTokenId = 127;

  string public image;
  string public player;
  string public note;

  constructor(
    string memory _image,
    string memory _player,
    string memory _note
  ) ERC721("SolSoundsSeries0", "SSS1") {
    image = _image;
    player = _player;
    note = _note;
    mint(msg.sender, 0); //C-1
    mint(msg.sender, 69); //A4
    mint(msg.sender, 127); //G9
  }

  function mint(address to, uint256 tokenId) public payable {
    require(tokenId <= maxTokenId, "SolSoundsSeries0: invalid tokenId");
    _mint(to, tokenId);
  }

  function getTrack(uint256 tokenId) public view returns (bytes memory, bytes memory) {
    _requireMinted(tokenId);
    return (hex"00000004", hex"00");
  }

  function getMidiRaw(uint256 tokenId) public view returns (bytes memory) {
    bytes memory headerChunk;
    {
      bytes memory chunkType = hex"4d546864";
      bytes memory length = hex"00000006";
      bytes memory format = hex"0000";
      bytes memory ntrks = hex"0001";
      bytes memory division = hex"0080";
      headerChunk = abi.encodePacked(chunkType, length, format, ntrks, division);
    }
    bytes memory truckChunk;
    {
      bytes memory chunkType = hex"4d54726b";
      (bytes memory length, bytes memory data) = getTrack(tokenId);
      bytes memory endOfTrack = hex"ff2f00";
      truckChunk = abi.encodePacked(chunkType, length, data, endOfTrack);
    }
    return abi.encodePacked(headerChunk, truckChunk);
  }

  function getMidiDataURI(uint256 tokenId) public view returns (string memory) {
    bytes memory midiRaw = getMidiRaw(tokenId);
    return string(abi.encodePacked("data:audio/midi;base64,", Base64.encode(midiRaw)));
  }

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    string memory midiDataURI = getMidiDataURI(tokenId);
    string memory tokenIdString = Strings.toString(tokenId);
    bytes memory metadata = abi.encodePacked(
      '{"name":"MidiSol V1 #',
      tokenIdString,
      '","description": "A MIDI Track generated fully on chain.","image_data":"',
      image,
      '","animation_url":"',
      player,
      "?tokenId=",
      tokenIdString,
      '","track":"',
      midiDataURI,
      '","attributes":',
      abi.encodePacked('[{"trait_type":"TONE NUMBER","value":"', tokenIdString, '"}]'),
      "}"
    );
    return string(abi.encodePacked("data:application/json;base64,", Base64.encode(metadata)));
  }
}
