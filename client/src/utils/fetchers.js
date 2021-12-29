import { gzip } from 'pako';
import axios from 'axios';

/**
 * @param {string} url
 * @returns {Promise<ArrayBuffer>}
 */
async function fetchBinary(url) {
  console.log("fetchBinary() url:" + url)
  // const result = await $.ajax({
  //   async: false,
  //   dataType: 'binary',
  //   method: 'GET',
  //   responseType: 'arraybuffer',
  //   url,
  // });
  const result = await axios.get(url, {
    responseType: 'arraybuffer',
  }).then(response => response.data)
  return result;
}

/**
 * @template T
 * @param {string} url
 * @returns {Promise<T>}
 */
async function fetchJSON(url) {
  console.log("fetchJSON() url:" + url)
  // const result = await $.ajax({
  //   async: false,
  //   dataType: 'json',
  //   method: 'GET',
  //   url,
  // });
  const result = await axios.get(url, {
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
  }).then(response => response.data)
  return result;
}

/**
 * @template T
 * @param {string} url
 * @param {File} file
 * @returns {Promise<T>}
 */
async function sendFile(url, file) {
  console.log("sendFile() url:" + url)
  // const result = await $.ajax({
  //   async: false,
  //   data: file,
  //   dataType: 'json',
  //   headers: {
  //     'Content-Type': 'application/octet-stream',
  //   },
  //   method: 'POST',
  //   processData: false,
  //   url,
  // });
  const result = await axios.post(url, {
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/octet-stream',
    },
    data: file,
  }).then(response => response.data)
  return result;
}

/**
 * @template T
 * @param {string} url
 * @param {object} data
 * @returns {Promise<T>}
 */
async function sendJSON(url, data) {
  console.log("sendJSON() url:" + url)
  const jsonString = JSON.stringify(data);
  const uint8Array = new TextEncoder().encode(jsonString);
  const compressed = gzip(uint8Array);

  // const result = await $.ajax({
  //   async: false,
  //   data: compressed,
  //   dataType: 'json',
  //   headers: {
  //     'Content-Encoding': 'gzip',
  //     'Content-Type': 'application/json',
  //   },
  //   method: 'POST',
  //   processData: false,
  //   url,
  // });
  const result = await axios.post(url, {
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Encoding': 'gzip',
      'Content-Type': 'application/json',
    },
    data: compressed,
  }).then(response => response.data)
  return result;
}

export { fetchBinary, fetchJSON, sendFile, sendJSON };
