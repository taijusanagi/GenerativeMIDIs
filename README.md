# GenerativeMIDIs

## Deployed Contract

Contract is deployed on Polygon
https://mumbai.polygonscan.com/address/0xcf25C7F62D3198ecd1bEe331F247B9d8BeeE8fE7#code

Static data is served in IPFS

## Description

GenerativeMIDIs is a project which generates MIDI data fully on-chain. It encodes MIDI raw data in solidity, then generates token URI in a contract.

There are so many generative music projects, but there is fewer fully on-chain generative music project. I think this is because of the difficulty encoding the music data in the smart contract. (not like SVG data)

In this GenerativeMIDIs project, I researched how to code raw MIDI data and implemented simple MIDI generation code in solidity.

This can be used for the template of a new kind of full-on-chain NFT project.

## How it's made

I researched how MIDI data works from this web page.
http://www.music.mcgill.ca/~ich/classes/mumt306/StandardMIDIfileformat.html

The code in solidity one by one to make it possible.
https://www.npmjs.com/package/midi-writer-js

This coding is almost like generating raw binary MIDI data in solidity, so it was tough, but I successfully developed the simple MIDI data.

I used a polygon network for the scalable chain.
