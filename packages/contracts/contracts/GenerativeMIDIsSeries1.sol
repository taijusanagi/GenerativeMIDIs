// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import {LicenseVersion, CantBeEvil} from "@a16z/contracts/licenses/CantBeEvil.sol";
import {ERC721, ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract GenerativeMIDIsSeries1 is ERC721Enumerable, CantBeEvil(LicenseVersion.CBE_CC0) {
  string public constant description = "description";
  string public constant image = "image";
  string public constant player = "player";

  constructor() ERC721("GenerativeMIDIsSeries1", "GMIDIS1") {}

  function mint(address to, uint256 tokenId) public payable {
    require(tokenId < 88, "GenerativeMIDIs: invalid tokenId");
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
      bytes1 noteNumber = bytes1(uint8(tokenId + 21)); // start from 21 = A0
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
          '","description":"',
          description,
          '","image":"',
          image,
          '","animation_url":"',
          player,
          "?tokenId=",
          tokenIdString,
          '","midi":"',
          midi,
          '","attributes":',
          abi.encodePacked('[{"trait_type":"INDEX","value":"', tokenIdString, '"}]'),
          "}"
        )
      );
  }

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    string memory metadata = getMetadata(tokenId);
    return string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(metadata))));
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(ERC721Enumerable, CantBeEvil)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
