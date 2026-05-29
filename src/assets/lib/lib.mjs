var Yt = { exports: {} };
(function(i) {
  const e = {};
  e.generateIdentifier = function() {
    return Math.random().toString(36).substring(2, 12);
  }, e.localCName = e.generateIdentifier(), e.splitLines = function(t) {
    return t.trim().split(`
`).map((s) => s.trim());
  }, e.splitSections = function(t) {
    return t.split(`
m=`).map((n, r) => (r > 0 ? "m=" + n : n).trim() + `\r
`);
  }, e.getDescription = function(t) {
    const s = e.splitSections(t);
    return s && s[0];
  }, e.getMediaSections = function(t) {
    const s = e.splitSections(t);
    return s.shift(), s;
  }, e.matchPrefix = function(t, s) {
    return e.splitLines(t).filter((n) => n.indexOf(s) === 0);
  }, e.parseCandidate = function(t) {
    let s;
    t.indexOf("a=candidate:") === 0 ? s = t.substring(12).split(" ") : s = t.substring(10).split(" ");
    const n = {
      foundation: s[0],
      component: { 1: "rtp", 2: "rtcp" }[s[1]] || s[1],
      protocol: s[2].toLowerCase(),
      priority: parseInt(s[3], 10),
      ip: s[4],
      address: s[4],
      // address is an alias for ip.
      port: parseInt(s[5], 10),
      // skip parts[6] == 'typ'
      type: s[7]
    };
    for (let r = 8; r < s.length; r += 2)
      switch (s[r]) {
        case "raddr":
          n.relatedAddress = s[r + 1];
          break;
        case "rport":
          n.relatedPort = parseInt(s[r + 1], 10);
          break;
        case "tcptype":
          n.tcpType = s[r + 1];
          break;
        case "ufrag":
          n.ufrag = s[r + 1], n.usernameFragment = s[r + 1];
          break;
        default:
          n[s[r]] === void 0 && (n[s[r]] = s[r + 1]);
          break;
      }
    return n;
  }, e.writeCandidate = function(t) {
    const s = [];
    s.push(t.foundation);
    const n = t.component;
    n === "rtp" ? s.push(1) : n === "rtcp" ? s.push(2) : s.push(n), s.push(t.protocol.toUpperCase()), s.push(t.priority), s.push(t.address || t.ip), s.push(t.port);
    const r = t.type;
    return s.push("typ"), s.push(r), r !== "host" && t.relatedAddress && t.relatedPort && (s.push("raddr"), s.push(t.relatedAddress), s.push("rport"), s.push(t.relatedPort)), t.tcpType && t.protocol.toLowerCase() === "tcp" && (s.push("tcptype"), s.push(t.tcpType)), (t.usernameFragment || t.ufrag) && (s.push("ufrag"), s.push(t.usernameFragment || t.ufrag)), "candidate:" + s.join(" ");
  }, e.parseIceOptions = function(t) {
    return t.substring(14).split(" ");
  }, e.parseRtpMap = function(t) {
    let s = t.substring(9).split(" ");
    const n = {
      payloadType: parseInt(s.shift(), 10)
      // was: id
    };
    return s = s[0].split("/"), n.name = s[0], n.clockRate = parseInt(s[1], 10), n.channels = s.length === 3 ? parseInt(s[2], 10) : 1, n.numChannels = n.channels, n;
  }, e.writeRtpMap = function(t) {
    let s = t.payloadType;
    t.preferredPayloadType !== void 0 && (s = t.preferredPayloadType);
    const n = t.channels || t.numChannels || 1;
    return "a=rtpmap:" + s + " " + t.name + "/" + t.clockRate + (n !== 1 ? "/" + n : "") + `\r
`;
  }, e.parseExtmap = function(t) {
    const s = t.substring(9).split(" ");
    return {
      id: parseInt(s[0], 10),
      direction: s[0].indexOf("/") > 0 ? s[0].split("/")[1] : "sendrecv",
      uri: s[1],
      attributes: s.slice(2).join(" ")
    };
  }, e.writeExtmap = function(t) {
    return "a=extmap:" + (t.id || t.preferredId) + (t.direction && t.direction !== "sendrecv" ? "/" + t.direction : "") + " " + t.uri + (t.attributes ? " " + t.attributes : "") + `\r
`;
  }, e.parseFmtp = function(t) {
    const s = {};
    let n;
    const r = t.substring(t.indexOf(" ") + 1).split(";");
    for (let o = 0; o < r.length; o++)
      n = r[o].trim().split("="), s[n[0].trim()] = n[1];
    return s;
  }, e.writeFmtp = function(t) {
    let s = "", n = t.payloadType;
    if (t.preferredPayloadType !== void 0 && (n = t.preferredPayloadType), t.parameters && Object.keys(t.parameters).length) {
      const r = [];
      Object.keys(t.parameters).forEach((o) => {
        t.parameters[o] !== void 0 ? r.push(o + "=" + t.parameters[o]) : r.push(o);
      }), s += "a=fmtp:" + n + " " + r.join(";") + `\r
`;
    }
    return s;
  }, e.parseRtcpFb = function(t) {
    const s = t.substring(t.indexOf(" ") + 1).split(" ");
    return {
      type: s.shift(),
      parameter: s.join(" ")
    };
  }, e.writeRtcpFb = function(t) {
    let s = "", n = t.payloadType;
    return t.preferredPayloadType !== void 0 && (n = t.preferredPayloadType), t.rtcpFeedback && t.rtcpFeedback.length && t.rtcpFeedback.forEach((r) => {
      s += "a=rtcp-fb:" + n + " " + r.type + (r.parameter && r.parameter.length ? " " + r.parameter : "") + `\r
`;
    }), s;
  }, e.parseSsrcMedia = function(t) {
    const s = t.indexOf(" "), n = {
      ssrc: parseInt(t.substring(7, s), 10)
    }, r = t.indexOf(":", s);
    return r > -1 ? (n.attribute = t.substring(s + 1, r), n.value = t.substring(r + 1)) : n.attribute = t.substring(s + 1), n;
  }, e.parseSsrcGroup = function(t) {
    const s = t.substring(13).split(" ");
    return {
      semantics: s.shift(),
      ssrcs: s.map((n) => parseInt(n, 10))
    };
  }, e.getMid = function(t) {
    const s = e.matchPrefix(t, "a=mid:")[0];
    if (s)
      return s.substring(6);
  }, e.parseFingerprint = function(t) {
    const s = t.substring(14).split(" ");
    return {
      algorithm: s[0].toLowerCase(),
      // algorithm is case-sensitive in Edge.
      value: s[1].toUpperCase()
      // the definition is upper-case in RFC 4572.
    };
  }, e.getDtlsParameters = function(t, s) {
    return {
      role: "auto",
      fingerprints: e.matchPrefix(
        t + s,
        "a=fingerprint:"
      ).map(e.parseFingerprint)
    };
  }, e.writeDtlsParameters = function(t, s) {
    let n = "a=setup:" + s + `\r
`;
    return t.fingerprints.forEach((r) => {
      n += "a=fingerprint:" + r.algorithm + " " + r.value + `\r
`;
    }), n;
  }, e.parseCryptoLine = function(t) {
    const s = t.substring(9).split(" ");
    return {
      tag: parseInt(s[0], 10),
      cryptoSuite: s[1],
      keyParams: s[2],
      sessionParams: s.slice(3)
    };
  }, e.writeCryptoLine = function(t) {
    return "a=crypto:" + t.tag + " " + t.cryptoSuite + " " + (typeof t.keyParams == "object" ? e.writeCryptoKeyParams(t.keyParams) : t.keyParams) + (t.sessionParams ? " " + t.sessionParams.join(" ") : "") + `\r
`;
  }, e.parseCryptoKeyParams = function(t) {
    if (t.indexOf("inline:") !== 0)
      return null;
    const s = t.substring(7).split("|");
    return {
      keyMethod: "inline",
      keySalt: s[0],
      lifeTime: s[1],
      mkiValue: s[2] ? s[2].split(":")[0] : void 0,
      mkiLength: s[2] ? s[2].split(":")[1] : void 0
    };
  }, e.writeCryptoKeyParams = function(t) {
    return t.keyMethod + ":" + t.keySalt + (t.lifeTime ? "|" + t.lifeTime : "") + (t.mkiValue && t.mkiLength ? "|" + t.mkiValue + ":" + t.mkiLength : "");
  }, e.getCryptoParameters = function(t, s) {
    return e.matchPrefix(
      t + s,
      "a=crypto:"
    ).map(e.parseCryptoLine);
  }, e.getIceParameters = function(t, s) {
    const n = e.matchPrefix(
      t + s,
      "a=ice-ufrag:"
    )[0], r = e.matchPrefix(
      t + s,
      "a=ice-pwd:"
    )[0];
    return n && r ? {
      usernameFragment: n.substring(12),
      password: r.substring(10)
    } : null;
  }, e.writeIceParameters = function(t) {
    let s = "a=ice-ufrag:" + t.usernameFragment + `\r
a=ice-pwd:` + t.password + `\r
`;
    return t.iceLite && (s += `a=ice-lite\r
`), s;
  }, e.parseRtpParameters = function(t) {
    const s = {
      codecs: [],
      headerExtensions: [],
      fecMechanisms: [],
      rtcp: []
    }, r = e.splitLines(t)[0].split(" ");
    s.profile = r[2];
    for (let a = 3; a < r.length; a++) {
      const d = r[a], h = e.matchPrefix(
        t,
        "a=rtpmap:" + d + " "
      )[0];
      if (h) {
        const u = e.parseRtpMap(h), S = e.matchPrefix(
          t,
          "a=fmtp:" + d + " "
        );
        switch (u.parameters = S.length ? e.parseFmtp(S[0]) : {}, u.rtcpFeedback = e.matchPrefix(
          t,
          "a=rtcp-fb:" + d + " "
        ).map(e.parseRtcpFb), s.codecs.push(u), u.name.toUpperCase()) {
          case "RED":
          case "ULPFEC":
            s.fecMechanisms.push(u.name.toUpperCase());
            break;
        }
      }
    }
    e.matchPrefix(t, "a=extmap:").forEach((a) => {
      s.headerExtensions.push(e.parseExtmap(a));
    });
    const o = e.matchPrefix(t, "a=rtcp-fb:* ").map(e.parseRtcpFb);
    return s.codecs.forEach((a) => {
      o.forEach((d) => {
        a.rtcpFeedback.find((u) => u.type === d.type && u.parameter === d.parameter) || a.rtcpFeedback.push(d);
      });
    }), s;
  }, e.writeRtpDescription = function(t, s) {
    let n = "";
    n += "m=" + t + " ", n += s.codecs.length > 0 ? "9" : "0", n += " " + (s.profile || "UDP/TLS/RTP/SAVPF") + " ", n += s.codecs.map((o) => o.preferredPayloadType !== void 0 ? o.preferredPayloadType : o.payloadType).join(" ") + `\r
`, n += `c=IN IP4 0.0.0.0\r
`, n += `a=rtcp:9 IN IP4 0.0.0.0\r
`, s.codecs.forEach((o) => {
      n += e.writeRtpMap(o), n += e.writeFmtp(o), n += e.writeRtcpFb(o);
    });
    let r = 0;
    return s.codecs.forEach((o) => {
      o.maxptime > r && (r = o.maxptime);
    }), r > 0 && (n += "a=maxptime:" + r + `\r
`), s.headerExtensions && s.headerExtensions.forEach((o) => {
      n += e.writeExtmap(o);
    }), n;
  }, e.parseRtpEncodingParameters = function(t) {
    const s = [], n = e.parseRtpParameters(t), r = n.fecMechanisms.indexOf("RED") !== -1, o = n.fecMechanisms.indexOf("ULPFEC") !== -1, a = e.matchPrefix(t, "a=ssrc:").map((p) => e.parseSsrcMedia(p)).filter((p) => p.attribute === "cname"), d = a.length > 0 && a[0].ssrc;
    let h;
    const u = e.matchPrefix(t, "a=ssrc-group:FID").map((p) => p.substring(17).split(" ").map((T) => parseInt(T, 10)));
    u.length > 0 && u[0].length > 1 && u[0][0] === d && (h = u[0][1]), n.codecs.forEach((p) => {
      if (p.name.toUpperCase() === "RTX" && p.parameters.apt) {
        let E = {
          ssrc: d,
          codecPayloadType: parseInt(p.parameters.apt, 10)
        };
        d && h && (E.rtx = { ssrc: h }), s.push(E), r && (E = JSON.parse(JSON.stringify(E)), E.fec = {
          ssrc: d,
          mechanism: o ? "red+ulpfec" : "red"
        }, s.push(E));
      }
    }), s.length === 0 && d && s.push({
      ssrc: d
    });
    let S = e.matchPrefix(t, "b=");
    return S.length && (S[0].indexOf("b=TIAS:") === 0 ? S = parseInt(S[0].substring(7), 10) : S[0].indexOf("b=AS:") === 0 ? S = parseInt(S[0].substring(5), 10) * 1e3 * 0.95 - 50 * 40 * 8 : S = void 0, s.forEach((p) => {
      p.maxBitrate = S;
    })), s;
  }, e.parseRtcpParameters = function(t) {
    const s = {}, n = e.matchPrefix(t, "a=ssrc:").map((a) => e.parseSsrcMedia(a)).filter((a) => a.attribute === "cname")[0];
    n && (s.cname = n.value, s.ssrc = n.ssrc);
    const r = e.matchPrefix(t, "a=rtcp-rsize");
    s.reducedSize = r.length > 0, s.compound = r.length === 0;
    const o = e.matchPrefix(t, "a=rtcp-mux");
    return s.mux = o.length > 0, s;
  }, e.writeRtcpParameters = function(t) {
    let s = "";
    return t.reducedSize && (s += `a=rtcp-rsize\r
`), t.mux && (s += `a=rtcp-mux\r
`), t.ssrc !== void 0 && t.cname && (s += "a=ssrc:" + t.ssrc + " cname:" + t.cname + `\r
`), s;
  }, e.parseMsid = function(t) {
    let s;
    const n = e.matchPrefix(t, "a=msid:");
    if (n.length === 1)
      return s = n[0].substring(7).split(" "), { stream: s[0], track: s[1] };
    const r = e.matchPrefix(t, "a=ssrc:").map((o) => e.parseSsrcMedia(o)).filter((o) => o.attribute === "msid");
    if (r.length > 0)
      return s = r[0].value.split(" "), { stream: s[0], track: s[1] };
  }, e.parseSctpDescription = function(t) {
    const s = e.parseMLine(t), n = e.matchPrefix(t, "a=max-message-size:");
    let r;
    n.length > 0 && (r = parseInt(n[0].substring(19), 10)), isNaN(r) && (r = 65536);
    const o = e.matchPrefix(t, "a=sctp-port:");
    if (o.length > 0)
      return {
        port: parseInt(o[0].substring(12), 10),
        protocol: s.fmt,
        maxMessageSize: r
      };
    const a = e.matchPrefix(t, "a=sctpmap:");
    if (a.length > 0) {
      const d = a[0].substring(10).split(" ");
      return {
        port: parseInt(d[0], 10),
        protocol: d[1],
        maxMessageSize: r
      };
    }
  }, e.writeSctpDescription = function(t, s) {
    let n = [];
    return t.protocol !== "DTLS/SCTP" ? n = [
      "m=" + t.kind + " 9 " + t.protocol + " " + s.protocol + `\r
`,
      `c=IN IP4 0.0.0.0\r
`,
      "a=sctp-port:" + s.port + `\r
`
    ] : n = [
      "m=" + t.kind + " 9 " + t.protocol + " " + s.port + `\r
`,
      `c=IN IP4 0.0.0.0\r
`,
      "a=sctpmap:" + s.port + " " + s.protocol + ` 65535\r
`
    ], s.maxMessageSize !== void 0 && n.push("a=max-message-size:" + s.maxMessageSize + `\r
`), n.join("");
  }, e.generateSessionId = function() {
    return Math.random().toString().substr(2, 22);
  }, e.writeSessionBoilerplate = function(t, s, n) {
    let r;
    const o = s !== void 0 ? s : 2;
    return t ? r = t : r = e.generateSessionId(), `v=0\r
o=` + (n || "thisisadapterortc") + " " + r + " " + o + ` IN IP4 127.0.0.1\r
s=-\r
t=0 0\r
`;
  }, e.getDirection = function(t, s) {
    const n = e.splitLines(t);
    for (let r = 0; r < n.length; r++)
      switch (n[r]) {
        case "a=sendrecv":
        case "a=sendonly":
        case "a=recvonly":
        case "a=inactive":
          return n[r].substring(2);
      }
    return s ? e.getDirection(s) : "sendrecv";
  }, e.getKind = function(t) {
    return e.splitLines(t)[0].split(" ")[0].substring(2);
  }, e.isRejected = function(t) {
    return t.split(" ", 2)[1] === "0";
  }, e.parseMLine = function(t) {
    const n = e.splitLines(t)[0].substring(2).split(" ");
    return {
      kind: n[0],
      port: parseInt(n[1], 10),
      protocol: n[2],
      fmt: n.slice(3).join(" ")
    };
  }, e.parseOLine = function(t) {
    const n = e.matchPrefix(t, "o=")[0].substring(2).split(" ");
    return {
      username: n[0],
      sessionId: n[1],
      sessionVersion: parseInt(n[2], 10),
      netType: n[3],
      addressType: n[4],
      address: n[5]
    };
  }, e.isValidSDP = function(t) {
    if (typeof t != "string" || t.length === 0)
      return !1;
    const s = e.splitLines(t);
    for (let n = 0; n < s.length; n++)
      if (s[n].length < 2 || s[n].charAt(1) !== "=")
        return !1;
    return !0;
  }, i.exports = e;
})(Yt);
var _e = Yt.exports, $, D, Ue = { d: (i, e) => {
  for (var t in e) Ue.o(e, t) && !Ue.o(i, t) && Object.defineProperty(i, t, { enumerable: !0, get: e[t] });
}, o: (i, e) => Object.prototype.hasOwnProperty.call(i, e) }, v = {};
Ue.d(v, { D6: () => Os, Kr: () => rs, mC: () => ss, jr: () => ns, S_: () => rt, Ff: () => Bs, Hp: () => Us, yC: () => ot, TS: () => Tr, Bs: () => te, CE: () => gs, EQ: () => ms, Fh: () => Ps, L7: () => ks, ys: () => us, Lm: () => _s, Cx: () => Hs, bk: () => As, iI: () => g, RW: () => bs, $o: () => Is, IR: () => Ds, C9: () => Ns, EG: () => xs, Cc: () => Rs, ZS: () => Vs, vx: () => Ts, Vy: () => l, Tt: () => C, e4: () => Zt, EW: () => J, DQ: () => ur, k$: () => b, mY: () => L, D4: () => zs, z3: () => qr, vL: () => ys, Lz: () => Es, FJ: () => it, d2: () => Fs, Eo: () => Pe, kR: () => O, UW: () => j, GZ: () => nt, cZ: () => ts, Si: () => pe, ty: () => st, d_: () => ws, Bg: () => vs, QR: () => $s, y6: () => fs, iu: () => Ss, oK: () => Cs, jG: () => Ms, gw: () => ee, rx: () => at, x1: () => is, Qy: () => ps, bJ: () => Ws, nV: () => as, d4: () => cs, Ys: () => ls, Nu: () => hs, tv: () => ds, n7: () => Qs, xV: () => os, eU: () => es, R3: () => Ks, qM: () => Ls, HH: () => fr, ev: () => vr });
let l = class {
  static GetStackTrace() {
    const e = new Error();
    let t = "No Stack Available for this browser";
    return e.stack && (t = e.stack.toString().replace(/Error/g, "")), t;
  }
  static SetLoggerVerbosity(e) {
    this.verboseLogLevel != null && (this.verboseLogLevel = e);
  }
  static Log(e, t, s) {
    if (s > this.verboseLogLevel) return;
    const n = `Level: Log
Msg: ${t}
Caller: ${e}`;
    console.log(n);
  }
  static Info(e, t, s) {
    if (s > this.verboseLogLevel) return;
    const n = `Level: Info
Msg: ${t}`;
    console.info(n);
  }
  static Error(e, t) {
    const s = `Level: Error
Msg: ${t}
Caller: ${e}`;
    console.error(s);
  }
  static Warning(e, t) {
    const s = `Level: Warning
Caller: ${e}
Msg: ${t}`;
    console.warn(s);
  }
};
l.verboseLogLevel = 5, function(i) {
  i.LIST_STREAMERS = "listStreamers", i.SUBSCRIBE = "subscribe", i.UNSUBSCRIBE = "unsubscribe", i.ICE_CANDIDATE = "iceCandidate", i.OFFER = "offer", i.ANSWER = "answer", i.DATACHANNELREQUEST = "dataChannelRequest", i.SFURECVDATACHANNELREADY = "peerDataChannelsReady", i.PONG = "pong";
}($ || ($ = {}));
let J = class {
  payload() {
    return l.Log(l.GetStackTrace(), `Sending => 
` + JSON.stringify(this, void 0, 4), 6), JSON.stringify(this);
  }
}, nr = class extends J {
  constructor() {
    super(), this.type = $.LIST_STREAMERS;
  }
}, rr = class extends J {
  constructor(e) {
    super(), this.type = $.SUBSCRIBE, this.streamerId = e;
  }
}, ir = class extends J {
  constructor() {
    super(), this.type = $.UNSUBSCRIBE;
  }
}, or = class extends J {
  constructor(e) {
    super(), this.type = $.PONG, this.time = e;
  }
}, ar = class extends J {
  constructor(e) {
    super(), this.type = $.OFFER, e && (this.type = e.type, this.sdp = e.sdp);
  }
}, lr = class extends J {
  constructor(e) {
    super(), this.type = $.ANSWER, e && (this.type = e.type, this.sdp = e.sdp);
  }
}, cr = class extends J {
  constructor() {
    super(), this.type = $.DATACHANNELREQUEST;
  }
}, dr = class extends J {
  constructor() {
    super(), this.type = $.SFURECVDATACHANNELREADY;
  }
}, hr = class {
  constructor(e) {
    this.type = $.ICE_CANDIDATE, this.candidate = e;
  }
  payload() {
    return l.Log(l.GetStackTrace(), `Sending => 
` + JSON.stringify(this, void 0, 4), 6), JSON.stringify(this);
  }
};
(function(i) {
  i.CONFIG = "config", i.STREAMER_LIST = "streamerList", i.PLAYER_COUNT = "playerCount", i.OFFER = "offer", i.ANSWER = "answer", i.ICE_CANDIDATE = "iceCandidate", i.PEER_DATA_CHANNELS = "peerDataChannels", i.PING = "ping", i.WARNING = "warning";
})(D || (D = {}));
let Zt = class {
}, ur = class extends Zt {
}, st = class {
  constructor() {
    this.FromUEMessageHandlers = /* @__PURE__ */ new Map();
  }
  addMessageHandler(e, t) {
    this.FromUEMessageHandlers.set(e, t);
  }
  handleMessage(e, t) {
    this.FromUEMessageHandlers.has(e) ? this.FromUEMessageHandlers.get(e)(t) : l.Error(l.GetStackTrace(), `Message type of ${e} does not have a message handler registered on the frontend - ignoring message.`);
  }
  static setupDefaultHandlers(e) {
    e.signallingProtocol.addMessageHandler(D.PING, (t) => {
      const s = new or((/* @__PURE__ */ new Date()).getTime()).payload();
      l.Log(l.GetStackTrace(), D.PING + ": " + t, 6), e.webSocket.send(s);
    }), e.signallingProtocol.addMessageHandler(D.CONFIG, (t) => {
      l.Log(l.GetStackTrace(), D.CONFIG, 6);
      const s = JSON.parse(t);
      e.onConfig(s);
    }), e.signallingProtocol.addMessageHandler(D.STREAMER_LIST, (t) => {
      l.Log(l.GetStackTrace(), D.STREAMER_LIST, 6);
      const s = JSON.parse(t);
      e.onStreamerList(s);
    }), e.signallingProtocol.addMessageHandler(D.PLAYER_COUNT, (t) => {
      l.Log(l.GetStackTrace(), D.PLAYER_COUNT, 6);
      const s = JSON.parse(t);
      l.Log(l.GetStackTrace(), "Player Count: " + s.count, 6), e.onPlayerCount(s);
    }), e.signallingProtocol.addMessageHandler(D.ANSWER, (t) => {
      l.Log(l.GetStackTrace(), D.ANSWER, 6);
      const s = JSON.parse(t);
      e.onWebRtcAnswer(s);
    }), e.signallingProtocol.addMessageHandler(D.OFFER, (t) => {
      l.Log(l.GetStackTrace(), D.OFFER, 6);
      const s = JSON.parse(t);
      e.onWebRtcOffer(s);
    }), e.signallingProtocol.addMessageHandler(D.ICE_CANDIDATE, (t) => {
      l.Log(l.GetStackTrace(), D.ICE_CANDIDATE, 6);
      const s = JSON.parse(t);
      e.onIceCandidate(s.candidate);
    }), e.signallingProtocol.addMessageHandler(D.WARNING, (t) => {
      l.Warning(l.GetStackTrace(), `Warning received: ${t}`);
    }), e.signallingProtocol.addMessageHandler(D.PEER_DATA_CHANNELS, (t) => {
      l.Log(l.GetStackTrace(), D.PEER_DATA_CHANNELS, 6);
      const s = JSON.parse(t);
      e.onWebRtcPeerDataChannels(s);
    });
  }
}, es = class {
  constructor() {
    this.WS_OPEN_STATE = 1, this.onOpen = new EventTarget(), this.onClose = new EventTarget(), this.signallingProtocol = new st(), st.setupDefaultHandlers(this);
  }
  connect(e) {
    l.Log(l.GetStackTrace(), e, 6);
    try {
      return this.webSocket = new WebSocket(e), this.webSocket.onopen = (t) => this.handleOnOpen(t), this.webSocket.onerror = () => this.handleOnError(), this.webSocket.onclose = (t) => this.handleOnClose(t), this.webSocket.onmessage = (t) => this.handleOnMessage(t), this.webSocket.onmessagebinary = (t) => this.handleOnMessageBinary(t), !0;
    } catch (t) {
      return l.Error(t, t), !1;
    }
  }
  handleOnMessageBinary(e) {
    e && e.data && e.data.text().then((t) => {
      const s = new MessageEvent("messageFromBinary", { data: t });
      this.handleOnMessage(s);
    }).catch((t) => {
      l.Error(l.GetStackTrace(), `Failed to parse binary blob from websocket, reason: ${t}`);
    });
  }
  handleOnMessage(e) {
    if (e.data && e.data instanceof Blob) return void this.handleOnMessageBinary(e);
    const t = JSON.parse(e.data);
    l.Log(l.GetStackTrace(), `received => 
` + JSON.stringify(JSON.parse(e.data), void 0, 4), 6), this.signallingProtocol.handleMessage(t.type, e.data);
  }
  handleOnOpen(e) {
    l.Log(l.GetStackTrace(), "Connected to the signalling server via WebSocket", 6), this.onOpen.dispatchEvent(new Event("open"));
  }
  handleOnError() {
    l.Error(l.GetStackTrace(), "WebSocket error");
  }
  handleOnClose(e) {
    l.Log(l.GetStackTrace(), "Disconnected to the signalling server via WebSocket: " + JSON.stringify(e.code) + " - " + e.reason), this.onClose.dispatchEvent(new CustomEvent("close", { detail: e }));
  }
  requestStreamerList() {
    const e = new nr();
    this.webSocket.send(e.payload());
  }
  sendSubscribe(e) {
    const t = new rr(e);
    this.webSocket.send(t.payload());
  }
  sendUnsubscribe() {
    const e = new ir();
    this.webSocket.send(e.payload());
  }
  sendWebRtcOffer(e) {
    const t = new ar(e);
    this.webSocket.send(t.payload());
  }
  sendWebRtcAnswer(e) {
    const t = new lr(e);
    this.webSocket.send(t.payload());
  }
  sendWebRtcDatachannelRequest() {
    const e = new cr();
    this.webSocket.send(e.payload());
  }
  sendSFURecvDataChannelReady() {
    const e = new dr();
    this.webSocket.send(e.payload());
  }
  sendIceCandidate(e) {
    if (l.Log(l.GetStackTrace(), "Sending Ice Candidate"), this.webSocket && this.webSocket.readyState === this.WS_OPEN_STATE) {
      const t = new hr(e);
      this.webSocket.send(t.payload());
    }
  }
  close() {
    var e;
    (e = this.webSocket) === null || e === void 0 || e.close();
  }
  onConfig(e) {
  }
  onStreamerList(e) {
  }
  onIceCandidate(e) {
  }
  onWebRtcAnswer(e) {
  }
  onWebRtcOffer(e) {
  }
  onWebRtcPeerDataChannels(e) {
  }
  onPlayerCount(e) {
  }
}, gr = class {
  constructor(e) {
    this.videoElementProvider = e, this.audioElement = document.createElement("Audio"), this.videoElementProvider.setAudioElement(this.audioElement);
  }
  handleOnTrack(e) {
    if (l.Log(l.GetStackTrace(), "handleOnTrack " + JSON.stringify(e.streams), 6), e.track.id == "probator") return;
    const t = this.videoElementProvider.getVideoElement();
    if (e.track && l.Log(l.GetStackTrace(), "Got track - " + e.track.kind + " id=" + e.track.id + " readyState=" + e.track.readyState, 6), e.track.kind != "audio") return e.track.kind == "video" && t.srcObject !== e.streams[0] ? (t.srcObject = e.streams[0], void l.Log(l.GetStackTrace(), "Set video source from video track ontrack.")) : void 0;
    this.CreateAudioTrack(e.streams[0]);
  }
  CreateAudioTrack(e) {
    const t = this.videoElementProvider.getVideoElement();
    t.srcObject != e && t.srcObject && t.srcObject !== e && (this.audioElement.srcObject = e, l.Log(l.GetStackTrace(), "Created new audio element to play separate audio stream."));
  }
}, mr = class {
  constructor(e) {
    this.freezeFrameHeight = 0, this.freezeFrameWidth = 0, this.rootDiv = e, this.rootElement = document.createElement("div"), this.rootElement.id = "freezeFrame", this.rootElement.style.display = "none", this.rootElement.style.pointerEvents = "none", this.rootElement.style.position = "absolute", this.rootElement.style.zIndex = "20", this.imageElement = document.createElement("img"), this.imageElement.style.position = "absolute", this.rootElement.appendChild(this.imageElement), this.rootDiv.appendChild(this.rootElement);
  }
  setElementForShow() {
    this.rootElement.style.display = "block";
  }
  setElementForHide() {
    this.rootElement.style.display = "none";
  }
  updateImageElementSource(e) {
    const t = btoa(e.reduce((s, n) => s + String.fromCharCode(n), ""));
    this.imageElement.src = "data:image/jpeg;base64," + t;
  }
  setDimensionsFromElementAndResize() {
    this.freezeFrameHeight = this.imageElement.naturalHeight, this.freezeFrameWidth = this.imageElement.naturalWidth, this.resize();
  }
  resize() {
    if (this.freezeFrameWidth !== 0 && this.freezeFrameHeight !== 0) {
      let e = 0, t = 0, s = 0, n = 0;
      const r = this.rootDiv.clientWidth / this.rootDiv.clientHeight, o = this.freezeFrameWidth / this.freezeFrameHeight;
      r < o ? (e = this.rootDiv.clientWidth, t = Math.floor(this.rootDiv.clientWidth / o), s = Math.floor(0.5 * (this.rootDiv.clientHeight - t)), n = 0) : (e = Math.floor(this.rootDiv.clientHeight * o), t = this.rootDiv.clientHeight, s = 0, n = Math.floor(0.5 * (this.rootDiv.clientWidth - e))), this.rootElement.style.width = this.rootDiv.offsetWidth + "px", this.rootElement.style.height = this.rootDiv.offsetHeight + "px", this.rootElement.style.left = "0px", this.rootElement.style.top = "0px", this.imageElement.style.width = e + "px", this.imageElement.style.height = t + "px", this.imageElement.style.left = n + "px", this.imageElement.style.top = s + "px";
    }
  }
}, pr = class {
  constructor(e) {
    this.receiving = !1, this.size = 0, this.jpeg = void 0, this.valid = !1, this.freezeFrameDelay = 50, this.freezeFrame = new mr(e);
  }
  showFreezeFrame() {
    this.valid && this.freezeFrame.setElementForShow();
  }
  hideFreezeFrame() {
    this.valid = !1, this.freezeFrame.setElementForHide();
  }
  updateFreezeFrameAndShow(e, t) {
    this.freezeFrame.updateImageElementSource(e), this.freezeFrame.imageElement.onload = () => {
      this.freezeFrame.setDimensionsFromElementAndResize(), t();
    };
  }
  processFreezeFrameMessage(e, t) {
    this.receiving || (this.receiving = !0, this.valid = !1, this.size = 0, this.jpeg = void 0), this.size = new DataView(e.slice(1, 5).buffer).getInt32(0, !0);
    const s = e.slice(5);
    if (this.jpeg) {
      const n = new Uint8Array(this.jpeg.length + s.length);
      n.set(this.jpeg, 0), n.set(s, this.jpeg.length), this.jpeg = n;
    } else this.jpeg = s, this.receiving = !0, l.Log(l.GetStackTrace(), `received first chunk of freeze frame: ${this.jpeg.length}/${this.size}`, 6);
    this.jpeg.length === this.size ? (this.receiving = !1, this.valid = !0, l.Log(l.GetStackTrace(), `received complete freeze frame ${this.size}`, 6), this.updateFreezeFrameAndShow(this.jpeg, t)) : this.jpeg.length > this.size && (l.Error(l.GetStackTrace(), `received bigger freeze frame than advertised: ${this.jpeg.length}/${this.size}`), this.jpeg = void 0, this.receiving = !1);
  }
}, Pe = class {
  constructor(e, t, s, n, r = () => {
  }) {
    this.onChange = r, this.onChangeEmit = () => {
    }, this.id = e, this.description = s, this.label = t, this.value = n;
  }
  set label(e) {
    this._label = e, this.onChangeEmit(this._value);
  }
  get label() {
    return this._label;
  }
  get value() {
    return this._value;
  }
  set value(e) {
    this._value = e, this.onChange(this._value, this), this.onChangeEmit(this._value);
  }
}, O = class extends Pe {
  constructor(e, t, s, n, r, o = () => {
  }) {
    super(e, t, s, n, o);
    const a = new URLSearchParams(window.location.search);
    if (r && a.has(this.id)) {
      const d = this.getUrlParamFlag();
      this.flag = d;
    } else this.flag = n;
    this.useUrlParams = r;
  }
  getUrlParamFlag() {
    const e = new URLSearchParams(window.location.search);
    return !!e.has(this.id) && e.get(this.id) !== "false" && e.get(this.id) !== "False";
  }
  updateURLParams() {
    if (this.useUrlParams) {
      const e = new URLSearchParams(window.location.search);
      this.flag === !0 ? e.set(this.id, "true") : e.set(this.id, "false"), window.history.replaceState({}, "", e.toString() !== "" ? `${location.pathname}?${e}` : `${location.pathname}`);
    }
  }
  enable() {
    this.flag = !0;
  }
  get flag() {
    return !!this.value;
  }
  set flag(e) {
    this.value = e;
  }
}, j = class extends Pe {
  constructor(e, t, s, n, r, o, a, d = () => {
  }) {
    super(e, t, s, o, d), this._min = n, this._max = r;
    const h = new URLSearchParams(window.location.search);
    if (a && h.has(this.id)) {
      const u = Number.parseInt(h.get(this.id));
      this.number = Number.isNaN(u) ? o : u;
    } else this.number = o;
    this.useUrlParams = a;
  }
  updateURLParams() {
    if (this.useUrlParams) {
      const e = new URLSearchParams(window.location.search);
      e.set(this.id, this.number.toString()), window.history.replaceState({}, "", e.toString() !== "" ? `${location.pathname}?${e}` : `${location.pathname}`);
    }
  }
  set number(e) {
    this.value = this.clamp(e);
  }
  get number() {
    return this.value;
  }
  clamp(e) {
    return Math.max(Math.min(this._max, e), this._min);
  }
  get min() {
    return this._min;
  }
  get max() {
    return this._max;
  }
  addOnChangedListener(e) {
    this.onChange = e;
  }
}, ts = class extends Pe {
  constructor(e, t, s, n, r, o = () => {
  }) {
    super(e, t, s, n, o);
    const a = new URLSearchParams(window.location.search);
    if (r && a.has(this.id)) {
      const d = this.getUrlParamText();
      this.text = d;
    } else this.text = n;
    this.useUrlParams = r;
  }
  getUrlParamText() {
    var e;
    const t = new URLSearchParams(window.location.search);
    return t.has(this.id) && (e = t.get(this.id)) !== null && e !== void 0 ? e : "";
  }
  updateURLParams() {
    if (this.useUrlParams) {
      const e = new URLSearchParams(window.location.search);
      e.set(this.id, this.text), window.history.replaceState({}, "", e.toString() !== "" ? `${location.pathname}?${e}` : `${location.pathname}`);
    }
  }
  get text() {
    return this.value;
  }
  set text(e) {
    this.value = e;
  }
}, nt = class extends Pe {
  constructor(e, t, s, n, r, o, a = () => {
  }) {
    super(e, t, s, [n, n], a), this.options = r;
    const d = new URLSearchParams(window.location.search), h = o && d.has(this.id) ? this.getUrlParamText() : n;
    this.selected = h, this.useUrlParams = o;
  }
  getUrlParamText() {
    var e;
    const t = new URLSearchParams(window.location.search);
    return t.has(this.id) && (e = t.get(this.id)) !== null && e !== void 0 ? e : "";
  }
  updateURLParams() {
    if (this.useUrlParams) {
      const e = new URLSearchParams(window.location.search);
      e.set(this.id, this.selected), window.history.replaceState({}, "", e.toString() !== "" ? `${location.pathname}?${e}` : `${location.pathname}`);
    }
  }
  addOnChangedListener(e) {
    this.onChange = e;
  }
  get options() {
    return this._options;
  }
  set options(e) {
    this._options = e, this.onChangeEmit(this.selected);
  }
  get selected() {
    return this.value;
  }
  set selected(e) {
    let t = this.options.filter((s) => s.indexOf(e) !== -1);
    t.length ? this.value = t[0] : (t = this.options.filter((s) => s.indexOf(e.split(" ")[0]) !== -1), t.length && (this.value = t[0]));
  }
}, ss = class extends Event {
  constructor(e) {
    super("afkWarningActivate"), this.data = e;
  }
}, rt = class extends Event {
  constructor(e) {
    super("afkWarningUpdate"), this.data = e;
  }
}, ns = class extends Event {
  constructor() {
    super("afkWarningDeactivate");
  }
}, rs = class extends Event {
  constructor() {
    super("afkTimedOut");
  }
}, is = class extends Event {
  constructor(e) {
    super("videoEncoderAvgQP"), this.data = e;
  }
}, os = class extends Event {
  constructor() {
    super("webRtcSdp");
  }
}, as = class extends Event {
  constructor() {
    super("webRtcAutoConnect");
  }
}, ls = class extends Event {
  constructor() {
    super("webRtcConnecting");
  }
}, cs = class extends Event {
  constructor() {
    super("webRtcConnected");
  }
}, ds = class extends Event {
  constructor() {
    super("webRtcFailed");
  }
}, hs = class extends Event {
  constructor(e) {
    super("webRtcDisconnected"), this.data = e;
  }
}, us = class extends Event {
  constructor(e) {
    super("dataChannelOpen"), this.data = e;
  }
}, gs = class extends Event {
  constructor(e) {
    super("dataChannelClose"), this.data = e;
  }
}, ms = class extends Event {
  constructor(e) {
    super("dataChannelError"), this.data = e;
  }
}, ps = class extends Event {
  constructor() {
    super("videoInitialized");
  }
}, vs = class extends Event {
  constructor() {
    super("streamLoading");
  }
}, fs = class extends Event {
  constructor() {
    super("streamConnect");
  }
}, Ss = class extends Event {
  constructor() {
    super("streamDisconnect");
  }
}, Cs = class extends Event {
  constructor() {
    super("streamReconnect");
  }
}, ys = class extends Event {
  constructor(e) {
    super("playStreamError"), this.data = e;
  }
}, Es = class extends Event {
  constructor() {
    super("playStream");
  }
}, it = class extends Event {
  constructor(e) {
    super("playStreamRejected"), this.data = e;
  }
}, Ts = class extends Event {
  constructor(e) {
    super("loadFreezeFrame"), this.data = e;
  }
}, bs = class extends Event {
  constructor() {
    super("hideFreezeFrame");
  }
}, ws = class extends Event {
  constructor(e) {
    super("statsReceived"), this.data = e;
  }
}, Ms = class extends Event {
  constructor(e) {
    super("streamerListMessage"), this.data = e;
  }
}, Rs = class extends Event {
  constructor(e) {
    super("latencyTestResult"), this.data = e;
  }
}, Ps = class extends Event {
  constructor(e) {
    super("dataChannelLatencyTestResponse"), this.data = e;
  }
}, ks = class extends Event {
  constructor(e) {
    super("dataChannelLatencyTestResult"), this.data = e;
  }
}, xs = class extends Event {
  constructor(e) {
    super("initialSettings"), this.data = e;
  }
}, pe = class extends Event {
  constructor(e) {
    super("settingsChanged"), this.data = e;
  }
}, vr = class extends Event {
  constructor() {
    super("xrSessionStarted");
  }
}, fr = class extends Event {
  constructor() {
    super("xrSessionEnded");
  }
}, Ls = class extends Event {
  constructor(e) {
    super("xrFrame"), this.data = e;
  }
}, Fs = class extends Event {
  constructor(e) {
    super("playerCount"), this.data = e;
  }
}, As = class extends EventTarget {
  dispatchEvent(e) {
    return super.dispatchEvent(e);
  }
  addEventListener(e, t) {
    super.addEventListener(e, t);
  }
  removeEventListener(e, t) {
    super.removeEventListener(e, t);
  }
}, g = class {
};
g.AutoConnect = "AutoConnect", g.AutoPlayVideo = "AutoPlayVideo", g.AFKDetection = "TimeoutIfIdle", g.BrowserSendOffer = "OfferToReceive", g.HoveringMouseMode = "HoveringMouse", g.ForceMonoAudio = "ForceMonoAudio", g.ForceTURN = "ForceTURN", g.FakeMouseWithTouches = "FakeMouseWithTouches", g.IsQualityController = "ControlsQuality", g.MatchViewportResolution = "MatchViewportRes", g.StartVideoMuted = "StartVideoMuted", g.SuppressBrowserKeys = "SuppressBrowserKeys", g.UseMic = "UseMic", g.KeyboardInput = "KeyboardInput", g.MouseInput = "MouseInput", g.TouchInput = "TouchInput", g.GamepadInput = "GamepadInput", g.XRControllerInput = "XRControllerInput", g.WaitForStreamer = "WaitForStreamer";
const Sr = (i) => Object.getOwnPropertyNames(g).some((e) => g[e] === i);
let b = class {
};
b.AFKTimeoutSecs = "AFKTimeout", b.MinQP = "MinQP", b.MaxQP = "MaxQP", b.WebRTCFPS = "WebRTCFPS", b.WebRTCMinBitrate = "WebRTCMinBitrate", b.WebRTCMaxBitrate = "WebRTCMaxBitrate", b.MaxReconnectAttempts = "MaxReconnectAttempts", b.StreamerAutoJoinInterval = "StreamerAutoJoinInterval";
const Cr = (i) => Object.getOwnPropertyNames(b).some((e) => b[e] === i);
let ee = class {
};
ee.SignallingServerUrl = "ss";
const yr = (i) => Object.getOwnPropertyNames(ee).some((e) => ee[e] === i);
let L = class {
};
L.PreferredCodec = "PreferredCodec", L.StreamerId = "StreamerId";
const Er = (i) => Object.getOwnPropertyNames(L).some((e) => L[e] === i);
let Tr = class {
  constructor(e = {}) {
    this.flags = /* @__PURE__ */ new Map(), this.numericParameters = /* @__PURE__ */ new Map(), this.textParameters = /* @__PURE__ */ new Map(), this.optionParameters = /* @__PURE__ */ new Map();
    const { initialSettings: t, useUrlParams: s } = e;
    this._useUrlParams = !!s, this.populateDefaultSettings(this._useUrlParams), t && this.setSettings(t);
  }
  get useUrlParams() {
    return this._useUrlParams;
  }
  populateDefaultSettings(e) {
    this.textParameters.set(ee.SignallingServerUrl, new ts(ee.SignallingServerUrl, "Signalling url", "Url of the signalling server", (location.protocol === "https:" ? "wss://" : "ws://") + window.location.hostname + (window.location.port === "80" || window.location.port === "" ? "" : `:${window.location.port}`), e)), this.optionParameters.set(L.StreamerId, new nt(L.StreamerId, "Streamer ID", "The ID of the streamer to stream.", "", [], e)), this.optionParameters.set(L.PreferredCodec, new nt(L.PreferredCodec, "Preferred Codec", "The preferred codec to be used during codec negotiation", "H264 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f", function() {
      const t = [];
      if (!RTCRtpReceiver.getCapabilities) return t.push("Only available on Chrome"), t;
      const s = /(VP\d|H26\d|AV1).*/;
      return RTCRtpReceiver.getCapabilities("video").codecs.forEach((n) => {
        const r = n.mimeType.split("/")[1] + " " + (n.sdpFmtpLine || "");
        s.exec(r) !== null && t.push(r);
      }), t;
    }(), e)), this.flags.set(g.AutoConnect, new O(g.AutoConnect, "Auto connect to stream", "Whether we should attempt to auto connect to the signalling server or show a click to start prompt.", !1, e)), this.flags.set(g.AutoPlayVideo, new O(g.AutoPlayVideo, "Auto play video", "When video is ready automatically start playing it as opposed to showing a play button.", !0, e)), this.flags.set(g.BrowserSendOffer, new O(g.BrowserSendOffer, "Browser send offer", "Browser will initiate the WebRTC handshake by sending the offer to the streamer", !1, e)), this.flags.set(g.UseMic, new O(g.UseMic, "Use microphone", "Make browser request microphone access and open an input audio track.", !1, e)), this.flags.set(g.StartVideoMuted, new O(g.StartVideoMuted, "Start video muted", "Video will start muted if true.", !1, e)), this.flags.set(g.SuppressBrowserKeys, new O(g.SuppressBrowserKeys, "Suppress browser keys", "Suppress certain browser keys that we use in UE, for example F5 to show shader complexity instead of refresh the page.", !0, e)), this.flags.set(g.IsQualityController, new O(g.IsQualityController, "Is quality controller?", "True if this peer controls stream quality", !0, e)), this.flags.set(g.ForceMonoAudio, new O(g.ForceMonoAudio, "Force mono audio", "Force browser to request mono audio in the SDP", !1, e)), this.flags.set(g.ForceTURN, new O(g.ForceTURN, "Force TURN", "Only generate TURN/Relayed ICE candidates.", !1, e)), this.flags.set(g.AFKDetection, new O(g.AFKDetection, "AFK if idle", "Timeout the experience if user is AFK for a period.", !1, e)), this.flags.set(g.MatchViewportResolution, new O(g.MatchViewportResolution, "Match viewport resolution", "Pixel Streaming will be instructed to dynamically resize the video stream to match the size of the video element.", !1, e)), this.flags.set(g.HoveringMouseMode, new O(g.HoveringMouseMode, "Control Scheme: Locked Mouse", "Either locked mouse, where the pointer is consumed by the video and locked to it, or hovering mouse, where the mouse is not consumed.", !1, e, (t, s) => {
      s.label = `Control Scheme: ${t ? "Hovering" : "Locked"} Mouse`;
    })), this.flags.set(g.FakeMouseWithTouches, new O(g.FakeMouseWithTouches, "Fake mouse with touches", "A single finger touch is converted into a mouse event. This allows a non-touch application to be controlled partially via a touch device.", !1, e)), this.flags.set(g.KeyboardInput, new O(g.KeyboardInput, "Keyboard input", "If enabled, send keyboard events to streamer", !0, e)), this.flags.set(g.MouseInput, new O(g.MouseInput, "Mouse input", "If enabled, send mouse events to streamer", !0, e)), this.flags.set(g.TouchInput, new O(g.TouchInput, "Touch input", "If enabled, send touch events to streamer", !0, e)), this.flags.set(g.GamepadInput, new O(g.GamepadInput, "Gamepad input", "If enabled, send gamepad events to streamer", !0, e)), this.flags.set(g.XRControllerInput, new O(g.XRControllerInput, "XR controller input", "If enabled, send XR controller events to streamer", !0, e)), this.flags.set(g.WaitForStreamer, new O(g.WaitForStreamer, "Wait for streamer", "Will continue trying to connect to the first streamer available.", !0, e)), this.numericParameters.set(b.AFKTimeoutSecs, new j(b.AFKTimeoutSecs, "AFK timeout", "The time (in seconds) it takes for the application to time out if AFK timeout is enabled.", 0, 600, 120, e)), this.numericParameters.set(b.MaxReconnectAttempts, new j(b.MaxReconnectAttempts, "Max Reconnects", "Maximum number of reconnects the application will attempt when a streamer disconnects.", 0, 999, 3, e)), this.numericParameters.set(b.MinQP, new j(b.MinQP, "Min QP", "The lower bound for the quantization parameter (QP) of the encoder. 0 = Best quality, 51 = worst quality.", 0, 51, 0, e)), this.numericParameters.set(b.MaxQP, new j(b.MaxQP, "Max QP", "The upper bound for the quantization parameter (QP) of the encoder. 0 = Best quality, 51 = worst quality.", 0, 51, 51, e)), this.numericParameters.set(b.WebRTCFPS, new j(b.WebRTCFPS, "Max FPS", "The maximum FPS that WebRTC will try to transmit frames at.", 1, 999, 60, e)), this.numericParameters.set(b.WebRTCMinBitrate, new j(b.WebRTCMinBitrate, "Min Bitrate (kbps)", "The minimum bitrate that WebRTC should use.", 0, 5e5, 0, e)), this.numericParameters.set(b.WebRTCMaxBitrate, new j(b.WebRTCMaxBitrate, "Max Bitrate (kbps)", "The maximum bitrate that WebRTC should use.", 0, 5e5, 0, e)), this.numericParameters.set(b.StreamerAutoJoinInterval, new j(b.StreamerAutoJoinInterval, "Streamer Auto Join Interval (ms)", "Delay between retries when waiting for an available streamer.", 500, 9e5, 3e3, e));
  }
  _addOnNumericSettingChangedListener(e, t) {
    this.numericParameters.has(e) && this.numericParameters.get(e).addOnChangedListener(t);
  }
  _addOnOptionSettingChangedListener(e, t) {
    this.optionParameters.has(e) && this.optionParameters.get(e).addOnChangedListener(t);
  }
  getNumericSettingValue(e) {
    if (this.numericParameters.has(e)) return this.numericParameters.get(e).number;
    throw new Error(`There is no numeric setting with the id of ${e}`);
  }
  getTextSettingValue(e) {
    if (this.textParameters.has(e)) return this.textParameters.get(e).value;
    throw new Error(`There is no numeric setting with the id of ${e}`);
  }
  setNumericSetting(e, t) {
    if (!this.numericParameters.has(e)) throw new Error(`There is no numeric setting with the id of ${e}`);
    this.numericParameters.get(e).number = t;
  }
  _addOnSettingChangedListener(e, t) {
    this.flags.has(e) && (this.flags.get(e).onChange = t);
  }
  _addOnTextSettingChangedListener(e, t) {
    this.textParameters.has(e) && (this.textParameters.get(e).onChange = t);
  }
  getSettingOption(e) {
    return this.optionParameters.get(e);
  }
  isFlagEnabled(e) {
    return this.flags.get(e).flag;
  }
  setFlagEnabled(e, t) {
    this.flags.has(e) ? this.flags.get(e).flag = t : l.Warning(l.GetStackTrace(), `Cannot toggle flag called ${e} - it does not exist in the Config.flags map.`);
  }
  setTextSetting(e, t) {
    this.textParameters.has(e) ? this.textParameters.get(e).text = t : l.Warning(l.GetStackTrace(), `Cannot set text setting called ${e} - it does not exist in the Config.textParameters map.`);
  }
  setOptionSettingOptions(e, t) {
    this.optionParameters.has(e) ? this.optionParameters.get(e).options = t : l.Warning(l.GetStackTrace(), `Cannot set text setting called ${e} - it does not exist in the Config.optionParameters map.`);
  }
  setOptionSettingValue(e, t) {
    this.optionParameters.has(e) ? this.optionParameters.get(e).selected = t : l.Warning(l.GetStackTrace(), `Cannot set text setting called ${e} - it does not exist in the Config.enumParameters map.`);
  }
  setFlagLabel(e, t) {
    this.flags.has(e) ? this.flags.get(e).label = t : l.Warning(l.GetStackTrace(), `Cannot set label for flag called ${e} - it does not exist in the Config.flags map.`);
  }
  setSettings(e) {
    for (const t of Object.keys(e)) Sr(t) ? this.setFlagEnabled(t, e[t]) : Cr(t) ? this.setNumericSetting(t, e[t]) : yr(t) ? this.setTextSetting(t, e[t]) : Er(t) && this.setOptionSettingValue(t, e[t]);
  }
  getSettings() {
    const e = {};
    for (const [t, s] of this.flags.entries()) e[t] = s.flag;
    for (const [t, s] of this.numericParameters.entries()) e[t] = s.number;
    for (const [t, s] of this.textParameters.entries()) e[t] = s.text;
    for (const [t, s] of this.optionParameters.entries()) e[t] = s.selected;
    return e;
  }
  getFlags() {
    return Array.from(this.flags.values());
  }
  getTextSettings() {
    return Array.from(this.textParameters.values());
  }
  getNumericSettings() {
    return Array.from(this.numericParameters.values());
  }
  getOptionSettings() {
    return Array.from(this.optionParameters.values());
  }
  _registerOnChangeEvents(e) {
    for (const t of this.flags.keys()) {
      const s = this.flags.get(t);
      s && (s.onChangeEmit = (n) => e.dispatchEvent(new pe({ id: s.id, type: "flag", value: n, target: s })));
    }
    for (const t of this.numericParameters.keys()) {
      const s = this.numericParameters.get(t);
      s && (s.onChangeEmit = (n) => e.dispatchEvent(new pe({ id: s.id, type: "number", value: n, target: s })));
    }
    for (const t of this.textParameters.keys()) {
      const s = this.textParameters.get(t);
      s && (s.onChangeEmit = (n) => e.dispatchEvent(new pe({ id: s.id, type: "text", value: n, target: s })));
    }
    for (const t of this.optionParameters.keys()) {
      const s = this.optionParameters.get(t);
      s && (s.onChangeEmit = (n) => e.dispatchEvent(new pe({ id: s.id, type: "option", value: n, target: s })));
    }
  }
};
var te;
(function(i) {
  i[i.LockedMouse = 0] = "LockedMouse", i[i.HoveringMouse = 1] = "HoveringMouse";
})(te || (te = {}));
let Os = class {
  constructor(e, t, s) {
    this.closeTimeout = 10, this.active = !1, this.countdownActive = !1, this.warnTimer = void 0, this.countDown = 0, this.countDownTimer = void 0, this.config = e, this.pixelStreaming = t, this.onDismissAfk = s, this.onAFKTimedOutCallback = () => {
      console.log("AFK timed out, did you want to override this callback?");
    };
  }
  onAfkClick() {
    clearInterval(this.countDownTimer), (this.active || this.countdownActive) && (this.startAfkWarningTimer(), this.pixelStreaming.dispatchEvent(new ns()));
  }
  startAfkWarningTimer() {
    this.config.getNumericSettingValue(b.AFKTimeoutSecs) > 0 && this.config.isFlagEnabled(g.AFKDetection) ? this.active = !0 : this.active = !1, this.resetAfkWarningTimer();
  }
  stopAfkWarningTimer() {
    this.active = !1, this.countdownActive = !1, clearTimeout(this.warnTimer), clearInterval(this.countDownTimer);
  }
  pauseAfkWarningTimer() {
    this.active = !1;
  }
  resetAfkWarningTimer() {
    this.active && this.config.isFlagEnabled(g.AFKDetection) && (clearTimeout(this.warnTimer), this.warnTimer = setTimeout(() => this.activateAfkEvent(), 1e3 * this.config.getNumericSettingValue(b.AFKTimeoutSecs)));
  }
  activateAfkEvent() {
    this.pauseAfkWarningTimer(), this.pixelStreaming.dispatchEvent(new ss({ countDown: this.countDown, dismissAfk: this.onDismissAfk })), this.countDown = this.closeTimeout, this.countdownActive = !0, this.pixelStreaming.dispatchEvent(new rt({ countDown: this.countDown })), this.config.isFlagEnabled(g.HoveringMouseMode) || document.exitPointerLock && document.exitPointerLock(), this.countDownTimer = setInterval(() => {
      this.countDown--, this.countDown == 0 ? (this.pixelStreaming.dispatchEvent(new rs()), this.onAFKTimedOutCallback(), l.Log(l.GetStackTrace(), "You have been disconnected due to inactivity"), this.stopAfkWarningTimer()) : this.pixelStreaming.dispatchEvent(new rt({ countDown: this.countDown }));
    }, 1e3);
  }
}, Rt = class {
  constructor() {
    this.isReceivingFreezeFrame = !1;
  }
  getDataChannelInstance() {
    return this;
  }
  createDataChannel(e, t, s) {
    this.peerConnection = e, this.label = t, this.datachannelOptions = s, s == null && (this.datachannelOptions = {}, this.datachannelOptions.ordered = !0), this.dataChannel = this.peerConnection.createDataChannel(this.label, this.datachannelOptions), this.setupDataChannel();
  }
  setupDataChannel() {
    this.dataChannel.binaryType = "arraybuffer", this.dataChannel.onopen = (e) => this.handleOnOpen(e), this.dataChannel.onclose = (e) => this.handleOnClose(e), this.dataChannel.onmessage = (e) => this.handleOnMessage(e), this.dataChannel.onerror = (e) => this.handleOnError(e);
  }
  handleOnOpen(e) {
    var t;
    l.Log(l.GetStackTrace(), `Data Channel (${this.label}) opened.`, 7), this.onOpen((t = this.dataChannel) === null || t === void 0 ? void 0 : t.label, e);
  }
  handleOnClose(e) {
    var t;
    l.Log(l.GetStackTrace(), `Data Channel (${this.label}) closed.`, 7), this.onClose((t = this.dataChannel) === null || t === void 0 ? void 0 : t.label, e);
  }
  handleOnMessage(e) {
    l.Log(l.GetStackTrace(), `Data Channel (${this.label}) message: ${e}`, 8);
  }
  handleOnError(e) {
    var t;
    l.Log(l.GetStackTrace(), `Data Channel (${this.label}) error: ${e}`, 7), this.onError((t = this.dataChannel) === null || t === void 0 ? void 0 : t.label, e);
  }
  onOpen(e, t) {
  }
  onClose(e, t) {
  }
  onError(e, t) {
  }
}, Is = class {
}, Ds = class {
}, _s = class {
}, ot = class {
}, Us = class {
}, zs = class {
}, br = class {
}, wr = class {
}, Bs = class {
  constructor() {
    this.inboundVideoStats = new Ds(), this.inboundAudioStats = new Is(), this.candidatePair = new Us(), this.DataChannelStats = new _s(), this.outBoundVideoStats = new zs(), this.sessionStats = new br(), this.streamStats = new wr(), this.codecs = /* @__PURE__ */ new Map();
  }
  processStats(e) {
    this.localCandidates = new Array(), this.remoteCandidates = new Array(), e.forEach((t) => {
      switch (t.type) {
        case "candidate-pair":
          this.handleCandidatePair(t);
          break;
        case "certificate":
        case "media-source":
        case "media-playout":
        case "outbound-rtp":
        case "peer-connection":
        case "remote-inbound-rtp":
        case "transport":
          break;
        case "codec":
          this.handleCodec(t);
          break;
        case "data-channel":
          this.handleDataChannel(t);
          break;
        case "inbound-rtp":
          this.handleInBoundRTP(t);
          break;
        case "local-candidate":
          this.handleLocalCandidate(t);
          break;
        case "remote-candidate":
          this.handleRemoteCandidate(t);
          break;
        case "remote-outbound-rtp":
          this.handleRemoteOutBound(t);
          break;
        case "track":
          this.handleTrack(t);
          break;
        case "stream":
          this.handleStream(t);
          break;
        default:
          l.Error(l.GetStackTrace(), "unhandled Stat Type"), l.Log(l.GetStackTrace(), t);
      }
    });
  }
  handleStream(e) {
    this.streamStats = e;
  }
  handleCandidatePair(e) {
    this.candidatePair.bytesReceived = e.bytesReceived, this.candidatePair.bytesSent = e.bytesSent, this.candidatePair.localCandidateId = e.localCandidateId, this.candidatePair.remoteCandidateId = e.remoteCandidateId, this.candidatePair.nominated = e.nominated, this.candidatePair.readable = e.readable, this.candidatePair.selected = e.selected, this.candidatePair.writable = e.writable, this.candidatePair.state = e.state, this.candidatePair.currentRoundTripTime = e.currentRoundTripTime;
  }
  handleDataChannel(e) {
    this.DataChannelStats.bytesReceived = e.bytesReceived, this.DataChannelStats.bytesSent = e.bytesSent, this.DataChannelStats.dataChannelIdentifier = e.dataChannelIdentifier, this.DataChannelStats.id = e.id, this.DataChannelStats.label = e.label, this.DataChannelStats.messagesReceived = e.messagesReceived, this.DataChannelStats.messagesSent = e.messagesSent, this.DataChannelStats.protocol = e.protocol, this.DataChannelStats.state = e.state, this.DataChannelStats.timestamp = e.timestamp;
  }
  handleLocalCandidate(e) {
    const t = new ot();
    t.label = "local-candidate", t.address = e.address, t.port = e.port, t.protocol = e.protocol, t.candidateType = e.candidateType, t.id = e.id, this.localCandidates.push(t);
  }
  handleRemoteCandidate(e) {
    const t = new ot();
    t.label = "local-candidate", t.address = e.address, t.port = e.port, t.protocol = e.protocol, t.id = e.id, t.candidateType = e.candidateType, this.remoteCandidates.push(t);
  }
  handleInBoundRTP(e) {
    switch (e.kind) {
      case "video":
        this.inboundVideoStats = e, this.lastVideoStats != null && (this.inboundVideoStats.bitrate = 8 * (this.inboundVideoStats.bytesReceived - this.lastVideoStats.bytesReceived) / (this.inboundVideoStats.timestamp - this.lastVideoStats.timestamp), this.inboundVideoStats.bitrate = Math.floor(this.inboundVideoStats.bitrate)), this.lastVideoStats = Object.assign({}, this.inboundVideoStats);
        break;
      case "audio":
        this.inboundAudioStats = e, this.lastAudioStats != null && (this.inboundAudioStats.bitrate = 8 * (this.inboundAudioStats.bytesReceived - this.lastAudioStats.bytesReceived) / (this.inboundAudioStats.timestamp - this.lastAudioStats.timestamp), this.inboundAudioStats.bitrate = Math.floor(this.inboundAudioStats.bitrate)), this.lastAudioStats = Object.assign({}, this.inboundAudioStats);
        break;
      default:
        l.Log(l.GetStackTrace(), "Kind is not handled");
    }
  }
  handleRemoteOutBound(e) {
    e.kind === "video" && (this.outBoundVideoStats.bytesSent = e.bytesSent, this.outBoundVideoStats.id = e.id, this.outBoundVideoStats.localId = e.localId, this.outBoundVideoStats.packetsSent = e.packetsSent, this.outBoundVideoStats.remoteTimestamp = e.remoteTimestamp, this.outBoundVideoStats.timestamp = e.timestamp);
  }
  handleTrack(e) {
    e.type !== "track" || e.trackIdentifier !== "video_label" && e.kind !== "video" || (this.inboundVideoStats.framesDropped = e.framesDropped, this.inboundVideoStats.framesReceived = e.framesReceived, this.inboundVideoStats.frameHeight = e.frameHeight, this.inboundVideoStats.frameWidth = e.frameWidth);
  }
  handleCodec(e) {
    const t = e.id, s = `${e.mimeType.replace("video/", "").replace("audio/", "")}${e.sdpFmtpLine ? ` ${e.sdpFmtpLine}` : ""}`;
    this.codecs.set(t, s);
  }
  handleSessionStatistics(e, t, s) {
    const n = Date.now() - e;
    this.sessionStats.runTime = new Date(n).toISOString().substr(11, 8).toString();
    const r = t === null ? "Not sent yet" : t ? "true" : "false";
    this.sessionStats.controlsStreamInput = r, this.sessionStats.videoEncoderAvgQP = s;
  }
  isNumber(e) {
    return typeof e == "number" && isFinite(e);
  }
};
const Pt = (kt = { parseRtpParameters: () => _e.parseRtpParameters, splitSections: () => _e.splitSections }, Ve = {}, Ue.d(Ve, kt), Ve);
var kt, Ve;
let Gs = class {
  static isVideoTransciever(e) {
    return this.canTransceiverReceiveVideo(e) || this.canTransceiverSendVideo(e);
  }
  static canTransceiverReceiveVideo(e) {
    return !!e && (e.direction === "sendrecv" || e.direction === "recvonly") && e.receiver && e.receiver.track && e.receiver.track.kind === "video";
  }
  static canTransceiverSendVideo(e) {
    return !!e && (e.direction === "sendrecv" || e.direction === "sendonly") && e.sender && e.sender.track && e.sender.track.kind === "video";
  }
  static isAudioTransciever(e) {
    return this.canTransceiverReceiveAudio(e) || this.canTransceiverSendAudio(e);
  }
  static canTransceiverReceiveAudio(e) {
    return !!e && (e.direction === "sendrecv" || e.direction === "recvonly") && e.receiver && e.receiver.track && e.receiver.track.kind === "audio";
  }
  static canTransceiverSendAudio(e) {
    return !!e && (e.direction === "sendrecv" || e.direction === "sendonly") && e.sender && e.sender.track && e.sender.track.kind === "audio";
  }
};
var $e = function(i, e, t, s) {
  return new (t || (t = Promise))(function(n, r) {
    function o(h) {
      try {
        d(s.next(h));
      } catch (u) {
        r(u);
      }
    }
    function a(h) {
      try {
        d(s.throw(h));
      } catch (u) {
        r(u);
      }
    }
    function d(h) {
      var u;
      h.done ? n(h.value) : (u = h.value, u instanceof t ? u : new t(function(S) {
        S(u);
      })).then(o, a);
    }
    d((s = s.apply(i, [])).next());
  });
};
let Mr = class {
  constructor(e, t, s) {
    this.config = t, this.createPeerConnection(e, s);
  }
  createPeerConnection(e, t) {
    this.config.isFlagEnabled(g.ForceTURN) && (e.iceTransportPolicy = "relay", l.Log(l.GetStackTrace(), "Forcing TURN usage by setting ICE Transport Policy in peer connection config.")), this.peerConnection = new RTCPeerConnection(e), this.peerConnection.onsignalingstatechange = (s) => this.handleSignalStateChange(s), this.peerConnection.oniceconnectionstatechange = (s) => this.handleIceConnectionStateChange(s), this.peerConnection.onicegatheringstatechange = (s) => this.handleIceGatheringStateChange(s), this.peerConnection.ontrack = (s) => this.handleOnTrack(s), this.peerConnection.onicecandidate = (s) => this.handleIceCandidate(s), this.peerConnection.ondatachannel = (s) => this.handleDataChannel(s), this.aggregatedStats = new Bs(), this.preferredCodec = t, this.updateCodecSelection = !0;
  }
  createOffer(e, t) {
    return $e(this, void 0, void 0, function* () {
      l.Log(l.GetStackTrace(), "Create Offer", 6);
      const s = location.hostname === "localhost" || location.hostname === "127.0.0.1", n = location.protocol === "https:";
      let r = t.isFlagEnabled(g.UseMic);
      !r || s || n || (r = !1, l.Error(l.GetStackTrace(), "Microphone access in the browser will not work if you are not on HTTPS or localhost. Disabling mic access."), l.Error(l.GetStackTrace(), "For testing you can enable HTTP microphone access Chrome by visiting chrome://flags/ and enabling 'unsafely-treat-insecure-origin-as-secure'")), this.setupTransceiversAsync(r).finally(() => {
        var o;
        (o = this.peerConnection) === null || o === void 0 || o.createOffer(e).then((a) => {
          var d;
          this.showTextOverlayConnecting(), a.sdp = this.mungeSDP(a.sdp, r), (d = this.peerConnection) === null || d === void 0 || d.setLocalDescription(a), this.onSendWebRTCOffer(a);
        }).catch(() => {
          this.showTextOverlaySetupFailure();
        });
      });
    });
  }
  receiveOffer(e, t) {
    var s;
    return $e(this, void 0, void 0, function* () {
      l.Log(l.GetStackTrace(), "Receive Offer", 6), (s = this.peerConnection) === null || s === void 0 || s.setRemoteDescription(e).then(() => {
        const n = location.hostname === "localhost" || location.hostname === "127.0.0.1", r = location.protocol === "https:";
        let o = t.isFlagEnabled(g.UseMic);
        !o || n || r || (o = !1, l.Error(l.GetStackTrace(), "Microphone access in the browser will not work if you are not on HTTPS or localhost. Disabling mic access."), l.Error(l.GetStackTrace(), "For testing you can enable HTTP microphone access Chrome by visiting chrome://flags/ and enabling 'unsafely-treat-insecure-origin-as-secure'")), this.setupTransceiversAsync(o).finally(() => {
          var a;
          (a = this.peerConnection) === null || a === void 0 || a.createAnswer().then((d) => {
            var h;
            return d.sdp = this.mungeSDP(d.sdp, o), (h = this.peerConnection) === null || h === void 0 ? void 0 : h.setLocalDescription(d);
          }).then(() => {
            var d;
            this.onSendWebRTCAnswer((d = this.peerConnection) === null || d === void 0 ? void 0 : d.currentLocalDescription);
          }).catch(() => {
            l.Error(l.GetStackTrace(), "createAnswer() failed");
          });
        });
      }), this.config.setOptionSettingOptions(L.PreferredCodec, this.parseAvailableCodecs(e).filter((n) => this.config.getSettingOption(L.PreferredCodec).options.includes(n)));
    });
  }
  receiveAnswer(e) {
    var t;
    (t = this.peerConnection) === null || t === void 0 || t.setRemoteDescription(e), this.config.setOptionSettingOptions(L.PreferredCodec, this.parseAvailableCodecs(e).filter((s) => this.config.getSettingOption(L.PreferredCodec).options.includes(s)));
  }
  generateStats() {
    var e;
    (e = this.peerConnection) === null || e === void 0 || e.getStats(null).then((t) => {
      this.aggregatedStats.processStats(t), this.onVideoStats(this.aggregatedStats), this.updateCodecSelection && this.config.setOptionSettingValue(L.PreferredCodec, this.aggregatedStats.codecs.get(this.aggregatedStats.inboundVideoStats.codecId));
    });
  }
  close() {
    this.peerConnection && (this.peerConnection.close(), this.peerConnection = null);
  }
  mungeSDP(e, t) {
    let s = e.replace(/(a=fmtp:\d+ .*level-asymmetry-allowed=.*)\r\n/gm, `$1;x-google-start-bitrate=10000;x-google-max-bitrate=100000\r
`), n = "maxaveragebitrate=510000;";
    return t && (n += "sprop-maxcapturerate=48000;"), n += this.config.isFlagEnabled(g.ForceMonoAudio) ? "stereo=0;" : "stereo=1;", n += "useinbandfec=1", s = s.replace("useinbandfec=1", n), s;
  }
  handleOnIce(e) {
    var t;
    l.Log(l.GetStackTrace(), "peerconnection handleOnIce", 6), this.config.isFlagEnabled(g.ForceTURN) && e.candidate.indexOf("relay") < 0 ? l.Info(l.GetStackTrace(), `Dropping candidate because it was not TURN relay. | Type= ${e.type} | Protocol= ${e.protocol} | Address=${e.address} | Port=${e.port} |`, 6) : (t = this.peerConnection) === null || t === void 0 || t.addIceCandidate(e);
  }
  handleSignalStateChange(e) {
    l.Log(l.GetStackTrace(), "signaling state change: " + e, 6);
  }
  handleIceConnectionStateChange(e) {
    l.Log(l.GetStackTrace(), "ice connection state change: " + e, 6), this.onIceConnectionStateChange(e);
  }
  handleIceGatheringStateChange(e) {
    l.Log(l.GetStackTrace(), "ice gathering state change: " + JSON.stringify(e), 6);
  }
  handleOnTrack(e) {
    this.onTrack(e);
  }
  handleIceCandidate(e) {
    this.onPeerIceCandidate(e);
  }
  handleDataChannel(e) {
    this.onDataChannel(e);
  }
  onTrack(e) {
  }
  onIceConnectionStateChange(e) {
  }
  onPeerIceCandidate(e) {
  }
  onDataChannel(e) {
  }
  setupTransceiversAsync(e) {
    var t, s, n, r, o, a, d, h, u;
    return $e(this, void 0, void 0, function* () {
      const S = ((t = this.peerConnection) === null || t === void 0 ? void 0 : t.getTransceivers().length) > 0;
      if ((s = this.peerConnection) === null || s === void 0 || s.addTransceiver("video", { direction: "recvonly" }), RTCRtpReceiver.getCapabilities && this.preferredCodec != "") {
        for (const p of (r = (n = this.peerConnection) === null || n === void 0 ? void 0 : n.getTransceivers()) !== null && r !== void 0 ? r : []) if (p && p.receiver && p.receiver.track && p.receiver.track.kind === "video" && p.setCodecPreferences) {
          const E = this.preferredCodec.split(" "), T = [{ mimeType: "video/" + E[0], clockRate: 9e4, sdpFmtpLine: E[1] ? E[1] : "" }];
          this.config.getSettingOption(L.PreferredCodec).options.filter((R) => R != this.preferredCodec).forEach((R) => {
            const P = R.split(" ");
            T.push({ mimeType: "video/" + P[0], clockRate: 9e4, sdpFmtpLine: P[1] ? P[1] : "" });
          });
          for (const R of T) R.sdpFmtpLine === "" && delete R.sdpFmtpLine;
          p.setCodecPreferences(T);
        }
      }
      if (e) {
        const p = { video: !1, audio: { autoGainControl: !1, channelCount: 1, echoCancellation: !1, latency: 0, noiseSuppression: !1, sampleRate: 48e3, sampleSize: 16, volume: 1 } }, E = yield navigator.mediaDevices.getUserMedia(p);
        if (E) if (S) {
          for (const T of (d = (a = this.peerConnection) === null || a === void 0 ? void 0 : a.getTransceivers()) !== null && d !== void 0 ? d : []) if (Gs.canTransceiverReceiveAudio(T)) for (const R of E.getTracks()) R.kind && R.kind == "audio" && (T.sender.replaceTrack(R), T.direction = "sendrecv");
        } else for (const T of E.getTracks()) T.kind && T.kind == "audio" && ((h = this.peerConnection) === null || h === void 0 || h.addTransceiver(T, { direction: "sendrecv" }));
        else (u = this.peerConnection) === null || u === void 0 || u.addTransceiver("audio", { direction: "recvonly" });
      } else (o = this.peerConnection) === null || o === void 0 || o.addTransceiver("audio", { direction: "recvonly" });
    });
  }
  onVideoStats(e) {
  }
  onSendWebRTCOffer(e) {
  }
  onSendWebRTCAnswer(e) {
  }
  showTextOverlayConnecting() {
  }
  showTextOverlaySetupFailure() {
  }
  parseAvailableCodecs(e) {
    if (!RTCRtpReceiver.getCapabilities) return ["Only available on Chrome"];
    const t = [], s = (0, Pt.splitSections)(e.sdp);
    return s.shift(), s.forEach((n) => {
      const { codecs: r } = (0, Pt.parseRtpParameters)(n), o = /(VP\d|H26\d|AV1).*/;
      r.forEach((a) => {
        const d = a.name + " " + Object.keys(a.parameters || {}).map((h) => h + "=" + a.parameters[h]).join(";");
        if (o.exec(d) !== null) {
          a.name == "VP9" && (a.parameters = { "profile-id": "0" });
          const h = a.name + " " + Object.keys(a.parameters || {}).map((u) => u + "=" + a.parameters[u]).join(";");
          t.push(h);
        }
      });
    }), t;
  }
}, Ns = class {
  constructor() {
    this.PixelStreamingSettings = new Rr(), this.EncoderSettings = new Hs(), this.WebRTCSettings = new Ws();
  }
  ueCompatible() {
    this.WebRTCSettings.MaxFPS != null && (this.WebRTCSettings.FPS = this.WebRTCSettings.MaxFPS);
  }
}, Rr = class {
}, Hs = class {
}, Ws = class {
}, Vs = class {
  constructor() {
    this.ReceiptTimeMs = null, this.TransmissionTimeMs = null, this.PreCaptureTimeMs = null, this.PostCaptureTimeMs = null, this.PreEncodeTimeMs = null, this.PostEncodeTimeMs = null, this.EncodeMs = null, this.CaptureToSendMs = null, this.testStartTimeMs = 0, this.browserReceiptTimeMs = 0, this.latencyExcludingDecode = 0, this.testDuration = 0, this.networkLatency = 0, this.browserSendLatency = 0, this.frameDisplayDeltaTimeMs = 0, this.endToEndLatency = 0, this.encodeLatency = 0;
  }
  setFrameDisplayDeltaTime(e) {
    this.frameDisplayDeltaTimeMs == 0 && (this.frameDisplayDeltaTimeMs = Math.round(e));
  }
  processFields() {
    this.EncodeMs != null || this.PreEncodeTimeMs == null && this.PostEncodeTimeMs == null || (l.Log(l.GetStackTrace(), `Setting Encode Ms 
 ${this.PostEncodeTimeMs} 
 ${this.PreEncodeTimeMs}`, 6), this.EncodeMs = this.PostEncodeTimeMs - this.PreEncodeTimeMs), this.CaptureToSendMs != null || this.PreCaptureTimeMs == null && this.PostCaptureTimeMs == null || (l.Log(l.GetStackTrace(), `Setting CaptureToSendMs Ms 
 ${this.PostCaptureTimeMs} 
 ${this.PreCaptureTimeMs}`, 6), this.CaptureToSendMs = this.PostCaptureTimeMs - this.PreCaptureTimeMs);
  }
}, Qe = class {
  static setExtensionFromBytes(e, t) {
    t.receiving || (t.mimetype = "", t.extension = "", t.receiving = !0, t.valid = !1, t.size = 0, t.data = [], t.timestampStart = (/* @__PURE__ */ new Date()).getTime(), l.Log(l.GetStackTrace(), "Received first chunk of file", 6));
    const s = new TextDecoder("utf-16").decode(e.slice(1));
    l.Log(l.GetStackTrace(), s, 6), t.extension = s;
  }
  static setMimeTypeFromBytes(e, t) {
    t.receiving || (t.mimetype = "", t.extension = "", t.receiving = !0, t.valid = !1, t.size = 0, t.data = [], t.timestampStart = (/* @__PURE__ */ new Date()).getTime(), l.Log(l.GetStackTrace(), "Received first chunk of file", 6));
    const s = new TextDecoder("utf-16").decode(e.slice(1));
    l.Log(l.GetStackTrace(), s, 6), t.mimetype = s;
  }
  static setContentsFromBytes(e, t) {
    if (!t.receiving) return;
    t.size = Math.ceil(new DataView(e.slice(1, 5).buffer).getInt32(0, !0) / 16379);
    const s = e.slice(5);
    if (t.data.push(s), l.Log(l.GetStackTrace(), `Received file chunk: ${t.data.length}/${t.size}`, 6), t.data.length === t.size) {
      t.receiving = !1, t.valid = !0, l.Log(l.GetStackTrace(), "Received complete file", 6);
      const n = (/* @__PURE__ */ new Date()).getTime() - t.timestampStart, r = Math.round(16 * t.size * 1024 / n);
      l.Log(l.GetStackTrace(), `Average transfer bitrate: ${r}kb/s over ${n / 1e3} seconds`, 6);
      const o = new Blob(t.data, { type: t.mimetype }), a = document.createElement("a");
      a.setAttribute("href", URL.createObjectURL(o)), a.setAttribute("download", `transfer.${t.extension}`), document.body.append(a), a.remove();
    } else t.data.length > t.size && (t.receiving = !1, l.Error(l.GetStackTrace(), `Received bigger file than advertised: ${t.data.length}/${t.size}`));
  }
}, Pr = class {
  constructor() {
    this.mimetype = "", this.extension = "", this.receiving = !1, this.size = 0, this.data = [], this.valid = !1;
  }
}, F = class {
};
F.mainButton = 0, F.auxiliaryButton = 1, F.secondaryButton = 2, F.fourthButton = 3, F.fifthButton = 4;
let G = class {
};
G.primaryButton = 1, G.secondaryButton = 2, G.auxiliaryButton = 4, G.fourthButton = 8, G.fifthButton = 16;
let de = class {
  constructor() {
    this.unregisterCallbacks = [];
  }
  addUnregisterCallback(e) {
    this.unregisterCallbacks.push(e);
  }
  unregisterAll() {
    for (const e of this.unregisterCallbacks) e();
    this.unregisterCallbacks = [];
  }
}, kr = class {
  constructor(e, t, s) {
    this.fakeDownButton = 0, this.lastPinchDistance = 0, this.touchEventListenerTracker = new de(), this.toStreamerMessagesProvider = e, this.videoElementProvider = t, this.coordinateConverter = s;
    const n = (a) => this.onTouchStart(a), r = (a) => this.onTouchEnd(a), o = (a) => this.onTouchMove(a);
    document.addEventListener("touchstart", n, { passive: !1 }), document.addEventListener("touchend", r, { passive: !1 }), document.addEventListener("touchmove", o, { passive: !1 }), this.touchEventListenerTracker.addUnregisterCallback(() => document.removeEventListener("touchstart", n)), this.touchEventListenerTracker.addUnregisterCallback(() => document.removeEventListener("touchend", r)), this.touchEventListenerTracker.addUnregisterCallback(() => document.removeEventListener("touchmove", o));
  }
  unregisterTouchEvents() {
    this.touchEventListenerTracker.unregisterAll();
  }
  setVideoElementParentClientRect(e) {
    this.videoElementParentClientRect = e;
  }
  onTouchStart(e) {
    if (this.videoElementProvider.isVideoReady() && e.target === this.videoElementProvider.getVideoElement()) {
      if (l.Log(l.GetStackTrace(), `touch start ${this.fakeTouchFinger} ${this.fakeDownButton}`), this.fakeTouchFinger == null) {
        const t = e.changedTouches[0];
        this.fakeTouchFinger = new xr(t.identifier, t.clientX - this.videoElementParentClientRect.left, t.clientY - this.videoElementParentClientRect.top);
        const s = this.videoElementProvider.getVideoParentElement(), n = new MouseEvent("mouseenter", t);
        s.dispatchEvent(n);
        const r = this.coordinateConverter.normalizeAndQuantizeUnsigned(this.fakeTouchFinger.x, this.fakeTouchFinger.y), o = e.touches && e.touches.length > 1;
        this.fakeDownButton = o ? F.secondaryButton : F.mainButton, this.toStreamerMessagesProvider.toStreamerHandlers.get("MouseDown")([this.fakeDownButton, r.x, r.y]);
      }
      e.preventDefault();
    }
  }
  onTouchEnd(e) {
    if (!this.videoElementProvider.isVideoReady() || e.target !== this.videoElementProvider.getVideoElement()) return;
    l.Log(l.GetStackTrace(), `touch end ${this.fakeTouchFinger} ${this.fakeDownButton}`);
    const t = this.videoElementProvider.getVideoParentElement(), s = this.toStreamerMessagesProvider.toStreamerHandlers, n = e.touches && e.touches.length > 1;
    this.fakeDownButton = n ? F.secondaryButton : F.mainButton;
    for (let r = 0; r < e.changedTouches.length; r++) {
      const o = e.changedTouches[r];
      if (this.fakeTouchFinger && o.identifier === this.fakeTouchFinger.id) {
        const a = o.clientX - this.videoElementParentClientRect.left, d = o.clientY - this.videoElementParentClientRect.top, h = this.coordinateConverter.normalizeAndQuantizeUnsigned(a, d);
        s.get("MouseUp")([this.fakeDownButton, h.x, h.y]);
        const u = new MouseEvent("mouseleave", o);
        t.dispatchEvent(u), this.fakeTouchFinger = null;
        break;
      }
    }
    e.preventDefault();
  }
  onTouchMove(e) {
    if (!this.videoElementProvider.isVideoReady() || e.target !== this.videoElementProvider.getVideoElement()) return;
    l.Log(l.GetStackTrace(), `touch move ${this.fakeTouchFinger} ${this.fakeDownButton} ${JSON.stringify(e.touches)}`);
    const t = this.toStreamerMessagesProvider.toStreamerHandlers, s = e.touches && e.touches.length > 1 ? F.secondaryButton : F.mainButton, n = e.touches.length === 2;
    let r = 0, o = () => r;
    if (n) {
      const a = e.touches[0], d = e.touches[1], h = Math.sqrt(Math.pow(a.clientX - d.clientX, 2) + Math.pow(a.clientY - d.clientY, 2));
      r = h - this.lastPinchDistance, o = () => (this.lastPinchDistance = h, r);
    }
    for (let a = 0; a < e.touches.length; a++) {
      const d = e.touches[a];
      if (this.fakeTouchFinger && d.identifier === this.fakeTouchFinger.id) {
        const h = d.clientX - this.videoElementParentClientRect.left, u = d.clientY - this.videoElementParentClientRect.top, S = this.coordinateConverter.normalizeAndQuantizeUnsigned(h, u), p = this.coordinateConverter.normalizeAndQuantizeSigned(h - this.fakeTouchFinger.x, u - this.fakeTouchFinger.y);
        this.fakeDownButton !== s ? (t.get("MouseUp")([this.fakeDownButton, S.x, S.y]), t.get("MouseDown")([s, S.x, S.y]), this.fakeDownButton = s) : n && Math.abs(r) > 0.1 * window.devicePixelRatio ? t.get("MouseWheel")([r, S.x, S.y]) : t.get("MouseMove")([S.x, S.y, p.x, p.y]), this.fakeTouchFinger.x = h, this.fakeTouchFinger.y = u;
        break;
      }
    }
    o(), e.preventDefault();
  }
}, xr = class {
  constructor(e, t, s) {
    this.id = e, this.x = t, this.y = s;
  }
}, H = class {
};
H.backSpace = 8, H.shift = 16, H.control = 17, H.alt = 18, H.rightShift = 253, H.rightControl = 254, H.rightAlt = 255;
const xt = { Escape: 27, Digit0: 48, Digit1: 49, Digit2: 50, Digit3: 51, Digit4: 52, Digit5: 53, Digit6: 54, Digit7: 55, Digit8: 56, Digit9: 57, Minus: 173, Equal: 187, Backspace: 8, Tab: 9, KeyQ: 81, KeyW: 87, KeyE: 69, KeyR: 82, KeyT: 84, KeyY: 89, KeyU: 85, KeyI: 73, KeyO: 79, KeyP: 80, BracketLeft: 219, BracketRight: 221, Enter: 13, ControlLeft: 17, KeyA: 65, KeyS: 83, KeyD: 68, KeyF: 70, KeyG: 71, KeyH: 72, KeyJ: 74, KeyK: 75, KeyL: 76, Semicolon: 186, Quote: 222, Backquote: 192, ShiftLeft: 16, Backslash: 220, KeyZ: 90, KeyX: 88, KeyC: 67, KeyV: 86, KeyB: 66, KeyN: 78, KeyM: 77, Comma: 188, Period: 190, Slash: 191, ShiftRight: 253, AltLeft: 18, Space: 32, CapsLock: 20, F1: 112, F2: 113, F3: 114, F4: 115, F5: 116, F6: 117, F7: 118, F8: 119, F9: 120, F10: 121, F11: 122, F12: 123, Pause: 19, ScrollLock: 145, NumpadDivide: 111, NumpadMultiply: 106, NumpadSubtract: 109, NumpadAdd: 107, NumpadDecimal: 110, Numpad9: 105, Numpad8: 104, Numpad7: 103, Numpad6: 102, Numpad5: 101, Numpad4: 100, Numpad3: 99, Numpad2: 98, Numpad1: 97, Numpad0: 96, NumLock: 144, ControlRight: 254, AltRight: 255, Home: 36, End: 35, ArrowUp: 38, ArrowLeft: 37, ArrowRight: 39, ArrowDown: 40, PageUp: 33, PageDown: 34, Insert: 45, Delete: 46, ContextMenu: 93 };
let Lr = class {
  constructor(e, t, s) {
    this.keyboardEventListenerTracker = new de(), this.ignoreKeys = new Set(["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "ControlLeft", "ControlRight", "ShiftLeft", "ShiftRight", "CapsLock"].map((n) => xt[n])), this.CodeToKeyCode = xt, this.toStreamerMessagesProvider = e, this.config = t, this.activeKeysProvider = s;
  }
  registerKeyBoardEvents() {
    const e = (n) => this.handleOnKeyDown(n), t = (n) => this.handleOnKeyUp(n), s = (n) => this.handleOnKeyPress(n);
    document.addEventListener("keydown", e), document.addEventListener("keyup", t), document.addEventListener("keypress", s), this.keyboardEventListenerTracker.addUnregisterCallback(() => document.removeEventListener("keydown", e)), this.keyboardEventListenerTracker.addUnregisterCallback(() => document.removeEventListener("keyup", t)), this.keyboardEventListenerTracker.addUnregisterCallback(() => document.removeEventListener("keypress", s));
  }
  unregisterKeyBoardEvents() {
    this.keyboardEventListenerTracker.unregisterAll();
  }
  handleOnKeyDown(e) {
    const t = this.getKeycode(e);
    t && (console.log(t, JSON.stringify(Array.from(this.ignoreKeys))), this.ignoreKeys.has(t) || (l.Log(l.GetStackTrace(), `key down ${t}, repeat = ${e.repeat}`, 6), this.toStreamerMessagesProvider.toStreamerHandlers.get("KeyDown")([this.getKeycode(e), e.repeat ? 1 : 0]), this.activeKeysProvider.getActiveKeys().push(t), t === H.backSpace && document.dispatchEvent(new KeyboardEvent("keypress", { charCode: H.backSpace })), this.config.isFlagEnabled(g.SuppressBrowserKeys) && this.isKeyCodeBrowserKey(t) && e.preventDefault()));
  }
  handleOnKeyUp(e) {
    const t = this.getKeycode(e);
    t && (this.ignoreKeys.has(t) || (l.Log(l.GetStackTrace(), `key up ${t}`, 6), this.toStreamerMessagesProvider.toStreamerHandlers.get("KeyUp")([t]), this.config.isFlagEnabled(g.SuppressBrowserKeys) && this.isKeyCodeBrowserKey(t) && e.preventDefault()));
  }
  handleOnKeyPress(e) {
    if (!("charCode" in e)) return void l.Warning(l.GetStackTrace(), "KeyboardEvent.charCode is deprecated in this browser, cannot send key press.");
    const t = e.charCode;
    l.Log(l.GetStackTrace(), `key press ${t}`, 6), this.ignoreKeys.has(t) || this.toStreamerMessagesProvider.toStreamerHandlers.get("KeyPress")([t]);
  }
  getKeycode(e) {
    if (!("keyCode" in e)) {
      const t = e;
      return t.code in this.CodeToKeyCode ? this.CodeToKeyCode[t.code] : (l.Warning(l.GetStackTrace(), `Keyboard code of ${t.code} is not supported in our mapping, ignoring this key.`), null);
    }
    return e.keyCode === H.shift && e.code === "ShiftRight" ? H.rightShift : e.keyCode === H.control && e.code === "ControlRight" ? H.rightControl : e.keyCode === H.alt && e.code === "AltRight" ? H.rightAlt : e.keyCode;
  }
  isKeyCodeBrowserKey(e) {
    return e >= 112 && e <= 123 || e === 9;
  }
}, Fr = class {
  constructor(e, t, s) {
    this.x = 0, this.y = 0, this.updateMouseMovePositionEvent = (r) => {
      this.updateMouseMovePosition(r);
    }, this.mouseEventListenerTracker = new de(), this.videoElementProvider = e, this.mouseController = t, this.activeKeysProvider = s;
    const n = this.videoElementProvider.getVideoParentElement();
    this.x = n.getBoundingClientRect().width / 2, this.y = n.getBoundingClientRect().height / 2, this.coord = this.mouseController.coordinateConverter.normalizeAndQuantizeUnsigned(this.x, this.y);
  }
  unregisterMouseEvents() {
    this.mouseEventListenerTracker.unregisterAll();
  }
  lockStateChange() {
    const e = this.videoElementProvider.getVideoParentElement(), t = this.mouseController.toStreamerMessagesProvider.toStreamerHandlers;
    if (document.pointerLockElement === e || document.mozPointerLockElement === e) l.Log(l.GetStackTrace(), "Pointer locked", 6), document.addEventListener("mousemove", this.updateMouseMovePositionEvent, !1), this.mouseEventListenerTracker.addUnregisterCallback(() => document.removeEventListener("mousemove", this.updateMouseMovePositionEvent, !1));
    else {
      l.Log(l.GetStackTrace(), "The pointer lock status is now unlocked", 6), document.removeEventListener("mousemove", this.updateMouseMovePositionEvent, !1);
      let s = this.activeKeysProvider.getActiveKeys();
      const n = new Set(s), r = [];
      n.forEach((o) => {
      }), r.forEach((o) => {
        t.get("KeyUp")([o]);
      }), s = [];
    }
  }
  updateMouseMovePosition(e) {
    if (!this.videoElementProvider.isVideoReady()) return;
    const t = this.mouseController.toStreamerMessagesProvider.toStreamerHandlers, s = this.videoElementProvider.getVideoParentElement().clientWidth, n = this.videoElementProvider.getVideoParentElement().clientHeight;
    this.x += e.movementX, this.y += e.movementY, this.x > s && (this.x -= s), this.y > n && (this.y -= n), this.x < 0 && (this.x = s + this.x), this.y < 0 && (this.y = n - this.y), this.coord = this.mouseController.coordinateConverter.normalizeAndQuantizeUnsigned(this.x, this.y);
    const r = this.mouseController.coordinateConverter.normalizeAndQuantizeSigned(e.movementX, e.movementY);
    t.get("MouseMove")([this.coord.x, this.coord.y, r.x, r.y]);
  }
  handleMouseDown(e) {
    this.videoElementProvider.isVideoReady() && this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get("MouseDown")([e.button, this.coord.x, this.coord.y]);
  }
  handleMouseUp(e) {
    this.videoElementProvider.isVideoReady() && this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get("MouseUp")([e.button, this.coord.x, this.coord.y]);
  }
  handleMouseWheel(e) {
    this.videoElementProvider.isVideoReady() && this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get("MouseWheel")([-e.deltaY, this.coord.x, this.coord.y]);
  }
  handleMouseDouble(e) {
    this.videoElementProvider.isVideoReady() && this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get("MouseDouble")([e.button, this.coord.x, this.coord.y]);
  }
  handlePressMouseButtons(e) {
    this.videoElementProvider.isVideoReady() && this.mouseController.pressMouseButtons(e.buttons, this.x, this.y);
  }
  handleReleaseMouseButtons(e) {
    this.videoElementProvider.isVideoReady() && this.mouseController.releaseMouseButtons(e.buttons, this.x, this.y);
  }
}, Ar = class {
  constructor(e) {
    this.mouseController = e;
  }
  unregisterMouseEvents() {
  }
  updateMouseMovePosition(e) {
    if (!this.mouseController.videoElementProvider.isVideoReady()) return;
    l.Log(l.GetStackTrace(), "MouseMove", 6);
    const t = this.mouseController.coordinateConverter.normalizeAndQuantizeUnsigned(e.offsetX, e.offsetY), s = this.mouseController.coordinateConverter.normalizeAndQuantizeSigned(e.movementX, e.movementY);
    this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get("MouseMove")([t.x, t.y, s.x, s.y]), e.preventDefault();
  }
  handleMouseDown(e) {
    if (!this.mouseController.videoElementProvider.isVideoReady()) return;
    l.Log(l.GetStackTrace(), "onMouse Down", 6);
    const t = this.mouseController.coordinateConverter.normalizeAndQuantizeUnsigned(e.offsetX, e.offsetY);
    this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get("MouseDown")([e.button, t.x, t.y]), e.preventDefault();
  }
  handleMouseUp(e) {
    if (!this.mouseController.videoElementProvider.isVideoReady()) return;
    l.Log(l.GetStackTrace(), "onMouse Up", 6);
    const t = this.mouseController.coordinateConverter.normalizeAndQuantizeUnsigned(e.offsetX, e.offsetY);
    this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get("MouseUp")([e.button, t.x, t.y]), e.preventDefault();
  }
  handleContextMenu(e) {
    this.mouseController.videoElementProvider.isVideoReady() && e.preventDefault();
  }
  handleMouseWheel(e) {
    if (!this.mouseController.videoElementProvider.isVideoReady()) return;
    const t = this.mouseController.coordinateConverter.normalizeAndQuantizeUnsigned(e.offsetX, e.offsetY);
    this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get("MouseWheel")([-e.deltaY, t.x, t.y]), e.preventDefault();
  }
  handleMouseDouble(e) {
    if (!this.mouseController.videoElementProvider.isVideoReady()) return;
    const t = this.mouseController.coordinateConverter.normalizeAndQuantizeUnsigned(e.offsetX, e.offsetY);
    this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get("MouseDouble")([e.button, t.x, t.y]);
  }
  handlePressMouseButtons(e) {
    this.mouseController.videoElementProvider.isVideoReady() && (l.Log(l.GetStackTrace(), "onMouse press", 6), this.mouseController.pressMouseButtons(e.buttons, e.offsetX, e.offsetY));
  }
  handleReleaseMouseButtons(e) {
    this.mouseController.videoElementProvider.isVideoReady() && (l.Log(l.GetStackTrace(), "onMouse release", 6), this.mouseController.releaseMouseButtons(e.buttons, e.offsetX, e.offsetY));
  }
}, Or = class {
  constructor(e, t, s, n) {
    this.mouseEventListenerTracker = new de(), this.toStreamerMessagesProvider = e, this.coordinateConverter = s, this.videoElementProvider = t, this.activeKeysProvider = n, this.registerMouseEnterAndLeaveEvents();
  }
  unregisterMouseEvents() {
    this.mouseEventListenerTracker.unregisterAll();
  }
  registerLockedMouseEvents(e) {
    const t = this.videoElementProvider.getVideoParentElement(), s = new Fr(this.videoElementProvider, e, this.activeKeysProvider);
    if (t.requestPointerLock = t.requestPointerLock || t.mozRequestPointerLock, document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock, t.requestPointerLock) {
      const h = () => {
        t.requestPointerLock();
      };
      t.addEventListener("click", h), this.mouseEventListenerTracker.addUnregisterCallback(() => t.removeEventListener("click", h));
    }
    const n = () => s.lockStateChange();
    document.addEventListener("pointerlockchange", n, !1), document.addEventListener("mozpointerlockchange", n, !1), this.mouseEventListenerTracker.addUnregisterCallback(() => document.removeEventListener("pointerlockchange", n, !1)), this.mouseEventListenerTracker.addUnregisterCallback(() => document.removeEventListener("mozpointerlockchange", n, !1));
    const r = (h) => s.handleMouseDown(h), o = (h) => s.handleMouseUp(h), a = (h) => s.handleMouseWheel(h), d = (h) => s.handleMouseDouble(h);
    t.addEventListener("mousedown", r), t.addEventListener("mouseup", o), t.addEventListener("wheel", a), t.addEventListener("dblclick", d), this.mouseEventListenerTracker.addUnregisterCallback(() => t.removeEventListener("mousedown", r)), this.mouseEventListenerTracker.addUnregisterCallback(() => t.removeEventListener("mouseup", o)), this.mouseEventListenerTracker.addUnregisterCallback(() => t.removeEventListener("wheel", a)), this.mouseEventListenerTracker.addUnregisterCallback(() => t.removeEventListener("dblclick", d)), this.mouseEventListenerTracker.addUnregisterCallback(() => s.unregisterMouseEvents()), this.mouseEventListenerTracker.addUnregisterCallback(() => {
      !document.exitPointerLock || document.pointerLockElement !== t && document.mozPointerLockElement !== t || document.exitPointerLock();
    });
  }
  registerHoveringMouseEvents(e) {
    const t = this.videoElementProvider.getVideoParentElement(), s = new Ar(e), n = (u) => s.updateMouseMovePosition(u), r = (u) => s.handleMouseDown(u), o = (u) => s.handleMouseUp(u), a = (u) => s.handleContextMenu(u), d = (u) => s.handleMouseWheel(u), h = (u) => s.handleMouseDouble(u);
    t.addEventListener("mousemove", n), t.addEventListener("mousedown", r), t.addEventListener("mouseup", o), t.addEventListener("contextmenu", a), t.addEventListener("wheel", d), t.addEventListener("dblclick", h), this.mouseEventListenerTracker.addUnregisterCallback(() => t.removeEventListener("mousemove", n)), this.mouseEventListenerTracker.addUnregisterCallback(() => t.removeEventListener("mousedown", r)), this.mouseEventListenerTracker.addUnregisterCallback(() => t.removeEventListener("mouseup", o)), this.mouseEventListenerTracker.addUnregisterCallback(() => t.removeEventListener("contextmenu", a)), this.mouseEventListenerTracker.addUnregisterCallback(() => t.removeEventListener("wheel", d)), this.mouseEventListenerTracker.addUnregisterCallback(() => t.removeEventListener("dblclick", h)), this.mouseEventListenerTracker.addUnregisterCallback(() => s.unregisterMouseEvents());
  }
  registerMouseEnterAndLeaveEvents() {
    const e = this.videoElementProvider.getVideoParentElement(), t = (n) => {
      this.videoElementProvider.isVideoReady() && (l.Log(l.GetStackTrace(), "Mouse Entered", 6), this.sendMouseEnter(), this.pressMouseButtons(n.buttons, n.x, n.y));
    }, s = (n) => {
      this.videoElementProvider.isVideoReady() && (l.Log(l.GetStackTrace(), "Mouse Left", 6), this.sendMouseLeave(), this.releaseMouseButtons(n.buttons, n.x, n.y));
    };
    e.addEventListener("mouseenter", t), e.addEventListener("mouseleave", s), this.mouseEventListenerTracker.addUnregisterCallback(() => e.removeEventListener("mouseenter", t)), this.mouseEventListenerTracker.addUnregisterCallback(() => e.removeEventListener("mouseleave", s));
  }
  releaseMouseButtons(e, t, s) {
    const n = this.coordinateConverter.normalizeAndQuantizeUnsigned(t, s);
    e & G.primaryButton && this.sendMouseUp(F.mainButton, n.x, n.y), e & G.secondaryButton && this.sendMouseUp(F.secondaryButton, n.x, n.y), e & G.auxiliaryButton && this.sendMouseUp(F.auxiliaryButton, n.x, n.y), e & G.fourthButton && this.sendMouseUp(F.fourthButton, n.x, n.y), e & G.fifthButton && this.sendMouseUp(F.fifthButton, n.x, n.y);
  }
  pressMouseButtons(e, t, s) {
    if (!this.videoElementProvider.isVideoReady()) return;
    const n = this.coordinateConverter.normalizeAndQuantizeUnsigned(t, s);
    e & G.primaryButton && this.sendMouseDown(F.mainButton, n.x, n.y), e & G.secondaryButton && this.sendMouseDown(F.secondaryButton, n.x, n.y), e & G.auxiliaryButton && this.sendMouseDown(F.auxiliaryButton, n.x, n.y), e & G.fourthButton && this.sendMouseDown(F.fourthButton, n.x, n.y), e & G.fifthButton && this.sendMouseDown(F.fifthButton, n.x, n.y);
  }
  sendMouseEnter() {
    this.videoElementProvider.isVideoReady() && this.toStreamerMessagesProvider.toStreamerHandlers.get("MouseEnter")();
  }
  sendMouseLeave() {
    this.videoElementProvider.isVideoReady() && this.toStreamerMessagesProvider.toStreamerHandlers.get("MouseLeave")();
  }
  sendMouseDown(e, t, s) {
    this.videoElementProvider.isVideoReady() && (l.Log(l.GetStackTrace(), `mouse button ${e} down at (${t}, ${s})`, 6), this.toStreamerMessagesProvider.toStreamerHandlers.get("MouseDown")([e, t, s]));
  }
  sendMouseUp(e, t, s) {
    if (!this.videoElementProvider.isVideoReady()) return;
    l.Log(l.GetStackTrace(), `mouse button ${e} up at (${t}, ${s})`, 6);
    const n = this.coordinateConverter.normalizeAndQuantizeUnsigned(t, s);
    this.toStreamerMessagesProvider.toStreamerHandlers.get("MouseUp")([e, n.x, n.y]);
  }
}, Ir = class {
  constructor(e, t, s) {
    this.fingers = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0], this.fingerIds = /* @__PURE__ */ new Map(), this.maxByteValue = 255, this.touchEventListenerTracker = new de(), this.toStreamerMessagesProvider = e, this.videoElementProvider = t, this.coordinateConverter = s, this.videoElementParent = t.getVideoElement();
    const n = (d) => this.onTouchStart(d), r = (d) => this.onTouchEnd(d), o = (d) => this.onTouchMove(d);
    this.videoElementParent.addEventListener("touchstart", n), this.videoElementParent.addEventListener("touchend", r), this.videoElementParent.addEventListener("touchmove", o), this.touchEventListenerTracker.addUnregisterCallback(() => this.videoElementParent.removeEventListener("touchstart", n)), this.touchEventListenerTracker.addUnregisterCallback(() => this.videoElementParent.removeEventListener("touchend", r)), this.touchEventListenerTracker.addUnregisterCallback(() => this.videoElementParent.removeEventListener("touchmove", o)), l.Log(l.GetStackTrace(), "Touch Events Registered", 6);
    const a = (d) => {
      d.preventDefault();
    };
    document.addEventListener("touchmove", a, { passive: !1 }), this.touchEventListenerTracker.addUnregisterCallback(() => document.removeEventListener("touchmove", a));
  }
  unregisterTouchEvents() {
    this.touchEventListenerTracker.unregisterAll();
  }
  rememberTouch(e) {
    const t = this.fingers.pop();
    t === void 0 && l.Log(l.GetStackTrace(), "exhausted touch identifiers", 6), this.fingerIds.set(e.identifier, t);
  }
  forgetTouch(e) {
    this.fingers.push(this.fingerIds.get(e.identifier)), this.fingers.sort(function(t, s) {
      return s - t;
    }), this.fingerIds.delete(e.identifier);
  }
  onTouchStart(e) {
    if (this.videoElementProvider.isVideoReady()) {
      for (let t = 0; t < e.changedTouches.length; t++) this.rememberTouch(e.changedTouches[t]);
      l.Log(l.GetStackTrace(), "touch start", 6), this.emitTouchData("TouchStart", e.changedTouches), e.preventDefault();
    }
  }
  onTouchEnd(e) {
    if (this.videoElementProvider.isVideoReady()) {
      l.Log(l.GetStackTrace(), "touch end", 6), this.emitTouchData("TouchEnd", e.changedTouches);
      for (let t = 0; t < e.changedTouches.length; t++) this.forgetTouch(e.changedTouches[t]);
      e.preventDefault();
    }
  }
  onTouchMove(e) {
    this.videoElementProvider.isVideoReady() && (l.Log(l.GetStackTrace(), "touch move", 6), this.emitTouchData("TouchMove", e.touches), e.preventDefault());
  }
  emitTouchData(e, t) {
    if (!this.videoElementProvider.isVideoReady()) return;
    const s = this.videoElementProvider.getVideoParentElement().getBoundingClientRect(), n = this.toStreamerMessagesProvider.toStreamerHandlers;
    for (let r = 0; r < t.length; r++) {
      const a = t[r], d = a.clientX - s.left, h = a.clientY - s.top;
      l.Log(l.GetStackTrace(), `F${this.fingerIds.get(a.identifier)}=(${d}, ${h})`, 6);
      const u = this.coordinateConverter.normalizeAndQuantizeUnsigned(d, h);
      switch (e) {
        case "TouchStart":
          n.get("TouchStart")([1, u.x, u.y, this.fingerIds.get(a.identifier), this.maxByteValue * (a.force > 0 ? a.force : 1), u.inRange ? 1 : 0]);
          break;
        case "TouchEnd":
          n.get("TouchEnd")([1, u.x, u.y, this.fingerIds.get(a.identifier), this.maxByteValue * (a.force > 0 ? a.force : 1), u.inRange ? 1 : 0]);
          break;
        case "TouchMove":
          n.get("TouchMove")([1, u.x, u.y, this.fingerIds.get(a.identifier), this.maxByteValue * a.force, u.inRange ? 1 : 0]);
      }
    }
  }
}, Dr = class {
  constructor(e) {
    this.gamePadEventListenerTracker = new de(), this.toStreamerMessagesProvider = e, this.requestAnimationFrame = (window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.requestAnimationFrame).bind(window);
    const t = window;
    if ("GamepadEvent" in t) {
      const s = (r) => this.gamePadConnectHandler(r), n = (r) => this.gamePadDisconnectHandler(r);
      window.addEventListener("gamepadconnected", s), window.addEventListener("gamepaddisconnected", n), this.gamePadEventListenerTracker.addUnregisterCallback(() => window.removeEventListener("gamepadconnected", s)), this.gamePadEventListenerTracker.addUnregisterCallback(() => window.removeEventListener("gamepaddisconnected", n));
    } else if ("WebKitGamepadEvent" in t) {
      const s = (r) => this.gamePadConnectHandler(r), n = (r) => this.gamePadDisconnectHandler(r);
      window.addEventListener("webkitgamepadconnected", s), window.addEventListener("webkitgamepaddisconnected", n), this.gamePadEventListenerTracker.addUnregisterCallback(() => window.removeEventListener("webkitgamepadconnected", s)), this.gamePadEventListenerTracker.addUnregisterCallback(() => window.removeEventListener("webkitgamepaddisconnected", n));
    }
    if (this.controllers = [], navigator.getGamepads) for (const s of navigator.getGamepads()) s && this.gamePadConnectHandler(new GamepadEvent("gamepadconnected", { gamepad: s }));
  }
  unregisterGamePadEvents() {
    this.gamePadEventListenerTracker.unregisterAll();
    for (const e of this.controllers) e.id !== void 0 && this.onGamepadDisconnected(e.id);
    this.controllers = [], this.onGamepadConnected = () => {
    }, this.onGamepadDisconnected = () => {
    };
  }
  gamePadConnectHandler(e) {
    l.Log(l.GetStackTrace(), "Gamepad connect handler", 6);
    const t = e.gamepad, s = { currentState: t, prevState: t, id: void 0 };
    this.controllers.push(s), this.controllers[t.index].currentState = t, this.controllers[t.index].prevState = t, l.Log(l.GetStackTrace(), "gamepad: " + t.id + " connected", 6), window.requestAnimationFrame(() => this.updateStatus()), this.onGamepadConnected();
  }
  gamePadDisconnectHandler(e) {
    l.Log(l.GetStackTrace(), "Gamepad disconnect handler", 6), l.Log(l.GetStackTrace(), "gamepad: " + e.gamepad.id + " disconnected", 6);
    const t = this.controllers[e.gamepad.index];
    delete this.controllers[e.gamepad.index], this.controllers = this.controllers.filter((s) => s !== void 0), this.onGamepadDisconnected(t.id);
  }
  scanGamePads() {
    const e = navigator.getGamepads ? navigator.getGamepads() : navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : [];
    for (let t = 0; t < e.length; t++) e[t] && e[t].index in this.controllers && (this.controllers[e[t].index].currentState = e[t]);
  }
  updateStatus() {
    this.scanGamePads();
    const e = this.toStreamerMessagesProvider.toStreamerHandlers;
    for (const t of this.controllers) {
      const s = t.id === void 0 ? this.controllers.indexOf(t) : t.id, n = t.currentState;
      for (let r = 0; r < t.currentState.buttons.length; r++) {
        const o = t.currentState.buttons[r], a = t.prevState.buttons[r];
        o.pressed ? r == oe.LeftTrigger ? e.get("GamepadAnalog")([s, 5, o.value]) : r == oe.RightTrigger ? e.get("GamepadAnalog")([s, 6, o.value]) : e.get("GamepadButtonPressed")([s, r, a.pressed ? 1 : 0]) : !o.pressed && a.pressed && (r == oe.LeftTrigger ? e.get("GamepadAnalog")([s, 5, 0]) : r == oe.RightTrigger ? e.get("GamepadAnalog")([s, 6, 0]) : e.get("GamepadButtonReleased")([s, r]));
      }
      for (let r = 0; r < n.axes.length; r += 2) {
        const o = parseFloat(n.axes[r].toFixed(4)), a = -parseFloat(n.axes[r + 1].toFixed(4));
        e.get("GamepadAnalog")([s, r + 1, o]), e.get("GamepadAnalog")([s, r + 2, a]);
      }
      this.controllers[s].prevState = n;
    }
    this.controllers.length > 0 && this.requestAnimationFrame(() => this.updateStatus());
  }
  onGamepadResponseReceived(e) {
    for (const t of this.controllers) if (t.id === void 0) {
      t.id = e;
      break;
    }
  }
  onGamepadConnected() {
  }
  onGamepadDisconnected(e) {
  }
};
var oe, C;
(function(i) {
  i[i.RightClusterBottomButton = 0] = "RightClusterBottomButton", i[i.RightClusterRightButton = 1] = "RightClusterRightButton", i[i.RightClusterLeftButton = 2] = "RightClusterLeftButton", i[i.RightClusterTopButton = 3] = "RightClusterTopButton", i[i.LeftShoulder = 4] = "LeftShoulder", i[i.RightShoulder = 5] = "RightShoulder", i[i.LeftTrigger = 6] = "LeftTrigger", i[i.RightTrigger = 7] = "RightTrigger", i[i.SelectOrBack = 8] = "SelectOrBack", i[i.StartOrForward = 9] = "StartOrForward", i[i.LeftAnalogPress = 10] = "LeftAnalogPress", i[i.RightAnalogPress = 11] = "RightAnalogPress", i[i.LeftClusterTopButton = 12] = "LeftClusterTopButton", i[i.LeftClusterBottomButton = 13] = "LeftClusterBottomButton", i[i.LeftClusterLeftButton = 14] = "LeftClusterLeftButton", i[i.LeftClusterRightButton = 15] = "LeftClusterRightButton", i[i.CentreButton = 16] = "CentreButton", i[i.LeftStickHorizontal = 0] = "LeftStickHorizontal", i[i.LeftStickVertical = 1] = "LeftStickVertical", i[i.RightStickHorizontal = 2] = "RightStickHorizontal", i[i.RightStickVertical = 3] = "RightStickVertical";
})(oe || (oe = {}));
let _r = class {
  constructor(e, t, s) {
    this.activeKeys = new Ur(), this.toStreamerMessagesProvider = e, this.videoElementProvider = t, this.coordinateConverter = s;
  }
  registerKeyBoard(e) {
    l.Log(l.GetStackTrace(), "Register Keyboard Events", 7);
    const t = new Lr(this.toStreamerMessagesProvider, e, this.activeKeys);
    return t.registerKeyBoardEvents(), t;
  }
  registerMouse(e) {
    l.Log(l.GetStackTrace(), "Register Mouse Events", 7);
    const t = new Or(this.toStreamerMessagesProvider, this.videoElementProvider, this.coordinateConverter, this.activeKeys);
    switch (e) {
      case te.LockedMouse:
        t.registerLockedMouseEvents(t);
        break;
      case te.HoveringMouse:
        t.registerHoveringMouseEvents(t);
        break;
      default:
        l.Info(l.GetStackTrace(), "unknown Control Scheme Type Defaulting to Locked Mouse Events"), t.registerLockedMouseEvents(t);
    }
    return t;
  }
  registerTouch(e, t) {
    if (l.Log(l.GetStackTrace(), "Registering Touch", 6), e) {
      const s = new kr(this.toStreamerMessagesProvider, this.videoElementProvider, this.coordinateConverter);
      return s.setVideoElementParentClientRect(t), s;
    }
    return new Ir(this.toStreamerMessagesProvider, this.videoElementProvider, this.coordinateConverter);
  }
  registerGamePad() {
    return l.Log(l.GetStackTrace(), "Register Game Pad", 7), new Dr(this.toStreamerMessagesProvider);
  }
}, Ur = class {
  constructor() {
    this.activeKeys = [], this.activeKeys = [];
  }
  getActiveKeys() {
    return this.activeKeys;
  }
}, zr = class {
  constructor(e, t) {
    this.lastTimeResized = (/* @__PURE__ */ new Date()).getTime(), this.videoElement = document.createElement("video"), this.config = t, this.videoElement.id = "streamingVideo", this.videoElement.disablePictureInPicture = !0, this.videoElement.playsInline = !0, this.videoElement.style.width = "100%", this.videoElement.style.height = "100%", this.videoElement.style.position = "absolute", this.videoElement.style.pointerEvents = "all", e.appendChild(this.videoElement), this.onResizePlayerCallback = () => {
      console.log("Resolution changed, restyling player, did you forget to override this function?");
    }, this.onMatchViewportResolutionCallback = () => {
      console.log("Resolution changed and match viewport resolution is turned on, did you forget to override this function?");
    }, this.videoElement.onclick = () => {
      this.audioElement != null && this.audioElement.paused && this.audioElement.play(), this.videoElement.paused && this.videoElement.play();
    }, this.videoElement.onloadedmetadata = () => {
      this.onVideoInitialized();
    }, window.addEventListener("resize", () => this.resizePlayerStyle(), !0), window.addEventListener("orientationchange", () => this.onOrientationChange());
  }
  setAudioElement(e) {
    this.audioElement = e;
  }
  play() {
    return this.videoElement.muted = this.config.isFlagEnabled(g.StartVideoMuted), this.videoElement.autoplay = this.config.isFlagEnabled(g.AutoPlayVideo), this.videoElement.play();
  }
  isPaused() {
    return this.videoElement.paused;
  }
  isVideoReady() {
    return this.videoElement.readyState !== void 0 && this.videoElement.readyState > 0;
  }
  hasVideoSource() {
    return this.videoElement.srcObject !== void 0 && this.videoElement.srcObject !== null;
  }
  getVideoElement() {
    return this.videoElement;
  }
  getVideoParentElement() {
    return this.videoElement.parentElement;
  }
  setVideoEnabled(e) {
    this.videoElement.srcObject.getTracks().forEach((t) => t.enabled = e);
  }
  onVideoInitialized() {
  }
  onOrientationChange() {
    clearTimeout(this.orientationChangeTimeout), this.orientationChangeTimeout = window.setTimeout(() => {
      this.resizePlayerStyle();
    }, 500);
  }
  resizePlayerStyle() {
    const e = this.getVideoParentElement();
    e && (this.updateVideoStreamSize(), e.classList.contains("fixed-size") || this.resizePlayerStyleToFillParentElement(), this.onResizePlayerCallback());
  }
  resizePlayerStyleToFillParentElement() {
    this.getVideoParentElement().setAttribute("style", "top: 0px; left: 0px; width: 100%; height: 100%; cursor: default;");
  }
  updateVideoStreamSize() {
    if (this.config.isFlagEnabled(g.MatchViewportResolution)) if ((/* @__PURE__ */ new Date()).getTime() - this.lastTimeResized > 300) {
      const e = this.getVideoParentElement();
      if (!e) return;
      this.onMatchViewportResolutionCallback(e.clientWidth, e.clientHeight), this.lastTimeResized = (/* @__PURE__ */ new Date()).getTime();
    } else l.Log(l.GetStackTrace(), "Resizing too often - skipping", 6), clearTimeout(this.resizeTimeoutHandle), this.resizeTimeoutHandle = window.setTimeout(() => this.updateVideoStreamSize(), 100);
  }
}, $s = class {
  constructor() {
    this.toStreamerHandlers = /* @__PURE__ */ new Map(), this.fromStreamerHandlers = /* @__PURE__ */ new Map(), this.toStreamerMessages = /* @__PURE__ */ new Map(), this.fromStreamerMessages = /* @__PURE__ */ new Map();
  }
  populateDefaultProtocol() {
    this.toStreamerMessages.set("IFrameRequest", { id: 0, structure: [] }), this.toStreamerMessages.set("RequestQualityControl", { id: 1, structure: [] }), this.toStreamerMessages.set("FpsRequest", { id: 2, structure: [] }), this.toStreamerMessages.set("AverageBitrateRequest", { id: 3, structure: [] }), this.toStreamerMessages.set("StartStreaming", { id: 4, structure: [] }), this.toStreamerMessages.set("StopStreaming", { id: 5, structure: [] }), this.toStreamerMessages.set("LatencyTest", { id: 6, structure: ["string"] }), this.toStreamerMessages.set("RequestInitialSettings", { id: 7, structure: [] }), this.toStreamerMessages.set("TestEcho", { id: 8, structure: [] }), this.toStreamerMessages.set("DataChannelLatencyTest", { id: 9, structure: [] }), this.toStreamerMessages.set("UIInteraction", { id: 50, structure: ["string"] }), this.toStreamerMessages.set("Command", { id: 51, structure: ["string"] }), this.toStreamerMessages.set("KeyDown", { id: 60, structure: ["uint8", "uint8"] }), this.toStreamerMessages.set("KeyUp", { id: 61, structure: ["uint8"] }), this.toStreamerMessages.set("KeyPress", { id: 62, structure: ["uint16"] }), this.toStreamerMessages.set("MouseEnter", { id: 70, structure: [] }), this.toStreamerMessages.set("MouseLeave", { id: 71, structure: [] }), this.toStreamerMessages.set("MouseDown", { id: 72, structure: ["uint8", "uint16", "uint16"] }), this.toStreamerMessages.set("MouseUp", { id: 73, structure: ["uint8", "uint16", "uint16"] }), this.toStreamerMessages.set("MouseMove", { id: 74, structure: ["uint16", "uint16", "int16", "int16"] }), this.toStreamerMessages.set("MouseWheel", { id: 75, structure: ["int16", "uint16", "uint16"] }), this.toStreamerMessages.set("MouseDouble", { id: 76, structure: ["uint8", "uint16", "uint16"] }), this.toStreamerMessages.set("TouchStart", { id: 80, structure: ["uint8", "uint16", "uint16", "uint8", "uint8", "uint8"] }), this.toStreamerMessages.set("TouchEnd", { id: 81, structure: ["uint8", "uint16", "uint16", "uint8", "uint8", "uint8"] }), this.toStreamerMessages.set("TouchMove", { id: 82, structure: ["uint8", "uint16", "uint16", "uint8", "uint8", "uint8"] }), this.toStreamerMessages.set("GamepadConnected", { id: 93, structure: [] }), this.toStreamerMessages.set("GamepadButtonPressed", { id: 90, structure: ["uint8", "uint8", "uint8"] }), this.toStreamerMessages.set("GamepadButtonReleased", { id: 91, structure: ["uint8", "uint8", "uint8"] }), this.toStreamerMessages.set("GamepadAnalog", { id: 92, structure: ["uint8", "uint8", "double"] }), this.toStreamerMessages.set("GamepadDisconnected", { id: 94, structure: ["uint8"] }), this.fromStreamerMessages.set(0, "QualityControlOwnership"), this.fromStreamerMessages.set(1, "Response"), this.fromStreamerMessages.set(2, "Command"), this.fromStreamerMessages.set(3, "FreezeFrame"), this.fromStreamerMessages.set(4, "UnfreezeFrame"), this.fromStreamerMessages.set(5, "VideoEncoderAvgQP"), this.fromStreamerMessages.set(6, "LatencyTest"), this.fromStreamerMessages.set(7, "InitialSettings"), this.fromStreamerMessages.set(8, "FileExtension"), this.fromStreamerMessages.set(9, "FileMimeType"), this.fromStreamerMessages.set(10, "FileContents"), this.fromStreamerMessages.set(11, "TestEcho"), this.fromStreamerMessages.set(12, "InputControlOwnership"), this.fromStreamerMessages.set(13, "GamepadResponse"), this.fromStreamerMessages.set(14, "DataChannelLatencyTest"), this.fromStreamerMessages.set(255, "Protocol");
  }
  registerMessageHandler(e, t, s) {
    switch (e) {
      case C.ToStreamer:
        this.toStreamerHandlers.set(t, s);
        break;
      case C.FromStreamer:
        this.fromStreamerHandlers.set(t, s);
        break;
      default:
        l.Log(l.GetStackTrace(), `Unknown message direction ${e}`);
    }
  }
};
(function(i) {
  i[i.ToStreamer = 0] = "ToStreamer", i[i.FromStreamer = 1] = "FromStreamer";
})(C || (C = {}));
let Br = class {
  constructor() {
    this.responseEventListeners = /* @__PURE__ */ new Map();
  }
  addResponseEventListener(e, t) {
    this.responseEventListeners.set(e, t);
  }
  removeResponseEventListener(e) {
    this.responseEventListeners.delete(e);
  }
  onResponse(e) {
    l.Log(l.GetStackTrace(), "DataChannelReceiveMessageType.Response", 6);
    const t = new TextDecoder("utf-16").decode(e.slice(1));
    l.Log(l.GetStackTrace(), t, 6), this.responseEventListeners.forEach((s) => {
      s(t);
    });
  }
}, Gr = class {
  constructor(e, t) {
    this.dataChannelSender = e, this.toStreamerMessagesMapProvider = t;
  }
  sendMessageToStreamer(e, t) {
    t === void 0 && (t = []);
    const s = this.toStreamerMessagesMapProvider.toStreamerMessages.get(e);
    if (s === void 0) return void l.Error(l.GetStackTrace(), `Attempted to send a message to the streamer with message type: ${e}, but the frontend hasn't been configured to send such a message. Check you've added the message type in your cpp`);
    if (s.structure && t && s.structure.length !== t.length) return void l.Error(l.GetStackTrace(), `Provided message data doesn't match expected layout. Expected [ ${s.structure.map((d) => {
      switch (d) {
        case "uint8":
        case "uint16":
        case "int16":
        case "float":
        case "double":
          return "number";
        case "string":
          return "string";
      }
    }).toString()} ] but received [ ${t.map((d) => typeof d).toString()} ]`);
    let n = 0;
    const r = new TextEncoder();
    t.forEach((d, h) => {
      switch (s.structure[h]) {
        case "uint8":
          n += 1;
          break;
        case "uint16":
        case "int16":
          n += 2;
          break;
        case "float":
          n += 4;
          break;
        case "double":
          n += 8;
          break;
        case "string":
          n += 2, n += 2 * r.encode(d).length;
      }
    });
    const o = new DataView(new ArrayBuffer(n + 1));
    o.setUint8(0, s.id);
    let a = 1;
    t.forEach((d, h) => {
      switch (s.structure[h]) {
        case "uint8":
          o.setUint8(a, d), a += 1;
          break;
        case "uint16":
          o.setUint16(a, d, !0), a += 2;
          break;
        case "int16":
          o.setInt16(a, d, !0), a += 2;
          break;
        case "float":
          o.setFloat32(a, d, !0), a += 4;
          break;
        case "double":
          o.setFloat64(a, d, !0), a += 8;
          break;
        case "string":
          o.setUint16(a, d.length, !0), a += 2;
          for (let u = 0; u < d.length; u++) o.setUint16(a, d.charCodeAt(u), !0), a += 2;
      }
    }), this.dataChannelSender.canSend() ? this.dataChannelSender.sendData(o.buffer) : l.Info(l.GetStackTrace(), `Data channel cannot send yet, skipping sending message: ${e} - ${new Uint8Array(o.buffer)}`);
  }
}, Nr = class {
  constructor(e) {
    this.sendMessageController = e;
  }
  SendRequestQualityControl() {
    this.sendMessageController.sendMessageToStreamer("RequestQualityControl");
  }
  SendMaxFpsRequest() {
    this.sendMessageController.sendMessageToStreamer("FpsRequest");
  }
  SendAverageBitrateRequest() {
    this.sendMessageController.sendMessageToStreamer("AverageBitrateRequest");
  }
  SendStartStreaming() {
    this.sendMessageController.sendMessageToStreamer("StartStreaming");
  }
  SendStopStreaming() {
    this.sendMessageController.sendMessageToStreamer("StopStreaming");
  }
  SendRequestInitialSettings() {
    this.sendMessageController.sendMessageToStreamer("RequestInitialSettings");
  }
}, Hr = class {
  constructor(e) {
    this.dataChannelProvider = e;
  }
  canSend() {
    return this.dataChannelProvider.getDataChannelInstance().dataChannel !== void 0 && this.dataChannelProvider.getDataChannelInstance().dataChannel.readyState == "open";
  }
  sendData(e) {
    const t = this.dataChannelProvider.getDataChannelInstance();
    t.dataChannel.readyState == "open" ? (t.dataChannel.send(e), l.Log(l.GetStackTrace(), `Message Sent: ${new Uint8Array(e)}`, 6), this.resetAfkWarningTimerOnDataSend()) : l.Error(l.GetStackTrace(), `Message Failed: ${new Uint8Array(e)}`);
  }
  resetAfkWarningTimerOnDataSend() {
  }
}, Wr = class {
  constructor(e) {
    this.videoElementProvider = e, this.normalizeAndQuantizeUnsignedFunc = () => {
      throw new Error("Normalize and quantize unsigned, method not implemented.");
    }, this.normalizeAndQuantizeSignedFunc = () => {
      throw new Error("Normalize and unquantize signed, method not implemented.");
    }, this.denormalizeAndUnquantizeUnsignedFunc = () => {
      throw new Error("Denormalize and unquantize unsigned, method not implemented.");
    };
  }
  normalizeAndQuantizeUnsigned(e, t) {
    return this.normalizeAndQuantizeUnsignedFunc(e, t);
  }
  unquantizeAndDenormalizeUnsigned(e, t) {
    return this.denormalizeAndUnquantizeUnsignedFunc(e, t);
  }
  normalizeAndQuantizeSigned(e, t) {
    return this.normalizeAndQuantizeSignedFunc(e, t);
  }
  setupNormalizeAndQuantize() {
    if (this.videoElementParent = this.videoElementProvider.getVideoParentElement(), this.videoElement = this.videoElementProvider.getVideoElement(), this.videoElementParent && this.videoElement) {
      const e = this.videoElementParent.clientHeight / this.videoElementParent.clientWidth, t = this.videoElement.videoHeight / this.videoElement.videoWidth;
      e > t ? (l.Log(l.GetStackTrace(), "Setup Normalize and Quantize for playerAspectRatio > videoAspectRatio", 6), this.ratio = e / t, this.normalizeAndQuantizeUnsignedFunc = (s, n) => this.normalizeAndQuantizeUnsignedPlayerBigger(s, n), this.normalizeAndQuantizeSignedFunc = (s, n) => this.normalizeAndQuantizeSignedPlayerBigger(s, n), this.denormalizeAndUnquantizeUnsignedFunc = (s, n) => this.denormalizeAndUnquantizeUnsignedPlayerBigger(s, n)) : (l.Log(l.GetStackTrace(), "Setup Normalize and Quantize for playerAspectRatio <= videoAspectRatio", 6), this.ratio = t / e, this.normalizeAndQuantizeUnsignedFunc = (s, n) => this.normalizeAndQuantizeUnsignedPlayerSmaller(s, n), this.normalizeAndQuantizeSignedFunc = (s, n) => this.normalizeAndQuantizeSignedPlayerSmaller(s, n), this.denormalizeAndUnquantizeUnsignedFunc = (s, n) => this.denormalizeAndUnquantizeUnsignedPlayerSmaller(s, n));
    }
  }
  normalizeAndQuantizeUnsignedPlayerBigger(e, t) {
    const s = e / this.videoElementParent.clientWidth, n = this.ratio * (t / this.videoElementParent.clientHeight - 0.5) + 0.5;
    return s < 0 || s > 1 || n < 0 || n > 1 ? new Ae(!1, 65535, 65535) : new Ae(!0, 65536 * s, 65536 * n);
  }
  denormalizeAndUnquantizeUnsignedPlayerBigger(e, t) {
    const s = e / 65536, n = (t / 65536 - 0.5) / this.ratio + 0.5;
    return new at(s * this.videoElementParent.clientWidth, n * this.videoElementParent.clientHeight);
  }
  normalizeAndQuantizeSignedPlayerBigger(e, t) {
    const s = e / (0.5 * this.videoElementParent.clientWidth), n = this.ratio * t / (0.5 * this.videoElementParent.clientHeight);
    return new Lt(32767 * s, 32767 * n);
  }
  normalizeAndQuantizeUnsignedPlayerSmaller(e, t) {
    const s = this.ratio * (e / this.videoElementParent.clientWidth - 0.5) + 0.5, n = t / this.videoElementParent.clientHeight;
    return s < 0 || s > 1 || n < 0 || n > 1 ? new Ae(!1, 65535, 65535) : new Ae(!0, 65536 * s, 65536 * n);
  }
  denormalizeAndUnquantizeUnsignedPlayerSmaller(e, t) {
    const s = (e / 65536 - 0.5) / this.ratio + 0.5, n = t / 65536;
    return new at(s * this.videoElementParent.clientWidth, n * this.videoElementParent.clientHeight);
  }
  normalizeAndQuantizeSignedPlayerSmaller(e, t) {
    const s = this.ratio * e / (0.5 * this.videoElementParent.clientWidth), n = t / (0.5 * this.videoElementParent.clientHeight);
    return new Lt(32767 * s, 32767 * n);
  }
}, Ae = class {
  constructor(e, t, s) {
    this.inRange = e, this.x = t, this.y = s;
  }
}, at = class {
  constructor(e, t) {
    this.x = e, this.y = t;
  }
}, Lt = class {
  constructor(e, t) {
    this.x = e, this.y = t;
  }
}, Qs = class {
  constructor(e, t) {
    this.shouldShowPlayOverlay = !0, this.autoJoinTimer = void 0, this.injectInputControllers = [], this.config = e, this.pixelStreaming = t, this.responseController = new Br(), this.file = new Pr(), this.sdpConstraints = { offerToReceiveAudio: !0, offerToReceiveVideo: !0 }, this.afkController = new Os(this.config, this.pixelStreaming, this.onAfkTriggered.bind(this)), this.afkController.onAFKTimedOutCallback = () => {
      this.closeSignalingServer("You have been disconnected due to inactivity");
    }, this.freezeFrameController = new pr(this.pixelStreaming.videoElementParent), this.videoPlayer = new zr(this.pixelStreaming.videoElementParent, this.config), this.videoPlayer.onVideoInitialized = () => this.handleVideoInitialized(), this.videoPlayer.onMatchViewportResolutionCallback = (s, n) => {
      const r = { "Resolution.Width": s, "Resolution.Height": n };
      this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify(r)]);
    }, this.videoPlayer.onResizePlayerCallback = () => {
      this.setUpMouseAndFreezeFrame();
    }, this.streamController = new gr(this.videoPlayer), this.coordinateConverter = new Wr(this.videoPlayer), this.sendrecvDataChannelController = new Rt(), this.recvDataChannelController = new Rt(), this.registerDataChannelEventEmitters(this.sendrecvDataChannelController), this.registerDataChannelEventEmitters(this.recvDataChannelController), this.dataChannelSender = new Hr(this.sendrecvDataChannelController), this.dataChannelSender.resetAfkWarningTimerOnDataSend = () => this.afkController.resetAfkWarningTimer(), this.streamMessageController = new $s(), this.webSocketController = new es(), this.webSocketController.onConfig = (s) => this.handleOnConfigMessage(s), this.webSocketController.onStreamerList = (s) => this.handleStreamerListMessage(s), this.webSocketController.onPlayerCount = (s) => {
      this.pixelStreaming._onPlayerCount(s.count);
    }, this.webSocketController.onOpen.addEventListener("open", () => {
      this.config.isFlagEnabled(g.BrowserSendOffer) || this.webSocketController.requestStreamerList();
    }), this.webSocketController.onClose.addEventListener("close", (s) => {
      const n = this.shouldReconnect && s.detail.code != 1001 && this.config.getNumericSettingValue(b.MaxReconnectAttempts) > 0, r = this.disconnectMessage ? this.disconnectMessage : s.detail.reason;
      this.pixelStreaming._onDisconnect(r, !n && !this.isReconnecting), this.afkController.stopAfkWarningTimer(), this.statsTimerHandle && this.statsTimerHandle !== void 0 && window.clearInterval(this.statsTimerHandle), this.setVideoEncoderAvgQP(0), this.setTouchInputEnabled(!1), this.setMouseInputEnabled(!1), this.setKeyboardInputEnabled(!1), this.setGamePadInputEnabled(!1), n && setTimeout(() => {
        this.isReconnecting = !0, this.reconnectAttempt++, this.tryReconnect(s.detail.reason);
      }, 2e3);
    }), this.sendMessageController = new Gr(this.dataChannelSender, this.streamMessageController), this.toStreamerMessagesController = new Nr(this.sendMessageController), this.registerMessageHandlers(), this.streamMessageController.populateDefaultProtocol(), this.inputClassesFactory = new _r(this.streamMessageController, this.videoPlayer, this.coordinateConverter), this.isUsingSFU = !1, this.isQualityController = !1, this.preferredCodec = "", this.shouldReconnect = !0, this.isReconnecting = !1, this.reconnectAttempt = 0, this.config._addOnOptionSettingChangedListener(L.StreamerId, (s) => {
      s !== "" && (this.peerConnectionController.peerConnection.close(), this.peerConnectionController.createPeerConnection(this.peerConfig, this.preferredCodec), this.subscribedStream = s, this.webSocketController.sendSubscribe(s));
    }), this.setVideoEncoderAvgQP(-1), this.signallingUrlBuilder = () => {
      let s = this.config.getTextSettingValue(ee.SignallingServerUrl);
      return this.config.isFlagEnabled(g.BrowserSendOffer) && (s += "?" + g.BrowserSendOffer + "=true"), s;
    };
  }
  requestUnquantizedAndDenormalizeUnsigned(e, t) {
    return this.coordinateConverter.unquantizeAndDenormalizeUnsigned(e, t);
  }
  handleOnMessage(e) {
    const t = new Uint8Array(e.data);
    l.Log(l.GetStackTrace(), "Message incoming:" + t, 6);
    const s = this.streamMessageController.fromStreamerMessages.get(t[0]);
    this.streamMessageController.fromStreamerHandlers.get(s)(e.data);
  }
  registerMessageHandlers() {
    this.streamMessageController.registerMessageHandler(C.FromStreamer, "QualityControlOwnership", (e) => this.onQualityControlOwnership(e)), this.streamMessageController.registerMessageHandler(C.FromStreamer, "Response", (e) => this.responseController.onResponse(e)), this.streamMessageController.registerMessageHandler(C.FromStreamer, "Command", (e) => {
      this.onCommand(e);
    }), this.streamMessageController.registerMessageHandler(C.FromStreamer, "FreezeFrame", (e) => this.onFreezeFrameMessage(e)), this.streamMessageController.registerMessageHandler(C.FromStreamer, "UnfreezeFrame", () => this.invalidateFreezeFrameAndEnableVideo()), this.streamMessageController.registerMessageHandler(C.FromStreamer, "VideoEncoderAvgQP", (e) => this.handleVideoEncoderAvgQP(e)), this.streamMessageController.registerMessageHandler(C.FromStreamer, "LatencyTest", (e) => this.handleLatencyTestResult(e)), this.streamMessageController.registerMessageHandler(C.FromStreamer, "DataChannelLatencyTest", (e) => this.handleDataChannelLatencyTestResponse(e)), this.streamMessageController.registerMessageHandler(C.FromStreamer, "InitialSettings", (e) => this.handleInitialSettings(e)), this.streamMessageController.registerMessageHandler(C.FromStreamer, "FileExtension", (e) => this.onFileExtension(e)), this.streamMessageController.registerMessageHandler(C.FromStreamer, "FileMimeType", (e) => this.onFileMimeType(e)), this.streamMessageController.registerMessageHandler(C.FromStreamer, "FileContents", (e) => this.onFileContents(e)), this.streamMessageController.registerMessageHandler(C.FromStreamer, "TestEcho", () => {
    }), this.streamMessageController.registerMessageHandler(C.FromStreamer, "InputControlOwnership", (e) => this.onInputControlOwnership(e)), this.streamMessageController.registerMessageHandler(C.FromStreamer, "GamepadResponse", (e) => this.onGamepadResponse(e)), this.streamMessageController.registerMessageHandler(C.FromStreamer, "Protocol", (e) => this.onProtocolMessage(e)), this.streamMessageController.registerMessageHandler(C.ToStreamer, "IFrameRequest", () => this.sendMessageController.sendMessageToStreamer("IFrameRequest")), this.streamMessageController.registerMessageHandler(C.ToStreamer, "RequestQualityControl", () => this.sendMessageController.sendMessageToStreamer("RequestQualityControl")), this.streamMessageController.registerMessageHandler(C.ToStreamer, "FpsRequest", () => this.sendMessageController.sendMessageToStreamer("FpsRequest")), this.streamMessageController.registerMessageHandler(C.ToStreamer, "AverageBitrateRequest", () => this.sendMessageController.sendMessageToStreamer("AverageBitrateRequest")), this.streamMessageController.registerMessageHandler(C.ToStreamer, "StartStreaming", () => this.sendMessageController.sendMessageToStreamer("StartStreaming")), this.streamMessageController.registerMessageHandler(C.ToStreamer, "StopStreaming", () => this.sendMessageController.sendMessageToStreamer("StopStreaming")), this.streamMessageController.registerMessageHandler(C.ToStreamer, "LatencyTest", (e) => this.sendMessageController.sendMessageToStreamer("LatencyTest", e)), this.streamMessageController.registerMessageHandler(C.ToStreamer, "RequestInitialSettings", () => this.sendMessageController.sendMessageToStreamer("RequestInitialSettings")), this.streamMessageController.registerMessageHandler(C.ToStreamer, "TestEcho", () => {
    }), this.streamMessageController.registerMessageHandler(C.ToStreamer, "UIInteraction", (e) => this.sendMessageController.sendMessageToStreamer("UIInteraction", e)), this.streamMessageController.registerMessageHandler(C.ToStreamer, "Command", (e) => this.sendMessageController.sendMessageToStreamer("Command", e)), this.streamMessageController.registerMessageHandler(C.ToStreamer, "TextboxEntry", (e) => this.sendMessageController.sendMessageToStreamer("TextboxEntry", e)), this.streamMessageController.registerMessageHandler(C.ToStreamer, "KeyDown", (e) => this.sendMessageController.sendMessageToStreamer("KeyDown", e)), this.streamMessageController.registerMessageHandler(C.ToStreamer, "KeyUp", (e) => this.sendMessageController.sendMessageToStreamer("KeyUp", e)), this.streamMessageController.registerMessageHandler(C.ToStreamer, "KeyPress", (e) => this.sendMessageController.sendMessageToStreamer("KeyPress", e)), this.streamMessageController.registerMessageHandler(C.ToStreamer, "MouseEnter", (e) => this.sendMessageController.sendMessageToStreamer("MouseEnter", e)), this.streamMessageController.registerMessageHandler(C.ToStreamer, "MouseLeave", (e) => this.sendMessageController.sendMessageToStreamer("MouseLeave", e)), this.streamMessageController.registerMessageHandler(C.ToStreamer, "MouseDown", (e) => this.sendMessageController.sendMessageToStreamer("MouseDown", e)), this.streamMessageController.registerMessageHandler(C.ToStreamer, "MouseUp", (e) => this.sendMessageController.sendMessageToStreamer("MouseUp", e)), this.streamMessageController.registerMessageHandler(C.ToStreamer, "MouseMove", (e) => this.sendMessageController.sendMessageToStreamer("MouseMove", e)), this.streamMessageController.registerMessageHandler(C.ToStreamer, "MouseWheel", (e) => this.sendMessageController.sendMessageToStreamer("MouseWheel", e)), this.streamMessageController.registerMessageHandler(C.ToStreamer, "MouseDouble", (e) => this.sendMessageController.sendMessageToStreamer("MouseDouble", e)), this.streamMessageController.registerMessageHandler(C.ToStreamer, "TouchStart", (e) => this.sendMessageController.sendMessageToStreamer("TouchStart", e)), this.streamMessageController.registerMessageHandler(C.ToStreamer, "TouchEnd", (e) => this.sendMessageController.sendMessageToStreamer("TouchEnd", e)), this.streamMessageController.registerMessageHandler(C.ToStreamer, "TouchMove", (e) => this.sendMessageController.sendMessageToStreamer("TouchMove", e)), this.streamMessageController.registerMessageHandler(C.ToStreamer, "GamepadConnected", () => this.sendMessageController.sendMessageToStreamer("GamepadConnected")), this.streamMessageController.registerMessageHandler(C.ToStreamer, "GamepadButtonPressed", (e) => this.sendMessageController.sendMessageToStreamer("GamepadButtonPressed", e)), this.streamMessageController.registerMessageHandler(C.ToStreamer, "GamepadButtonReleased", (e) => this.sendMessageController.sendMessageToStreamer("GamepadButtonReleased", e)), this.streamMessageController.registerMessageHandler(C.ToStreamer, "GamepadAnalog", (e) => this.sendMessageController.sendMessageToStreamer("GamepadAnalog", e)), this.streamMessageController.registerMessageHandler(C.ToStreamer, "GamepadDisconnected", (e) => this.sendMessageController.sendMessageToStreamer("GamepadDisconnected", e)), this.streamMessageController.registerMessageHandler(C.ToStreamer, "XRHMDTransform", (e) => this.sendMessageController.sendMessageToStreamer("XRHMDTransform", e)), this.streamMessageController.registerMessageHandler(C.ToStreamer, "XRControllerTransform", (e) => this.sendMessageController.sendMessageToStreamer("XRControllerTransform", e)), this.streamMessageController.registerMessageHandler(C.ToStreamer, "XRSystem", (e) => this.sendMessageController.sendMessageToStreamer("XRSystem", e)), this.streamMessageController.registerMessageHandler(C.ToStreamer, "XRButtonTouched", (e) => this.sendMessageController.sendMessageToStreamer("XRButtonTouched", e)), this.streamMessageController.registerMessageHandler(C.ToStreamer, "XRButtonPressed", (e) => this.sendMessageController.sendMessageToStreamer("XRButtonPressed", e)), this.streamMessageController.registerMessageHandler(C.ToStreamer, "XRButtonReleased", (e) => this.sendMessageController.sendMessageToStreamer("XRButtonReleased", e)), this.streamMessageController.registerMessageHandler(C.ToStreamer, "XRAnalog", (e) => this.sendMessageController.sendMessageToStreamer("XRAnalog", e));
  }
  onCommand(e) {
    l.Log(l.GetStackTrace(), "DataChannelReceiveMessageType.Command", 6);
    const t = new TextDecoder("utf-16").decode(e.slice(1));
    l.Log(l.GetStackTrace(), "Data Channel Command: " + t, 6);
    const s = JSON.parse(t);
    s.command === "onScreenKeyboard" && this.pixelStreaming._activateOnScreenKeyboard(s);
  }
  onProtocolMessage(e) {
    try {
      const t = new TextDecoder("utf-16").decode(e.slice(1)), s = JSON.parse(t);
      Object.prototype.hasOwnProperty.call(s, "Direction") || l.Error(l.GetStackTrace(), "Malformed protocol received. Ensure the protocol message contains a direction");
      const n = s.Direction;
      delete s.Direction, l.Log(l.GetStackTrace(), `Received new ${n == C.FromStreamer ? "FromStreamer" : "ToStreamer"} protocol. Updating existing protocol...`), Object.keys(s).forEach((r) => {
        const o = s[r];
        switch (n) {
          case C.ToStreamer:
            if (!Object.prototype.hasOwnProperty.call(o, "id")) return void l.Error(l.GetStackTrace(), `ToStreamer->${r} protocol definition was malformed as it didn't contain at least an id

                                           Definition was: ${JSON.stringify(o, null, 2)}`);
            if (r === "UIInteraction" || r === "Command" || r === "LatencyTest") return;
            this.streamMessageController.toStreamerHandlers.get(r) ? this.streamMessageController.toStreamerMessages.set(r, o) : l.Error(l.GetStackTrace(), `There was no registered handler for "${r}" - try adding one using registerMessageHandler(MessageDirection.ToStreamer, "${r}", myHandler)`);
            break;
          case C.FromStreamer:
            if (!Object.prototype.hasOwnProperty.call(o, "id")) return void l.Error(l.GetStackTrace(), `FromStreamer->${r} protocol definition was malformed as it didn't contain at least an id

                            Definition was: ${JSON.stringify(o, null, 2)}`);
            this.streamMessageController.fromStreamerHandlers.get(r) ? this.streamMessageController.fromStreamerMessages.set(o.id, r) : l.Error(l.GetStackTrace(), `There was no registered handler for "${o}" - try adding one using registerMessageHandler(MessageDirection.FromStreamer, "${r}", myHandler)`);
            break;
          default:
            l.Error(l.GetStackTrace(), `Unknown direction: ${n}`);
        }
      }), this.toStreamerMessagesController.SendRequestInitialSettings(), this.toStreamerMessagesController.SendRequestQualityControl();
    } catch (t) {
      l.Log(l.GetStackTrace(), t);
    }
  }
  onInputControlOwnership(e) {
    const t = new Uint8Array(e);
    l.Log(l.GetStackTrace(), "DataChannelReceiveMessageType.InputControlOwnership", 6);
    const s = new Boolean(t[1]).valueOf();
    l.Log(l.GetStackTrace(), `Received input controller message - will your input control the stream: ${s}`), this.pixelStreaming._onInputControlOwnership(s);
  }
  onGamepadResponse(e) {
    const t = new TextDecoder("utf-16").decode(e.slice(1)), s = JSON.parse(t);
    this.gamePadController.onGamepadResponseReceived(s.controllerId);
  }
  onAfkTriggered() {
    this.afkController.onAfkClick(), this.videoPlayer.isPaused() && this.videoPlayer.hasVideoSource() && this.playStream();
  }
  setAfkEnabled(e) {
    e ? this.onAfkTriggered() : this.afkController.stopAfkWarningTimer();
  }
  tryReconnect(e) {
    this.webSocketController ? (this.isReconnecting = !0, this.webSocketController.webSocket && this.webSocketController.webSocket.readyState != WebSocket.CLOSED ? (this.closeSignalingServer(`${e} Restarting stream...`), setTimeout(() => {
      this.tryReconnect(e);
    }, 3e3)) : (this.pixelStreaming._onWebRtcAutoConnect(), this.connectToSignallingServer())) : l.Log(l.GetStackTrace(), "The Web Socket Controller does not exist so this will not work right now.");
  }
  loadFreezeFrameOrShowPlayOverlay() {
    this.pixelStreaming.dispatchEvent(new Ts({ shouldShowPlayOverlay: this.shouldShowPlayOverlay, isValid: this.freezeFrameController.valid, jpegData: this.freezeFrameController.jpeg })), this.shouldShowPlayOverlay === !0 ? (l.Log(l.GetStackTrace(), "showing play overlay"), this.resizePlayerStyle()) : (l.Log(l.GetStackTrace(), "showing freeze frame"), this.freezeFrameController.showFreezeFrame()), setTimeout(() => {
      this.videoPlayer.setVideoEnabled(!1);
    }, this.freezeFrameController.freezeFrameDelay);
  }
  onFreezeFrameMessage(e) {
    l.Log(l.GetStackTrace(), "DataChannelReceiveMessageType.FreezeFrame", 6);
    const t = new Uint8Array(e);
    this.freezeFrameController.processFreezeFrameMessage(t, () => this.loadFreezeFrameOrShowPlayOverlay());
  }
  invalidateFreezeFrameAndEnableVideo() {
    l.Log(l.GetStackTrace(), "DataChannelReceiveMessageType.FreezeFrame", 6), setTimeout(() => {
      this.pixelStreaming.dispatchEvent(new bs()), this.freezeFrameController.hideFreezeFrame();
    }, this.freezeFrameController.freezeFrameDelay), this.videoPlayer.getVideoElement() && this.videoPlayer.setVideoEnabled(!0);
  }
  onFileExtension(e) {
    const t = new Uint8Array(e);
    Qe.setExtensionFromBytes(t, this.file);
  }
  onFileMimeType(e) {
    const t = new Uint8Array(e);
    Qe.setMimeTypeFromBytes(t, this.file);
  }
  onFileContents(e) {
    const t = new Uint8Array(e);
    Qe.setContentsFromBytes(t, this.file);
  }
  playStream() {
    if (!this.videoPlayer.getVideoElement()) {
      const e = "Could not play video stream because the video player was not initialized correctly.";
      return this.pixelStreaming.dispatchEvent(new ys({ message: e })), l.Error(l.GetStackTrace(), e), void this.closeSignalingServer("Stream not initialized correctly");
    }
    if (this.videoPlayer.hasVideoSource()) {
      if (this.setTouchInputEnabled(this.config.isFlagEnabled(g.TouchInput)), this.pixelStreaming.dispatchEvent(new Es()), this.streamController.audioElement.srcObject) {
        const e = this.config.isFlagEnabled(g.StartVideoMuted);
        this.streamController.audioElement.muted = e, e ? this.playVideo() : this.streamController.audioElement.play().then(() => {
          this.playVideo();
        }).catch((t) => {
          l.Log(l.GetStackTrace(), t), l.Log(l.GetStackTrace(), "Browser does not support autoplaying video without interaction - to resolve this we are going to show the play button overlay."), this.pixelStreaming.dispatchEvent(new it({ reason: t }));
        });
      } else this.playVideo();
      this.shouldShowPlayOverlay = !1, this.freezeFrameController.showFreezeFrame();
    } else l.Warning(l.GetStackTrace(), "Cannot play stream, the video element has no srcObject to play.");
  }
  playVideo() {
    this.videoPlayer.play().catch((e) => {
      this.streamController.audioElement.srcObject && this.streamController.audioElement.pause(), l.Log(l.GetStackTrace(), e), l.Log(l.GetStackTrace(), "Browser does not support autoplaying video without interaction - to resolve this we are going to show the play button overlay."), this.pixelStreaming.dispatchEvent(new it({ reason: e }));
    });
  }
  autoPlayVideoOrSetUpPlayOverlay() {
    this.config.isFlagEnabled(g.AutoPlayVideo) && this.playStream(), this.resizePlayerStyle();
  }
  connectToSignallingServer() {
    this.locallyClosed = !1, this.shouldReconnect = !0, this.disconnectMessage = null;
    const e = this.signallingUrlBuilder();
    this.webSocketController.connect(e);
  }
  startSession(e) {
    if (this.peerConfig = e, this.config.isFlagEnabled(g.ForceTURN) && !this.checkTurnServerAvailability(e)) return l.Info(l.GetStackTrace(), "No turn server was found in the Peer Connection Options. TURN cannot be forced, closing connection. Please use STUN instead"), void this.closeSignalingServer("TURN cannot be forced, closing connection. Please use STUN instead.");
    this.peerConnectionController = new Mr(this.peerConfig, this.config, this.preferredCodec), this.peerConnectionController.onVideoStats = (s) => this.handleVideoStats(s), this.peerConnectionController.onSendWebRTCOffer = (s) => this.handleSendWebRTCOffer(s), this.peerConnectionController.onSendWebRTCAnswer = (s) => this.handleSendWebRTCAnswer(s), this.peerConnectionController.onPeerIceCandidate = (s) => this.handleSendIceCandidate(s), this.peerConnectionController.onDataChannel = (s) => this.handleDataChannel(s), this.peerConnectionController.showTextOverlayConnecting = () => this.pixelStreaming._onWebRtcConnecting(), this.peerConnectionController.showTextOverlaySetupFailure = () => this.pixelStreaming._onWebRtcFailed();
    let t = !1;
    this.peerConnectionController.onIceConnectionStateChange = () => {
      !t && ["connected", "completed"].includes(this.peerConnectionController.peerConnection.iceConnectionState) && (this.pixelStreaming._onWebRtcConnected(), t = !0);
    }, this.peerConnectionController.onTrack = (s) => this.streamController.handleOnTrack(s), this.config.isFlagEnabled(g.BrowserSendOffer) && (this.sendrecvDataChannelController.createDataChannel(this.peerConnectionController.peerConnection, "cirrus", this.datachannelOptions), this.sendrecvDataChannelController.handleOnMessage = (s) => this.handleOnMessage(s), this.peerConnectionController.createOffer(this.sdpConstraints, this.config));
  }
  checkTurnServerAvailability(e) {
    if (!e.iceServers) return l.Info(l.GetStackTrace(), "A turn sever was not found"), !1;
    for (const t of e.iceServers) for (const s of t.urls) if (s.includes("turn")) return l.Log(l.GetStackTrace(), `A turn sever was found at ${s}`), !0;
    return l.Info(l.GetStackTrace(), "A turn sever was not found"), !1;
  }
  handleOnConfigMessage(e) {
    this.resizePlayerStyle(), this.startSession(e.peerConnectionOptions), this.webSocketController.onWebRtcAnswer = (t) => this.handleWebRtcAnswer(t), this.webSocketController.onWebRtcOffer = (t) => this.handleWebRtcOffer(t), this.webSocketController.onWebRtcPeerDataChannels = (t) => this.handleWebRtcSFUPeerDatachannels(t), this.webSocketController.onIceCandidate = (t) => this.handleIceCandidate(t);
  }
  handleStreamerListMessage(e) {
    l.Log(l.GetStackTrace(), `Got streamer list ${e.ids}`, 6);
    const t = [...e.ids];
    t.unshift(""), this.config.setOptionSettingOptions(L.StreamerId, t);
    let s = null, n = null;
    const r = this.config.isFlagEnabled(g.WaitForStreamer), o = this.config.getNumericSettingValue(b.MaxReconnectAttempts), a = this.config.getNumericSettingValue(b.StreamerAutoJoinInterval), d = new URLSearchParams(window.location.search);
    d.has(L.StreamerId) ? s = d.get(L.StreamerId) : this.subscribedStream && (s = this.subscribedStream), s && e.ids.includes(s) ? n = s : s && r || e.ids.length != 1 || (n = e.ids[0]), n ? (this.isReconnecting = !1, this.reconnectAttempt = 0, this.config.setOptionSettingValue(L.StreamerId, n)) : r && (this.reconnectAttempt < o ? (this.isReconnecting = !0, this.reconnectAttempt++, setTimeout(() => {
      this.webSocketController.requestStreamerList();
    }, a)) : (this.reconnectAttempt = 0, this.isReconnecting = !1, this.shouldReconnect = !1)), this.pixelStreaming.dispatchEvent(new Ms({ messageStreamerList: e, autoSelectedStreamerId: n, wantedStreamerId: s }));
  }
  handleWebRtcAnswer(e) {
    l.Log(l.GetStackTrace(), `Got answer sdp ${e.sdp}`, 6);
    const t = { sdp: e.sdp, type: "answer" };
    this.peerConnectionController.receiveAnswer(t), this.handlePostWebrtcNegotiation();
  }
  handleWebRtcOffer(e) {
    l.Log(l.GetStackTrace(), `Got offer sdp ${e.sdp}`, 6), this.isUsingSFU = !!e.sfu && e.sfu, this.isUsingSFU && (this.peerConnectionController.preferredCodec = "");
    const t = { sdp: e.sdp, type: "offer" };
    this.peerConnectionController.receiveOffer(t, this.config), this.handlePostWebrtcNegotiation();
  }
  handleWebRtcSFUPeerDatachannels(e) {
    const t = { ordered: !0, negotiated: !0, id: e.sendStreamId }, s = e.sendStreamId != e.recvStreamId;
    if (this.sendrecvDataChannelController.createDataChannel(this.peerConnectionController.peerConnection, s ? "send-datachannel" : "datachannel", t), s) {
      const n = { ordered: !0, negotiated: !0, id: e.recvStreamId };
      this.recvDataChannelController.createDataChannel(this.peerConnectionController.peerConnection, "recv-datachannel", n), this.recvDataChannelController.handleOnOpen = () => this.webSocketController.sendSFURecvDataChannelReady(), this.recvDataChannelController.handleOnMessage = (r) => this.handleOnMessage(r);
    } else this.sendrecvDataChannelController.handleOnMessage = (n) => this.handleOnMessage(n);
  }
  handlePostWebrtcNegotiation() {
    this.afkController.startAfkWarningTimer(), this.pixelStreaming._onWebRtcSdp(), this.statsTimerHandle && this.statsTimerHandle !== void 0 && window.clearInterval(this.statsTimerHandle), this.statsTimerHandle = window.setInterval(() => this.getStats(), 1e3), this.setMouseInputEnabled(this.config.isFlagEnabled(g.MouseInput)), this.setKeyboardInputEnabled(this.config.isFlagEnabled(g.KeyboardInput)), this.setGamePadInputEnabled(this.config.isFlagEnabled(g.GamepadInput));
  }
  handleIceCandidate(e) {
    l.Log(l.GetStackTrace(), "Web RTC Controller: onWebRtcIce", 6);
    const t = new RTCIceCandidate(e);
    this.peerConnectionController.handleOnIce(t);
  }
  handleSendIceCandidate(e) {
    l.Log(l.GetStackTrace(), "OnIceCandidate", 6), e.candidate && e.candidate.candidate && this.webSocketController.sendIceCandidate(e.candidate);
  }
  handleDataChannel(e) {
    l.Log(l.GetStackTrace(), "Data channel created for us by browser as we are a receiving peer.", 6), this.sendrecvDataChannelController.dataChannel = e.channel, this.sendrecvDataChannelController.setupDataChannel(), this.sendrecvDataChannelController.handleOnMessage = (t) => this.handleOnMessage(t);
  }
  handleSendWebRTCOffer(e) {
    l.Log(l.GetStackTrace(), "Sending the offer to the Server", 6), this.webSocketController.sendWebRtcOffer(e);
  }
  handleSendWebRTCAnswer(e) {
    l.Log(l.GetStackTrace(), "Sending the answer to the Server", 6), this.webSocketController.sendWebRtcAnswer(e), this.isUsingSFU && this.webSocketController.sendWebRtcDatachannelRequest();
  }
  setUpMouseAndFreezeFrame() {
    this.videoElementParentClientRect = this.videoPlayer.getVideoParentElement().getBoundingClientRect(), this.coordinateConverter.setupNormalizeAndQuantize(), this.freezeFrameController.freezeFrame.resize();
  }
  closeSignalingServer(e) {
    var t;
    this.locallyClosed = !0, this.shouldReconnect = !1, this.disconnectMessage = e, (t = this.webSocketController) === null || t === void 0 || t.close();
  }
  closePeerConnection() {
    var e;
    (e = this.peerConnectionController) === null || e === void 0 || e.close();
  }
  close() {
    this.closeSignalingServer(""), this.closePeerConnection();
  }
  getStats() {
    this.peerConnectionController.generateStats();
  }
  sendLatencyTest() {
    this.latencyStartTime = Date.now(), this.streamMessageController.toStreamerHandlers.get("LatencyTest")([JSON.stringify({ StartTime: this.latencyStartTime })]);
  }
  sendDataChannelLatencyTest(e) {
    this.streamMessageController.toStreamerHandlers.get("DataChannelLatencyTest")([JSON.stringify(e)]);
  }
  sendEncoderMinQP(e) {
    l.Log(l.GetStackTrace(), `MinQP=${e}
`, 6), e != null && this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify({ "Encoder.MinQP": e })]);
  }
  sendEncoderMaxQP(e) {
    l.Log(l.GetStackTrace(), `MaxQP=${e}
`, 6), e != null && this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify({ "Encoder.MaxQP": e })]);
  }
  sendWebRTCMinBitrate(e) {
    l.Log(l.GetStackTrace(), `WebRTC Min Bitrate=${e}`, 6), e != null && this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify({ "WebRTC.MinBitrate": e })]);
  }
  sendWebRTCMaxBitrate(e) {
    l.Log(l.GetStackTrace(), `WebRTC Max Bitrate=${e}`, 6), e != null && this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify({ "WebRTC.MaxBitrate": e })]);
  }
  sendWebRTCFps(e) {
    l.Log(l.GetStackTrace(), `WebRTC FPS=${e}`, 6), e != null && (this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify({ "WebRTC.Fps": e })]), this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify({ "WebRTC.MaxFps": e })]));
  }
  sendShowFps() {
    l.Log(l.GetStackTrace(), "----   Sending show stat to UE   ----", 6), this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify({ "stat.fps": "" })]);
  }
  sendIframeRequest() {
    l.Log(l.GetStackTrace(), "----   Sending Request for an IFrame  ----", 6), this.streamMessageController.toStreamerHandlers.get("IFrameRequest")();
  }
  emitUIInteraction(e) {
    l.Log(l.GetStackTrace(), "----   Sending custom UIInteraction message   ----", 6), this.streamMessageController.toStreamerHandlers.get("UIInteraction")([JSON.stringify(e)]);
  }
  emitCommand(e) {
    l.Log(l.GetStackTrace(), "----   Sending custom Command message   ----", 6), this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify(e)]);
  }
  emitConsoleCommand(e) {
    l.Log(l.GetStackTrace(), "----   Sending custom Command:ConsoleCommand message   ----", 6), this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify({ ConsoleCommand: e })]);
  }
  sendRequestQualityControlOwnership() {
    l.Log(l.GetStackTrace(), "----   Sending Request to Control Quality  ----", 6), this.toStreamerMessagesController.SendRequestQualityControl();
  }
  handleLatencyTestResult(e) {
    l.Log(l.GetStackTrace(), "DataChannelReceiveMessageType.latencyTest", 6);
    const t = new TextDecoder("utf-16").decode(e.slice(1)), s = new Vs();
    Object.assign(s, JSON.parse(t)), s.processFields(), s.testStartTimeMs = this.latencyStartTime, s.browserReceiptTimeMs = Date.now(), s.latencyExcludingDecode = ~~(s.browserReceiptTimeMs - s.testStartTimeMs), s.testDuration = ~~(s.TransmissionTimeMs - s.ReceiptTimeMs), s.networkLatency = ~~(s.latencyExcludingDecode - s.testDuration), s.frameDisplayDeltaTimeMs && s.browserReceiptTimeMs && (s.endToEndLatency = (s.frameDisplayDeltaTimeMs, s.networkLatency, ~~+s.CaptureToSendMs)), this.pixelStreaming._onLatencyTestResult(s);
  }
  handleDataChannelLatencyTestResponse(e) {
    l.Log(l.GetStackTrace(), "DataChannelReceiveMessageType.dataChannelLatencyResponse", 6);
    const t = new TextDecoder("utf-16").decode(e.slice(1)), s = JSON.parse(t);
    this.pixelStreaming._onDataChannelLatencyTestResponse(s);
  }
  handleInitialSettings(e) {
    l.Log(l.GetStackTrace(), "DataChannelReceiveMessageType.InitialSettings", 6);
    const t = new TextDecoder("utf-16").decode(e.slice(1)), s = JSON.parse(t), n = new Ns();
    s.Encoder && (n.EncoderSettings = s.Encoder), s.WebRTC && (n.WebRTCSettings = s.WebRTC), s.PixelStreaming && (n.PixelStreamingSettings = s.PixelStreaming), s.ConfigOptions && s.ConfigOptions.DefaultToHover !== void 0 && this.config.setFlagEnabled(g.HoveringMouseMode, !!s.ConfigOptions.DefaultToHover), n.ueCompatible(), l.Log(l.GetStackTrace(), t, 6), this.pixelStreaming._onInitialSettings(n);
  }
  handleVideoEncoderAvgQP(e) {
    l.Log(l.GetStackTrace(), "DataChannelReceiveMessageType.VideoEncoderAvgQP", 6);
    const t = Number(new TextDecoder("utf-16").decode(e.slice(1)));
    this.setVideoEncoderAvgQP(t);
  }
  handleVideoInitialized() {
    this.pixelStreaming._onVideoInitialized(), this.autoPlayVideoOrSetUpPlayOverlay(), this.resizePlayerStyle(), this.videoPlayer.updateVideoStreamSize();
  }
  onQualityControlOwnership(e) {
    const t = new Uint8Array(e);
    l.Log(l.GetStackTrace(), "DataChannelReceiveMessageType.QualityControlOwnership", 6), this.isQualityController = new Boolean(t[1]).valueOf(), l.Log(l.GetStackTrace(), `Received quality controller message, will control quality: ${this.isQualityController}`), this.pixelStreaming._onQualityControlOwnership(this.isQualityController);
  }
  handleVideoStats(e) {
    this.pixelStreaming._onVideoStats(e);
  }
  resizePlayerStyle() {
    this.videoPlayer.resizePlayerStyle();
  }
  setPreferredCodec(e) {
    this.preferredCodec = e, this.peerConnectionController && (this.peerConnectionController.preferredCodec = e, this.peerConnectionController.updateCodecSelection = !1);
  }
  setVideoEncoderAvgQP(e) {
    this.videoAvgQp = e, this.pixelStreaming._onVideoEncoderAvgQP(this.videoAvgQp);
  }
  setKeyboardInputEnabled(e) {
    var t;
    (t = this.keyboardController) === null || t === void 0 || t.unregisterKeyBoardEvents(), e && (this.keyboardController = this.inputClassesFactory.registerKeyBoard(this.config));
  }
  setMouseInputEnabled(e) {
    var t;
    if ((t = this.mouseController) === null || t === void 0 || t.unregisterMouseEvents(), e) {
      const s = this.config.isFlagEnabled(g.HoveringMouseMode) ? te.HoveringMouse : te.LockedMouse;
      this.mouseController = this.inputClassesFactory.registerMouse(s);
    }
  }
  setTouchInputEnabled(e) {
    var t;
    (t = this.touchController) === null || t === void 0 || t.unregisterTouchEvents(), e && (this.touchController = this.inputClassesFactory.registerTouch(this.config.isFlagEnabled(g.FakeMouseWithTouches), this.videoElementParentClientRect));
  }
  setGamePadInputEnabled(e) {
    var t;
    (t = this.gamePadController) === null || t === void 0 || t.unregisterGamePadEvents(), e && (this.gamePadController = this.inputClassesFactory.registerGamePad(), this.gamePadController.onGamepadConnected = () => {
      this.streamMessageController.toStreamerHandlers.get("GamepadConnected")();
    }, this.gamePadController.onGamepadDisconnected = (s) => {
      this.streamMessageController.toStreamerHandlers.get("GamepadDisconnected")([s]);
    });
  }
  registerDataChannelEventEmitters(e) {
    e.onOpen = (t, s) => this.pixelStreaming.dispatchEvent(new us({ label: t, event: s })), e.onClose = (t, s) => this.pixelStreaming.dispatchEvent(new gs({ label: t, event: s })), e.onError = (t, s) => this.pixelStreaming.dispatchEvent(new ms({ label: t, event: s }));
  }
  registerMessageHandler(e, t, s) {
    t === C.FromStreamer && s === void 0 && l.Warning(l.GetStackTrace(), `Unable to register handler for ${e} as no handler was passed`), this.streamMessageController.registerMessageHandler(t, e, (n) => s === void 0 && t === C.ToStreamer ? this.sendMessageController.sendMessageToStreamer(e, n) : s(n));
  }
  injectInputController(e) {
    this.injectInputControllers.push(e([this.streamMessageController, this.videoPlayer, this.coordinateConverter]));
  }
}, Ft = class {
  static vertexShader() {
    return `
		attribute vec2 a_position;
		attribute vec2 a_texCoord;

		// input
		uniform vec2 u_resolution;
		uniform vec4 u_offset;

		//
		varying vec2 v_texCoord;

		void main() {
		   // convert the rectangle from pixels to 0.0 to 1.0
		   vec2 zeroToOne = a_position / u_resolution;

		   // convert from 0->1 to 0->2
		   vec2 zeroToTwo = zeroToOne * 2.0;

		   // convert from 0->2 to -1->+1 (clipspace)
		   vec2 clipSpace = zeroToTwo - 1.0;

		   gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
		   // pass the texCoord to the fragment shader
		   // The GPU will interpolate this value between points.
		   v_texCoord = (a_texCoord * u_offset.xy) + u_offset.zw;
		}
		`;
  }
  static fragmentShader() {
    return `
		precision mediump float;

		// our texture
		uniform sampler2D u_image;

		// the texCoords passed in from the vertex shader.
		varying vec2 v_texCoord;

		void main() {
		   gl_FragColor = texture2D(u_image, v_texCoord);
		}
		`;
  }
}, At = class {
  static deepCopyGamepad(e) {
    return JSON.parse(JSON.stringify({ buttons: e.buttons.map((t) => JSON.parse(JSON.stringify({ pressed: t.pressed, touched: t.touched }))), axes: e.axes }));
  }
}, Vr = class {
  constructor(e) {
    this.toStreamerMessagesProvider = e, this.controllers = [];
  }
  updateStatus(e, t, s) {
    if (e.gamepad) {
      const n = t.getPose(e.gripSpace, s);
      if (!n) return;
      let r = 0;
      e.profiles.includes("htc-vive") ? r = 1 : e.profiles.includes("oculus-touch") && (r = 2), this.toStreamerMessagesProvider.toStreamerHandlers.get("XRSystem")([r]);
      let o = 2;
      switch (e.handedness) {
        case "left":
          o = 0;
          break;
        case "right":
          o = 1;
      }
      const a = n.transform.matrix, d = [];
      for (let p = 0; p < 16; p++) d[p] = new Float32Array([a[p]])[0];
      this.toStreamerMessagesProvider.toStreamerHandlers.get("XRControllerTransform")([d[0], d[4], d[8], d[12], d[1], d[5], d[9], d[13], d[2], d[6], d[10], d[14], d[3], d[7], d[11], d[15], o]), this.controllers[o] === void 0 && (this.controllers[o] = { prevState: void 0, currentState: void 0, id: void 0 }, this.controllers[o].prevState = At.deepCopyGamepad(e.gamepad)), this.controllers[o].currentState = At.deepCopyGamepad(e.gamepad);
      const h = this.controllers[o], u = h.currentState, S = h.prevState;
      for (let p = 0; p < u.buttons.length; p++) {
        const E = u.buttons[p], T = S.buttons[p];
        E.pressed ? this.toStreamerMessagesProvider.toStreamerHandlers.get("XRButtonPressed")([o, p, T.pressed ? 1 : 0]) : !E.pressed && T.pressed && this.toStreamerMessagesProvider.toStreamerHandlers.get("XRButtonReleased")([o, p, 0]), E.touched && !E.pressed ? this.toStreamerMessagesProvider.toStreamerHandlers.get("XRButtonPressed")([o, 3, T.touched ? 1 : 0]) : !E.touched && T.touched && this.toStreamerMessagesProvider.toStreamerHandlers.get("XRButtonReleased")([o, 3, 0]);
      }
      for (let p = 0; p < u.axes.length; p++) this.toStreamerMessagesProvider.toStreamerHandlers.get("XRAnalog")([o, p, u.axes[p]]);
      this.controllers[o].prevState = u;
    }
  }
}, Ks = class {
  constructor(e) {
    this.xrSession = null, this.webRtcController = e, this.xrControllers = [], this.xrGamepadController = new Vr(this.webRtcController.streamMessageController), this.onSessionEnded = new EventTarget(), this.onSessionStarted = new EventTarget(), this.onFrame = new EventTarget();
  }
  xrClicked() {
    this.xrSession ? this.xrSession.end() : navigator.xr.requestSession("immersive-vr").then((e) => {
      this.onXrSessionStarted(e);
    });
  }
  onXrSessionEnded() {
    l.Log(l.GetStackTrace(), "XR Session ended"), this.xrSession = null, this.onSessionEnded.dispatchEvent(new Event("xrSessionEnded"));
  }
  onXrSessionStarted(e) {
    l.Log(l.GetStackTrace(), "XR Session started"), this.xrSession = e, this.xrSession.addEventListener("end", () => {
      this.onXrSessionEnded();
    });
    const t = document.createElement("canvas");
    this.gl = t.getContext("webgl2", { xrCompatible: !0 }), this.xrSession.updateRenderState({ baseLayer: new XRWebGLLayer(this.xrSession, this.gl) });
    const s = this.gl.createShader(this.gl.VERTEX_SHADER);
    this.gl.shaderSource(s, Ft.vertexShader()), this.gl.compileShader(s);
    const n = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    this.gl.shaderSource(n, Ft.fragmentShader()), this.gl.compileShader(n);
    const r = this.gl.createProgram();
    this.gl.attachShader(r, s), this.gl.attachShader(r, n), this.gl.linkProgram(r), this.gl.useProgram(r), this.positionLocation = this.gl.getAttribLocation(r, "a_position"), this.texcoordLocation = this.gl.getAttribLocation(r, "a_texCoord"), this.positionBuffer = this.gl.createBuffer(), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer), this.gl.enableVertexAttribArray(this.positionLocation);
    const o = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, o), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST), this.texcoordBuffer = this.gl.createBuffer(), this.resolutionLocation = this.gl.getUniformLocation(r, "u_resolution"), this.offsetLocation = this.gl.getUniformLocation(r, "u_offset"), e.requestReferenceSpace("local").then((a) => {
      this.xrRefSpace = a, this.xrSession.requestAnimationFrame((d, h) => this.onXrFrame(d, h));
    }), this.onSessionStarted.dispatchEvent(new Event("xrSessionStarted"));
  }
  onXrFrame(e, t) {
    const s = t.getViewerPose(this.xrRefSpace);
    if (s) {
      const n = s.transform.matrix, r = [];
      for (let a = 0; a < 16; a++) r[a] = new Float32Array([n[a]])[0];
      this.webRtcController.streamMessageController.toStreamerHandlers.get("XRHMDTransform")([r[0], r[4], r[8], r[12], r[1], r[5], r[9], r[13], r[2], r[6], r[10], r[14], r[3], r[7], r[11], r[15]]);
      const o = this.xrSession.renderState.baseLayer;
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, o.framebuffer), this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.webRtcController.videoPlayer.getVideoElement()), this.render(this.webRtcController.videoPlayer.getVideoElement());
    }
    this.webRtcController.config.isFlagEnabled(g.XRControllerInput) && this.xrSession.inputSources.forEach((n, r, o) => {
      this.xrGamepadController.updateStatus(n, t, this.xrRefSpace);
    }, this), this.xrSession.requestAnimationFrame((n, r) => this.onXrFrame(n, r)), this.onFrame.dispatchEvent(new Ls({ time: e, frame: t }));
  }
  render(e) {
    if (!this.gl) return;
    const t = this.xrSession.renderState.baseLayer;
    let s, n, r, o, a;
    this.gl.viewport(0, 0, t.framebufferWidth, t.framebufferHeight), this.gl.uniform4f(this.offsetLocation, 1, 1, 0, 0), this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([0, 0, e.videoWidth, 0, 0, e.videoHeight, 0, e.videoHeight, e.videoWidth, 0, e.videoWidth, e.videoHeight]), this.gl.STATIC_DRAW), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texcoordBuffer), this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), this.gl.STATIC_DRAW), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer), s = 2, n = this.gl.FLOAT, r = !1, o = 0, a = 0, this.gl.vertexAttribPointer(this.positionLocation, s, n, r, o, a), this.gl.enableVertexAttribArray(this.texcoordLocation), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texcoordBuffer), s = 2, n = this.gl.FLOAT, r = !1, o = 0, a = 0, this.gl.vertexAttribPointer(this.texcoordLocation, s, n, r, o, a), this.gl.uniform2f(this.resolutionLocation, e.videoWidth, e.videoHeight);
    const d = this.gl.TRIANGLES;
    a = 0, this.gl.drawArrays(d, a, 6);
  }
  static isSessionSupported(e) {
    return navigator.xr ? navigator.xr.isSessionSupported(e) : new Promise(() => !1);
  }
}, $r = class {
  constructor(e) {
    this.editTextButton = null, this.hiddenInput = null, "ontouchstart" in document.documentElement && this.createOnScreenKeyboardHelpers(e);
  }
  unquantizeAndDenormalizeUnsigned(e, t) {
    return null;
  }
  createOnScreenKeyboardHelpers(e) {
    this.hiddenInput || (this.hiddenInput = document.createElement("input"), this.hiddenInput.id = "hiddenInput", this.hiddenInput.maxLength = 0, e.appendChild(this.hiddenInput)), this.editTextButton || (this.editTextButton = document.createElement("button"), this.editTextButton.id = "editTextButton", this.editTextButton.innerHTML = "edit text", e.appendChild(this.editTextButton), this.editTextButton.classList.add("hiddenState"), this.editTextButton.addEventListener("touchend", (t) => {
      this.hiddenInput.focus(), t.preventDefault();
    }));
  }
  showOnScreenKeyboard(e) {
    if (e.showOnScreenKeyboard) {
      this.editTextButton.classList.remove("hiddenState");
      const t = this.unquantizeAndDenormalizeUnsigned(e.x, e.y);
      this.editTextButton.style.top = t.y.toString() + "px", this.editTextButton.style.left = (t.x - 40).toString() + "px";
    } else this.editTextButton.classList.add("hiddenState"), this.hiddenInput.blur();
  }
}, Qr = class {
  constructor(e) {
    this.seq = e.Seq, this.playerSentTimestamp = Date.now(), this.requestFillerSize = e.Filler ? e.Filler.length : 0;
  }
  update(e) {
    this.playerReceivedTimestamp = Date.now(), this.streamerReceivedTimestamp = e.ReceivedTimestamp, this.streamerSentTimestamp = e.SentTimestamp, this.responseFillerSize = e.Filler ? e.Filler.length : 0;
  }
};
class Kr {
  constructor(e, t) {
    this.sink = e, this.callback = t, this.records = /* @__PURE__ */ new Map(), this.seq = 0;
  }
  start(e) {
    return !this.isRunning() && (this.startTime = Date.now(), this.records.clear(), this.interval = setInterval((() => {
      Date.now() - this.startTime >= e.duration ? this.stop() : this.sendRequest(e.requestSize, e.responseSize);
    }).bind(this), Math.floor(1e3 / e.rps)), !0);
  }
  stop() {
    this.interval && (clearInterval(this.interval), this.interval = void 0, this.callback(this.produceResult()));
  }
  produceResult() {
    const e = new Map(this.records);
    return { records: e, dataChannelRtt: Math.ceil(Array.from(this.records.values()).reduce((t, s) => t + (s.playerReceivedTimestamp - s.playerSentTimestamp), 0) / this.records.size), playerToStreamerTime: Math.ceil(Array.from(this.records.values()).reduce((t, s) => t + (s.streamerReceivedTimestamp - s.playerSentTimestamp), 0) / this.records.size), streamerToPlayerTime: Math.ceil(Array.from(this.records.values()).reduce((t, s) => t + (s.playerReceivedTimestamp - s.streamerSentTimestamp), 0) / this.records.size), exportLatencyAsCSV: () => {
      let t = `Timestamp;RTT;PlayerToStreamer;StreamerToPlayer;
`;
      return e.forEach((s) => {
        t += s.playerSentTimestamp + ";", t += s.playerReceivedTimestamp - s.playerSentTimestamp + ";", t += s.streamerReceivedTimestamp - s.playerSentTimestamp + ";", t += s.playerReceivedTimestamp - s.streamerSentTimestamp + ";", t += `
`;
      }), t;
    } };
  }
  isRunning() {
    return !!this.interval;
  }
  receive(e) {
    if (!this.isRunning()) return;
    if (!e) return void l.Error(l.GetStackTrace(), "Undefined response from server");
    let t = this.records.get(e.Seq);
    t && t.update(e);
  }
  sendRequest(e, t) {
    let s = this.createRequest(e, t), n = new Qr(s);
    this.records.set(n.seq, n), this.sink(s);
  }
  createRequest(e, t) {
    return { Seq: this.seq++, FillResponseSize: t, Filler: e ? "A".repeat(e) : "" };
  }
}
let qr = class {
  constructor(e, t) {
    this.allowConsoleCommands = !1, this.config = e, t != null && t.videoElementParent && (this._videoElementParent = t.videoElementParent), this._eventEmitter = new As(), this.configureSettings(), this.setWebRtcPlayerController(new Qs(this.config, this)), this.onScreenKeyboardHelper = new $r(this.videoElementParent), this.onScreenKeyboardHelper.unquantizeAndDenormalizeUnsigned = (s, n) => this._webRtcController.requestUnquantizedAndDenormalizeUnsigned(s, n), this._activateOnScreenKeyboard = (s) => this.onScreenKeyboardHelper.showOnScreenKeyboard(s), this._webXrController = new Ks(this._webRtcController);
  }
  get videoElementParent() {
    return this._videoElementParent || (this._videoElementParent = document.createElement("div"), this._videoElementParent.id = "videoElementParent"), this._videoElementParent;
  }
  configureSettings() {
    this.config._addOnSettingChangedListener(g.IsQualityController, (e) => {
      e !== !0 || this._webRtcController.isQualityController || this._webRtcController.sendRequestQualityControlOwnership();
    }), this.config._addOnSettingChangedListener(g.AFKDetection, (e) => {
      this._webRtcController.setAfkEnabled(e);
    }), this.config._addOnSettingChangedListener(g.MatchViewportResolution, () => {
      this._webRtcController.videoPlayer.updateVideoStreamSize();
    }), this.config._addOnSettingChangedListener(g.HoveringMouseMode, (e) => {
      this.config.setFlagLabel(g.HoveringMouseMode, `Control Scheme: ${e ? "Hovering" : "Locked"} Mouse`), this._webRtcController.setMouseInputEnabled(this.config.isFlagEnabled(g.MouseInput));
    }), this.config._addOnSettingChangedListener(g.KeyboardInput, (e) => {
      this._webRtcController.setKeyboardInputEnabled(e);
    }), this.config._addOnSettingChangedListener(g.MouseInput, (e) => {
      this._webRtcController.setMouseInputEnabled(e);
    }), this.config._addOnSettingChangedListener(g.TouchInput, (e) => {
      this._webRtcController.setTouchInputEnabled(e);
    }), this.config._addOnSettingChangedListener(g.GamepadInput, (e) => {
      this._webRtcController.setGamePadInputEnabled(e);
    }), this.config._addOnNumericSettingChangedListener(b.MinQP, (e) => {
      l.Log(l.GetStackTrace(), "--------  Sending MinQP  --------", 7), this._webRtcController.sendEncoderMinQP(e), l.Log(l.GetStackTrace(), "-------------------------------------------", 7);
    }), this.config._addOnNumericSettingChangedListener(b.MaxQP, (e) => {
      l.Log(l.GetStackTrace(), "--------  Sending encoder settings  --------", 7), this._webRtcController.sendEncoderMaxQP(e), l.Log(l.GetStackTrace(), "-------------------------------------------", 7);
    }), this.config._addOnNumericSettingChangedListener(b.WebRTCMinBitrate, (e) => {
      l.Log(l.GetStackTrace(), "--------  Sending web rtc settings  --------", 7), this._webRtcController.sendWebRTCMinBitrate(1e3 * e), l.Log(l.GetStackTrace(), "-------------------------------------------", 7);
    }), this.config._addOnNumericSettingChangedListener(b.WebRTCMaxBitrate, (e) => {
      l.Log(l.GetStackTrace(), "--------  Sending web rtc settings  --------", 7), this._webRtcController.sendWebRTCMaxBitrate(1e3 * e), l.Log(l.GetStackTrace(), "-------------------------------------------", 7);
    }), this.config._addOnNumericSettingChangedListener(b.WebRTCFPS, (e) => {
      l.Log(l.GetStackTrace(), "--------  Sending web rtc settings  --------", 7), this._webRtcController.sendWebRTCFps(e), l.Log(l.GetStackTrace(), "-------------------------------------------", 7);
    }), this.config._addOnOptionSettingChangedListener(L.PreferredCodec, (e) => {
      this._webRtcController && this._webRtcController.setPreferredCodec(e);
    }), this.config._registerOnChangeEvents(this._eventEmitter);
  }
  _activateOnScreenKeyboard(e) {
    throw new Error("Method not implemented.");
  }
  _onInputControlOwnership(e) {
    this._inputController = e;
  }
  setWebRtcPlayerController(e) {
    this._webRtcController = e, this._webRtcController.setPreferredCodec(this.config.getSettingOption(L.PreferredCodec).selected), this._webRtcController.resizePlayerStyle(), this.checkForAutoConnect();
  }
  connect() {
    this._eventEmitter.dispatchEvent(new fs()), this._webRtcController.connectToSignallingServer();
  }
  reconnect() {
    this._eventEmitter.dispatchEvent(new Cs()), this._webRtcController.tryReconnect("Reconnecting...");
  }
  disconnect() {
    this._eventEmitter.dispatchEvent(new Ss()), this._webRtcController.close();
  }
  play() {
    this._onStreamLoading(), this._webRtcController.playStream();
  }
  checkForAutoConnect() {
    this.config.isFlagEnabled(g.AutoConnect) && (this._onWebRtcAutoConnect(), this._webRtcController.connectToSignallingServer());
  }
  unmuteMicrophone(e = !1) {
    if (!this.config.isFlagEnabled("UseMic")) return e ? (this.config.setFlagEnabled("UseMic", !0), void this.reconnect()) : void l.Warning(l.GetStackTrace(), "Trying to unmute mic, but PixelStreaming was initialized with no microphone track. Call with forceEnable == true to re-connect with a mic track.");
    this.setMicrophoneMuted(!1);
  }
  muteMicrophone() {
    this.config.isFlagEnabled("UseMic") ? this.setMicrophoneMuted(!0) : l.Info(l.GetStackTrace(), "Trying to mute mic, but PixelStreaming has no microphone track, so sending sound is already disabled.");
  }
  setMicrophoneMuted(e) {
    var t, s, n, r;
    for (const o of (r = (n = (s = (t = this._webRtcController) === null || t === void 0 ? void 0 : t.peerConnectionController) === null || s === void 0 ? void 0 : s.peerConnection) === null || n === void 0 ? void 0 : n.getTransceivers()) !== null && r !== void 0 ? r : []) Gs.canTransceiverSendAudio(o) && (o.sender.track.enabled = !e);
  }
  _onWebRtcAutoConnect() {
    this._eventEmitter.dispatchEvent(new as());
  }
  _onWebRtcSdp() {
    this._eventEmitter.dispatchEvent(new os());
  }
  _onStreamLoading() {
    this._eventEmitter.dispatchEvent(new vs());
  }
  _onDisconnect(e, t) {
    this._eventEmitter.dispatchEvent(new hs({ eventString: e, allowClickToReconnect: t }));
  }
  _onWebRtcConnecting() {
    this._eventEmitter.dispatchEvent(new ls());
  }
  _onWebRtcConnected() {
    this._eventEmitter.dispatchEvent(new cs());
  }
  _onWebRtcFailed() {
    this._eventEmitter.dispatchEvent(new ds());
  }
  _onVideoInitialized() {
    this._eventEmitter.dispatchEvent(new ps()), this._videoStartTime = Date.now();
  }
  _onLatencyTestResult(e) {
    this._eventEmitter.dispatchEvent(new Rs({ latencyTimings: e }));
  }
  _onDataChannelLatencyTestResponse(e) {
    this._eventEmitter.dispatchEvent(new Ps({ response: e }));
  }
  _onVideoStats(e) {
    this._videoStartTime && this._videoStartTime !== void 0 || (this._videoStartTime = Date.now()), e.handleSessionStatistics(this._videoStartTime, this._inputController, this._webRtcController.videoAvgQp), this._eventEmitter.dispatchEvent(new ws({ aggregatedStats: e }));
  }
  _onVideoEncoderAvgQP(e) {
    this._eventEmitter.dispatchEvent(new is({ avgQP: e }));
  }
  _onInitialSettings(e) {
    var t;
    this._eventEmitter.dispatchEvent(new xs({ settings: e })), e.PixelStreamingSettings && (this.allowConsoleCommands = (t = e.PixelStreamingSettings.AllowPixelStreamingCommands) !== null && t !== void 0 && t, this.allowConsoleCommands === !1 && l.Info(l.GetStackTrace(), "-AllowPixelStreamingCommands=false, sending arbitrary console commands from browser to UE is disabled."));
    const s = this.config.useUrlParams, n = new URLSearchParams(window.location.search);
    e.EncoderSettings && (this.config.setNumericSetting(b.MinQP, s && n.has(b.MinQP) ? Number.parseInt(n.get(b.MinQP)) : e.EncoderSettings.MinQP), this.config.setNumericSetting(b.MaxQP, s && n.has(b.MaxQP) ? Number.parseInt(n.get(b.MaxQP)) : e.EncoderSettings.MaxQP)), e.WebRTCSettings && (this.config.setNumericSetting(b.WebRTCMinBitrate, s && n.has(b.WebRTCMinBitrate) ? Number.parseInt(n.get(b.WebRTCMinBitrate)) : e.WebRTCSettings.MinBitrate / 1e3), this.config.setNumericSetting(b.WebRTCMaxBitrate, s && n.has(b.WebRTCMaxBitrate) ? Number.parseInt(n.get(b.WebRTCMaxBitrate)) : e.WebRTCSettings.MaxBitrate / 1e3), this.config.setNumericSetting(b.WebRTCFPS, s && n.has(b.WebRTCFPS) ? Number.parseInt(n.get(b.WebRTCFPS)) : e.WebRTCSettings.FPS));
  }
  _onQualityControlOwnership(e) {
    this.config.setFlagEnabled(g.IsQualityController, e);
  }
  _onPlayerCount(e) {
    this._eventEmitter.dispatchEvent(new Fs({ count: e }));
  }
  requestLatencyTest() {
    return !!this._webRtcController.videoPlayer.isVideoReady() && (this._webRtcController.sendLatencyTest(), !0);
  }
  requestDataChannelLatencyTest(e) {
    return !!this._webRtcController.videoPlayer.isVideoReady() && (this._dataChannelLatencyTestController || (this._dataChannelLatencyTestController = new Kr(this._webRtcController.sendDataChannelLatencyTest.bind(this._webRtcController), (t) => {
      this._eventEmitter.dispatchEvent(new ks({ result: t }));
    }), this.addEventListener("dataChannelLatencyTestResponse", ({ data: { response: t } }) => {
      this._dataChannelLatencyTestController.receive(t);
    })), this._dataChannelLatencyTestController.start(e));
  }
  requestShowFps() {
    return !!this._webRtcController.videoPlayer.isVideoReady() && (this._webRtcController.sendShowFps(), !0);
  }
  requestIframe() {
    return !!this._webRtcController.videoPlayer.isVideoReady() && (this._webRtcController.sendIframeRequest(), !0);
  }
  emitUIInteraction(e) {
    return !!this._webRtcController.videoPlayer.isVideoReady() && (this._webRtcController.emitUIInteraction(e), !0);
  }
  emitCommand(e) {
    return !(!this._webRtcController.videoPlayer.isVideoReady() || !this.allowConsoleCommands && "ConsoleCommand" in e || (this._webRtcController.emitCommand(e), 0));
  }
  emitConsoleCommand(e) {
    return !(!this.allowConsoleCommands || !this._webRtcController.videoPlayer.isVideoReady() || (this._webRtcController.emitConsoleCommand(e), 0));
  }
  addResponseEventListener(e, t) {
    this._webRtcController.responseController.addResponseEventListener(e, t);
  }
  removeResponseEventListener(e) {
    this._webRtcController.responseController.removeResponseEventListener(e);
  }
  dispatchEvent(e) {
    return this._eventEmitter.dispatchEvent(e);
  }
  addEventListener(e, t) {
    this._eventEmitter.addEventListener(e, t);
  }
  removeEventListener(e, t) {
    this._eventEmitter.removeEventListener(e, t);
  }
  toggleXR() {
    this.webXrController.xrClicked();
  }
  setSignallingUrlBuilder(e) {
    this._webRtcController.signallingUrlBuilder = e;
  }
  get webSocketController() {
    return this._webRtcController.webSocketController;
  }
  get webXrController() {
    return this._webXrController;
  }
  registerMessageHandler(e, t, s) {
    t !== C.FromStreamer || s !== void 0 ? t === C.ToStreamer && s === void 0 ? this._webRtcController.streamMessageController.registerMessageHandler(t, e, (n) => this._webRtcController.sendMessageController.sendMessageToStreamer(e, n)) : this._webRtcController.streamMessageController.registerMessageHandler(t, e, (n) => s(n)) : l.Warning(l.GetStackTrace(), `Unable to register an undefined handler for ${e}`);
  }
  get toStreamerHandlers() {
    return this._webRtcController.streamMessageController.toStreamerHandlers;
  }
  isReconnecting() {
    return this._webRtcController.isReconnecting;
  }
  injectInputControllers(e) {
    for (const t of e) this._webRtcController.injectInputController(t);
  }
};
v.D6;
v.Kr;
v.mC;
v.jr;
v.S_;
v.Ff;
v.Hp;
v.yC;
var jr = v.TS;
v.Bs;
v.CE;
v.EQ;
v.Fh;
v.L7;
v.ys;
v.Lm;
v.Cx;
var Xr = v.bk, ie = v.iI;
v.RW;
v.$o;
v.IR;
v.C9;
v.EG;
v.Cc;
v.ZS;
v.vx;
v.Vy;
v.Tt;
v.e4;
v.EW;
v.DQ;
v.k$;
var Jr = v.mY;
v.D4;
var Yr = v.z3;
v.vL;
v.Lz;
v.FJ;
v.d2;
v.Eo;
v.kR;
v.UW;
v.GZ;
v.cZ;
v.Si;
v.ty;
v.d_;
v.Bg;
v.QR;
v.y6;
v.iu;
v.oK;
v.jG;
var Zr = v.gw;
v.rx;
v.x1;
v.Qy;
v.bJ;
v.nV;
v.d4;
v.Ys;
v.Nu;
v.tv;
v.n7;
v.xV;
v.eU;
v.R3;
v.qM;
v.HH;
v.ev;
var Q, _, ze = { d: (i, e) => {
  for (var t in e) ze.o(e, t) && !ze.o(i, t) && Object.defineProperty(i, t, { enumerable: !0, get: e[t] });
}, o: (i, e) => Object.prototype.hasOwnProperty.call(i, e) }, f = {};
ze.d(f, { Dz: () => xn, g$: () => Zs, Lt: () => Js, Q9: () => Ys, qf: () => dt, hV: () => Dn, z$: () => On, J0: () => ut, De: () => Ci, $C: () => ne, al: () => cn, _W: () => dn, Gv: () => bn, m: () => wn, tz: () => ln, Nu: () => An, zg: () => zn, vp: () => kn, vU: () => m, wF: () => Cn, rv: () => Ln, Nh: () => Fn, ss: () => Un, qW: () => Mn, QL: () => Tn, cf: () => Gn, eM: () => Sn, Yd: () => c, Tk: () => y, iM: () => qs, qy: () => Y, ce: () => ci, sK: () => w, Ok: () => A, q5: () => In, g: () => Qi, xl: () => vn, I: () => fn, bx: () => ht, dD: () => Pn, Ib: () => ke, Az: () => I, Iw: () => X, qY: () => ct, db: () => Xs, mR: () => ve, Tn: () => lt, rV: () => yn, gh: () => un, Mi: () => gn, j: () => mn, YB: () => pn, i5: () => En, x_: () => se, Am: () => gt, eR: () => en, r8: () => hn, u3: () => Bn, vd: () => sn, iV: () => rn, jZ: () => nn, SW: () => an, ZH: () => on, Ni: () => Nn, lh: () => tn, bq: () => js, $f: () => Hn, eu: () => Rn, Ax: () => mi, Mc: () => gi });
let c = class {
  static GetStackTrace() {
    const e = new Error();
    let t = "No Stack Available for this browser";
    return e.stack && (t = e.stack.toString().replace(/Error/g, "")), t;
  }
  static SetLoggerVerbosity(e) {
    this.verboseLogLevel != null && (this.verboseLogLevel = e);
  }
  static Log(e, t, s) {
    if (s > this.verboseLogLevel) return;
    const n = `Level: Log
Msg: ${t}
Caller: ${e}`;
    console.log(n);
  }
  static Info(e, t, s) {
    if (s > this.verboseLogLevel) return;
    const n = `Level: Info
Msg: ${t}`;
    console.info(n);
  }
  static Error(e, t) {
    const s = `Level: Error
Msg: ${t}
Caller: ${e}`;
    console.error(s);
  }
  static Warning(e, t) {
    const s = `Level: Warning
Caller: ${e}
Msg: ${t}`;
    console.warn(s);
  }
};
c.verboseLogLevel = 5, function(i) {
  i.LIST_STREAMERS = "listStreamers", i.SUBSCRIBE = "subscribe", i.UNSUBSCRIBE = "unsubscribe", i.ICE_CANDIDATE = "iceCandidate", i.OFFER = "offer", i.ANSWER = "answer", i.DATACHANNELREQUEST = "dataChannelRequest", i.SFURECVDATACHANNELREADY = "peerDataChannelsReady", i.PONG = "pong";
}(Q || (Q = {}));
let Y = class {
  payload() {
    return c.Log(c.GetStackTrace(), `Sending => 
` + JSON.stringify(this, void 0, 4), 6), JSON.stringify(this);
  }
}, ei = class extends Y {
  constructor() {
    super(), this.type = Q.LIST_STREAMERS;
  }
}, ti = class extends Y {
  constructor(e) {
    super(), this.type = Q.SUBSCRIBE, this.streamerId = e;
  }
}, si = class extends Y {
  constructor() {
    super(), this.type = Q.UNSUBSCRIBE;
  }
}, ni = class extends Y {
  constructor(e) {
    super(), this.type = Q.PONG, this.time = e;
  }
}, ri = class extends Y {
  constructor(e) {
    super(), this.type = Q.OFFER, e && (this.type = e.type, this.sdp = e.sdp);
  }
}, ii = class extends Y {
  constructor(e) {
    super(), this.type = Q.ANSWER, e && (this.type = e.type, this.sdp = e.sdp);
  }
}, oi = class extends Y {
  constructor() {
    super(), this.type = Q.DATACHANNELREQUEST;
  }
}, ai = class extends Y {
  constructor() {
    super(), this.type = Q.SFURECVDATACHANNELREADY;
  }
}, li = class {
  constructor(e) {
    this.type = Q.ICE_CANDIDATE, this.candidate = e;
  }
  payload() {
    return c.Log(c.GetStackTrace(), `Sending => 
` + JSON.stringify(this, void 0, 4), 6), JSON.stringify(this);
  }
};
(function(i) {
  i.CONFIG = "config", i.STREAMER_LIST = "streamerList", i.PLAYER_COUNT = "playerCount", i.OFFER = "offer", i.ANSWER = "answer", i.ICE_CANDIDATE = "iceCandidate", i.PEER_DATA_CHANNELS = "peerDataChannels", i.PING = "ping", i.WARNING = "warning";
})(_ || (_ = {}));
let qs = class {
}, ci = class extends qs {
}, lt = class {
  constructor() {
    this.FromUEMessageHandlers = /* @__PURE__ */ new Map();
  }
  addMessageHandler(e, t) {
    this.FromUEMessageHandlers.set(e, t);
  }
  handleMessage(e, t) {
    this.FromUEMessageHandlers.has(e) ? this.FromUEMessageHandlers.get(e)(t) : c.Error(c.GetStackTrace(), `Message type of ${e} does not have a message handler registered on the frontend - ignoring message.`);
  }
  static setupDefaultHandlers(e) {
    e.signallingProtocol.addMessageHandler(_.PING, (t) => {
      const s = new ni((/* @__PURE__ */ new Date()).getTime()).payload();
      c.Log(c.GetStackTrace(), _.PING + ": " + t, 6), e.webSocket.send(s);
    }), e.signallingProtocol.addMessageHandler(_.CONFIG, (t) => {
      c.Log(c.GetStackTrace(), _.CONFIG, 6);
      const s = JSON.parse(t);
      e.onConfig(s);
    }), e.signallingProtocol.addMessageHandler(_.STREAMER_LIST, (t) => {
      c.Log(c.GetStackTrace(), _.STREAMER_LIST, 6);
      const s = JSON.parse(t);
      e.onStreamerList(s);
    }), e.signallingProtocol.addMessageHandler(_.PLAYER_COUNT, (t) => {
      c.Log(c.GetStackTrace(), _.PLAYER_COUNT, 6);
      const s = JSON.parse(t);
      c.Log(c.GetStackTrace(), "Player Count: " + s.count, 6), e.onPlayerCount(s);
    }), e.signallingProtocol.addMessageHandler(_.ANSWER, (t) => {
      c.Log(c.GetStackTrace(), _.ANSWER, 6);
      const s = JSON.parse(t);
      e.onWebRtcAnswer(s);
    }), e.signallingProtocol.addMessageHandler(_.OFFER, (t) => {
      c.Log(c.GetStackTrace(), _.OFFER, 6);
      const s = JSON.parse(t);
      e.onWebRtcOffer(s);
    }), e.signallingProtocol.addMessageHandler(_.ICE_CANDIDATE, (t) => {
      c.Log(c.GetStackTrace(), _.ICE_CANDIDATE, 6);
      const s = JSON.parse(t);
      e.onIceCandidate(s.candidate);
    }), e.signallingProtocol.addMessageHandler(_.WARNING, (t) => {
      c.Warning(c.GetStackTrace(), `Warning received: ${t}`);
    }), e.signallingProtocol.addMessageHandler(_.PEER_DATA_CHANNELS, (t) => {
      c.Log(c.GetStackTrace(), _.PEER_DATA_CHANNELS, 6);
      const s = JSON.parse(t);
      e.onWebRtcPeerDataChannels(s);
    });
  }
}, js = class {
  constructor() {
    this.WS_OPEN_STATE = 1, this.onOpen = new EventTarget(), this.onClose = new EventTarget(), this.signallingProtocol = new lt(), lt.setupDefaultHandlers(this);
  }
  connect(e) {
    c.Log(c.GetStackTrace(), e, 6);
    try {
      return this.webSocket = new WebSocket(e), this.webSocket.onopen = (t) => this.handleOnOpen(t), this.webSocket.onerror = () => this.handleOnError(), this.webSocket.onclose = (t) => this.handleOnClose(t), this.webSocket.onmessage = (t) => this.handleOnMessage(t), this.webSocket.onmessagebinary = (t) => this.handleOnMessageBinary(t), !0;
    } catch (t) {
      return c.Error(t, t), !1;
    }
  }
  handleOnMessageBinary(e) {
    e && e.data && e.data.text().then((t) => {
      const s = new MessageEvent("messageFromBinary", { data: t });
      this.handleOnMessage(s);
    }).catch((t) => {
      c.Error(c.GetStackTrace(), `Failed to parse binary blob from websocket, reason: ${t}`);
    });
  }
  handleOnMessage(e) {
    if (e.data && e.data instanceof Blob) return void this.handleOnMessageBinary(e);
    const t = JSON.parse(e.data);
    c.Log(c.GetStackTrace(), `received => 
` + JSON.stringify(JSON.parse(e.data), void 0, 4), 6), this.signallingProtocol.handleMessage(t.type, e.data);
  }
  handleOnOpen(e) {
    c.Log(c.GetStackTrace(), "Connected to the signalling server via WebSocket", 6), this.onOpen.dispatchEvent(new Event("open"));
  }
  handleOnError() {
    c.Error(c.GetStackTrace(), "WebSocket error");
  }
  handleOnClose(e) {
    c.Log(c.GetStackTrace(), "Disconnected to the signalling server via WebSocket: " + JSON.stringify(e.code) + " - " + e.reason), this.onClose.dispatchEvent(new CustomEvent("close", { detail: e }));
  }
  requestStreamerList() {
    const e = new ei();
    this.webSocket.send(e.payload());
  }
  sendSubscribe(e) {
    const t = new ti(e);
    this.webSocket.send(t.payload());
  }
  sendUnsubscribe() {
    const e = new si();
    this.webSocket.send(e.payload());
  }
  sendWebRtcOffer(e) {
    const t = new ri(e);
    this.webSocket.send(t.payload());
  }
  sendWebRtcAnswer(e) {
    const t = new ii(e);
    this.webSocket.send(t.payload());
  }
  sendWebRtcDatachannelRequest() {
    const e = new oi();
    this.webSocket.send(e.payload());
  }
  sendSFURecvDataChannelReady() {
    const e = new ai();
    this.webSocket.send(e.payload());
  }
  sendIceCandidate(e) {
    if (c.Log(c.GetStackTrace(), "Sending Ice Candidate"), this.webSocket && this.webSocket.readyState === this.WS_OPEN_STATE) {
      const t = new li(e);
      this.webSocket.send(t.payload());
    }
  }
  close() {
    var e;
    (e = this.webSocket) === null || e === void 0 || e.close();
  }
  onConfig(e) {
  }
  onStreamerList(e) {
  }
  onIceCandidate(e) {
  }
  onWebRtcAnswer(e) {
  }
  onWebRtcOffer(e) {
  }
  onWebRtcPeerDataChannels(e) {
  }
  onPlayerCount(e) {
  }
}, di = class {
  constructor(e) {
    this.videoElementProvider = e, this.audioElement = document.createElement("Audio"), this.videoElementProvider.setAudioElement(this.audioElement);
  }
  handleOnTrack(e) {
    if (c.Log(c.GetStackTrace(), "handleOnTrack " + JSON.stringify(e.streams), 6), e.track.id == "probator") return;
    const t = this.videoElementProvider.getVideoElement();
    if (e.track && c.Log(c.GetStackTrace(), "Got track - " + e.track.kind + " id=" + e.track.id + " readyState=" + e.track.readyState, 6), e.track.kind != "audio") return e.track.kind == "video" && t.srcObject !== e.streams[0] ? (t.srcObject = e.streams[0], void c.Log(c.GetStackTrace(), "Set video source from video track ontrack.")) : void 0;
    this.CreateAudioTrack(e.streams[0]);
  }
  CreateAudioTrack(e) {
    const t = this.videoElementProvider.getVideoElement();
    t.srcObject != e && t.srcObject && t.srcObject !== e && (this.audioElement.srcObject = e, c.Log(c.GetStackTrace(), "Created new audio element to play separate audio stream."));
  }
}, hi = class {
  constructor(e) {
    this.freezeFrameHeight = 0, this.freezeFrameWidth = 0, this.rootDiv = e, this.rootElement = document.createElement("div"), this.rootElement.id = "freezeFrame", this.rootElement.style.display = "none", this.rootElement.style.pointerEvents = "none", this.rootElement.style.position = "absolute", this.rootElement.style.zIndex = "20", this.imageElement = document.createElement("img"), this.imageElement.style.position = "absolute", this.rootElement.appendChild(this.imageElement), this.rootDiv.appendChild(this.rootElement);
  }
  setElementForShow() {
    this.rootElement.style.display = "block";
  }
  setElementForHide() {
    this.rootElement.style.display = "none";
  }
  updateImageElementSource(e) {
    const t = btoa(e.reduce((s, n) => s + String.fromCharCode(n), ""));
    this.imageElement.src = "data:image/jpeg;base64," + t;
  }
  setDimensionsFromElementAndResize() {
    this.freezeFrameHeight = this.imageElement.naturalHeight, this.freezeFrameWidth = this.imageElement.naturalWidth, this.resize();
  }
  resize() {
    if (this.freezeFrameWidth !== 0 && this.freezeFrameHeight !== 0) {
      let e = 0, t = 0, s = 0, n = 0;
      const r = this.rootDiv.clientWidth / this.rootDiv.clientHeight, o = this.freezeFrameWidth / this.freezeFrameHeight;
      r < o ? (e = this.rootDiv.clientWidth, t = Math.floor(this.rootDiv.clientWidth / o), s = Math.floor(0.5 * (this.rootDiv.clientHeight - t)), n = 0) : (e = Math.floor(this.rootDiv.clientHeight * o), t = this.rootDiv.clientHeight, s = 0, n = Math.floor(0.5 * (this.rootDiv.clientWidth - e))), this.rootElement.style.width = this.rootDiv.offsetWidth + "px", this.rootElement.style.height = this.rootDiv.offsetHeight + "px", this.rootElement.style.left = "0px", this.rootElement.style.top = "0px", this.imageElement.style.width = e + "px", this.imageElement.style.height = t + "px", this.imageElement.style.left = n + "px", this.imageElement.style.top = s + "px";
    }
  }
}, ui = class {
  constructor(e) {
    this.receiving = !1, this.size = 0, this.jpeg = void 0, this.valid = !1, this.freezeFrameDelay = 50, this.freezeFrame = new hi(e);
  }
  showFreezeFrame() {
    this.valid && this.freezeFrame.setElementForShow();
  }
  hideFreezeFrame() {
    this.valid = !1, this.freezeFrame.setElementForHide();
  }
  updateFreezeFrameAndShow(e, t) {
    this.freezeFrame.updateImageElementSource(e), this.freezeFrame.imageElement.onload = () => {
      this.freezeFrame.setDimensionsFromElementAndResize(), t();
    };
  }
  processFreezeFrameMessage(e, t) {
    this.receiving || (this.receiving = !0, this.valid = !1, this.size = 0, this.jpeg = void 0), this.size = new DataView(e.slice(1, 5).buffer).getInt32(0, !0);
    const s = e.slice(5);
    if (this.jpeg) {
      const n = new Uint8Array(this.jpeg.length + s.length);
      n.set(this.jpeg, 0), n.set(s, this.jpeg.length), this.jpeg = n;
    } else this.jpeg = s, this.receiving = !0, c.Log(c.GetStackTrace(), `received first chunk of freeze frame: ${this.jpeg.length}/${this.size}`, 6);
    this.jpeg.length === this.size ? (this.receiving = !1, this.valid = !0, c.Log(c.GetStackTrace(), `received complete freeze frame ${this.size}`, 6), this.updateFreezeFrameAndShow(this.jpeg, t)) : this.jpeg.length > this.size && (c.Error(c.GetStackTrace(), `received bigger freeze frame than advertised: ${this.jpeg.length}/${this.size}`), this.jpeg = void 0, this.receiving = !1);
  }
}, ke = class {
  constructor(e, t, s, n, r = () => {
  }) {
    this.onChange = r, this.onChangeEmit = () => {
    }, this.id = e, this.description = s, this.label = t, this.value = n;
  }
  set label(e) {
    this._label = e, this.onChangeEmit(this._value);
  }
  get label() {
    return this._label;
  }
  get value() {
    return this._value;
  }
  set value(e) {
    this._value = e, this.onChange(this._value, this), this.onChangeEmit(this._value);
  }
}, I = class extends ke {
  constructor(e, t, s, n, r, o = () => {
  }) {
    super(e, t, s, n, o);
    const a = new URLSearchParams(window.location.search);
    if (r && a.has(this.id)) {
      const d = this.getUrlParamFlag();
      this.flag = d;
    } else this.flag = n;
    this.useUrlParams = r;
  }
  getUrlParamFlag() {
    const e = new URLSearchParams(window.location.search);
    return !!e.has(this.id) && e.get(this.id) !== "false" && e.get(this.id) !== "False";
  }
  updateURLParams() {
    if (this.useUrlParams) {
      const e = new URLSearchParams(window.location.search);
      this.flag === !0 ? e.set(this.id, "true") : e.set(this.id, "false"), window.history.replaceState({}, "", e.toString() !== "" ? `${location.pathname}?${e}` : `${location.pathname}`);
    }
  }
  enable() {
    this.flag = !0;
  }
  get flag() {
    return !!this.value;
  }
  set flag(e) {
    this.value = e;
  }
}, X = class extends ke {
  constructor(e, t, s, n, r, o, a, d = () => {
  }) {
    super(e, t, s, o, d), this._min = n, this._max = r;
    const h = new URLSearchParams(window.location.search);
    if (a && h.has(this.id)) {
      const u = Number.parseInt(h.get(this.id));
      this.number = Number.isNaN(u) ? o : u;
    } else this.number = o;
    this.useUrlParams = a;
  }
  updateURLParams() {
    if (this.useUrlParams) {
      const e = new URLSearchParams(window.location.search);
      e.set(this.id, this.number.toString()), window.history.replaceState({}, "", e.toString() !== "" ? `${location.pathname}?${e}` : `${location.pathname}`);
    }
  }
  set number(e) {
    this.value = this.clamp(e);
  }
  get number() {
    return this.value;
  }
  clamp(e) {
    return Math.max(Math.min(this._max, e), this._min);
  }
  get min() {
    return this._min;
  }
  get max() {
    return this._max;
  }
  addOnChangedListener(e) {
    this.onChange = e;
  }
}, Xs = class extends ke {
  constructor(e, t, s, n, r, o = () => {
  }) {
    super(e, t, s, n, o);
    const a = new URLSearchParams(window.location.search);
    if (r && a.has(this.id)) {
      const d = this.getUrlParamText();
      this.text = d;
    } else this.text = n;
    this.useUrlParams = r;
  }
  getUrlParamText() {
    var e;
    const t = new URLSearchParams(window.location.search);
    return t.has(this.id) && (e = t.get(this.id)) !== null && e !== void 0 ? e : "";
  }
  updateURLParams() {
    if (this.useUrlParams) {
      const e = new URLSearchParams(window.location.search);
      e.set(this.id, this.text), window.history.replaceState({}, "", e.toString() !== "" ? `${location.pathname}?${e}` : `${location.pathname}`);
    }
  }
  get text() {
    return this.value;
  }
  set text(e) {
    this.value = e;
  }
}, ct = class extends ke {
  constructor(e, t, s, n, r, o, a = () => {
  }) {
    super(e, t, s, [n, n], a), this.options = r;
    const d = new URLSearchParams(window.location.search), h = o && d.has(this.id) ? this.getUrlParamText() : n;
    this.selected = h, this.useUrlParams = o;
  }
  getUrlParamText() {
    var e;
    const t = new URLSearchParams(window.location.search);
    return t.has(this.id) && (e = t.get(this.id)) !== null && e !== void 0 ? e : "";
  }
  updateURLParams() {
    if (this.useUrlParams) {
      const e = new URLSearchParams(window.location.search);
      e.set(this.id, this.selected), window.history.replaceState({}, "", e.toString() !== "" ? `${location.pathname}?${e}` : `${location.pathname}`);
    }
  }
  addOnChangedListener(e) {
    this.onChange = e;
  }
  get options() {
    return this._options;
  }
  set options(e) {
    this._options = e, this.onChangeEmit(this.selected);
  }
  get selected() {
    return this.value;
  }
  set selected(e) {
    let t = this.options.filter((s) => s.indexOf(e) !== -1);
    t.length ? this.value = t[0] : (t = this.options.filter((s) => s.indexOf(e.split(" ")[0]) !== -1), t.length && (this.value = t[0]));
  }
}, Js = class extends Event {
  constructor(e) {
    super("afkWarningActivate"), this.data = e;
  }
}, dt = class extends Event {
  constructor(e) {
    super("afkWarningUpdate"), this.data = e;
  }
}, Ys = class extends Event {
  constructor() {
    super("afkWarningDeactivate");
  }
}, Zs = class extends Event {
  constructor() {
    super("afkTimedOut");
  }
}, en = class extends Event {
  constructor(e) {
    super("videoEncoderAvgQP"), this.data = e;
  }
}, tn = class extends Event {
  constructor() {
    super("webRtcSdp");
  }
}, sn = class extends Event {
  constructor() {
    super("webRtcAutoConnect");
  }
}, nn = class extends Event {
  constructor() {
    super("webRtcConnecting");
  }
}, rn = class extends Event {
  constructor() {
    super("webRtcConnected");
  }
}, on = class extends Event {
  constructor() {
    super("webRtcFailed");
  }
}, an = class extends Event {
  constructor(e) {
    super("webRtcDisconnected"), this.data = e;
  }
}, ln = class extends Event {
  constructor(e) {
    super("dataChannelOpen"), this.data = e;
  }
}, cn = class extends Event {
  constructor(e) {
    super("dataChannelClose"), this.data = e;
  }
}, dn = class extends Event {
  constructor(e) {
    super("dataChannelError"), this.data = e;
  }
}, hn = class extends Event {
  constructor() {
    super("videoInitialized");
  }
};
class un extends Event {
  constructor() {
    super("streamLoading");
  }
}
let gn = class extends Event {
  constructor() {
    super("streamConnect");
  }
};
class mn extends Event {
  constructor() {
    super("streamDisconnect");
  }
}
let pn = class extends Event {
  constructor() {
    super("streamReconnect");
  }
}, vn = class extends Event {
  constructor(e) {
    super("playStreamError"), this.data = e;
  }
};
class fn extends Event {
  constructor() {
    super("playStream");
  }
}
let ht = class extends Event {
  constructor(e) {
    super("playStreamRejected"), this.data = e;
  }
}, Sn = class extends Event {
  constructor(e) {
    super("loadFreezeFrame"), this.data = e;
  }
};
class Cn extends Event {
  constructor() {
    super("hideFreezeFrame");
  }
}
class yn extends Event {
  constructor(e) {
    super("statsReceived"), this.data = e;
  }
}
let En = class extends Event {
  constructor(e) {
    super("streamerListMessage"), this.data = e;
  }
};
class Tn extends Event {
  constructor(e) {
    super("latencyTestResult"), this.data = e;
  }
}
class bn extends Event {
  constructor(e) {
    super("dataChannelLatencyTestResponse"), this.data = e;
  }
}
class wn extends Event {
  constructor(e) {
    super("dataChannelLatencyTestResult"), this.data = e;
  }
}
class Mn extends Event {
  constructor(e) {
    super("initialSettings"), this.data = e;
  }
}
class ve extends Event {
  constructor(e) {
    super("settingsChanged"), this.data = e;
  }
}
class gi extends Event {
  constructor() {
    super("xrSessionStarted");
  }
}
class mi extends Event {
  constructor() {
    super("xrSessionEnded");
  }
}
class Rn extends Event {
  constructor(e) {
    super("xrFrame"), this.data = e;
  }
}
class Pn extends Event {
  constructor(e) {
    super("playerCount"), this.data = e;
  }
}
class kn extends EventTarget {
  dispatchEvent(e) {
    return super.dispatchEvent(e);
  }
  addEventListener(e, t) {
    super.addEventListener(e, t);
  }
  removeEventListener(e, t) {
    super.removeEventListener(e, t);
  }
}
class m {
}
m.AutoConnect = "AutoConnect", m.AutoPlayVideo = "AutoPlayVideo", m.AFKDetection = "TimeoutIfIdle", m.BrowserSendOffer = "OfferToReceive", m.HoveringMouseMode = "HoveringMouse", m.ForceMonoAudio = "ForceMonoAudio", m.ForceTURN = "ForceTURN", m.FakeMouseWithTouches = "FakeMouseWithTouches", m.IsQualityController = "ControlsQuality", m.MatchViewportResolution = "MatchViewportRes", m.StartVideoMuted = "StartVideoMuted", m.SuppressBrowserKeys = "SuppressBrowserKeys", m.UseMic = "UseMic", m.KeyboardInput = "KeyboardInput", m.MouseInput = "MouseInput", m.TouchInput = "TouchInput", m.GamepadInput = "GamepadInput", m.XRControllerInput = "XRControllerInput", m.WaitForStreamer = "WaitForStreamer";
const pi = (i) => Object.getOwnPropertyNames(m).some((e) => m[e] === i);
class w {
}
w.AFKTimeoutSecs = "AFKTimeout", w.MinQP = "MinQP", w.MaxQP = "MaxQP", w.WebRTCFPS = "WebRTCFPS", w.WebRTCMinBitrate = "WebRTCMinBitrate", w.WebRTCMaxBitrate = "WebRTCMaxBitrate", w.MaxReconnectAttempts = "MaxReconnectAttempts", w.StreamerAutoJoinInterval = "StreamerAutoJoinInterval";
const vi = (i) => Object.getOwnPropertyNames(w).some((e) => w[e] === i);
class se {
}
se.SignallingServerUrl = "ss";
const fi = (i) => Object.getOwnPropertyNames(se).some((e) => se[e] === i);
class A {
}
A.PreferredCodec = "PreferredCodec", A.StreamerId = "StreamerId";
const Si = (i) => Object.getOwnPropertyNames(A).some((e) => A[e] === i);
class Ci {
  constructor(e = {}) {
    this.flags = /* @__PURE__ */ new Map(), this.numericParameters = /* @__PURE__ */ new Map(), this.textParameters = /* @__PURE__ */ new Map(), this.optionParameters = /* @__PURE__ */ new Map();
    const { initialSettings: t, useUrlParams: s } = e;
    this._useUrlParams = !!s, this.populateDefaultSettings(this._useUrlParams), t && this.setSettings(t);
  }
  get useUrlParams() {
    return this._useUrlParams;
  }
  populateDefaultSettings(e) {
    this.textParameters.set(se.SignallingServerUrl, new Xs(se.SignallingServerUrl, "Signalling url", "Url of the signalling server", (location.protocol === "https:" ? "wss://" : "ws://") + window.location.hostname + (window.location.port === "80" || window.location.port === "" ? "" : `:${window.location.port}`), e)), this.optionParameters.set(A.StreamerId, new ct(A.StreamerId, "Streamer ID", "The ID of the streamer to stream.", "", [], e)), this.optionParameters.set(A.PreferredCodec, new ct(A.PreferredCodec, "Preferred Codec", "The preferred codec to be used during codec negotiation", "H264 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f", function() {
      const t = [];
      if (!RTCRtpReceiver.getCapabilities) return t.push("Only available on Chrome"), t;
      const s = /(VP\d|H26\d|AV1).*/;
      return RTCRtpReceiver.getCapabilities("video").codecs.forEach((n) => {
        const r = n.mimeType.split("/")[1] + " " + (n.sdpFmtpLine || "");
        s.exec(r) !== null && t.push(r);
      }), t;
    }(), e)), this.flags.set(m.AutoConnect, new I(m.AutoConnect, "Auto connect to stream", "Whether we should attempt to auto connect to the signalling server or show a click to start prompt.", !1, e)), this.flags.set(m.AutoPlayVideo, new I(m.AutoPlayVideo, "Auto play video", "When video is ready automatically start playing it as opposed to showing a play button.", !0, e)), this.flags.set(m.BrowserSendOffer, new I(m.BrowserSendOffer, "Browser send offer", "Browser will initiate the WebRTC handshake by sending the offer to the streamer", !1, e)), this.flags.set(m.UseMic, new I(m.UseMic, "Use microphone", "Make browser request microphone access and open an input audio track.", !1, e)), this.flags.set(m.StartVideoMuted, new I(m.StartVideoMuted, "Start video muted", "Video will start muted if true.", !1, e)), this.flags.set(m.SuppressBrowserKeys, new I(m.SuppressBrowserKeys, "Suppress browser keys", "Suppress certain browser keys that we use in UE, for example F5 to show shader complexity instead of refresh the page.", !0, e)), this.flags.set(m.IsQualityController, new I(m.IsQualityController, "Is quality controller?", "True if this peer controls stream quality", !0, e)), this.flags.set(m.ForceMonoAudio, new I(m.ForceMonoAudio, "Force mono audio", "Force browser to request mono audio in the SDP", !1, e)), this.flags.set(m.ForceTURN, new I(m.ForceTURN, "Force TURN", "Only generate TURN/Relayed ICE candidates.", !1, e)), this.flags.set(m.AFKDetection, new I(m.AFKDetection, "AFK if idle", "Timeout the experience if user is AFK for a period.", !1, e)), this.flags.set(m.MatchViewportResolution, new I(m.MatchViewportResolution, "Match viewport resolution", "Pixel Streaming will be instructed to dynamically resize the video stream to match the size of the video element.", !1, e)), this.flags.set(m.HoveringMouseMode, new I(m.HoveringMouseMode, "Control Scheme: Locked Mouse", "Either locked mouse, where the pointer is consumed by the video and locked to it, or hovering mouse, where the mouse is not consumed.", !1, e, (t, s) => {
      s.label = `Control Scheme: ${t ? "Hovering" : "Locked"} Mouse`;
    })), this.flags.set(m.FakeMouseWithTouches, new I(m.FakeMouseWithTouches, "Fake mouse with touches", "A single finger touch is converted into a mouse event. This allows a non-touch application to be controlled partially via a touch device.", !1, e)), this.flags.set(m.KeyboardInput, new I(m.KeyboardInput, "Keyboard input", "If enabled, send keyboard events to streamer", !0, e)), this.flags.set(m.MouseInput, new I(m.MouseInput, "Mouse input", "If enabled, send mouse events to streamer", !0, e)), this.flags.set(m.TouchInput, new I(m.TouchInput, "Touch input", "If enabled, send touch events to streamer", !0, e)), this.flags.set(m.GamepadInput, new I(m.GamepadInput, "Gamepad input", "If enabled, send gamepad events to streamer", !0, e)), this.flags.set(m.XRControllerInput, new I(m.XRControllerInput, "XR controller input", "If enabled, send XR controller events to streamer", !0, e)), this.flags.set(m.WaitForStreamer, new I(m.WaitForStreamer, "Wait for streamer", "Will continue trying to connect to the first streamer available.", !0, e)), this.numericParameters.set(w.AFKTimeoutSecs, new X(w.AFKTimeoutSecs, "AFK timeout", "The time (in seconds) it takes for the application to time out if AFK timeout is enabled.", 0, 600, 120, e)), this.numericParameters.set(w.MaxReconnectAttempts, new X(w.MaxReconnectAttempts, "Max Reconnects", "Maximum number of reconnects the application will attempt when a streamer disconnects.", 0, 999, 3, e)), this.numericParameters.set(w.MinQP, new X(w.MinQP, "Min QP", "The lower bound for the quantization parameter (QP) of the encoder. 0 = Best quality, 51 = worst quality.", 0, 51, 0, e)), this.numericParameters.set(w.MaxQP, new X(w.MaxQP, "Max QP", "The upper bound for the quantization parameter (QP) of the encoder. 0 = Best quality, 51 = worst quality.", 0, 51, 51, e)), this.numericParameters.set(w.WebRTCFPS, new X(w.WebRTCFPS, "Max FPS", "The maximum FPS that WebRTC will try to transmit frames at.", 1, 999, 60, e)), this.numericParameters.set(w.WebRTCMinBitrate, new X(w.WebRTCMinBitrate, "Min Bitrate (kbps)", "The minimum bitrate that WebRTC should use.", 0, 5e5, 0, e)), this.numericParameters.set(w.WebRTCMaxBitrate, new X(w.WebRTCMaxBitrate, "Max Bitrate (kbps)", "The maximum bitrate that WebRTC should use.", 0, 5e5, 0, e)), this.numericParameters.set(w.StreamerAutoJoinInterval, new X(w.StreamerAutoJoinInterval, "Streamer Auto Join Interval (ms)", "Delay between retries when waiting for an available streamer.", 500, 9e5, 3e3, e));
  }
  _addOnNumericSettingChangedListener(e, t) {
    this.numericParameters.has(e) && this.numericParameters.get(e).addOnChangedListener(t);
  }
  _addOnOptionSettingChangedListener(e, t) {
    this.optionParameters.has(e) && this.optionParameters.get(e).addOnChangedListener(t);
  }
  getNumericSettingValue(e) {
    if (this.numericParameters.has(e)) return this.numericParameters.get(e).number;
    throw new Error(`There is no numeric setting with the id of ${e}`);
  }
  getTextSettingValue(e) {
    if (this.textParameters.has(e)) return this.textParameters.get(e).value;
    throw new Error(`There is no numeric setting with the id of ${e}`);
  }
  setNumericSetting(e, t) {
    if (!this.numericParameters.has(e)) throw new Error(`There is no numeric setting with the id of ${e}`);
    this.numericParameters.get(e).number = t;
  }
  _addOnSettingChangedListener(e, t) {
    this.flags.has(e) && (this.flags.get(e).onChange = t);
  }
  _addOnTextSettingChangedListener(e, t) {
    this.textParameters.has(e) && (this.textParameters.get(e).onChange = t);
  }
  getSettingOption(e) {
    return this.optionParameters.get(e);
  }
  isFlagEnabled(e) {
    return this.flags.get(e).flag;
  }
  setFlagEnabled(e, t) {
    this.flags.has(e) ? this.flags.get(e).flag = t : c.Warning(c.GetStackTrace(), `Cannot toggle flag called ${e} - it does not exist in the Config.flags map.`);
  }
  setTextSetting(e, t) {
    this.textParameters.has(e) ? this.textParameters.get(e).text = t : c.Warning(c.GetStackTrace(), `Cannot set text setting called ${e} - it does not exist in the Config.textParameters map.`);
  }
  setOptionSettingOptions(e, t) {
    this.optionParameters.has(e) ? this.optionParameters.get(e).options = t : c.Warning(c.GetStackTrace(), `Cannot set text setting called ${e} - it does not exist in the Config.optionParameters map.`);
  }
  setOptionSettingValue(e, t) {
    this.optionParameters.has(e) ? this.optionParameters.get(e).selected = t : c.Warning(c.GetStackTrace(), `Cannot set text setting called ${e} - it does not exist in the Config.enumParameters map.`);
  }
  setFlagLabel(e, t) {
    this.flags.has(e) ? this.flags.get(e).label = t : c.Warning(c.GetStackTrace(), `Cannot set label for flag called ${e} - it does not exist in the Config.flags map.`);
  }
  setSettings(e) {
    for (const t of Object.keys(e)) pi(t) ? this.setFlagEnabled(t, e[t]) : vi(t) ? this.setNumericSetting(t, e[t]) : fi(t) ? this.setTextSetting(t, e[t]) : Si(t) && this.setOptionSettingValue(t, e[t]);
  }
  getSettings() {
    const e = {};
    for (const [t, s] of this.flags.entries()) e[t] = s.flag;
    for (const [t, s] of this.numericParameters.entries()) e[t] = s.number;
    for (const [t, s] of this.textParameters.entries()) e[t] = s.text;
    for (const [t, s] of this.optionParameters.entries()) e[t] = s.selected;
    return e;
  }
  getFlags() {
    return Array.from(this.flags.values());
  }
  getTextSettings() {
    return Array.from(this.textParameters.values());
  }
  getNumericSettings() {
    return Array.from(this.numericParameters.values());
  }
  getOptionSettings() {
    return Array.from(this.optionParameters.values());
  }
  _registerOnChangeEvents(e) {
    for (const t of this.flags.keys()) {
      const s = this.flags.get(t);
      s && (s.onChangeEmit = (n) => e.dispatchEvent(new ve({ id: s.id, type: "flag", value: n, target: s })));
    }
    for (const t of this.numericParameters.keys()) {
      const s = this.numericParameters.get(t);
      s && (s.onChangeEmit = (n) => e.dispatchEvent(new ve({ id: s.id, type: "number", value: n, target: s })));
    }
    for (const t of this.textParameters.keys()) {
      const s = this.textParameters.get(t);
      s && (s.onChangeEmit = (n) => e.dispatchEvent(new ve({ id: s.id, type: "text", value: n, target: s })));
    }
    for (const t of this.optionParameters.keys()) {
      const s = this.optionParameters.get(t);
      s && (s.onChangeEmit = (n) => e.dispatchEvent(new ve({ id: s.id, type: "option", value: n, target: s })));
    }
  }
}
var ne;
(function(i) {
  i[i.LockedMouse = 0] = "LockedMouse", i[i.HoveringMouse = 1] = "HoveringMouse";
})(ne || (ne = {}));
class xn {
  constructor(e, t, s) {
    this.closeTimeout = 10, this.active = !1, this.countdownActive = !1, this.warnTimer = void 0, this.countDown = 0, this.countDownTimer = void 0, this.config = e, this.pixelStreaming = t, this.onDismissAfk = s, this.onAFKTimedOutCallback = () => {
      console.log("AFK timed out, did you want to override this callback?");
    };
  }
  onAfkClick() {
    clearInterval(this.countDownTimer), (this.active || this.countdownActive) && (this.startAfkWarningTimer(), this.pixelStreaming.dispatchEvent(new Ys()));
  }
  startAfkWarningTimer() {
    this.config.getNumericSettingValue(w.AFKTimeoutSecs) > 0 && this.config.isFlagEnabled(m.AFKDetection) ? this.active = !0 : this.active = !1, this.resetAfkWarningTimer();
  }
  stopAfkWarningTimer() {
    this.active = !1, this.countdownActive = !1, clearTimeout(this.warnTimer), clearInterval(this.countDownTimer);
  }
  pauseAfkWarningTimer() {
    this.active = !1;
  }
  resetAfkWarningTimer() {
    this.active && this.config.isFlagEnabled(m.AFKDetection) && (clearTimeout(this.warnTimer), this.warnTimer = setTimeout(() => this.activateAfkEvent(), 1e3 * this.config.getNumericSettingValue(w.AFKTimeoutSecs)));
  }
  activateAfkEvent() {
    this.pauseAfkWarningTimer(), this.pixelStreaming.dispatchEvent(new Js({ countDown: this.countDown, dismissAfk: this.onDismissAfk })), this.countDown = this.closeTimeout, this.countdownActive = !0, this.pixelStreaming.dispatchEvent(new dt({ countDown: this.countDown })), this.config.isFlagEnabled(m.HoveringMouseMode) || document.exitPointerLock && document.exitPointerLock(), this.countDownTimer = setInterval(() => {
      this.countDown--, this.countDown == 0 ? (this.pixelStreaming.dispatchEvent(new Zs()), this.onAFKTimedOutCallback(), c.Log(c.GetStackTrace(), "You have been disconnected due to inactivity"), this.stopAfkWarningTimer()) : this.pixelStreaming.dispatchEvent(new dt({ countDown: this.countDown }));
    }, 1e3);
  }
}
class Ot {
  constructor() {
    this.isReceivingFreezeFrame = !1;
  }
  getDataChannelInstance() {
    return this;
  }
  createDataChannel(e, t, s) {
    this.peerConnection = e, this.label = t, this.datachannelOptions = s, s == null && (this.datachannelOptions = {}, this.datachannelOptions.ordered = !0), this.dataChannel = this.peerConnection.createDataChannel(this.label, this.datachannelOptions), this.setupDataChannel();
  }
  setupDataChannel() {
    this.dataChannel.binaryType = "arraybuffer", this.dataChannel.onopen = (e) => this.handleOnOpen(e), this.dataChannel.onclose = (e) => this.handleOnClose(e), this.dataChannel.onmessage = (e) => this.handleOnMessage(e), this.dataChannel.onerror = (e) => this.handleOnError(e);
  }
  handleOnOpen(e) {
    var t;
    c.Log(c.GetStackTrace(), `Data Channel (${this.label}) opened.`, 7), this.onOpen((t = this.dataChannel) === null || t === void 0 ? void 0 : t.label, e);
  }
  handleOnClose(e) {
    var t;
    c.Log(c.GetStackTrace(), `Data Channel (${this.label}) closed.`, 7), this.onClose((t = this.dataChannel) === null || t === void 0 ? void 0 : t.label, e);
  }
  handleOnMessage(e) {
    c.Log(c.GetStackTrace(), `Data Channel (${this.label}) message: ${e}`, 8);
  }
  handleOnError(e) {
    var t;
    c.Log(c.GetStackTrace(), `Data Channel (${this.label}) error: ${e}`, 7), this.onError((t = this.dataChannel) === null || t === void 0 ? void 0 : t.label, e);
  }
  onOpen(e, t) {
  }
  onClose(e, t) {
  }
  onError(e, t) {
  }
}
class Ln {
}
class Fn {
}
class An {
}
class ut {
}
class On {
}
class In {
}
class yi {
}
class Ei {
}
class Dn {
  constructor() {
    this.inboundVideoStats = new Fn(), this.inboundAudioStats = new Ln(), this.candidatePair = new On(), this.DataChannelStats = new An(), this.outBoundVideoStats = new In(), this.sessionStats = new yi(), this.streamStats = new Ei(), this.codecs = /* @__PURE__ */ new Map();
  }
  processStats(e) {
    this.localCandidates = new Array(), this.remoteCandidates = new Array(), e.forEach((t) => {
      switch (t.type) {
        case "candidate-pair":
          this.handleCandidatePair(t);
          break;
        case "certificate":
        case "media-source":
        case "media-playout":
        case "outbound-rtp":
        case "peer-connection":
        case "remote-inbound-rtp":
        case "transport":
          break;
        case "codec":
          this.handleCodec(t);
          break;
        case "data-channel":
          this.handleDataChannel(t);
          break;
        case "inbound-rtp":
          this.handleInBoundRTP(t);
          break;
        case "local-candidate":
          this.handleLocalCandidate(t);
          break;
        case "remote-candidate":
          this.handleRemoteCandidate(t);
          break;
        case "remote-outbound-rtp":
          this.handleRemoteOutBound(t);
          break;
        case "track":
          this.handleTrack(t);
          break;
        case "stream":
          this.handleStream(t);
          break;
        default:
          c.Error(c.GetStackTrace(), "unhandled Stat Type"), c.Log(c.GetStackTrace(), t);
      }
    });
  }
  handleStream(e) {
    this.streamStats = e;
  }
  handleCandidatePair(e) {
    this.candidatePair.bytesReceived = e.bytesReceived, this.candidatePair.bytesSent = e.bytesSent, this.candidatePair.localCandidateId = e.localCandidateId, this.candidatePair.remoteCandidateId = e.remoteCandidateId, this.candidatePair.nominated = e.nominated, this.candidatePair.readable = e.readable, this.candidatePair.selected = e.selected, this.candidatePair.writable = e.writable, this.candidatePair.state = e.state, this.candidatePair.currentRoundTripTime = e.currentRoundTripTime;
  }
  handleDataChannel(e) {
    this.DataChannelStats.bytesReceived = e.bytesReceived, this.DataChannelStats.bytesSent = e.bytesSent, this.DataChannelStats.dataChannelIdentifier = e.dataChannelIdentifier, this.DataChannelStats.id = e.id, this.DataChannelStats.label = e.label, this.DataChannelStats.messagesReceived = e.messagesReceived, this.DataChannelStats.messagesSent = e.messagesSent, this.DataChannelStats.protocol = e.protocol, this.DataChannelStats.state = e.state, this.DataChannelStats.timestamp = e.timestamp;
  }
  handleLocalCandidate(e) {
    const t = new ut();
    t.label = "local-candidate", t.address = e.address, t.port = e.port, t.protocol = e.protocol, t.candidateType = e.candidateType, t.id = e.id, this.localCandidates.push(t);
  }
  handleRemoteCandidate(e) {
    const t = new ut();
    t.label = "local-candidate", t.address = e.address, t.port = e.port, t.protocol = e.protocol, t.id = e.id, t.candidateType = e.candidateType, this.remoteCandidates.push(t);
  }
  handleInBoundRTP(e) {
    switch (e.kind) {
      case "video":
        this.inboundVideoStats = e, this.lastVideoStats != null && (this.inboundVideoStats.bitrate = 8 * (this.inboundVideoStats.bytesReceived - this.lastVideoStats.bytesReceived) / (this.inboundVideoStats.timestamp - this.lastVideoStats.timestamp), this.inboundVideoStats.bitrate = Math.floor(this.inboundVideoStats.bitrate)), this.lastVideoStats = Object.assign({}, this.inboundVideoStats);
        break;
      case "audio":
        this.inboundAudioStats = e, this.lastAudioStats != null && (this.inboundAudioStats.bitrate = 8 * (this.inboundAudioStats.bytesReceived - this.lastAudioStats.bytesReceived) / (this.inboundAudioStats.timestamp - this.lastAudioStats.timestamp), this.inboundAudioStats.bitrate = Math.floor(this.inboundAudioStats.bitrate)), this.lastAudioStats = Object.assign({}, this.inboundAudioStats);
        break;
      default:
        c.Log(c.GetStackTrace(), "Kind is not handled");
    }
  }
  handleRemoteOutBound(e) {
    e.kind === "video" && (this.outBoundVideoStats.bytesSent = e.bytesSent, this.outBoundVideoStats.id = e.id, this.outBoundVideoStats.localId = e.localId, this.outBoundVideoStats.packetsSent = e.packetsSent, this.outBoundVideoStats.remoteTimestamp = e.remoteTimestamp, this.outBoundVideoStats.timestamp = e.timestamp);
  }
  handleTrack(e) {
    e.type !== "track" || e.trackIdentifier !== "video_label" && e.kind !== "video" || (this.inboundVideoStats.framesDropped = e.framesDropped, this.inboundVideoStats.framesReceived = e.framesReceived, this.inboundVideoStats.frameHeight = e.frameHeight, this.inboundVideoStats.frameWidth = e.frameWidth);
  }
  handleCodec(e) {
    const t = e.id, s = `${e.mimeType.replace("video/", "").replace("audio/", "")}${e.sdpFmtpLine ? ` ${e.sdpFmtpLine}` : ""}`;
    this.codecs.set(t, s);
  }
  handleSessionStatistics(e, t, s) {
    const n = Date.now() - e;
    this.sessionStats.runTime = new Date(n).toISOString().substr(11, 8).toString();
    const r = t === null ? "Not sent yet" : t ? "true" : "false";
    this.sessionStats.controlsStreamInput = r, this.sessionStats.videoEncoderAvgQP = s;
  }
  isNumber(e) {
    return typeof e == "number" && isFinite(e);
  }
}
const It = (Dt = { parseRtpParameters: () => _e.parseRtpParameters, splitSections: () => _e.splitSections }, Ke = {}, ze.d(Ke, Dt), Ke);
var Dt, Ke;
class _n {
  static isVideoTransciever(e) {
    return this.canTransceiverReceiveVideo(e) || this.canTransceiverSendVideo(e);
  }
  static canTransceiverReceiveVideo(e) {
    return !!e && (e.direction === "sendrecv" || e.direction === "recvonly") && e.receiver && e.receiver.track && e.receiver.track.kind === "video";
  }
  static canTransceiverSendVideo(e) {
    return !!e && (e.direction === "sendrecv" || e.direction === "sendonly") && e.sender && e.sender.track && e.sender.track.kind === "video";
  }
  static isAudioTransciever(e) {
    return this.canTransceiverReceiveAudio(e) || this.canTransceiverSendAudio(e);
  }
  static canTransceiverReceiveAudio(e) {
    return !!e && (e.direction === "sendrecv" || e.direction === "recvonly") && e.receiver && e.receiver.track && e.receiver.track.kind === "audio";
  }
  static canTransceiverSendAudio(e) {
    return !!e && (e.direction === "sendrecv" || e.direction === "sendonly") && e.sender && e.sender.track && e.sender.track.kind === "audio";
  }
}
var ae, y, qe = function(i, e, t, s) {
  return new (t || (t = Promise))(function(n, r) {
    function o(h) {
      try {
        d(s.next(h));
      } catch (u) {
        r(u);
      }
    }
    function a(h) {
      try {
        d(s.throw(h));
      } catch (u) {
        r(u);
      }
    }
    function d(h) {
      var u;
      h.done ? n(h.value) : (u = h.value, u instanceof t ? u : new t(function(S) {
        S(u);
      })).then(o, a);
    }
    d((s = s.apply(i, [])).next());
  });
};
class Ti {
  constructor(e, t, s) {
    this.config = t, this.createPeerConnection(e, s);
  }
  createPeerConnection(e, t) {
    this.config.isFlagEnabled(m.ForceTURN) && (e.iceTransportPolicy = "relay", c.Log(c.GetStackTrace(), "Forcing TURN usage by setting ICE Transport Policy in peer connection config.")), this.peerConnection = new RTCPeerConnection(e), this.peerConnection.onsignalingstatechange = (s) => this.handleSignalStateChange(s), this.peerConnection.oniceconnectionstatechange = (s) => this.handleIceConnectionStateChange(s), this.peerConnection.onicegatheringstatechange = (s) => this.handleIceGatheringStateChange(s), this.peerConnection.ontrack = (s) => this.handleOnTrack(s), this.peerConnection.onicecandidate = (s) => this.handleIceCandidate(s), this.peerConnection.ondatachannel = (s) => this.handleDataChannel(s), this.aggregatedStats = new Dn(), this.preferredCodec = t, this.updateCodecSelection = !0;
  }
  createOffer(e, t) {
    return qe(this, void 0, void 0, function* () {
      c.Log(c.GetStackTrace(), "Create Offer", 6);
      const s = location.hostname === "localhost" || location.hostname === "127.0.0.1", n = location.protocol === "https:";
      let r = t.isFlagEnabled(m.UseMic);
      !r || s || n || (r = !1, c.Error(c.GetStackTrace(), "Microphone access in the browser will not work if you are not on HTTPS or localhost. Disabling mic access."), c.Error(c.GetStackTrace(), "For testing you can enable HTTP microphone access Chrome by visiting chrome://flags/ and enabling 'unsafely-treat-insecure-origin-as-secure'")), this.setupTransceiversAsync(r).finally(() => {
        var o;
        (o = this.peerConnection) === null || o === void 0 || o.createOffer(e).then((a) => {
          var d;
          this.showTextOverlayConnecting(), a.sdp = this.mungeSDP(a.sdp, r), (d = this.peerConnection) === null || d === void 0 || d.setLocalDescription(a), this.onSendWebRTCOffer(a);
        }).catch(() => {
          this.showTextOverlaySetupFailure();
        });
      });
    });
  }
  receiveOffer(e, t) {
    var s;
    return qe(this, void 0, void 0, function* () {
      c.Log(c.GetStackTrace(), "Receive Offer", 6), (s = this.peerConnection) === null || s === void 0 || s.setRemoteDescription(e).then(() => {
        const n = location.hostname === "localhost" || location.hostname === "127.0.0.1", r = location.protocol === "https:";
        let o = t.isFlagEnabled(m.UseMic);
        !o || n || r || (o = !1, c.Error(c.GetStackTrace(), "Microphone access in the browser will not work if you are not on HTTPS or localhost. Disabling mic access."), c.Error(c.GetStackTrace(), "For testing you can enable HTTP microphone access Chrome by visiting chrome://flags/ and enabling 'unsafely-treat-insecure-origin-as-secure'")), this.config.setOptionSettingOptions(A.PreferredCodec, this.fuzzyIntersectUEAndBrowserCodecs(e)), this.setupTransceiversAsync(o).finally(() => {
          var a;
          (a = this.peerConnection) === null || a === void 0 || a.createAnswer().then((d) => {
            var h;
            return d.sdp = this.mungeSDP(d.sdp, o), (h = this.peerConnection) === null || h === void 0 ? void 0 : h.setLocalDescription(d);
          }).then(() => {
            var d;
            this.onSendWebRTCAnswer((d = this.peerConnection) === null || d === void 0 ? void 0 : d.currentLocalDescription);
          }).catch(() => {
            c.Error(c.GetStackTrace(), "createAnswer() failed");
          });
        });
      });
    });
  }
  receiveAnswer(e) {
    var t;
    (t = this.peerConnection) === null || t === void 0 || t.setRemoteDescription(e), this.config.setOptionSettingOptions(A.PreferredCodec, this.fuzzyIntersectUEAndBrowserCodecs(e));
  }
  generateStats() {
    var e;
    (e = this.peerConnection) === null || e === void 0 || e.getStats(null).then((t) => {
      this.aggregatedStats.processStats(t), this.onVideoStats(this.aggregatedStats), this.updateCodecSelection && this.config.setOptionSettingValue(A.PreferredCodec, this.aggregatedStats.codecs.get(this.aggregatedStats.inboundVideoStats.codecId));
    });
  }
  close() {
    this.peerConnection && (this.peerConnection.close(), this.peerConnection = null);
  }
  mungeSDP(e, t) {
    let s = e.replace(/(a=fmtp:\d+ .*level-asymmetry-allowed=.*)\r\n/gm, `$1;x-google-start-bitrate=10000;x-google-max-bitrate=100000\r
`), n = "maxaveragebitrate=510000;";
    return t && (n += "sprop-maxcapturerate=48000;"), n += this.config.isFlagEnabled(m.ForceMonoAudio) ? "stereo=0;" : "stereo=1;", n += "useinbandfec=1", s = s.replace("useinbandfec=1", n), s;
  }
  handleOnIce(e) {
    var t;
    c.Log(c.GetStackTrace(), "peerconnection handleOnIce", 6), this.config.isFlagEnabled(m.ForceTURN) && e.candidate.indexOf("relay") < 0 ? c.Info(c.GetStackTrace(), `Dropping candidate because it was not TURN relay. | Type= ${e.type} | Protocol= ${e.protocol} | Address=${e.address} | Port=${e.port} |`, 6) : (t = this.peerConnection) === null || t === void 0 || t.addIceCandidate(e);
  }
  handleSignalStateChange(e) {
    c.Log(c.GetStackTrace(), "signaling state change: " + e, 6);
  }
  handleIceConnectionStateChange(e) {
    c.Log(c.GetStackTrace(), "ice connection state change: " + e, 6), this.onIceConnectionStateChange(e);
  }
  handleIceGatheringStateChange(e) {
    c.Log(c.GetStackTrace(), "ice gathering state change: " + JSON.stringify(e), 6);
  }
  handleOnTrack(e) {
    this.onTrack(e);
  }
  handleIceCandidate(e) {
    this.onPeerIceCandidate(e);
  }
  handleDataChannel(e) {
    this.onDataChannel(e);
  }
  onTrack(e) {
  }
  onIceConnectionStateChange(e) {
  }
  onPeerIceCandidate(e) {
  }
  onDataChannel(e) {
  }
  fuzzyIntersectUEAndBrowserCodecs(e) {
    const t = new Array(), s = this.parseAvailableCodecs(e), n = this.config.getSettingOption(A.PreferredCodec).options;
    for (const r of s) if (n.includes(r)) t.push(r);
    else {
      const o = r.split(" ")[0];
      for (const a of n) if (a.includes(o)) {
        t.push(a);
        break;
      }
    }
    return t;
  }
  setupTransceiversAsync(e) {
    var t, s, n, r, o, a, d, h, u, S, p, E;
    return qe(this, void 0, void 0, function* () {
      let T = !1;
      for (const P of (s = (t = this.peerConnection) === null || t === void 0 ? void 0 : t.getTransceivers()) !== null && s !== void 0 ? s : []) if (P && P.receiver && P.receiver.track && P.receiver.track.kind === "video") {
        T = !0;
        break;
      }
      if (T || (n = this.peerConnection) === null || n === void 0 || n.addTransceiver("video", { direction: "recvonly" }), RTCRtpReceiver.getCapabilities && this.preferredCodec != "") {
        for (const P of (o = (r = this.peerConnection) === null || r === void 0 ? void 0 : r.getTransceivers()) !== null && o !== void 0 ? o : []) if (P && P.receiver && P.receiver.track && P.receiver.track.kind === "video" && P.setCodecPreferences) {
          const V = this.preferredCodec.split(" "), x = [{ mimeType: "video/" + V[0], clockRate: 9e4, sdpFmtpLine: V[1] ? V[1] : "" }];
          this.config.getSettingOption(A.PreferredCodec).options.filter((k) => k != this.preferredCodec).forEach((k) => {
            const K = k.split(" ");
            x.push({ mimeType: "video/" + K[0], clockRate: 9e4, sdpFmtpLine: K[1] ? K[1] : "" });
          });
          for (const k of x) k.sdpFmtpLine === "" && delete k.sdpFmtpLine;
          P.setCodecPreferences(x);
        }
      }
      let R = !1;
      for (const P of (d = (a = this.peerConnection) === null || a === void 0 ? void 0 : a.getTransceivers()) !== null && d !== void 0 ? d : []) if (P && P.receiver && P.receiver.track && P.receiver.track.kind === "audio") {
        R = !0;
        break;
      }
      if (e) {
        const P = { video: !1, audio: { autoGainControl: !1, channelCount: 1, echoCancellation: !1, latency: 0, noiseSuppression: !1, sampleRate: 48e3, sampleSize: 16, volume: 1 } }, V = yield navigator.mediaDevices.getUserMedia(P);
        if (V) if (R) {
          for (const x of (S = (u = this.peerConnection) === null || u === void 0 ? void 0 : u.getTransceivers()) !== null && S !== void 0 ? S : []) if (_n.canTransceiverReceiveAudio(x)) for (const k of V.getTracks()) k.kind && k.kind == "audio" && (x.sender.replaceTrack(k), x.direction = "sendrecv");
        } else for (const x of V.getTracks()) x.kind && x.kind == "audio" && ((p = this.peerConnection) === null || p === void 0 || p.addTransceiver(x, { direction: "sendrecv" }));
        else R || (E = this.peerConnection) === null || E === void 0 || E.addTransceiver("audio", { direction: "recvonly" });
      } else R || (h = this.peerConnection) === null || h === void 0 || h.addTransceiver("audio", { direction: "recvonly" });
    });
  }
  onVideoStats(e) {
  }
  onSendWebRTCOffer(e) {
  }
  onSendWebRTCAnswer(e) {
  }
  showTextOverlayConnecting() {
  }
  showTextOverlaySetupFailure() {
  }
  parseAvailableCodecs(e) {
    if (!RTCRtpReceiver.getCapabilities) return ["Only available on Chrome"];
    const t = [], s = (0, It.splitSections)(e.sdp);
    return s.shift(), s.forEach((n) => {
      const { codecs: r } = (0, It.parseRtpParameters)(n), o = /(VP\d|H26\d|AV1).*/;
      r.forEach((a) => {
        const d = a.name + " " + Object.keys(a.parameters || {}).map((h) => h + "=" + a.parameters[h]).join(";");
        if (o.exec(d) !== null) {
          a.name == "VP9" && (a.parameters = { "profile-id": "0" });
          const h = a.name + " " + Object.keys(a.parameters || {}).map((u) => u + "=" + a.parameters[u]).join(";");
          t.push(h);
        }
      });
    }), t;
  }
}
class Un {
  constructor() {
    this.PixelStreamingSettings = new bi(), this.EncoderSettings = new zn(), this.WebRTCSettings = new Bn();
  }
  ueCompatible() {
    this.WebRTCSettings.MaxFPS != null && (this.WebRTCSettings.FPS = this.WebRTCSettings.MaxFPS);
  }
}
class bi {
}
class zn {
}
class Bn {
}
class Gn {
  constructor() {
    this.ReceiptTimeMs = null, this.TransmissionTimeMs = null, this.PreCaptureTimeMs = null, this.PostCaptureTimeMs = null, this.PreEncodeTimeMs = null, this.PostEncodeTimeMs = null, this.EncodeMs = null, this.CaptureToSendMs = null, this.testStartTimeMs = 0, this.browserReceiptTimeMs = 0, this.latencyExcludingDecode = 0, this.testDuration = 0, this.networkLatency = 0, this.browserSendLatency = 0, this.frameDisplayDeltaTimeMs = 0, this.endToEndLatency = 0, this.encodeLatency = 0;
  }
  setFrameDisplayDeltaTime(e) {
    this.frameDisplayDeltaTimeMs == 0 && (this.frameDisplayDeltaTimeMs = Math.round(e));
  }
  processFields() {
    this.EncodeMs != null || this.PreEncodeTimeMs == null && this.PostEncodeTimeMs == null || (c.Log(c.GetStackTrace(), `Setting Encode Ms 
 ${this.PostEncodeTimeMs} 
 ${this.PreEncodeTimeMs}`, 6), this.EncodeMs = this.PostEncodeTimeMs - this.PreEncodeTimeMs), this.CaptureToSendMs != null || this.PreCaptureTimeMs == null && this.PostCaptureTimeMs == null || (c.Log(c.GetStackTrace(), `Setting CaptureToSendMs Ms 
 ${this.PostCaptureTimeMs} 
 ${this.PreCaptureTimeMs}`, 6), this.CaptureToSendMs = this.PostCaptureTimeMs - this.PreCaptureTimeMs);
  }
}
class je {
  static setExtensionFromBytes(e, t) {
    t.receiving || (t.mimetype = "", t.extension = "", t.receiving = !0, t.valid = !1, t.size = 0, t.data = [], t.timestampStart = (/* @__PURE__ */ new Date()).getTime(), c.Log(c.GetStackTrace(), "Received first chunk of file", 6));
    const s = new TextDecoder("utf-16").decode(e.slice(1));
    c.Log(c.GetStackTrace(), s, 6), t.extension = s;
  }
  static setMimeTypeFromBytes(e, t) {
    t.receiving || (t.mimetype = "", t.extension = "", t.receiving = !0, t.valid = !1, t.size = 0, t.data = [], t.timestampStart = (/* @__PURE__ */ new Date()).getTime(), c.Log(c.GetStackTrace(), "Received first chunk of file", 6));
    const s = new TextDecoder("utf-16").decode(e.slice(1));
    c.Log(c.GetStackTrace(), s, 6), t.mimetype = s;
  }
  static setContentsFromBytes(e, t) {
    if (!t.receiving) return;
    t.size = Math.ceil(new DataView(e.slice(1, 5).buffer).getInt32(0, !0) / 16379);
    const s = e.slice(5);
    if (t.data.push(s), c.Log(c.GetStackTrace(), `Received file chunk: ${t.data.length}/${t.size}`, 6), t.data.length === t.size) {
      t.receiving = !1, t.valid = !0, c.Log(c.GetStackTrace(), "Received complete file", 6);
      const n = (/* @__PURE__ */ new Date()).getTime() - t.timestampStart, r = Math.round(16 * t.size * 1024 / n);
      c.Log(c.GetStackTrace(), `Average transfer bitrate: ${r}kb/s over ${n / 1e3} seconds`, 6);
      const o = new Blob(t.data, { type: t.mimetype }), a = document.createElement("a");
      a.setAttribute("href", URL.createObjectURL(o)), a.setAttribute("download", `transfer.${t.extension}`), document.body.append(a), a.remove();
    } else t.data.length > t.size && (t.receiving = !1, c.Error(c.GetStackTrace(), `Received bigger file than advertised: ${t.data.length}/${t.size}`));
  }
}
class wi {
  constructor() {
    this.mimetype = "", this.extension = "", this.receiving = !1, this.size = 0, this.data = [], this.valid = !1;
  }
}
class z {
}
z.mainButton = 0, z.auxiliaryButton = 1, z.secondaryButton = 2, z.fourthButton = 3, z.fifthButton = 4;
class N {
}
N.primaryButton = 1, N.secondaryButton = 2, N.auxiliaryButton = 4, N.fourthButton = 8, N.fifthButton = 16;
class he {
  constructor() {
    this.unregisterCallbacks = [];
  }
  addUnregisterCallback(e) {
    this.unregisterCallbacks.push(e);
  }
  unregisterAll() {
    for (const e of this.unregisterCallbacks) e();
    this.unregisterCallbacks = [];
  }
}
class Mi {
  constructor(e, t, s) {
    this.touchEventListenerTracker = new he(), this.toStreamerMessagesProvider = e, this.videoElementProvider = t, this.coordinateConverter = s;
    const n = (a) => this.onTouchStart(a), r = (a) => this.onTouchEnd(a), o = (a) => this.onTouchMove(a);
    document.addEventListener("touchstart", n, { passive: !1 }), document.addEventListener("touchend", r, { passive: !1 }), document.addEventListener("touchmove", o, { passive: !1 }), this.touchEventListenerTracker.addUnregisterCallback(() => document.removeEventListener("touchstart", n)), this.touchEventListenerTracker.addUnregisterCallback(() => document.removeEventListener("touchend", r)), this.touchEventListenerTracker.addUnregisterCallback(() => document.removeEventListener("touchmove", o));
  }
  unregisterTouchEvents() {
    this.touchEventListenerTracker.unregisterAll();
  }
  setVideoElementParentClientRect(e) {
    this.videoElementParentClientRect = e;
  }
  onTouchStart(e) {
    if (this.videoElementProvider.isVideoReady()) {
      if (this.fakeTouchFinger == null) {
        const t = e.changedTouches[0];
        this.fakeTouchFinger = new Ri(t.identifier, t.clientX - this.videoElementParentClientRect.left, t.clientY - this.videoElementParentClientRect.top);
        const s = this.videoElementProvider.getVideoParentElement(), n = new MouseEvent("mouseenter", t);
        s.dispatchEvent(n);
        const r = this.coordinateConverter.normalizeAndQuantizeUnsigned(this.fakeTouchFinger.x, this.fakeTouchFinger.y);
        this.toStreamerMessagesProvider.toStreamerHandlers.get("MouseDown")([z.mainButton, r.x, r.y]);
      }
      e.preventDefault();
    }
  }
  onTouchEnd(e) {
    if (!this.videoElementProvider.isVideoReady()) return;
    const t = this.videoElementProvider.getVideoParentElement(), s = this.toStreamerMessagesProvider.toStreamerHandlers;
    for (let n = 0; n < e.changedTouches.length; n++) {
      const r = e.changedTouches[n];
      if (r.identifier === this.fakeTouchFinger.id) {
        const o = r.clientX - this.videoElementParentClientRect.left, a = r.clientY - this.videoElementParentClientRect.top, d = this.coordinateConverter.normalizeAndQuantizeUnsigned(o, a);
        s.get("MouseUp")([z.mainButton, d.x, d.y]);
        const h = new MouseEvent("mouseleave", r);
        t.dispatchEvent(h), this.fakeTouchFinger = null;
        break;
      }
    }
    e.preventDefault();
  }
  onTouchMove(e) {
    if (!this.videoElementProvider.isVideoReady()) return;
    const t = this.toStreamerMessagesProvider.toStreamerHandlers;
    for (let s = 0; s < e.touches.length; s++) {
      const n = e.touches[s];
      if (n.identifier === this.fakeTouchFinger.id) {
        const r = n.clientX - this.videoElementParentClientRect.left, o = n.clientY - this.videoElementParentClientRect.top, a = this.coordinateConverter.normalizeAndQuantizeUnsigned(r, o), d = this.coordinateConverter.normalizeAndQuantizeSigned(r - this.fakeTouchFinger.x, o - this.fakeTouchFinger.y);
        t.get("MouseMove")([a.x, a.y, d.x, d.y]), this.fakeTouchFinger.x = r, this.fakeTouchFinger.y = o;
        break;
      }
    }
    e.preventDefault();
  }
}
class Ri {
  constructor(e, t, s) {
    this.id = e, this.x = t, this.y = s;
  }
}
class W {
}
W.backSpace = 8, W.shift = 16, W.control = 17, W.alt = 18, W.rightShift = 253, W.rightControl = 254, W.rightAlt = 255;
class Pi {
  constructor(e, t, s) {
    this.keyboardEventListenerTracker = new he(), this.CodeToKeyCode = { Escape: 27, Digit0: 48, Digit1: 49, Digit2: 50, Digit3: 51, Digit4: 52, Digit5: 53, Digit6: 54, Digit7: 55, Digit8: 56, Digit9: 57, Minus: 173, Equal: 187, Backspace: 8, Tab: 9, KeyQ: 81, KeyW: 87, KeyE: 69, KeyR: 82, KeyT: 84, KeyY: 89, KeyU: 85, KeyI: 73, KeyO: 79, KeyP: 80, BracketLeft: 219, BracketRight: 221, Enter: 13, ControlLeft: 17, KeyA: 65, KeyS: 83, KeyD: 68, KeyF: 70, KeyG: 71, KeyH: 72, KeyJ: 74, KeyK: 75, KeyL: 76, Semicolon: 186, Quote: 222, Backquote: 192, ShiftLeft: 16, Backslash: 220, KeyZ: 90, KeyX: 88, KeyC: 67, KeyV: 86, KeyB: 66, KeyN: 78, KeyM: 77, Comma: 188, Period: 190, Slash: 191, ShiftRight: 253, AltLeft: 18, Space: 32, CapsLock: 20, F1: 112, F2: 113, F3: 114, F4: 115, F5: 116, F6: 117, F7: 118, F8: 119, F9: 120, F10: 121, F11: 122, F12: 123, Pause: 19, ScrollLock: 145, NumpadDivide: 111, NumpadMultiply: 106, NumpadSubtract: 109, NumpadAdd: 107, NumpadDecimal: 110, Numpad9: 105, Numpad8: 104, Numpad7: 103, Numpad6: 102, Numpad5: 101, Numpad4: 100, Numpad3: 99, Numpad2: 98, Numpad1: 97, Numpad0: 96, NumLock: 144, ControlRight: 254, AltRight: 255, Home: 36, End: 35, ArrowUp: 38, ArrowLeft: 37, ArrowRight: 39, ArrowDown: 40, PageUp: 33, PageDown: 34, Insert: 45, Delete: 46, ContextMenu: 93 }, this.toStreamerMessagesProvider = e, this.config = t, this.activeKeysProvider = s;
  }
  registerKeyBoardEvents() {
    const e = (n) => this.handleOnKeyDown(n), t = (n) => this.handleOnKeyUp(n), s = (n) => this.handleOnKeyPress(n);
    document.addEventListener("keydown", e), document.addEventListener("keyup", t), document.addEventListener("keypress", s), this.keyboardEventListenerTracker.addUnregisterCallback(() => document.removeEventListener("keydown", e)), this.keyboardEventListenerTracker.addUnregisterCallback(() => document.removeEventListener("keyup", t)), this.keyboardEventListenerTracker.addUnregisterCallback(() => document.removeEventListener("keypress", s));
  }
  unregisterKeyBoardEvents() {
    this.keyboardEventListenerTracker.unregisterAll();
  }
  handleOnKeyDown(e) {
    const t = this.getKeycode(e);
    t && (c.Log(c.GetStackTrace(), `key down ${t}, repeat = ${e.repeat}`, 6), this.toStreamerMessagesProvider.toStreamerHandlers.get("KeyDown")([this.getKeycode(e), e.repeat ? 1 : 0]), this.activeKeysProvider.getActiveKeys().push(t), t === W.backSpace && document.dispatchEvent(new KeyboardEvent("keypress", { charCode: W.backSpace })), this.config.isFlagEnabled(m.SuppressBrowserKeys) && this.isKeyCodeBrowserKey(t) && e.preventDefault());
  }
  handleOnKeyUp(e) {
    const t = this.getKeycode(e);
    t && (c.Log(c.GetStackTrace(), `key up ${t}`, 6), this.toStreamerMessagesProvider.toStreamerHandlers.get("KeyUp")([t]), this.config.isFlagEnabled(m.SuppressBrowserKeys) && this.isKeyCodeBrowserKey(t) && e.preventDefault());
  }
  handleOnKeyPress(e) {
    if (!("charCode" in e)) return void c.Warning(c.GetStackTrace(), "KeyboardEvent.charCode is deprecated in this browser, cannot send key press.");
    const t = e.charCode;
    c.Log(c.GetStackTrace(), `key press ${t}`, 6), this.toStreamerMessagesProvider.toStreamerHandlers.get("KeyPress")([t]);
  }
  getKeycode(e) {
    if (!("keyCode" in e)) {
      const t = e;
      return t.code in this.CodeToKeyCode ? this.CodeToKeyCode[t.code] : (c.Warning(c.GetStackTrace(), `Keyboard code of ${t.code} is not supported in our mapping, ignoring this key.`), null);
    }
    return e.keyCode === W.shift && e.code === "ShiftRight" ? W.rightShift : e.keyCode === W.control && e.code === "ControlRight" ? W.rightControl : e.keyCode === W.alt && e.code === "AltRight" ? W.rightAlt : e.keyCode;
  }
  isKeyCodeBrowserKey(e) {
    return e >= 112 && e <= 123 || e === 9;
  }
}
class ki {
  constructor(e, t, s) {
    this.x = 0, this.y = 0, this.updateMouseMovePositionEvent = (r) => {
      this.updateMouseMovePosition(r);
    }, this.mouseEventListenerTracker = new he(), this.videoElementProvider = e, this.mouseController = t, this.activeKeysProvider = s;
    const n = this.videoElementProvider.getVideoParentElement();
    this.x = n.getBoundingClientRect().width / 2, this.y = n.getBoundingClientRect().height / 2, this.coord = this.mouseController.coordinateConverter.normalizeAndQuantizeUnsigned(this.x, this.y);
  }
  unregisterMouseEvents() {
    this.mouseEventListenerTracker.unregisterAll();
  }
  lockStateChange() {
    const e = this.videoElementProvider.getVideoParentElement(), t = this.mouseController.toStreamerMessagesProvider.toStreamerHandlers;
    if (document.pointerLockElement === e || document.mozPointerLockElement === e) c.Log(c.GetStackTrace(), "Pointer locked", 6), document.addEventListener("mousemove", this.updateMouseMovePositionEvent, !1), this.mouseEventListenerTracker.addUnregisterCallback(() => document.removeEventListener("mousemove", this.updateMouseMovePositionEvent, !1));
    else {
      c.Log(c.GetStackTrace(), "The pointer lock status is now unlocked", 6), document.removeEventListener("mousemove", this.updateMouseMovePositionEvent, !1);
      let s = this.activeKeysProvider.getActiveKeys();
      const n = new Set(s), r = [];
      n.forEach((o) => {
      }), r.forEach((o) => {
        t.get("KeyUp")([o]);
      }), s = [];
    }
  }
  updateMouseMovePosition(e) {
    if (!this.videoElementProvider.isVideoReady()) return;
    const t = this.mouseController.toStreamerMessagesProvider.toStreamerHandlers, s = this.videoElementProvider.getVideoParentElement().clientWidth, n = this.videoElementProvider.getVideoParentElement().clientHeight;
    this.x += e.movementX, this.y += e.movementY, this.x > s && (this.x -= s), this.y > n && (this.y -= n), this.x < 0 && (this.x = s + this.x), this.y < 0 && (this.y = n - this.y), this.coord = this.mouseController.coordinateConverter.normalizeAndQuantizeUnsigned(this.x, this.y);
    const r = this.mouseController.coordinateConverter.normalizeAndQuantizeSigned(e.movementX, e.movementY);
    t.get("MouseMove")([this.coord.x, this.coord.y, r.x, r.y]);
  }
  handleMouseDown(e) {
    this.videoElementProvider.isVideoReady() && this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get("MouseDown")([e.button, this.coord.x, this.coord.y]);
  }
  handleMouseUp(e) {
    this.videoElementProvider.isVideoReady() && this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get("MouseUp")([e.button, this.coord.x, this.coord.y]);
  }
  handleMouseWheel(e) {
    this.videoElementProvider.isVideoReady() && this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get("MouseWheel")([e.wheelDelta, this.coord.x, this.coord.y]);
  }
  handleMouseDouble(e) {
    this.videoElementProvider.isVideoReady() && this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get("MouseDouble")([e.button, this.coord.x, this.coord.y]);
  }
  handlePressMouseButtons(e) {
    this.videoElementProvider.isVideoReady() && this.mouseController.pressMouseButtons(e.buttons, this.x, this.y);
  }
  handleReleaseMouseButtons(e) {
    this.videoElementProvider.isVideoReady() && this.mouseController.releaseMouseButtons(e.buttons, this.x, this.y);
  }
}
class xi {
  constructor(e) {
    this.mouseController = e;
  }
  unregisterMouseEvents() {
  }
  updateMouseMovePosition(e) {
    if (!this.mouseController.videoElementProvider.isVideoReady()) return;
    c.Log(c.GetStackTrace(), "MouseMove", 6);
    const t = this.mouseController.coordinateConverter.normalizeAndQuantizeUnsigned(e.offsetX, e.offsetY), s = this.mouseController.coordinateConverter.normalizeAndQuantizeSigned(e.movementX, e.movementY);
    this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get("MouseMove")([t.x, t.y, s.x, s.y]), e.preventDefault();
  }
  handleMouseDown(e) {
    if (!this.mouseController.videoElementProvider.isVideoReady()) return;
    c.Log(c.GetStackTrace(), "onMouse Down", 6);
    const t = this.mouseController.coordinateConverter.normalizeAndQuantizeUnsigned(e.offsetX, e.offsetY);
    this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get("MouseDown")([e.button, t.x, t.y]), e.preventDefault();
  }
  handleMouseUp(e) {
    if (!this.mouseController.videoElementProvider.isVideoReady()) return;
    c.Log(c.GetStackTrace(), "onMouse Up", 6);
    const t = this.mouseController.coordinateConverter.normalizeAndQuantizeUnsigned(e.offsetX, e.offsetY);
    this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get("MouseUp")([e.button, t.x, t.y]), e.preventDefault();
  }
  handleContextMenu(e) {
    this.mouseController.videoElementProvider.isVideoReady() && e.preventDefault();
  }
  handleMouseWheel(e) {
    if (!this.mouseController.videoElementProvider.isVideoReady()) return;
    const t = this.mouseController.coordinateConverter.normalizeAndQuantizeUnsigned(e.offsetX, e.offsetY);
    this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get("MouseWheel")([e.wheelDelta, t.x, t.y]), e.preventDefault();
  }
  handleMouseDouble(e) {
    if (!this.mouseController.videoElementProvider.isVideoReady()) return;
    const t = this.mouseController.coordinateConverter.normalizeAndQuantizeUnsigned(e.offsetX, e.offsetY);
    this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get("MouseDouble")([e.button, t.x, t.y]);
  }
  handlePressMouseButtons(e) {
    this.mouseController.videoElementProvider.isVideoReady() && (c.Log(c.GetStackTrace(), "onMouse press", 6), this.mouseController.pressMouseButtons(e.buttons, e.offsetX, e.offsetY));
  }
  handleReleaseMouseButtons(e) {
    this.mouseController.videoElementProvider.isVideoReady() && (c.Log(c.GetStackTrace(), "onMouse release", 6), this.mouseController.releaseMouseButtons(e.buttons, e.offsetX, e.offsetY));
  }
}
class Li {
  constructor(e, t, s, n) {
    this.mouseEventListenerTracker = new he(), this.toStreamerMessagesProvider = e, this.coordinateConverter = s, this.videoElementProvider = t, this.activeKeysProvider = n, this.registerMouseEnterAndLeaveEvents();
  }
  unregisterMouseEvents() {
    this.mouseEventListenerTracker.unregisterAll();
  }
  registerLockedMouseEvents(e) {
    const t = this.videoElementProvider.getVideoParentElement(), s = new ki(this.videoElementProvider, e, this.activeKeysProvider);
    if (t.requestPointerLock = t.requestPointerLock || t.mozRequestPointerLock, document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock, t.requestPointerLock) {
      const h = () => {
        t.requestPointerLock();
      };
      t.addEventListener("click", h), this.mouseEventListenerTracker.addUnregisterCallback(() => t.removeEventListener("click", h));
    }
    const n = () => s.lockStateChange();
    document.addEventListener("pointerlockchange", n, !1), document.addEventListener("mozpointerlockchange", n, !1), this.mouseEventListenerTracker.addUnregisterCallback(() => document.removeEventListener("pointerlockchange", n, !1)), this.mouseEventListenerTracker.addUnregisterCallback(() => document.removeEventListener("mozpointerlockchange", n, !1));
    const r = (h) => s.handleMouseDown(h), o = (h) => s.handleMouseUp(h), a = (h) => s.handleMouseWheel(h), d = (h) => s.handleMouseDouble(h);
    t.addEventListener("mousedown", r), t.addEventListener("mouseup", o), t.addEventListener("wheel", a), t.addEventListener("dblclick", d), this.mouseEventListenerTracker.addUnregisterCallback(() => t.removeEventListener("mousedown", r)), this.mouseEventListenerTracker.addUnregisterCallback(() => t.removeEventListener("mouseup", o)), this.mouseEventListenerTracker.addUnregisterCallback(() => t.removeEventListener("wheel", a)), this.mouseEventListenerTracker.addUnregisterCallback(() => t.removeEventListener("dblclick", d)), this.mouseEventListenerTracker.addUnregisterCallback(() => s.unregisterMouseEvents()), this.mouseEventListenerTracker.addUnregisterCallback(() => {
      !document.exitPointerLock || document.pointerLockElement !== t && document.mozPointerLockElement !== t || document.exitPointerLock();
    });
  }
  registerHoveringMouseEvents(e) {
    const t = this.videoElementProvider.getVideoParentElement(), s = new xi(e), n = (u) => s.updateMouseMovePosition(u), r = (u) => s.handleMouseDown(u), o = (u) => s.handleMouseUp(u), a = (u) => s.handleContextMenu(u), d = (u) => s.handleMouseWheel(u), h = (u) => s.handleMouseDouble(u);
    t.addEventListener("mousemove", n), t.addEventListener("mousedown", r), t.addEventListener("mouseup", o), t.addEventListener("contextmenu", a), t.addEventListener("wheel", d), t.addEventListener("dblclick", h), this.mouseEventListenerTracker.addUnregisterCallback(() => t.removeEventListener("mousemove", n)), this.mouseEventListenerTracker.addUnregisterCallback(() => t.removeEventListener("mousedown", r)), this.mouseEventListenerTracker.addUnregisterCallback(() => t.removeEventListener("mouseup", o)), this.mouseEventListenerTracker.addUnregisterCallback(() => t.removeEventListener("contextmenu", a)), this.mouseEventListenerTracker.addUnregisterCallback(() => t.removeEventListener("wheel", d)), this.mouseEventListenerTracker.addUnregisterCallback(() => t.removeEventListener("dblclick", h)), this.mouseEventListenerTracker.addUnregisterCallback(() => s.unregisterMouseEvents());
  }
  registerMouseEnterAndLeaveEvents() {
    const e = this.videoElementProvider.getVideoParentElement(), t = (n) => {
      this.videoElementProvider.isVideoReady() && (c.Log(c.GetStackTrace(), "Mouse Entered", 6), this.sendMouseEnter(), this.pressMouseButtons(n.buttons, n.x, n.y));
    }, s = (n) => {
      this.videoElementProvider.isVideoReady() && (c.Log(c.GetStackTrace(), "Mouse Left", 6), this.sendMouseLeave(), this.releaseMouseButtons(n.buttons, n.x, n.y));
    };
    e.addEventListener("mouseenter", t), e.addEventListener("mouseleave", s), this.mouseEventListenerTracker.addUnregisterCallback(() => e.removeEventListener("mouseenter", t)), this.mouseEventListenerTracker.addUnregisterCallback(() => e.removeEventListener("mouseleave", s));
  }
  releaseMouseButtons(e, t, s) {
    const n = this.coordinateConverter.normalizeAndQuantizeUnsigned(t, s);
    e & N.primaryButton && this.sendMouseUp(z.mainButton, n.x, n.y), e & N.secondaryButton && this.sendMouseUp(z.secondaryButton, n.x, n.y), e & N.auxiliaryButton && this.sendMouseUp(z.auxiliaryButton, n.x, n.y), e & N.fourthButton && this.sendMouseUp(z.fourthButton, n.x, n.y), e & N.fifthButton && this.sendMouseUp(z.fifthButton, n.x, n.y);
  }
  pressMouseButtons(e, t, s) {
    if (!this.videoElementProvider.isVideoReady()) return;
    const n = this.coordinateConverter.normalizeAndQuantizeUnsigned(t, s);
    e & N.primaryButton && this.sendMouseDown(z.mainButton, n.x, n.y), e & N.secondaryButton && this.sendMouseDown(z.secondaryButton, n.x, n.y), e & N.auxiliaryButton && this.sendMouseDown(z.auxiliaryButton, n.x, n.y), e & N.fourthButton && this.sendMouseDown(z.fourthButton, n.x, n.y), e & N.fifthButton && this.sendMouseDown(z.fifthButton, n.x, n.y);
  }
  sendMouseEnter() {
    this.videoElementProvider.isVideoReady() && this.toStreamerMessagesProvider.toStreamerHandlers.get("MouseEnter")();
  }
  sendMouseLeave() {
    this.videoElementProvider.isVideoReady() && this.toStreamerMessagesProvider.toStreamerHandlers.get("MouseLeave")();
  }
  sendMouseDown(e, t, s) {
    this.videoElementProvider.isVideoReady() && (c.Log(c.GetStackTrace(), `mouse button ${e} down at (${t}, ${s})`, 6), this.toStreamerMessagesProvider.toStreamerHandlers.get("MouseDown")([e, t, s]));
  }
  sendMouseUp(e, t, s) {
    if (!this.videoElementProvider.isVideoReady()) return;
    c.Log(c.GetStackTrace(), `mouse button ${e} up at (${t}, ${s})`, 6);
    const n = this.coordinateConverter.normalizeAndQuantizeUnsigned(t, s);
    this.toStreamerMessagesProvider.toStreamerHandlers.get("MouseUp")([e, n.x, n.y]);
  }
}
class Fi {
  constructor(e, t, s) {
    this.fingers = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0], this.fingerIds = /* @__PURE__ */ new Map(), this.maxByteValue = 255, this.touchEventListenerTracker = new he(), this.toStreamerMessagesProvider = e, this.videoElementProvider = t, this.coordinateConverter = s, this.videoElementParent = t.getVideoElement();
    const n = (d) => this.onTouchStart(d), r = (d) => this.onTouchEnd(d), o = (d) => this.onTouchMove(d);
    this.videoElementParent.addEventListener("touchstart", n), this.videoElementParent.addEventListener("touchend", r), this.videoElementParent.addEventListener("touchmove", o), this.touchEventListenerTracker.addUnregisterCallback(() => this.videoElementParent.removeEventListener("touchstart", n)), this.touchEventListenerTracker.addUnregisterCallback(() => this.videoElementParent.removeEventListener("touchend", r)), this.touchEventListenerTracker.addUnregisterCallback(() => this.videoElementParent.removeEventListener("touchmove", o)), c.Log(c.GetStackTrace(), "Touch Events Registered", 6);
    const a = (d) => {
      d.preventDefault();
    };
    document.addEventListener("touchmove", a), this.touchEventListenerTracker.addUnregisterCallback(() => document.removeEventListener("touchmove", a));
  }
  unregisterTouchEvents() {
    this.touchEventListenerTracker.unregisterAll();
  }
  rememberTouch(e) {
    const t = this.fingers.pop();
    t === void 0 && c.Log(c.GetStackTrace(), "exhausted touch identifiers", 6), this.fingerIds.set(e.identifier, t);
  }
  forgetTouch(e) {
    this.fingers.push(this.fingerIds.get(e.identifier)), this.fingers.sort(function(t, s) {
      return s - t;
    }), this.fingerIds.delete(e.identifier);
  }
  onTouchStart(e) {
    if (this.videoElementProvider.isVideoReady()) {
      for (let t = 0; t < e.changedTouches.length; t++) this.rememberTouch(e.changedTouches[t]);
      c.Log(c.GetStackTrace(), "touch start", 6), this.emitTouchData("TouchStart", e.changedTouches), e.preventDefault();
    }
  }
  onTouchEnd(e) {
    if (this.videoElementProvider.isVideoReady()) {
      c.Log(c.GetStackTrace(), "touch end", 6), this.emitTouchData("TouchEnd", e.changedTouches);
      for (let t = 0; t < e.changedTouches.length; t++) this.forgetTouch(e.changedTouches[t]);
      e.preventDefault();
    }
  }
  onTouchMove(e) {
    this.videoElementProvider.isVideoReady() && (c.Log(c.GetStackTrace(), "touch move", 6), this.emitTouchData("TouchMove", e.touches), e.preventDefault());
  }
  emitTouchData(e, t) {
    if (!this.videoElementProvider.isVideoReady()) return;
    const s = this.videoElementProvider.getVideoParentElement().getBoundingClientRect(), n = this.toStreamerMessagesProvider.toStreamerHandlers;
    for (let r = 0; r < t.length; r++) {
      const a = t[r], d = a.clientX - s.left, h = a.clientY - s.top;
      c.Log(c.GetStackTrace(), `F${this.fingerIds.get(a.identifier)}=(${d}, ${h})`, 6);
      const u = this.coordinateConverter.normalizeAndQuantizeUnsigned(d, h);
      switch (e) {
        case "TouchStart":
          n.get("TouchStart")([1, u.x, u.y, this.fingerIds.get(a.identifier), this.maxByteValue * a.force, u.inRange ? 1 : 0]);
          break;
        case "TouchEnd":
          n.get("TouchEnd")([1, u.x, u.y, this.fingerIds.get(a.identifier), this.maxByteValue * a.force, u.inRange ? 1 : 0]);
          break;
        case "TouchMove":
          n.get("TouchMove")([1, u.x, u.y, this.fingerIds.get(a.identifier), this.maxByteValue * a.force, u.inRange ? 1 : 0]);
      }
    }
  }
}
let Ai = class {
  constructor(e) {
    this.gamePadEventListenerTracker = new he(), this.toStreamerMessagesProvider = e, this.requestAnimationFrame = (window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.requestAnimationFrame).bind(window);
    const t = window;
    if ("GamepadEvent" in t) {
      const s = (r) => this.gamePadConnectHandler(r), n = (r) => this.gamePadDisconnectHandler(r);
      window.addEventListener("gamepadconnected", s), window.addEventListener("gamepaddisconnected", n), this.gamePadEventListenerTracker.addUnregisterCallback(() => window.removeEventListener("gamepadconnected", s)), this.gamePadEventListenerTracker.addUnregisterCallback(() => window.removeEventListener("gamepaddisconnected", n));
    } else if ("WebKitGamepadEvent" in t) {
      const s = (r) => this.gamePadConnectHandler(r), n = (r) => this.gamePadDisconnectHandler(r);
      window.addEventListener("webkitgamepadconnected", s), window.addEventListener("webkitgamepaddisconnected", n), this.gamePadEventListenerTracker.addUnregisterCallback(() => window.removeEventListener("webkitgamepadconnected", s)), this.gamePadEventListenerTracker.addUnregisterCallback(() => window.removeEventListener("webkitgamepaddisconnected", n));
    }
    if (this.controllers = [], navigator.getGamepads) for (const s of navigator.getGamepads()) s && this.gamePadConnectHandler(new GamepadEvent("gamepadconnected", { gamepad: s }));
  }
  unregisterGamePadEvents() {
    this.gamePadEventListenerTracker.unregisterAll();
    for (const e of this.controllers) e.id !== void 0 && this.onGamepadDisconnected(e.id);
    this.controllers = [], this.onGamepadConnected = () => {
    }, this.onGamepadDisconnected = () => {
    };
  }
  gamePadConnectHandler(e) {
    c.Log(c.GetStackTrace(), "Gamepad connect handler", 6);
    const t = e.gamepad, s = { currentState: t, prevState: t, id: void 0 };
    this.controllers.push(s), this.controllers[t.index].currentState = t, this.controllers[t.index].prevState = t, c.Log(c.GetStackTrace(), "gamepad: " + t.id + " connected", 6), window.requestAnimationFrame(() => this.updateStatus()), this.onGamepadConnected();
  }
  gamePadDisconnectHandler(e) {
    c.Log(c.GetStackTrace(), "Gamepad disconnect handler", 6), c.Log(c.GetStackTrace(), "gamepad: " + e.gamepad.id + " disconnected", 6);
    const t = this.controllers[e.gamepad.index];
    delete this.controllers[e.gamepad.index], this.controllers = this.controllers.filter((s) => s !== void 0), this.onGamepadDisconnected(t.id);
  }
  scanGamePads() {
    const e = navigator.getGamepads ? navigator.getGamepads() : navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : [];
    for (let t = 0; t < e.length; t++) e[t] && e[t].index in this.controllers && (this.controllers[e[t].index].currentState = e[t]);
  }
  updateStatus() {
    this.scanGamePads();
    const e = this.toStreamerMessagesProvider.toStreamerHandlers;
    for (const t of this.controllers) {
      const s = t.id === void 0 ? this.controllers.indexOf(t) : t.id, n = t.currentState;
      for (let r = 0; r < t.currentState.buttons.length; r++) {
        const o = t.currentState.buttons[r], a = t.prevState.buttons[r];
        o.pressed ? r == ae.LeftTrigger ? e.get("GamepadAnalog")([s, 5, o.value]) : r == ae.RightTrigger ? e.get("GamepadAnalog")([s, 6, o.value]) : e.get("GamepadButtonPressed")([s, r, a.pressed ? 1 : 0]) : !o.pressed && a.pressed && (r == ae.LeftTrigger ? e.get("GamepadAnalog")([s, 5, 0]) : r == ae.RightTrigger ? e.get("GamepadAnalog")([s, 6, 0]) : e.get("GamepadButtonReleased")([s, r]));
      }
      for (let r = 0; r < n.axes.length; r += 2) {
        const o = parseFloat(n.axes[r].toFixed(4)), a = -parseFloat(n.axes[r + 1].toFixed(4));
        e.get("GamepadAnalog")([s, r + 1, o]), e.get("GamepadAnalog")([s, r + 2, a]);
      }
      this.controllers[s].prevState = n;
    }
    this.controllers.length > 0 && this.requestAnimationFrame(() => this.updateStatus());
  }
  onGamepadResponseReceived(e) {
    for (const t of this.controllers) if (t.id === void 0) {
      t.id = e;
      break;
    }
  }
  onGamepadConnected() {
  }
  onGamepadDisconnected(e) {
  }
};
(function(i) {
  i[i.RightClusterBottomButton = 0] = "RightClusterBottomButton", i[i.RightClusterRightButton = 1] = "RightClusterRightButton", i[i.RightClusterLeftButton = 2] = "RightClusterLeftButton", i[i.RightClusterTopButton = 3] = "RightClusterTopButton", i[i.LeftShoulder = 4] = "LeftShoulder", i[i.RightShoulder = 5] = "RightShoulder", i[i.LeftTrigger = 6] = "LeftTrigger", i[i.RightTrigger = 7] = "RightTrigger", i[i.SelectOrBack = 8] = "SelectOrBack", i[i.StartOrForward = 9] = "StartOrForward", i[i.LeftAnalogPress = 10] = "LeftAnalogPress", i[i.RightAnalogPress = 11] = "RightAnalogPress", i[i.LeftClusterTopButton = 12] = "LeftClusterTopButton", i[i.LeftClusterBottomButton = 13] = "LeftClusterBottomButton", i[i.LeftClusterLeftButton = 14] = "LeftClusterLeftButton", i[i.LeftClusterRightButton = 15] = "LeftClusterRightButton", i[i.CentreButton = 16] = "CentreButton", i[i.LeftStickHorizontal = 0] = "LeftStickHorizontal", i[i.LeftStickVertical = 1] = "LeftStickVertical", i[i.RightStickHorizontal = 2] = "RightStickHorizontal", i[i.RightStickVertical = 3] = "RightStickVertical";
})(ae || (ae = {}));
class Oi {
  constructor(e, t, s) {
    this.activeKeys = new Ii(), this.toStreamerMessagesProvider = e, this.videoElementProvider = t, this.coordinateConverter = s;
  }
  registerKeyBoard(e) {
    c.Log(c.GetStackTrace(), "Register Keyboard Events", 7);
    const t = new Pi(this.toStreamerMessagesProvider, e, this.activeKeys);
    return t.registerKeyBoardEvents(), t;
  }
  registerMouse(e) {
    c.Log(c.GetStackTrace(), "Register Mouse Events", 7);
    const t = new Li(this.toStreamerMessagesProvider, this.videoElementProvider, this.coordinateConverter, this.activeKeys);
    switch (e) {
      case ne.LockedMouse:
        t.registerLockedMouseEvents(t);
        break;
      case ne.HoveringMouse:
        t.registerHoveringMouseEvents(t);
        break;
      default:
        c.Info(c.GetStackTrace(), "unknown Control Scheme Type Defaulting to Locked Mouse Events"), t.registerLockedMouseEvents(t);
    }
    return t;
  }
  registerTouch(e, t) {
    if (c.Log(c.GetStackTrace(), "Registering Touch", 6), e) {
      const s = new Mi(this.toStreamerMessagesProvider, this.videoElementProvider, this.coordinateConverter);
      return s.setVideoElementParentClientRect(t), s;
    }
    return new Fi(this.toStreamerMessagesProvider, this.videoElementProvider, this.coordinateConverter);
  }
  registerGamePad() {
    return c.Log(c.GetStackTrace(), "Register Game Pad", 7), new Ai(this.toStreamerMessagesProvider);
  }
}
class Ii {
  constructor() {
    this.activeKeys = [], this.activeKeys = [];
  }
  getActiveKeys() {
    return this.activeKeys;
  }
}
let Di = class {
  constructor(e, t) {
    this.lastTimeResized = (/* @__PURE__ */ new Date()).getTime(), this.videoElement = document.createElement("video"), this.config = t, this.videoElement.id = "streamingVideo", this.videoElement.disablePictureInPicture = !0, this.videoElement.playsInline = !0, this.videoElement.style.width = "100%", this.videoElement.style.height = "100%", this.videoElement.style.position = "absolute", this.videoElement.style.pointerEvents = "all", e.appendChild(this.videoElement), this.onResizePlayerCallback = () => {
      console.log("Resolution changed, restyling player, did you forget to override this function?");
    }, this.onMatchViewportResolutionCallback = () => {
      console.log("Resolution changed and match viewport resolution is turned on, did you forget to override this function?");
    }, this.videoElement.onclick = () => {
      this.audioElement != null && this.audioElement.paused && this.audioElement.play(), this.videoElement.paused && this.videoElement.play();
    }, this.videoElement.onloadedmetadata = () => {
      this.onVideoInitialized();
    }, window.addEventListener("resize", () => this.resizePlayerStyle(), !0), window.addEventListener("orientationchange", () => this.onOrientationChange());
  }
  setAudioElement(e) {
    this.audioElement = e;
  }
  play() {
    return this.videoElement.muted = this.config.isFlagEnabled(m.StartVideoMuted), this.videoElement.autoplay = this.config.isFlagEnabled(m.AutoPlayVideo), this.videoElement.play();
  }
  isPaused() {
    return this.videoElement.paused;
  }
  isVideoReady() {
    return this.videoElement.readyState !== void 0 && this.videoElement.readyState > 0;
  }
  hasVideoSource() {
    return this.videoElement.srcObject !== void 0 && this.videoElement.srcObject !== null;
  }
  getVideoElement() {
    return this.videoElement;
  }
  getVideoParentElement() {
    return this.videoElement.parentElement;
  }
  setVideoEnabled(e) {
    this.videoElement.srcObject.getTracks().forEach((t) => t.enabled = e);
  }
  onVideoInitialized() {
  }
  onOrientationChange() {
    clearTimeout(this.orientationChangeTimeout), this.orientationChangeTimeout = window.setTimeout(() => {
      this.resizePlayerStyle();
    }, 500);
  }
  resizePlayerStyle() {
    const e = this.getVideoParentElement();
    e && (this.updateVideoStreamSize(), e.classList.contains("fixed-size") || this.resizePlayerStyleToFillParentElement(), this.onResizePlayerCallback());
  }
  resizePlayerStyleToFillParentElement() {
    this.getVideoParentElement().setAttribute("style", "top: 0px; left: 0px; width: 100%; height: 100%; cursor: default;");
  }
  updateVideoStreamSize() {
    if (this.config.isFlagEnabled(m.MatchViewportResolution)) if ((/* @__PURE__ */ new Date()).getTime() - this.lastTimeResized > 300) {
      const e = this.getVideoParentElement();
      if (!e) return;
      this.onMatchViewportResolutionCallback(e.clientWidth, e.clientHeight), this.lastTimeResized = (/* @__PURE__ */ new Date()).getTime();
    } else c.Log(c.GetStackTrace(), "Resizing too often - skipping", 6), clearTimeout(this.resizeTimeoutHandle), this.resizeTimeoutHandle = window.setTimeout(() => this.updateVideoStreamSize(), 100);
  }
};
class _i {
  constructor() {
    this.toStreamerHandlers = /* @__PURE__ */ new Map(), this.fromStreamerHandlers = /* @__PURE__ */ new Map(), this.toStreamerMessages = /* @__PURE__ */ new Map(), this.fromStreamerMessages = /* @__PURE__ */ new Map();
  }
  populateDefaultProtocol() {
    this.toStreamerMessages.set("IFrameRequest", { id: 0, structure: [] }), this.toStreamerMessages.set("RequestQualityControl", { id: 1, structure: [] }), this.toStreamerMessages.set("FpsRequest", { id: 2, structure: [] }), this.toStreamerMessages.set("AverageBitrateRequest", { id: 3, structure: [] }), this.toStreamerMessages.set("StartStreaming", { id: 4, structure: [] }), this.toStreamerMessages.set("StopStreaming", { id: 5, structure: [] }), this.toStreamerMessages.set("LatencyTest", { id: 6, structure: ["string"] }), this.toStreamerMessages.set("RequestInitialSettings", { id: 7, structure: [] }), this.toStreamerMessages.set("TestEcho", { id: 8, structure: [] }), this.toStreamerMessages.set("DataChannelLatencyTest", { id: 9, structure: [] }), this.toStreamerMessages.set("UIInteraction", { id: 50, structure: ["string"] }), this.toStreamerMessages.set("Command", { id: 51, structure: ["string"] }), this.toStreamerMessages.set("KeyDown", { id: 60, structure: ["uint8", "uint8"] }), this.toStreamerMessages.set("KeyUp", { id: 61, structure: ["uint8"] }), this.toStreamerMessages.set("KeyPress", { id: 62, structure: ["uint16"] }), this.toStreamerMessages.set("MouseEnter", { id: 70, structure: [] }), this.toStreamerMessages.set("MouseLeave", { id: 71, structure: [] }), this.toStreamerMessages.set("MouseDown", { id: 72, structure: ["uint8", "uint16", "uint16"] }), this.toStreamerMessages.set("MouseUp", { id: 73, structure: ["uint8", "uint16", "uint16"] }), this.toStreamerMessages.set("MouseMove", { id: 74, structure: ["uint16", "uint16", "int16", "int16"] }), this.toStreamerMessages.set("MouseWheel", { id: 75, structure: ["int16", "uint16", "uint16"] }), this.toStreamerMessages.set("MouseDouble", { id: 76, structure: ["uint8", "uint16", "uint16"] }), this.toStreamerMessages.set("TouchStart", { id: 80, structure: ["uint8", "uint16", "uint16", "uint8", "uint8", "uint8"] }), this.toStreamerMessages.set("TouchEnd", { id: 81, structure: ["uint8", "uint16", "uint16", "uint8", "uint8", "uint8"] }), this.toStreamerMessages.set("TouchMove", { id: 82, structure: ["uint8", "uint16", "uint16", "uint8", "uint8", "uint8"] }), this.toStreamerMessages.set("GamepadConnected", { id: 93, structure: [] }), this.toStreamerMessages.set("GamepadButtonPressed", { id: 90, structure: ["uint8", "uint8", "uint8"] }), this.toStreamerMessages.set("GamepadButtonReleased", { id: 91, structure: ["uint8", "uint8", "uint8"] }), this.toStreamerMessages.set("GamepadAnalog", { id: 92, structure: ["uint8", "uint8", "double"] }), this.toStreamerMessages.set("GamepadDisconnected", { id: 94, structure: ["uint8"] }), this.fromStreamerMessages.set(0, "QualityControlOwnership"), this.fromStreamerMessages.set(1, "Response"), this.fromStreamerMessages.set(2, "Command"), this.fromStreamerMessages.set(3, "FreezeFrame"), this.fromStreamerMessages.set(4, "UnfreezeFrame"), this.fromStreamerMessages.set(5, "VideoEncoderAvgQP"), this.fromStreamerMessages.set(6, "LatencyTest"), this.fromStreamerMessages.set(7, "InitialSettings"), this.fromStreamerMessages.set(8, "FileExtension"), this.fromStreamerMessages.set(9, "FileMimeType"), this.fromStreamerMessages.set(10, "FileContents"), this.fromStreamerMessages.set(11, "TestEcho"), this.fromStreamerMessages.set(12, "InputControlOwnership"), this.fromStreamerMessages.set(13, "GamepadResponse"), this.fromStreamerMessages.set(14, "DataChannelLatencyTest"), this.fromStreamerMessages.set(255, "Protocol");
  }
  registerMessageHandler(e, t, s) {
    switch (e) {
      case y.ToStreamer:
        this.toStreamerHandlers.set(t, s);
        break;
      case y.FromStreamer:
        this.fromStreamerHandlers.set(t, s);
        break;
      default:
        c.Log(c.GetStackTrace(), `Unknown message direction ${e}`);
    }
  }
}
(function(i) {
  i[i.ToStreamer = 0] = "ToStreamer", i[i.FromStreamer = 1] = "FromStreamer";
})(y || (y = {}));
class Ui {
  constructor() {
    this.responseEventListeners = /* @__PURE__ */ new Map();
  }
  addResponseEventListener(e, t) {
    this.responseEventListeners.set(e, t);
  }
  removeResponseEventListener(e) {
    this.responseEventListeners.delete(e);
  }
  onResponse(e) {
    c.Log(c.GetStackTrace(), "DataChannelReceiveMessageType.Response", 6);
    const t = new TextDecoder("utf-16").decode(e.slice(1));
    c.Log(c.GetStackTrace(), t, 6), this.responseEventListeners.forEach((s) => {
      s(t);
    });
  }
}
class zi {
  constructor(e, t) {
    this.dataChannelSender = e, this.toStreamerMessagesMapProvider = t;
  }
  sendMessageToStreamer(e, t) {
    t === void 0 && (t = []);
    const s = this.toStreamerMessagesMapProvider.toStreamerMessages.get(e);
    if (s === void 0) return void c.Error(c.GetStackTrace(), `Attempted to send a message to the streamer with message type: ${e}, but the frontend hasn't been configured to send such a message. Check you've added the message type in your cpp`);
    if (s.structure && t && s.structure.length !== t.length) return void c.Error(c.GetStackTrace(), `Provided message data doesn't match expected layout. Expected [ ${s.structure.map((d) => {
      switch (d) {
        case "uint8":
        case "uint16":
        case "int16":
        case "float":
        case "double":
          return "number";
        case "string":
          return "string";
      }
    }).toString()} ] but received [ ${t.map((d) => typeof d).toString()} ]`);
    let n = 0;
    const r = new TextEncoder();
    t.forEach((d, h) => {
      switch (s.structure[h]) {
        case "uint8":
          n += 1;
          break;
        case "uint16":
        case "int16":
          n += 2;
          break;
        case "float":
          n += 4;
          break;
        case "double":
          n += 8;
          break;
        case "string":
          n += 2, n += 2 * r.encode(d).length;
      }
    });
    const o = new DataView(new ArrayBuffer(n + 1));
    o.setUint8(0, s.id);
    let a = 1;
    t.forEach((d, h) => {
      switch (s.structure[h]) {
        case "uint8":
          o.setUint8(a, d), a += 1;
          break;
        case "uint16":
          o.setUint16(a, d, !0), a += 2;
          break;
        case "int16":
          o.setInt16(a, d, !0), a += 2;
          break;
        case "float":
          o.setFloat32(a, d, !0), a += 4;
          break;
        case "double":
          o.setFloat64(a, d, !0), a += 8;
          break;
        case "string":
          o.setUint16(a, d.length, !0), a += 2;
          for (let u = 0; u < d.length; u++) o.setUint16(a, d.charCodeAt(u), !0), a += 2;
      }
    }), this.dataChannelSender.canSend() ? this.dataChannelSender.sendData(o.buffer) : c.Info(c.GetStackTrace(), `Data channel cannot send yet, skipping sending message: ${e} - ${new Uint8Array(o.buffer)}`);
  }
}
class Bi {
  constructor(e) {
    this.sendMessageController = e;
  }
  SendRequestQualityControl() {
    this.sendMessageController.sendMessageToStreamer("RequestQualityControl");
  }
  SendMaxFpsRequest() {
    this.sendMessageController.sendMessageToStreamer("FpsRequest");
  }
  SendAverageBitrateRequest() {
    this.sendMessageController.sendMessageToStreamer("AverageBitrateRequest");
  }
  SendStartStreaming() {
    this.sendMessageController.sendMessageToStreamer("StartStreaming");
  }
  SendStopStreaming() {
    this.sendMessageController.sendMessageToStreamer("StopStreaming");
  }
  SendRequestInitialSettings() {
    this.sendMessageController.sendMessageToStreamer("RequestInitialSettings");
  }
}
let Gi = class {
  constructor(e) {
    this.dataChannelProvider = e;
  }
  canSend() {
    return this.dataChannelProvider.getDataChannelInstance().dataChannel !== void 0 && this.dataChannelProvider.getDataChannelInstance().dataChannel.readyState == "open";
  }
  sendData(e) {
    const t = this.dataChannelProvider.getDataChannelInstance();
    t.dataChannel.readyState == "open" ? (t.dataChannel.send(e), c.Log(c.GetStackTrace(), `Message Sent: ${new Uint8Array(e)}`, 6), this.resetAfkWarningTimerOnDataSend()) : c.Error(c.GetStackTrace(), `Message Failed: ${new Uint8Array(e)}`);
  }
  resetAfkWarningTimerOnDataSend() {
  }
};
class Ni {
  constructor(e) {
    this.videoElementProvider = e, this.normalizeAndQuantizeUnsignedFunc = () => {
      throw new Error("Normalize and quantize unsigned, method not implemented.");
    }, this.normalizeAndQuantizeSignedFunc = () => {
      throw new Error("Normalize and unquantize signed, method not implemented.");
    }, this.denormalizeAndUnquantizeUnsignedFunc = () => {
      throw new Error("Denormalize and unquantize unsigned, method not implemented.");
    };
  }
  normalizeAndQuantizeUnsigned(e, t) {
    return this.normalizeAndQuantizeUnsignedFunc(e, t);
  }
  unquantizeAndDenormalizeUnsigned(e, t) {
    return this.denormalizeAndUnquantizeUnsignedFunc(e, t);
  }
  normalizeAndQuantizeSigned(e, t) {
    return this.normalizeAndQuantizeSignedFunc(e, t);
  }
  setupNormalizeAndQuantize() {
    if (this.videoElementParent = this.videoElementProvider.getVideoParentElement(), this.videoElement = this.videoElementProvider.getVideoElement(), this.videoElementParent && this.videoElement) {
      const e = this.videoElementParent.clientWidth || 1, t = this.videoElementParent.clientHeight || 1, s = this.videoElement.videoWidth || 1, n = t / e, r = (this.videoElement.videoHeight || 1) / s;
      n > r ? (c.Log(c.GetStackTrace(), "Setup Normalize and Quantize for playerAspectRatio > videoAspectRatio", 6), this.ratio = n / r, this.normalizeAndQuantizeUnsignedFunc = (o, a) => this.normalizeAndQuantizeUnsignedPlayerBigger(o, a), this.normalizeAndQuantizeSignedFunc = (o, a) => this.normalizeAndQuantizeSignedPlayerBigger(o, a), this.denormalizeAndUnquantizeUnsignedFunc = (o, a) => this.denormalizeAndUnquantizeUnsignedPlayerBigger(o, a)) : (c.Log(c.GetStackTrace(), "Setup Normalize and Quantize for playerAspectRatio <= videoAspectRatio", 6), this.ratio = r / n, this.normalizeAndQuantizeUnsignedFunc = (o, a) => this.normalizeAndQuantizeUnsignedPlayerSmaller(o, a), this.normalizeAndQuantizeSignedFunc = (o, a) => this.normalizeAndQuantizeSignedPlayerSmaller(o, a), this.denormalizeAndUnquantizeUnsignedFunc = (o, a) => this.denormalizeAndUnquantizeUnsignedPlayerSmaller(o, a));
    }
  }
  normalizeAndQuantizeUnsignedPlayerBigger(e, t) {
    const s = e / this.videoElementParent.clientWidth, n = this.ratio * (t / this.videoElementParent.clientHeight - 0.5) + 0.5;
    return s < 0 || s > 1 || n < 0 || n > 1 ? new Oe(!1, 65535, 65535) : new Oe(!0, 65536 * s, 65536 * n);
  }
  denormalizeAndUnquantizeUnsignedPlayerBigger(e, t) {
    const s = e / 65536, n = (t / 65536 - 0.5) / this.ratio + 0.5;
    return new gt(s * this.videoElementParent.clientWidth, n * this.videoElementParent.clientHeight);
  }
  normalizeAndQuantizeSignedPlayerBigger(e, t) {
    const s = e / (0.5 * this.videoElementParent.clientWidth), n = this.ratio * t / (0.5 * this.videoElementParent.clientHeight);
    return new _t(32767 * s, 32767 * n);
  }
  normalizeAndQuantizeUnsignedPlayerSmaller(e, t) {
    const s = this.ratio * (e / this.videoElementParent.clientWidth - 0.5) + 0.5, n = t / this.videoElementParent.clientHeight;
    return s < 0 || s > 1 || n < 0 || n > 1 ? new Oe(!1, 65535, 65535) : new Oe(!0, 65536 * s, 65536 * n);
  }
  denormalizeAndUnquantizeUnsignedPlayerSmaller(e, t) {
    const s = (e / 65536 - 0.5) / this.ratio + 0.5, n = t / 65536;
    return new gt(s * this.videoElementParent.clientWidth, n * this.videoElementParent.clientHeight);
  }
  normalizeAndQuantizeSignedPlayerSmaller(e, t) {
    const s = this.ratio * e / (0.5 * this.videoElementParent.clientWidth), n = t / (0.5 * this.videoElementParent.clientHeight);
    return new _t(32767 * s, 32767 * n);
  }
}
class Oe {
  constructor(e, t, s) {
    this.inRange = e, this.x = t, this.y = s;
  }
}
class gt {
  constructor(e, t) {
    this.x = e, this.y = t;
  }
}
class _t {
  constructor(e, t) {
    this.x = e, this.y = t;
  }
}
class Nn {
  constructor(e, t) {
    this.shouldShowPlayOverlay = !0, this.autoJoinTimer = void 0, this.config = e, this.pixelStreaming = t, this.responseController = new Ui(), this.file = new wi(), this.sdpConstraints = { offerToReceiveAudio: !0, offerToReceiveVideo: !0 }, this.afkController = new xn(this.config, this.pixelStreaming, this.onAfkTriggered.bind(this)), this.afkController.onAFKTimedOutCallback = () => {
      this.closeSignalingServer("You have been disconnected due to inactivity");
    }, this.freezeFrameController = new ui(this.pixelStreaming.videoElementParent), this.videoPlayer = new Di(this.pixelStreaming.videoElementParent, this.config), this.videoPlayer.onVideoInitialized = () => this.handleVideoInitialized(), this.videoPlayer.onMatchViewportResolutionCallback = (s, n) => {
      const r = { "Resolution.Width": s, "Resolution.Height": n };
      this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify(r)]);
    }, this.videoPlayer.onResizePlayerCallback = () => {
      this.setUpMouseAndFreezeFrame();
    }, this.streamController = new di(this.videoPlayer), this.coordinateConverter = new Ni(this.videoPlayer), this.sendrecvDataChannelController = new Ot(), this.recvDataChannelController = new Ot(), this.registerDataChannelEventEmitters(this.sendrecvDataChannelController), this.registerDataChannelEventEmitters(this.recvDataChannelController), this.dataChannelSender = new Gi(this.sendrecvDataChannelController), this.dataChannelSender.resetAfkWarningTimerOnDataSend = () => this.afkController.resetAfkWarningTimer(), this.streamMessageController = new _i(), this.webSocketController = new js(), this.webSocketController.onConfig = (s) => this.handleOnConfigMessage(s), this.webSocketController.onStreamerList = (s) => this.handleStreamerListMessage(s), this.webSocketController.onPlayerCount = (s) => {
      this.pixelStreaming._onPlayerCount(s.count);
    }, this.webSocketController.onOpen.addEventListener("open", () => {
      this.config.isFlagEnabled(m.BrowserSendOffer) || this.webSocketController.requestStreamerList();
    }), this.webSocketController.onClose.addEventListener("close", (s) => {
      const n = this.shouldReconnect && s.detail.code != 1001 && this.config.getNumericSettingValue(w.MaxReconnectAttempts) > 0, r = this.disconnectMessage ? this.disconnectMessage : s.detail.reason;
      this.pixelStreaming._onDisconnect(r, !n && !this.isReconnecting), this.afkController.stopAfkWarningTimer(), this.statsTimerHandle && this.statsTimerHandle !== void 0 && window.clearInterval(this.statsTimerHandle), this.setVideoEncoderAvgQP(0), this.setTouchInputEnabled(!1), this.setMouseInputEnabled(!1), this.setKeyboardInputEnabled(!1), this.setGamePadInputEnabled(!1), n && setTimeout(() => {
        this.isReconnecting = !0, this.reconnectAttempt++, this.tryReconnect(s.detail.reason);
      }, 2e3);
    }), this.sendMessageController = new zi(this.dataChannelSender, this.streamMessageController), this.toStreamerMessagesController = new Bi(this.sendMessageController), this.registerMessageHandlers(), this.streamMessageController.populateDefaultProtocol(), this.inputClassesFactory = new Oi(this.streamMessageController, this.videoPlayer, this.coordinateConverter), this.isUsingSFU = !1, this.isQualityController = !1, this.preferredCodec = "", this.shouldReconnect = !0, this.isReconnecting = !1, this.reconnectAttempt = 0, this.config._addOnOptionSettingChangedListener(A.StreamerId, (s) => {
      s !== "" && (this.peerConnectionController.peerConnection.close(), this.peerConnectionController.createPeerConnection(this.peerConfig, this.preferredCodec), this.subscribedStream = s, this.webSocketController.sendSubscribe(s));
    }), this.setVideoEncoderAvgQP(-1), this.signallingUrlBuilder = () => {
      let s = this.config.getTextSettingValue(se.SignallingServerUrl);
      return this.config.isFlagEnabled(m.BrowserSendOffer) && (s += "?" + m.BrowserSendOffer + "=true"), s;
    };
  }
  requestUnquantizedAndDenormalizeUnsigned(e, t) {
    return this.coordinateConverter.unquantizeAndDenormalizeUnsigned(e, t);
  }
  handleOnMessage(e) {
    const t = new Uint8Array(e.data);
    c.Log(c.GetStackTrace(), "Message incoming:" + t, 6);
    const s = this.streamMessageController.fromStreamerMessages.get(t[0]);
    this.streamMessageController.fromStreamerHandlers.get(s)(e.data);
  }
  registerMessageHandlers() {
    this.streamMessageController.registerMessageHandler(y.FromStreamer, "QualityControlOwnership", (e) => this.onQualityControlOwnership(e)), this.streamMessageController.registerMessageHandler(y.FromStreamer, "Response", (e) => this.responseController.onResponse(e)), this.streamMessageController.registerMessageHandler(y.FromStreamer, "Command", (e) => {
      this.onCommand(e);
    }), this.streamMessageController.registerMessageHandler(y.FromStreamer, "FreezeFrame", (e) => this.onFreezeFrameMessage(e)), this.streamMessageController.registerMessageHandler(y.FromStreamer, "UnfreezeFrame", () => this.invalidateFreezeFrameAndEnableVideo()), this.streamMessageController.registerMessageHandler(y.FromStreamer, "VideoEncoderAvgQP", (e) => this.handleVideoEncoderAvgQP(e)), this.streamMessageController.registerMessageHandler(y.FromStreamer, "LatencyTest", (e) => this.handleLatencyTestResult(e)), this.streamMessageController.registerMessageHandler(y.FromStreamer, "DataChannelLatencyTest", (e) => this.handleDataChannelLatencyTestResponse(e)), this.streamMessageController.registerMessageHandler(y.FromStreamer, "InitialSettings", (e) => this.handleInitialSettings(e)), this.streamMessageController.registerMessageHandler(y.FromStreamer, "FileExtension", (e) => this.onFileExtension(e)), this.streamMessageController.registerMessageHandler(y.FromStreamer, "FileMimeType", (e) => this.onFileMimeType(e)), this.streamMessageController.registerMessageHandler(y.FromStreamer, "FileContents", (e) => this.onFileContents(e)), this.streamMessageController.registerMessageHandler(y.FromStreamer, "TestEcho", () => {
    }), this.streamMessageController.registerMessageHandler(y.FromStreamer, "InputControlOwnership", (e) => this.onInputControlOwnership(e)), this.streamMessageController.registerMessageHandler(y.FromStreamer, "GamepadResponse", (e) => this.onGamepadResponse(e)), this.streamMessageController.registerMessageHandler(y.FromStreamer, "Protocol", (e) => this.onProtocolMessage(e)), this.streamMessageController.registerMessageHandler(y.ToStreamer, "IFrameRequest", () => this.sendMessageController.sendMessageToStreamer("IFrameRequest")), this.streamMessageController.registerMessageHandler(y.ToStreamer, "RequestQualityControl", () => this.sendMessageController.sendMessageToStreamer("RequestQualityControl")), this.streamMessageController.registerMessageHandler(y.ToStreamer, "FpsRequest", () => this.sendMessageController.sendMessageToStreamer("FpsRequest")), this.streamMessageController.registerMessageHandler(y.ToStreamer, "AverageBitrateRequest", () => this.sendMessageController.sendMessageToStreamer("AverageBitrateRequest")), this.streamMessageController.registerMessageHandler(y.ToStreamer, "StartStreaming", () => this.sendMessageController.sendMessageToStreamer("StartStreaming")), this.streamMessageController.registerMessageHandler(y.ToStreamer, "StopStreaming", () => this.sendMessageController.sendMessageToStreamer("StopStreaming")), this.streamMessageController.registerMessageHandler(y.ToStreamer, "LatencyTest", (e) => this.sendMessageController.sendMessageToStreamer("LatencyTest", e)), this.streamMessageController.registerMessageHandler(y.ToStreamer, "RequestInitialSettings", () => this.sendMessageController.sendMessageToStreamer("RequestInitialSettings")), this.streamMessageController.registerMessageHandler(y.ToStreamer, "TestEcho", () => {
    }), this.streamMessageController.registerMessageHandler(y.ToStreamer, "UIInteraction", (e) => this.sendMessageController.sendMessageToStreamer("UIInteraction", e)), this.streamMessageController.registerMessageHandler(y.ToStreamer, "Command", (e) => this.sendMessageController.sendMessageToStreamer("Command", e)), this.streamMessageController.registerMessageHandler(y.ToStreamer, "TextboxEntry", (e) => this.sendMessageController.sendMessageToStreamer("TextboxEntry", e)), this.streamMessageController.registerMessageHandler(y.ToStreamer, "KeyDown", (e) => this.sendMessageController.sendMessageToStreamer("KeyDown", e)), this.streamMessageController.registerMessageHandler(y.ToStreamer, "KeyUp", (e) => this.sendMessageController.sendMessageToStreamer("KeyUp", e)), this.streamMessageController.registerMessageHandler(y.ToStreamer, "KeyPress", (e) => this.sendMessageController.sendMessageToStreamer("KeyPress", e)), this.streamMessageController.registerMessageHandler(y.ToStreamer, "MouseEnter", (e) => this.sendMessageController.sendMessageToStreamer("MouseEnter", e)), this.streamMessageController.registerMessageHandler(y.ToStreamer, "MouseLeave", (e) => this.sendMessageController.sendMessageToStreamer("MouseLeave", e)), this.streamMessageController.registerMessageHandler(y.ToStreamer, "MouseDown", (e) => this.sendMessageController.sendMessageToStreamer("MouseDown", e)), this.streamMessageController.registerMessageHandler(y.ToStreamer, "MouseUp", (e) => this.sendMessageController.sendMessageToStreamer("MouseUp", e)), this.streamMessageController.registerMessageHandler(y.ToStreamer, "MouseMove", (e) => this.sendMessageController.sendMessageToStreamer("MouseMove", e)), this.streamMessageController.registerMessageHandler(y.ToStreamer, "MouseWheel", (e) => this.sendMessageController.sendMessageToStreamer("MouseWheel", e)), this.streamMessageController.registerMessageHandler(y.ToStreamer, "MouseDouble", (e) => this.sendMessageController.sendMessageToStreamer("MouseDouble", e)), this.streamMessageController.registerMessageHandler(y.ToStreamer, "TouchStart", (e) => this.sendMessageController.sendMessageToStreamer("TouchStart", e)), this.streamMessageController.registerMessageHandler(y.ToStreamer, "TouchEnd", (e) => this.sendMessageController.sendMessageToStreamer("TouchEnd", e)), this.streamMessageController.registerMessageHandler(y.ToStreamer, "TouchMove", (e) => this.sendMessageController.sendMessageToStreamer("TouchMove", e)), this.streamMessageController.registerMessageHandler(y.ToStreamer, "GamepadConnected", () => this.sendMessageController.sendMessageToStreamer("GamepadConnected")), this.streamMessageController.registerMessageHandler(y.ToStreamer, "GamepadButtonPressed", (e) => this.sendMessageController.sendMessageToStreamer("GamepadButtonPressed", e)), this.streamMessageController.registerMessageHandler(y.ToStreamer, "GamepadButtonReleased", (e) => this.sendMessageController.sendMessageToStreamer("GamepadButtonReleased", e)), this.streamMessageController.registerMessageHandler(y.ToStreamer, "GamepadAnalog", (e) => this.sendMessageController.sendMessageToStreamer("GamepadAnalog", e)), this.streamMessageController.registerMessageHandler(y.ToStreamer, "GamepadDisconnected", (e) => this.sendMessageController.sendMessageToStreamer("GamepadDisconnected", e)), this.streamMessageController.registerMessageHandler(y.ToStreamer, "XRHMDTransform", (e) => this.sendMessageController.sendMessageToStreamer("XRHMDTransform", e)), this.streamMessageController.registerMessageHandler(y.ToStreamer, "XRControllerTransform", (e) => this.sendMessageController.sendMessageToStreamer("XRControllerTransform", e)), this.streamMessageController.registerMessageHandler(y.ToStreamer, "XRSystem", (e) => this.sendMessageController.sendMessageToStreamer("XRSystem", e)), this.streamMessageController.registerMessageHandler(y.ToStreamer, "XRButtonTouched", (e) => this.sendMessageController.sendMessageToStreamer("XRButtonTouched", e)), this.streamMessageController.registerMessageHandler(y.ToStreamer, "XRButtonPressed", (e) => this.sendMessageController.sendMessageToStreamer("XRButtonPressed", e)), this.streamMessageController.registerMessageHandler(y.ToStreamer, "XRButtonReleased", (e) => this.sendMessageController.sendMessageToStreamer("XRButtonReleased", e)), this.streamMessageController.registerMessageHandler(y.ToStreamer, "XRAnalog", (e) => this.sendMessageController.sendMessageToStreamer("XRAnalog", e));
  }
  onCommand(e) {
    c.Log(c.GetStackTrace(), "DataChannelReceiveMessageType.Command", 6);
    const t = new TextDecoder("utf-16").decode(e.slice(1));
    c.Log(c.GetStackTrace(), "Data Channel Command: " + t, 6);
    const s = JSON.parse(t);
    s.command === "onScreenKeyboard" && this.pixelStreaming._activateOnScreenKeyboard(s);
  }
  onProtocolMessage(e) {
    try {
      const t = new TextDecoder("utf-16").decode(e.slice(1)), s = JSON.parse(t);
      Object.prototype.hasOwnProperty.call(s, "Direction") || c.Error(c.GetStackTrace(), "Malformed protocol received. Ensure the protocol message contains a direction");
      const n = s.Direction;
      delete s.Direction, c.Log(c.GetStackTrace(), `Received new ${n == y.FromStreamer ? "FromStreamer" : "ToStreamer"} protocol. Updating existing protocol...`), Object.keys(s).forEach((r) => {
        const o = s[r];
        switch (n) {
          case y.ToStreamer:
            if (!Object.prototype.hasOwnProperty.call(o, "id")) return void c.Error(c.GetStackTrace(), `ToStreamer->${r} protocol definition was malformed as it didn't contain at least an id

                                           Definition was: ${JSON.stringify(o, null, 2)}`);
            if (r === "UIInteraction" || r === "Command" || r === "LatencyTest") return;
            this.streamMessageController.toStreamerHandlers.get(r) ? this.streamMessageController.toStreamerMessages.set(r, o) : c.Error(c.GetStackTrace(), `There was no registered handler for "${r}" - try adding one using registerMessageHandler(MessageDirection.ToStreamer, "${r}", myHandler)`);
            break;
          case y.FromStreamer:
            if (!Object.prototype.hasOwnProperty.call(o, "id")) return void c.Error(c.GetStackTrace(), `FromStreamer->${r} protocol definition was malformed as it didn't contain at least an id

                            Definition was: ${JSON.stringify(o, null, 2)}`);
            this.streamMessageController.fromStreamerHandlers.get(r) ? this.streamMessageController.fromStreamerMessages.set(o.id, r) : c.Error(c.GetStackTrace(), `There was no registered handler for "${o}" - try adding one using registerMessageHandler(MessageDirection.FromStreamer, "${r}", myHandler)`);
            break;
          default:
            c.Error(c.GetStackTrace(), `Unknown direction: ${n}`);
        }
      }), this.toStreamerMessagesController.SendRequestInitialSettings(), this.toStreamerMessagesController.SendRequestQualityControl();
    } catch (t) {
      c.Log(c.GetStackTrace(), t);
    }
  }
  onInputControlOwnership(e) {
    const t = new Uint8Array(e);
    c.Log(c.GetStackTrace(), "DataChannelReceiveMessageType.InputControlOwnership", 6);
    const s = new Boolean(t[1]).valueOf();
    c.Log(c.GetStackTrace(), `Received input controller message - will your input control the stream: ${s}`), this.pixelStreaming._onInputControlOwnership(s);
  }
  onGamepadResponse(e) {
    const t = new TextDecoder("utf-16").decode(e.slice(1)), s = JSON.parse(t);
    this.gamePadController.onGamepadResponseReceived(s.controllerId);
  }
  onAfkTriggered() {
    this.afkController.onAfkClick(), this.videoPlayer.isPaused() && this.videoPlayer.hasVideoSource() && this.playStream();
  }
  setAfkEnabled(e) {
    e ? this.onAfkTriggered() : this.afkController.stopAfkWarningTimer();
  }
  tryReconnect(e) {
    this.webSocketController ? (this.isReconnecting = !0, this.webSocketController.webSocket && this.webSocketController.webSocket.readyState != WebSocket.CLOSED ? (this.closeSignalingServer(`${e} Restarting stream...`), setTimeout(() => {
      this.tryReconnect(e);
    }, 3e3)) : (this.pixelStreaming._onWebRtcAutoConnect(), this.connectToSignallingServer())) : c.Log(c.GetStackTrace(), "The Web Socket Controller does not exist so this will not work right now.");
  }
  loadFreezeFrameOrShowPlayOverlay() {
    this.pixelStreaming.dispatchEvent(new Sn({ shouldShowPlayOverlay: this.shouldShowPlayOverlay, isValid: this.freezeFrameController.valid, jpegData: this.freezeFrameController.jpeg })), this.shouldShowPlayOverlay === !0 ? (c.Log(c.GetStackTrace(), "showing play overlay"), this.resizePlayerStyle()) : (c.Log(c.GetStackTrace(), "showing freeze frame"), this.freezeFrameController.showFreezeFrame()), setTimeout(() => {
      this.videoPlayer.setVideoEnabled(!1);
    }, this.freezeFrameController.freezeFrameDelay);
  }
  onFreezeFrameMessage(e) {
    c.Log(c.GetStackTrace(), "DataChannelReceiveMessageType.FreezeFrame", 6);
    const t = new Uint8Array(e);
    this.freezeFrameController.processFreezeFrameMessage(t, () => this.loadFreezeFrameOrShowPlayOverlay());
  }
  invalidateFreezeFrameAndEnableVideo() {
    c.Log(c.GetStackTrace(), "DataChannelReceiveMessageType.FreezeFrame", 6), setTimeout(() => {
      this.pixelStreaming.dispatchEvent(new Cn()), this.freezeFrameController.hideFreezeFrame();
    }, this.freezeFrameController.freezeFrameDelay), this.videoPlayer.getVideoElement() && this.videoPlayer.setVideoEnabled(!0);
  }
  onFileExtension(e) {
    const t = new Uint8Array(e);
    je.setExtensionFromBytes(t, this.file);
  }
  onFileMimeType(e) {
    const t = new Uint8Array(e);
    je.setMimeTypeFromBytes(t, this.file);
  }
  onFileContents(e) {
    const t = new Uint8Array(e);
    je.setContentsFromBytes(t, this.file);
  }
  playStream() {
    if (!this.videoPlayer.getVideoElement()) {
      const e = "Could not play video stream because the video player was not initialized correctly.";
      return this.pixelStreaming.dispatchEvent(new vn({ message: e })), c.Error(c.GetStackTrace(), e), void this.closeSignalingServer("Stream not initialized correctly");
    }
    if (this.videoPlayer.hasVideoSource()) {
      if (this.setTouchInputEnabled(this.config.isFlagEnabled(m.TouchInput)), this.pixelStreaming.dispatchEvent(new fn()), this.streamController.audioElement.srcObject) {
        const e = this.config.isFlagEnabled(m.StartVideoMuted);
        this.streamController.audioElement.muted = e, e ? this.playVideo() : this.streamController.audioElement.play().then(() => {
          this.playVideo();
        }).catch((t) => {
          c.Log(c.GetStackTrace(), t), c.Log(c.GetStackTrace(), "Browser does not support autoplaying video without interaction - to resolve this we are going to show the play button overlay."), this.pixelStreaming.dispatchEvent(new ht({ reason: t }));
        });
      } else this.playVideo();
      this.shouldShowPlayOverlay = !1, this.freezeFrameController.showFreezeFrame();
    } else c.Warning(c.GetStackTrace(), "Cannot play stream, the video element has no srcObject to play.");
  }
  playVideo() {
    this.videoPlayer.play().catch((e) => {
      this.streamController.audioElement.srcObject && this.streamController.audioElement.pause(), c.Log(c.GetStackTrace(), e), c.Log(c.GetStackTrace(), "Browser does not support autoplaying video without interaction - to resolve this we are going to show the play button overlay."), this.pixelStreaming.dispatchEvent(new ht({ reason: e }));
    });
  }
  autoPlayVideoOrSetUpPlayOverlay() {
    this.config.isFlagEnabled(m.AutoPlayVideo) && this.playStream(), this.resizePlayerStyle();
  }
  connectToSignallingServer() {
    this.locallyClosed = !1, this.shouldReconnect = !0, this.disconnectMessage = null;
    const e = this.signallingUrlBuilder();
    this.webSocketController.connect(e);
  }
  startSession(e) {
    if (this.peerConfig = e, this.config.isFlagEnabled(m.ForceTURN) && !this.checkTurnServerAvailability(e)) return c.Info(c.GetStackTrace(), "No turn server was found in the Peer Connection Options. TURN cannot be forced, closing connection. Please use STUN instead"), void this.closeSignalingServer("TURN cannot be forced, closing connection. Please use STUN instead.");
    this.peerConnectionController = new Ti(this.peerConfig, this.config, this.preferredCodec), this.peerConnectionController.onVideoStats = (s) => this.handleVideoStats(s), this.peerConnectionController.onSendWebRTCOffer = (s) => this.handleSendWebRTCOffer(s), this.peerConnectionController.onSendWebRTCAnswer = (s) => this.handleSendWebRTCAnswer(s), this.peerConnectionController.onPeerIceCandidate = (s) => this.handleSendIceCandidate(s), this.peerConnectionController.onDataChannel = (s) => this.handleDataChannel(s), this.peerConnectionController.showTextOverlayConnecting = () => this.pixelStreaming._onWebRtcConnecting(), this.peerConnectionController.showTextOverlaySetupFailure = () => this.pixelStreaming._onWebRtcFailed();
    let t = !1;
    this.peerConnectionController.onIceConnectionStateChange = () => {
      !t && ["connected", "completed"].includes(this.peerConnectionController.peerConnection.iceConnectionState) && (this.pixelStreaming._onWebRtcConnected(), t = !0);
    }, this.peerConnectionController.onTrack = (s) => this.streamController.handleOnTrack(s), this.config.isFlagEnabled(m.BrowserSendOffer) && (this.sendrecvDataChannelController.createDataChannel(this.peerConnectionController.peerConnection, "cirrus", this.datachannelOptions), this.sendrecvDataChannelController.handleOnMessage = (s) => this.handleOnMessage(s), this.peerConnectionController.createOffer(this.sdpConstraints, this.config));
  }
  checkTurnServerAvailability(e) {
    if (!e.iceServers) return c.Info(c.GetStackTrace(), "A turn sever was not found"), !1;
    for (const t of e.iceServers) for (const s of t.urls) if (s.includes("turn")) return c.Log(c.GetStackTrace(), `A turn sever was found at ${s}`), !0;
    return c.Info(c.GetStackTrace(), "A turn sever was not found"), !1;
  }
  handleOnConfigMessage(e) {
    this.resizePlayerStyle(), this.startSession(e.peerConnectionOptions), this.webSocketController.onWebRtcAnswer = (t) => this.handleWebRtcAnswer(t), this.webSocketController.onWebRtcOffer = (t) => this.handleWebRtcOffer(t), this.webSocketController.onWebRtcPeerDataChannels = (t) => this.handleWebRtcSFUPeerDatachannels(t), this.webSocketController.onIceCandidate = (t) => this.handleIceCandidate(t);
  }
  handleStreamerListMessage(e) {
    c.Log(c.GetStackTrace(), `Got streamer list ${e.ids}`, 6);
    const t = [...e.ids];
    t.unshift(""), this.config.setOptionSettingOptions(A.StreamerId, t);
    let s = null, n = null;
    const r = this.config.isFlagEnabled(m.WaitForStreamer), o = this.config.getNumericSettingValue(w.MaxReconnectAttempts), a = this.config.getNumericSettingValue(w.StreamerAutoJoinInterval), d = new URLSearchParams(window.location.search);
    d.has(A.StreamerId) ? s = d.get(A.StreamerId) : this.subscribedStream && (s = this.subscribedStream), s && e.ids.includes(s) ? n = s : s && r || e.ids.length != 1 || (n = e.ids[0]), n ? (this.isReconnecting = !1, this.reconnectAttempt = 0, this.config.setOptionSettingValue(A.StreamerId, n)) : r && (this.reconnectAttempt < o ? (this.isReconnecting = !0, this.reconnectAttempt++, setTimeout(() => {
      this.webSocketController.requestStreamerList();
    }, a)) : (this.reconnectAttempt = 0, this.isReconnecting = !1, this.shouldReconnect = !1)), this.pixelStreaming.dispatchEvent(new En({ messageStreamerList: e, autoSelectedStreamerId: n, wantedStreamerId: s }));
  }
  handleWebRtcAnswer(e) {
    c.Log(c.GetStackTrace(), `Got answer sdp ${e.sdp}`, 6);
    const t = { sdp: e.sdp, type: "answer" };
    this.peerConnectionController.receiveAnswer(t), this.handlePostWebrtcNegotiation();
  }
  handleWebRtcOffer(e) {
    c.Log(c.GetStackTrace(), `Got offer sdp ${e.sdp}`, 6), this.isUsingSFU = !!e.sfu && e.sfu, this.isUsingSFU && (this.peerConnectionController.preferredCodec = "");
    const t = { sdp: e.sdp, type: "offer" };
    this.peerConnectionController.receiveOffer(t, this.config), this.handlePostWebrtcNegotiation();
  }
  handleWebRtcSFUPeerDatachannels(e) {
    const t = { ordered: !0, negotiated: !0, id: e.sendStreamId }, s = e.sendStreamId != e.recvStreamId;
    if (this.sendrecvDataChannelController.createDataChannel(this.peerConnectionController.peerConnection, s ? "send-datachannel" : "datachannel", t), s) {
      const n = { ordered: !0, negotiated: !0, id: e.recvStreamId };
      this.recvDataChannelController.createDataChannel(this.peerConnectionController.peerConnection, "recv-datachannel", n), this.recvDataChannelController.handleOnOpen = () => this.webSocketController.sendSFURecvDataChannelReady(), this.recvDataChannelController.handleOnMessage = (r) => this.handleOnMessage(r);
    } else this.sendrecvDataChannelController.handleOnMessage = (n) => this.handleOnMessage(n);
  }
  handlePostWebrtcNegotiation() {
    this.afkController.startAfkWarningTimer(), this.pixelStreaming._onWebRtcSdp(), this.statsTimerHandle && this.statsTimerHandle !== void 0 && window.clearInterval(this.statsTimerHandle), this.statsTimerHandle = window.setInterval(() => this.getStats(), 1e3), this.setMouseInputEnabled(this.config.isFlagEnabled(m.MouseInput)), this.setKeyboardInputEnabled(this.config.isFlagEnabled(m.KeyboardInput)), this.setGamePadInputEnabled(this.config.isFlagEnabled(m.GamepadInput));
  }
  handleIceCandidate(e) {
    c.Log(c.GetStackTrace(), "Web RTC Controller: onWebRtcIce", 6);
    const t = new RTCIceCandidate(e);
    this.peerConnectionController.handleOnIce(t);
  }
  handleSendIceCandidate(e) {
    c.Log(c.GetStackTrace(), "OnIceCandidate", 6), e.candidate && e.candidate.candidate && this.webSocketController.sendIceCandidate(e.candidate);
  }
  handleDataChannel(e) {
    c.Log(c.GetStackTrace(), "Data channel created for us by browser as we are a receiving peer.", 6), this.sendrecvDataChannelController.dataChannel = e.channel, this.sendrecvDataChannelController.setupDataChannel(), this.sendrecvDataChannelController.handleOnMessage = (t) => this.handleOnMessage(t);
  }
  handleSendWebRTCOffer(e) {
    c.Log(c.GetStackTrace(), "Sending the offer to the Server", 6), this.webSocketController.sendWebRtcOffer(e);
  }
  handleSendWebRTCAnswer(e) {
    c.Log(c.GetStackTrace(), "Sending the answer to the Server", 6), this.webSocketController.sendWebRtcAnswer(e), this.isUsingSFU && this.webSocketController.sendWebRtcDatachannelRequest();
  }
  setUpMouseAndFreezeFrame() {
    this.videoElementParentClientRect = this.videoPlayer.getVideoParentElement().getBoundingClientRect(), this.coordinateConverter.setupNormalizeAndQuantize(), this.freezeFrameController.freezeFrame.resize();
  }
  closeSignalingServer(e) {
    var t;
    this.locallyClosed = !0, this.shouldReconnect = !1, this.disconnectMessage = e, (t = this.webSocketController) === null || t === void 0 || t.close();
  }
  closePeerConnection() {
    var e;
    (e = this.peerConnectionController) === null || e === void 0 || e.close();
  }
  close() {
    this.closeSignalingServer(""), this.closePeerConnection();
  }
  getStats() {
    this.peerConnectionController.generateStats();
  }
  sendLatencyTest() {
    this.latencyStartTime = Date.now(), this.streamMessageController.toStreamerHandlers.get("LatencyTest")([JSON.stringify({ StartTime: this.latencyStartTime })]);
  }
  sendDataChannelLatencyTest(e) {
    this.streamMessageController.toStreamerHandlers.get("DataChannelLatencyTest")([JSON.stringify(e)]);
  }
  sendEncoderMinQP(e) {
    c.Log(c.GetStackTrace(), `MinQP=${e}
`, 6), e != null && this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify({ "Encoder.MinQP": e })]);
  }
  sendEncoderMaxQP(e) {
    c.Log(c.GetStackTrace(), `MaxQP=${e}
`, 6), e != null && this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify({ "Encoder.MaxQP": e })]);
  }
  sendWebRTCMinBitrate(e) {
    c.Log(c.GetStackTrace(), `WebRTC Min Bitrate=${e}`, 6), e != null && this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify({ "WebRTC.MinBitrate": e })]);
  }
  sendWebRTCMaxBitrate(e) {
    c.Log(c.GetStackTrace(), `WebRTC Max Bitrate=${e}`, 6), e != null && this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify({ "WebRTC.MaxBitrate": e })]);
  }
  sendWebRTCFps(e) {
    c.Log(c.GetStackTrace(), `WebRTC FPS=${e}`, 6), e != null && (this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify({ "WebRTC.Fps": e })]), this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify({ "WebRTC.MaxFps": e })]));
  }
  sendShowFps() {
    c.Log(c.GetStackTrace(), "----   Sending show stat to UE   ----", 6), this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify({ "stat.fps": "" })]);
  }
  sendIframeRequest() {
    c.Log(c.GetStackTrace(), "----   Sending Request for an IFrame  ----", 6), this.streamMessageController.toStreamerHandlers.get("IFrameRequest")();
  }
  emitUIInteraction(e) {
    c.Log(c.GetStackTrace(), "----   Sending custom UIInteraction message   ----", 6), this.streamMessageController.toStreamerHandlers.get("UIInteraction")([JSON.stringify(e)]);
  }
  emitCommand(e) {
    c.Log(c.GetStackTrace(), "----   Sending custom Command message   ----", 6), this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify(e)]);
  }
  emitConsoleCommand(e) {
    c.Log(c.GetStackTrace(), "----   Sending custom Command:ConsoleCommand message   ----", 6), this.streamMessageController.toStreamerHandlers.get("Command")([JSON.stringify({ ConsoleCommand: e })]);
  }
  sendRequestQualityControlOwnership() {
    c.Log(c.GetStackTrace(), "----   Sending Request to Control Quality  ----", 6), this.toStreamerMessagesController.SendRequestQualityControl();
  }
  handleLatencyTestResult(e) {
    c.Log(c.GetStackTrace(), "DataChannelReceiveMessageType.latencyTest", 6);
    const t = new TextDecoder("utf-16").decode(e.slice(1)), s = new Gn();
    Object.assign(s, JSON.parse(t)), s.processFields(), s.testStartTimeMs = this.latencyStartTime, s.browserReceiptTimeMs = Date.now(), s.latencyExcludingDecode = ~~(s.browserReceiptTimeMs - s.testStartTimeMs), s.testDuration = ~~(s.TransmissionTimeMs - s.ReceiptTimeMs), s.networkLatency = ~~(s.latencyExcludingDecode - s.testDuration), s.frameDisplayDeltaTimeMs && s.browserReceiptTimeMs && (s.endToEndLatency = (s.frameDisplayDeltaTimeMs, s.networkLatency, ~~+s.CaptureToSendMs)), this.pixelStreaming._onLatencyTestResult(s);
  }
  handleDataChannelLatencyTestResponse(e) {
    c.Log(c.GetStackTrace(), "DataChannelReceiveMessageType.dataChannelLatencyResponse", 6);
    const t = new TextDecoder("utf-16").decode(e.slice(1)), s = JSON.parse(t);
    this.pixelStreaming._onDataChannelLatencyTestResponse(s);
  }
  handleInitialSettings(e) {
    c.Log(c.GetStackTrace(), "DataChannelReceiveMessageType.InitialSettings", 6);
    const t = new TextDecoder("utf-16").decode(e.slice(1)), s = JSON.parse(t), n = new Un();
    s.Encoder && (n.EncoderSettings = s.Encoder), s.WebRTC && (n.WebRTCSettings = s.WebRTC), s.PixelStreaming && (n.PixelStreamingSettings = s.PixelStreaming), s.ConfigOptions && s.ConfigOptions.DefaultToHover !== void 0 && this.config.setFlagEnabled(m.HoveringMouseMode, !!s.ConfigOptions.DefaultToHover), n.ueCompatible(), c.Log(c.GetStackTrace(), t, 6), this.pixelStreaming._onInitialSettings(n);
  }
  handleVideoEncoderAvgQP(e) {
    c.Log(c.GetStackTrace(), "DataChannelReceiveMessageType.VideoEncoderAvgQP", 6);
    const t = Number(new TextDecoder("utf-16").decode(e.slice(1)));
    this.setVideoEncoderAvgQP(t);
  }
  handleVideoInitialized() {
    this.pixelStreaming._onVideoInitialized(), this.autoPlayVideoOrSetUpPlayOverlay(), this.resizePlayerStyle(), this.videoPlayer.updateVideoStreamSize();
  }
  onQualityControlOwnership(e) {
    const t = new Uint8Array(e);
    c.Log(c.GetStackTrace(), "DataChannelReceiveMessageType.QualityControlOwnership", 6), this.isQualityController = new Boolean(t[1]).valueOf(), c.Log(c.GetStackTrace(), `Received quality controller message, will control quality: ${this.isQualityController}`), this.pixelStreaming._onQualityControlOwnership(this.isQualityController);
  }
  handleVideoStats(e) {
    this.pixelStreaming._onVideoStats(e);
  }
  resizePlayerStyle() {
    this.videoPlayer.resizePlayerStyle();
  }
  setPreferredCodec(e) {
    this.preferredCodec = e, this.peerConnectionController && (this.peerConnectionController.preferredCodec = e, this.peerConnectionController.updateCodecSelection = !1);
  }
  setVideoEncoderAvgQP(e) {
    this.videoAvgQp = e, this.pixelStreaming._onVideoEncoderAvgQP(this.videoAvgQp);
  }
  setKeyboardInputEnabled(e) {
    var t;
    (t = this.keyboardController) === null || t === void 0 || t.unregisterKeyBoardEvents(), e && (this.keyboardController = this.inputClassesFactory.registerKeyBoard(this.config));
  }
  setMouseInputEnabled(e) {
    var t;
    if ((t = this.mouseController) === null || t === void 0 || t.unregisterMouseEvents(), e) {
      const s = this.config.isFlagEnabled(m.HoveringMouseMode) ? ne.HoveringMouse : ne.LockedMouse;
      this.mouseController = this.inputClassesFactory.registerMouse(s);
    }
  }
  setTouchInputEnabled(e) {
    var t;
    (t = this.touchController) === null || t === void 0 || t.unregisterTouchEvents(), e && (this.touchController = this.inputClassesFactory.registerTouch(this.config.isFlagEnabled(m.FakeMouseWithTouches), this.videoElementParentClientRect));
  }
  setGamePadInputEnabled(e) {
    var t;
    (t = this.gamePadController) === null || t === void 0 || t.unregisterGamePadEvents(), e && (this.gamePadController = this.inputClassesFactory.registerGamePad(), this.gamePadController.onGamepadConnected = () => {
      this.streamMessageController.toStreamerHandlers.get("GamepadConnected")();
    }, this.gamePadController.onGamepadDisconnected = (s) => {
      this.streamMessageController.toStreamerHandlers.get("GamepadDisconnected")([s]);
    });
  }
  registerDataChannelEventEmitters(e) {
    e.onOpen = (t, s) => this.pixelStreaming.dispatchEvent(new ln({ label: t, event: s })), e.onClose = (t, s) => this.pixelStreaming.dispatchEvent(new cn({ label: t, event: s })), e.onError = (t, s) => this.pixelStreaming.dispatchEvent(new dn({ label: t, event: s }));
  }
  registerMessageHandler(e, t, s) {
    t === y.FromStreamer && s === void 0 && c.Warning(c.GetStackTrace(), `Unable to register handler for ${e} as no handler was passed`), this.streamMessageController.registerMessageHandler(t, e, (n) => s === void 0 && t === y.ToStreamer ? this.sendMessageController.sendMessageToStreamer(e, n) : s(n));
  }
}
class Ut {
  static vertexShader() {
    return `
		attribute vec2 a_position;
		attribute vec2 a_texCoord;

		// input
		uniform vec2 u_resolution;
		uniform vec4 u_offset;

		//
		varying vec2 v_texCoord;

		void main() {
		   // convert the rectangle from pixels to 0.0 to 1.0
		   vec2 zeroToOne = a_position / u_resolution;

		   // convert from 0->1 to 0->2
		   vec2 zeroToTwo = zeroToOne * 2.0;

		   // convert from 0->2 to -1->+1 (clipspace)
		   vec2 clipSpace = zeroToTwo - 1.0;

		   gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
		   // pass the texCoord to the fragment shader
		   // The GPU will interpolate this value between points.
		   v_texCoord = (a_texCoord * u_offset.xy) + u_offset.zw;
		}
		`;
  }
  static fragmentShader() {
    return `
		precision mediump float;

		// our texture
		uniform sampler2D u_image;

		// the texCoords passed in from the vertex shader.
		varying vec2 v_texCoord;

		void main() {
		   gl_FragColor = texture2D(u_image, v_texCoord);
		}
		`;
  }
}
class zt {
  static deepCopyGamepad(e) {
    return JSON.parse(JSON.stringify({ buttons: e.buttons.map((t) => JSON.parse(JSON.stringify({ pressed: t.pressed, touched: t.touched }))), axes: e.axes }));
  }
}
class Hi {
  constructor(e) {
    this.toStreamerMessagesProvider = e, this.controllers = [];
  }
  updateStatus(e, t, s) {
    if (e.gamepad) {
      const n = t.getPose(e.gripSpace, s);
      if (!n) return;
      let r = 0;
      e.profiles.includes("htc-vive") ? r = 1 : e.profiles.includes("oculus-touch") && (r = 2), this.toStreamerMessagesProvider.toStreamerHandlers.get("XRSystem")([r]);
      let o = 2;
      switch (e.handedness) {
        case "left":
          o = 0;
          break;
        case "right":
          o = 1;
      }
      const a = n.transform.matrix, d = [];
      for (let p = 0; p < 16; p++) d[p] = new Float32Array([a[p]])[0];
      this.toStreamerMessagesProvider.toStreamerHandlers.get("XRControllerTransform")([d[0], d[4], d[8], d[12], d[1], d[5], d[9], d[13], d[2], d[6], d[10], d[14], d[3], d[7], d[11], d[15], o]), this.controllers[o] === void 0 && (this.controllers[o] = { prevState: void 0, currentState: void 0, id: void 0 }, this.controllers[o].prevState = zt.deepCopyGamepad(e.gamepad)), this.controllers[o].currentState = zt.deepCopyGamepad(e.gamepad);
      const h = this.controllers[o], u = h.currentState, S = h.prevState;
      for (let p = 0; p < u.buttons.length; p++) {
        const E = u.buttons[p], T = S.buttons[p];
        E.pressed ? this.toStreamerMessagesProvider.toStreamerHandlers.get("XRButtonPressed")([o, p, T.pressed ? 1 : 0]) : !E.pressed && T.pressed && this.toStreamerMessagesProvider.toStreamerHandlers.get("XRButtonReleased")([o, p, 0]), E.touched && !E.pressed ? this.toStreamerMessagesProvider.toStreamerHandlers.get("XRButtonPressed")([o, 3, T.touched ? 1 : 0]) : !E.touched && T.touched && this.toStreamerMessagesProvider.toStreamerHandlers.get("XRButtonReleased")([o, 3, 0]);
      }
      for (let p = 0; p < u.axes.length; p++) this.toStreamerMessagesProvider.toStreamerHandlers.get("XRAnalog")([o, p, u.axes[p]]);
      this.controllers[o].prevState = u;
    }
  }
}
class Hn {
  constructor(e) {
    this.xrSession = null, this.webRtcController = e, this.xrControllers = [], this.xrGamepadController = new Hi(this.webRtcController.streamMessageController), this.onSessionEnded = new EventTarget(), this.onSessionStarted = new EventTarget(), this.onFrame = new EventTarget();
  }
  xrClicked() {
    this.xrSession ? this.xrSession.end() : navigator.xr.requestSession("immersive-vr").then((e) => {
      this.onXrSessionStarted(e);
    });
  }
  onXrSessionEnded() {
    c.Log(c.GetStackTrace(), "XR Session ended"), this.xrSession = null, this.onSessionEnded.dispatchEvent(new Event("xrSessionEnded"));
  }
  onXrSessionStarted(e) {
    c.Log(c.GetStackTrace(), "XR Session started"), this.xrSession = e, this.xrSession.addEventListener("end", () => {
      this.onXrSessionEnded();
    });
    const t = document.createElement("canvas");
    this.gl = t.getContext("webgl2", { xrCompatible: !0 }), this.xrSession.updateRenderState({ baseLayer: new XRWebGLLayer(this.xrSession, this.gl) });
    const s = this.gl.createShader(this.gl.VERTEX_SHADER);
    this.gl.shaderSource(s, Ut.vertexShader()), this.gl.compileShader(s);
    const n = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    this.gl.shaderSource(n, Ut.fragmentShader()), this.gl.compileShader(n);
    const r = this.gl.createProgram();
    this.gl.attachShader(r, s), this.gl.attachShader(r, n), this.gl.linkProgram(r), this.gl.useProgram(r), this.positionLocation = this.gl.getAttribLocation(r, "a_position"), this.texcoordLocation = this.gl.getAttribLocation(r, "a_texCoord"), this.positionBuffer = this.gl.createBuffer(), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer), this.gl.enableVertexAttribArray(this.positionLocation);
    const o = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, o), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST), this.texcoordBuffer = this.gl.createBuffer(), this.resolutionLocation = this.gl.getUniformLocation(r, "u_resolution"), this.offsetLocation = this.gl.getUniformLocation(r, "u_offset"), e.requestReferenceSpace("local").then((a) => {
      this.xrRefSpace = a, this.xrSession.requestAnimationFrame((d, h) => this.onXrFrame(d, h));
    }), this.onSessionStarted.dispatchEvent(new Event("xrSessionStarted"));
  }
  onXrFrame(e, t) {
    const s = t.getViewerPose(this.xrRefSpace);
    if (s) {
      const n = s.transform.matrix, r = [];
      for (let a = 0; a < 16; a++) r[a] = new Float32Array([n[a]])[0];
      this.webRtcController.streamMessageController.toStreamerHandlers.get("XRHMDTransform")([r[0], r[4], r[8], r[12], r[1], r[5], r[9], r[13], r[2], r[6], r[10], r[14], r[3], r[7], r[11], r[15]]);
      const o = this.xrSession.renderState.baseLayer;
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, o.framebuffer), this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.webRtcController.videoPlayer.getVideoElement()), this.render(this.webRtcController.videoPlayer.getVideoElement());
    }
    this.webRtcController.config.isFlagEnabled(m.XRControllerInput) && this.xrSession.inputSources.forEach((n, r, o) => {
      this.xrGamepadController.updateStatus(n, t, this.xrRefSpace);
    }, this), this.xrSession.requestAnimationFrame((n, r) => this.onXrFrame(n, r)), this.onFrame.dispatchEvent(new Rn({ time: e, frame: t }));
  }
  render(e) {
    if (!this.gl) return;
    const t = this.xrSession.renderState.baseLayer;
    let s, n, r, o, a;
    this.gl.viewport(0, 0, t.framebufferWidth, t.framebufferHeight), this.gl.uniform4f(this.offsetLocation, 1, 1, 0, 0), this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([0, 0, e.videoWidth, 0, 0, e.videoHeight, 0, e.videoHeight, e.videoWidth, 0, e.videoWidth, e.videoHeight]), this.gl.STATIC_DRAW), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texcoordBuffer), this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), this.gl.STATIC_DRAW), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer), s = 2, n = this.gl.FLOAT, r = !1, o = 0, a = 0, this.gl.vertexAttribPointer(this.positionLocation, s, n, r, o, a), this.gl.enableVertexAttribArray(this.texcoordLocation), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texcoordBuffer), s = 2, n = this.gl.FLOAT, r = !1, o = 0, a = 0, this.gl.vertexAttribPointer(this.texcoordLocation, s, n, r, o, a), this.gl.uniform2f(this.resolutionLocation, e.videoWidth, e.videoHeight);
    const d = this.gl.TRIANGLES;
    a = 0, this.gl.drawArrays(d, a, 6);
  }
  static isSessionSupported(e) {
    return navigator.xr ? navigator.xr.isSessionSupported(e) : new Promise(() => !1);
  }
}
class Wi {
  constructor(e) {
    this.editTextButton = null, this.hiddenInput = null, "ontouchstart" in document.documentElement && this.createOnScreenKeyboardHelpers(e);
  }
  unquantizeAndDenormalizeUnsigned(e, t) {
    return null;
  }
  createOnScreenKeyboardHelpers(e) {
    this.hiddenInput || (this.hiddenInput = document.createElement("input"), this.hiddenInput.id = "hiddenInput", this.hiddenInput.maxLength = 0, e.appendChild(this.hiddenInput)), this.editTextButton || (this.editTextButton = document.createElement("button"), this.editTextButton.id = "editTextButton", this.editTextButton.innerHTML = "edit text", e.appendChild(this.editTextButton), this.editTextButton.classList.add("hiddenState"), this.editTextButton.addEventListener("touchend", (t) => {
      this.hiddenInput.focus(), t.preventDefault();
    }));
  }
  showOnScreenKeyboard(e) {
    if (e.showOnScreenKeyboard) {
      this.editTextButton.classList.remove("hiddenState");
      const t = this.unquantizeAndDenormalizeUnsigned(e.x, e.y);
      this.editTextButton.style.top = t.y.toString() + "px", this.editTextButton.style.left = (t.x - 40).toString() + "px";
    } else this.editTextButton.classList.add("hiddenState"), this.hiddenInput.blur();
  }
}
class Vi {
  constructor(e) {
    this.seq = e.Seq, this.playerSentTimestamp = Date.now(), this.requestFillerSize = e.Filler ? e.Filler.length : 0;
  }
  update(e) {
    this.playerReceivedTimestamp = Date.now(), this.streamerReceivedTimestamp = e.ReceivedTimestamp, this.streamerSentTimestamp = e.SentTimestamp, this.responseFillerSize = e.Filler ? e.Filler.length : 0;
  }
}
class $i {
  constructor(e, t) {
    this.sink = e, this.callback = t, this.records = /* @__PURE__ */ new Map(), this.seq = 0;
  }
  start(e) {
    return !this.isRunning() && (this.startTime = Date.now(), this.records.clear(), this.interval = setInterval((() => {
      Date.now() - this.startTime >= e.duration ? this.stop() : this.sendRequest(e.requestSize, e.responseSize);
    }).bind(this), Math.floor(1e3 / e.rps)), !0);
  }
  stop() {
    this.interval && (clearInterval(this.interval), this.interval = void 0, this.callback(this.produceResult()));
  }
  produceResult() {
    const e = new Map(this.records);
    return { records: e, dataChannelRtt: Math.ceil(Array.from(this.records.values()).reduce((t, s) => t + (s.playerReceivedTimestamp - s.playerSentTimestamp), 0) / this.records.size), playerToStreamerTime: Math.ceil(Array.from(this.records.values()).reduce((t, s) => t + (s.streamerReceivedTimestamp - s.playerSentTimestamp), 0) / this.records.size), streamerToPlayerTime: Math.ceil(Array.from(this.records.values()).reduce((t, s) => t + (s.playerReceivedTimestamp - s.streamerSentTimestamp), 0) / this.records.size), exportLatencyAsCSV: () => {
      let t = `Timestamp;RTT;PlayerToStreamer;StreamerToPlayer;
`;
      return e.forEach((s) => {
        t += s.playerSentTimestamp + ";", t += s.playerReceivedTimestamp - s.playerSentTimestamp + ";", t += s.streamerReceivedTimestamp - s.playerSentTimestamp + ";", t += s.playerReceivedTimestamp - s.streamerSentTimestamp + ";", t += `
`;
      }), t;
    } };
  }
  isRunning() {
    return !!this.interval;
  }
  receive(e) {
    if (!this.isRunning()) return;
    if (!e) return void c.Error(c.GetStackTrace(), "Undefined response from server");
    let t = this.records.get(e.Seq);
    t && t.update(e);
  }
  sendRequest(e, t) {
    let s = this.createRequest(e, t), n = new Vi(s);
    this.records.set(n.seq, n), this.sink(s);
  }
  createRequest(e, t) {
    return { Seq: this.seq++, FillResponseSize: t, Filler: e ? "A".repeat(e) : "" };
  }
}
class Qi {
  constructor(e, t) {
    this.allowConsoleCommands = !1, this.config = e, t != null && t.videoElementParent && (this._videoElementParent = t.videoElementParent), this._eventEmitter = new kn(), this.configureSettings(), this.setWebRtcPlayerController(new Nn(this.config, this)), this.onScreenKeyboardHelper = new Wi(this.videoElementParent), this.onScreenKeyboardHelper.unquantizeAndDenormalizeUnsigned = (s, n) => this._webRtcController.requestUnquantizedAndDenormalizeUnsigned(s, n), this._activateOnScreenKeyboard = (s) => this.onScreenKeyboardHelper.showOnScreenKeyboard(s), this._webXrController = new Hn(this._webRtcController);
  }
  get videoElementParent() {
    return this._videoElementParent || (this._videoElementParent = document.createElement("div"), this._videoElementParent.id = "videoElementParent"), this._videoElementParent;
  }
  configureSettings() {
    this.config._addOnSettingChangedListener(m.IsQualityController, (e) => {
      e !== !0 || this._webRtcController.isQualityController || this._webRtcController.sendRequestQualityControlOwnership();
    }), this.config._addOnSettingChangedListener(m.AFKDetection, (e) => {
      this._webRtcController.setAfkEnabled(e);
    }), this.config._addOnSettingChangedListener(m.MatchViewportResolution, () => {
      this._webRtcController.videoPlayer.updateVideoStreamSize();
    }), this.config._addOnSettingChangedListener(m.HoveringMouseMode, (e) => {
      this.config.setFlagLabel(m.HoveringMouseMode, `Control Scheme: ${e ? "Hovering" : "Locked"} Mouse`), this._webRtcController.setMouseInputEnabled(this.config.isFlagEnabled(m.MouseInput));
    }), this.config._addOnSettingChangedListener(m.KeyboardInput, (e) => {
      this._webRtcController.setKeyboardInputEnabled(e);
    }), this.config._addOnSettingChangedListener(m.MouseInput, (e) => {
      this._webRtcController.setMouseInputEnabled(e);
    }), this.config._addOnSettingChangedListener(m.TouchInput, (e) => {
      this._webRtcController.setTouchInputEnabled(e);
    }), this.config._addOnSettingChangedListener(m.GamepadInput, (e) => {
      this._webRtcController.setGamePadInputEnabled(e);
    }), this.config._addOnNumericSettingChangedListener(w.MinQP, (e) => {
      c.Log(c.GetStackTrace(), "--------  Sending MinQP  --------", 7), this._webRtcController.sendEncoderMinQP(e), c.Log(c.GetStackTrace(), "-------------------------------------------", 7);
    }), this.config._addOnNumericSettingChangedListener(w.MaxQP, (e) => {
      c.Log(c.GetStackTrace(), "--------  Sending encoder settings  --------", 7), this._webRtcController.sendEncoderMaxQP(e), c.Log(c.GetStackTrace(), "-------------------------------------------", 7);
    }), this.config._addOnNumericSettingChangedListener(w.WebRTCMinBitrate, (e) => {
      c.Log(c.GetStackTrace(), "--------  Sending web rtc settings  --------", 7), this._webRtcController.sendWebRTCMinBitrate(1e3 * e), c.Log(c.GetStackTrace(), "-------------------------------------------", 7);
    }), this.config._addOnNumericSettingChangedListener(w.WebRTCMaxBitrate, (e) => {
      c.Log(c.GetStackTrace(), "--------  Sending web rtc settings  --------", 7), this._webRtcController.sendWebRTCMaxBitrate(1e3 * e), c.Log(c.GetStackTrace(), "-------------------------------------------", 7);
    }), this.config._addOnNumericSettingChangedListener(w.WebRTCFPS, (e) => {
      c.Log(c.GetStackTrace(), "--------  Sending web rtc settings  --------", 7), this._webRtcController.sendWebRTCFps(e), c.Log(c.GetStackTrace(), "-------------------------------------------", 7);
    }), this.config._addOnOptionSettingChangedListener(A.PreferredCodec, (e) => {
      this._webRtcController && this._webRtcController.setPreferredCodec(e);
    }), this.config._registerOnChangeEvents(this._eventEmitter);
  }
  _activateOnScreenKeyboard(e) {
    throw new Error("Method not implemented.");
  }
  _onInputControlOwnership(e) {
    this._inputController = e;
  }
  setWebRtcPlayerController(e) {
    this._webRtcController = e, this._webRtcController.setPreferredCodec(this.config.getSettingOption(A.PreferredCodec).selected), this._webRtcController.resizePlayerStyle(), this.checkForAutoConnect();
  }
  connect() {
    this._eventEmitter.dispatchEvent(new gn()), this._webRtcController.connectToSignallingServer();
  }
  reconnect() {
    this._eventEmitter.dispatchEvent(new pn()), this._webRtcController.tryReconnect("Reconnecting...");
  }
  disconnect() {
    this._eventEmitter.dispatchEvent(new mn()), this._webRtcController.close();
  }
  play() {
    this._onStreamLoading(), this._webRtcController.playStream();
  }
  checkForAutoConnect() {
    this.config.isFlagEnabled(m.AutoConnect) && (this._onWebRtcAutoConnect(), this._webRtcController.connectToSignallingServer());
  }
  unmuteMicrophone(e = !1) {
    if (!this.config.isFlagEnabled("UseMic")) return e ? (this.config.setFlagEnabled("UseMic", !0), void this.reconnect()) : void c.Warning(c.GetStackTrace(), "Trying to unmute mic, but PixelStreaming was initialized with no microphone track. Call with forceEnable == true to re-connect with a mic track.");
    this.setMicrophoneMuted(!1);
  }
  muteMicrophone() {
    this.config.isFlagEnabled("UseMic") ? this.setMicrophoneMuted(!0) : c.Info(c.GetStackTrace(), "Trying to mute mic, but PixelStreaming has no microphone track, so sending sound is already disabled.");
  }
  setMicrophoneMuted(e) {
    var t, s, n, r;
    for (const o of (r = (n = (s = (t = this._webRtcController) === null || t === void 0 ? void 0 : t.peerConnectionController) === null || s === void 0 ? void 0 : s.peerConnection) === null || n === void 0 ? void 0 : n.getTransceivers()) !== null && r !== void 0 ? r : []) _n.canTransceiverSendAudio(o) && (o.sender.track.enabled = !e);
  }
  _onWebRtcAutoConnect() {
    this._eventEmitter.dispatchEvent(new sn());
  }
  _onWebRtcSdp() {
    this._eventEmitter.dispatchEvent(new tn());
  }
  _onStreamLoading() {
    this._eventEmitter.dispatchEvent(new un());
  }
  _onDisconnect(e, t) {
    this._eventEmitter.dispatchEvent(new an({ eventString: e, allowClickToReconnect: t }));
  }
  _onWebRtcConnecting() {
    this._eventEmitter.dispatchEvent(new nn());
  }
  _onWebRtcConnected() {
    this._eventEmitter.dispatchEvent(new rn());
  }
  _onWebRtcFailed() {
    this._eventEmitter.dispatchEvent(new on());
  }
  _onVideoInitialized() {
    this._eventEmitter.dispatchEvent(new hn()), this._videoStartTime = Date.now();
  }
  _onLatencyTestResult(e) {
    this._eventEmitter.dispatchEvent(new Tn({ latencyTimings: e }));
  }
  _onDataChannelLatencyTestResponse(e) {
    this._eventEmitter.dispatchEvent(new bn({ response: e }));
  }
  _onVideoStats(e) {
    this._videoStartTime && this._videoStartTime !== void 0 || (this._videoStartTime = Date.now()), e.handleSessionStatistics(this._videoStartTime, this._inputController, this._webRtcController.videoAvgQp), this._eventEmitter.dispatchEvent(new yn({ aggregatedStats: e }));
  }
  _onVideoEncoderAvgQP(e) {
    this._eventEmitter.dispatchEvent(new en({ avgQP: e }));
  }
  _onInitialSettings(e) {
    var t;
    this._eventEmitter.dispatchEvent(new Mn({ settings: e })), e.PixelStreamingSettings && (this.allowConsoleCommands = (t = e.PixelStreamingSettings.AllowPixelStreamingCommands) !== null && t !== void 0 && t, this.allowConsoleCommands === !1 && c.Info(c.GetStackTrace(), "-AllowPixelStreamingCommands=false, sending arbitrary console commands from browser to UE is disabled."));
    const s = this.config.useUrlParams, n = new URLSearchParams(window.location.search);
    e.EncoderSettings && (this.config.setNumericSetting(w.MinQP, s && n.has(w.MinQP) ? Number.parseInt(n.get(w.MinQP)) : e.EncoderSettings.MinQP), this.config.setNumericSetting(w.MaxQP, s && n.has(w.MaxQP) ? Number.parseInt(n.get(w.MaxQP)) : e.EncoderSettings.MaxQP)), e.WebRTCSettings && (this.config.setNumericSetting(w.WebRTCMinBitrate, s && n.has(w.WebRTCMinBitrate) ? Number.parseInt(n.get(w.WebRTCMinBitrate)) : e.WebRTCSettings.MinBitrate / 1e3), this.config.setNumericSetting(w.WebRTCMaxBitrate, s && n.has(w.WebRTCMaxBitrate) ? Number.parseInt(n.get(w.WebRTCMaxBitrate)) : e.WebRTCSettings.MaxBitrate / 1e3), this.config.setNumericSetting(w.WebRTCFPS, s && n.has(w.WebRTCFPS) ? Number.parseInt(n.get(w.WebRTCFPS)) : e.WebRTCSettings.FPS));
  }
  _onQualityControlOwnership(e) {
    this.config.setFlagEnabled(m.IsQualityController, e);
  }
  _onPlayerCount(e) {
    this._eventEmitter.dispatchEvent(new Pn({ count: e }));
  }
  requestLatencyTest() {
    return !!this._webRtcController.videoPlayer.isVideoReady() && (this._webRtcController.sendLatencyTest(), !0);
  }
  requestDataChannelLatencyTest(e) {
    return !!this._webRtcController.videoPlayer.isVideoReady() && (this._dataChannelLatencyTestController || (this._dataChannelLatencyTestController = new $i(this._webRtcController.sendDataChannelLatencyTest.bind(this._webRtcController), (t) => {
      this._eventEmitter.dispatchEvent(new wn({ result: t }));
    }), this.addEventListener("dataChannelLatencyTestResponse", ({ data: { response: t } }) => {
      this._dataChannelLatencyTestController.receive(t);
    })), this._dataChannelLatencyTestController.start(e));
  }
  requestShowFps() {
    return !!this._webRtcController.videoPlayer.isVideoReady() && (this._webRtcController.sendShowFps(), !0);
  }
  requestIframe() {
    return !!this._webRtcController.videoPlayer.isVideoReady() && (this._webRtcController.sendIframeRequest(), !0);
  }
  emitUIInteraction(e) {
    return !!this._webRtcController.videoPlayer.isVideoReady() && (this._webRtcController.emitUIInteraction(e), !0);
  }
  emitCommand(e) {
    return !(!this._webRtcController.videoPlayer.isVideoReady() || !this.allowConsoleCommands && "ConsoleCommand" in e || (this._webRtcController.emitCommand(e), 0));
  }
  emitConsoleCommand(e) {
    return !(!this.allowConsoleCommands || !this._webRtcController.videoPlayer.isVideoReady() || (this._webRtcController.emitConsoleCommand(e), 0));
  }
  addResponseEventListener(e, t) {
    this._webRtcController.responseController.addResponseEventListener(e, t);
  }
  removeResponseEventListener(e) {
    this._webRtcController.responseController.removeResponseEventListener(e);
  }
  dispatchEvent(e) {
    return this._eventEmitter.dispatchEvent(e);
  }
  addEventListener(e, t) {
    this._eventEmitter.addEventListener(e, t);
  }
  removeEventListener(e, t) {
    this._eventEmitter.removeEventListener(e, t);
  }
  toggleXR() {
    this.webXrController.xrClicked();
  }
  setSignallingUrlBuilder(e) {
    this._webRtcController.signallingUrlBuilder = e;
  }
  get webSocketController() {
    return this._webRtcController.webSocketController;
  }
  get webXrController() {
    return this._webXrController;
  }
  registerMessageHandler(e, t, s) {
    t !== y.FromStreamer || s !== void 0 ? t === y.ToStreamer && s === void 0 ? this._webRtcController.streamMessageController.registerMessageHandler(t, e, (n) => this._webRtcController.sendMessageController.sendMessageToStreamer(e, n)) : this._webRtcController.streamMessageController.registerMessageHandler(t, e, (n) => s(n)) : c.Warning(c.GetStackTrace(), `Unable to register an undefined handler for ${e}`);
  }
  get toStreamerHandlers() {
    return this._webRtcController.streamMessageController.toStreamerHandlers;
  }
  isReconnecting() {
    return this._webRtcController.isReconnecting;
  }
}
f.Dz;
f.g$;
f.Lt;
f.Q9;
f.qf;
f.hV;
f.z$;
f.J0;
f.De;
f.$C;
f.al;
f._W;
f.Gv;
f.m;
f.tz;
f.Nu;
f.zg;
f.vp;
var Ki = f.vU;
f.wF;
f.rv;
f.Nh;
f.ss;
f.qW;
f.QL;
f.cf;
f.eM;
var qi = f.Yd;
f.Tk;
f.iM;
f.qy;
f.ce;
var ji = f.sK, Xi = f.Ok;
f.q5;
f.g;
f.xl;
f.I;
f.bx;
f.dD;
f.Ib;
var Ji = f.Az;
f.Iw;
f.qY;
f.db;
f.mR;
f.Tn;
f.rV;
f.gh;
f.Mi;
f.j;
f.YB;
f.i5;
var Yi = f.x_;
f.Am;
f.eR;
f.r8;
f.u3;
f.vd;
f.iV;
f.jZ;
f.SW;
f.ZH;
f.Ni;
f.lh;
f.bq;
var Zi = f.$f;
f.eu;
f.Ax;
f.Mc;
function B() {
  return B = Object.assign ? Object.assign.bind() : function(i) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var s in t)
        Object.prototype.hasOwnProperty.call(t, s) && (i[s] = t[s]);
    }
    return i;
  }, B.apply(this, arguments);
}
var Bt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(i) {
  return typeof i;
} : function(i) {
  return i && typeof Symbol == "function" && i.constructor === Symbol && i !== Symbol.prototype ? "symbol" : typeof i;
}, eo = (typeof window > "u" ? "undefined" : Bt(window)) === "object" && (typeof document > "u" ? "undefined" : Bt(document)) === "object" && document.nodeType === 9, to = process.env.NODE_ENV === "production";
function q(i, e) {
  if (!to) {
    var t = "Warning: " + e;
    typeof console < "u" && console.warn(t);
    try {
      throw Error(t);
    } catch {
    }
  }
}
function Ce(i) {
  "@babel/helpers - typeof";
  return Ce = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Ce(i);
}
function so(i, e) {
  if (Ce(i) != "object" || !i) return i;
  var t = i[Symbol.toPrimitive];
  if (t !== void 0) {
    var s = t.call(i, e);
    if (Ce(s) != "object") return s;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(i);
}
function no(i) {
  var e = so(i, "string");
  return Ce(e) == "symbol" ? e : e + "";
}
function ro(i, e) {
  for (var t = 0; t < e.length; t++) {
    var s = e[t];
    s.enumerable = s.enumerable || !1, s.configurable = !0, "value" in s && (s.writable = !0), Object.defineProperty(i, no(s.key), s);
  }
}
function Wn(i, e, t) {
  return e && ro(i.prototype, e), Object.defineProperty(i, "prototype", {
    writable: !1
  }), i;
}
function mt(i, e) {
  return mt = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(s, n) {
    return s.__proto__ = n, s;
  }, mt(i, e);
}
function Vn(i, e) {
  i.prototype = Object.create(e.prototype), i.prototype.constructor = i, mt(i, e);
}
function Gt(i) {
  if (i === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return i;
}
function io(i, e) {
  if (i == null) return {};
  var t = {};
  for (var s in i)
    if (Object.prototype.hasOwnProperty.call(i, s)) {
      if (e.indexOf(s) >= 0) continue;
      t[s] = i[s];
    }
  return t;
}
var oo = {}.constructor;
function pt(i) {
  if (i == null || typeof i != "object") return i;
  if (Array.isArray(i)) return i.map(pt);
  if (i.constructor !== oo) return i;
  var e = {};
  for (var t in i)
    e[t] = pt(i[t]);
  return e;
}
function $n(i, e, t) {
  i === void 0 && (i = "unnamed");
  var s = t.jss, n = pt(e), r = s.plugins.onCreateRule(i, n, t);
  return r || (i[0] === "@" && process.env.NODE_ENV !== "production" && q(!1, "[JSS] Unknown rule " + i), null);
}
var Nt = function(e, t) {
  for (var s = "", n = 0; n < e.length && e[n] !== "!important"; n++)
    s && (s += t), s += e[n];
  return s;
}, fe = function(e) {
  if (!Array.isArray(e)) return e;
  var t = "";
  if (Array.isArray(e[0]))
    for (var s = 0; s < e.length && e[s] !== "!important"; s++)
      t && (t += ", "), t += Nt(e[s], " ");
  else t = Nt(e, ", ");
  return e[e.length - 1] === "!important" && (t += " !important"), t;
};
function ue(i) {
  return i && i.format === !1 ? {
    linebreak: "",
    space: ""
  } : {
    linebreak: `
`,
    space: " "
  };
}
function ge(i, e) {
  for (var t = "", s = 0; s < e; s++)
    t += "  ";
  return t + i;
}
function ye(i, e, t) {
  t === void 0 && (t = {});
  var s = "";
  if (!e) return s;
  var n = t, r = n.indent, o = r === void 0 ? 0 : r, a = e.fallbacks;
  t.format === !1 && (o = -1 / 0);
  var d = ue(t), h = d.linebreak, u = d.space;
  if (i && o++, a)
    if (Array.isArray(a))
      for (var S = 0; S < a.length; S++) {
        var p = a[S];
        for (var E in p) {
          var T = p[E];
          T != null && (s && (s += h), s += ge(E + ":" + u + fe(T) + ";", o));
        }
      }
    else
      for (var R in a) {
        var P = a[R];
        P != null && (s && (s += h), s += ge(R + ":" + u + fe(P) + ";", o));
      }
  for (var V in e) {
    var x = e[V];
    x != null && V !== "fallbacks" && (s && (s += h), s += ge(V + ":" + u + fe(x) + ";", o));
  }
  return !s && !t.allowEmpty || !i ? s : (o--, s && (s = "" + h + s + h), ge("" + i + u + "{" + s, o) + ge("}", o));
}
var ao = /([[\].#*$><+~=|^:(),"'`\s])/g, Ht = typeof CSS < "u" && CSS.escape, bt = function(i) {
  return Ht ? Ht(i) : i.replace(ao, "\\$1");
}, Qn = /* @__PURE__ */ function() {
  function i(t, s, n) {
    this.type = "style", this.isProcessed = !1;
    var r = n.sheet, o = n.Renderer;
    this.key = t, this.options = n, this.style = s, r ? this.renderer = r.renderer : o && (this.renderer = new o());
  }
  var e = i.prototype;
  return e.prop = function(s, n, r) {
    if (n === void 0) return this.style[s];
    var o = r ? r.force : !1;
    if (!o && this.style[s] === n) return this;
    var a = n;
    (!r || r.process !== !1) && (a = this.options.jss.plugins.onChangeValue(n, s, this));
    var d = a == null || a === !1, h = s in this.style;
    if (d && !h && !o) return this;
    var u = d && h;
    if (u ? delete this.style[s] : this.style[s] = a, this.renderable && this.renderer)
      return u ? this.renderer.removeProperty(this.renderable, s) : this.renderer.setProperty(this.renderable, s, a), this;
    var S = this.options.sheet;
    return S && S.attached && process.env.NODE_ENV !== "production" && q(!1, '[JSS] Rule is not linked. Missing sheet option "link: true".'), this;
  }, i;
}(), vt = /* @__PURE__ */ function(i) {
  Vn(e, i);
  function e(s, n, r) {
    var o;
    o = i.call(this, s, n, r) || this;
    var a = r.selector, d = r.scoped, h = r.sheet, u = r.generateId;
    return a ? o.selectorText = a : d !== !1 && (o.id = u(Gt(Gt(o)), h), o.selectorText = "." + bt(o.id)), o;
  }
  var t = e.prototype;
  return t.applyTo = function(n) {
    var r = this.renderer;
    if (r) {
      var o = this.toJSON();
      for (var a in o)
        r.setProperty(n, a, o[a]);
    }
    return this;
  }, t.toJSON = function() {
    var n = {};
    for (var r in this.style) {
      var o = this.style[r];
      typeof o != "object" ? n[r] = o : Array.isArray(o) && (n[r] = fe(o));
    }
    return n;
  }, t.toString = function(n) {
    var r = this.options.sheet, o = r ? r.options.link : !1, a = o ? B({}, n, {
      allowEmpty: !0
    }) : n;
    return ye(this.selectorText, this.style, a);
  }, Wn(e, [{
    key: "selector",
    set: function(n) {
      if (n !== this.selectorText) {
        this.selectorText = n;
        var r = this.renderer, o = this.renderable;
        if (!(!o || !r)) {
          var a = r.setSelector(o, n);
          a || r.replaceRule(o, this);
        }
      }
    },
    get: function() {
      return this.selectorText;
    }
  }]), e;
}(Qn), lo = {
  onCreateRule: function(e, t, s) {
    return e[0] === "@" || s.parent && s.parent.type === "keyframes" ? null : new vt(e, t, s);
  }
}, Xe = {
  indent: 1,
  children: !0
}, co = /@([\w-]+)/, ho = /* @__PURE__ */ function() {
  function i(t, s, n) {
    this.type = "conditional", this.isProcessed = !1, this.key = t;
    var r = t.match(co);
    this.at = r ? r[1] : "unknown", this.query = n.name || "@" + this.at, this.options = n, this.rules = new He(B({}, n, {
      parent: this
    }));
    for (var o in s)
      this.rules.add(o, s[o]);
    this.rules.process();
  }
  var e = i.prototype;
  return e.getRule = function(s) {
    return this.rules.get(s);
  }, e.indexOf = function(s) {
    return this.rules.indexOf(s);
  }, e.addRule = function(s, n, r) {
    var o = this.rules.add(s, n, r);
    return o ? (this.options.jss.plugins.onProcessRule(o), o) : null;
  }, e.replaceRule = function(s, n, r) {
    var o = this.rules.replace(s, n, r);
    return o && this.options.jss.plugins.onProcessRule(o), o;
  }, e.toString = function(s) {
    s === void 0 && (s = Xe);
    var n = ue(s), r = n.linebreak;
    if (s.indent == null && (s.indent = Xe.indent), s.children == null && (s.children = Xe.children), s.children === !1)
      return this.query + " {}";
    var o = this.rules.toString(s);
    return o ? this.query + " {" + r + o + r + "}" : "";
  }, i;
}(), uo = /@container|@media|@supports\s+/, go = {
  onCreateRule: function(e, t, s) {
    return uo.test(e) ? new ho(e, t, s) : null;
  }
}, Je = {
  indent: 1,
  children: !0
}, mo = /@keyframes\s+([\w-]+)/, ft = /* @__PURE__ */ function() {
  function i(t, s, n) {
    this.type = "keyframes", this.at = "@keyframes", this.isProcessed = !1;
    var r = t.match(mo);
    r && r[1] ? this.name = r[1] : (this.name = "noname", process.env.NODE_ENV !== "production" && q(!1, "[JSS] Bad keyframes name " + t)), this.key = this.type + "-" + this.name, this.options = n;
    var o = n.scoped, a = n.sheet, d = n.generateId;
    this.id = o === !1 ? this.name : bt(d(this, a)), this.rules = new He(B({}, n, {
      parent: this
    }));
    for (var h in s)
      this.rules.add(h, s[h], B({}, n, {
        parent: this
      }));
    this.rules.process();
  }
  var e = i.prototype;
  return e.toString = function(s) {
    s === void 0 && (s = Je);
    var n = ue(s), r = n.linebreak;
    if (s.indent == null && (s.indent = Je.indent), s.children == null && (s.children = Je.children), s.children === !1)
      return this.at + " " + this.id + " {}";
    var o = this.rules.toString(s);
    return o && (o = "" + r + o + r), this.at + " " + this.id + " {" + o + "}";
  }, i;
}(), po = /@keyframes\s+/, vo = /\$([\w-]+)/g, St = function(e, t) {
  return typeof e == "string" ? e.replace(vo, function(s, n) {
    return n in t ? t[n] : (process.env.NODE_ENV !== "production" && q(!1, '[JSS] Referenced keyframes rule "' + n + '" is not defined.'), s);
  }) : e;
}, Wt = function(e, t, s) {
  var n = e[t], r = St(n, s);
  r !== n && (e[t] = r);
}, fo = {
  onCreateRule: function(e, t, s) {
    return typeof e == "string" && po.test(e) ? new ft(e, t, s) : null;
  },
  // Animation name ref replacer.
  onProcessStyle: function(e, t, s) {
    return t.type !== "style" || !s || ("animation-name" in e && Wt(e, "animation-name", s.keyframes), "animation" in e && Wt(e, "animation", s.keyframes)), e;
  },
  onChangeValue: function(e, t, s) {
    var n = s.options.sheet;
    if (!n)
      return e;
    switch (t) {
      case "animation":
        return St(e, n.keyframes);
      case "animation-name":
        return St(e, n.keyframes);
      default:
        return e;
    }
  }
}, So = /* @__PURE__ */ function(i) {
  Vn(e, i);
  function e() {
    return i.apply(this, arguments) || this;
  }
  var t = e.prototype;
  return t.toString = function(n) {
    var r = this.options.sheet, o = r ? r.options.link : !1, a = o ? B({}, n, {
      allowEmpty: !0
    }) : n;
    return ye(this.key, this.style, a);
  }, e;
}(Qn), Co = {
  onCreateRule: function(e, t, s) {
    return s.parent && s.parent.type === "keyframes" ? new So(e, t, s) : null;
  }
}, yo = /* @__PURE__ */ function() {
  function i(t, s, n) {
    this.type = "font-face", this.at = "@font-face", this.isProcessed = !1, this.key = t, this.style = s, this.options = n;
  }
  var e = i.prototype;
  return e.toString = function(s) {
    var n = ue(s), r = n.linebreak;
    if (Array.isArray(this.style)) {
      for (var o = "", a = 0; a < this.style.length; a++)
        o += ye(this.at, this.style[a]), this.style[a + 1] && (o += r);
      return o;
    }
    return ye(this.at, this.style, s);
  }, i;
}(), Eo = /@font-face/, To = {
  onCreateRule: function(e, t, s) {
    return Eo.test(e) ? new yo(e, t, s) : null;
  }
}, bo = /* @__PURE__ */ function() {
  function i(t, s, n) {
    this.type = "viewport", this.at = "@viewport", this.isProcessed = !1, this.key = t, this.style = s, this.options = n;
  }
  var e = i.prototype;
  return e.toString = function(s) {
    return ye(this.key, this.style, s);
  }, i;
}(), wo = {
  onCreateRule: function(e, t, s) {
    return e === "@viewport" || e === "@-ms-viewport" ? new bo(e, t, s) : null;
  }
}, Mo = /* @__PURE__ */ function() {
  function i(t, s, n) {
    this.type = "simple", this.isProcessed = !1, this.key = t, this.value = s, this.options = n;
  }
  var e = i.prototype;
  return e.toString = function(s) {
    if (Array.isArray(this.value)) {
      for (var n = "", r = 0; r < this.value.length; r++)
        n += this.key + " " + this.value[r] + ";", this.value[r + 1] && (n += `
`);
      return n;
    }
    return this.key + " " + this.value + ";";
  }, i;
}(), Ro = {
  "@charset": !0,
  "@import": !0,
  "@namespace": !0
}, Po = {
  onCreateRule: function(e, t, s) {
    return e in Ro ? new Mo(e, t, s) : null;
  }
}, Vt = [lo, go, fo, Co, To, wo, Po], ko = {
  process: !0
}, $t = {
  force: !0,
  process: !0
  /**
   * Contains rules objects and allows adding/removing etc.
   * Is used for e.g. by `StyleSheet` or `ConditionalRule`.
   */
}, He = /* @__PURE__ */ function() {
  function i(t) {
    this.map = {}, this.raw = {}, this.index = [], this.counter = 0, this.options = t, this.classes = t.classes, this.keyframes = t.keyframes;
  }
  var e = i.prototype;
  return e.add = function(s, n, r) {
    var o = this.options, a = o.parent, d = o.sheet, h = o.jss, u = o.Renderer, S = o.generateId, p = o.scoped, E = B({
      classes: this.classes,
      parent: a,
      sheet: d,
      jss: h,
      Renderer: u,
      generateId: S,
      scoped: p,
      name: s,
      keyframes: this.keyframes,
      selector: void 0
    }, r), T = s;
    s in this.raw && (T = s + "-d" + this.counter++), this.raw[T] = n, T in this.classes && (E.selector = "." + bt(this.classes[T]));
    var R = $n(T, n, E);
    if (!R) return null;
    this.register(R);
    var P = E.index === void 0 ? this.index.length : E.index;
    return this.index.splice(P, 0, R), R;
  }, e.replace = function(s, n, r) {
    var o = this.get(s), a = this.index.indexOf(o);
    o && this.remove(o);
    var d = r;
    return a !== -1 && (d = B({}, r, {
      index: a
    })), this.add(s, n, d);
  }, e.get = function(s) {
    return this.map[s];
  }, e.remove = function(s) {
    this.unregister(s), delete this.raw[s.key], this.index.splice(this.index.indexOf(s), 1);
  }, e.indexOf = function(s) {
    return this.index.indexOf(s);
  }, e.process = function() {
    var s = this.options.jss.plugins;
    this.index.slice(0).forEach(s.onProcessRule, s);
  }, e.register = function(s) {
    this.map[s.key] = s, s instanceof vt ? (this.map[s.selector] = s, s.id && (this.classes[s.key] = s.id)) : s instanceof ft && this.keyframes && (this.keyframes[s.name] = s.id);
  }, e.unregister = function(s) {
    delete this.map[s.key], s instanceof vt ? (delete this.map[s.selector], delete this.classes[s.key]) : s instanceof ft && delete this.keyframes[s.name];
  }, e.update = function() {
    var s, n, r;
    if (typeof (arguments.length <= 0 ? void 0 : arguments[0]) == "string" ? (s = arguments.length <= 0 ? void 0 : arguments[0], n = arguments.length <= 1 ? void 0 : arguments[1], r = arguments.length <= 2 ? void 0 : arguments[2]) : (n = arguments.length <= 0 ? void 0 : arguments[0], r = arguments.length <= 1 ? void 0 : arguments[1], s = null), s)
      this.updateOne(this.get(s), n, r);
    else
      for (var o = 0; o < this.index.length; o++)
        this.updateOne(this.index[o], n, r);
  }, e.updateOne = function(s, n, r) {
    r === void 0 && (r = ko);
    var o = this.options, a = o.jss.plugins, d = o.sheet;
    if (s.rules instanceof i) {
      s.rules.update(n, r);
      return;
    }
    var h = s.style;
    if (a.onUpdate(n, s, d, r), r.process && h && h !== s.style) {
      a.onProcessStyle(s.style, s, d);
      for (var u in s.style) {
        var S = s.style[u], p = h[u];
        S !== p && s.prop(u, S, $t);
      }
      for (var E in h) {
        var T = s.style[E], R = h[E];
        T == null && T !== R && s.prop(E, null, $t);
      }
    }
  }, e.toString = function(s) {
    for (var n = "", r = this.options.sheet, o = r ? r.options.link : !1, a = ue(s), d = a.linebreak, h = 0; h < this.index.length; h++) {
      var u = this.index[h], S = u.toString(s);
      !S && !o || (n && (n += d), n += S);
    }
    return n;
  }, i;
}(), Kn = /* @__PURE__ */ function() {
  function i(t, s) {
    this.attached = !1, this.deployed = !1, this.classes = {}, this.keyframes = {}, this.options = B({}, s, {
      sheet: this,
      parent: this,
      classes: this.classes,
      keyframes: this.keyframes
    }), s.Renderer && (this.renderer = new s.Renderer(this)), this.rules = new He(this.options);
    for (var n in t)
      this.rules.add(n, t[n]);
    this.rules.process();
  }
  var e = i.prototype;
  return e.attach = function() {
    return this.attached ? this : (this.renderer && this.renderer.attach(), this.attached = !0, this.deployed || this.deploy(), this);
  }, e.detach = function() {
    return this.attached ? (this.renderer && this.renderer.detach(), this.attached = !1, this) : this;
  }, e.addRule = function(s, n, r) {
    var o = this.queue;
    this.attached && !o && (this.queue = []);
    var a = this.rules.add(s, n, r);
    return a ? (this.options.jss.plugins.onProcessRule(a), this.attached ? (this.deployed && (o ? o.push(a) : (this.insertRule(a), this.queue && (this.queue.forEach(this.insertRule, this), this.queue = void 0))), a) : (this.deployed = !1, a)) : null;
  }, e.replaceRule = function(s, n, r) {
    var o = this.rules.get(s);
    if (!o) return this.addRule(s, n, r);
    var a = this.rules.replace(s, n, r);
    return a && this.options.jss.plugins.onProcessRule(a), this.attached ? (this.deployed && this.renderer && (a ? o.renderable && this.renderer.replaceRule(o.renderable, a) : this.renderer.deleteRule(o)), a) : (this.deployed = !1, a);
  }, e.insertRule = function(s) {
    this.renderer && this.renderer.insertRule(s);
  }, e.addRules = function(s, n) {
    var r = [];
    for (var o in s) {
      var a = this.addRule(o, s[o], n);
      a && r.push(a);
    }
    return r;
  }, e.getRule = function(s) {
    return this.rules.get(s);
  }, e.deleteRule = function(s) {
    var n = typeof s == "object" ? s : this.rules.get(s);
    return !n || // Style sheet was created without link: true and attached, in this case we
    // won't be able to remove the CSS rule from the DOM.
    this.attached && !n.renderable ? !1 : (this.rules.remove(n), this.attached && n.renderable && this.renderer ? this.renderer.deleteRule(n.renderable) : !0);
  }, e.indexOf = function(s) {
    return this.rules.indexOf(s);
  }, e.deploy = function() {
    return this.renderer && this.renderer.deploy(), this.deployed = !0, this;
  }, e.update = function() {
    var s;
    return (s = this.rules).update.apply(s, arguments), this;
  }, e.updateOne = function(s, n, r) {
    return this.rules.updateOne(s, n, r), this;
  }, e.toString = function(s) {
    return this.rules.toString(s);
  }, i;
}(), xo = /* @__PURE__ */ function() {
  function i() {
    this.plugins = {
      internal: [],
      external: []
    }, this.registry = {};
  }
  var e = i.prototype;
  return e.onCreateRule = function(s, n, r) {
    for (var o = 0; o < this.registry.onCreateRule.length; o++) {
      var a = this.registry.onCreateRule[o](s, n, r);
      if (a) return a;
    }
    return null;
  }, e.onProcessRule = function(s) {
    if (!s.isProcessed) {
      for (var n = s.options.sheet, r = 0; r < this.registry.onProcessRule.length; r++)
        this.registry.onProcessRule[r](s, n);
      s.style && this.onProcessStyle(s.style, s, n), s.isProcessed = !0;
    }
  }, e.onProcessStyle = function(s, n, r) {
    for (var o = 0; o < this.registry.onProcessStyle.length; o++)
      n.style = this.registry.onProcessStyle[o](n.style, n, r);
  }, e.onProcessSheet = function(s) {
    for (var n = 0; n < this.registry.onProcessSheet.length; n++)
      this.registry.onProcessSheet[n](s);
  }, e.onUpdate = function(s, n, r, o) {
    for (var a = 0; a < this.registry.onUpdate.length; a++)
      this.registry.onUpdate[a](s, n, r, o);
  }, e.onChangeValue = function(s, n, r) {
    for (var o = s, a = 0; a < this.registry.onChangeValue.length; a++)
      o = this.registry.onChangeValue[a](o, n, r);
    return o;
  }, e.use = function(s, n) {
    n === void 0 && (n = {
      queue: "external"
    });
    var r = this.plugins[n.queue];
    r.indexOf(s) === -1 && (r.push(s), this.registry = [].concat(this.plugins.external, this.plugins.internal).reduce(function(o, a) {
      for (var d in a)
        d in o ? o[d].push(a[d]) : process.env.NODE_ENV !== "production" && q(!1, '[JSS] Unknown hook "' + d + '".');
      return o;
    }, {
      onCreateRule: [],
      onProcessRule: [],
      onProcessStyle: [],
      onProcessSheet: [],
      onChangeValue: [],
      onUpdate: []
    }));
  }, i;
}(), Lo = /* @__PURE__ */ function() {
  function i() {
    this.registry = [];
  }
  var e = i.prototype;
  return e.add = function(s) {
    var n = this.registry, r = s.options.index;
    if (n.indexOf(s) === -1) {
      if (n.length === 0 || r >= this.index) {
        n.push(s);
        return;
      }
      for (var o = 0; o < n.length; o++)
        if (n[o].options.index > r) {
          n.splice(o, 0, s);
          return;
        }
    }
  }, e.reset = function() {
    this.registry = [];
  }, e.remove = function(s) {
    var n = this.registry.indexOf(s);
    this.registry.splice(n, 1);
  }, e.toString = function(s) {
    for (var n = s === void 0 ? {} : s, r = n.attached, o = io(n, ["attached"]), a = ue(o), d = a.linebreak, h = "", u = 0; u < this.registry.length; u++) {
      var S = this.registry[u];
      r != null && S.attached !== r || (h && (h += d), h += S.toString(o));
    }
    return h;
  }, Wn(i, [{
    key: "index",
    /**
     * Current highest index number.
     */
    get: function() {
      return this.registry.length === 0 ? 0 : this.registry[this.registry.length - 1].options.index;
    }
  }]), i;
}(), Se = new Lo(), Ct = typeof globalThis < "u" ? globalThis : typeof window < "u" && window.Math === Math ? window : typeof self < "u" && self.Math === Math ? self : Function("return this")(), yt = "2f1acc6c3a606b082e5eef5e54414ffb";
Ct[yt] == null && (Ct[yt] = 0);
var Qt = Ct[yt]++, Fo = 1e10, Kt = function(e) {
  e === void 0 && (e = {});
  var t = 0, s = function(r, o) {
    t += 1, t > Fo && process.env.NODE_ENV !== "production" && q(!1, "[JSS] You might have a memory leak. Rule counter is at " + t + ".");
    var a = "", d = "";
    return o && (o.options.classNamePrefix && (d = o.options.classNamePrefix), o.options.jss.id != null && (a = String(o.options.jss.id))), e.minify ? "" + (d || "c") + Qt + a + t : d + r.key + "-" + Qt + (a ? "-" + a : "") + "-" + t;
  };
  return s;
}, qn = function(e) {
  var t;
  return function() {
    return t || (t = e()), t;
  };
}, Ao = function(e, t) {
  try {
    return e.attributeStyleMap ? e.attributeStyleMap.get(t) : e.style.getPropertyValue(t);
  } catch {
    return "";
  }
}, Oo = function(e, t, s) {
  try {
    var n = s;
    if (Array.isArray(s) && (n = fe(s)), e.attributeStyleMap)
      e.attributeStyleMap.set(t, n);
    else {
      var r = n ? n.indexOf("!important") : -1, o = r > -1 ? n.substr(0, r - 1) : n;
      e.style.setProperty(t, o, r > -1 ? "important" : "");
    }
  } catch {
    return !1;
  }
  return !0;
}, Io = function(e, t) {
  try {
    e.attributeStyleMap ? e.attributeStyleMap.delete(t) : e.style.removeProperty(t);
  } catch (s) {
    process.env.NODE_ENV !== "production" && q(!1, '[JSS] DOMException "' + s.message + '" was thrown. Tried to remove property "' + t + '".');
  }
}, Do = function(e, t) {
  return e.selectorText = t, e.selectorText === t;
}, jn = qn(function() {
  return document.querySelector("head");
});
function _o(i, e) {
  for (var t = 0; t < i.length; t++) {
    var s = i[t];
    if (s.attached && s.options.index > e.index && s.options.insertionPoint === e.insertionPoint)
      return s;
  }
  return null;
}
function Uo(i, e) {
  for (var t = i.length - 1; t >= 0; t--) {
    var s = i[t];
    if (s.attached && s.options.insertionPoint === e.insertionPoint)
      return s;
  }
  return null;
}
function zo(i) {
  for (var e = jn(), t = 0; t < e.childNodes.length; t++) {
    var s = e.childNodes[t];
    if (s.nodeType === 8 && s.nodeValue.trim() === i)
      return s;
  }
  return null;
}
function Bo(i) {
  var e = Se.registry;
  if (e.length > 0) {
    var t = _o(e, i);
    if (t && t.renderer)
      return {
        parent: t.renderer.element.parentNode,
        node: t.renderer.element
      };
    if (t = Uo(e, i), t && t.renderer)
      return {
        parent: t.renderer.element.parentNode,
        node: t.renderer.element.nextSibling
      };
  }
  var s = i.insertionPoint;
  if (s && typeof s == "string") {
    var n = zo(s);
    if (n)
      return {
        parent: n.parentNode,
        node: n.nextSibling
      };
    process.env.NODE_ENV !== "production" && q(!1, '[JSS] Insertion point "' + s + '" not found.');
  }
  return !1;
}
function Go(i, e) {
  var t = e.insertionPoint, s = Bo(e);
  if (s !== !1 && s.parent) {
    s.parent.insertBefore(i, s.node);
    return;
  }
  if (t && typeof t.nodeType == "number") {
    var n = t, r = n.parentNode;
    r ? r.insertBefore(i, n.nextSibling) : process.env.NODE_ENV !== "production" && q(!1, "[JSS] Insertion point is not in the DOM.");
    return;
  }
  jn().appendChild(i);
}
var No = qn(function() {
  var i = document.querySelector('meta[property="csp-nonce"]');
  return i ? i.getAttribute("content") : null;
}), qt = function(e, t, s) {
  try {
    "insertRule" in e ? e.insertRule(t, s) : "appendRule" in e && e.appendRule(t);
  } catch (n) {
    return process.env.NODE_ENV !== "production" && q(!1, "[JSS] " + n.message), !1;
  }
  return e.cssRules[s];
}, jt = function(e, t) {
  var s = e.cssRules.length;
  return t === void 0 || t > s ? s : t;
}, Ho = function() {
  var e = document.createElement("style");
  return e.textContent = `
`, e;
}, Wo = /* @__PURE__ */ function() {
  function i(t) {
    this.getPropertyValue = Ao, this.setProperty = Oo, this.removeProperty = Io, this.setSelector = Do, this.hasInsertedRules = !1, this.cssRules = [], t && Se.add(t), this.sheet = t;
    var s = this.sheet ? this.sheet.options : {}, n = s.media, r = s.meta, o = s.element;
    this.element = o || Ho(), this.element.setAttribute("data-jss", ""), n && this.element.setAttribute("media", n), r && this.element.setAttribute("data-meta", r);
    var a = No();
    a && this.element.setAttribute("nonce", a);
  }
  var e = i.prototype;
  return e.attach = function() {
    if (!(this.element.parentNode || !this.sheet)) {
      Go(this.element, this.sheet.options);
      var s = !!(this.sheet && this.sheet.deployed);
      this.hasInsertedRules && s && (this.hasInsertedRules = !1, this.deploy());
    }
  }, e.detach = function() {
    if (this.sheet) {
      var s = this.element.parentNode;
      s && s.removeChild(this.element), this.sheet.options.link && (this.cssRules = [], this.element.textContent = `
`);
    }
  }, e.deploy = function() {
    var s = this.sheet;
    if (s) {
      if (s.options.link) {
        this.insertRules(s.rules);
        return;
      }
      this.element.textContent = `
` + s.toString() + `
`;
    }
  }, e.insertRules = function(s, n) {
    for (var r = 0; r < s.index.length; r++)
      this.insertRule(s.index[r], r, n);
  }, e.insertRule = function(s, n, r) {
    if (r === void 0 && (r = this.element.sheet), s.rules) {
      var o = s, a = r;
      if (s.type === "conditional" || s.type === "keyframes") {
        var d = jt(r, n);
        if (a = qt(r, o.toString({
          children: !1
        }), d), a === !1)
          return !1;
        this.refCssRule(s, d, a);
      }
      return this.insertRules(o.rules, a), a;
    }
    var h = s.toString();
    if (!h) return !1;
    var u = jt(r, n), S = qt(r, h, u);
    return S === !1 ? !1 : (this.hasInsertedRules = !0, this.refCssRule(s, u, S), S);
  }, e.refCssRule = function(s, n, r) {
    s.renderable = r, s.options.parent instanceof Kn && this.cssRules.splice(n, 0, r);
  }, e.deleteRule = function(s) {
    var n = this.element.sheet, r = this.indexOf(s);
    return r === -1 ? !1 : (n.deleteRule(r), this.cssRules.splice(r, 1), !0);
  }, e.indexOf = function(s) {
    return this.cssRules.indexOf(s);
  }, e.replaceRule = function(s, n) {
    var r = this.indexOf(s);
    return r === -1 ? !1 : (this.element.sheet.deleteRule(r), this.cssRules.splice(r, 1), this.insertRule(n, r));
  }, e.getRules = function() {
    return this.element.sheet.cssRules;
  }, i;
}(), Vo = 0, $o = /* @__PURE__ */ function() {
  function i(t) {
    this.id = Vo++, this.version = "10.10.0", this.plugins = new xo(), this.options = {
      id: {
        minify: !1
      },
      createGenerateId: Kt,
      Renderer: eo ? Wo : null,
      plugins: []
    }, this.generateId = Kt({
      minify: !1
    });
    for (var s = 0; s < Vt.length; s++)
      this.plugins.use(Vt[s], {
        queue: "internal"
      });
    this.setup(t);
  }
  var e = i.prototype;
  return e.setup = function(s) {
    return s === void 0 && (s = {}), s.createGenerateId && (this.options.createGenerateId = s.createGenerateId), s.id && (this.options.id = B({}, this.options.id, s.id)), (s.createGenerateId || s.id) && (this.generateId = this.options.createGenerateId(this.options.id)), s.insertionPoint != null && (this.options.insertionPoint = s.insertionPoint), "Renderer" in s && (this.options.Renderer = s.Renderer), s.plugins && this.use.apply(this, s.plugins), this;
  }, e.createStyleSheet = function(s, n) {
    n === void 0 && (n = {});
    var r = n, o = r.index;
    typeof o != "number" && (o = Se.index === 0 ? 0 : Se.index + 1);
    var a = new Kn(s, B({}, n, {
      jss: this,
      generateId: n.generateId || this.generateId,
      insertionPoint: this.options.insertionPoint,
      Renderer: this.options.Renderer,
      index: o
    }));
    return this.plugins.onProcessSheet(a), a;
  }, e.removeStyleSheet = function(s) {
    return s.detach(), Se.remove(s), this;
  }, e.createRule = function(s, n, r) {
    if (n === void 0 && (n = {}), r === void 0 && (r = {}), typeof s == "object")
      return this.createRule(void 0, s, n);
    var o = B({}, r, {
      name: s,
      jss: this,
      Renderer: this.options.Renderer
    });
    o.generateId || (o.generateId = this.generateId), o.classes || (o.classes = {}), o.keyframes || (o.keyframes = {});
    var a = $n(s, n, o);
    return a && this.plugins.onProcessRule(a), a;
  }, e.use = function() {
    for (var s = this, n = arguments.length, r = new Array(n), o = 0; o < n; o++)
      r[o] = arguments[o];
    return r.forEach(function(a) {
      s.plugins.use(a);
    }), this;
  }, i;
}(), Qo = function(e) {
  return new $o(e);
};
/**
 * A better abstraction over CSS.
 *
 * @copyright Oleg Isonen (Slobodskoi) / Isonen 2014-present
 * @website https://github.com/cssinjs/jss
 * @license MIT
 */
var Ko = Qo(), Z = "@global", Et = "@global ", qo = /* @__PURE__ */ function() {
  function i(t, s, n) {
    this.type = "global", this.at = Z, this.isProcessed = !1, this.key = t, this.options = n, this.rules = new He(B({}, n, {
      parent: this
    }));
    for (var r in s)
      this.rules.add(r, s[r]);
    this.rules.process();
  }
  var e = i.prototype;
  return e.getRule = function(s) {
    return this.rules.get(s);
  }, e.addRule = function(s, n, r) {
    var o = this.rules.add(s, n, r);
    return o && this.options.jss.plugins.onProcessRule(o), o;
  }, e.replaceRule = function(s, n, r) {
    var o = this.rules.replace(s, n, r);
    return o && this.options.jss.plugins.onProcessRule(o), o;
  }, e.indexOf = function(s) {
    return this.rules.indexOf(s);
  }, e.toString = function(s) {
    return this.rules.toString(s);
  }, i;
}(), jo = /* @__PURE__ */ function() {
  function i(t, s, n) {
    this.type = "global", this.at = Z, this.isProcessed = !1, this.key = t, this.options = n;
    var r = t.substr(Et.length);
    this.rule = n.jss.createRule(r, s, B({}, n, {
      parent: this
    }));
  }
  var e = i.prototype;
  return e.toString = function(s) {
    return this.rule ? this.rule.toString(s) : "";
  }, i;
}(), Xo = /\s*,\s*/g;
function Xn(i, e) {
  for (var t = i.split(Xo), s = "", n = 0; n < t.length; n++)
    s += e + " " + t[n].trim(), t[n + 1] && (s += ", ");
  return s;
}
function Jo(i, e) {
  var t = i.options, s = i.style, n = s ? s[Z] : null;
  if (n) {
    for (var r in n)
      e.addRule(r, n[r], B({}, t, {
        selector: Xn(r, i.selector)
      }));
    delete s[Z];
  }
}
function Yo(i, e) {
  var t = i.options, s = i.style;
  for (var n in s)
    if (!(n[0] !== "@" || n.substr(0, Z.length) !== Z)) {
      var r = Xn(n.substr(Z.length), i.selector);
      e.addRule(r, s[n], B({}, t, {
        selector: r
      })), delete s[n];
    }
}
function Zo() {
  function i(t, s, n) {
    if (!t) return null;
    if (t === Z)
      return new qo(t, s, n);
    if (t[0] === "@" && t.substr(0, Et.length) === Et)
      return new jo(t, s, n);
    var r = n.parent;
    return r && (r.type === "global" || r.options.parent && r.options.parent.type === "global") && (n.scoped = !1), !n.selector && n.scoped === !1 && (n.selector = t), null;
  }
  function e(t, s) {
    t.type !== "style" || !s || (Jo(t, s), Yo(t, s));
  }
  return {
    onCreateRule: i,
    onProcessRule: e
  };
}
var ea = /[A-Z]/g, ta = /^ms-/, Ye = {};
function sa(i) {
  return "-" + i.toLowerCase();
}
function Jn(i) {
  if (Ye.hasOwnProperty(i))
    return Ye[i];
  var e = i.replace(ea, sa);
  return Ye[i] = ta.test(e) ? "-" + e : e;
}
function Be(i) {
  var e = {};
  for (var t in i) {
    var s = t.indexOf("--") === 0 ? t : Jn(t);
    e[s] = i[t];
  }
  return i.fallbacks && (Array.isArray(i.fallbacks) ? e.fallbacks = i.fallbacks.map(Be) : e.fallbacks = Be(i.fallbacks)), e;
}
function na() {
  function i(t) {
    if (Array.isArray(t)) {
      for (var s = 0; s < t.length; s++)
        t[s] = Be(t[s]);
      return t;
    }
    return Be(t);
  }
  function e(t, s, n) {
    if (s.indexOf("--") === 0)
      return t;
    var r = Jn(s);
    return s === r ? t : (n.prop(r, t), null);
  }
  return {
    onProcessStyle: i,
    onChangeValue: e
  };
}
var re = { d: (i, e) => {
  for (var t in e) re.o(e, t) && !re.o(i, t) && Object.defineProperty(i, t, { enumerable: !0, get: e[t] });
}, o: (i, e) => Object.prototype.hasOwnProperty.call(i, e) }, U = {};
re.d(U, { nR: () => Re, JI: () => xe, lg: () => fa, j9: () => sr, Xk: () => Ee, Tv: () => Te, hv: () => Me, vo: () => we, ME: () => wt, eF: () => ya, zF: () => be, Y3: () => Le, JH: () => Tt, C4: () => Zn, U$: () => tr, II: () => er, Yi: () => Mt, ny: () => ce });
const M = (Xt = { Flags: () => Ki, Logger: () => qi, NumericParameters: () => ji, OptionParameters: () => Xi, SettingFlag: () => Ji, TextParameters: () => Yi, WebXRController: () => Zi }, Ze = {}, re.d(Ze, Xt), Ze);
var Xt, Ze, ce;
class wt {
  constructor(e, t, s) {
    this.rootDiv = e, this.rootElement = t, this.textElement = s, this.rootElement.appendChild(this.textElement), this.hide(), this.rootDiv.appendChild(this.rootElement);
  }
  show() {
    this.rootElement.classList.remove("hiddenState");
  }
  hide() {
    this.rootElement.classList.add("hiddenState");
  }
}
class xe extends wt {
  constructor(e, t, s) {
    super(e, t, s), this.onActionCallback = () => {
      M.Logger.Info(M.Logger.GetStackTrace(), "Did you forget to set the onAction callback in your overlay?");
    };
  }
  update(e) {
    e == null && e == null || (this.textElement.innerHTML = e);
  }
  onAction(e) {
    this.onActionCallback = e;
  }
  activate() {
    this.onActionCallback();
  }
}
class Ee extends xe {
  static createRootElement() {
    const e = document.createElement("div");
    return e.id = "connectOverlay", e.className = "clickableState", e;
  }
  static createContentElement() {
    const e = document.createElement("div");
    return e.id = "connectButton", e.innerHTML = "Click to start", e;
  }
  constructor(e) {
    super(e, Ee.createRootElement(), Ee.createContentElement()), this.rootElement.addEventListener("click", () => {
      this.activate();
    });
  }
}
class Te extends xe {
  static createRootElement() {
    const e = document.createElement("div");
    return e.id = "disconnectOverlay", e.className = "clickableState", e;
  }
  static createContentElement() {
    const e = document.createElement("div");
    return e.id = "disconnectButton", e.innerHTML = "Click To Restart", e;
  }
  constructor(e) {
    super(e, Te.createRootElement(), Te.createContentElement()), this.rootElement.addEventListener("click", () => {
      this.activate();
    });
  }
}
class be extends xe {
  static createRootElement() {
    const e = document.createElement("div");
    return e.id = "playOverlay", e.className = "clickableState", e;
  }
  static createContentElement() {
    const e = document.createElement("img");
    return e.id = "playButton", e.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPEAAAD5CAYAAAD2mNNkAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMjHxIGmVAAASgklEQVR4Xu2dC7BdVX2HqUCCIRASCPjAFIQREBRBBSRYbFOt8lIrFUWRFqXWsT5wbItUqFWs0KqIMPKoYEWpRS06KDjS1BeVFkVQbCw+wCfiAwGhCKWP9PuZtU24uTe59zz22Y/vm/nGkXtz7jlrr9+sdfZea/03Wb169QtxGW62iYi0D8L7NbwYj8EdcdPyIxFpA4T2P/F/8Ua8CI/GhPnXyq+ISJMhrAlxxX9hRuYL8Sh8SPk1EWkqBHXdEFfcg6vw3fhs3Kb8uog0DQI6XYgr8rOvYsJ8OM4v/0xEmkIJ6ob4P8zIfANegCvQMIs0BQK5sRBXJMy/wIzM5+ByXFBeRkQmBUGcbYjX5S5MmM/AA3CL8nIiUjcEcJAQV9yBX8a/wSeiz5hF6obgDRPikGfMCfOX8DTcu7y0iNQBoRs2xBX/g3diwvwm3Kn8CREZJ4RtVCGuqMKcu9kn4xJ09ZfIuCBgow5xyJ3sTLNzAywrwF6J26NhFhk1BGscIV6XhPluvA6Pxx3KnxaRUUCoxh3iioQ5z5n/BY/FJeUtiMgwEKa6QlyRMN+Hn8Hn4ZblrYjIIBCiukMc8p25Ws6ZMD+zvB0RmSsEaBIhnkrew5V4EHrCiMhcKAFqCv+Nl+J+uBC9my2yMQhKk0Jcke/M78Gsy06YH1TerohMhYA0McQVP8Nz8UDcCl2bLTIVgtHkEFd8D8/E/XFrdGQWqSAQbQhxyKOpm/B03Ac9MkgkEIa2hLgiN78S5lPx0bgIvQEm/YUAtC3EFQnzzfgnuDc6zZZ+Qsdva4jX5Sv4atwXHZmlX9DhuxDikC2Qn8dXYUbmReUjinQbOntXQlyRTRafwldgwrxV+agi3YRO3rUQV/wcV+LL8DHoyZzSTejcXQ1xRc7/uhyzl3kv3Lx8dJFuQKfueohDnjFnZP4o/j7m0ZQH4Es3oDP3IcQV2f6YMF+COZjgUeiZ2dJu6MR9CvG63ILvx4zMCfO80iQi7YLO29cQV3wb34spsr4rumBE2gWdtu8hDln99S1MXeYX4M6leUSaDx3WEK8lRdYT5lR/zPlfnswpzYeOaojXJ4cSfB3Pw+fgtug0W5oJndMQT0/uZGeaXZVyfTZuV5pNpDnQMQ3xxsk0O9Ufz8ZDcdvSfCKThw5piGdP2ioF496JT0c3WcjkKR1T5kYWjCTM78DfQheMyOSgAxriwch35lR/vAbPwOXozS+pHzqeIR6Oal12wvx2fBy6yULqgw5niEdDwpyR+VpMkfXsmHIpp4wfOpohHj234RfwFNwDnWbL+KCDGeLxkJH5p3g1vg53K00uMlroXIZ4vGTBSMJ8FeZkzmWl6UVGA53KENfD/ZiyNCmynvO/FpdLIDIcdCZDXC8ZmfOd+d/wJejZXzIcdCJDXD95xpwjdnP+V74zH4Wu/pLBoPMY4smSMN+FKbJ+BBpmmRt0GkPcDBLmu/FjeAi6lFNmB53FEDeHTLPzaCoj80dwBfqMWTYMncQQN5esAPsw7lcul8j60EEMcfPJDbD3YU7l3KxcOpE10CkMcTvIVDvfmc/E3XELtPqjGOKWkhVgp+GemDD7vbnP0AEMcXtJkfU34GNxAToy9xEuvCFuP6vwJMyOqYXl0kpf4KIb4m5QncyZTRapZGGY+wIX2xB3i3vxOswmi13QaXbX4QIb4m6SY3a/iMdh7mYb5q7ChTXE3aXaaLESq7rMW5ZLL12Bi2qI+8E9eDkmzLuhYe4KXExD3B8yMt+Ol+KL0CLrXYCLaIj7R8J8K16CR6PLOdsMF88Q95fsmPoRXozPxdzNdvVX2+CiGWLJza+EOXWZj8Sd0APw2wIXyxBLqPYy34LnY8K8DA1z0+EiGWKZSgJ9I74LU2R9R3Sa3VS4OIZYZqJaynkWpsj6w0u3kSbBhTHEsjHuwxswpVwPw6Wl+0gT4IIYYpkNmWKnr1yPqf54KG5VupFMknJhRGZLwpzVX6n++DZ8GrpjapJwAQyxDELCnB1TqWTx1/gUdGSeBDS8IZZBSZBjzv76PP4VHoSGuU5ocEMsoyBhTsG4VH98Ix6A80s3k3FCQxtiGSVZMPIT/CwmzPuhz5jHCQ1siGUcZClnwvxpPAX3LF1ORg2Na4hlXGSKnQUjCfNn8PX4CNy0dD8ZBTSoIZZxkzBXI/Pn8ATMumzDPApoSEMsdZEw5zvzDzHT7JdjwuzZX8NAAxpimQSZZifMn8Tj8aGlS8pcofEMsUyKjMw5lTOnjHwcc2TQktI1ZbbQaIZYJk3CnE0WGZmvwOeh+5hnC41liKUpVCNzwvwJPBy9+bUxaCRDLE0jYb4fU/0x0+yD8cGly8pUaBxDLE0kQa7CfCfmML8D0SN2p0KjGGJpOglztWgkh/k9CT1it4LGMMTSFhLmLBrJ3exzcJ/SjfsNDWGIpY0k0D/AM/GRpTv3ExrAEEubqVaAnY5LsX93s/nQhli6QLUF8nWYI3bnYT+Wc/JBDbF0heqO9jfwlfhInI/dDjMf0BBLF0mYr8NsskiNqS2wm2Hmgxli6TJ5zpwjg/4Qd8buLRrhQxli6QM5ZjdHBh2H+c7cnUUjfBhDLH0hU+y7cCU+H7OXeV6JQnvhQxhi6RsJc0bmy/BZ+MsbYCUS7YM3b4ilryTM2QL5QUzBuHxnbt80mzdtiEVWr74NL8KUck2R9faMzLxZQyyyhozMWcp5If4uJszNP5yAN2mIRR5IVn/djOfhEdjsw/x4c4ZYZHryjPkmPBsPwYeV2DQL3pghFpmZTLFzZFDCnLrMz8DtsTkbLXgzhlhk4yTM2cu8CrNjKiNzwjz5OlO8CUMsMjcS5qzLfgumyPr2JU6TgTdgiEUGoyqynrrMv42TOTObP2yIRQYn0+ws5bwaU8r1N3HrEq964A8aYpHhSZjvwBSMS5gPwnrWZfOHDLHI6Mgz5hyxm4Jxf4kH4HjDzB8wxCKjJ2HONPuf8c9xHxzPXmZe2BCLjIdMsWMqWfwTnoiPwdGOzLygIRYZPwlzVWPqtbgXjmbBCC9kiEXqI8+Ys8nicnwN7laiODi8iCEWqZeMylmXnTCnYFxO5tyxRHLu8I8NschkSJizLvv7mJH5pbgY57Zjin9giEUmSzUyfw9TZP1Y3LZEdOPwy4ZYpBkkzKn++B38KB6F25Wozgy/ZIhFmkXCnLO/vosfwpwysqhEdn34oSEWaSYJ8y8w0+wP4GG4/oIR/qMhFmk2VZgzzU6Ys2Nq7T5m/o8hFmkHCXO2PybMF+O++CBDLNIuEuSsy8535lvxZEMs0j6qWszZJbXUEIu0i1vwrZhqFZv5nVikPWTqfA5mF9QDD+fjPxhikeaR777xdrwAn1Aiuz780BCLNIvsdMqBAqkNtRw3XBeKXzDEIpMno27Cezdeik/GBSWmG4ZfNMQikyPhzXrpVGXM6R8rcG7lVfkHhlikfhLe7FzKo6KV+Hu45m7zXOEfGmKReske4oT3k3gMblniOBi8gCEWqYeMvD/GK/F43KHEcDh4IUMsMl5yw+pHmLOoX4aDH8UzHbygIRYZD/nem5H3KjwBd8LRV1HkRQ2xyGjJ3eacNZ1iayfhr+P46hnz4oZYZDRk2pzwph7TX+CuOP76xfwRQywyHNlVVIX3VHx8iVc98AcNscjgZJFGypq+GffHwZ71DgN/1BCLzJ2f47/iWzBlTId71jsM/HFDLDI7crf5HrwG34YHY70FxaeDN2GIRTZMwpvjcK7Fd+BTcfLhreDNGGKRmcnIez2+Ew/FhTi3MivjhjdkiEXWJ0fEfhXPwmfi4hKZ5sGbM8Qia8n65lX4LkzlhYeVqDQX3qQhFlnzrPc/8FzMtsBl2Kxp80zwRg2x9J0cxn4epoBZlkjW/6x3GHjDhlj6SJZI5gTJ9+DzMeHdvMSiXfDGDbH0iWpbYMqgJLy7YLtG3qnwAQyx9IVsC7wEX4C74/h2FtUJH8QQS9fJUTg5QfI43APnle7fDfhAhli6So5//Ri+GBPeya1vHid8MEMsXSMH0X0CX4J74cLS3bsJH9AQS1fITavs6f1VeLEdz3qHgQ9piKXtZHNC1jfnELpfTpux++Gt4MMaYmkrmTZ/GV+LCW+3p80zwQc3xNI2skTyBswhdHtic7YFTgIawBBLm7gRT8HH4dbYn2nzTNAIhljaQCrkvwkT3tywGv8pkm2BxjDE0lRyokbOsjoDUyE/N6wM71RoFEMsTSPhvRPfjY/GBei0eSZoHEMsTeJ2/ADug+3cVVQ3NJQhliaQkfcf8SnoqDsXaDBDLJMij4ruxcvwaejIOwg0nCGWusnyyIT3CjwM+7lIY1TQgIZY6iA3qzLyZmdRSn0eic09QbJN0JCGWMZJwpuR9w78Er4Qu7klcFLQoIZYxkXq9OZuc2oWZXNCv5dHjgsa1hDLqKnCm2qB2Zzw0NLdZBzQwIZYRkWmzT/DhPdE3KV0MxknNLQhlmHJ996ENwXHsjkhq6xcHlkXNLYhlkFJeHPDKhvyszkh4W338a9thEY3xDJX8qgoGxMS3tTpfSzOL11K6obGN8QyWxLeLI/MtDmlPvdHp82ThotgiGU2ZOStwrsCXSLZFLgYhlg2xF2Yc6zOxqejCzWaBhfFEMt0pMj2VzB1eg/BJaXLSNPg4hhiqcjd5izUSIX8lPp8Fi4tXUWaChfJEEtIhfwU2b4QU2R7O3RfbxvgQhnifpOD17+JCW9KfS5F7zi3CS6YIe4nOXj9W/h3eAw+vHQJaRtcPEPcL/Ks92a8CI/FXdFpc5vhAhri/vB9/Hv8A3wUukSyC3AhDXH3+Sn+Ax6PqZDvEskuwQU1xN2kOgonJ0im1Gc2J2xRLrt0CS6sIe4W1c6ij2NG3lROmFcut3QRLrAh7g4J75X4R7g3Gt4+wIU2xO0n0+ZP4aswBcdc39wnuOCGuL3kWe/n8DW4Ly4ql1X6BBfeELeTL+AJ+ATcBn3W21e4+Ia4PeSO89fwT/GJuAhdItl36ASGuPlkZ9G38fWYo3Ay8hpeWQOdwRA3lxwBexO+GVPq07Insj50DEPcTLK++e2Yc6wWo995ZXroHIa4WdyKOQpnOWbavGm5VCLTQycxxM0gp0iej0/G3LAyvDI76CyGeHJUx+G8Hw9Ewytzh05jiCdDDqK7HA/Aheh3XhkMOo8hrpe096fxd9D9vDI8pVPJ+LkXP4vPQafMMjroUIZ4fOQ7b9Y3X4U5x8oi2zJ66FiGePRkeWROkfwiHoee3Szjgw5miEdDRt14D+bw9ZfjDqWZRcYHHc0QD091FE6OgP0z9OB1qQ86myEenKxtTngz8r4BHXmlfuh4hnjuJLwp9Zlqgafh7qU5ReqHDmiIZ0+mzVkeeQO+FR9fmlFkctARDfHsSJ3ef8dqZ5GH0EkzoDMa4pnJ3ea0T07TOAezvnlBaTqRZlA6qTyQhDdrm1fhBXgwGl5pJnROQ7yW6jlvwvtefAZuXppKpJmUTitrp80p9Zn1zQ8uTSTSbOisfQ9xps2pkJ/wPhe3K00j0g7otH0N8f34dXwfHo0W2ZZ2QuftY4izPDKnabwIH4Ee/yrthQ7clxBnldUP8BJ8MSa87uuV9kNH7nqIc4ZVwvshfCkuQ8Mr3YEO3dUQZ4nkD/HDmFKfe5SPLNIt6NxdDHHC+xF8BabsiSOvdBc6eJdCfBtehglvimz7rFe6Dx29CyHOQo0r8NWYOr0W2Zb+QIdva4izRDLPeldi6vSm1OfC8rFE+gMdv40hznu+GlMhfz/cEj0OR/oJnb9NIc57vQZPxCehI69ICUbTydnN1+LJmPAuKW9fRAhEk0OcZ73XYw6hOwg9v1lkKgSjqSHO5oRT8TdwKbq+WWQ6CEeTQpw7zlmocTqmTm/Ob7bomMiGICRNCHGmzT/BszClPjPyuspKZDYQlkmH+Mf4t7gct0enzSJzgdBMKsQJ70X4VHTkFRkUwlN3iFM54YN4KG6LHkQnMgyEqK4Q51nvpZjwZuQ1vCKjgDDVEeIr8XBMeL3bLDJKCNW4QpyR9zo8ArdBb1iJjAPCNeoQJ7ypFngszkc3JoiME0I2qhDnWW8Kjv0xujFBpC4I3DAhzgqrHESXUp/Z0/uQ8rIiUhcEb5AQJ7z34TfwJNy5vJyI1A0BnG2IE9yYsiffwTfizuh3XpFJQghnE+J83014v4upkL8r+qhIpAkQxg2FOOHNzzNtPhf3REdekSZRQjqVTJtzguSNeD4eWH5dRJoGAZ0a4rvxm3ghrkCnzSJNhpBWIc7/plpgwpudRZ7dLNIGCOvtJbwX42G4uPxIRNoAoU2d3iNxUflPItIaNtnk/wEGBoMdpECGHAAAAABJRU5ErkJggg==", e.alt = "Start Streaming", e;
  }
  constructor(e) {
    super(e, be.createRootElement(), be.createContentElement()), this.rootElement.addEventListener("click", () => {
      this.activate();
    });
  }
}
class Mt extends wt {
  constructor(e, t, s) {
    super(e, t, s);
  }
  update(e) {
    e == null && e == null || (this.textElement.innerHTML = e);
  }
}
class we extends Mt {
  static createRootElement() {
    const e = document.createElement("div");
    return e.id = "infoOverlay", e.className = "textDisplayState", e;
  }
  static createContentElement() {
    const e = document.createElement("div");
    return e.id = "messageOverlayInner", e;
  }
  constructor(e) {
    super(e, we.createRootElement(), we.createContentElement());
  }
}
class Me extends Mt {
  static createRootElement() {
    const e = document.createElement("div");
    return e.id = "errorOverlay", e.className = "textDisplayState", e;
  }
  static createContentElement() {
    const e = document.createElement("div");
    return e.id = "errorOverlayInner", e;
  }
  constructor(e) {
    super(e, Me.createRootElement(), Me.createContentElement());
  }
}
class Re extends xe {
  static createRootElement() {
    const e = document.createElement("div");
    return e.id = "afkOverlay", e.className = "clickableState", e;
  }
  static createContentElement() {
    const e = document.createElement("div");
    return e.id = "afkOverlayInner", e.innerHTML = '<center>No activity detected<br>Disconnecting in <span id="afkCountDownNumber"></span> seconds<br>Click to continue<br></center>', e;
  }
  constructor(e) {
    super(e, Re.createRootElement(), Re.createContentElement()), this.rootElement.addEventListener("click", () => {
      this.activate();
    });
  }
  updateCountdown(e) {
    this.textElement.innerHTML = `<center>No activity detected<br>Disconnecting in <span id="afkCountDownNumber">${e}</span> seconds<br>Click to continue<br></center>`;
  }
}
class Yn {
  get rootElement() {
    return this._rootElement;
  }
  set rootElement(e) {
    e.onclick = () => this.toggleFullscreen(), this._rootElement = e;
  }
  constructor() {
    this.isFullscreen = !1, document.addEventListener("webkitfullscreenchange", () => this.onFullscreenChange(), !1), document.addEventListener("mozfullscreenchange", () => this.onFullscreenChange(), !1), document.addEventListener("fullscreenchange", () => this.onFullscreenChange(), !1), document.addEventListener("MSFullscreenChange", () => this.onFullscreenChange(), !1);
  }
  toggleFullscreen() {
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) document.exitFullscreen ? document.exitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitExitFullscreen ? document.webkitExitFullscreen() : document.msExitFullscreen && document.msExitFullscreen();
    else {
      const e = this.fullscreenElement;
      if (!e) return;
      e.requestFullscreen ? e.requestFullscreen() : e.mozRequestFullscreen ? e.mozRequestFullscreen() : e.webkitRequestFullscreen ? e.webkitRequestFullscreen() : e.msRequestFullscreen ? e.msRequestFullscreen() : e.webkitEnterFullscreen && e.webkitEnterFullscreen();
    }
    this.onFullscreenChange();
  }
  onFullscreenChange() {
    this.isFullscreen = document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement && document.msFullscreenElement !== null || document.fullscreenElement && document.fullscreenElement !== null;
  }
}
class ra extends Yn {
  constructor(e) {
    super(), this.rootElement = e;
  }
}
class ia extends Yn {
  constructor() {
    super();
    const e = document.createElement("button");
    e.type = "button", e.classList.add("UiTool"), e.id = "fullscreen-btn", e.appendChild(this.maximizeIcon), e.appendChild(this.minimizeIcon), e.appendChild(this.tooltipText), this.rootElement = e;
  }
  get tooltipText() {
    return this._tooltipText || (this._tooltipText = document.createElement("span"), this._tooltipText.classList.add("tooltiptext"), this._tooltipText.innerHTML = "Fullscreen"), this._tooltipText;
  }
  get maximizeIcon() {
    if (!this._maximizeIcon) {
      this._maximizeIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg"), this._maximizeIcon.setAttributeNS(null, "id", "maximizeIcon"), this._maximizeIcon.setAttributeNS(null, "x", "0px"), this._maximizeIcon.setAttributeNS(null, "y", "0px"), this._maximizeIcon.setAttributeNS(null, "viewBox", "0 0 384.97 384.97");
      const e = document.createElementNS("http://www.w3.org/2000/svg", "g");
      e.classList.add("svgIcon"), this._maximizeIcon.appendChild(e);
      const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
      t.setAttributeNS(null, "d", "M384.97,12.03c0-6.713-5.317-12.03-12.03-12.03H264.847c-6.833,0-11.922,5.39-11.934,12.223c0,6.821,5.101,11.838,11.934,11.838h96.062l-0.193,96.519c0,6.833,5.197,12.03,12.03,12.03c6.833-0.012,12.03-5.197,12.03-12.03l0.193-108.369c0-0.036-0.012-0.06-0.012-0.084C384.958,12.09,384.97,12.066,384.97,12.03z");
      const s = document.createElementNS("http://www.w3.org/2000/svg", "path");
      s.setAttributeNS(null, "d", "M120.496,0H12.403c-0.036,0-0.06,0.012-0.096,0.012C12.283,0.012,12.247,0,12.223,0C5.51,0,0.192,5.317,0.192,12.03L0,120.399c0,6.833,5.39,11.934,12.223,11.934c6.821,0,11.838-5.101,11.838-11.934l0.192-96.339h96.242c6.833,0,12.03-5.197,12.03-12.03C132.514,5.197,127.317,0,120.496,0z");
      const n = document.createElementNS("http://www.w3.org/2000/svg", "path");
      n.setAttributeNS(null, "d", "M120.123,360.909H24.061v-96.242c0-6.833-5.197-12.03-12.03-12.03S0,257.833,0,264.667v108.092c0,0.036,0.012,0.06,0.012,0.084c0,0.036-0.012,0.06-0.012,0.096c0,6.713,5.317,12.03,12.03,12.03h108.092c6.833,0,11.922-5.39,11.934-12.223C132.057,365.926,126.956,360.909,120.123,360.909z");
      const r = document.createElementNS("http://www.w3.org/2000/svg", "path");
      r.setAttributeNS(null, "d", "M372.747,252.913c-6.833,0-11.85,5.101-11.838,11.934v96.062h-96.242c-6.833,0-12.03,5.197-12.03,12.03s5.197,12.03,12.03,12.03h108.092c0.036,0,0.06-0.012,0.084-0.012c0.036-0.012,0.06,0.012,0.096,0.012c6.713,0,12.03-5.317,12.03-12.03V264.847C384.97,258.014,379.58,252.913,372.747,252.913z"), e.appendChild(t), e.appendChild(s), e.appendChild(n), e.appendChild(r);
    }
    return this._maximizeIcon;
  }
  get minimizeIcon() {
    if (!this._minimizeIcon) {
      this._minimizeIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg"), this._minimizeIcon.setAttributeNS(null, "id", "minimizeIcon"), this._minimizeIcon.setAttributeNS(null, "x", "0px"), this._minimizeIcon.setAttributeNS(null, "y", "0px"), this._minimizeIcon.setAttributeNS(null, "viewBox", "0 0 385.331 385.331");
      const e = document.createElementNS("http://www.w3.org/2000/svg", "g");
      e.classList.add("svgIcon"), this._minimizeIcon.appendChild(e);
      const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
      t.setAttributeNS(null, "d", "M264.943,156.665h108.273c6.833,0,11.934-5.39,11.934-12.211c0-6.833-5.101-11.85-11.934-11.838h-96.242V36.181c0-6.833-5.197-12.03-12.03-12.03s-12.03,5.197-12.03,12.03v108.273c0,0.036,0.012,0.06,0.012,0.084c0,0.036-0.012,0.06-0.012,0.096C252.913,151.347,258.23,156.677,264.943,156.665z");
      const s = document.createElementNS("http://www.w3.org/2000/svg", "path");
      s.setAttributeNS(null, "d", "M120.291,24.247c-6.821,0-11.838,5.113-11.838,11.934v96.242H12.03c-6.833,0-12.03,5.197-12.03,12.03c0,6.833,5.197,12.03,12.03,12.03h108.273c0.036,0,0.06-0.012,0.084-0.012c0.036,0,0.06,0.012,0.096,0.012c6.713,0,12.03-5.317,12.03-12.03V36.181C132.514,29.36,127.124,24.259,120.291,24.247z");
      const n = document.createElementNS("http://www.w3.org/2000/svg", "path");
      n.setAttributeNS(null, "d", "M120.387,228.666H12.115c-6.833,0.012-11.934,5.39-11.934,12.223c0,6.833,5.101,11.85,11.934,11.838h96.242v96.423c0,6.833,5.197,12.03,12.03,12.03c6.833,0,12.03-5.197,12.03-12.03V240.877c0-0.036-0.012-0.06-0.012-0.084c0-0.036,0.012-0.06,0.012-0.096C132.418,233.983,127.1,228.666,120.387,228.666z");
      const r = document.createElementNS("http://www.w3.org/2000/svg", "path");
      r.setAttributeNS(null, "d", "M373.3,228.666H265.028c-0.036,0-0.06,0.012-0.084,0.012c-0.036,0-0.06-0.012-0.096-0.012c-6.713,0-12.03,5.317-12.03,12.03v108.273c0,6.833,5.39,11.922,12.223,11.934c6.821,0.012,11.838-5.101,11.838-11.922v-96.242H373.3c6.833,0,12.03-5.197,12.03-12.03S380.134,228.678,373.3,228.666z"), e.appendChild(t), e.appendChild(s), e.appendChild(n), e.appendChild(r);
    }
    return this._minimizeIcon;
  }
  onFullscreenChange() {
    super.onFullscreenChange();
    const e = this.minimizeIcon, t = this.maximizeIcon;
    this.isFullscreen ? (e.style.display = "inline", e.style.transform = "translate(0, 0)", t.style.display = "none") : (e.style.display = "none", t.style.display = "inline", t.style.transform = "translate(0, 0)");
  }
}
class oa {
  get rootElement() {
    return this._rootElement || (this._rootElement = document.createElement("button"), this._rootElement.type = "button", this._rootElement.classList.add("UiTool"), this._rootElement.id = "settingsBtn", this._rootElement.appendChild(this.settingsIcon), this._rootElement.appendChild(this.tooltipText)), this._rootElement;
  }
  get tooltipText() {
    return this._tooltipText || (this._tooltipText = document.createElement("span"), this._tooltipText.classList.add("tooltiptext"), this._tooltipText.innerHTML = "Settings"), this._tooltipText;
  }
  get settingsIcon() {
    if (!this._settingsIcon) {
      this._settingsIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg"), this._settingsIcon.setAttributeNS(null, "id", "settingsIcon"), this._settingsIcon.setAttributeNS(null, "x", "0px"), this._settingsIcon.setAttributeNS(null, "y", "0px"), this._settingsIcon.setAttributeNS(null, "viewBox", "0 0 478.703 478.703");
      const e = document.createElementNS("http://www.w3.org/2000/svg", "g");
      e.classList.add("svgIcon"), this._settingsIcon.appendChild(e);
      const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
      t.setAttributeNS(null, "d", "M454.2,189.101l-33.6-5.7c-3.5-11.3-8-22.2-13.5-32.6l19.8-27.7c8.4-11.8,7.1-27.9-3.2-38.1l-29.8-29.8			c-5.6-5.6-13-8.7-20.9-8.7c-6.2,0-12.1,1.9-17.1,5.5l-27.8,19.8c-10.8-5.7-22.1-10.4-33.8-13.9l-5.6-33.2			c-2.4-14.3-14.7-24.7-29.2-24.7h-42.1c-14.5,0-26.8,10.4-29.2,24.7l-5.8,34c-11.2,3.5-22.1,8.1-32.5,13.7l-27.5-19.8			c-5-3.6-11-5.5-17.2-5.5c-7.9,0-15.4,3.1-20.9,8.7l-29.9,29.8c-10.2,10.2-11.6,26.3-3.2,38.1l20,28.1			c-5.5,10.5-9.9,21.4-13.3,32.7l-33.2,5.6c-14.3,2.4-24.7,14.7-24.7,29.2v42.1c0,14.5,10.4,26.8,24.7,29.2l34,5.8			c3.5,11.2,8.1,22.1,13.7,32.5l-19.7,27.4c-8.4,11.8-7.1,27.9,3.2,38.1l29.8,29.8c5.6,5.6,13,8.7,20.9,8.7c6.2,0,12.1-1.9,17.1-5.5			l28.1-20c10.1,5.3,20.7,9.6,31.6,13l5.6,33.6c2.4,14.3,14.7,24.7,29.2,24.7h42.2c14.5,0,26.8-10.4,29.2-24.7l5.7-33.6			c11.3-3.5,22.2-8,32.6-13.5l27.7,19.8c5,3.6,11,5.5,17.2,5.5l0,0c7.9,0,15.3-3.1,20.9-8.7l29.8-29.8c10.2-10.2,11.6-26.3,3.2-38.1			l-19.8-27.8c5.5-10.5,10.1-21.4,13.5-32.6l33.6-5.6c14.3-2.4,24.7-14.7,24.7-29.2v-42.1			C478.9,203.801,468.5,191.501,454.2,189.101z M451.9,260.401c0,1.3-0.9,2.4-2.2,2.6l-42,7c-5.3,0.9-9.5,4.8-10.8,9.9			c-3.8,14.7-9.6,28.8-17.4,41.9c-2.7,4.6-2.5,10.3,0.6,14.7l24.7,34.8c0.7,1,0.6,2.5-0.3,3.4l-29.8,29.8c-0.7,0.7-1.4,0.8-1.9,0.8			c-0.6,0-1.1-0.2-1.5-0.5l-34.7-24.7c-4.3-3.1-10.1-3.3-14.7-0.6c-13.1,7.8-27.2,13.6-41.9,17.4c-5.2,1.3-9.1,5.6-9.9,10.8l-7.1,42			c-0.2,1.3-1.3,2.2-2.6,2.2h-42.1c-1.3,0-2.4-0.9-2.6-2.2l-7-42c-0.9-5.3-4.8-9.5-9.9-10.8c-14.3-3.7-28.1-9.4-41-16.8			c-2.1-1.2-4.5-1.8-6.8-1.8c-2.7,0-5.5,0.8-7.8,2.5l-35,24.9c-0.5,0.3-1,0.5-1.5,0.5c-0.4,0-1.2-0.1-1.9-0.8l-29.8-29.8			c-0.9-0.9-1-2.3-0.3-3.4l24.6-34.5c3.1-4.4,3.3-10.2,0.6-14.8c-7.8-13-13.8-27.1-17.6-41.8c-1.4-5.1-5.6-9-10.8-9.9l-42.3-7.2			c-1.3-0.2-2.2-1.3-2.2-2.6v-42.1c0-1.3,0.9-2.4,2.2-2.6l41.7-7c5.3-0.9,9.6-4.8,10.9-10c3.7-14.7,9.4-28.9,17.1-42			c2.7-4.6,2.4-10.3-0.7-14.6l-24.9-35c-0.7-1-0.6-2.5,0.3-3.4l29.8-29.8c0.7-0.7,1.4-0.8,1.9-0.8c0.6,0,1.1,0.2,1.5,0.5l34.5,24.6			c4.4,3.1,10.2,3.3,14.8,0.6c13-7.8,27.1-13.8,41.8-17.6c5.1-1.4,9-5.6,9.9-10.8l7.2-42.3c0.2-1.3,1.3-2.2,2.6-2.2h42.1			c1.3,0,2.4,0.9,2.6,2.2l7,41.7c0.9,5.3,4.8,9.6,10,10.9c15.1,3.8,29.5,9.7,42.9,17.6c4.6,2.7,10.3,2.5,14.7-0.6l34.5-24.8			c0.5-0.3,1-0.5,1.5-0.5c0.4,0,1.2,0.1,1.9,0.8l29.8,29.8c0.9,0.9,1,2.3,0.3,3.4l-24.7,34.7c-3.1,4.3-3.3,10.1-0.6,14.7			c7.8,13.1,13.6,27.2,17.4,41.9c1.3,5.2,5.6,9.1,10.8,9.9l42,7.1c1.3,0.2,2.2,1.3,2.2,2.6v42.1H451.9z");
      const s = document.createElementNS("http://www.w3.org/2000/svg", "path");
      s.setAttributeNS(null, "d", "M239.4,136.001c-57,0-103.3,46.3-103.3,103.3s46.3,103.3,103.3,103.3s103.3-46.3,103.3-103.3S296.4,136.001,239.4,136.001z M239.4,315.601c-42.1,0-76.3-34.2-76.3-76.3s34.2-76.3,76.3-76.3s76.3,34.2,76.3,76.3S281.5,315.601,239.4,315.601z"), e.appendChild(t), e.appendChild(s);
    }
    return this._settingsIcon;
  }
}
class aa {
  get rootElement() {
    return this._rootElement || (this._rootElement = document.createElement("button"), this._rootElement.type = "button", this._rootElement.classList.add("UiTool"), this._rootElement.id = "statsBtn", this._rootElement.appendChild(this.statsIcon), this._rootElement.appendChild(this.tooltipText)), this._rootElement;
  }
  get tooltipText() {
    return this._tooltipText || (this._tooltipText = document.createElement("span"), this._tooltipText.classList.add("tooltiptext"), this._tooltipText.innerHTML = "Information"), this._tooltipText;
  }
  get statsIcon() {
    if (!this._statsIcon) {
      this._statsIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg"), this._statsIcon.setAttributeNS(null, "id", "statsIcon"), this._statsIcon.setAttributeNS(null, "x", "0px"), this._statsIcon.setAttributeNS(null, "y", "0px"), this._statsIcon.setAttributeNS(null, "viewBox", "0 0 330 330");
      const e = document.createElementNS("http://www.w3.org/2000/svg", "g");
      e.classList.add("svgIcon"), this._statsIcon.appendChild(e);
      const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
      t.setAttributeNS(null, "d", "M165,0.008C74.019,0.008,0,74.024,0,164.999c0,90.977,74.019,164.992,165,164.992s165-74.015,165-164.992C330,74.024,255.981,0.008,165,0.008z M165,299.992c-74.439,0-135-60.557-135-134.992S90.561,30.008,165,30.008s135,60.557,135,134.991C300,239.436,239.439,299.992,165,299.992z");
      const s = document.createElementNS("http://www.w3.org/2000/svg", "path");
      s.setAttributeNS(null, "d", "M165,130.008c-8.284,0-15,6.716-15,15v99.983c0,8.284,6.716,15,15,15s15-6.716,15-15v-99.983C180,136.725,173.284,130.008,165,130.008z");
      const n = document.createElementNS("http://www.w3.org/2000/svg", "path");
      n.setAttributeNS(null, "d", "M165,70.011c-3.95,0-7.811,1.6-10.61,4.39c-2.79,2.79-4.39,6.66-4.39,10.61s1.6,7.81,4.39,10.61c2.79,2.79,6.66,4.39,10.61,4.39s7.81-1.6,10.609-4.39c2.79-2.8,4.391-6.66,4.391-10.61s-1.601-7.82-4.391-10.61C172.81,71.61,168.95,70.011,165,70.011z"), e.appendChild(t), e.appendChild(s), e.appendChild(n);
    }
    return this._statsIcon;
  }
}
class la {
  get rootElement() {
    return this._rootElement || (this._rootElement = document.createElement("button"), this._rootElement.type = "button", this._rootElement.classList.add("UiTool"), this._rootElement.id = "xrBtn", this._rootElement.appendChild(this.xrIcon), this._rootElement.appendChild(this.tooltipText)), this._rootElement;
  }
  get tooltipText() {
    return this._tooltipText || (this._tooltipText = document.createElement("span"), this._tooltipText.classList.add("tooltiptext"), this._tooltipText.innerHTML = "XR"), this._tooltipText;
  }
  get xrIcon() {
    if (!this._xrIcon) {
      this._xrIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg"), this._xrIcon.setAttributeNS(null, "id", "xrIcon"), this._xrIcon.setAttributeNS(null, "x", "0px"), this._xrIcon.setAttributeNS(null, "y", "0px"), this._xrIcon.setAttributeNS(null, "viewBox", "0 0 100 100");
      const e = document.createElementNS("http://www.w3.org/2000/svg", "g");
      e.classList.add("svgIcon"), this._xrIcon.appendChild(e);
      const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
      t.setAttributeNS(null, "d", "M29 41c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9zm0 14c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm42-14c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9zm0 14c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm12-31H17c-6.6 0-12 5.4-12 12v28c0 6.6 5.4 12 12 12h14.5c3.5 0 6.8-1.5 9-4.1l3.5-4c1.5-1.7 3.7-2.7 6-2.7s4.5 1 6 2.7l3.5 4c2.3 2.6 5.6 4.1 9 4.1H83c6.6 0 12-5.4 12-12V36c0-6.6-5.4-12-12-12zm8 40c0 4.4-3.6 8-8 8H68.5c-2.3 0-4.5-1-6-2.7l-3.5-4c-2.3-2.6-5.6-4.1-9-4.1-3.5 0-6.8 1.5-9 4.1l-3.5 4C36 71 33.8 72 31.5 72H17c-4.4 0-8-3.6-8-8V36c0-4.4 3.6-8 8-8h66c4.4 0 8 3.6 8 8v28z"), e.appendChild(t);
    }
    return this._xrIcon;
  }
}
function et(i) {
  return !i || !!i && i.isEnabled;
}
function Ie(i) {
  return i == null || i.creationMode === ce.CreateDefaultElement;
}
(function(i) {
  i[i.CreateDefaultElement = 0] = "CreateDefaultElement", i[i.UseCustomElement = 1] = "UseCustomElement", i[i.Disable = 2] = "Disable";
})(ce || (ce = {}));
class ca {
  constructor(e) {
    e && !Ie(e.statsButtonType) || (this.statsIcon = new aa()), e && !Ie(e.settingsButtonType) || (this.settingsIcon = new oa()), e && !Ie(e.fullscreenButtonType) || (this.fullscreenIcon = new ia()), e && !Ie(e.xrIconType) || (this.xrIcon = new la());
  }
  get rootElement() {
    return this._rootElement || (this._rootElement = document.createElement("div"), this._rootElement.id = "controls", this.fullscreenIcon && this._rootElement.appendChild(this.fullscreenIcon.rootElement), this.settingsIcon && this._rootElement.appendChild(this.settingsIcon.rootElement), this.statsIcon && this._rootElement.appendChild(this.statsIcon.rootElement), this.xrIcon && M.WebXRController.isSessionSupported("immersive-vr").then((e) => {
      e && this._rootElement.appendChild(this.xrIcon.rootElement);
    })), this._rootElement;
  }
}
class tt {
  constructor(e, t) {
    this._label = e, this._buttonText = t;
  }
  addOnClickListener(e) {
    this.button.addEventListener("click", e);
  }
  get button() {
    return this._button || (this._button = document.createElement("input"), this._button.type = "button", this._button.value = this._buttonText, this._button.classList.add("overlay-button"), this._button.classList.add("btn-flat")), this._button;
  }
  get rootElement() {
    if (!this._rootElement) {
      this._rootElement = document.createElement("div"), this._rootElement.classList.add("setting");
      const e = document.createElement("div");
      e.innerText = this._label, this._rootElement.appendChild(e);
      const t = document.createElement("label");
      t.classList.add("btn-overlay"), this._rootElement.appendChild(t), t.appendChild(this.button);
    }
    return this._rootElement;
  }
}
class da {
  constructor() {
    this._rootElement = null;
  }
  get rootElement() {
    if (!this._rootElement) {
      this._rootElement = document.createElement("div"), this._rootElement.id = "settings-panel", this._rootElement.classList.add("panel-wrap");
      const e = document.createElement("div");
      e.classList.add("panel"), this._rootElement.appendChild(e);
      const t = document.createElement("div");
      t.id = "settingsHeading", t.textContent = "Settings", e.appendChild(t), e.appendChild(this.settingsCloseButton), e.appendChild(this.settingsContentElement);
    }
    return this._rootElement;
  }
  get settingsContentElement() {
    return this._settingsContentElement || (this._settingsContentElement = document.createElement("div"), this._settingsContentElement.id = "settingsContent"), this._settingsContentElement;
  }
  get settingsCloseButton() {
    return this._settingsCloseButton || (this._settingsCloseButton = document.createElement("div"), this._settingsCloseButton.id = "settingsClose"), this._settingsCloseButton;
  }
  show() {
    this.rootElement.classList.contains("panel-wrap-visible") || this.rootElement.classList.add("panel-wrap-visible");
  }
  toggleVisibility() {
    this.rootElement.classList.toggle("panel-wrap-visible");
  }
  hide() {
    this.rootElement.classList.contains("panel-wrap-visible") && this.rootElement.classList.remove("panel-wrap-visible");
  }
}
class ha {
  get rootElement() {
    if (!this._rootElement) {
      this._rootElement = document.createElement("section"), this._rootElement.classList.add("settingsContainer");
      const e = document.createElement("div");
      e.id = "latencyTestHeader", e.classList.add("settings-text"), e.classList.add("settingsHeader"), this._rootElement.appendChild(e);
      const t = document.createElement("div");
      t.innerHTML = "Latency Test", e.appendChild(t), e.appendChild(this.latencyTestButton);
      const s = document.createElement("div");
      s.id = "latencyTestContainer", s.classList.add("d-none"), this._rootElement.appendChild(s), s.appendChild(this.latencyTestResultsElement);
    }
    return this._rootElement;
  }
  get latencyTestResultsElement() {
    return this._latencyTestResultsElement || (this._latencyTestResultsElement = document.createElement("div"), this._latencyTestResultsElement.id = "latencyStatsResults", this._latencyTestResultsElement.classList.add("StatsResult")), this._latencyTestResultsElement;
  }
  get latencyTestButton() {
    return this._latencyTestButton || (this._latencyTestButton = document.createElement("input"), this._latencyTestButton.type = "button", this._latencyTestButton.value = "Run Test", this._latencyTestButton.id = "btn-start-latency-test", this._latencyTestButton.classList.add("streamTools-button"), this._latencyTestButton.classList.add("btn-flat")), this._latencyTestButton;
  }
  handleTestResult(e) {
    M.Logger.Log(M.Logger.GetStackTrace(), e.toString(), 6);
    let t = "";
    t += "<div>Net latency RTT (ms): " + e.networkLatency + "</div>", t += "<div>UE Encode (ms): " + e.EncodeMs + "</div>", t += "<div>UE Capture (ms): " + e.CaptureToSendMs + "</div>", t += "<div>Browser send latency (ms): " + e.browserSendLatency + "</div>", t += e.frameDisplayDeltaTimeMs && e.browserReceiptTimeMs ? "<div>Browser receive latency (ms): " + e.frameDisplayDeltaTimeMs + "</div>" : "", t += "<div>Total latency (excluding browser) (ms): " + e.latencyExcludingDecode + "</div>", t += e.endToEndLatency ? "<div>Total latency (ms): " + e.endToEndLatency + "</div>" : "", this.latencyTestResultsElement.innerHTML = t;
  }
}
class ua {
  static formatBytes(e, t) {
    if (e === 0) return "0";
    const s = t < 0 ? 0 : t, n = Math.floor(Math.log(e) / Math.log(1024));
    return parseFloat((e / Math.pow(1024, n)).toFixed(s)) + " " + ["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"][n];
  }
}
class ga {
  get rootElement() {
    if (!this._rootElement) {
      this._rootElement = document.createElement("section"), this._rootElement.classList.add("settingsContainer");
      const e = document.createElement("div");
      e.id = "dataChannelLatencyTestHeader", e.classList.add("settings-text"), e.classList.add("settingsHeader"), this._rootElement.appendChild(e);
      const t = document.createElement("div");
      t.innerHTML = "Data Channel Latency Test", e.appendChild(t), e.appendChild(this.latencyTestButton);
      const s = document.createElement("div");
      s.id = "dataChannelLatencyTestContainer", s.classList.add("d-none"), this._rootElement.appendChild(s), s.appendChild(this.latencyTestResultsElement);
    }
    return this._rootElement;
  }
  get latencyTestResultsElement() {
    return this._latencyTestResultsElement || (this._latencyTestResultsElement = document.createElement("div"), this._latencyTestResultsElement.id = "dataChannelLatencyStatsResults", this._latencyTestResultsElement.classList.add("StatsResult")), this._latencyTestResultsElement;
  }
  get latencyTestButton() {
    return this._latencyTestButton || (this._latencyTestButton = document.createElement("input"), this._latencyTestButton.type = "button", this._latencyTestButton.value = "Run Test", this._latencyTestButton.id = "btn-start-data-channel-latency-test", this._latencyTestButton.classList.add("streamTools-button"), this._latencyTestButton.classList.add("btn-flat")), this._latencyTestButton;
  }
  handleTestResult(e) {
    if (M.Logger.Log(M.Logger.GetStackTrace(), e.toString(), 6), isNaN(e.dataChannelRtt)) return void (this.latencyTestResultsElement.innerHTML = "<div>Not supported</div>");
    let t = "";
    t += "<div>Data channel RTT (ms): " + e.dataChannelRtt + "</div>", e.playerToStreamerTime >= 0 && e.streamerToPlayerTime >= 0 && (t += "<div>Player to Streamer path (ms): " + e.playerToStreamerTime + "</div>", t += "<div>Streamer to Player path (ms): " + e.streamerToPlayerTime + "</div>"), this.latencyTestResultsElement.innerHTML = t;
    let s = document.createElement("input");
    s.type = "button", s.value = "Download", s.classList.add("streamTools-button"), s.classList.add("btn-flat"), s.onclick = () => {
      let n = new Blob([e.exportLatencyAsCSV()], { type: "text/plain" }), r = document.createElement("a"), o = URL.createObjectURL(n);
      r.href = o, r.download = "data_channel_latency_test_results.csv", document.body.appendChild(r), r.click(), setTimeout(function() {
        document.body.removeChild(r), window.URL.revokeObjectURL(o);
      }, 0);
    }, this.latencyTestResultsElement.appendChild(s);
  }
  handleTestStart() {
    this.latencyTestResultsElement.innerHTML = "<div>Test in progress</div>";
  }
}
class ma {
}
class pa {
  constructor() {
    this.statsMap = /* @__PURE__ */ new Map(), this.latencyTest = new ha(), this.dataChannelLatencyTest = new ga();
  }
  get rootElement() {
    if (!this._rootElement) {
      this._rootElement = document.createElement("div"), this._rootElement.id = "stats-panel", this._rootElement.classList.add("panel-wrap");
      const e = document.createElement("div");
      e.classList.add("panel"), this._rootElement.appendChild(e);
      const t = document.createElement("div");
      t.id = "statsHeading", t.textContent = "Information", e.appendChild(t), e.appendChild(this.statsCloseButton), e.appendChild(this.statsContentElement);
    }
    return this._rootElement;
  }
  get statsContentElement() {
    if (!this._statsContentElement) {
      this._statsContentElement = document.createElement("div"), this._statsContentElement.id = "statsContent";
      const e = document.createElement("div");
      e.id = "streamToolsStats", e.classList.add("container");
      const t = document.createElement("div");
      t.id = "ControlStats", t.classList.add("row");
      const s = document.createElement("section");
      s.id = "statistics", s.classList.add("settingsContainer");
      const n = document.createElement("div");
      n.id = "statisticsHeader", n.classList.add("settings-text"), n.classList.add("settingsHeader");
      const r = document.createElement("div");
      r.innerHTML = "Session Stats", this._statsContentElement.appendChild(e), e.appendChild(t), t.appendChild(s), s.appendChild(n), n.appendChild(r), s.appendChild(this.statisticsContainer), t.appendChild(this.latencyTest.rootElement), t.appendChild(this.dataChannelLatencyTest.rootElement);
    }
    return this._statsContentElement;
  }
  get statisticsContainer() {
    return this._statisticsContainer || (this._statisticsContainer = document.createElement("div"), this._statisticsContainer.id = "statisticsContainer", this._statisticsContainer.classList.add("d-none"), this._statisticsContainer.appendChild(this.statsResult)), this._statisticsContainer;
  }
  get statsResult() {
    return this._statsResult || (this._statsResult = document.createElement("div"), this._statsResult.id = "statisticsResult", this._statsResult.classList.add("StatsResult")), this._statsResult;
  }
  get statsCloseButton() {
    return this._statsCloseButton || (this._statsCloseButton = document.createElement("div"), this._statsCloseButton.id = "statsClose"), this._statsCloseButton;
  }
  onDisconnect() {
    this.latencyTest.latencyTestButton.onclick = () => {
    }, this.dataChannelLatencyTest.latencyTestButton.onclick = () => {
    };
  }
  onVideoInitialized(e) {
    this.latencyTest.latencyTestButton.onclick = () => {
      e.requestLatencyTest();
    }, this.dataChannelLatencyTest.latencyTestButton.onclick = () => {
      e.requestDataChannelLatencyTest({ duration: 1e3, rps: 10, requestSize: 200, responseSize: 200 }) && this.dataChannelLatencyTest.handleTestStart();
    };
  }
  configure(e) {
    e.DisableLatencyTest && (this.latencyTest.latencyTestButton.disabled = !0, this.latencyTest.latencyTestButton.title = "Disabled by -PixelStreamingDisableLatencyTester=true", this.dataChannelLatencyTest.latencyTestButton.disabled = !0, this.dataChannelLatencyTest.latencyTestButton.title = "Disabled by -PixelStreamingDisableLatencyTester=true", M.Logger.Info(M.Logger.GetStackTrace(), "-PixelStreamingDisableLatencyTester=true, requesting latency report from the the browser to UE is disabled."));
  }
  show() {
    this.rootElement.classList.contains("panel-wrap-visible") || this.rootElement.classList.add("panel-wrap-visible");
  }
  toggleVisibility() {
    this.rootElement.classList.toggle("panel-wrap-visible");
  }
  hide() {
    this.rootElement.classList.contains("panel-wrap-visible") && this.rootElement.classList.remove("panel-wrap-visible");
  }
  handlePlayerCount(e) {
    this.addOrUpdateStat("PlayerCountStat", "Players", e.toString());
  }
  handleStats(e) {
    var t, s, n, r, o;
    const a = new Intl.NumberFormat(window.navigator.language, { maximumFractionDigits: 0 }), d = ua.formatBytes(e.inboundVideoStats.bytesReceived, 2);
    this.addOrUpdateStat("InboundDataStat", "Received", d);
    const h = Object.prototype.hasOwnProperty.call(e.inboundVideoStats, "packetsLost") ? a.format(e.inboundVideoStats.packetsLost) : "Chrome only";
    this.addOrUpdateStat("PacketsLostStat", "Packets Lost", h), e.inboundVideoStats.bitrate && this.addOrUpdateStat("VideoBitrateStat", "Video Bitrate (kbps)", e.inboundVideoStats.bitrate.toString()), e.inboundAudioStats.bitrate && this.addOrUpdateStat("AudioBitrateStat", "Audio Bitrate (kbps)", e.inboundAudioStats.bitrate.toString());
    const u = Object.prototype.hasOwnProperty.call(e.inboundVideoStats, "frameWidth") && e.inboundVideoStats.frameWidth && Object.prototype.hasOwnProperty.call(e.inboundVideoStats, "frameHeight") && e.inboundVideoStats.frameHeight ? e.inboundVideoStats.frameWidth + "x" + e.inboundVideoStats.frameHeight : "Chrome only";
    this.addOrUpdateStat("VideoResStat", "Video resolution", u);
    const S = Object.prototype.hasOwnProperty.call(e.inboundVideoStats, "framesDecoded") ? a.format(e.inboundVideoStats.framesDecoded) : "Chrome only";
    this.addOrUpdateStat("FramesDecodedStat", "Frames Decoded", S), e.inboundVideoStats.framesPerSecond && this.addOrUpdateStat("FramerateStat", "Framerate", e.inboundVideoStats.framesPerSecond.toString()), this.addOrUpdateStat("FramesDroppedStat", "Frames dropped", (t = e.inboundVideoStats.framesDropped) === null || t === void 0 ? void 0 : t.toString()), e.inboundVideoStats.codecId && this.addOrUpdateStat("VideoCodecStat", "Video codec", (n = (s = e.codecs.get(e.inboundVideoStats.codecId)) === null || s === void 0 ? void 0 : s.split(" ")[0]) !== null && n !== void 0 ? n : ""), e.inboundAudioStats.codecId && this.addOrUpdateStat("AudioCodecStat", "Audio codec", (o = (r = e.codecs.get(e.inboundAudioStats.codecId)) === null || r === void 0 ? void 0 : r.split(" ")[0]) !== null && o !== void 0 ? o : "");
    const p = Object.prototype.hasOwnProperty.call(e.candidatePair, "currentRoundTripTime") && e.isNumber(e.candidatePair.currentRoundTripTime) ? a.format(1e3 * e.candidatePair.currentRoundTripTime) : "Can't calculate";
    this.addOrUpdateStat("RTTStat", "Net RTT (ms)", p), this.addOrUpdateStat("DurationStat", "Duration", e.sessionStats.runTime), this.addOrUpdateStat("ControlsInputStat", "Controls stream input", e.sessionStats.controlsStreamInput), this.addOrUpdateStat("QPStat", "Video quantization parameter", e.sessionStats.videoEncoderAvgQP.toString()), M.Logger.Log(M.Logger.GetStackTrace(), `--------- Stats ---------
 ${e}
------------------------`, 6);
  }
  addOrUpdateStat(e, t, s) {
    const n = `${t}: ${s}`;
    if (this.statsMap.has(e)) {
      const r = this.statsMap.get(e);
      r !== void 0 && (r.element.innerHTML = n);
    } else {
      const r = new ma();
      r.id = e, r.stat = s, r.title = t, r.element = document.createElement("div"), r.element.innerHTML = n, this.statsResult.appendChild(r.element), this.statsMap.set(e, r);
    }
  }
}
class va {
  constructor() {
    this.videoEncoderAvgQP = -1, this.statsText = "", this.color = "", this.orangeQP = 26, this.redQP = 35;
  }
  get rootElement() {
    return this._rootElement || (this._rootElement = document.createElement("div"), this._rootElement.id = "connection", this._rootElement.classList.add("UiTool"), this._rootElement.appendChild(this.qualityStatus), this._rootElement.appendChild(this.qualityText), this.updateQpTooltip(-1)), this._rootElement;
  }
  get qualityText() {
    return this._qualityText || (this._qualityText = document.createElement("span"), this._qualityText.id = "qualityText", this._qualityText.classList.add("tooltiptext")), this._qualityText;
  }
  get qualityStatus() {
    return this._qualityStatus || (this._qualityStatus = document.createElementNS("http://www.w3.org/2000/svg", "svg"), this._qualityStatus.setAttributeNS(null, "id", "connectionStrength"), this._qualityStatus.setAttributeNS(null, "x", "0px"), this._qualityStatus.setAttributeNS(null, "y", "0px"), this._qualityStatus.setAttributeNS(null, "viewBox", "0 0 494.45 494.45"), this.qualityStatus.appendChild(this.dot), this.qualityStatus.appendChild(this.middle), this.qualityStatus.appendChild(this.outer), this.qualityStatus.appendChild(this.inner)), this._qualityStatus;
  }
  get dot() {
    return this._dot || (this._dot = document.createElementNS("http://www.w3.org/2000/svg", "circle"), this._dot.setAttributeNS(null, "id", "dot"), this._dot.setAttributeNS(null, "cx", "247.125"), this._dot.setAttributeNS(null, "cy", "398.925"), this._dot.setAttributeNS(null, "r", "35.3")), this._dot;
  }
  get outer() {
    return this._outer || (this._outer = document.createElementNS("http://www.w3.org/2000/svg", "path"), this._outer.setAttributeNS(null, "id", "outer"), this._outer.setAttributeNS(null, "d", "M467.925,204.625c-6.8,0-13.5-2.6-18.7-7.8c-111.5-111.4-292.7-111.4-404.1,0c-10.3,10.3-27.1,10.3-37.4,0s-10.3-27.1,0-37.4c64-64,149-99.2,239.5-99.2s175.5,35.2,239.5,99.2c10.3,10.3,10.3,27.1,0,37.4C481.425,202.025,474.625,204.625,467.925,204.625z")), this._outer;
  }
  get middle() {
    return this._middle || (this._middle = document.createElementNS("http://www.w3.org/2000/svg", "path"), this._middle.setAttributeNS(null, "id", "middle"), this._middle.setAttributeNS(null, "d", "M395.225,277.325c-6.8,0-13.5-2.6-18.7-7.8c-71.4-71.3-187.4-71.3-258.8,0c-10.3,10.3-27.1,10.3-37.4,0s-10.3-27.1,0-37.4c92-92,241.6-92,333.6,0c10.3,10.3,10.3,27.1,0,37.4C408.725,274.725,401.925,277.325,395.225,277.325z")), this._middle;
  }
  get inner() {
    return this._inner || (this._inner = document.createElementNS("http://www.w3.org/2000/svg", "path"), this._inner.setAttributeNS(null, "id", "inner"), this._inner.setAttributeNS(null, "d", "M323.625,348.825c-6.8,0-13.5-2.6-18.7-7.8c-15.4-15.4-36-23.9-57.8-23.9s-42.4,8.5-57.8,23.9c-10.3,10.3-27.1,10.3-37.4,0c-10.3-10.3-10.3-27.1,0-37.4c25.4-25.4,59.2-39.4,95.2-39.4s69.8,14,95.2,39.5c10.3,10.3,10.3,27.1,0,37.4C337.225,346.225,330.425,348.825,323.625,348.825z")), this._inner;
  }
  blinkVideoQualityStatus(e) {
    let t = e, s = 1;
    const n = setInterval(() => {
      s -= 0.1, this.qualityText.style.opacity = String(Math.abs(2 * (s - 0.5))), s <= 0.1 && (--t == 0 ? clearInterval(n) : s = 1);
    }, 100 / e);
  }
  updateQpTooltip(e) {
    this.videoEncoderAvgQP = e, e > this.redQP ? (this.color = "red", this.blinkVideoQualityStatus(2), this.statsText = `<div style="color: ${this.color}">Poor encoding quality</div>`, this.outer.setAttributeNS(null, "fill", "#3c3b40"), this.middle.setAttributeNS(null, "fill", "#3c3b40"), this.inner.setAttributeNS(null, "fill", this.color), this.dot.setAttributeNS(null, "fill", this.color)) : e > this.orangeQP ? (this.color = "orange", this.blinkVideoQualityStatus(1), this.statsText = `<div style="color: ${this.color}">Blocky encoding quality</div>`, this.outer.setAttributeNS(null, "fill", "#3c3b40"), this.middle.setAttributeNS(null, "fill", this.color), this.inner.setAttributeNS(null, "fill", this.color), this.dot.setAttributeNS(null, "fill", this.color)) : e <= 0 ? (this.color = "#b0b0b0", this.outer.setAttributeNS(null, "fill", "#3c3b40"), this.middle.setAttributeNS(null, "fill", "#3c3b40"), this.inner.setAttributeNS(null, "fill", "#3c3b40"), this.dot.setAttributeNS(null, "fill", "#3c3b40"), this.statsText = `<div style="color: ${this.color}">Not connected</div>`) : (this.color = "lime", this.qualityStatus.style.opacity = "1", this.statsText = `<div style="color: ${this.color}">Clear encoding quality</div>`, this.outer.setAttributeNS(null, "fill", this.color), this.middle.setAttributeNS(null, "fill", this.color), this.inner.setAttributeNS(null, "fill", this.color), this.dot.setAttributeNS(null, "fill", this.color)), this.qualityText.innerHTML = this.statsText;
  }
}
class Le {
  constructor(e) {
    this._setting = e;
  }
  get setting() {
    return this._setting;
  }
  get rootElement() {
    return this._rootElement || (this._rootElement = document.createElement("div")), this._rootElement;
  }
}
class Tt extends Le {
  constructor(e) {
    super(e), this.label = e.label, this.flag = e.flag;
  }
  get setting() {
    return this._setting;
  }
  get settingsTextElem() {
    return this._settingsTextElem || (this._settingsTextElem = document.createElement("div"), this._settingsTextElem.innerText = this.setting._label, this._settingsTextElem.title = this.setting.description), this._settingsTextElem;
  }
  get checkbox() {
    return this._checkbox || (this._checkbox = document.createElement("input"), this._checkbox.type = "checkbox"), this._checkbox;
  }
  get rootElement() {
    if (!this._rootElement) {
      this._rootElement = document.createElement("div"), this._rootElement.id = this.setting.id, this._rootElement.classList.add("setting"), this._rootElement.appendChild(this.settingsTextElem);
      const e = document.createElement("label");
      e.classList.add("tgl-switch"), this._rootElement.appendChild(e), this.checkbox.title = this.setting.description, this.checkbox.classList.add("tgl"), this.checkbox.classList.add("tgl-flat");
      const t = document.createElement("div");
      t.classList.add("tgl-slider"), e.appendChild(this.checkbox), e.appendChild(t), this.checkbox.addEventListener("change", () => {
        this.setting.flag !== this.checkbox.checked && (this.setting.flag = this.checkbox.checked, this.setting.updateURLParams());
      });
    }
    return this._rootElement;
  }
  set flag(e) {
    this.checkbox.checked = e;
  }
  get flag() {
    return this.checkbox.checked;
  }
  set label(e) {
    this.settingsTextElem.innerText = e;
  }
  get label() {
    return this.settingsTextElem.innerText;
  }
}
class Zn extends Le {
  constructor(e) {
    super(e), this.label = this.setting.label, this.number = this.setting.number;
  }
  get setting() {
    return this._setting;
  }
  get settingsTextElem() {
    return this._settingsTextElem || (this._settingsTextElem = document.createElement("label"), this._settingsTextElem.innerText = this.setting.label, this._settingsTextElem.title = this.setting.description), this._settingsTextElem;
  }
  get spinner() {
    return this._spinner || (this._spinner = document.createElement("input"), this._spinner.type = "number", this._spinner.min = this.setting.min.toString(), this._spinner.max = this.setting.max.toString(), this._spinner.value = this.setting.number.toString(), this._spinner.title = this.setting.description, this._spinner.classList.add("form-control")), this._spinner;
  }
  get rootElement() {
    return this._rootElement || (this._rootElement = document.createElement("div"), this._rootElement.classList.add("setting"), this._rootElement.classList.add("form-group"), this._rootElement.appendChild(this.settingsTextElem), this._rootElement.appendChild(this.spinner), this.spinner.onchange = (e) => {
      const t = e.target, s = Number.parseInt(t.value);
      Number.isNaN(s) ? (M.Logger.Warning(M.Logger.GetStackTrace(), `Could not parse value change into a valid number - value was ${t.value}, resetting value to ${this.setting.min}`), this.setting.number !== this.setting.min && (this.setting.number = this.setting.min)) : this.setting.number !== s && (this.setting.number = s, this.setting.updateURLParams());
    }), this._rootElement;
  }
  set number(e) {
    this.spinner.value = this.setting.clamp(e).toString();
  }
  get number() {
    return +this.spinner.value;
  }
  set label(e) {
    this.settingsTextElem.innerText = e;
  }
  get label() {
    return this.settingsTextElem.innerText;
  }
}
class er extends Le {
  constructor(e) {
    super(e), this.label = this.setting.label, this.text = this.setting.text;
  }
  get setting() {
    return this._setting;
  }
  get settingsTextElem() {
    return this._settingsTextElem || (this._settingsTextElem = document.createElement("div"), this._settingsTextElem.innerText = this.setting.label, this._settingsTextElem.title = this.setting.description), this._settingsTextElem;
  }
  get textbox() {
    return this._textbox || (this._textbox = document.createElement("input"), this._textbox.classList.add("form-control"), this._textbox.type = "textbox"), this._textbox;
  }
  get rootElement() {
    if (!this._rootElement) {
      this._rootElement = document.createElement("div"), this._rootElement.id = this.setting.id, this._rootElement.classList.add("setting"), this._rootElement.appendChild(this.settingsTextElem);
      const e = document.createElement("label");
      this._rootElement.appendChild(e), this.textbox.title = this.setting.description, e.appendChild(this.textbox), this.textbox.addEventListener("input", () => {
        this.setting.text !== this.textbox.value && (this.setting.text = this.textbox.value, this.setting.updateURLParams());
      });
    }
    return this._rootElement;
  }
  set text(e) {
    this.textbox.value = e;
  }
  get text() {
    return this.textbox.value;
  }
  set label(e) {
    this.settingsTextElem.innerText = e;
  }
  get label() {
    return this.settingsTextElem.innerText;
  }
}
class tr extends Le {
  constructor(e) {
    super(e), this.label = this.setting.label, this.options = this.setting.options, this.selected = this.setting.selected;
  }
  get setting() {
    return this._setting;
  }
  get selector() {
    return this._selector || (this._selector = document.createElement("select"), this._selector.classList.add("form-control"), this._selector.classList.add("settings-option")), this._selector;
  }
  get settingsTextElem() {
    return this._settingsTextElem || (this._settingsTextElem = document.createElement("div"), this._settingsTextElem.innerText = this.setting.label, this._settingsTextElem.title = this.setting.description), this._settingsTextElem;
  }
  set label(e) {
    this.settingsTextElem.innerText = e;
  }
  get label() {
    return this.settingsTextElem.innerText;
  }
  get rootElement() {
    if (!this._rootElement) {
      this._rootElement = document.createElement("div"), this._rootElement.id = this.setting.id, this._rootElement.classList.add("setting"), this._rootElement.classList.add("form-group"), this._rootElement.appendChild(this.settingsTextElem);
      const e = document.createElement("label");
      this._rootElement.appendChild(e), this.selector.title = this.setting.description, e.appendChild(this.selector), this.selector.onchange = () => {
        this.setting.selected !== this.selector.value && (this.setting.selected = this.selector.value, this.setting.updateURLParams());
      };
    }
    return this._rootElement;
  }
  set options(e) {
    for (let t = this.selector.options.length - 1; t >= 0; t--) this.selector.remove(t);
    e.forEach((t) => {
      const s = document.createElement("option");
      s.value = t, s.innerHTML = t, this.selector.appendChild(s);
    });
  }
  get options() {
    return [...this.selector.options].map((e) => e.value);
  }
  set selected(e) {
    const t = this.options.filter((s) => s.indexOf(e) !== -1);
    t.length && (this.selector.value = t[0]);
  }
  get selected() {
    return this.selector.value;
  }
  disable() {
    this.selector.disabled = !0;
  }
  enable() {
    this.selector.disabled = !1;
  }
}
const le = "LightMode";
class sr {
  constructor(e) {
    this.customFlags = /* @__PURE__ */ new Map(), this.flagsUi = /* @__PURE__ */ new Map(), this.numericParametersUi = /* @__PURE__ */ new Map(), this.textParametersUi = /* @__PURE__ */ new Map(), this.optionParametersUi = /* @__PURE__ */ new Map(), this.createCustomUISettings(e.useUrlParams), this.registerSettingsUIComponents(e);
  }
  createCustomUISettings(e) {
    this.customFlags.set(le, new M.SettingFlag(le, "Color Scheme: Dark Mode", "Page styling will be either light or dark", !1, e, (t, s) => {
      s.label = `Color Scheme: ${t ? "Light" : "Dark"} Mode`;
    }));
  }
  registerSettingsUIComponents(e) {
    for (const t of e.getFlags()) this.flagsUi.set(t.id, new Tt(t));
    for (const t of Array.from(this.customFlags.values())) this.flagsUi.set(t.id, new Tt(t));
    for (const t of e.getTextSettings()) this.textParametersUi.set(t.id, new er(t));
    for (const t of e.getNumericSettings()) this.numericParametersUi.set(t.id, new Zn(t));
    for (const t of e.getOptionSettings()) this.optionParametersUi.set(t.id, new tr(t));
  }
  buildSectionWithHeading(e, t) {
    const s = document.createElement("section");
    s.classList.add("settingsContainer");
    const n = document.createElement("div");
    return n.classList.add("settingsHeader"), n.classList.add("settings-text"), n.textContent = t, s.appendChild(n), e.appendChild(s), s;
  }
  populateSettingsElement(e) {
    const t = this.buildSectionWithHeading(e, "Pixel Streaming");
    this.addSettingText(t, this.textParametersUi.get(M.TextParameters.SignallingServerUrl)), this.addSettingOption(t, this.optionParametersUi.get(M.OptionParameters.StreamerId)), this.addSettingFlag(t, this.flagsUi.get(M.Flags.AutoConnect)), this.addSettingFlag(t, this.flagsUi.get(M.Flags.AutoPlayVideo)), this.addSettingFlag(t, this.flagsUi.get(M.Flags.BrowserSendOffer)), this.addSettingFlag(t, this.flagsUi.get(M.Flags.UseMic)), this.addSettingFlag(t, this.flagsUi.get(M.Flags.StartVideoMuted)), this.addSettingFlag(t, this.flagsUi.get(M.Flags.IsQualityController)), this.addSettingFlag(t, this.flagsUi.get(M.Flags.ForceMonoAudio)), this.addSettingFlag(t, this.flagsUi.get(M.Flags.ForceTURN)), this.addSettingFlag(t, this.flagsUi.get(M.Flags.SuppressBrowserKeys)), this.addSettingFlag(t, this.flagsUi.get(M.Flags.AFKDetection)), this.addSettingFlag(t, this.flagsUi.get(M.Flags.WaitForStreamer)), this.addSettingNumeric(t, this.numericParametersUi.get(M.NumericParameters.AFKTimeoutSecs)), this.addSettingNumeric(t, this.numericParametersUi.get(M.NumericParameters.MaxReconnectAttempts)), this.addSettingNumeric(t, this.numericParametersUi.get(M.NumericParameters.StreamerAutoJoinInterval));
    const s = this.buildSectionWithHeading(e, "UI");
    this.addSettingFlag(s, this.flagsUi.get(M.Flags.MatchViewportResolution)), this.addSettingFlag(s, this.flagsUi.get(M.Flags.HoveringMouseMode)), this.addSettingFlag(s, this.flagsUi.get(le));
    const n = this.buildSectionWithHeading(e, "Input");
    this.addSettingFlag(n, this.flagsUi.get(M.Flags.KeyboardInput)), this.addSettingFlag(n, this.flagsUi.get(M.Flags.MouseInput)), this.addSettingFlag(n, this.flagsUi.get(M.Flags.TouchInput)), this.addSettingFlag(n, this.flagsUi.get(M.Flags.GamepadInput)), this.addSettingFlag(n, this.flagsUi.get(M.Flags.XRControllerInput));
    const r = this.buildSectionWithHeading(e, "Encoder");
    this.addSettingNumeric(r, this.numericParametersUi.get(M.NumericParameters.MinQP)), this.addSettingNumeric(r, this.numericParametersUi.get(M.NumericParameters.MaxQP));
    const o = this.optionParametersUi.get(M.OptionParameters.PreferredCodec);
    this.addSettingOption(r, this.optionParametersUi.get(M.OptionParameters.PreferredCodec)), o && [...o.selector.options].map((d) => d.value).includes("Only available on Chrome") && o.disable();
    const a = this.buildSectionWithHeading(e, "WebRTC");
    this.addSettingNumeric(a, this.numericParametersUi.get(M.NumericParameters.WebRTCFPS)), this.addSettingNumeric(a, this.numericParametersUi.get(M.NumericParameters.WebRTCMinBitrate)), this.addSettingNumeric(a, this.numericParametersUi.get(M.NumericParameters.WebRTCMaxBitrate));
  }
  addSettingText(e, t) {
    t && (e.appendChild(t.rootElement), this.textParametersUi.set(t.setting.id, t));
  }
  addSettingFlag(e, t) {
    t && (e.appendChild(t.rootElement), this.flagsUi.set(t.setting.id, t));
  }
  addSettingNumeric(e, t) {
    t && (e.appendChild(t.rootElement), this.numericParametersUi.set(t.setting.id, t));
  }
  addSettingOption(e, t) {
    t && (e.appendChild(t.rootElement), this.optionParametersUi.set(t.setting.id, t));
  }
  onSettingsChanged({ data: { id: e, target: t, type: s } }) {
    if (s === "flag") {
      const n = e, r = t, o = this.flagsUi.get(n);
      o && (o.flag !== r.flag && (o.flag = r.flag), o.label !== r.label && (o.label = r.label));
    } else if (s === "number") {
      const n = e, r = t, o = this.numericParametersUi.get(n);
      o && (o.number !== r.number && (o.number = r.number), o.label !== r.label && (o.label = r.label));
    } else if (s === "text") {
      const n = e, r = t, o = this.textParametersUi.get(n);
      o && (o.text !== r.text && (o.text = r.text), o.label !== r.label && (o.label = r.label));
    } else if (s === "option") {
      const n = e, r = t, o = this.optionParametersUi.get(n);
      if (o) {
        const a = o.options, d = r.options;
        a.length === d.length && a.every((h) => d.includes(h)) || (o.options = r.options), o.selected !== r.selected && (o.selected = r.selected), o.label !== r.label && (o.label = r.label);
      }
    }
  }
  addCustomFlagOnSettingChangedListener(e, t) {
    this.customFlags.has(e) && (this.customFlags.get(e).onChange = t);
  }
  setCustomFlagLabel(e, t) {
    this.customFlags.has(e) ? (this.customFlags.get(e).label = t, this.flagsUi.get(e).label = t) : M.Logger.Warning(M.Logger.GetStackTrace(), `Cannot set label for flag called ${e} - it does not exist in the Config.flags map.`);
  }
  isCustomFlagEnabled(e) {
    return this.customFlags.get(e).flag;
  }
}
class fa {
  constructor(e) {
    this._options = e, this.stream = e.stream, this.onColorModeChanged = e.onColorModeChanged, this.configUI = new sr(this.stream.config), this.createOverlays(et(e.settingsPanelConfig)), et(e.statsPanelConfig) && (this.statsPanel = new pa(), this.uiFeaturesElement.appendChild(this.statsPanel.rootElement)), et(e.settingsPanelConfig) && (this.settingsPanel = new da(), this.uiFeaturesElement.appendChild(this.settingsPanel.rootElement), this.configureSettings()), e.videoQpIndicatorConfig && e.videoQpIndicatorConfig.disableIndicator || (this.videoQpIndicator = new va()), this.createButtons(), this.registerCallbacks(), this.showConnectOrAutoConnectOverlays(), this.setColorMode(this.configUI.isCustomFlagEnabled(le));
  }
  createOverlays(e = !0) {
    e && (this.disconnectOverlay = new Te(this.stream.videoElementParent), this.connectOverlay = new Ee(this.stream.videoElementParent)), this.playOverlay = new be(this.stream.videoElementParent), e && (this.infoOverlay = new we(this.stream.videoElementParent)), this.errorOverlay = new Me(this.stream.videoElementParent), this.afkOverlay = new Re(this.stream.videoElementParent), e && (this.disconnectOverlay.onAction(() => this.stream.reconnect()), this.connectOverlay.onAction(() => this.stream.connect())), this.playOverlay.onAction(() => this.stream.play());
  }
  createButtons() {
    const e = { statsButtonType: this._options.statsPanelConfig ? this._options.statsPanelConfig.visibilityButtonConfig : void 0, settingsButtonType: this._options.settingsPanelConfig ? this._options.settingsPanelConfig.visibilityButtonConfig : void 0, fullscreenButtonType: this._options.fullScreenControlsConfig, xrIconType: this._options.xrControlsConfig }, t = new ca(e);
    this.uiFeaturesElement.appendChild(t.rootElement);
    const s = this._options.fullScreenControlsConfig && this._options.fullScreenControlsConfig.creationMode === ce.UseCustomElement ? new ra(this._options.fullScreenControlsConfig.customElement) : t.fullscreenIcon;
    s && (s.fullscreenElement = /iPad|iPhone|iPod/.test(navigator.userAgent) ? this.stream.videoElementParent.getElementsByTagName("video")[0] : this.rootElement);
    const n = t.settingsIcon ? t.settingsIcon.rootElement : this._options.settingsPanelConfig.visibilityButtonConfig.customElement;
    n && (n.onclick = () => this.settingsClicked()), this.settingsPanel && (this.settingsPanel.settingsCloseButton.onclick = () => this.settingsClicked());
    const r = t.xrIcon ? t.xrIcon.rootElement : this._options.xrControlsConfig.creationMode === ce.UseCustomElement ? this._options.xrControlsConfig.customElement : void 0;
    r && (r.onclick = () => this.stream.toggleXR());
    const o = t.statsIcon ? t.statsIcon.rootElement : this._options.statsPanelConfig.visibilityButtonConfig.customElement;
    if (o && (o.onclick = () => this.statsClicked()), this.statsPanel && (this.statsPanel.statsCloseButton.onclick = () => this.statsClicked()), this.settingsPanel) {
      const a = new tt("Show FPS", "Toggle");
      a.addOnClickListener(() => {
        this.stream.requestShowFps();
      });
      const d = new tt("Restart Stream", "Restart");
      d.addOnClickListener(() => {
        this.stream.reconnect();
      });
      const h = new tt("Request keyframe", "Request");
      h.addOnClickListener(() => {
        this.stream.requestIframe();
      });
      const u = this.configUI.buildSectionWithHeading(this.settingsPanel.settingsContentElement, "Commands");
      u.appendChild(a.rootElement), u.appendChild(h.rootElement), u.appendChild(d.rootElement);
    }
  }
  configureSettings() {
    this.configUI.populateSettingsElement(this.settingsPanel.settingsContentElement), this.configUI.addCustomFlagOnSettingChangedListener(le, (e) => {
      this.configUI.setCustomFlagLabel(le, `Color Scheme: ${e ? "Light" : "Dark"} Mode`), this.setColorMode(e);
    });
  }
  registerCallbacks() {
    this.stream.addEventListener("afkWarningActivate", ({ data: { countDown: e, dismissAfk: t } }) => this.showAfkOverlay(e, t)), this.stream.addEventListener("afkWarningUpdate", ({ data: { countDown: e } }) => this.afkOverlay.updateCountdown(e)), this.stream.addEventListener("afkWarningDeactivate", () => this.afkOverlay.hide()), this.stream.addEventListener("afkTimedOut", () => this.afkOverlay.hide()), this.stream.addEventListener("videoEncoderAvgQP", ({ data: { avgQP: e } }) => this.onVideoEncoderAvgQP(e)), this.stream.addEventListener("webRtcSdp", () => this.onWebRtcSdp()), this.stream.addEventListener("webRtcAutoConnect", () => this.onWebRtcAutoConnect()), this.stream.addEventListener("webRtcConnecting", () => this.onWebRtcConnecting()), this.stream.addEventListener("webRtcConnected", () => this.onWebRtcConnected()), this.stream.addEventListener("webRtcFailed", () => this.onWebRtcFailed()), this.stream.addEventListener("webRtcDisconnected", ({ data: { eventString: e, allowClickToReconnect: t } }) => this.onDisconnect(e, t)), this.stream.addEventListener("videoInitialized", () => this.onVideoInitialized()), this.stream.addEventListener("streamLoading", () => this.onStreamLoading()), this.stream.addEventListener("playStreamError", ({ data: { message: e } }) => this.onPlayStreamError(e)), this.stream.addEventListener("playStream", () => this.onPlayStream()), this.stream.addEventListener("playStreamRejected", ({ data: { reason: e } }) => this.onPlayStreamRejected(e)), this.stream.addEventListener("loadFreezeFrame", ({ data: { shouldShowPlayOverlay: e } }) => this.onLoadFreezeFrame(e)), this.stream.addEventListener("statsReceived", ({ data: { aggregatedStats: e } }) => this.onStatsReceived(e)), this.stream.addEventListener("latencyTestResult", ({ data: { latencyTimings: e } }) => this.onLatencyTestResults(e)), this.stream.addEventListener("dataChannelLatencyTestResult", ({ data: { result: e } }) => this.onDataChannelLatencyTestResults(e)), this.stream.addEventListener("streamerListMessage", ({ data: { messageStreamerList: e, autoSelectedStreamerId: t, wantedStreamerId: s } }) => this.handleStreamerListMessage(e, t, s)), this.stream.addEventListener("settingsChanged", (e) => this.configUI.onSettingsChanged(e)), this.stream.addEventListener("playerCount", ({ data: { count: e } }) => this.onPlayerCount(e));
  }
  get rootElement() {
    return this._rootElement || (this._rootElement = document.createElement("div"), this._rootElement.id = "playerUI", this._rootElement.classList.add("noselect"), this._rootElement.appendChild(this.stream.videoElementParent), this._rootElement.appendChild(this.uiFeaturesElement)), this._rootElement;
  }
  get uiFeaturesElement() {
    return this._uiFeatureElement || (this._uiFeatureElement = document.createElement("div"), this._uiFeatureElement.id = "uiFeatures"), this._uiFeatureElement;
  }
  showDisconnectOverlay(e) {
    this.hideCurrentOverlay(), this.updateDisconnectOverlay(e), this.disconnectOverlay.show(), this.currentOverlay = this.disconnectOverlay;
  }
  updateDisconnectOverlay(e) {
    this.disconnectOverlay.update(e);
  }
  onDisconnectionAction() {
    this.disconnectOverlay.activate();
  }
  hideCurrentOverlay() {
    this.currentOverlay != null && (this.currentOverlay.hide(), this.currentOverlay = null);
  }
  showConnectOverlay() {
    this.hideCurrentOverlay(), this.connectOverlay.show(), this.currentOverlay = this.connectOverlay;
  }
  showPlayOverlay() {
    this.hideCurrentOverlay(), this.playOverlay.show(), this.currentOverlay = this.playOverlay;
  }
  showTextOverlay(e) {
    this.hideCurrentOverlay(), this.infoOverlay.update(e), this.infoOverlay.show(), this.currentOverlay = this.infoOverlay;
  }
  showErrorOverlay(e) {
    this.hideCurrentOverlay(), this.errorOverlay.update(e), this.errorOverlay.show(), this.currentOverlay = this.errorOverlay;
  }
  settingsClicked() {
    var e;
    (e = this.statsPanel) === null || e === void 0 || e.hide(), this.settingsPanel.toggleVisibility();
  }
  statsClicked() {
    var e;
    (e = this.settingsPanel) === null || e === void 0 || e.hide(), this.statsPanel.toggleVisibility();
  }
  onConnectAction() {
    this.connectOverlay.activate();
  }
  onPlayAction() {
    this.playOverlay.activate();
  }
  showAfkOverlay(e, t) {
    this.hideCurrentOverlay(), this.afkOverlay.updateCountdown(e), this.afkOverlay.onAction(() => t()), this.afkOverlay.show(), this.currentOverlay = this.afkOverlay;
  }
  showConnectOrAutoConnectOverlays() {
    this.stream.config.isFlagEnabled(M.Flags.AutoConnect) || this.showConnectOverlay();
  }
  onWebRtcAutoConnect() {
    this.showTextOverlay("Auto Connecting Now");
  }
  onWebRtcSdp() {
    this.showTextOverlay("WebRTC Connection Negotiated");
  }
  onStreamLoading() {
    const e = document.createElement("span");
    e.className = "visually-hidden", e.innerHTML = "Loading...";
    const t = document.createElement("div");
    t.id = "loading-spinner", t.className = "spinner-border ms-2", t.setAttribute("role", "status"), t.appendChild(e), this.showTextOverlay("Loading Stream " + t.outerHTML);
  }
  onDisconnect(e, t) {
    var s;
    const n = "Disconnected" + (e ? `: ${e}` : "");
    t ? this.showDisconnectOverlay(`${n} Click To Restart.`) : this.showErrorOverlay(n), (s = this.statsPanel) === null || s === void 0 || s.onDisconnect();
  }
  onWebRtcConnecting() {
    this.showTextOverlay("Starting connection to server, please wait");
  }
  onWebRtcConnected() {
    this.showTextOverlay("WebRTC connected, waiting for video");
  }
  onWebRtcFailed() {
    this.showErrorOverlay("Unable to setup video");
  }
  onLoadFreezeFrame(e) {
    e === !0 && (M.Logger.Log(M.Logger.GetStackTrace(), "showing play overlay"), this.showPlayOverlay());
  }
  onPlayStream() {
    this.hideCurrentOverlay();
  }
  onPlayStreamError(e) {
    this.showErrorOverlay(e);
  }
  onPlayStreamRejected(e) {
    this.showPlayOverlay();
  }
  onVideoInitialized() {
    var e;
    this.stream.config.isFlagEnabled(M.Flags.AutoPlayVideo) || this.showPlayOverlay(), (e = this.statsPanel) === null || e === void 0 || e.onVideoInitialized(this.stream);
  }
  onVideoEncoderAvgQP(e) {
    this.videoQpIndicator && this.videoQpIndicator.updateQpTooltip(e);
  }
  onInitialSettings(e) {
    var t;
    e.PixelStreamingSettings && ((t = this.statsPanel) === null || t === void 0 || t.configure(e.PixelStreamingSettings));
  }
  onStatsReceived(e) {
    var t;
    (t = this.statsPanel) === null || t === void 0 || t.handleStats(e);
  }
  onLatencyTestResults(e) {
    var t;
    (t = this.statsPanel) === null || t === void 0 || t.latencyTest.handleTestResult(e);
  }
  onDataChannelLatencyTestResults(e) {
    var t;
    (t = this.statsPanel) === null || t === void 0 || t.dataChannelLatencyTest.handleTestResult(e);
  }
  onPlayerCount(e) {
    var t;
    (t = this.statsPanel) === null || t === void 0 || t.handlePlayerCount(e);
  }
  handleStreamerListMessage(e, t, s) {
    const n = this.stream.config.isFlagEnabled(M.Flags.WaitForStreamer), r = this.stream.isReconnecting();
    let o = null, a = !0;
    t || (n && s ? r ? (o = `Waiting for ${s} to become available.`, a = !1) : (o = `Gave up waiting for ${s} to become available. Click to try again`, e.ids.length > 0 && (o += " or select a streamer from the settings menu."), a = !0) : e.ids.length == 0 ? r ? (o = "Waiting for a streamer to become available.", a = !1) : (o = "No streamers available. Click to try again.", a = !0) : (o = "Multiple streamers available. Select one from the settings menu.", a = !1), a ? this.showDisconnectOverlay(o) : this.showTextOverlay(o));
  }
  setColorMode(e) {
    this.onColorModeChanged && this.onColorModeChanged(e);
  }
}
const Jt = ((i) => {
  var e = {};
  return re.d(e, i), e;
})({ default: () => Ko }), Sa = ((i) => {
  var e = {};
  return re.d(e, i), e;
})({ default: () => Zo }), Ca = ((i) => {
  var e = {};
  return re.d(e, i), e;
})({ default: () => na });
class ya {
  constructor(e) {
    this.defaultLightModePalette = { "--color0": "#e2e0dd80", "--color1": "#FFFFFF", "--color2": "#000000", "--color3": "#0585fe", "--color4": "#35b350", "--color5": "#ffab00", "--color6": "#e1e2dd", "--color7": "#c3c4bf" }, this.defaultDarkModePalette = { "--color0": "#1D1F2280", "--color1": "#000000", "--color2": "#FFFFFF", "--color3": "#0585fe", "--color4": "#35b350", "--color5": "#ffab00", "--color6": "#1e1d22", "--color7": "#3c3b40" }, this.defaultStyles = { ":root": { "--color0": "#1D1F2280", "--color1": "#000000", "--color2": "#FFFFFF", "--color3": "#0585fe", "--color4": "#35b350", "--color5": "#ffab00", "--color6": "#1e1d22", "--color7": "#3c3b40", "--color8": "#41008c", "--color9": "#3e0070", "--color10": "#2e0052", "--color11": "rgba(65,0,139,1)" }, ".noselect": { userSelect: "none" }, "#playerUI": { width: "100%", height: "100%", position: "relative" }, "#videoElementParent": { width: "100%", height: "100%", position: "absolute", backgroundColor: "var(--color1)" }, "#uiFeatures": { width: "100%", height: "100%", zIndex: "30", position: "relative", color: "var(--color2)", pointerEvents: "none", overflow: "hidden" }, ".UiTool .tooltiptext": { visibility: "hidden", width: "auto", color: "var(--color2)", textAlign: "center", borderRadius: "15px", padding: "0px 10px", fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", letterSpacing: "0.75px", position: "absolute", top: "0", transform: "translateY(25%)", left: "125%", zIndex: "20" }, ".UiTool:hover .tooltiptext": { visibility: "visible", backgroundColor: "var(--color7)" }, "#connection .tooltiptext": { top: "125%", transform: "translateX(-25%)", left: "0", zIndex: "20", padding: "5px 10px" }, "#connection": { position: "absolute", top: "8%", right: "5%", fontFamily: "'Michroma', sans-serif", height: "3rem", width: "3rem", pointerEvents: "all" }, "#settings-panel .tooltiptext": { display: "block", top: "125%", transform: "translateX(-50%)", left: "0", zIndex: "20", padding: "5px 10px", border: "3px solid var(--color3)", width: "max-content", fallbacks: [{ width: "max-content" }, { border: "3px solid var(--color3)" }, { padding: "5px 10px" }, { zIndex: "20" }, { left: "0" }, { transform: "translateX(-50%)" }, { top: "125%" }, { display: "block" }] }, "#controls": { position: "absolute", top: "3%", left: "2%", fontFamily: "'Michroma', sans-serif", pointerEvents: "all", display: "block" }, "#controls>*": { marginBottom: "0.5rem", borderRadius: "50%", display: "block", height: "2rem", lineHeight: "1.75rem", padding: "0.5rem" }, "#controls #additionalinfo": { textAlign: "center", fontFamily: "'Montserrat', sans-serif" }, "#fullscreen-btn": { padding: "0.6rem !important" }, "#minimizeIcon": { display: "none" }, "#settingsBtn, #statsBtn": { cursor: "pointer" }, "#uiFeatures button": { backgroundColor: "var(--color7)", border: "1px solid var(--color7)", color: "var(--color2)", position: "relative", width: "3rem", height: "3rem", padding: "0.5rem", textAlign: "center" }, "#uiFeatures button:hover": { backgroundColor: "var(--color3)", border: "3px solid var(--color3)", transition: "0.25s ease", paddingLeft: "0.55rem", paddingTop: "0.55rem" }, "#uiFeatures button:active": { border: "3px solid var(--color3)", backgroundColor: "var(--color7)", paddingLeft: "0.55rem", paddingTop: "0.55rem" }, ".btn-flat": { backgroundColor: "transparent", color: "var(--color2)", fontFamily: "'Montserrat'", fontWeight: "bold", border: "3px solid var(--color3)", borderRadius: "1rem", fontSize: "0.75rem", paddingLeft: "0.5rem", paddingRight: "0.5rem", cursor: "pointer", textAlign: "center" }, ".btn-flat:hover": { backgroundColor: "var(--color3)", transition: "ease 0.3s" }, ".btn-flat:disabled": { background: "var(--color7)", borderColor: "var(--color3)", color: "var(--color3)", cursor: "default" }, ".btn-flat:active": { backgroundColor: "transparent" }, ".btn-flat:focus": { outline: "none" }, "#uiFeatures img": { width: "100%", height: "100%" }, ".panel-wrap": { position: "absolute", top: "0", bottom: "0", right: "0", height: "100%", minWidth: "20vw", maxWidth: "90vw", transform: "translateX(100%)", transition: ".3s ease-out", pointerEvents: "all", backdropFilter: "blur(10px)", "-webkit-backdrop-filter": "blur(10px)", overflowY: "auto", overflowX: "hidden", backgroundColor: "var(--color0)" }, ".panel-wrap-visible": { transform: "translateX(0%)" }, ".panel": { overflowY: "auto", padding: "1em" }, "#settingsHeading, #statsHeading": { display: "inline-block", fontSize: "2em", marginBlockStart: "0.67em", marginBlockEnd: "0.67em", marginInlineStart: "0px", marginInlineEnd: "0px", position: "relative", padding: "0 0 0 2rem" }, "#settingsClose, #statsClose": { margin: "0.5rem", paddingTop: "0.5rem", paddingBottom: "0.5rem", paddingRight: "0.5rem", fontSize: "2em", float: "right" }, "#settingsClose:after, #statsClose:after": { paddingLeft: "0.5rem", display: "inline-block", content: '"\\00d7"' }, "#settingsClose:hover, #statsClose:hover": { color: "var(--color3)", transition: "ease 0.3s" }, "#settingsContent, #statsContent": { marginLeft: "2rem", marginRight: "2rem" }, ".setting": { display: "flex", flexDirection: "row", justifyContent: "space-between", padding: "0.15rem 10px 0.15rem 10px" }, ".settings-text": { color: "var(--color2)", verticalAlign: "middle", fontWeight: "normal" }, ".settings-option": { width: "100%", textOverflow: "ellipsis", whiteSpace: "nowrap" }, "#connectOverlay, #playOverlay, #infoOverlay, #errorOverlay, #afkOverlay, #disconnectOverlay": { zIndex: "30", position: "absolute", color: "var(--color2)", fontSize: "1.8em", width: "100%", height: "100%", backgroundColor: "var(--color1)", alignItems: "center", justifyContent: "center", textTransform: "uppercase" }, ".clickableState": { alignItems: "center", justifyContent: "center", display: "flex", cursor: "pointer" }, ".textDisplayState": { display: "flex" }, ".hiddenState": { display: "none" }, "#playButton, #connectButton": { display: "inline-block", height: "auto", zIndex: "30" }, "img#playButton": { maxWidth: "241px", width: "10%" }, "#uiInteraction": { position: "fixed" }, "#UIInteractionButtonBoundary": { padding: "2px" }, "#UIInteractionButton": { cursor: "pointer" }, "#hiddenInput": { position: "absolute", left: "-10%", width: "0px", opacity: "0" }, "#editTextButton": { position: "absolute", height: "40px", width: "40px" }, ".btn-overlay": { verticalAlign: "middle", display: "inline-block" }, ".tgl-switch": { verticalAlign: "middle", display: "inline-block" }, ".tgl-switch .tgl": { display: "none" }, ".tgl, .tgl:after, .tgl:before, .tgl *, .tgl *:after, .tgl *:before, .tgl+.tgl-slider": { "-webkit-box-sizing": "border-box", boxSizing: "border-box" }, ".tgl::-moz-selection, .tgl:after::-moz-selection, .tgl:before::-moz-selection, .tgl *::-moz-selection, .tgl *:after::-moz-selection, .tgl *:before::-moz-selection, .tgl+.tgl-slider::-moz-selection": { background: "none" }, ".tgl::selection, .tgl:after::selection, .tgl:before::selection, .tgl *::selection, .tgl *:after::selection, .tgl *:before::selection, .tgl+.tgl-slider::selection": { background: "none" }, ".tgl-slider": {}, ".tgl+.tgl-slider": { outline: "0", display: "block", width: "40px", height: "18px", position: "relative", cursor: "pointer", userSelect: "none" }, ".tgl+.tgl-slider:after, .tgl+.tgl-slider:before": { position: "relative", display: "block", content: '""', width: "50%", height: "100%" }, ".tgl+.tgl-slider:after": { left: "0" }, ".tgl+.tgl-slider:before": { display: "none" }, ".tgl-flat+.tgl-slider": { padding: "2px", "-webkit-transition": "all .2s ease", transition: "all .2s ease", background: "var(--color6)", border: "3px solid var(--color7)", borderRadius: "2em" }, ".tgl-flat+.tgl-slider:after": { "-webkit-transition": "all .2s ease", transition: "all .2s ease", background: "var(--color7)", content: '""', borderRadius: "1em" }, ".tgl-flat:checked+.tgl-slider": { border: "3px solid var(--color3)" }, ".tgl-flat:checked+.tgl-slider:after": { left: "50%", background: "var(--color3)" }, ".btn-apply": { display: "block !important", marginLeft: "auto", marginRight: "auto", width: "40%" }, ".form-control": { backgroundColor: "var(--color7)", border: "2px solid var(--color7)", borderRadius: "4px", color: "var(--color2)", textAlign: "right", fontFamily: "inherit" }, ".form-control:hover": { borderColor: "var(--color7)" }, ".form-group": { paddingTop: "4px", display: "grid", gridTemplateColumns: "80% 20%", rowGap: "4px", paddingRight: "10px", paddingLeft: "10px" }, ".form-group label": { verticalAlign: "middle", fontWeight: "normal" }, ".settingsContainer": { display: "flex", flexDirection: "column", borderBottom: "1px solid var(--color7)", paddingTop: "10px", paddingBottom: "10px" }, ".settingsContainer> :first-child": { marginTop: "4px", marginBottom: "4px", fontWeight: "bold", justifyContent: "space-between", display: "flex", flexDirection: "row", alignItems: "baseline" }, ".collapse": { paddingLeft: "5%" }, "#streamTools": { borderBottomRightRadius: "5px", borderBottomLeftRadius: "5px", userSelect: "none", position: "absolute", top: "0", right: "2%", zIndex: "100", border: "4px solid var(--colour8)", borderTopWidth: "0px" }, ".settingsHeader": { fontStyle: "italic" }, "#streamToolsHeader": { display: "flex", flexDirection: "row", justifyContent: "space-between", borderBottom: "1px solid var(--colour8)", backgroundColor: "var(--color7)" }, ".streamTools": { backgroundColor: "var(--color2)", fontFamily: "var(--buttonFont)", fontWeight: "lighter", color: "var(--color7)" }, ".streamTools-shown>#streamToolsSettings, .streamTools-shown>#streamToolsStats": { display: "block" }, "#streamToolsToggle": { width: "100%" }, "#qualityStatus": { fontSize: "37px", paddingRight: "4px" }, ".svgIcon": { fill: "var(--color2)" } };
    const { customStyles: t, lightModePalette: s, darkModePalette: n, jssInsertionPoint: r } = e ?? {}, o = { plugins: [(0, Sa.default)(), (0, Ca.default)()], insertionPoint: r };
    Jt.default.setup(o), this.customStyles = t, this.lightModePalette = s ?? this.defaultLightModePalette, this.darkModePalette = n ?? this.defaultDarkModePalette;
  }
  applyStyleSheet() {
    Jt.default.createStyleSheet({ "@global": Object.assign(Object.assign({}, this.defaultStyles), this.customStyles) }).attach();
  }
  applyPalette(e) {
    const t = document.querySelector(":root");
    t.style.setProperty("--color0", e["--color0"]), t.style.setProperty("--color1", e["--color1"]), t.style.setProperty("--color2", e["--color2"]), t.style.setProperty("--color3", e["--color3"]), t.style.setProperty("--color4", e["--color4"]), t.style.setProperty("--color5", e["--color5"]), t.style.setProperty("--color6", e["--color6"]), t.style.setProperty("--color7", e["--color7"]);
  }
  setColorMode(e) {
    e ? this.applyPalette(this.lightModePalette) : this.applyPalette(this.darkModePalette);
  }
}
U.nR;
U.JI;
var Ea = U.lg;
U.j9;
U.Xk;
U.Tv;
U.hv;
U.vo;
U.ME;
var Ta = U.eF;
U.zF;
U.Y3;
U.JH;
U.C4;
U.U$;
U.II;
U.Yi;
var De = U.ny;
function Ge(i, e, t, s) {
  return (n) => {
    const r = typeof n == "object" && n !== null ? JSON.stringify(n) : n ? n.toString() : "";
    i.sendMessage({
      Type: "RPC",
      Data: {
        ID: e,
        Type: "Action",
        TargetType: t,
        Function: s,
        Params: r
      }
    });
  };
}
function Ne(i, e, t, s) {
  return (n) => {
    const r = Date.now(), o = new Promise((d) => {
      i.waitResponseUntil("Response", (h) => {
        const u = JSON.parse(h.Params);
        return u.Context && JSON.parse(u.Context).Timestamp.toString() === r.toString() ? (d(u.Data), !0) : !1;
      });
    }), a = typeof n == "object" && n !== null ? JSON.stringify(n) : n ? n.toString() : "";
    return i.sendMessage({
      Type: "RPC",
      Data: {
        ID: e,
        Type: "Query",
        TargetType: t,
        Function: s,
        Params: a,
        Context: JSON.stringify({
          Timestamp: r
        })
      }
    }), o;
  };
}
function me(i, e) {
  let t = e, s = new Set(e.ActionList), n = new Set(e.QueryList), r = new Set(e.StaticActionList), o = new Set(e.StaticQueryList), a = {
    viewer: i
  };
  return new Proxy(a, {
    get(d, h) {
      if (d.viewer)
        return s.has(h) ? Ge(d.viewer, t.PathName, "ObjectPath", h) : n.has(h) ? Ne(d.viewer, t.PathName, "ObjectPath", h) : r.has(h) ? Ge(d.viewer, t.PathName, "ClassPath", h) : o.has(h) ? Ne(d.viewer, t.PathName, "ClassPath", h) : void 0;
    }
  });
}
function ba(i, e) {
  return new Promise((t) => {
    i.waitResponseUntil("NotifyComponent", (s) => {
      const n = JSON.parse(s.Params), o = JSON.parse(n.Context).Timestamp.toString() === e.toString();
      if (o) {
        let a = n, d = new Set(n.ActionList), h = new Set(n.QueryList), u = new Set(n.StaticActionList), S = new Set(n.StaticQueryList), p = {
          viewer: i
        }, E = () => {
          a = null, d = null, h = null, u = null, S = null, p.viewer = null;
        };
        i.waitResponseUntil(
          "ComponentDestroyed",
          ({ Params: T }) => a ? T && T.toString() === a.GUID.toString() ? (E(), E = null, !0) : !1 : !0
        ), t(
          new Proxy(p, {
            get(T, R) {
              if (T.viewer)
                switch (R) {
                  case "dispose":
                    return () => {
                      const P = a.GUID;
                      T.viewer && T.viewer.sendMessage({
                        Type: "Command",
                        Data: {
                          Command: "RemoveComponent",
                          Params: JSON.stringify({
                            ID: P,
                            Timestamp: Date.now()
                          })
                        }
                      }), E(), E = null;
                    };
                  default:
                    return d.has(R) ? Ge(T.viewer, a.GUID, "ID", R) : h.has(R) ? Ne(T.viewer, a.GUID, "ID", R) : u.has(R) ? Ge(T.viewer, a.ClassName, "ClassName", R) : S.has(R) ? Ne(T.viewer, a.ClassName, "ClassName", R) : void 0;
                }
            }
          })
        ), console.log("Component Created:", n);
      }
      return o;
    });
  });
}
function wa(i, e) {
  return ({ location: t, options: s = {} }) => {
    const n = Date.now();
    return i.sendMessage({
      Type: "Command",
      Data: {
        Command: "CreateComponent",
        Params: JSON.stringify({
          ClassName: e,
          Location: t,
          Options: JSON.stringify(s),
          Timestamp: n.toString()
        })
      }
    }), ba(i, n);
  };
}
class Rd extends Xr {
  constructor({
    InputControllers: e = [],
    onInitialize: t = () => {
    },
    useUrlParams: s = !0,
    hideDefaultUI: n = !1,
    signalServer: r = "",
    matchViewResolution: o = !1
  }) {
    super();
    const a = new Ta();
    a.applyStyleSheet();
    const d = new jr({
      useUrlParams: s
    });
    s || (d.setTextSetting(Zr.SignallingServerUrl, r), d.setOptionSettingValue(Jr.StreamerId, "DefaultStreamer")), d.setFlagEnabled(ie.MatchViewportResolution, o), d.setFlagEnabled(ie.AutoConnect, !0), d.setFlagEnabled(ie.FakeMouseWithTouches, !0), d.setFlagEnabled(ie.HoveringMouseMode, !0), d.setFlagEnabled(ie.SuppressBrowserKeys, !1), d.setFlagEnabled(ie.KeyboardInput, !0);
    const h = new Yr(d), u = n ? {
      visibilityButtonConfig: {
        creationMode: De.Disable
      }
    } : {
      isEnabled: !0,
      visibilityButtonConfig: {
        creationMode: De.CreateDefaultElement
      }
    }, S = new Ea({
      stream: h,
      onColorModeChanged: (p) => a.setColorMode(p),
      settingsPanelConfig: u,
      statsPanelConfig: {
        visibilityButtonConfig: {
          creationMode: De.Disable
        }
      },
      fullScreenControlsConfig: {
        visibilityButtonConfig: {
          creationMode: De.Disable
        }
      },
      videoQpIndicatorConfig: {
        disableIndicator: !0
      }
    });
    this.stream = h, this.application = S, this.responseCallbackMap = /* @__PURE__ */ new Map(), this.toStreamerMessagesProvider = null, this.stateCallbackList = [], this.cache = {
      state: null,
      timestamp: -1 / 0
    }, h.addResponseEventListener("handle_responses", (p) => {
      let E = p;
      try {
        E = JSON.parse(p);
      } catch {
        E = p;
      }
      for (const T of this.getOrCreateResponseCallbackSet(
        E.EventName
      ))
        T(E);
    }), h.addEventListener("videoInitialized", () => {
      h.injectInputControllers([
        (p) => {
          this.toStreamerMessagesProvider = p[0], this.waitResponseOnce("SyncState", (E) => {
            this.cache.state = JSON.parse(E.Params), this.cache.timestamp = Date.now(), console.log("Initial state:", this.cache.state), this.addResponseEventListener(
              "Response",
              (x) => {
                console.log(
                  "Received response:",
                  x
                );
              }
            );
            const T = {};
            for (const x of this.cache.state.EditableUClassKeys) {
              const k = `create${x}`;
              T[k] = wa(this, x);
            }
            let R = new Set(
              this.cacheMetaInfoMapKeys
            ), P = this.cacheMetaInfoClassNameSet;
            this.addResponseEventListener(
              "SyncState",
              (x) => {
                const k = JSON.parse(x.Params);
                this.cache.state = k, this.cache.timestamp = Date.now(), R = new Set(
                  this.cacheMetaInfoMapKeys
                ), P = this.cacheMetaInfoClassNameSet;
                for (const K of this.stateCallbackList)
                  K(
                    this.cache.state,
                    this.cache.timestamp
                  );
              }
            );
            const V = new Proxy(
              {},
              {
                get: (x, k) => {
                  if (R.has(k))
                    return this.getCacheStaticUObjectProxy(
                      k
                    );
                  if (P.has(k)) {
                    const K = [];
                    for (const Fe of this.cacheMetaInfoMapKeys) {
                      const We = this.cacheMetaInfoMap.get(
                        Fe
                      );
                      console.log(
                        "CacheMetaInfo:",
                        We
                      ), We.ClassName === k && K.push(
                        me(
                          this,
                          We
                        )
                      );
                    }
                    return K;
                  } else k === "toArray" && this.cacheMetaInfoMapKeys.map(
                    (K) => {
                      const Fe = this.cacheMetaInfoMap.get(
                        K
                      );
                      return [
                        Fe.ClassName,
                        me(
                          this,
                          Fe
                        )
                      ];
                    }
                  );
                },
                has: (x, k) => R.has(k) || P.has(
                  k
                ) || k === "toArray",
                ownKeys: (x) => [
                  ...Array.from(R),
                  ...Array.from(
                    P
                  ),
                  "toArray"
                ],
                getOwnPropertyDescriptor: (x, k) => {
                  if (R.has(k) || P.has(
                    k
                  ) || k === "toArray")
                    return {
                      enumerable: !0,
                      configurable: !0
                    };
                }
              }
            );
            setTimeout(() => {
              t({
                factory: T,
                static: V
              });
            }, 100);
          });
        },
        ...e.map((p) => (E) => new p(E, this.rootElement))
      ]);
    });
  }
  get rootElement() {
    return this.application.rootElement;
  }
  get state() {
    return Date.now() - this.cache.timestamp > 30 ? new Promise((t) => {
      this.stateCallbackList.push((s, n) => {
        t(JSON.parse(JSON.stringify(s)));
      });
    }) : Promise.resolve(JSON.parse(JSON.stringify(this.cache.state)));
  }
  get cacheMetaInfo() {
    return this.cache.state && this.cache.state.MetaInfo ? JSON.parse(JSON.stringify(this.cache.state.MetaInfo)) : null;
  }
  get cacheMetaInfoMap() {
    return new Map(
      this.cacheMetaInfo.map((e) => [e.PathName, JSON.parse(JSON.stringify(e))])
    );
  }
  get cacheMetaInfoMapKeys() {
    return Array.from(this.cacheMetaInfoMap.keys());
  }
  get cacheMetaInfoClassNameSet() {
    return new Set(this.cacheMetaInfo.map((e) => e.ClassName));
  }
  get metaInfo() {
    return new Promise((e) => {
      this.state.then((t) => {
        const s = t.MetaInfo ? JSON.parse(JSON.stringify(t.MetaInfo)) : null;
        e(s);
      });
    });
  }
  get metaInfoMap() {
    return new Promise((e) => {
      this.metaInfo.then((t) => {
        t && Array.isArray(t) ? e(
          new Map(
            t.map((s) => [
              s.PathName,
              JSON.parse(JSON.stringify(s))
            ])
          )
        ) : e(/* @__PURE__ */ new Map());
      });
    });
  }
  get metaInfoMapKeys() {
    return new Promise((e) => {
      this.metaInfoMap.then((t) => {
        e(Array.from(t.keys()));
      });
    });
  }
  getStreamHandler(e = "") {
    return this.stream.toStreamerHandlers.get(e);
  }
  getOrCreateResponseCallbackSet(e) {
    return this.responseCallbackMap.has(e) || this.responseCallbackMap.set(e, /* @__PURE__ */ new Set()), this.responseCallbackMap.get(e);
  }
  addResponseEventListener(e, t) {
    const s = this.getOrCreateResponseCallbackSet(e);
    return s.add(t), () => {
      s.delete(t);
    };
  }
  waitResponseOnce(e, t) {
    let s = this.addResponseEventListener(e, (n) => {
      t(n), s(), s = null;
    });
  }
  waitResponseUntil(e, t) {
    let s = this.addResponseEventListener(e, (n) => {
      t(n) && (s(), s = null);
    });
  }
  sendMessage(e) {
    this.stream.emitUIInteraction(e);
  }
  onResponse(e) {
    this.stream.addResponseEventListener("handle_responses", e);
  }
  dispose() {
    this.rootElement && this.rootElement.parentNode && this.rootElement.parentNode.removeChild(this.rootElement), this.stream.disconnect();
  }
  getCacheStaticUObjectProxy(e) {
    const t = this.cacheMetaInfoMap.get(e);
    return console.log("MetaInfo:", t, e), t ? me(this, t) : null;
  }
  getStaticUObjectProxy(e) {
    return new Promise((t) => {
      this.metaInfoMap.then((s) => {
        const n = s.get(e);
        t(n ? me(this, n) : null);
      });
    });
  }
  // getStaticUObjectProxiesOfTag(tag) {
  // 	return new Promise((resolve) => {
  // 		this.metaInfoMap.then(metaInfoMap => {
  // 			const metaInfoList = []
  // 			for (const [,metaInfo] of metaInfoMap) {
  // 				if (metaInfo && metaInfo.TagList && Array.isArray(metaInfo.TagList)) {
  // 					const tagSet = new Set(metaInfo.TagList)
  // 					if (tagSet.has(tag)) {
  // 						metaInfoList.push(metaInfo)
  // 					}
  // 				}
  // 			}
  // 			resolve(metaInfoList.map(metaInfo => {
  // 				return remoteGetStaticUObjectProxy(this, metaInfo)
  // 			}))
  // 		})
  // 	})
  // }
  getStaticUObjectProxyOfClassName(e) {
    return new Promise((t) => {
      this.metaInfoMap.then((s) => {
        const n = [];
        for (const [, r] of s)
          r && r.ClassName === e && n.push(r);
        t(
          n.map((r) => this.getStaticUObjectProxyFromMetaInfo(r))
        );
      });
    });
  }
  getStaticUObjectProxyFromMetaInfo(e) {
    return me(this, e);
  }
  setResolution(e, t) {
    this.stream.emitCommand({
      Resolution: { Width: e, Height: t }
    });
  }
}
export {
  Rd as Viewer
};
