import https from 'https';
import fs from 'fs';
import path from 'path';
import net from 'net';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_URL = "https://www.vpngate.net/api/iphone/";
const LOG_URL = "https://www.vpngate.net/en/lastlog.aspx";
const STORAGE_PATH = path.join(__dirname, 'public', 'free_configs.json');
const CONFIGS_DIR = path.join(__dirname, 'public', 'configs');

async function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

function parseCsv(data) {
    const lines = data.split(/\r?\n/);
    if (lines.length < 3) return [];
    
    // The second line (index 1) contains the headers, usually starts with #
    let headerLine = lines[1].trim();
    if (headerLine.startsWith('#')) {
        headerLine = headerLine.substring(1);
    }
    
    const headers = headerLine.split(',').map(h => h.trim());
    const results = [];
    
    for (let i = 2; i < lines.length - 1; i++) {
        const line = lines[i].trim();
        if (!line || line === '*') continue;
        const values = line.split(',');
        const obj = {};
        headers.forEach((header, index) => {
            if (header) {
                obj[header] = values[index] ? values[index].trim() : '';
            }
        });
        results.push(obj);
    }
    return results;
}

function parseIranConnections(html) {
    // Ported regex from Python: IR.png'.*?/> Iran.*?</td>.*?<td.*?>(.*?)</td>.*?<td.*?>(.*?)</td>.*?<td.*?>(.*?)</td>
    // Note: Log page might have changed or be different in markdown vs raw html. 
    // This regex looks for Iran entries.
    const rowRegex = /IR\.png'.*?\/> Iran.*?<\/td>.*?<td.*?>(.*?)<\/td>.*?<td.*?>(.*?)<\/td>.*?<td.*?>(.*?)<\/td>/gis;
    let match;
    const prefixes = new Set();
    
    while ((match = rowRegex.exec(html)) !== null) {
        let destIp = match[2].replace(/<.*?>/g, '').trim();
        if (destIp.includes('.x.x')) {
            const prefix = destIp.replace('.x.x', '');
            prefixes.add(prefix);
        }
    }
    return Array.from(prefixes);
}

async function checkTcpPort(ip, port) {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(1500);
        socket.on('connect', () => {
            socket.destroy();
            resolve(true);
        });
        socket.on('timeout', () => {
            socket.destroy();
            resolve(false);
        });
        socket.on('error', () => {
            socket.destroy();
            resolve(false);
        });
        socket.connect(port, ip);
    });
}

async function testServer(serverData) {
    const ip = serverData['IP'];
    const targetPorts = [443, 1194, 995, 5555];
    
    for (const port of targetPorts) {
        const reachable = await checkTcpPort(ip, port);
        if (reachable) {
            return { reachable: true, data: { ...serverData, SuccessPort: port } };
        }
    }
    return { reachable: false, data: serverData };
}

async function main() {
    console.log("[*] Fetching server list from VPN Gate...");
    try {
        const csvData = await fetchUrl(CSV_URL);
        const logHtml = await fetchUrl(LOG_URL);
        
        const servers = parseCsv(csvData);
        if (servers.length === 0) {
            console.log("[!] No servers found.");
            return;
        }

        const IranPrefixes = parseIranConnections(logHtml);
        console.log(`[*] Found ${IranPrefixes.length} active IP ranges used by Iranians recently.`);
        
        const candidateServers = [];
        const seenIps = new Set();
        
        for (const prefix of IranPrefixes) {
            for (const s of servers) {
                const ip = s['IP'];
                if (ip && ip.startsWith(prefix) && !seenIps.has(ip)) {
                    candidateServers.push(s);
                    seenIps.add(ip);
                }
            }
        }

        console.log(`[*] Found ${candidateServers.length} potential servers. Starting reachability tests...`);

        const passedServers = [];
        // Test in batches to avoid overhead
        const batchSize = 30;
        for (let i = 0; i < candidateServers.length; i += batchSize) {
            const batch = candidateServers.slice(i, i + batchSize);
            const results = await Promise.all(batch.map(s => testServer(s)));
            for (const result of results) {
                if (result.reachable) {
                    console.log(` [PASS] ${result.data.IP.padEnd(15)} (Port: ${result.data.SuccessPort})`);
                    passedServers.push(result.data);
                }
            }
        }

        passedServers.sort((a, b) => parseInt(b.Score || '0') - parseInt(a.Score || '0'));
        
        // Ensure directories exist
        const publicDir = path.dirname(STORAGE_PATH);
        if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
        if (!fs.existsSync(CONFIGS_DIR)) fs.mkdirSync(CONFIGS_DIR, { recursive: true });

        // Save JSON
        const topServers = passedServers.slice(0, 50);
        fs.writeFileSync(STORAGE_PATH, JSON.stringify(topServers, null, 2));
        
        // Save OVPNs
        const oldFiles = fs.readdirSync(CONFIGS_DIR);
        for (const f of oldFiles) fs.unlinkSync(path.join(CONFIGS_DIR, f));

        for (const s of topServers.slice(0, 20)) {
            const configB64 = s['OpenVPN_ConfigData_Base64'];
            if (configB64) {
                const filename = path.join(CONFIGS_DIR, `iran_working_${s.IP}.ovpn`);
                fs.writeFileSync(filename, Buffer.from(configB64, 'base64'));
            }
        }

        console.log("=" . repeat(80));
        console.log(`[+] Total working servers found: ${passedServers.length}`);
        console.log(`[+] Data saved to ${STORAGE_PATH}`);

    } catch (error) {
        console.error(`[!] Error: ${error.message}`);
    }
}

main();
