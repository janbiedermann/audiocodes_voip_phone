// usage:
// node update_squashfs.js firmware.img new_root_squashfs.sqfs
// will create new_firmware.img with the squashfs in the rootfs.sqfs
// firmware section replaced by new_root_squashfs.sqfs

// Chances are the new image will brick your phone!

const fs = require("node:fs");

const original_img = process.argv[2];
const new_image = 'new_' + original_img;
const new_squashfs = process.argv[3];

function checksum(data) {
  let sum = 0, i = 0;
  for (; i < data.length; i++) {
    sum += data[i];
  }
  return sum;
}

let pos = 0;
let buffer;
let new_buffer;

function read_four() {
  let res = buffer.readUInt32LE(pos);
  pos += 4;
  return res;
}
const read_checksum = read_four;
const read_length = read_four;
const read_n_sections = read_four;
const read_type = read_four;
const read_ver = read_four;

function read_section_name() {
  return buffer.toString('ascii', pos, pos += 64);
}

function read_magic(expected) {
  let magic = read_four();
  if (magic != expected) {
    throw new Error(`wrong magic number, expected ${expected.toString(16)}, got ${magic.toString(16)}`);
  }
}

// parse and set header
function parse_and_set_header() {
  console.log('parsing header');
  read_magic(0xAAAAAAAA);
  read_four(); // HW version
  let length = read_length();
  read_checksum();
  let n_sect = read_n_sections();
  if (n_sect != 5) {
    throw new Error('wrong number of sections');
  }
  pos = length;
  new_buffer = Buffer.copyBytesFrom(buffer, 0, length);
}

// parse section
function parse_section(name) {
  console.log('parsing section ' + name);
  let start = pos;
  read_magic(0xBBBBBBBB);
  let header_length = read_length();
  let section_name = read_section_name();
  if (!section_name.startsWith(name)) {
    throw new Error(`unexpected section ${section_name}, expected ${name}`);
  }
  read_type();
  read_ver();
  let section_crc = read_checksum();
  let data_length = read_length();
  let section_length = read_length(); // length with alignment
  let length = header_length + section_length;
  let data = Buffer.copyBytesFrom(buffer, start + header_length, data_length);
  let calculated_crc = checksum(data);
  if (section_crc != calculated_crc) {
    throw new Error(`crc mismatch for section ${name}, section crc ${section_crc.toString(16)}, calculated crc ${calculated_crc.toString(16)} - ${crc32([1,2,3]).toString(16)}`);
  }
  pos = start + length;
  return length;
}

// parse and set section
function parse_and_set_section(name) {
  let start = pos;
  let length = parse_section(name);
  new_buffer = Buffer.concat([new_buffer, Buffer.copyBytesFrom(buffer, start, length)]);
}

function parse_and_set_tail() {
  if (buffer.length > pos + 1) {
    new_buffer = Buffer.concat([new_buffer, Buffer.copyBytesFrom(buffer, pos, buffer.length - pos)]);
  }
}

// set a section
function set_section(name, type, data) {
  let header = Buffer.alloc(96);
  header.writeUInt32LE(0xBBBBBBBB, 0);      // magic
  header.writeUInt32LE(96, 4);              // header length
  header.write(name, 8, 64);                // name
  header.writeUInt32LE(type, 72);           // type
  header.writeUInt32LE(0, 76);              // ver
  header.writeUInt32LE(checksum(data), 80); // checksum
  header.writeUInt32LE(data.length, 84);    // data length
  header.writeUInt32LE(data.length, 88);    // section length
  new_buffer = Buffer.concat([new_buffer, header, data]);
}

(function main() {
  console.log('updating ' + original_img)
  buffer = fs.readFileSync(original_img);
  parse_and_set_header();
  parse_and_set_section('psbl.bin');
  parse_and_set_section('ram_zimage.bin');
  parse_section('rootfs.sqfs');
  set_section('rootfs.sqfs', 1, fs.readFileSync(new_squashfs))
  parse_and_set_section('phone.img');
  parse_and_set_section('section.map');
  parse_and_set_section('flasher');
  parse_and_set_tail();
  console.log('writing ' + new_image)
  fs.writeFileSync(new_image, new_buffer);
})();
