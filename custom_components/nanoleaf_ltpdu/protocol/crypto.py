"""
libECL session crypto — X25519 ECDH + SHA1 KDF + shared-counter AES-128-CTR. The BLE
pairing path (ble_provision.py) uses this exact same crypto, byte-for-byte.

  shared_secret = X25519(our_private, their_public)
  key = SHA1(b"AES-NL-OPENAPI-KEY" + shared_secret)[:16]
  iv  = SHA1(b"AES-NL-OPENAPI-IV"  + shared_secret)[:16]

Then AES-128-CTR with `iv` as the initial big-endian 128-bit counter, consumed as ONE
continuous keystream shared by BOTH directions of a session (not independent
per-direction streams).
"""
from __future__ import annotations

import hashlib
from dataclasses import dataclass, field

from Cryptodome.Cipher import AES
from cryptography.hazmat.primitives.asymmetric.x25519 import X25519PrivateKey, X25519PublicKey
from cryptography.hazmat.primitives import serialization

LABEL_KEY = b"AES-NL-OPENAPI-KEY"
LABEL_IV = b"AES-NL-OPENAPI-IV"


def generate_keypair() -> tuple[bytes, bytes]:
    """Returns (private_raw_32, public_raw_32)."""
    priv = X25519PrivateKey.generate()
    priv_raw = priv.private_bytes(
        encoding=serialization.Encoding.Raw,
        format=serialization.PrivateFormat.Raw,
        encryption_algorithm=serialization.NoEncryption(),
    )
    pub_raw = priv.public_key().public_bytes(
        encoding=serialization.Encoding.Raw,
        format=serialization.PublicFormat.Raw,
    )
    return priv_raw, pub_raw


def scalar_mult(our_private_raw: bytes, their_public_raw: bytes) -> bytes:
    priv = X25519PrivateKey.from_private_bytes(our_private_raw)
    pub = X25519PublicKey.from_public_bytes(their_public_raw)
    return priv.exchange(pub)


def derive_session_keys(shared_secret: bytes) -> tuple[bytes, bytes]:
    """Returns (key, iv), each 16 bytes."""
    key = hashlib.sha1(LABEL_KEY + shared_secret).digest()[:16]
    iv = hashlib.sha1(LABEL_IV + shared_secret).digest()[:16]
    return key, iv


class RollingCtrStream:
    """
    A single continuous AES-CTR keystream, consumed byte-by-byte, regenerating a new
    16-byte block (counter+1, big-endian 128-bit increment) on wraparound. Call
    `apply(data)` to encrypt-or-decrypt (XOR is symmetric) — every call advances the
    shared position, matching ECL_AesCtrProcess's behavior exactly.
    """

    def __init__(self, key: bytes, iv: bytes):
        assert len(key) == 16 and len(iv) == 16
        self._cipher = AES.new(key, AES.MODE_ECB)
        self._counter = int.from_bytes(iv, "big")
        self._block = self._cipher.encrypt(iv)
        self._index = 0  # 0-15, position within self._block

    def _next_byte(self) -> int:
        if self._index == 16:
            self._counter = (self._counter + 1) % (1 << 128)
            self._block = self._cipher.encrypt(self._counter.to_bytes(16, "big"))
            self._index = 0
        b = self._block[self._index]
        self._index += 1
        return b

    def apply(self, data: bytes) -> bytes:
        return bytes(b ^ self._next_byte() for b in data)


@dataclass
class SessionCrypto:
    """One direction-agnostic AES-CTR session (one shared stream for a full session)."""

    key: bytes
    iv: bytes
    stream: RollingCtrStream = field(init=False)

    def __post_init__(self):
        self.stream = RollingCtrStream(self.key, self.iv)

    def process(self, data: bytes) -> bytes:
        return self.stream.apply(data)
