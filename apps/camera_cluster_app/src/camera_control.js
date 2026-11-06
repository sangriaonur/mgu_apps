// SPDX-License-Identifier: GPL-3.0-or-later
'use strict';

const EventEmitter = require('events');
const net = require('net');

const CAM_RENDER_PATH = '/dev/shm/cam-on-cluster/ctl.sock';
const RETRY_MS = 1000;

class LineSocket extends EventEmitter {
    constructor(options) {
        super();
        this.path = options.path;
        this.retryMs = options.retryMs || RETRY_MS;
        this._onMessage = options.onMessage || function () {};
        this.link = 'down';
        this._open = false;
        this._socket = null;
        this._buf = '';
    }

    open() {
        if (!this._open) {
            this._open = true;
            this._connect();
        }
    }

    close() {
        this._open = false;
        if (this._socket) {
            this._socket.end();
            this._socket = null;
        }
        this.link = 'down';
    }

    connected() {
        return this.link === 'up';
    }

    _connect() {
        if (!this._open || this._socket) return;
        const socket = net.connect(this.path);
        this._socket = socket;
        this._buf = '';
        socket.setEncoding('utf8');
        socket.on('connect', () => {
            if (this._socket === socket) {
                this.link = 'up';
                this.emit('connect');
            }
        });
        socket.on('data', (chunk) => {
            if (this._socket === socket) this._onData(chunk);
        });
        socket.on('error', () => {
            this.link = 'refused';
        });
        socket.on('close', () => {
            if (this._socket !== socket) return;
            this._socket = null;
            this.link = 'refused';
            this.emit('close');
            setTimeout(() => this._connect(), this.retryMs);
        });
    }

    _onData(chunk) {
        this._buf += chunk;
        let nl;
        while ((nl = this._buf.indexOf('\n')) >= 0) {
            const line = this._buf.slice(0, nl).trim();
            this._buf = this._buf.slice(nl + 1);
            if (line) {
                try {
                    this._onMessage(JSON.parse(line));
                } catch (e) {}
            }
        }
    }
}

class CameraClusterControl extends EventEmitter {
    constructor(options = {}) {
        super();
        this.renderStatus = null;
        this.render = new LineSocket({
            path: options.renderPath || CAM_RENDER_PATH,
            onMessage: (msg) => {
                if (msg.ev === 'status') {
                    this.renderStatus = msg;
                    this.emit('change');
                }
            }
        });
    }

    open() { this.render.open(); }
    close() { this.render.close(); }

    statusText() {
        if (!this.render.connected()) return 'Camera Service Offline';
        const rs = this.renderStatus;
        if (rs && rs.state === 'showing') return 'Showing: Front Camera View on Cluster';
        return 'Ready — Trigger Console Camera Button';
    }
}

module.exports = { CameraClusterControl };
